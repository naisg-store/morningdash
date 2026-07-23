(async function buildAutoCityGrid() {
  const container = document.getElementById('city-links-grid');
  if (!container) return;

  try {
    // 1. Detect if we are inside the /guides/ folder
    const isGuideFolder = window.location.pathname.includes('/guides/');
    const jsonPath = isGuideFolder ? '../cities.json' : 'cities.json';
    const linkPrefix = isGuideFolder ? '' : 'guides/';

    // 2. Fetch the single source of truth
    const res = await fetch(jsonPath);
    const cities = await res.json();

    // 3. Find out what page we are currently looking at
    const currentFilename = window.location.pathname.split('/').pop() || 'index.html';

    // 4. Build the grid, automatically filtering OUT the city you are currently viewing!
    container.innerHTML = cities
      .filter(city => !currentFilename.includes(city.slug))
      .map(city => `
        <a href="${linkPrefix}${city.slug}" style="background:var(--panel); border:1px solid var(--panel-border); border-radius:var(--radius-md); padding:14px; text-decoration:none; display:flex; align-items:center; gap:12px; backdrop-filter:blur(14px); transition:border-color 0.2s;">
          <span style="font-size:22px;">${city.emoji}</span>
          <div>
            <h3 style="margin:0; font-size:14px; color:var(--text); font-weight:700;">${city.name}</h3>
            <span style="font-size:11px; color:var(--muted);">${city.desc}</span>
          </div>
        </a>
      `).join('');
  } catch (err) {
    console.error('Error auto-generating city links grid:', err);
  }
})();
