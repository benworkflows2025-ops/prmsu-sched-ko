/* ============================================================================
   PRMSU Schedule Maker - shared hearts + views, campus survey, welcome popup
   ----------------------------------------------------------------------------
   Adds a floating heart (like) button and a visits counter that EVERYONE
   shares, a one-time welcome popup inviting Ramonians to heart the tool and
   pick their campus, and a public "which campus uses this most" leaderboard
   for transparency. Nothing about your COR or schedule is ever sent here -
   only anonymous tallies (hearts, visits, and per-campus counts).

   If the network or backend is unavailable, the tool still works fully. The
   widget just shows the last numbers it knew (or a dash) and stays quiet.
   ========================================================================== */
(function () {
  'use strict';

  var SUPABASE_URL  = 'https://jxfjmufypjvdbeajwvxf.supabase.co';
  var SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4ZmptdWZ5cGp2ZGJlYWp3dnhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MzQxMjksImV4cCI6MjA5ODUxMDEyOX0.d4PVBSG2I0PZjmR7Ivm5xTbtlYAKZ-tW9oFiiBLowq4';
  var SITE = 'prmsu-sched';

  // When the hearts/visits/campus feature went live (shown on the board so
  // people know the numbers are new, not low from lack of interest).
  var SINCE = 'July 12, 2026';

  // PRMSU campuses (from the university's campus list). 'Other' is a catch-all.
  var BRANCHES = ['Iba (Main Campus)', 'Botolan', 'Candelaria', 'Castillejos',
                  'Masinloc', 'San Marcelino', 'Santa Cruz', 'Other'];
  var CAMPUSES = BRANCHES.slice(0, 7);   // the named campuses (always shown)

  var K = {
    hearted:  'sched_hearted',   // '1' once this browser has liked
    viewed:   'sched_viewed',    // '1' once this browser was counted as a visit
    surveyed: 'sched_surveyed',  // '1' once this browser's campus was recorded
    branch:   'sched_branch',    // remembered campus choice
    ch:       'sched_c_hearts',  // cached last-known counts (instant paint)
    cv:       'sched_c_views'
  };

  // The welcome popup keeps showing until the visitor actually ANSWERS - i.e.
  // hearts the tool or picks a campus. Just dismissing it ("Not now" / X) does
  // NOT count, so it will greet them again next visit.
  function hasAnswered() { return lg(K.hearted) === '1' || lg(K.surveyed) === '1'; }

  function lg(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function ls(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var CONFIGURED = /^https?:\/\//.test(SUPABASE_URL) && SUPABASE_ANON.length > 20;

  // --- tiny Supabase RPC helper (no library, no build step) -----------------
  function post(fn, body) {
    return fetch(SUPABASE_URL + '/rest/v1/rpc/' + fn, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON,
        'Authorization': 'Bearer ' + SUPABASE_ANON,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body || {})
    }).then(function (r) {
      if (!r.ok) throw new Error('rpc ' + fn + ' -> ' + r.status);
      return r.text();               // tolerate empty body (void functions)
    }).then(function (t) {
      return t ? JSON.parse(t) : null;
    });
  }
  function rpc(fn, body) {          // single-row functions
    return post(fn, body).then(function (rows) {
      return (Array.isArray(rows) ? rows[0] : rows) || null;
    });
  }
  function rpcAll(fn, body) {       // multi-row (the campus leaderboard)
    return post(fn, body).then(function (rows) { return Array.isArray(rows) ? rows : []; });
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // compact, friendly numbers: 1,234 ... 12.3k ... 1.2M
  function fmt(n) {
    n = Number(n) || 0;
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 10000)   return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return n.toLocaleString('en-US');
  }
  function shortName(b) {
    return b === 'Other' ? 'Other campus' : b.replace(' (Main Campus)', ' (Main)');
  }

  var HEART_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
  var EYE_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3"/></svg>';

  // ------------------------------------------------------------------ state --
  // null = "unknown yet" (paints as a dash, so offline never shows a fake 0).
  var _ch = lg(K.ch), _cv = lg(K.cv);
  var hearts  = _ch === null ? null : (Number(_ch) || 0);
  var views   = _cv === null ? null : (Number(_cv) || 0);
  var hearted = lg(K.hearted) === '1';
  var branch  = lg(K.branch) || '';
  var heartSeq = 0;               // guards out-of-order / superseded like requests

  // -------------------------------------------------------------- the widget -
  var fab = document.createElement('div');
  fab.className = 'stat-fab';
  fab.innerHTML =
    '<button type="button" class="sf-heart" id="sfHeart" aria-pressed="false" ' +
        'aria-label="Like this tool" title="Hearts since ' + esc(SINCE) + '. Tap to add yours.">' +
      HEART_SVG + '<span class="sf-n" id="sfHearts">–</span>' +
    '</button>' +
    '<div class="sf-views" id="sfViews" title="Visits since ' + esc(SINCE) + '">' +
      EYE_SVG + '<span class="sf-n" id="sfViewsN">–</span>' +
    '</div>';

  var heartBtn, heartN, viewsN;

  function paint() {
    if (!heartN) return;
    heartN.textContent = hearts === null ? '–' : fmt(hearts);
    viewsN.textContent = views  === null ? '–' : fmt(views);
    heartBtn.classList.toggle('on', hearted);
    heartBtn.setAttribute('aria-pressed', hearted ? 'true' : 'false');
  }

  function sync(c) {
    if (!c) return;
    if (typeof c.hearts === 'number') { hearts = c.hearts; ls(K.ch, hearts); }
    if (typeof c.views === 'number')  { views  = c.views;  ls(K.cv, views); }
    paint();
  }

  // toggle the like. want = true to heart, false to un-heart.
  // Each tap is a self-consistent toggle; a per-tap token makes sure only the
  // NEWEST tap's response (or failure) can touch shared state - so rapid taps
  // on a flaky network can't drift the count or flip the icon the wrong way.
  function setLike(want) {
    if (want === hearted) return;
    var delta = want ? 1 : -1;

    // optimistic UI first (feels instant, works even offline)
    hearted = want;                              ls(K.hearted, want ? '1' : '0');
    hearts  = Math.max(0, (hearts || 0) + delta); ls(K.ch, hearts);
    paint();
    if (want) {
      heartBtn.classList.add('pop');
      setTimeout(function () { heartBtn.classList.remove('pop'); }, 420);
    }

    if (!CONFIGURED) return;
    var mySeq = ++heartSeq;
    rpc('bump_heart', { p_site: SITE, p_delta: delta, p_branch: branch || null })
      .then(function (c) { if (mySeq === heartSeq) sync(c); })   // ignore stale replies
      .catch(function () {
        if (mySeq !== heartSeq) return;          // a newer tap superseded this one
        hearted = !want;                              ls(K.hearted, hearted ? '1' : '0');
        hearts  = Math.max(0, (hearts || 0) - delta); ls(K.ch, hearts);
        paint();
        // reconcile with the authoritative count so it can't linger off-by-one
        rpc('get_counters', { p_site: SITE })
          .then(function (c) { if (mySeq === heartSeq) sync(c); })
          .catch(function () {});
      });
  }

  // --------------------------------------------------------- the welcome pop -
  var modal = document.createElement('div');
  modal.className = 'sf-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Hi there, Ramonian!');
  modal.innerHTML =
    '<div class="sf-back" data-close="1"></div>' +
    '<div class="sf-card">' +
      '<button type="button" class="sf-xbtn" data-close="1" aria-label="Close">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>' +
      '</button>' +
      '<div class="sf-view sf-ask">' +
        '<div class="sf-emoji">💙</div>' +
        '<h2 class="sf-title">Hi there, Ramonian!</h2>' +
        '<p class="sf-text">This tool is free and made by a fellow student. ' +
          'If it helped you, tap the <b>heart</b> so we know it is being used, and to support the maker.</p>' +
        '<div class="sf-blabel">Which campus are you from?</div>' +
        '<div class="sf-branches" id="sfBranches"></div>' +
        '<div class="sf-actions">' +
          '<button type="button" class="btn ghost" data-close="1">Not now</button>' +
          '<button type="button" class="btn" id="sfLike">' + HEART_SVG + ' Heart &amp; support</button>' +
        '</div>' +
        '<p class="sf-mini">No login. You are not tracked. Your COR stays on your phone.</p>' +
      '</div>' +
      '<div class="sf-view sf-thanks" hidden>' +
        '<div class="sf-emoji">🎉</div>' +
        '<h2 class="sf-title">Thank you, Ramonian!</h2>' +
        '<p class="sf-text" id="sfThanksText">You are the best. Good luck with your studies. 💙</p>' +
      '</div>' +
    '</div>';

  function buildBranchChips() {
    var host = modal.querySelector('#sfBranches');
    host.innerHTML = '';
    BRANCHES.forEach(function (b) {
      var el = document.createElement('button');
      el.type = 'button';
      el.className = 'sf-branch' + (b === branch ? ' sel' : '');
      el.textContent = b === 'Other' ? 'Other campus' : b;
      el.setAttribute('data-branch', b);
      el.setAttribute('aria-pressed', b === branch ? 'true' : 'false');
      el.onclick = function () {
        branch = b; ls(K.branch, b);
        Array.prototype.forEach.call(host.children, function (c) {
          var on = c.getAttribute('data-branch') === b;
          c.classList.toggle('sel', on);
          c.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
      };
      host.appendChild(el);
    });
  }

  // ---- accessible modal: focus in, trap Tab, inert the background ----------
  var lastFocus = null;
  function bgEls() {
    return Array.prototype.filter.call(document.body.children, function (el) { return el !== modal; });
  }
  function focusables() {
    return modal.querySelectorAll('.sf-view:not([hidden]) button, .sf-xbtn');
  }
  function openWelcome() {
    buildBranchChips();
    lastFocus = document.activeElement;
    modal.classList.add('show');
    bgEls().forEach(function (el) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); });
    var x = modal.querySelector('.sf-xbtn'); if (x) x.focus();
  }
  function releaseModal() {
    bgEls().forEach(function (el) { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); });
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  }

  // Record the campus pick once per browser (anonymous - just a per-campus
  // tally shown publicly on the site). Fires whether they hearted or closed.
  function submitSurveyOnce() {
    if (!CONFIGURED || !branch || lg(K.surveyed) === '1') return;
    ls(K.surveyed, '1');
    post('submit_survey', { p_site: SITE, p_branch: branch })
      .then(function () { setTimeout(loadBoard, 400); })
      .catch(function () { ls(K.surveyed, '0'); });   // let it retry next time
  }

  function closeWelcome() {
    submitSurveyOnce();          // if they picked a campus, that counts as answered
    modal.classList.remove('show');
    releaseModal();
  }

  function thankAndClose() {
    submitSurveyOnce();          // record their campus too, not just the heart
    var ask = modal.querySelector('.sf-ask');
    var thx = modal.querySelector('.sf-thanks');
    var txt = modal.querySelector('#sfThanksText');
    if (txt && branch && branch !== 'Other') {
      txt.textContent = 'One more Ramonian from ' + branch.replace(' (Main Campus)', '') +
                        ' supporting this. 💙';
    }
    if (ask) ask.hidden = true;
    if (thx) thx.hidden = false;
    setTimeout(function () { modal.classList.remove('show'); releaseModal(); }, 1600);
  }

  // ------------------------------------------------- public campus board -----
  function loadBoard() {
    if (!CONFIGURED) return;
    rpcAll('get_survey', { p_site: SITE }).then(renderBoard).catch(function () {});
  }

  function renderBoard(rows) {
    var foot = document.querySelector('.foot');
    var existing = document.getElementById('sfBoard');
    if (!foot) { if (existing) existing.parentNode.removeChild(existing); return; }

    // index the real counts by campus
    var byBranch = {};
    (rows || []).forEach(function (r) { if (r && r.branch) byBranch[r.branch] = r; });

    // always list every named campus (0 where there is no activity yet)...
    var list = CAMPUSES.map(function (b) {
      var r = byBranch[b] || {};
      return { branch: b, responses: Number(r.responses) || 0, hearts: Number(r.hearts) || 0 };
    });
    // ...plus "Other" only if real people actually used it
    var other = byBranch['Other'];
    if (other && Number(other.responses) > 0) {
      list.push({ branch: 'Other', responses: Number(other.responses) || 0, hearts: Number(other.hearts) || 0 });
    }

    list.sort(function (a, b) { return b.responses - a.responses || (b.hearts - a.hearts); });
    var max = Math.max(1, list[0] ? list[0].responses : 1);

    var items = list.map(function (r, i) {
      var pct = r.responses > 0 ? Math.max(7, Math.round(r.responses / max * 100)) : 0;
      var lead = i === 0 && r.responses > 0;    // don't crown a campus that is still at 0
      return '<li class="sf-row' + (lead ? ' lead' : '') + '">' +
        '<span class="sf-rk">' + (i + 1) + '</span>' +
        '<span class="sf-nm">' + esc(shortName(r.branch)) + '</span>' +
        '<span class="sf-track"><i style="width:' + pct + '%"></i></span>' +
        '<span class="sf-ct">' + fmt(r.responses) +
          (r.hearts ? ' <span class="sf-ch">' + fmt(r.hearts) + '♥</span>' : '') +
        '</span>' +
      '</li>';
    }).join('');

    var sec = existing || document.createElement('section');
    sec.id = 'sfBoard';
    sec.className = 'sf-board';
    sec.innerHTML =
      '<div class="sf-board-card">' +
        '<div class="sf-board-h">Which campus uses this the most? 💙</div>' +
        '<div class="sf-board-new">Fresh feature, I only added this on ' + esc(SINCE) +
          ', so the counts are still small and climbing.</div>' +
        '<ol class="sf-board-list">' + items + '</ol>' +
        '<div class="sf-board-n">Anonymous: based on who picked their campus in the welcome popup. No names, just a count per campus.</div>' +
      '</div>';
    if (!existing) foot.parentNode.insertBefore(sec, foot);
  }

  // ---------------------------------------------------------------- wire up --
  function boot() {
    document.body.appendChild(fab);
    document.body.appendChild(modal);
    document.body.classList.add('has-fab');   // lets CSS add bottom clearance on mobile

    heartBtn = document.getElementById('sfHeart');
    heartN   = document.getElementById('sfHearts');
    viewsN   = document.getElementById('sfViewsN');

    heartBtn.addEventListener('click', function () { setLike(!hearted); });

    // popup: any [data-close] element dismisses; the heart button likes + thanks
    modal.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-close]') : null;
      if (t) closeWelcome();
    });
    modal.querySelector('#sfLike').addEventListener('click', function () {
      setLike(true);          // registers the heart for the chosen campus
      thankAndClose();
    });
    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('show')) return;
      if (e.key === 'Escape') { closeWelcome(); return; }
      if (e.key === 'Tab') {   // keep focus inside the dialog
        var f = focusables(); if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    paint();

    if (CONFIGURED) {
      var firstView = lg(K.viewed) !== '1';
      if (firstView) ls(K.viewed, '1');    // claim synchronously (no cross-tab double count)
      (firstView ? rpc('bump_view', { p_site: SITE })
                 : rpc('get_counters', { p_site: SITE }))
        .then(function (c) { sync(c); })
        .catch(function () { if (firstView) ls(K.viewed, '0'); });   // let a later load retry
      loadBoard();
    }

    // Greet the visitor until they actually answer (heart or pick a campus).
    // Dismissing without answering means they will be greeted again next visit.
    if (!hasAnswered()) {
      setTimeout(openWelcome, 900);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
