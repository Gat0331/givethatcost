// listings.js - manages the listings page (client-side demo)
const LISTINGS_KEY = 'lf_listings_v1';

const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const byId = id => document.getElementById(id);

function genId() { return 'id_' + Math.random().toString(36).slice(2,9); }
function escapeHtml(s){ return String(s || '').replace(/&/g, '&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function seedListings(){
  if (!localStorage.getItem(LISTINGS_KEY)){
    const sample = [
      { id: genId(), type: 'Missing', category: 'Wallets', title: 'Black leather wallet', desc: 'Lost near Main St bus stop, 9/12', contact: 'call 555-111' },
      { id: genId(), type: 'Found', category: 'Gadgets', title: 'Silver iPhone (no case)', desc: 'Found in cafe on 9/14', contact: '' }
    ];
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(sample));
  }
}

function loadListings() { try { return JSON.parse(localStorage.getItem(LISTINGS_KEY) || '[]'); } catch(e){ return []; } }
function saveListings(list){ localStorage.setItem(LISTINGS_KEY, JSON.stringify(list)); }

const listingsGrid = byId('listings-grid');
function renderListings(filter = 'All'){
  const list = loadListings();
  const filtered = filter === 'All' ? list : list.filter(l => l.category === filter);
  listingsGrid.innerHTML = '';

  if (filtered.length === 0) {
    listingsGrid.innerHTML = '<p class="muted">No listings in this category.</p>';
    return;
  }

  filtered.forEach(item => {
    const el = document.createElement('div');
    el.className = 'listing-card';
    el.innerHTML = `
      <div class="listing-type">${escapeHtml(item.type)}</div>
      <div class="listing-title">${escapeHtml(item.title)}</div>
      <div class="listing-desc">${escapeHtml(item.desc || '')}</div>
      <div class="listing-contact">${item.contact ? 'Contact: ' + escapeHtml(item.contact) : ''}</div>
    `;
    listingsGrid.appendChild(el);
  });
}

// Category buttons
qsa('.category-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    qsa('.category-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderListings(btn.dataset.cat);
  });
});

// Listing form handling
const listingForm = byId('listing-form');
if (listingForm){
  listingForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const type = byId('listing-type').value;
    const category = byId('listing-category').value;
    const title = byId('listing-title').value.trim();
    const desc = byId('listing-desc').value.trim();
    const contact = byId('listing-contact').value.trim();
    if (!title) return alert('Please add a title');

    const list = loadListings();
    list.unshift({ id: genId(), type, category, title, desc, contact });
    saveListings(list);
    listingForm.reset();
    const active = document.querySelector('.category-btn.active');
    renderListings(active ? active.dataset.cat : 'All');
  });
}

// Clear listings dev button
const clearBtn = byId('clear-listings');
if (clearBtn){
  clearBtn.addEventListener('click', () => {
    if (confirm('Clear all listings? This is for development only.')){
      localStorage.removeItem(LISTINGS_KEY);
      seedListings();
      renderListings('All');
    }
  });
}

// Init
seedListings();
const firstCat = document.querySelector('.category-btn[data-cat="All"]');
if (firstCat) firstCat.classList.add('active');
renderListings('All');
