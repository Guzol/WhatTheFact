(function () {
// Detect presence of Hypothesis in the page
var appLinkEl = document.querySelector('link[type="application/annotator+html"]');
if (appLinkEl) {
  return {
    installedURL: appLinkEl.href,
  };
}

// When run from a Chrome or Firefox extension, load resources bundled with the
// extension. Note that in Firefox, the 'chrome' object is accessible as a
// global but not attached to the 'window' object.
var resourceRoot;
if (typeof chrome !== 'undefined' &&
    typeof chrome.extension !== 'undefined' &&
    typeof chrome.extension.getURL !== 'undefined') {
  resourceRoot = chrome.extension.getURL('/');
}

function resolve(url) {
  if (!resourceRoot) {
    return url;
  }
  return new URL(url, resourceRoot).href;
}

function injectStylesheet(href) {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = resolve(href);
  document.head.appendChild(link);
};

function injectScript(src) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = resolve(src);

  // Set 'async' to false to maintain execution order of scripts.
  // See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script
  script.async = false;
  document.head.appendChild(script);
};

/** Fetch the resources for the Hypothesis client. */
function install() {
  var resources = [];
  if (typeof window.Annotator === 'undefined') {
    resources.push('/public/styles/icomoon.css?36ecbe');
    resources.push('/public/styles/inject.css?356cf8');
    resources.push('/public/styles/pdfjs-overrides.css?45a1ee');
    resources.push('/public/scripts/polyfills.bundle.js?4a465d');
    resources.push('/public/scripts/jquery.bundle.js?aa4179');
    resources.push('/public/scripts/injector.bundle.js?bb3e58');
  }

  resources.forEach(function (url) {
    if (url.match(/\.css/)) {
      injectStylesheet(url);
    } else {
      injectScript(url);
    }
  });
}

// Register the URL of the sidebar app which the Hypothesis client should load.
// The <link> tag is also used by browser extensions etc. to detect the
// presence of the Hypothesis client on the page.
var baseUrl = document.createElement('link');
baseUrl.rel = 'sidebar';
baseUrl.href = resolve('/public/app.html');
baseUrl.type = 'application/annotator+html';
document.head.appendChild(baseUrl);

install();

return {installedURL: baseUrl.href};
})();
