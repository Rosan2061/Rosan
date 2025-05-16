// == Nuclear DevTools Protection System ==
(function() {
  'use strict';

  // Configuration
  const config = {
    protectionActive: true,
    nuclearMode: true, // Enable extreme measures
    autoRefresh: true, // Refresh page when DevTools detected
    forceOffline: true, // Take page offline after detection
    maxRefreshes: 3, // Maximum refresh attempts before going offline
    refreshDelay: 100, // Delay before refresh (ms)
    warningMessages: {
      devtoolsOpened: "⚠️ SECURITY ALERT: Developer tools detected!",
      offlineMode: "⚠️ OFFLINE MODE: Security measures activated",
      refreshNotice: "Page will refresh for security reasons..."
    },
    redirectUrl: "about:blank",
    checkInterval: 200, // More frequent checking
    sizeThreshold: 160
  };

  // State tracking
  let state = {
    devtoolsOpen: false,
    refreshCount: 0,
    isOffline: false,
    detectionActive: true
  };

  // 1. Enhanced DevTools Detection with Forced Open detection
  function detectDevTools() {
    try {
      // Method 1: Window size difference
      const widthThreshold = config.sizeThreshold + Math.random() * 20;
      const heightThreshold = config.sizeThreshold + Math.random() * 20;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      const sizeDetected = widthDiff > widthThreshold || heightDiff > heightThreshold;

      // Method 2: Debugger trap with random delay
      let debuggerDetected = false;
      const start = performance.now();
      try {
        (function() {
          const r = Math.random().toString(36).substring(7);
          debugger;
          return r;
        })();
      } catch (e) {
        debuggerDetected = e && e.stack && e.stack.includes("debugger");
      }
      const duration = performance.now() - start;
      const consoleTimeDetected = duration > 100 + Math.random() * 50;

      // Method 3: Function toString tampering check
      const funcToString = Function.prototype.toString;
      const tamperDetected = funcToString.toString().indexOf('native') === -1;

      return sizeDetected || debuggerDetected || consoleTimeDetected || tamperDetected;
    } catch (e) {
      return true; // Assume devtools open if detection fails
    }
  }

  // 2. Auto-Refresh Mechanism
  function triggerAutoRefresh() {
    if (!config.autoRefresh || state.refreshCount >= config.maxRefreshes) {
      if (config.forceOffline) {
        activateOfflineMode();
      }
      return;
    }

    state.refreshCount++;
    showWarning(config.warningMessages.refreshNotice, 1500);

    setTimeout(() => {
      // Clear all storage before refresh
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {}

      // Refresh with random parameter to bypass cache
      window.location.href = window.location.href.split('?')[0] + '?udps_refresh=' + 
        Math.random().toString(36).substring(7);
    }, config.refreshDelay);
  }

  // 3. Offline Mode Activation
  function activateOfflineMode() {
    if (!config.forceOffline || state.isOffline) return;

    state.isOffline = true;
    state.detectionActive = false; // Stop further detection

    // Show offline warning
    showWarning(config.warningMessages.offlineMode, 0);

    // Disconnect all network activity
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
    }

    // Block all fetch requests
    const originalFetch = window.fetch;
    window.fetch = function() {
      return Promise.reject(new Error("Network access disabled by security policy"));
    };

    // Disable WebSockets
    window.WebSocket = function() {
      throw new Error("WebSocket access disabled by security policy");
    };

    // Disable EventSource
    window.EventSource = function() {
      throw new Error("EventSource access disabled by security policy");
    };

    // Replace all images with placeholder
    document.querySelectorAll('img').forEach(img => {
      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZmlsbD0iI2VlZSI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OSI+T0ZGTElORSBNT0RFPC90ZXh0Pjwvc3ZnPg==';
      img.style.filter = 'grayscale(100%)';
    });

    // Disable all links
    document.querySelectorAll('a').forEach(a => {
      a.href = 'javascript:void(0)';
      a.onclick = function(e) {
        e.preventDefault();
        showWarning("Navigation disabled in offline mode");
      };
    });

    // Disable forms
    document.querySelectorAll('form').forEach(form => {
      form.onsubmit = function(e) {
        e.preventDefault();
        showWarning("Form submission disabled in offline mode");
      };
    });
  }

  // 4. Warning System
  function showWarning(message, duration = 3000) {
    const warningBox = document.createElement('div');
    warningBox.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #ff4444;
      color: white;
      padding: 15px 25px;
      border-radius: 5px;
      box-shadow: 0 4px 20px rgba(255,0,0,0.3);
      z-index: 2147483647;
      max-width: 90%;
      text-align: center;
      font-family: 'Arial', sans-serif;
      animation: udpsFadeIn 0.3s forwards;
      border: 1px solid rgba(255,255,255,0.2);
      backdrop-filter: blur(5px);
    `;

    warningBox.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="white"/>
        </svg>
        <div>
          <strong style="font-size: 16px;">SECURITY ALERT</strong>
          <p style="margin: 5px 0 0; font-size: 14px;">${message}</p>
        </div>
      </div>
    `;

    document.body.appendChild(warningBox);

    if (duration > 0) {
      setTimeout(() => {
        warningBox.style.animation = "udpsFadeOut 0.3s forwards";
        setTimeout(() => warningBox.remove(), 300);
      }, duration);
    }
  }

  // 5. Continuous Monitoring with Auto-Refresh
  const monitoringInterval = setInterval(() => {
    if (!state.detectionActive) return;

    if (detectDevTools() && !state.devtoolsOpen) {
      state.devtoolsOpen = true;
      showWarning(config.warningMessages.devtoolsOpened, 1500);
      triggerAutoRefresh();
    } else if (!detectDevTools()) {
      state.devtoolsOpen = false;
    }
  }, config.checkInterval);

  // 6. Style for warnings
  const style = document.createElement('style');
  style.textContent = `
    @keyframes udpsFadeIn {
      from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes udpsFadeOut {
      from { opacity: 1; transform: translateX(-50%) translateY(0); }
      to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
  `;
  document.head.appendChild(style);

  // 7. Initialization protection
  document.addEventListener('DOMContentLoaded', function() {
    // Check for forced DevTools on load
    setTimeout(() => {
      if (detectDevTools()) {
        state.devtoolsOpen = true;
        triggerAutoRefresh();
      }
    }, 1000);
  });

  // 8. Prevent bypassing via URL changes
  window.addEventListener('hashchange', function() {
    if (state.detectionActive && detectDevTools()) {
      triggerAutoRefresh();
    }
  });

  // 9. Nuclear option for persistent DevTools
  window.addEventListener('blur', function() {
    // If window loses focus (likely due to DevTools opening)
    setTimeout(() => {
      if (detectDevTools()) {
        triggerAutoRefresh();
      }
    }, 500);
  });

  // 10. Final lockdown
  Object.freeze(config);
  Object.freeze(state);
})();
