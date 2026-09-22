/* GPS Navigator Hub: public static resources and email support. */
(() => {
  'use strict';
  const catalog = window.GPS_RESOURCES;
  const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const guide = id => catalog.find(resource => resource.id === id);
  const guideHref = resource => `#guide/${resource.id}?back=${encodeURIComponent(location.hash || '#home')}`;
  const guideLink = (id, className = 'path-link') => {
    const resource = guide(id);
    return `<a class="${className}" href="${esc(guideHref(resource))}">${esc(resource.title)} →</a>`;
  };
  const tasks = [
    { id: 'assessment', title: 'Understand assessment results', description: 'Move from a school view to an individual student.', steps: [
      ['Start with the dashboard', 'Orient yourself to the assessment view and available filters.', 'assessment-dashboard'],
      ['Look at student detail', 'Use the student detail guide to explore the individual view.', 'assessment-student-detail'],
      ['Consider predictions and targets', 'Read the guide before interpreting the displayed targets.', 'predictions-and-targets']
    ] },
    { id: 'support', title: 'Plan student support', description: 'Find your way through Teacher Navigator.', steps: [
      ['Get oriented', 'Review the student, group, and intervention views.', 'teacher-navigator-overview'],
      ['Work with groups and interventions', 'Follow the source use case for creating and applying groups.', 'teacher-navigator-groups-interventions']
    ] },
    { id: 'growth', title: 'Review growth and rosters', description: 'Connect a growth view with the data behind it.', steps: [
      ['Explore growth', 'Start with the Growth Dashboard reference.', 'growth-dashboard'],
      ['Check roster attribution', 'Review student-teacher links with the verification guide.', 'growth-roster-verification'],
      ['Review individual progress', 'Use the student progress reference to understand the metrics.', 'growth-student-progress']
    ] }
  ];
  const updates = [
    { id: 'feature', category: 'Features', title: 'How a feature update would appear', summary: 'Illustrative release-note preview: a short change summary with a link to the relevant guide.', body: 'Example only — no feature release is being announced. A published update would name the verified change, affected Navigator, availability date, and any action educators need to take. The existing assessment reference below demonstrates where supporting help would link.', related: ['assessment-dashboard'] },
    { id: 'training', category: 'Training', title: 'A place for upcoming training notices', summary: 'Illustrative event notice: audience, focus, and confirmed timing would appear here.', body: 'Example only — no training event is scheduled or open for registration here. A verified notice would identify its audience, learning focus, date, and registration details. Until details are confirmed, teams can use the shared introduction below or email GPS about a facilitated exploration in Help &amp; Feedback.', related: ['introduction-administrator-teacher-navigator'] },
    { id: 'news', category: 'GPS news', title: 'Where timely service news would live', summary: 'Illustrative service-note preview for a confirmed GPS change or availability notice.', body: 'Example only — there is no service change or availability announcement. Future notices would state the confirmed impact, timing, and next steps, then link to relevant guidance. Evergreen instructions remain in Guides and Pathways.', related: ['teacher-navigator-overview'] }
  ];
  let resourceState = { q: '', product: '', format: '', topic: '' };
  const navItems = [['home', 'Home'], ['resources', 'Guides'], ['pathways', 'Pathways'], ['demos', 'Demos'], ['updates', 'News & updates'], ['help', 'Help & Feedback']];
  const navLinks = () => navItems.map(([path, title]) => `<a href="#${path}" data-nav="${path}">${title}</a>`).join('');
  document.body.className = 'navigator-page';
  document.querySelector('#app').innerHTML = `
    <a class="skip-link" href="#main">Skip to main content</a>
    <header class="site-header"><div class="site-wrap nav-row">
      <a class="brand" href="#home"><img class="brand-mark" src="assets/scde-mark.svg" alt="South Carolina Department of Education"><span class="brand-copy"><strong>GPS · Navigator Hub</strong><span>Resources for South Carolina educators</span></span></a>
      <nav class="top-nav" aria-label="Main navigation">${navLinks()}</nav>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav">Menu</button>
    </div><nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation"><div class="site-wrap">${navLinks()}</div></nav></header>
    <div class="prototype-strip"><div class="site-wrap prototype-strip-inner"><strong>Feedback pilot</strong><span class="strip-divider">·</span><span class="strip-copy">Guides and demos are open to everyone. No website account needed.</span></div></div>
    <main id="main" class="prototype-main" tabindex="-1"></main>
    <footer class="site-footer"><div class="site-wrap footer-row"><span>GPS · Navigator Hub</span><div class="footer-links"><a class="text-link" href="#privacy">Privacy & guidelines</a><a class="text-link" href="mailto:gps@ed.sc.gov">Contact GPS →</a></div></div></footer>`;
  const main = document.querySelector('#main');
  const heading = (eyebrow, title, description, level = 'h2') => `<div class="section-head"><div><p class="eyebrow">${eyebrow}</p><${level}>${title}</${level}><p>${description}</p></div></div>`;
  const taskStrip = () => `<div class="task-strip">${tasks.map(task => `<a class="task-choice" href="#pathways/${task.id}"><strong>${task.title} →</strong><span>${task.description}</span></a>`).join('')}</div>`;
  function home() {
    return `<section class="hero navigator-hero"><div class="site-wrap hero-grid"><div class="hero-copy"><p class="eyebrow">GPS · Navigator Hub</p><h1 class="hero-title">Find your way<br>with GPS.</h1><p>Practical guides for South Carolina educators using Teacher Navigator and Administrator Navigator.</p><div class="hero-actions">${guideLink('introduction-administrator-teacher-navigator', 'button button-gold')}</div><p class="hero-start-note">New here? Start with the introduction above.</p></div><figure class="hero-photo"><img src="assets/educator-collaboration.webp" width="1400" height="788" alt="Four adults reviewing information together around a laptop."><figcaption>Illustrative photo · Stiven Rivera / Pexels</figcaption></figure></div></section><section class="section hub-map"><div class="site-wrap">${heading('Choose the help you need', 'Guides, pathways, or demos?', 'Use a guide for one dashboard, a pathway for a sequence, or a demo to explore what a view looks like.')}<div class="task-strip"><a class="task-choice" href="#resources"><strong>Guides →</strong><span>Search short references and interactive guides by Navigator or topic.</span></a><a class="task-choice" href="#pathways"><strong>Pathways →</strong><span>Follow a suggested reading order for assessment, growth, or student support. Pathways reuse the same guides.</span></a><a class="task-choice" href="#demos"><strong>Demos →</strong><span>Explore two interactive guides and a static attendance screenshot tour.</span></a></div></div></section>${products(false)}<section class="section"><div class="site-wrap home-feature-grid"><article class="walkthrough-feature"><p class="eyebrow">Help & Feedback</p><h2>What would help you use GPS?</h2><p>Tell us what was confusing, suggest a missing guide, or ask about a facilitated exploration with your team.</p><a class="text-link" href="#help">Get help or share feedback →</a></article><aside class="news-teaser"><p class="eyebrow">News & updates</p><h2>A preview of future notices.</h2><p>The update examples show how feature, service, and training notices could appear. They are examples, not announcements.</p><a class="text-link" href="#updates">View example updates →</a></aside></div></section>`;
  }
  function resourceCard(resource) {
    const thumbs = {'introduction-administrator-teacher-navigator':'teacher-overview', 'administrator-navigator-early-learning-guide':'admin-overview', 'ada-attendance-guided-demo':'attendance-demo'};
    const thumb = location.hash.startsWith('#demos') && thumbs[resource.id];
    return `<a class="resource-card ${resource.product === 'Teacher Navigator' ? 'teacher' : resource.product === 'GPS' ? 'gps' : 'admin'}" href="${esc(guideHref(resource))}">${thumb ? `<img class="demo-thumbnail" src="assets/${thumb}.webp" width="960" height="540" alt="" loading="lazy">` : ''}<div class="resource-card-head"><span class="resource-format">${esc(resource.format)}</span></div><h3>${esc(resource.title)}</h3><p class="description">${esc(resource.description)}</p><div class="resource-meta"><span>${esc(resource.topic)}</span></div><div class="resource-footer"><span class="product-label">${esc(resource.product)}</span><span class="resource-open">Open ${resource.format.includes('demo') ? 'demo' : 'guide'} →</span></div></a>`;
  }
  function resources() {
    const topics = [...new Set(catalog.map(resource => resource.topic))];
    const options = key => `<option value="">All ${key === 'product' ? 'Navigators' : 'formats'}</option>${[...new Set(catalog.map(resource => resource[key]))].map(value => `<option${resourceState[key] === value ? ' selected' : ''}>${esc(value)}</option>`).join('')}`;
    return `<section class="section resource-section" id="resources"><div class="site-wrap">${heading('The resource library', 'Find your guide.', 'Browse 18 resources. Start with an individual dashboard guide, or choose an interactive walkthrough. Filter by Navigator, topic, or format.', 'h1')}<div class="resource-layout"><aside class="topic-rail" aria-label="Resource topics"><details class="topic-picker"${window.matchMedia('(min-width: 901px)').matches ? ' open' : ''}><summary>Browse by topic</summary><div class="topic-list">${['', ...topics].map(topic => `<button type="button" class="topic-button" data-topic="${esc(topic)}" aria-pressed="${resourceState.topic === topic}"><span>${esc(topic || 'All topics')}</span><span class="count">${topic ? catalog.filter(resource => resource.topic === topic).length : catalog.length}</span></button>`).join('')}</div></details></aside><div class="resource-main"><div class="resource-toolbar"><div class="resource-search"><label class="sr-only" for="resource-query">Search resources</label><input id="resource-query" type="search" placeholder="Search assessment, growth…" value="${esc(resourceState.q)}"></div><span class="resource-count" id="resource-count" role="status" aria-live="polite"></span></div><div class="resource-filters"><label class="select-filter" for="product-filter">Navigator<select id="product-filter" data-filter="product">${options('product')}</select></label><label class="select-filter" for="format-filter">Format<select id="format-filter" data-filter="format">${options('format')}</select></label><button class="button button-outline button-small" type="button" data-action="reset-resources">Reset filters</button></div><div id="resource-results"></div></div></div></div></section>`;
  }
  function updateResources(syncUrl = false) {
    if (syncUrl) {
      const params = new URLSearchParams(Object.entries(resourceState).filter(([, value]) => value));
      const path = location.hash.startsWith('#home') || !location.hash ? 'home' : 'resources';
      history.replaceState(null, '', `#${path}${params.size ? '?' + params : ''}`);
    }

    const terms = resourceState.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const matches = catalog.filter(resource => (!resourceState.product || resource.product === resourceState.product) && (!resourceState.format || resource.format === resourceState.format) && (!resourceState.topic || resource.topic === resourceState.topic) && terms.every(term => [resource.title, resource.description, resource.product, resource.format, resource.topic, ...resource.tags].join(' ').toLowerCase().includes(term)));
    document.querySelector('#resource-count').textContent = `${matches.length} of ${catalog.length} resources`;
    document.querySelector('#resource-results').innerHTML = matches.length ? `<div class="resource-grid">${matches.map(resourceCard).join('')}</div>` : '<div class="resource-empty"><h3>No matching resources</h3><p>Try a broader search or reset the filters to see the full library.</p><button type="button" class="button button-primary" data-action="reset-resources">Reset search and filters</button></div>';
    document.querySelectorAll('[data-topic]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topic === resourceState.topic)));
  }
  function taskSection(id) {
    const task = tasks.find(item => item.id === id) || tasks[0];
    return `<section class="section tasks-section"><div class="site-wrap">${heading('Choose your next move', 'Follow a pathway.', 'Choose a question, then follow a suggested reading order. Each pathway links to guides in the library.', 'h1')}<div class="task-layout"><nav class="task-rail" aria-label="Pathway choices">${tasks.map(item => `<a class="task-choice" href="#pathways/${item.id}"${item.id === task.id ? ' aria-current="page"' : ''}><strong>${item.title}</strong><span>${item.description}</span></a>`).join('')}</nav><article class="task-path"><div class="path-header"><div><h3>${task.title}</h3><p>${task.description}</p></div><span class="badge badge-gold">${task.id === 'support' ? 'Teacher Navigator' : 'Administrator Navigator'}</span></div><ol class="path-steps">${task.steps.map(([title, description, id], index) => `<li class="path-step"><span class="path-number" aria-hidden="true">${index + 1}</span><div><h4>${title}</h4><p>${description}</p>${guideLink(id)}</div></li>`).join('')}</ol><a class="text-link" href="#resources">Explore the full resource library →</a></article></div></div></section>`;
  }
  function products(fullPage = true) {
    return `<section class="section product-section"><div class="site-wrap">${heading('Find your Navigator', 'Teacher and Administrator guides.', 'Choose the Navigator you use to see its guides.', fullPage ? 'h1' : 'h2')}<div class="navigator-product-grid">${[
      ['Teacher Navigator','teacher','Your students, classes, and groups.','Explore student views, assessment results, groups, and interventions.'],
      ['Administrator Navigator','admin','A view across schools and students.','Explore assessment, growth, enrollment, course grades, and readiness.']
    ].map(([name, style, title, description]) => `<a class="navigator-product-card ${style}" href="#resources?product=${encodeURIComponent(name)}"><img class="navigator-overview" src="assets/${style === 'teacher' ? 'teacher' : 'admin'}-overview.webp" alt="${style === 'teacher' ? 'Teacher Navigator student view' : 'Administrator Navigator Metrics Dashboard filter panel'} from the existing introduction guide." width="960" height="540" loading="lazy"><p class="eyebrow">${name}</p><h3>${title}</h3><p>${description}</p><span class="text-link">Browse ${name} guides →</span></a>`).join('')}</div></div></section>`;
  }
  function updateSection(id = '', category = '') {
    const update = updates.find(item => item.id === id);
    const back = `#updates${category ? '?category=' + encodeURIComponent(category) : ''}`;
    const content = update ? `<article class="update-detail"><a class="detail-back" href="${back}">← All example updates</a><div class="update-detail-header"><div><p class="badge badge-gold">Example · ${update.category}</p><h2>${update.title}</h2></div></div><div class="update-detail-body"><p>${update.body}</p></div><div class="update-detail-related"><h3>Related source guides</h3><ul>${update.related.map(id => `<li>${guideLink(id)}</li>`).join('')}</ul></div></article>` : `<div class="updates-layout"><nav class="update-categories" aria-label="Update categories">${['', 'Features', 'Training', 'GPS news'].map(value => `<a class="update-category" href="#updates${value ? '?category=' + encodeURIComponent(value) : ''}"${value === category ? ' aria-current="page"' : ''}>${value || 'All examples'}</a>`).join('')}</nav><div class="update-grid">${updates.filter(item => !category || item.category === category).map(item => `<article class="update-card"><div><span class="badge badge-gold">Example · ${item.category}</span></div><h3>${item.title}</h3><p>${item.summary}</p><a class="text-link" href="#updates/${item.id}${category ? '?category=' + encodeURIComponent(category) : ''}">Read example <span class="sr-only">${item.title}</span> →</a></article>`).join('') || '<p>No examples in this category. <a class="text-link" href="#updates">Show all examples</a></p>'}</div></div>`;
    return `<section class="section updates-section"><div class="site-wrap">${heading('News & updates', 'Keep up with GPS.', 'All entries here are examples, not actual announcements, events, or releases.', 'h1')}${content}</div></section>`;
  }
  function demos() {
    const ids = ['introduction-administrator-teacher-navigator', 'administrator-navigator-early-learning-guide', 'ada-attendance-guided-demo'];
    return `<section class="section"><div class="site-wrap">${heading('Demos', 'See GPS in context.', 'Two existing interactive guides and a guided attendance screenshot tour.', 'h1')}<p class="route-note">The shared introduction covers both Navigators. The ADA screenshot tour uses synthetic/demo records; its filters and export controls are pictured, not functioning.</p><div class="resource-grid demos-grid">${ids.map(id => resourceCard(guide(id))).join('')}</div><p class="route-note">Looking for Teacher Navigator’s student, group, and intervention references? <a class="text-link" href="#resources?product=Teacher%20Navigator">Browse Teacher Navigator guides →</a></p></div></section>`;
  }
  function guideViewer(id, params) {
    const resource = guide(id);
    if (!resource) return `<section class="section"><div class="site-wrap"><h1>Guide not found</h1><a class="text-link" href="#resources">Browse guides →</a></div></section>`;
    const requestedBack = params.get('back') || '#resources';
    const back = /^#(home|resources|pathways|demos|updates)([/?]|$)/.test(requestedBack) ? requestedBack : '#resources';
    return `<section class="guide-viewer"><div class="site-wrap guide-heading"><a class="detail-back" href="${esc(back)}">← Return to ${back.startsWith('#demos') ? 'Demos' : back.startsWith('#pathways') ? 'Pathways' : back.startsWith('#home') ? 'Home' : 'Guides'}</a><p class="eyebrow">${esc(resource.product)} · ${esc(resource.format)}</p><h1>${esc(resource.title)}</h1><p>${esc(resource.description)}</p><a class="text-link guide-download" href="${esc(resource.format.includes("walkthrough") || resource.id === "ada-attendance-guided-demo" ? "assets/downloads/" + resource.id + ".html" : resource.url)}" download>Download this HTML guide</a><p class="download-note">HTML downloads include the guide and its pictures for offline use.</p></div><iframe id="guide-frame" class="guide-frame" src="${esc(resource.url)}" title="${esc(resource.title)}" sandbox="allow-scripts allow-same-origin allow-top-navigation-by-user-activation allow-downloads"></iframe></section>`;
  }
  const emailLink = (subject, body = '') => `mailto:gps@ed.sc.gov?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  function help() {
    return `<section class="section"><div class="site-wrap">${heading('Help & Feedback','How can we help?','Email the GPS team for assistance, site feedback, or a facilitated exploration. No website account is needed.','h1')}<div class="support-grid">${[
      ['Share website feedback','Tell us the page, what you tried to do, and what would make it easier.','GPS Navigator Hub website feedback','My role:\nPage or guide:\nWhat I tried to do:\nWhat happened:\nSuggested change:\nBrowser and device (if relevant):\n'],
      ['Ask a GPS question','Include your Navigator, dashboard, and the question you need help answering.','GPS Navigator help','My role:\nNavigator and dashboard:\nMy question:\n'],
      ['Ask about a facilitated exploration','Tell us who would attend, what your team wants to learn, and your preferred timing. This starts a conversation and does not book a session.','GPS facilitated exploration request','Contact name and work email:\nDistrict or school:\nAudience and approximate group size:\nNavigator or topics:\nWhat we want to learn:\nPreferred timing:\n']
    ].map(([title, description, subject, body]) => `<article class="support-card"><h2>${title}</h2><p>${description}</p><a class="button button-teal" href="${esc(emailLink(subject,body))}" aria-label="Open an email draft to ${esc(title.toLowerCase())}">Open an email draft →</a></article>`).join('')}</div><div class="support-details"><h2>Prefer to write your own message?</h2><p>Email <a class="text-link" href="mailto:gps@ed.sc.gov">gps@ed.sc.gov</a>. The buttons open your email application. Review and send the message there; this website does not send or save it.</p><p>Please leave out student names, IDs, records, and other confidential information. For a technical issue, describe the problem without attaching student data.</p></div></div></section>`;
  }
  function privacy() {
    return `<section class="section"><div class="site-wrap privacy-copy"><h1>Privacy & guidelines</h1><p>This public Hub provides GPS guides and screenshot walkthroughs. It has no visitor accounts, community forum, or submission database. Underlying Navigator systems have their own access requirements.</p><h2>Email and screenshots</h2><p>Email links open your email application. Messages are sent only when you send them there, and are handled by the GPS team through agency email. Do not include student records or other confidential information.</p><p>The ADA demo uses synthetic records. Its pictured filters, tables, and export menus are static. Other guide screenshots illustrate the source materials and are not live dashboard connections.</p><h2>Pictures and hosting</h2><p>The illustrative collaboration photo is by <a class="text-link" href="https://www.pexels.com/photo/group-of-people-working-on-a-laptop-at-a-class-17558054/">Stiven Rivera on Pexels</a>, used under the <a class="text-link" href="https://www.pexels.com/license/">Pexels license</a>. It does not depict SCDE staff or a GPS session. Screenshots come from the supplied GPS training materials. Pictures are served with the website.</p><p>The Hub adds no analytics or advertising trackers. The hosting provider may process normal web request information under its policies.</p><a class="text-link" href="#help">Contact GPS →</a></div></section>`;
  }
  function route(focus = true) {
    if (location.hash === '#main') { main.focus(); return; }
    const [path, query = ''] = location.hash.slice(1).split('?');
    const [requestedPage = 'home', id = ''] = (path || 'home').split('/');
    const aliases = { tasks: 'pathways', feedback: 'help', news: 'updates' };
    const page = aliases[requestedPage] || requestedPage;
    if (page !== requestedPage) history.replaceState(null, '', `#${page}${id ? '/' + id : ''}${query ? '?' + query : ''}`);
    const params = new URLSearchParams(query);
    if (page === 'resources') resourceState = Object.fromEntries(['q', 'product', 'format', 'topic'].map(key => [key, params.get(key) || '']));
    document.body.className = page === 'resources' ? 'library-page consolidated-page' : 'navigator-page consolidated-page';
    const renderers = { home, resources, pathways: () => taskSection(id), products, demos, updates: () => updateSection(id, params.get('category') || ''), help, privacy, guide: () => guideViewer(id, params) };
    main.innerHTML = Object.hasOwn(renderers, page) ? renderers[page]() : `<section class="section"><div class="site-wrap"><h1>That page isn’t here.</h1><a class="button button-primary" href="#home">Return home</a></div></section>`;
    const detailTitle = page === 'guide' ? guide(id)?.title : page === 'pathways' ? tasks.find(item => item.id === id)?.title : page === 'updates' ? updates.find(item => item.id === id)?.title : '';
    document.title = `${detailTitle ? detailTitle + ' · ' : ''}${navItems.find(([key]) => key === page)?.[1] || (page === 'guide' ? 'Guide' : page === 'privacy' ? 'Privacy' : 'Page not found')} | GPS Navigator Hub`;
    document.querySelectorAll('[data-nav]').forEach(link => {
      if (link.dataset.nav === (page === 'guide' ? (params.get('back') || '#resources').slice(1).split(/[/?]/)[0] : page)) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
    });
    document.querySelector('#mobile-nav').classList.remove('open');
    document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
    if (document.querySelector('#resource-results')) updateResources();

    if (focus) { main.focus({ preventScroll: true }); window.scrollTo(0, 0); }
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.classList.contains('menu-toggle')) {
      const open = document.querySelector('#mobile-nav').classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
    }
    if (button.hasAttribute('data-topic')) { resourceState.topic = button.dataset.topic; updateResources(true); }
    const action = button.dataset.action;
    if (action === 'reset-resources') {
      resourceState = { q: '', product: '', format: '', topic: '' };
      document.querySelector('#resource-query').value = '';
      document.querySelectorAll('[data-filter]').forEach(select => { select.value = ''; });
      updateResources(true);
      document.querySelector('#resource-query').focus();
    }
  });
  document.addEventListener('input', event => {
    if (event.target.id === 'resource-query') { resourceState.q = event.target.value; updateResources(true); }
    if (event.target.hasAttribute('aria-invalid')) { event.target.removeAttribute('aria-invalid'); event.target.closest('.field').dataset.invalid = 'false'; }
  });
  document.addEventListener('change', event => {
    if (event.target.dataset.filter) { resourceState[event.target.dataset.filter] = event.target.value; updateResources(true); }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.querySelector('#mobile-nav').classList.contains('open')) {
      document.querySelector('#mobile-nav').classList.remove('open');
      const toggle = document.querySelector('.menu-toggle');
      toggle.setAttribute('aria-expanded', 'false'); toggle.focus();
    }
  });
  window.addEventListener('hashchange', () => route());
  window.addEventListener('popstate', () => route());
  route(false);
})();
