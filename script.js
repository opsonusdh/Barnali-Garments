const maintenanceURL = "https://barnaligarments.dpdns.org/_maintenance/";
const liveURL = "https://barnaligarments.dpdns.org";
const startTime = performance.now();
let loadTime, elapsed;

(async function () {
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  try {
    const res = await fetch(maintenanceURL, { cache: "no-store" });
    loadTime = performance.now();
    elapsed = loadTime - startTime;
    if (4000 - elapsed > 0) {
      await sleep(4000 - elapsed);
    }
    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (data && data.active === true) { renderMaintenancePage(data.message || "Server Under Maintenance");
        return;
      }
    }
    let target;
    if (params.has("go")) {
      if (params.get("go").startsWith("/")){
        target = params.get("go");
      } else {
        target = "/" + params.get("go");
      }
      
      if (!target.startsWith("/") || target.includes("..")) {
        target = "/";
      }
      window.location.replace(liveURL + target);
      return;
    }

    window.location.replace(liveURL+"/");
  } catch (err) {
    loadTime = performance.now();
    elapsed = loadTime - startTime;
    if (4000 - elapsed > 0) {
      await sleep(4000 - elapsed);
    }
    renderMaintenancePage(err);
  }
})();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function renderMaintenancePage(msg) {
  fetch("maintenance_page.html")
    .then(r => r.text())
    .then(html => {
      document.open();
      document.write(html);
      document.close();
      window.addEventListener("load", () => {
        const el = document.getElementById("reason");
        if (el) {
          el.textContent = msg;
        }
      });
    });
}