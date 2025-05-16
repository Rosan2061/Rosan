
// == DevTools Protection Script ==

(function() {
  'use strict';

  // 1. Disable Right Click
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  // 2. Block Common DevTools Key Combos
  document.addEventListener('keydown', function(e) {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
      (e.ctrlKey && e.key === 'U')
    ) {
      e.preventDefault();
      alert("DevTools खोल्न निषेध गरिएको छ!");
    }
  });

  // 3. Detect DevTools by window size difference
  let devtoolsOpen = false;
  const threshold = 160;
  setInterval(function() {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    if ((widthThreshold || heightThreshold) && !devtoolsOpen) {
      devtoolsOpen = true;
      alert('DevTools खोल्नु निषेध छ!');
      // Optionally redirect
      // window.location.href = "about:blank";
    } else if (!(widthThreshold || heightThreshold)) {
      devtoolsOpen = false;
    }
  }, 1000);

  // 4. Override DevTools-related functions
  window.alert = function(msg) { console.log("Alert Blocked:", msg); };
  window.confirm = function() { return false; };
  window.prompt = function() { return null; };

  Object.defineProperty(window, 'console', {
    value: window.console,
    writable: false,
    configurable: false
  });

  console.log('%cDevTools Protection Active 🛡️', 'color: red; font-weight: bold;');

})();



// == Extra: Detect DevTools via window size changes and act harshly ==
(function() {
  'use strict';

  let devtools = { open: false };
  const threshold = 160;

  const check = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;

    if ((widthThreshold || heightThreshold)) {
      if (!devtools.open) {
        devtools.open = true;
        document.body.innerHTML = "";
        alert("DevTools खोल्न पाइँदैन!");
        window.location.href = "about:blank";
      }
    } else {
      devtools.open = false;
    }
  };

  setInterval(check, 500);
})();
