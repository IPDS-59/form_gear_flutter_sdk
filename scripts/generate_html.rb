#!/usr/bin/env ruby
# frozen_string_literal: true

require 'json'
require 'fileutils'
require 'optparse'

# Script to generate the actual HTML file that would be rendered by FormGear WebView
# This allows us to inspect the final HTML output with all injected JavaScript
class FormGearHtmlGenerator
  def initialize
    @form_engine_id = '1' # Default to FormGear v1
    @template_id = 'demo' # Default template
    @example_assets_path = File.expand_path('../example/assets', __dir__)
    @output_dir = File.expand_path('../generated_html', __dir__)
  end

  def run(args = [])
    parse_arguments(args)

    puts "🔄 Generating HTML for FormGear v#{@form_engine_id} with template: #{@template_id}"

    begin
      ensure_output_directory
      html_content = load_base_html
      html_content = inject_css(html_content)
      html_content = inject_jquery(html_content)
      html_content = inject_form_engine_js(html_content)

      form_data = load_form_data
      bridge_script = generate_bridge_script(form_data)
      html_content = inject_bridge_script(html_content, bridge_script)

      output_files = write_output_files(html_content, bridge_script, form_data)
      print_completion_summary(output_files, form_data)

    rescue StandardError => e
      puts "❌ Error generating HTML: #{e.message}"
      puts "Stack trace: #{e.backtrace.join("\n")}"
      exit(1)
    end
  end

  private

  def parse_arguments(args)
    OptionParser.new do |opts|
      opts.banner = 'Usage: generate_html.rb [form_engine_id] [template_id]'

      opts.on('-h', '--help', 'Show this help') do
        puts opts
        exit
      end
    end.parse!(args)

    @form_engine_id = args[0] if args.length > 0
    @template_id = args[1] if args.length > 1
  end

  def ensure_output_directory
    FileUtils.mkdir_p(@output_dir)
  end

  def load_base_html
    html_file_path = File.join(@example_assets_path, 'formengine', @form_engine_id, 'index.html')

    unless File.exist?(html_file_path)
      raise "HTML template not found: #{html_file_path}"
    end

    html_content = File.read(html_file_path)
    puts '✅ Loaded HTML template'
    html_content
  end

  def inject_css(html_content)
    css_file_path = File.join(@example_assets_path, 'formengine', @form_engine_id, 'style.css')

    if File.exist?(css_file_path)
      css_content = File.read(css_file_path)
      # Replace the CSS link with inline styles - matches FormGear SDK pattern
      html_content = html_content.gsub(
        /<link[^>]+href="[^"]*style\.css"[^>]*>/,
        "<style>\n#{css_content}\n</style>"
      )
      puts '✅ Injected CSS'
    end

    html_content
  end

  def inject_jquery(html_content)
    # Try multiple possible jQuery paths
    jquery_paths = [
      File.join(@example_assets_path, 'vendor', 'jquery-3.5.1.js'),
      File.join(@example_assets_path, 'js', 'jquery-3.5.1.js'),
      File.join(@example_assets_path, 'asset', 'jquery-3.5.1.js')
    ]

    jquery_file_path = jquery_paths.find { |path| File.exist?(path) }

    if jquery_file_path
      jquery_content = File.read(jquery_file_path)

      # Try multiple jQuery script patterns
      script_patterns = [
        '<script src="file:///android_asset/asset/jquery-3.5.1.js"></script>',
        '<script src="{{JQUERY_SOURCE}}"></script>',
        /<!--\s*JQUERY_PLACEHOLDER\s*-->/,
        /<!--\s*\{\{JQUERY_SOURCE\}\}\s*-->/
      ]

      replacement_made = false
      script_patterns.each do |pattern|
        if html_content.match?(pattern)
          html_content = html_content.gsub(pattern, "<script>\n#{jquery_content}\n</script>")
          replacement_made = true
          break
        end
      end

      if replacement_made
        puts '✅ Injected jQuery'
      else
        # If no placeholder found, inject before closing head tag
        head_close_index = html_content.index('</head>')
        if head_close_index
          html_content = "#{html_content[0...head_close_index]}<script>\n#{jquery_content}\n</script>\n#{html_content[head_close_index..-1]}"
          puts '✅ Injected jQuery (no placeholder found, added to head)'
        else
          puts '⚠️  Could not inject jQuery - no suitable location found'
        end
      end
    else
      puts '⚠️  jQuery file not found in any expected location'
    end

    html_content
  end

  def inject_form_engine_js(html_content)
    js_file_name = case @form_engine_id
                   when '1'
                     'form-gear.es.js'
                   when '2'
                     'fasih-form.es.js'
                   else
                     raise "Unsupported form engine ID: #{@form_engine_id}"
                   end

    js_file_path = File.join(@example_assets_path, 'formengine', @form_engine_id, js_file_name)

    if File.exist?(js_file_path)
      js_content = File.read(js_file_path)

      # Find the position to inject the JavaScript (before closing body tag)
      # This matches the FormGear SDK pattern for JS injection
      body_close_index = html_content.rindex('</body>')
      if body_close_index
        html_content = "#{html_content[0...body_close_index]}<script>\n#{js_content}\n</script>\n#{html_content[body_close_index..-1]}"
      end
      puts "✅ Injected #{js_file_name}"
    end

    html_content
  end

  def load_form_data
    # Try different template directory structures
    template_paths = [
      File.join(@example_assets_path, 'Template', @template_id, "#{@template_id}_template.json"),
      File.join(@example_assets_path, 'templates', @template_id, "#{@template_id}_template.json"),
      File.join(@example_assets_path, 'Template', @template_id, 'template.json'),
      File.join(@example_assets_path, 'templates', @template_id, 'template.json')
    ]

    template_file_path = template_paths.find { |path| File.exist?(path) }

    unless template_file_path
      raise "Template file not found. Tried paths: #{template_paths.join(', ')}"
    end

    # Find corresponding validation file
    template_dir = File.dirname(template_file_path)
    validation_paths = [
      File.join(template_dir, "#{@template_id}_validation.json"),
      File.join(template_dir, 'validation.json')
    ]
    validation_file_path = validation_paths.find { |path| File.exist?(path) }

    # Try different form data directory structures
    form_data_paths = [
      File.join(@example_assets_path, 'formgear'),
      File.join(@example_assets_path, 'form_data'),
      File.join(@example_assets_path, 'data')
    ]

    form_data_dir = form_data_paths.find { |path| Dir.exist?(path) }

    if form_data_dir
      media_file_path = File.join(form_data_dir, 'media.json')
      reference_file_path = File.join(form_data_dir, 'reference.json')
      response_file_path = File.join(form_data_dir, 'response.json')
    else
      media_file_path = nil
      reference_file_path = nil
      response_file_path = nil
    end

    template_data = JSON.parse(File.read(template_file_path))
    validation_data = validation_file_path && File.exist?(validation_file_path) ? JSON.parse(File.read(validation_file_path)) : {}

    # Default structures matching FormGear SDK patterns
    media_data = if media_file_path && File.exist?(media_file_path)
                   JSON.parse(File.read(media_file_path))
                 else
                   {
                     'dataKey' => 'default_media',
                     'media' => [],
                     'details' => { 'media' => [] }
                   }
                 end

    reference_data = if reference_file_path && File.exist?(reference_file_path)
                       JSON.parse(File.read(reference_file_path))
                     else
                       {
                         'details' => [
                           {
                             'dataKey' => 'default_reference',
                             'label' => 'Default Reference',
                             'value' => ''
                           }
                         ],
                         'sidebar' => [
                           {
                             'dataKey' => 'default_sidebar',
                             'label' => 'Default Sidebar',
                             'value' => ''
                           }
                         ]
                       }
                     end

    response_data = if response_file_path && File.exist?(response_file_path)
                      JSON.parse(File.read(response_file_path))
                    else
                      {
                        'description' => 'Default Response',
                        'dataKey' => 'default_response',
                        'answers' => [],
                        'details' => { 'answers' => [] }
                      }
                    end

    puts '✅ Loaded form data'

    {
      template: template_data,
      validation: validation_data,
      media: media_data,
      reference: reference_data,
      response: response_data,
      remark: {} # Empty remark object
    }
  end

  def generate_bridge_script(form_data)
    # Method names that should be available - matches FormGear SDK patterns
    method_names = %w[
      getReference getTemplate getPreset getResponse getValidation
      getMedia getRemark getUserName getFormMode getIsNew
      getPrincipalCollection getRolePetugas getUserRole
      action execute saveOrSubmit saveOrSubmitFasihForm
    ]

    # Pre-loaded data for synchronous methods
    preloaded_data = {
      'getReference' => form_data[:reference],
      'getTemplate' => form_data[:template],
      'getPreset' => {},
      'getResponse' => form_data[:response],
      'getValidation' => form_data[:validation],
      'getMedia' => form_data[:media],
      'getRemark' => form_data[:remark],
      'getUserName' => 'Example User',
      'getFormMode' => '1',
      'getIsNew' => '1',
      'getPrincipalCollection' => [],
      'getRolePetugas' => 'petugas',
      'getUserRole' => 'surveyor'
    }

    # Build synchronous method implementations for data handlers
    # NOTE: FormGear expects these methods to return JSON STRINGS, not objects
    data_method_implementations = preloaded_data.map do |method_name, value|
      json_string_value = if value.is_a?(String)
                            # For string values, return the string directly (not as JSON)
                            "'#{value.gsub("'", "\\'").gsub('"', '\\"')}'"
                          else
                            # For objects, return them as JSON strings that callAndroidFunction can parse
                            "'#{value.to_json.gsub("'", "\\'").gsub('"', '\\"')}'"
                          end

      <<~JAVASCRIPT
            if (prop === '#{method_name}') {
              return function() {
                console.log('📱 Android.#{method_name}() called');
                const result = #{json_string_value};
                console.log('📱 Android.#{method_name}() returned JSON string:', result);
                return result;
              };
            }
      JAVASCRIPT
    end.join("\n    ")

    # Build async method bindings for action handlers
    action_method_bindings = %w[action execute saveOrSubmit saveOrSubmitFasihForm].map do |method_name|
      <<~JAVASCRIPT
            if (prop === '#{method_name}') {
              return function(...args) {
                console.log('📱 Android.#{method_name}() called with args:', args);
                // Simulate async action - in real app this would call flutter_inappwebview.callHandler
                return Promise.resolve({
                  success: true,
                  message: 'Simulated #{method_name} action completed',
                  data: args
                });
              };
            }
      JAVASCRIPT
    end.join("\n    ")

    js_array_of_methods = method_names.map { |name| "'#{name}'" }.join(', ')

    <<~JAVASCRIPT
      // ===========================================
      // FormGear WebView JavaScript Bridge
      // Generated: #{Time.now.strftime('%Y-%m-%dT%H:%M:%S%z')}
      // ===========================================

      console.log('🚀 Initializing FormGear JavaScript Bridge...');

      // Traditional Android WebView bridge object with synchronous data methods
      window.Android = new Proxy({}, {
        get: function(target, prop) {
          #{data_method_implementations}
          #{action_method_bindings}

          console.warn('❓ Unknown method called:', prop);
          return undefined;
        }
      });

      // Test all methods are available
      const availableMethods = [#{js_array_of_methods}];
      console.log('🔧 Available methods:', availableMethods);

      // Verify each method
      availableMethods.forEach(method => {
        const isAvailable = typeof Android[method] === 'function';
        console.log(`${isAvailable ? '✅' : '❌'} ${method}: ${isAvailable ? 'Available' : 'Missing'}`);
      });

      // Log that bridge is ready
      console.log('🌉 Android Bridge injected successfully!');

      // Add debugging helpers
      window.FormGearDebug = {
        testAllMethods: function() {
          console.log('🧪 Testing all FormGear methods...');
          availableMethods.forEach(method => {
            try {
              if (typeof Android[method] === 'function') {
                const result = Android[method]();
                console.log(`✅ ${method}:`, result);
              } else {
                console.error(`❌ ${method}: Not a function`);
              }
            } catch (error) {
              console.error(`💥 ${method}: Error -`, error);
            }
          });
        },

        inspectData: function() {
          console.log('🔍 Inspecting form data...');
          console.log('Template:', Android.getTemplate());
          console.log('Validation:', Android.getValidation());
          console.log('Reference:', Android.getReference());
          console.log('Response:', Android.getResponse());
          console.log('Media:', Android.getMedia());
          console.log('Remark:', Android.getRemark());
          console.log('User Info:', {
            userName: Android.getUserName(),
            formMode: Android.getFormMode(),
            isNew: Android.getIsNew(),
            userRole: Android.getUserRole(),
            rolePetugas: Android.getRolePetugas()
          });
        }
      };

      // Auto-run basic inspection
      console.log('🔍 Running basic method availability check...');
      FormGearDebug.testAllMethods();

      // Make debug tools available globally
      window.testFormGear = window.FormGearDebug.testAllMethods;
      window.inspectFormGear = window.FormGearDebug.inspectData;

      console.log('💡 Debug commands available:');
      console.log('  - testFormGear() - Test all methods');
      console.log('  - inspectFormGear() - Inspect form data');
      console.log('  - FormGearDebug.* - Access debug tools');

      console.log('🎯 FormGear JavaScript Bridge ready!');
    JAVASCRIPT
  end

  def inject_bridge_script(html_content, bridge_script)
    # Inject the bridge script before closing body tag - matches FormGear SDK pattern
    body_close_index = html_content.rindex('</body>')
    if body_close_index
      html_content = "#{html_content[0...body_close_index]}<script>\n#{bridge_script}\n</script>\n#{html_content[body_close_index..-1]}"
    end

    puts '✅ Injected JavaScript bridge'
    html_content
  end

  def write_output_files(html_content, bridge_script, form_data)
    template_short_id = @template_id.length > 7 ? @template_id[0..7] : @template_id

    # Write the final HTML file
    output_file_path = File.join(@output_dir, "formgear_v#{@form_engine_id}_#{template_short_id}.html")
    File.write(output_file_path, html_content)

    # Create a JavaScript inspection file
    js_inspection_file_path = File.join(@output_dir, 'bridge_inspection.js')
    File.write(js_inspection_file_path, bridge_script)

    # Create a summary file
    summary_file_path = File.join(@output_dir, 'generation_summary.json')

    # Find actual data source paths
    template_paths = [
      File.join(@example_assets_path, 'Template', @template_id, "#{@template_id}_template.json"),
      File.join(@example_assets_path, 'templates', @template_id, "#{@template_id}_template.json"),
      File.join(@example_assets_path, 'Template', @template_id, 'template.json'),
      File.join(@example_assets_path, 'templates', @template_id, 'template.json')
    ]
    actual_template_path = template_paths.find { |path| File.exist?(path) }

    form_data_dirs = [
      File.join(@example_assets_path, 'formgear'),
      File.join(@example_assets_path, 'form_data'),
      File.join(@example_assets_path, 'data')
    ]
    actual_form_data_dir = form_data_dirs.find { |path| Dir.exist?(path) }

    summary_data = {
      'timestamp' => Time.now.strftime('%Y-%m-%dT%H:%M:%S%z'),
      'formEngineId' => @form_engine_id,
      'templateId' => @template_id,
      'templateTitle' => form_data[:template]['title'],
      'templateVersion' => form_data[:template]['version'],
      'templateDataKey' => form_data[:template]['dataKey'],
      'files' => {
        'html' => output_file_path,
        'bridge_script' => js_inspection_file_path,
        'summary' => summary_file_path
      },
      'data_sources' => {
        'template' => actual_template_path || 'not found',
        'validation' => actual_template_path ? File.join(File.dirname(actual_template_path), "#{@template_id}_validation.json") : 'not found',
        'media' => actual_form_data_dir ? File.join(actual_form_data_dir, 'media.json') : 'not found',
        'reference' => actual_form_data_dir ? File.join(actual_form_data_dir, 'reference.json') : 'not found',
        'response' => actual_form_data_dir ? File.join(actual_form_data_dir, 'response.json') : 'not found'
      }
    }

    File.write(summary_file_path, JSON.pretty_generate(summary_data))

    {
      html: output_file_path,
      bridge_script: js_inspection_file_path,
      summary: summary_file_path
    }
  end

  def print_completion_summary(output_files, form_data)
    puts ''
    puts '🎉 HTML file generated successfully!'
    puts "📄 Output: #{output_files[:html]}"
    puts '🌐 Open this file in a browser to inspect the FormGear WebView'
    puts ''
    puts 'Template Info:'
    puts "  - Title: #{form_data[:template]['title'] || 'Unknown'}"
    puts "  - Version: #{form_data[:template]['version'] || 'Unknown'}"
    puts "  - Data Key: #{form_data[:template]['dataKey'] || 'Unknown'}"
    puts ''
    puts "🔧 JavaScript bridge script: #{output_files[:bridge_script]}"
    puts "📋 Generation summary: #{output_files[:summary]}"
    puts ''
  end
end

# Run the generator if this file is executed directly
if __FILE__ == $PROGRAM_NAME
  generator = FormGearHtmlGenerator.new
  generator.run(ARGV)
end