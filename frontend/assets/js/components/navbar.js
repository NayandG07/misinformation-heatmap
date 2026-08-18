import { createElement, qs, replaceChildren, setText } from '../utils/dom.js';
import { ROUTES } from './hamburger.js';
import { createStatPanel, STATUS_CLASSES } from './ui.js';
import { mountBottomNavbar } from './bottomNavbar.js';

function createDesktopLink(route, activeRoute) {
  const active = route.key === activeRoute || (activeRoute === 'home' && route.key === 'home');
  return createElement('a', {
    className: `nav-link ${active ? 'active' : ''}`,
    style: `display: inline-flex; align-items: center; justify-content: center; height: 38px; padding: 0 16px; font-size: 0.88rem; font-weight: ${active ? '700' : '600'}; color: ${active ? '#E87722' : '#475569'}; background: ${active ? 'rgba(232, 119, 34, 0.1)' : 'transparent'}; border: ${active ? '1px solid rgba(232, 119, 34, 0.3)' : '1px solid transparent'}; border-radius: 10px; text-decoration: none; white-space: nowrap; transition: all 0.2s; cursor: pointer; box-sizing: border-box;`,
    text: route.label,
    attrs: {
      href: route.href,
      ...(active ? { 'aria-current': 'page' } : {})
    }
  });
}

function createStatsPopover() {
  const popover = createElement('div', {
    className: 'absolute right-0 top-full z-50 mt-3 hidden w-[480px] origin-top-right rounded-2xl border border-saffron-100 bg-white p-1.5 shadow-premium group-hover:block group-focus-within:block animate-fade-in',
    attrs: { id: 'navbar-stats-popover', role: 'dialog', 'aria-label': 'Heatmap metrics' }
  }, [
    createElement('div', { className: 'flex divide-x divide-slate-100' }, [
      { label: 'Total Events', id: 'nav-stat-events', color: 'text-orange-500' },
      { label: 'Active States', id: 'nav-stat-active', color: 'text-india-green-600' },
      { label: 'Last Update', id: 'nav-stat-update', color: 'text-orange-500' },
      { label: 'Accuracy', id: 'nav-stat-accuracy', color: 'text-india-green-600' }
    ].map(stat => createElement('div', { className: 'flex-1 px-4 py-3 text-center' }, [
      createElement('p', { className: `text-lg font-bold leading-tight ${stat.color}`, text: '--', attrs: { id: stat.id } }),
      createElement('p', { className: 'mt-0.5 text-[10px] font-bold text-slate-400', text: stat.label })
    ])))
  ]);

  return createElement('div', { className: 'group relative hidden lg:block' }, [
    createElement('button', {
      className: 'inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-saffron-300 hover:bg-saffron-50 hover:text-saffron-600 focus-visible:ring-2 focus-visible:ring-saffron-500',
      attrs: {
        type: 'button',
        'aria-label': 'Show heatmap metrics'
      }
    }, [
      createElement('svg', {
        className: 'h-5 w-5',
        attrs: { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }
      }, [
        createElement('path', {
          attrs: { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2.5', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
        })
      ])
    ]),
    popover
  ]);
}

function createStatusPill() {
  const dot = createElement('span', {
    className: 'h-2 w-2 rounded-full bg-emerald-500 shrink-0',
    attrs: { 'data-status-dot': '' }
  });

  const text = createElement('span', {
    className: 'text-xs font-bold whitespace-nowrap',
    attrs: { id: 'heatmap-nav-status' },
    text: 'Connected'
  });

  return createElement('div', {
    className: 'inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm transition-all duration-200 shrink-0',
    attrs: { 'data-status-pill': '', id: 'navbar-status-pill' }
  }, [dot, text]);
}

export function mountNavbar(options = {}) {
  const mount = qs('[data-navbar]');
  if (!mount) return;
  const page = options.page || document.body.dataset.page || 'home';

  const header = createElement('header', {
    className: 'fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/80 bg-white shadow-sm'
  }, [
    createElement('nav', {
      className: 'flex h-16 w-full items-center justify-between px-6 sm:px-12 lg:px-16',
      attrs: { 'aria-label': 'Primary navigation' }
    }, [
      // Leftmost Column: App Name & Logo
      createElement('div', { className: 'flex flex-1 items-center justify-start' }, [
        createElement('a', {
          className: 'inline-flex items-center gap-2.5 rounded-lg text-slate-950 no-underline outline-none transition hover:opacity-90 shrink-0',
          attrs: { href: '/', 'aria-label': 'Misinformation Heatmap home' }
        }, [
          createElement('img', {
            className: 'h-9 w-9 shrink-0 rounded-lg border border-slate-200 object-cover shadow-sm',
            attrs: { src: '/assets/ind.png', alt: 'India logo' }
          }),
          createElement('span', { className: 'text-base font-extrabold tracking-tight text-slate-950 whitespace-nowrap' }, [
            createElement('span', { className: 'text-slate-950', text: 'Misinformation' }),
            createElement('span', { className: 'text-saffron-600 ml-1', text: 'Heatmap' })
          ])
        ])
      ]),

      // Center Column: Exactly Centered 3 Middle Routes Group (Home, Dashboard, Heatmap)
      createElement('div', {
        className: 'flex flex-1 items-center justify-center gap-2 sm:gap-3',
        attrs: { 'data-desktop-nav': '' }
      }, ROUTES.map((route) => createDesktopLink(route, page))),

      // Rightmost Column: Balance & Controls
      createElement('div', { className: 'flex flex-1 items-center justify-end gap-3' }, [
        createStatusPill(),
        page === 'heatmap' ? createStatsPopover() : null
      ].filter(Boolean))
    ])
  ]);

  replaceChildren(mount, [header]);

  mountBottomNavbar({ activeRoute: page });
}

export function updateMobileNavStatus(text) {
  setText('#mobile-nav-status', text);
}

export function updateStatsPanels(items) {
  const idMap = {
    'Total Events': '#nav-stat-events',
    'Events': '#nav-stat-events',
    'Active States': '#nav-stat-active',
    'Coverage': '#nav-stat-active',
    'States': '#nav-stat-active',
    'Last Update': '#nav-stat-update',
    'Accuracy': '#nav-stat-accuracy'
  };

  items.forEach(item => {
    const selector = idMap[item.label];
    if (selector) {
      setText(selector, item.value);
    }
  });

  const mobile = qs('#mobile-stats-panel');
  if (mobile) {
    replaceChildren(mobile, createStatPanel(items, { title: 'Map metrics' }));
  }
}
