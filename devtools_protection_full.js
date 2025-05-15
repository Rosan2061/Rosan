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
    
    const blocked = blockedShortcuts.some(shortcut => {
      const keysPressed = shortcut.keys.map(key => 
        key === "Control" ? e.ctrlKey : 
        key === "Shift" ? e.shiftKey : 
        key === "Alt" ? e.altKey : 
        e.key === key
      );
      return keysPressed.every(Boolean);
    });

    if (blocked) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      const shortcutDesc = blockedShortcuts.find(s => 
        s.keys.some(k => k === e.key || 
        (k === "Control" && e.ctrlKey) || 
        (k === "Shift" && e.shiftKey))
        .description;
      
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
      // Method 1: Window size difference
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      const sizeDetected = widthDiff > config.sizeThreshold || heightDiff > config.sizeThreshold;
      
      // Method 2: Debugger detection
      let debuggerDetected = false;
      const debuggerChecker = new Function("debugger");
      try {
        debuggerChecker();
      } catch (e) {
        debuggerDetected = e && e.message && e.message.includes("debugger");
      }
      
      // Method 3: Console timing detection
      let consoleTimeDetected = false;
      const start = performance.now();
      console.log(start);
      consoleTimeDetected = performance.now() - start > 100;
      
      return sizeDetected || debuggerDetected || consoleTimeDetected;
    } catch (e) {
      return false;
    }
  }

  // 4. Protection Enforcement
  function enforceProtection() {
    if (!config.protectionActive) return;
    
    // Clear the page
    document.documentElement.innerHTML = "<h1 style='text-align:center;margin-top:20%'>Access Restricted</h1>";
    document.documentElement.style.pointerEvents = "none";
    
    // Disable navigation
    window.onbeforeunload = function() {
      return "Navigation disabled due to security policy violation.";
    };
    
    // Redirect if enabled
    if (config.enableRedirect) {
      window.location.replace(config.redirectUrl);
    }
  }

  // 5. Console Protection
  if (config.enableConsoleProtection) {
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
  }

  // 6. User Warning System
  function showWarning(message) {
    if (state.warningShown) return;
    
    const warningBox = document.createElement('div');
    warningBox.style = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #ff4444;
      color: white;
      padding: 15px;
      border-radius: 5px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      z-index: 99999;
      max-width: 80%;
      text-align: center;
      animation: fadeIn 0.5s;
    `;
    
    warningBox.innerHTML = `
      <strong>Security Warning</strong>
      <p>${message}</p>
      <small>Attempt ${state.attemptCount} of ${config.maxAttempts}</small>
    `;
    
    document.body.appendChild(warningBox);
    state.warningShown = true;
    
    setTimeout(() => {
      warningBox.style.animation = "fadeOut 0.5s";
      setTimeout(() => warningBox.remove(), 500);
      state.warningShown = false;
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

  // Initialization
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
