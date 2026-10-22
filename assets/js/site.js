/*
  The site's own script. Loaded on every page from _includes/footer/custom.html,
  after the display-preferences library (Infusion) and before Minimal Mistakes'
  script. The page content is already there when it runs.
  Styles for everything here are in _sass/portfolio/_custom.scss.

  1. Display preferences and light/dark
  2. "Back to top" button
  3. Collapsible "On this page" on narrow screens
  4. Open collapsed sections (<details>) that a link points to
  5. Mark links that open in a new tab
*/
(function () {
  'use strict';

  /* Address of the assets folder, worked out from this file's own address
     (".../assets/js/site.js"), so the Infusion paths below stay right */
  var assets = new URL('../', document.currentScript.src).pathname;

  /* ======================================================================
     1. Display preferences (Fluid Infusion UI Options) and light/dark
     The button, panel, Dark/Light and Reset are in _includes/masthead.html.
     - Readers can change text size, font, line, letter and word spacing,
       colour contrast, make buttons and form fields bigger, and turn on
       text-to-speech. Choices apply to every page (kept in a browser cookie).
     - Text-to-speech uses the browser's own voices. A play button appears at
       the top of the page and reads the page content, not menus or footer.
     - The panels are only downloaded the first time someone opens them.
     - Reset only resets display preferences, not light/dark.
     - The settings cards sit in one row: as many as fit (up to 3), with
       Previous / Next to move through the rest (see settingsPager below).
     ====================================================================== */
  var prefs = document.getElementById('site-prefs');

  /* Previous / Next for the settings cards (buttons in masthead.html, layout
     in _custom.scss, "Settings cards in one row").
     - Shows as many cards as fit at least 15rem wide, up to 3. Bigger text
       (the Text size setting) means fewer cards per view.
     - Previous / Next move a whole view at a time. At either end the button
       stays focusable but does nothing (aria-disabled), so keyboard focus
       isn't lost.
     - Tabbing into a card that's out of view scrolls it into view (the
       browser does this), so every setting is reachable with Tab alone.
     - Swiping or trackpad scrolling works too; the cards snap into place.
     - After a press, screen readers hear which settings are showing. */
  function settingsPager() {
    var pager = document.getElementById('site-prefs-pager');
    var scroller = prefs.querySelector('.flc-prefsEditor-scrollContainer');
    var list = scroller && scroller.querySelector('.fl-prefsEditor-panels');
    var cards = list ? list.querySelectorAll('.fl-prefsEditor-panel') : [];
    if (!pager || !cards.length) return;

    var prev = pager.querySelector('.site-prefs-pager__prev');
    var next = pager.querySelector('.site-prefs-pager__next');
    var status = pager.querySelector('.site-prefs-pager__status');
    var live = pager.querySelector('.site-prefs-pager__live');
    var total = cards.length;
    var perView = 1;

    if (scroller.id) {
      prev.setAttribute('aria-controls', scroller.id);
      next.setAttribute('aria-controls', scroller.id);
    }

    function px(el, prop) { return parseFloat(getComputedStyle(el)[prop]) || 0; }

    /* How many cards fit, at the current text size */
    function fit() {
      var gap = px(list, 'columnGap');
      var room = list.clientWidth - px(list, 'paddingLeft') - px(list, 'paddingRight');
      var min = 15 * px(document.documentElement, 'fontSize');
      perView = Math.max(1, Math.min(3, Math.floor((room + gap) / (min + gap))));
      list.style.setProperty('--per-view', perView);
    }

    /* Where each card starts, measured from the first card */
    function start(i) { return cards[i].offsetLeft - cards[0].offsetLeft; }

    /* The first card in view: the one whose start is closest */
    function first() {
      var best = 0;
      for (var i = 1; i < total; i++) {
        if (Math.abs(start(i) - scroller.scrollLeft) < Math.abs(start(best) - scroller.scrollLeft)) best = i;
      }
      return best;
    }

    function describe(f) {
      var last = Math.min(f + perView, total);
      return (perView === 1 || f + 1 === last ? (f + 1) : (f + 1) + '–' + last) + ' of ' + total;
    }

    function update() {
      var f = first();
      status.textContent = describe(f);
      prev.setAttribute('aria-disabled', String(f <= 0));
      next.setAttribute('aria-disabled', String(f + perView >= total));
    }

    function go(direction) {
      var button = direction < 0 ? prev : next;
      if (button.getAttribute('aria-disabled') === 'true') return;
      var target = Math.max(0, Math.min(total - perView, first() + direction * perView));
      var smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      scroller.scrollTo({ left: start(target), behavior: smooth ? 'smooth' : 'auto' });
      live.textContent = 'Showing settings ' + describe(target).replace('–', ' to ');
    }

    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', function () { go(1); });

    /* Tabbing into a card that's partly or wholly out of view: the browser
       only scrolls far enough to show the focused control, so line up the
       whole card instead (and keep "1–3 of 8" right) */
    scroller.addEventListener('focusin', function (e) {
      var card = e.target.closest('.fl-prefsEditor-panel');
      if (!card) return;
      var i = Array.prototype.indexOf.call(cards, card);
      var box = card.getBoundingClientRect();
      var view = scroller.getBoundingClientRect();
      var pad = px(list, 'paddingLeft');
      var target = null;
      if (box.left < view.left + pad - 1) target = i;
      else if (box.right > view.right - pad + 1) target = i - perView + 1;
      if (target !== null) {
        scroller.scrollLeft = start(Math.max(0, Math.min(total - perView, target)));
      }
      update();
    });

    var queued = false;
    scroller.addEventListener('scroll', function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; update(); });
    }, { passive: true });

    /* Work it out again when the row changes width (the panel opening, the
       window resizing) or the Text size setting changes (it's set on <html>) */
    function refit() { fit(); update(); }
    new ResizeObserver(refit).observe(scroller);
    new MutationObserver(refit).observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] });

    pager.hidden = false;
    refit();
  }

  if (prefs && window.fluid && fluid.uiOptions) {
    /* Text-to-speech: read the page content, play button at the top. Pages
       without .page__content (like the home page) get no play button. */
    var wrap = document.querySelector('.page__inner-wrap');
    var content = document.querySelector('.page__content');
    if (wrap && content) {
      wrap.classList.add('flc-prefs-selfVoicingWidget');
      content.classList.add('flc-orator-content');
    }

    /* Extra contrast theme, second in the list: dark brown on sand. Colours
       in _custom.scss ("fl-theme-sand"); name in
       assets/display-preferences/contrast.json. */
    var themes = ['default', 'sand', 'bw', 'wb', 'by', 'yb', 'lgdg', 'gw', 'gd', 'bbr'];
    fluid.defaults('fluid.prefs.schemas.contrast', {
      gradeNames: ['fluid.prefs.schemas'],
      schema: {
        'fluid.prefs.contrast': {
          type: 'string',
          'default': 'default',
          'enum': themes,
          enumLabels: themes.map(function (t) { return 'contrast-' + t; })
        }
      }
    });

    /* Infusion scrolls back to the first card on Reset, but measures from the
       edge of the page rather than the row of cards, so with the row centred
       on wide screens it lands in the wrong place. Measure from the first
       card instead. */
    fluid.prefs.arrowScrolling.scrollToPanel = function (that, index) {
      var cards = that.locate('panels');
      var scroller = that.locate('scrollContainer')[0];
      var card = cards[index || 0];
      if (scroller && card && card.offsetWidth) scroller.scrollLeft = card.offsetLeft - cards[0].offsetLeft;
    };

    fluid.uiOptions(prefs, {
      preferences: [
        'fluid.prefs.textSize',
        'fluid.prefs.textFont',
        'fluid.prefs.lineSpace',
        'fluid.prefs.letterSpace',
        'fluid.prefs.wordSpace',
        'fluid.prefs.contrast',
        'fluid.prefs.enhanceInputs',
        'fluid.prefs.speak'
      ],
      auxiliarySchema: {
        terms: {
          templatePrefix: assets + 'infusion/src/framework/preferences/html',
          messagePrefix: assets + 'infusion/src/framework/preferences/messages'
        },
        'fluid.prefs.contrast': {
          enactor: { classes: { sand: 'fl-theme-sand' } },
          panel: {
            classnameMap: { theme: { sand: 'fl-theme-sand' } },
            message: assets + 'display-preferences/contrast.json'
          }
        },
        'fluid.prefs.speak': {
          enactor: {
            orator: {
              controller: { strings: { play: 'Read this page aloud', pause: 'Pause reading' } }
            }
          }
        }
      },
      listeners: {
        onPrefsEditorReady: settingsPager   /* the cards are drawn (first time the panel opens) */
      },
      prefsEditorLoader: {
        lazyLoad: true,
        slidingPanel: {
          strings: {
            showText: '+ Show preferences',
            hideText: '− Hide preferences',
            showTextAriaLabel: 'Show preferences',
            hideTextAriaLabel: 'Hide preferences',
            panelLabel: 'Display preferences'
          }
        }
      }
    });
  } else {
    /* Infusion didn't load: hide "Show preferences", and move Dark/Light into
       the header on its own (Previous / Next and Reset can't work without
       Infusion) */
    var showPrefs = document.querySelector('.flc-slidingPanel-toggleButton');
    var toolbar = document.getElementById('site-prefs-toolbar');
    var tools = document.querySelector('.masthead__tools');
    if (showPrefs) showPrefs.hidden = true;
    if (toolbar && tools) {
      toolbar.querySelectorAll('#site-prefs-pager, .flc-prefsEditor-reset').forEach(function (el) { el.remove(); });
      tools.appendChild(toolbar);
    }
  }

  /* Light/dark. Light is the default; choosing Dark is remembered in the
     browser (localStorage). The early part, which switches a saved choice on
     before the page is drawn, is in _includes/head/custom.html. */
  (function () {
    var button = document.querySelector('.js-theme-toggle');
    var light = document.getElementById('theme-light');
    var dark = document.getElementById('theme-dark');
    if (!button) return;
    if (!light || !dark) { button.hidden = true; return; }

    function show(isDark) {
      dark.media = isDark ? 'all' : 'not all';
      light.media = isDark ? 'not all' : 'all';
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      var next = isDark ? 'Light' : 'Dark';
      button.textContent = next;
      button.setAttribute('aria-label', 'Switch to ' + next.toLowerCase() + ' mode');
    }

    button.addEventListener('click', function () {
      var isDark = document.documentElement.getAttribute('data-theme') !== 'dark';
      show(isDark);
      try {
        if (isDark) localStorage.setItem('theme', 'dark');
        else localStorage.removeItem('theme');
      } catch (e) {}
    });

    show(document.documentElement.getAttribute('data-theme') === 'dark');
  })();

  /* ======================================================================
     2. "Back to top" (markup in _includes/footer/custom.html)
     It appears once you scroll.
     - Wide screens (1024px+), page with an "On this page" box: in the
       right-hand column just below the box, sticking with it.
     - Wide screens, no "On this page" box: floating at the bottom of the
       screen, lined up with the right-hand column.
     - Narrow screens and pages without that column (like the home page):
       floating in the bottom-right corner.
     - Short screens or high zoom: stays at the end of the page, always shown.
     ====================================================================== */
  (function () {
    var bar = document.getElementById('page-nav');
    if (!bar) return;

    var home = bar.parentNode;              /* where it starts: the footer */
    var homeNext = bar.nextSibling;
    var page = document.querySelector('.layout--single .page');
    var sidebar = document.querySelector('.sidebar__right');
    var wide = window.matchMedia('(min-width: 1024px)');   /* Minimal Mistakes' "large" */
    var floats = window.matchMedia('(min-height: 30rem)'); /* must match _custom.scss */

    function place() {
      bar.classList.remove('page-nav--sidebar', 'page-nav--column');
      bar.style.left = '';

      /* The "On this page" box is hidden by CSS when it's empty */
      if (wide.matches && floats.matches && sidebar && getComputedStyle(sidebar).display !== 'none') {
        if (bar.parentNode !== sidebar) sidebar.appendChild(bar);
        bar.classList.add('page-nav--sidebar');
        return;
      }

      if (bar.parentNode !== home) home.insertBefore(bar, homeNext);

      /* Line it up with the right-hand column, which the page keeps free as
         padding on its right-hand side */
      if (wide.matches && page) {
        var column = parseFloat(getComputedStyle(page).paddingRight) || 0;
        if (column > 0) {
          var gap = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
          bar.style.left = (page.getBoundingClientRect().right - column + gap) + 'px';
          bar.classList.add('page-nav--column');
        }
      }
    }

    function update() {
      var show = !floats.matches || window.scrollY > 0;
      bar.classList.toggle('is-visible', show);
      bar.inert = !show;                    /* hidden: out of reach of Tab and screen readers */
    }

    function both() { place(); update(); }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', both);
    floats.addEventListener('change', both);
    wide.addEventListener('change', both);

    /* Start floating with the fade switched off, so the button (already drawn
       at the end of the page by now) disappears at once instead of fading
       out on every page load. The fade comes back for scrolling. */
    bar.style.transition = 'none';
    document.documentElement.classList.add('page-nav-floating');
    both();
    void bar.offsetWidth;                   /* apply that state now, before the fade returns */
    bar.style.transition = '';
  })();

  /* ======================================================================
     3. Collapsible "On this page" on narrow screens
     Below 1024px the theme moves the box above the content. There its title
     becomes a button that shows or hides the list, starting collapsed. Wide
     screens keep the usual open box. Without JavaScript the list always shows.
     ====================================================================== */
  (function () {
    var toc = document.querySelector('.sidebar__right .toc');
    var title = toc && toc.querySelector('.nav__title');
    var menu = toc && toc.querySelector('.toc__menu');
    if (!title || !menu) return;

    menu.id = menu.id || 'toc-menu';
    var label = title.innerHTML;            /* the icon and "On this page" */

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'toc__toggle';
    button.setAttribute('aria-controls', menu.id);
    button.innerHTML = label;

    var narrow = window.matchMedia('(max-width: 1023.98px)');
    var open = false;

    function apply() {
      if (narrow.matches) {
        if (button.parentNode !== title) {   /* heading keeps its level; button goes inside */
          title.textContent = '';
          title.appendChild(button);
        }
        button.setAttribute('aria-expanded', String(open));
      } else if (button.parentNode === title) {
        title.innerHTML = label;
      }
      var collapsed = narrow.matches && !open;
      menu.hidden = collapsed;
      toc.classList.toggle('toc--collapsed', collapsed);
    }

    button.addEventListener('click', function () {
      open = !open;
      apply();
    });

    /* Choosing a link on a narrow screen closes the list again */
    menu.addEventListener('click', function (e) {
      if (narrow.matches && e.target.closest('a')) {
        open = false;
        apply();
      }
    });

    narrow.addEventListener('change', apply);
    apply();
  })();

  /* ======================================================================
     4. Open collapsed sections (<details>) when a link points to one, or to
     anything inside one, from this page or another. Also opens any sections
     it's nested in.
     ====================================================================== */
  (function () {
    function openTarget() {
      var id;
      try { id = decodeURIComponent(location.hash.slice(1)); } catch (e) { return; }
      var target = id && document.getElementById(id);
      if (!target) return;

      var opened = false;
      for (var section = target.closest('details'); section; section = section.parentElement.closest('details')) {
        if (!section.open) { section.open = true; opened = true; }
      }
      if (opened) target.scrollIntoView();
    }

    openTarget();
    window.addEventListener('hashchange', openTarget);

    /* Minimal Mistakes' smooth scrolling changes the address without a
       "hashchange", and clicking a link to where you already are changes
       nothing, so check again after any click on a same-page link */
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href*="#"]');
      if (link && link.pathname === location.pathname) setTimeout(openTarget, 0);
    });
  })();

  /* ======================================================================
     5. Links that open in a new tab get a small icon, plus "(opens in new
     tab)" for screen readers:
     - links in page content to another website (also set to open in a new
       tab), and
     - any link already set to open in a new tab (for example target:
       "_blank" in _data/navigation.yml).
     Image links are left alone.
     ====================================================================== */
  (function () {
    var icon =
      '<svg class="ext-link-icon" viewBox="0 0 12 12" aria-hidden="true" focusable="false" ' +
      'fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M5 2H2.5a1 1 0 0 0-1 1v6.5a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1V7"/>' +
      '<path d="M6 6l4.5-4.5"/><path d="M7 1.5h3.5V5"/></svg>' +
      '<span class="visually-hidden"> (opens in new tab)</span>';

    document.querySelectorAll('.page__content a[href^="http"], a[target="_blank"]').forEach(function (a) {
      if (a.target !== '_blank' && a.hostname === location.hostname) return;  /* same site */
      if (a.querySelector('img')) return;
      a.target = '_blank';
      a.relList.add('noopener');
      a.insertAdjacentHTML('beforeend', icon);
    });
  })();
})();
