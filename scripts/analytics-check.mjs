import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

class FakeEventTarget {
  constructor() {
    this.listeners = new Map();
  }

  addEventListener(type, handler, options = {}) {
    const entries = this.listeners.get(type) || [];
    entries.push({ handler, once: Boolean(options?.once) });
    this.listeners.set(type, entries);
  }

  dispatchEvent(event) {
    const entries = [...(this.listeners.get(event.type) || [])];
    for (const entry of entries) {
      entry.handler.call(this, event);
      if (entry.once) {
        this.listeners.set(event.type, (this.listeners.get(event.type) || []).filter((candidate) => candidate !== entry));
      }
    }
    return true;
  }
}

class FakeCustomEvent {
  constructor(type, init = {}) {
    this.type = type;
    this.detail = init.detail;
  }
}

function storage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value))
  };
}

const source = await readFile(new URL('../analytics.js', import.meta.url), 'utf8');
const windowEvents = new FakeEventTarget();
const documentEvents = new FakeEventTarget();
const pageViews = [];

// app.js is loaded before analytics.js and registers the router first.
documentEvents.addEventListener('DOMContentLoaded', () => {
  windowEvents.dispatchEvent(new FakeCustomEvent('tribal:navigation', {
    detail: { route: 'home', path: '/' }
  }));
});

class FakeApplicationInsights {
  loadAppInsights() {}
  trackPageView(payload) { pageViews.push(payload); }
  trackEvent() {}
}

const location = {
  href: 'https://www.thetribalkavalounge.com/',
  hostname: 'www.thetribalkavalounge.com',
  pathname: '/',
  search: ''
};
const fakeWindow = {
  TRIBAL_SITE_CONFIG: {
    googleAnalyticsId: '',
    applicationInsightsConnectionString: 'InstrumentationKey=00000000-0000-0000-0000-000000000000'
  },
  Microsoft: { ApplicationInsights: { ApplicationInsights: FakeApplicationInsights } },
  location,
  addEventListener: windowEvents.addEventListener.bind(windowEvents),
  dispatchEvent: windowEvents.dispatchEvent.bind(windowEvents)
};
const fakeDocument = {
  readyState: 'interactive',
  title: 'Tribal Kava Lounge',
  addEventListener: documentEvents.addEventListener.bind(documentEvents),
  dispatchEvent: documentEvents.dispatchEvent.bind(documentEvents),
  createElement: () => ({}),
  head: { appendChild() {} }
};

vm.runInNewContext(source, {
  window: fakeWindow,
  document: fakeDocument,
  location,
  sessionStorage: storage(),
  localStorage: storage(),
  CustomEvent: FakeCustomEvent,
  URLSearchParams,
  console
}, { filename: 'analytics.js' });

assert.equal(pageViews.length, 0, 'deferred analytics must wait for the router while the document is interactive');
documentEvents.dispatchEvent(new FakeCustomEvent('DOMContentLoaded'));
assert.equal(pageViews.length, 1, 'initial router navigation must produce exactly one page view');
assert.equal(pageViews[0].properties.campaign_source, '(direct)');

windowEvents.dispatchEvent(new FakeCustomEvent('tribal:navigation', {
  detail: { route: 'menu', path: '/menu' }
}));
assert.equal(pageViews.length, 2, 'a later SPA navigation must still produce one additional page view');

console.log('Analytics checks passed.');
