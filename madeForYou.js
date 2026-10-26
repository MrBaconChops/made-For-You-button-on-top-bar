// NAME: Made For You Button
// AUTHOR: Noah
// DESCRIPTION: A 24px heart immediately left of Home, opening Made For You. v5: clickable inside the window drag area.

(function madeForYou() {
  const ID = "noah-made-for-you";
  const PATH = "/genre/0JQ5DAt0tbjZptfcdMSKl3";
  const URI = "spotify:genre:0JQ5DAt0tbjZptfcdMSKl3";
  if (window.__noahMadeForYouInstalled) return;
  window.__noahMadeForYouInstalled = true;

  // Own the link instead of moving a Spicetify Topbar.Button. Spicetify
  // remounts its registered buttons and overwrites their classes on navigation.
  const link = document.createElement("a");
  link.id = ID;
  link.href = PATH;
  link.setAttribute("aria-label", "Made For You");
  link.title = "Made For You";
  link.innerHTML = '<svg aria-hidden="true" width="24" height="24" viewBox="0 0 16 16" fill="currentColor"><path d="M8 14.5s-6-3.6-6-8A3.5 3.5 0 0 1 8 4.2 3.5 3.5 0 0 1 14 6.5c0 4.4-6 8-6 8z"/></svg>';

  const style = document.createElement("style");
  style.textContent = `
    #${ID} {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 48px !important;
      height: 48px !important;
      min-width: 48px !important;
      flex: 0 0 48px !important;
      position: relative !important;
      z-index: 10 !important;
      pointer-events: auto !important;
      -webkit-app-region: no-drag !important;
      app-region: no-drag !important;
      cursor: pointer !important;
      color: var(--text-subdued, #b3b3b3);
      text-decoration: none !important;
      border-radius: 50%;
    }
    #${ID}:hover, #${ID}:focus-visible { color: var(--text-base, #fff); }
    #${ID}:focus-visible { outline: 2px solid currentColor; outline-offset: -3px; }
    #${ID}, #${ID} * { -webkit-app-region: no-drag !important; }
    #${ID} svg { width: 24px !important; height: 24px !important; pointer-events: none !important; }
  `;
  (document.head || document.documentElement).appendChild(style);

  function open(event) {
    const history = window.Spicetify?.Platform?.History;
    if (typeof history?.push === "function") {
      try {
        history.push(PATH);
        event?.preventDefault();
        event?.stopImmediatePropagation();
        return;
      } catch (error) {
        console.warn("[Made For You] History navigation failed; trying Spotify URI.", error);
      }
    }
    // Spotify desktop handles spotify: links even if Spicetify's History API
    // is unavailable. Do not silently swallow a failed navigation.
    if (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    window.location.assign(URI);
  }

  let lastPointerOpen = 0;
  // Capture before Spotify's delegated handlers; survives navigation/remounts.
  window.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest(`#${ID}`)) {
      if (Date.now() - lastPointerOpen < 800) { event.preventDefault(); event.stopImmediatePropagation(); return; }
      open(event);
    }
  }, true);
  // Backup: some Spotify builds swallow "click" in the top bar, so also
  // react to the mouse press itself (left button only).
  window.addEventListener("pointerup", (event) => {
    if (event.button === 0 && event.target instanceof Element && event.target.closest(`#${ID}`)) {
      lastPointerOpen = Date.now();
      open(event);
    }
  }, true);
  window.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "m") open(event);
  }, true);

  function place() {
    const home = document.querySelector(
      '#global-nav-bar a[aria-label="Home"], #global-nav-bar button[aria-label="Home"], ' +
      'a[aria-label="Home"], button[aria-label="Home"], ' +
      '.main-globalNav-link[href="/"], a[href="/"][data-testid="home-button"]'
    );
    if (!home?.parentElement) return;
    // Remove older copies if more than one extension version was enabled.
    document.querySelectorAll(".made-for-you-button").forEach((old) => old.remove());
    if (link.nextElementSibling !== home) home.parentElement.insertBefore(link, home);
  }

  function mount() {
    place();
    new MutationObserver(place).observe(document.body, { childList: true, subtree: true });
  }
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount, { once: true });
})();