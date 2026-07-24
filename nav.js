// nav.js - Dynamic Navigation, Live Search & Wikimedia Parallax Router
document.addEventListener("DOMContentLoaded", async () => {
  // 1. Context Awareness: Auto-detect folder depth to fix relative paths
  const isSubpage = window.location.pathname.includes('/guides/');
  const basePath = isSubpage ? '../' : './';
  const linkPrefix = isSubpage ? '' : 'guides/';

  const cityGrid = document.getElementById('city-links-grid');
  const guideGrid = document.getElementById('guide-links-grid');

  // 2. Wikipedia API: Dynamic Parallax Background Injection
  async function loadCityBackground() {
    const cityEl = document.getElementById('city-name');
    if (!cityEl) return;
    
    const cityName = cityEl.textContent.trim();
    if (cityName === "Locating you…" || cityName === "Loading City...") return;

    try {
      // Query Wikipedia for the main page image of the current city
      const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(cityName)}&origin=*`;
      const res = await fetch(apiUrl);
      const data = await res.json();
      
      const pages = data.query.pages;
      const page = Object.values(pages)[0];

      if (page && page.original && page.original.source) {
        const imgUrl = page.original.source;
        
        // Construct the parallax layer dynamically
        const parallaxBg = document.createElement('div');
        parallaxBg.style.position = 'fixed';
        parallaxBg.style.top = '0';
        parallaxBg.style.left = '0';
        parallaxBg.style.width = '100vw';
        parallaxBg.style.height = '100vh';
        parallaxBg.style.backgroundImage = `url('${imgUrl}')`;
        parallaxBg.style.backgroundSize = 'cover';
        parallaxBg.style.backgroundPosition = 'center';
        parallaxBg.style.backgroundAttachment = 'fixed';
        parallaxBg.style.opacity = '0.12'; // Low opacity so text remains highly readable
        parallaxBg.style.zIndex = '-1';
        parallaxBg.style.pointerEvents = 'none';
        
        // Add a subtle fade-in effect
        parallaxBg.animate([
          { opacity: 0 },
          { opacity: 0.12 }
        ], { duration: 1500, easing: 'ease-out' });

        document.body.appendChild(parallaxBg);
      }
    } catch (error) {
      console.error("Failed to load Wikimedia background:", error);
    }
  }

  // Trigger the background load
  loadCityBackground();

  // 3. Fetch & Render Editorial Guides
  if (guideGrid) {
    try {
      const res = await fetch(`${basePath}guides.json`);
      const guides = await res.json();
      
      guideGrid.innerHTML = guides.map(g => `
        <a href="${linkPrefix}${g.slug}" style="background:var(--panel); border:1px solid var(--panel-border); border-radius:var(--radius-md); padding:16px; text-decoration:none; display:flex; flex-direction:column; gap:10px; backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); transition:border-color 0.2s;">
          <div style="width:100%; height:110px; background:var(--bg-deep); border:1px solid var(--panel-border); border-radius:var(--radius-sm); display:flex; align-items:center; justify-content:center; color:var(--muted-dim); font-size:24px;">
            ${g.emoji}
          </div>
          <div>
            <span style="font-size:10px; letter-spacing:0.08em; text-transform:uppercase; color:${g.color}; font-weight:700;">${g.category}</span>
            <h3 style="margin:4px 0 6px; font-size:15px; color:var(--text); font-weight:700; line-height:1.3;">${g.title}</h3>
            <p style="margin:0; font-size:12px; color:var(--muted); line-height:1.5; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">
              ${g.desc}
            </p>
          </div>
        </a>
      `).join('');
    } catch(e) { console.error("Failed to load guides:", e); }
  }

  // 4. Fetch Cities, Inject Search UI, & Render Grid
  if (cityGrid) {
    try {
      const res = await fetch(`${basePath}cities.json`);
      const cities = await res.json();

      // Inject the Glassmorphic Search Bar directly above the grid
      const searchHTML = `
        <div style="margin-bottom:16px; position:relative;">
          <input type="text" id="citySearch" placeholder="Search 100+ cities (e.g., Denver, Austin)..." 
            style="width:100%; padding:14px 16px 14px 40px; background:rgba(10, 17, 32, 0.6); border:1px solid var(--panel-border); border-radius:var(--radius-md); color:var(--text); font-size:15px; outline:none; backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); transition:border-color 0.2s;" 
            onfocus="this.style.borderColor='var(--cyan)'" 
            onblur="this.style.borderColor='var(--panel-border)'">
          <span style="position:absolute; left:14px; top:14px; font-size:16px; opacity:0.5;">🔍</span>
        </div>
      `;
      cityGrid.insertAdjacentHTML('beforebegin', searchHTML);

      // Render the 100 City Cards
      cityGrid.innerHTML = cities.map(c => `
        <a href="${linkPrefix}${c.slug}" class="city-nav-card" data-name="${c.name.toLowerCase()}" style="background:var(--panel); border:1px solid var(--panel-border); border-radius:var(--radius-md); padding:14px; text-decoration:none; display:flex; align-items:center; gap:12px; backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); transition:border-color 0.2s;">
          <span style="font-size:22px;">${c.emoji}</span>
          <div>
            <h3 style="margin:0; font-size:14px; color:var(--text); font-weight:700;">${c.name}</h3>
            <span style="font-size:11px; color:var(--muted);">${c.desc}</span>
          </div>
        </a>
      `).join('');

      // Client-Side Live Search Engine (Instant Filtering)
      const searchInput = document.getElementById('citySearch');
      searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.city-nav-card').forEach(card => {
          if (card.getAttribute('data-name').includes(term)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });

    } catch(e) { console.error("Failed to load cities:", e); }
  }
});
