// == Ultimate DevTools Protection System ==
(function() {
  'use strict';

  // Configuration
  const config = {
    protectionActive: true,
    warningMessages: {
      devtoolsOpened: "⚠️ Warning: Developer Tools are restricted on this page!",
      rightClickDisabled: "Right-click is disabled on this page.",
      shortcutBlocked: "Keyboard shortcut blocked. Developer Tools are restricted."
    },
    redirectUrl: "about:blank",
    checkInterval: 500,
    sizeThreshold: 160,
    maxAttempts: 3,
    enableRedirect: true,
    enableConsoleProtection: true
  };

  // State tracking
  let state = {
    devtoolsOpen: false,
    attemptCount: 0,
    warningShown: false
  };

  // 1. Enhanced Right Click Protection
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    showWarning(config.warningMessages.rightClickDisabled);
  });

  // 2. Comprehensive Shortcut Blocking
  const blockedShortcuts = [
    { keys: ["F12"], description: "F12" },
    { keys: ["Control", "Shift", "I"], description: "Ctrl+Shift+I" },
    { keys: ["Control", "Shift", "J"], description: "Ctrl+Shift+J" },
    { keys: ["Control", "U"], description: "Ctrl+U" },
    { keys: ["Control", "Shift", "C"], description: "Ctrl+Shift+C" },
    { keys: ["Control", "Shift", "K"], description: "Ctrl+Shift+K" }
  ];

  document.addEventListener('keydown', function(e) {
    if (!config.protectionActive) return;

    const isBlocked = blockedShortcuts.some(shortcut => {
      return shortcut.keys.every(key => {
        if (key === "Control") return e.ctrlKey;
        if (key === "Shift") return e.shiftKey;
        if (key === "Alt") return e.altKey;
        return e.key.toLowerCase() === key.toLowerCase();
      });
    });

    if (isBlocked) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const shortcutDesc = blockedShortcuts.find(s => {
        return s.keys.every(key => {
          if (key === "Control") return e.ctrlKey;
          if (key === "Shift") return e.shiftKey;
          if (key === "Alt") return e.altKey;
          return e.key.toLowerCase() === key.toLowerCase();
        });
      })?.description || "Unknown Shortcut";

      showWarning(`${config.warningMessages.shortcutBlocked} (${shortcutDesc})`);
      state.attemptCount++;

      if (state.attemptCount >= config.maxAttempts && config.enableRedirect) {
        enforceProtection();
      }
    }
  });

  // 3. Advanced DevTools Detection
  function detectDevTools() {
    try {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      const sizeDetected = widthDiff > config.sizeThreshold || heightDiff > config.sizeThreshold;

      let debuggerDetected = false;
      const f = function() { debugger; };
      const start = performance.now();
      try {
        f();
      } catch (e) {
        debuggerDetected = e && e.message && e.message.includes("debugger");
      }
      const duration = performance.now() - start;

      const consoleTimeDetected = duration > 100;

      return sizeDetected || debuggerDetected || consoleTimeDetected;
    } catch (e) {
      return false;
    }
  }

  // 4. Protection Enforcement
  function enforceProtection() {
    if (!config.protectionActive) return;

    document.documentElement.innerHTML = "<h1 style='text-align:center;margin-top:20%;color:red;'>Access Restricted</h1>";
    document.documentElement.style.pointerEvents = "none";

    window.onbeforeunload = function() {
      return "Navigation disabled due to security policy violation.";
    };

    if (config.enableRedirect) {
      window.location.replace(config.redirectUrl);
    }
  }

  // 5. Console Protection
  if (config.enableConsoleProtection) {
    try {
      Object.defineProperty(window, 'console', {
        value: {},
        writable: false,
        configurable: false
      });
      Object.defineProperty(window, 'alert', {
        value: function(msg) {
          document.dispatchEvent(new CustomEvent('securityAlert', { detail: msg }));
        },
        writable: false,
        configurable: false
      });
    } catch (e) {}
  }

  // 6. User Warning System
  function showWarning(message) {
    if (state.warningShown) return;

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
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      z-index: 99999;
      max-width: 80%;
      text-align: center;
      font-family: sans-serif;
      animation: fadeIn 0.5s forwards;
    `;

    warningBox.innerHTML = `
      <strong>Security Warning</strong>
      <p>${message}</p>
      <small>Attempt ${state.attemptCount} of ${config.maxAttempts}</small>
    `;

    document.body.appendChild(warningBox);
    state.warningShown = true;

    setTimeout(() => {
      warningBox.style.animation = "fadeOut 0.5s forwards";
      setTimeout(() => {
        warningBox.remove();
        state.warningShown = false;
      }, 500);
    }, 3000);
  }

  // 7. Continuous Monitoring
  setInterval(() => {
    if (detectDevTools() && !state.devtoolsOpen) {
      state.devtoolsOpen = true;
      state.attemptCount++;
      showWarning(config.warningMessages.devtoolsOpened);

      if (state.attemptCount >= config.maxAttempts) {
        enforceProtection();
      }
    } else if (!detectDevTools()) {
      state.devtoolsOpen = false;
    }
  }, config.checkInterval);

  // 8. Back Button Blocker
  history.pushState(null, null, location.href);
  window.onpopstate = function () {
    history.go(1);
  };

  // Initialization logs
  console.log('%c🔒 DevTools Protection System: ACTIVE', 'color: red; font-weight: bold; font-size: 14px;');
  console.log = function() {};
  console.warn = function() {};
  console.error = function() {};

  // Style for warnings
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; top: 0; }
      to { opacity: 1; top: 20px; }
    }
    @keyframes fadeOut {
      from { opacity: 1; top: 20px; }
      to { opacity: 0; top: 0; }
    }
  `;
  document.head.appendChild(style);

})();
