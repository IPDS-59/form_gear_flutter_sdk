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

    // Handle async action methods
    if (actionMethods.includes(prop)) {
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
              return method.apply(this, args);
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
              return {};
            }
          };
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
if (isIOS) console.log('iOS WKWebView compatibility layer enabled');
