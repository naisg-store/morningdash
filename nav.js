(async function buildDynamicGrids() {
  "use strict";

  const isGuideFolder = window.location.pathname.includes('/guides/');
  const rootPath = isGuideFolder ? '../' : './';
  const currentFilename = window.location.pathname.split('/').pop() || 'index.html';

  // 1. Render City Links Grid
  const cityContainer = document.getElementById('city-links-grid');
  if (cityContainer) {
    try {
      const res = await fetch(`${rootPath}cities.json`);
      const cities = await res.json();

      cityContainer.innerHTML = cities
        .filter(city => !currentFilename.includes(city.slug))
        .map(city => {
          const href = isGuideFolder ? city.slug : `guides/${city.slug}`;
          return `
            <a href="${href}" style="background:var(--panel); border:1px solid var(--panel-border); border-radius:var(--radius-md); padding:14px; text-decoration:none; display:flex; align-items:center; gap:12px; backdrop-filter:blur(14px); transition:border-color 0.2s;">
              <span style="font-size:22px;">${city.emoji}</span>
              <div>
                <h3 style="margin:0; font-size:14px; color:var(--text); font-weight:700;">${city.name}</h3>
                <span style="font-size:11px; color:var(--muted);">${city.desc}</span>
              </div>
            </a>
          `;
        }).join('');
    } catch (e) {
      console.error('Error loading cities.json:', e);
    }
  }

  // 2. Render Guides Grid
  const guideContainer = document.getElementById('guide-links-grid');
  if (guideContainer) {
    try {
      const res = await fetch(`${rootPath}guides.json`);
      const guides = await res.json();

      guideContainer.innerHTML = guides
        .filter(guide => !currentFilename.includes(guide.slug))
        .map(guide => {
          const href = isGuideFolder ? guide.slug : `guides/${guide.slug}`;
          return `
            <a href="${href}" style="background:var(--panel); border:1px solid var(--panel-border); border-radius:var(--radius-md); padding:16px; text-decoration:none; display:flex; flex-direction:column; gap:10px; backdrop-filter:blur(14px); transition:border-color 0.2s;">
              <div style="width:100%; height:110px; background:var(--bg-deep); border:1px solid var(--panel-border); border-radius:var(--radius-sm); display:flex; align-items:center; justify-content:center; color:var(--muted-dim); font-size:24px;">
                ${guide.emoji}
              </div>
              <div>
                <span style="font-size:10px; letter-spacing:0.08em; text-transform:uppercase; color:${guide.color}; font-weight:700;">${guide.category}</span>
                <h3 style="margin:4px 0 6px; font-size:15px; color:var(--text); font-weight:700; line-height:1.3;">${guide.title}</h3>
                <p style="margin:0; font-size:12px; color:var(--muted); line-height:1.5; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">
                  "${guide.desc}"
                </p>
              </div>
            </a>
          `;
        }).join('');
    } catch (e) {
      console.error('Error loading guides.json:', e);
    }
  }
})();
