/*
 * Bonds Mobile GPS permission manager.
 *
 * Browser GPS access cannot be granted silently: the user must approve the
 * native permission prompt that is triggered by a click. This module keeps
 * that flow in one place and exposes the current permission state to app.js.
 */
(function () {
  const supported = "geolocation" in navigator;
  let state = supported ? "prompt" : "unsupported";
  let onChange = function () {};

  function publish(nextState) {
    state = nextState;
    onChange(state);
    window.dispatchEvent(new CustomEvent("gpspermissionchange", { detail: { state } }));
  }

  async function sync() {
    if (!supported) {
      publish("unsupported");
      return state;
    }
    if (!navigator.permissions?.query) {
      publish("prompt");
      return state;
    }
    try {
      const permission = await navigator.permissions.query({ name: "geolocation" });
      publish(permission.state);
      permission.onchange = () => publish(permission.state);
    } catch {
      publish("prompt");
    }
    return state;
  }

  function request() {
    return new Promise((resolve, reject) => {
      if (!supported) {
        publish("unsupported");
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }
      // getCurrentPosition must be called from the user's click path to open
      // the browser's native approval prompt.
      navigator.geolocation.getCurrentPosition(
        (position) => {
          publish("granted");
          resolve(position);
        },
        (error) => {
          if (error.code === 1) publish("denied");
          else publish("prompt");
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
      );
    });
  }

  window.GPSPermissions = {
    get state() {
      return state;
    },
    isSupported: supported,
    onChange(callback) {
      onChange = typeof callback === "function" ? callback : function () {};
      return () => {
        onChange = function () {};
      };
    },
    sync,
    request,
  };

  sync();
})();
