// Mobile nav-bar hamburger -> slide-down drawer (unchanged, mobile-only behavior)
const drawer = document.getElementById('mobileDrawer');
const hamMobile = document.getElementById('hamburgerMobile');
function toggleDrawer(){
  const isOpen = drawer.classList.toggle('open');
  hamMobile.classList.toggle('open', isOpen);
  hamMobile.setAttribute('aria-expanded', isOpen);
}
hamMobile.addEventListener('click', toggleDrawer);
function closeDrawer(){
  drawer.classList.remove('open');
  hamMobile.classList.remove('open');
  hamMobile.setAttribute('aria-expanded','false');
}

// Chrome-bar hamburger -> solid black full-height flyout menu, works on desktop and mobile
const hamChrome = document.getElementById('hamburgerChrome');
const chromeFlyout = document.getElementById('chromeFlyout');
const chromeFlyoutClose = document.getElementById('chromeFlyoutClose');
function toggleFlyout(){
  const isOpen = chromeFlyout.classList.toggle('open');
  hamChrome.setAttribute('aria-expanded', isOpen);
}
function closeFlyout(){
  chromeFlyout.classList.remove('open');
  hamChrome.setAttribute('aria-expanded','false');
}
hamChrome.addEventListener('click', (e)=>{
  e.stopPropagation();
  toggleFlyout();
});
chromeFlyoutClose.addEventListener('click', closeFlyout);
// Close flyout on outside click or Escape
document.addEventListener('click', (e)=>{
  if(chromeFlyout.classList.contains('open') && !chromeFlyout.contains(e.target) && e.target !== hamChrome){
    closeFlyout();
  }
});
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape') closeFlyout();
});

// Active-state highlighting + closing menus after choosing a link
document.querySelectorAll('.mobile-drawer a, .nav-links a, .chrome-flyout a').forEach(a=>{
  a.addEventListener('click', (e)=>{
    document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
    document.querySelectorAll('.nav-link[data-target="'+a.dataset.target+'"]').forEach(l=>l.classList.add('active'));
    closeDrawer();
    closeFlyout();
  });
});

// Functional refresh button: reloads the page for a true refresh
const refreshBtn = document.getElementById('refreshBtn');
refreshBtn.addEventListener('click', ()=>{
  refreshBtn.classList.add('spin');
  document.getElementById('urlText').textContent = 'RELOADING…';
  setTimeout(()=>{ window.location.reload(); }, 500);
});

// Join button: simple, honest feedback (no external navigation implied)
document.getElementById('joinBtn').addEventListener('click', ()=>{
  const btn = document.getElementById('joinBtn');
  btn.textContent = 'Request Sent ✓';
  setTimeout(()=>{ btn.textContent = 'Join the Roster'; }, 2200);
});

// Active-state highlighting on scroll
const sections = ['home','members','reviews'].map(id=>document.getElementById(id));
const navLinksAll = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', ()=>{
  let current = 'home';
  sections.forEach(sec=>{
    if(sec && window.scrollY + 140 >= sec.offsetTop) current = sec.id;
  });
  navLinksAll.forEach(l=>{
    l.classList.toggle('active', l.dataset.target === current);
  });
});



(function () {
  const categories = ["All","Illustration","Logo","Poster","Ads","Character Design","Asset","Animation","Stickers","Emotes"];
  const BASE_URL = "https://sicervantesto12.github.io/IMAGESforportfolio/";
  const DATA_URL = "data.json"; // sits next to this script — edit that file to add/change images

  const grid = document.getElementById('grid');
  const pillsNav = document.getElementById('pills');
  const aboutToggle = document.getElementById('aboutToggle');
  const aboutOverlay = document.getElementById('aboutOverlay');
  const aboutClose = document.getElementById('aboutClose');
  const emptyState = document.getElementById('emptyState');
  const resetBtn = document.getElementById('resetBtn');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxTag = document.getElementById('lightboxTag');
  const lightboxClose = document.getElementById('lightboxClose');

  let activeCat = "All";
  let items = [];

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'pill' + (cat === "All" ? " active" : "");
    btn.textContent = cat;
    btn.setAttribute('aria-pressed', cat === "All" ? "true" : "false");
    btn.addEventListener('click', () => {
      activeCat = cat;
      [...pillsNav.children].forEach(c => {
        c.classList.toggle('active', c === btn);
        c.setAttribute('aria-pressed', c === btn ? "true" : "false");
      });
      render();
    });
    pillsNav.appendChild(btn);
  });

  function matches(item) {
    return activeCat === "All" || item.cat === activeCat;
  }

  function render() {
    let list = items.filter(matches);

    grid.innerHTML = "";

    if (list.length === 0) {
      emptyState.style.display = "block";
      grid.style.display = "none";
    } else {
      emptyState.style.display = "none";
      grid.style.display = "";
      list.forEach((item, idx) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.animationDelay = (idx * 18) + 'ms';
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', 'View ' + item.title);

        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.title;
        img.loading = 'lazy';
        img.addEventListener('error', () => {
          console.warn('Image failed to load:', item.src);
          card.classList.add('card-broken');
          img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
               <rect width="100%" height="100%" fill="#E7E4DB"/>
               <text x="50%" y="50%" font-family="sans-serif" font-size="14"
                     fill="#5C5A54" text-anchor="middle" dy=".3em">Image unavailable</text>
             </svg>`
          );
        }, { once: true });
        card.appendChild(img);

        const overlay = document.createElement('div');
        overlay.className = 'card-overlay';

        const bottom = document.createElement('div');
        bottom.className = 'card-bottom';
        bottom.innerHTML = `<p class="card-title">${item.title}</p><span class="card-tag">${item.cat}</span>`;

        overlay.appendChild(bottom);
        card.appendChild(overlay);

        card.addEventListener('click', () => openLightbox(item));
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(item);
          }
        });

        grid.appendChild(card);
      });
    }
  }

  function openLightbox(item) {
    lightboxImg.src = item.src;
    lightboxImg.alt = item.title;
    lightboxTitle.textContent = item.title;
    // Tags/date ride along on each item object (item.tags, item.date)
    // for whenever you want to surface them here too.
    lightboxTag.textContent = item.cat;
    lightboxOverlay.classList.add('open');
    lightboxClose.focus();
  }
  function closeLightbox() {
    lightboxOverlay.classList.remove('open');
    lightboxImg.src = "";
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxOverlay.classList.contains('open')) closeLightbox();
  });

  function openAbout() {
    aboutOverlay.classList.add('open');
    aboutToggle.classList.add('active');
    aboutToggle.setAttribute('aria-expanded', 'true');
    aboutClose.focus();
  }
  function closeAbout() {
    aboutOverlay.classList.remove('open');
    aboutToggle.classList.remove('active');
    aboutToggle.setAttribute('aria-expanded', 'false');
    aboutToggle.focus();
  }
  aboutToggle.addEventListener('click', openAbout);
  aboutClose.addEventListener('click', closeAbout);
  aboutOverlay.addEventListener('click', (e) => {
    if (e.target === aboutOverlay) closeAbout();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && aboutOverlay.classList.contains('open')) closeAbout();
  });

  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        activeCat = "All";
        [...pillsNav.children].forEach(c => {
          c.classList.toggle('active', c.textContent === "All");
          c.setAttribute('aria-pressed', c.textContent === "All" ? "true" : "false");
        });
        render();
      }
    });
  }

  resetBtn.addEventListener('click', () => {
    activeCat = "All";
    [...pillsNav.children].forEach(c => {
      c.classList.toggle('active', c.textContent === "All");
      c.setAttribute('aria-pressed', c.textContent === "All" ? "true" : "false");
    });
    render();
  });

  // ---------------------------------------------------------------
  // Load image data from data.json, then render once it's in.
  // ---------------------------------------------------------------
  fetch(DATA_URL)
    .then(res => {
      if (!res.ok) throw new Error(`Could not load ${DATA_URL} (${res.status})`);
      return res.json();
    })
    .then(rawItems => {
      items = rawItems.map((item, index) => ({
        id: index + 1,
        title: item.title || "Untitled",
        cat: item.cat,
        tags: item.tags || [],
        date: item.date || null,
        src: BASE_URL + item.file,
      }));
      render();
    })
    .catch(err => {
      console.error('Failed to load portfolio data:', err);
      emptyState.style.display = "block";
      grid.style.display = "none";
      document.getElementById('emptyText').textContent =
        "Couldn't load the image data right now. Try refreshing the page.";
    });
})();
