// Isolated reproduction of Angular's unmodified IdleScheduler source.
// Node 22.23.2; uses built-in TypeScript stripping and mocked DI/browser callbacks.
// No Gemini account, conversation, browser extension, or AdGuard is involved.
import {stripTypeScriptTypes} from 'node:module';
import {runInNewContext} from 'node:vm';
import assert from 'node:assert/strict';

const revisions = {merged70730:'9486df5e26388e975dfc222902505c2e864636ef',backport221:'c3e8f29b3f898ee5377b0110683fe9dc2808c116',backport222:'e0cb4ae9dd034c87d2a9e6eee12c9626b2f0fe72'};

for (const [revision, sha] of Object.entries(revisions)) {
  const url = `https://raw.githubusercontent.com/angular/angular/${sha}/packages/core/src/defer/idle_scheduler.ts`;
  const response = await fetch(url);
  assert.equal(response.status, 200);
  // Only replace imports/exports to supply controlled dependencies. Scheduler body is unchanged.
  const source = (await response.text()).replace(/^import .*;\n/gm, '').replace(/^export /gm, '');
  const compiled = stripTypeScriptTypes(source);
  for (const errorSite of ['none', 'callback', 'tick']) {
    for (const mode of ['idle-deadline', 'timeout-fallback']) {
      const native = new Map();
      let nextId = 0, shouldThrow = true;
      const ran = [];
      const ApplicationRef = {}, NgZone = {}, IDLE_SERVICE = {};
      const error = new Error('synthetic render error');
      const dependencies = new Map([
        [ApplicationRef, {_tick() {
          if (errorSite === 'tick' && shouldThrow) { shouldThrow = false; throw error; }
        }}],
        [NgZone, {run: fn => fn()}],
        [IDLE_SERVICE, {
          requestOnIdle(fn) { native.set(++nextId, fn); return nextId; },
          cancelOnIdle(id) { native.delete(id); },
        }],
      ]);
      const Scheduler = runInNewContext(compiled + '\nIdleScheduler;', {
        ApplicationRef, NgZone, IDLE_SERVICE,
        inject: token => dependencies.get(token),
        ɵɵdefineInjectable: value => value,
      });
      const scheduler = new Scheduler();
      scheduler.add(() => {
        ran.push('first');
        if (errorSite === 'callback' && shouldThrow) { shouldThrow = false; throw error; }
      });
      scheduler.add(() => ran.push('second'));
      function fire() {
        const [id, fn] = native.entries().next().value;
        native.delete(id); // A browser callback is one-shot, even if it throws.
        fn(mode === 'idle-deadline' ? {timeRemaining: () => 50, didTimeout: false} : undefined);
      }
      if (errorSite === 'none') fire();
      else assert.throws(fire, value => value === error);
      scheduler.add(() => ran.push('later')); // Fresh work after the error.
      const scheduledAfterAdd = native.size;
      let budget = 10;
      while (native.size && budget-- > 0) fire();
      assert.ok(budget > 0);
      const bucket = scheduler.buckets.get('');
      const result = {
        revision, errorSite, mode, scheduledAfterAdd, ran,
        pending: bucket?.queue.size ?? 0,
        idleId: bucket?.idleId ?? null,
        callbackBookkeeping: scheduler.callbackBucket.size,
      };
      const regression = revision !== 'before' && errorSite !== 'none';
      assert.equal(ran.includes('later'), !regression);
      assert.equal(result.pending, regression ? 2 : 0);
      console.log(JSON.stringify(result));
      scheduler.ngOnDestroy();
    }
  }
}
