// ==UserScript==
// @name         Gemini attachment menu compatibility
// @namespace    local.gemini.attachment-repair
// @version      1.2.0
// @description  Guard empty legacy citation cards and recover Gemini's stalled attachment-menu loading.
// @match        https://gemini.google.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/* Local workaround, not an upstream Gemini or Angular fix.
 * Recognizes the observed template structure instead of one build's renamed
 * identifiers. Unknown structures remain untouched. Only empty DEEP_RESEARCH
 * citation widgets are omitted; their signals are still read by the template.
 * No messages, source data, network requests, or account settings are modified.
 * This script sends no data and stores no conversation content.
 */
(function () {
  'use strict';
  const selectorOf = definition => definition && Object.values(definition).some(value =>
    Array.isArray(value) && value.some(row => Array.isArray(row) && row[0] === 'source-inline-chip'));

  function describeTemplate(definition) {
    if (!selectorOf(definition) || typeof definition.template !== 'function') return null;
    const source = Function.prototype.toString.call(definition.template).replace(/\s+/g, '');
    // Bind renamed signal and conditional identifiers only in the exact observed structure.
    const match = source.match(/function\(([\w$]+),([\w$]+)\)\{[\s\S]*\1&2&&\(\1=_\.([\w$]+)\(_\.([\w$]+)\(1,1,\2\.([\w$]+)\)\),_\.([\w$]+)\(2\),_\.\3\(_\.\4\(3,4,\2\.([\w$]+)\)\),_\.\6\(2\),_\.([\w$]+)\(\1\.length>0\?4:-1\)\)\}$/);
    return match ? { cardsKey: match[7], choiceKey: match[8] } : null;
  }
  function describeDispatch(api, descriptor) {
    const choose = api[descriptor.choiceKey];
    if (typeof choose !== 'function') return null;
    const match = String(choose).match(/(?:var|let|const)\s+[\w$]+\s*=\s*_\.([\w$]+)\(\),/);
    if (!match || typeof api[match[1]] !== 'function' ||
        !/^function\(\)\{return _\.[\w$]+\.[\w$]+\}$/.test(String(api[match[1]]))) return null;
    return { ...descriptor, viewKey: match[1] };
  }
  function makeGuard(api, original, descriptor) {
    return function guardedSourceTemplate(flags, context) {
      if (!(flags & 2)) return original.call(this, flags, context);
      const cards = context[descriptor.cardsKey]();
      const sources = context.sources();
      const affected = Array.isArray(cards) && cards.length === 0 &&
        Array.isArray(sources) && sources.length > 0 &&
        sources.every(source => source && Object.values(source).includes('DEEP_RESEARCH'));
      if (!affected) return original.call(this, flags, context);
      const view = api[descriptor.viewKey](), choose = api[descriptor.choiceKey];
      api[descriptor.choiceKey] = function guardedChoice(index, ...rest) {
        return choose.call(this, api[descriptor.viewKey]() === view && index === 4 ? -1 : index, ...rest);
      };
      try { return original.call(this, flags, context); }
      finally { api[descriptor.choiceKey] = choose; }
    };
  }
  function findViewMap(api, element) {
    const candidates = Object.values(api).filter(value => value instanceof Map &&
      Array.isArray(value.get(element.__ngContext__)) &&
      value.get(element.__ngContext__).some(instance => instance?.constructor &&
        Object.values(instance.constructor).some(selectorOf)));
    return candidates.length === 1 ? candidates[0] : null;
  }
  function describeScheduler(scheduler) {
    if (!scheduler || typeof scheduler.add !== 'function') return null;
    const maps = Object.values(scheduler).filter(value => value instanceof Map && value.size &&
      [...value.values()].every(group => group && group.queue instanceof Set));
    const apps = Object.values(scheduler).filter(value => value &&
      typeof value.tick === 'function' && Array.isArray(value.components));
    const clocks = Object.values(scheduler).filter(value => value &&
      typeof value.cancelIdleCallback === 'function');
    if (maps.length !== 1 || apps.length !== 1 || clocks.length !== 1) return null;
    const groups = [];
    for (const [key, group] of maps[0]) {
      if (key !== '' && !/^\d+(?:\.\d+)?$/.test(key)) return null;
      const keys = Object.keys(group).filter(k => k !== 'queue');
      if (keys.length !== 1 || (group[keys[0]] !== null && typeof group[keys[0]] !== 'number')) return null;
      groups.push({ key, group, handleKey: keys[0] });
    }
    return { groups, app: apps[0], clock: clocks[0] };
  }
  function recoverScheduler(scheduler, descriptor) {
    descriptor.app.tick(); // Must succeed before changing pending handles.
    let recovered = 0;
    for (const { key, group, handleKey } of descriptor.groups) {
      if (!group.queue.size) continue;
      if (group[handleKey] !== null) descriptor.clock.cancelIdleCallback(group[handleKey]);
      group[handleKey] = null;
      scheduler.add(group.queue.values().next().value,
        key === '' ? undefined : { timeout: Number(key) });
      recovered++;
    }
    return recovered;
  }
  if (typeof module === 'object' && module.exports && typeof window === 'undefined') {
    module.exports = { describeTemplate, describeDispatch, makeGuard, findViewMap, describeScheduler, recoverScheduler };
    return;
  }
  if (window.top !== window || location.origin !== 'https://gemini.google.com' ||
      window.__geminiAttachmentCompatibility) return;
  const status = { version: '1.2.0', patchedTemplates: 0, recoveredQueues: 0,
    incompatibleTemplates: 0, recoveryErrors: 0 };
  Object.defineProperty(window, '__geminiAttachmentCompatibility', { value: status });
  const handled = new WeakSet();
  let scheduled = false;
  function recover(api, injector) {
    try {
      const tokens = Object.values(api).filter(value => typeof value === 'function' &&
        typeof value.prototype?.add === 'function' && typeof value.prototype?.remove === 'function' &&
        String(value).includes('.queue.add(') && String(value).includes('.cancelIdleCallback('));
      if (tokens.length !== 1 || typeof injector?.get !== 'function') return;
      const scheduler = injector.get(tokens[0]), descriptor = describeScheduler(scheduler);
      if (descriptor) status.recoveredQueues += recoverScheduler(scheduler, descriptor);
    } catch (_) { status.recoveryErrors++; }
  }
  function inspect() {
    scheduled = false;
    const api = window.default_BardChatUi;
    if (!api) return;
    let injector, changed = false;
    for (const element of document.querySelectorAll('source-inline-chip')) {
      const views = findViewMap(api, element), host = views?.get(element.__ngContext__);
      if (!host) continue;
      const definitions = host.flatMap(instance => instance?.constructor ?
        Object.values(instance.constructor).filter(selectorOf) : []);
      for (const definition of new Set(definitions)) {
        if (handled.has(definition)) continue;
        handled.add(definition);
        const template = describeTemplate(definition);
        const descriptor = template && describeDispatch(api, template);
        if (!descriptor) {
          status.incompatibleTemplates++;
          continue;
        }
        const original = definition.template, guarded = makeGuard(api, original, descriptor);
        definition.template = guarded;
        for (const view of views.values()) {
          if (Array.isArray(view) && view[1]?.template === original) view[1].template = guarded;
        }
        injector = host[9]; status.patchedTemplates++; changed = true;
      }
    }
    if (changed) recover(api, injector);
  }
  function schedule() { if (!scheduled) { scheduled = true; setTimeout(inspect, 0); } }
  new MutationObserver(records => {
    if (records.some(record => [...record.addedNodes].some(node => node.nodeType === 1 &&
      (node.matches('source-inline-chip') || node.querySelector('source-inline-chip'))))) schedule();
  }).observe(document, { childList: true, subtree: true });
  schedule();
  document.addEventListener('DOMContentLoaded', schedule, { once: true });
})();
