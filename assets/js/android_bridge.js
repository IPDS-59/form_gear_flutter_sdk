// iOS WKWebView compatibility layer
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

// Get pre-loaded data from global variables
const bridgeData = window._formGearBridgeData || {};
const actionMethods = window._formGearActionMethods || [];
const handlerNames = window._formGearHandlerNames || [];

// Traditional Android WebView bridge object with synchronous data methods
window.Android = new Proxy({}, {
  get: function(target, prop) {
    // Handle synchronous data methods
    if (bridgeData.hasOwnProperty(prop)) {
      return function() {
        return bridgeData[prop];
      };
    }

    // Handle async action methods (with result() callback)
    if (actionMethods.includes(prop)) {
      const originalMethod = window.flutter_inappwebview.callHandler.bind(window.flutter_inappwebview, prop);

      return function(...args) {
        const result = originalMethod(...args);

        // For action methods, call the global result() function if it exists
        if (typeof window.result === 'function' && args.length > 0) {
          const actionName = args[0];

          // Handle both sync and async results
          if (result && typeof result.then === 'function') {
            // Async result (Promise)
            result.then(res => {
              if (res && res.success && res.result) {
                window.result(actionName, res.result, null);
              } else if (res && !res.success) {
                console.error('Action failed:', actionName, res.error);
              }
            }).catch(error => {
              console.error('Bridge action error:', prop, error);
            });
          } else {
            // Sync result
            if (result && result.success && result.result) {
              window.result(actionName, result.result, null);
            } else if (result && !result.success) {
              console.error('Action failed:', actionName, result.error);
            }
          }
        }

        return result;
      };
    }

    // Handle all other dynamic methods (direct bridge communication)
    if (handlerNames.includes(prop)) {
      return window.flutter_inappwebview.callHandler.bind(window.flutter_inappwebview, prop);
    }

    return undefined;
  }
});

// iOS-specific: Add additional error handling for WKWebView
if (isIOS) {
  const originalAndroid = window.Android;
  window.Android = new Proxy({}, {
    get: function(target, prop) {
      try {
        const method = originalAndroid[prop];
        if (typeof method === 'function') {
          return function(...args) {
            try {
              const result = method.apply(this, args);

              // For action methods on iOS, also call result() function
              if (actionMethods.includes(prop) && typeof window.result === 'function' && args.length > 0) {
                const actionName = args[0];

                // Handle both sync and async results for iOS
                if (result && typeof result.then === 'function') {
                  result.then(res => {
                    if (res && res.success && res.result) {
                      window.result(actionName, res.result, null);
                    } else if (res && !res.success) {
                      console.error('iOS Action failed:', actionName, res.error);
                    }
                  }).catch(error => {
                    console.error('iOS Bridge action error:', prop, error);
                  });
                } else {
                  if (result && result.success && result.result) {
                    window.result(actionName, result.result, null);
                  } else if (result && !result.success) {
                    console.error('iOS Action failed:', actionName, result.error);
                  }
                }
              }

              return result;
            } catch (e) {
              console.warn('iOS WKWebView method error for', prop, ':', e);
              // Return appropriate fallbacks based on method type
              if (prop.startsWith('get')) {
                if (prop.includes('Mode') || prop.includes('New')) return '1';
                if (prop.includes('Principal')) return '[]';
                if (prop.includes('User') || prop.includes('Role')) return 'USER';
                return prop.includes('Template') || prop.includes('Validation')
                  ? '{"components":[[]]}'
                  : '{}';
              }
              return { success: false, error: e.toString() };
            }
          };
        }

        // For iOS: Handle dynamic methods that aren't in originalAndroid
        if (handlerNames.includes(prop) && !method) {
          return originalAndroid[prop] || window.flutter_inappwebview.callHandler.bind(window.flutter_inappwebview, prop);
        }

        return method;
      } catch (e) {
        console.warn('iOS WKWebView proxy error:', e);
        return originalAndroid[prop];
      }
    }
  });
}

// Log that bridge is ready
console.log('Android Bridge injected with methods:', handlerNames);
console.log('Bridge data methods:', Object.keys(bridgeData));
console.log('Action methods:', actionMethods);
if (isIOS) console.log('iOS WKWebView compatibility layer enabled');
