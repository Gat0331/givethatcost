// forum.js - manages the forum page (client-side demo)
const FORUM_KEY = 'lf_forum_v1';

const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const byId = id => document.getElementById(id);

function genId() { return 'id_' + Math.random().toString(36).slice(2,9); }
function escapeHtml(s){ return String(s || '').replace(/&/g, '&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function seedForum(){
  if (!localStorage.getItem(FORUM_KEY)){
    const sample = [
      { id: genId(), type: 'Found', title: 'Found set of keys near park', body: 'Key fob + 3 keys. Ask for description to claim.', contact: '', comments: [{id: genId(), text: 'I think those might be mine, DM please.'}] }
    ];
    localStorage.setItem(FORUM_KEY, JSON.stringify(sample));
  }
}

function loadForum(){ try { return JSON.parse(localStorage.getItem(FORUM_KEY) || '[]'); } catch(e){ return []; } }
function saveForum(list){ localStorage.setItem(FORUM_KEY, JSON.stringify(list)); }

const forumListEl = byId('forum-list');
function renderForum(){
  const forum = loadForum();
  forumListEl.innerHTML = '';
  if (forum.length === 0) { forumListEl.innerHTML = '<p class="muted">No forum posts yet.</p>'; return; }

  forum.slice().reverse().forEach(post => {
    const postEl = document.createElement('div');
    postEl.className = 'forum-post';
    postEl.innerHTML = `
      <div class="post-header">
        <div>
          <div class="post-title">${escapeHtml(post.title)}</div>
          <div class="post-contact">${post.contact ? 'Contact: ' + escapeHtml(post.contact) : ''}</div>
        </div>
        <div class="post-type muted">${escapeHtml(post.type)}</div>
      </div>
      <div class="post-body">${escapeHtml(post.body)}</div>
      <div class="comment-list" id="comments-${post.id}"></div>
      <form class="comment-form" data-post-id="${post.id}">
        <input placeholder="Leave a comment (e.g. 'I found this' or 'Is this still available?')" required />
        <button class="btn btn-small btn-primary" type="submit">Comment</button>
      </form>
    `;

    forumListEl.appendChild(postEl);

    // render comments
    const commentsEl = qs('#comments-' + post.id, postEl);
    if (post.comments && post.comments.length){
      post.comments.forEach(c => {
        const cEl = document.createElement('div');
        cEl.className = 'comment';
        cEl.textContent = c.text;
        commentsEl.appendChild(cEl);
      });
    }
  });

  // attach comment handlers
  qsa('.comment-form').forEach(f => {
    f.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const input = f.querySelector('input');
      const text = input.value.trim();
      if (!text) return;
      const postId = f.dataset.postId;
      const forum = loadForum();
      const idx = forum.findIndex(p => p.id === postId);
      if (idx !== -1){
        forum[idx].comments = forum[idx].comments || [];
        forum[idx].comments.push({ id: genId(), text });
        saveForum(forum);
        renderForum();
      }
    });
  });
}

// Forum form
const forumForm = byId('forum-form');
if (forumForm){
  forumForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const type = byId('post-type').value;
    const title = byId('post-title').value.trim();
    const body = byId('post-body').value.trim();
    const contact = byId('post-contact').value.trim();
    if (!title || !body) return alert('Please add title and details');
    const forum = loadForum();
    forum.push({ id: genId(), type, title, body, contact, comments: [] });
    saveForum(forum);
    forumForm.reset();
    renderForum();
  });
}

// Init
seedForum();
renderForum();
