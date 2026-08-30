/* Conversion and campaign tracking for Tribal Kava Lounge. */
(function () {
  'use strict';

  const config = window.TRIBAL_SITE_CONFIG || {};
  const measurementId = String(config.googleAnalyticsId || '').trim();
  const hasAnalytics = /^G-[A-Z0-9]+$/i.test(measurementId);
  const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const campaignStorageKey = 'tribal_campaign_attribution';

  function currentCampaign() {
    const params = new URLSearchParams(window.location.search);
    const incoming = {};
    campaignKeys.forEach((key) => {
      const value = params.get(key);
      if (value) incoming[key] = value.slice(0, 120);
    });

    if (Object.keys(incoming).length) {
      incoming.landing_page = window.location.pathname;
      incoming.captured_at = new Date().toISOString();
      sessionStorage.setItem(campaignStorageKey, JSON.stringify(incoming));
      localStorage.setItem(campaignStorageKey, JSON.stringify(incoming));
      return incoming;
    }

    try {
      return JSON.parse(sessionStorage.getItem(campaignStorageKey) || localStorage.getItem(campaignStorageKey) || '{}');
    } catch (_) {
      return {};
    }
  }

  const attribution = currentCampaign();

  if (hasAnalytics) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: false,
      transport_type: 'beacon'
    });

    const loader = document.createElement('script');
    loader.async = true;
    loader.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(loader);
  }

  function send(eventName, parameters) {
    const payload = Object.assign({
      page_location: window.location.href,
      page_path: `${window.location.pathname}${window.location.search}`,
      campaign_source: attribution.utm_source || '(direct)',
      campaign_medium: attribution.utm_medium || '(none)',
      campaign_name: attribution.utm_campaign || '(not set)'
    }, parameters || {});

    if (hasAnalytics && typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload);
    }

    window.dispatchEvent(new CustomEvent('tribal:conversion', {
      detail: { eventName, payload, analyticsConnected: hasAnalytics }
    }));
  }

  function conversionForLink(link) {
    const explicit = link.dataset.conversion;
    if (explicit) return explicit;

    const href = link.getAttribute('href') || '';
    if (href.startsWith('tel:')) return 'phone_call';
    if (href.startsWith('sms:')) return 'vip_sms';
    if (href.startsWith('mailto:')) return href.includes('event') ? 'event_inquiry' : 'email';
    if (/google\.[^/]+\/maps|maps\.google/i.test(href)) return 'directions';
    if (/instagram\.com/i.test(href)) return 'instagram';
    if (/\/private-events(?:$|[?#])/.test(href)) return 'event_interest';
    if (/\/events(?:$|[?#])/.test(href)) return 'events_view';
    if (/\/menu(?:$|[?#])/.test(href)) return 'menu_view';
    return '';
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;

    const conversion = conversionForLink(link);
    if (!conversion) return;

    const details = {
      conversion_type: conversion,
      link_url: link.href,
      link_text: (link.textContent || '').trim().slice(0, 100)
    };
    send(conversion, details);

    if (['phone_call', 'directions', 'vip_sms', 'vip_email', 'email', 'event_inquiry', 'event_interest'].includes(conversion)) {
      send('generate_lead', Object.assign({ lead_type: conversion }, details));
    }
  });

  function pageView() {
    send('page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: `${window.location.pathname}${window.location.search}`
    });
  }

  let routeEventSeen = false;
  window.addEventListener('tribal:navigation', () => {
    routeEventSeen = true;
    pageView();
  });
  window.tribalTrack = send;

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
      if (!routeEventSeen) pageView();
    }, { once: true });
  } else {
    pageView();
  }
})();
