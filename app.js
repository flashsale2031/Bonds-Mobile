const $ = (id) => document.getElementById(id);
const state = { lastPosition: null, toastTimer: null };

function detectDevice() {
  const ua = navigator.userAgent || "";
  const platform = navigator.userAgentData?.platform || navigator.platform || "Unknown platform";
  let type = /Mobi|Android|iPhone|iPad|iPod/i.test(ua) ? "Mobile device" : "Desktop device";
  let name = "Browser device";
  if (/iPhone/i.test(ua)) name = "Apple iPhone";
  else if (/iPad/i.test(ua)) name = "Apple iPad";
  else if (/Android/i.test(ua)) name = /Mobile/i.test(ua) ? "Android phone" : "Android tablet";
  else if (/Macintosh|Mac OS X/i.test(ua)) name = "Apple Mac";
  else if (/Windows/i.test(ua)) name = "Windows PC";
  else if (/Linux/i.test(ua)) name = "Linux computer";
  $("device-name").textContent = name;
  $("device-type").textContent = type.toUpperCase();
  $("platform-value").textContent = platform.replace("undefined", "Unknown");
  $("language-value").textContent = (navigator.language || "—").toUpperCase();
}

function updateClock() {
  const now = new Date();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local time";
  const parts = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", hour12: true }).formatToParts(now);
  const hour = parts.find((part) => part.type === "hour")?.value || "--";
  const minute = parts.find((part) => part.type === "minute")?.value || "--";
  const period = parts.find((part) => part.type === "dayPeriod")?.value || "";
  const offsetMinutes = -now.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "−";
  const abs = Math.abs(offsetMinutes);
  const offset = `UTC ${sign}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
  $("timezone-value").textContent = timeZone.replace(/_/g, " ");
  $("clock-value").innerHTML = `${hour}:${minute} <span>${period}</span>`;
  $("offset-value").textContent = offset;
  $("date-value").textContent = now.toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" }).toUpperCase();
  $("session-time").textContent = now.toLocaleTimeString([], { hour12: false });
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => toast.classList.remove("show"), 3300);
}

function setStatus(status, label) {
  $("status-chip").textContent = label;
  $("orbital-status").textContent = label;
  $("status-chip").classList.toggle("connected", status === "connected");
  $("orbital-status-dot").style.background = status === "error" ? "#ff8b72" : status === "connected" ? "var(--lime)" : "#91a4a3";
}

function formatCoordinates(position) {
  const { latitude, longitude, accuracy } = position.coords;
  $("location-value").innerHTML = `${latitude.toFixed(4)}° ${latitude >= 0 ? "N" : "S"}<br /><span>${Math.abs(longitude).toFixed(4)}° ${longitude >= 0 ? "E" : "W"}</span>`;
  $("coordinates").textContent = `LAT ${latitude.toFixed(7)} / LNG ${longitude.toFixed(7)}`;
  $("accuracy-value").textContent = `ACCURACY ±${Math.round(accuracy)} M`;
}

function locate() {
  if (!navigator.geolocation) {
    setStatus("error", "NOT SUPPORTED");
    $("location-value").innerHTML = "GPS unavailable<br /><span>in this browser</span>";
    showToast("This browser does not support GPS location.");
    return;
  }
  setStatus("pending", "REQUESTING GPS");
  $("locate-label").textContent = "Reading signal…";
  $("locate-button").disabled = true;
  navigator.geolocation.getCurrentPosition((position) => {
    state.lastPosition = position;
    formatCoordinates(position);
    setStatus("connected", "SIGNAL CONNECTED");
    $("locate-label").textContent = "Refresh GPS reading";
    $("locate-button").disabled = false;
    showToast("GPS signal connected.");
  }, (error) => {
    const message = error.code === 1 ? "Location permission was denied." : error.code === 2 ? "Your device could not find a GPS signal." : "The GPS request timed out.";
    setStatus("error", "SIGNAL ERROR");
    $("locate-label").textContent = "Try GPS again";
    $("locate-button").disabled = false;
    showToast(message);
  }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
}

detectDevice();
updateClock();
setInterval(updateClock, 1000);
$("locate-button").addEventListener("click", locate);
$("refresh-button").addEventListener("click", locate);
