/* ============================================
   Cable — App Logic
   Smart search · Pairing mode · Inventory CRUD
   ============================================ */
(() => {
  'use strict';

  /* -------------------------------------------------------
     CONNECTOR METADATA
     ------------------------------------------------------- */
  const CONNECTORS = {
    'usb-a':       { label: 'USB-A',        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.5"/><path d="M14 2v7.5"/><path d="M12 14v8"/><rect x="8" y="2" width="8" height="12" rx="1"/></svg>',  color: '#4fc3f7' },
    'usb-c':       { label: 'USB-C',        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="12" height="16" rx="6"/><path d="M12 4v16"/></svg>',  color: '#7c4dff' },
    'lightning':   { label: 'Lightning',    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v8"/><path d="M14 2v8"/><rect x="8" y="10" width="8" height="12" rx="2"/><path d="M12 22v2"/></svg>', color: '#e0e0e0' },
    'micro-usb':   { label: 'Micro USB',    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 10v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4l-2-2H8l-2 2Z"/><path d="M12 16v6"/></svg>',  color: '#66bb6a' },
    'hdmi':        { label: 'HDMI',         icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8v6l3 3h8l3-3V8a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2Z"/><path d="M9 17v5"/><path d="M15 17v5"/></svg>',  color: '#ef5350' },
    '3.5mm':       { label: '3.5mm Jack',   icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 16v6"/></svg>',  color: '#ffa726' },
    'magsafe':     { label: 'MagSafe',      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="6" width="16" height="12" rx="2"/><path d="M4 12h16"/><path d="M12 6v12"/></svg>',  color: '#e0e0e0' },
    'bluetooth':   { label: 'Bluetooth',    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 7 10 10-5 5V2l5 5-10 10"/></svg>',  color: '#42a5f5' },
    'wall-plug':   { label: 'Wall Plug',    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="8" width="12" height="8" rx="1"/><path d="M9 2v6"/><path d="M15 2v6"/><path d="M12 16v6"/></svg>',  color: '#ffd54f' },
    'proprietary': { label: 'Proprietary',  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',  color: '#bdbdbd' },
    'aaa':         { label: 'AAA Battery',  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="12" height="16" rx="2"/><path d="M10 2h4"/><path d="M12 10v4"/><path d="M10 12h4"/></svg>', color: '#ffd54f' },
  };

  const CATEGORIES = {
    cables:   { label: 'Cables',   icon: '🔌' },
    adapters: { label: 'Adapters', icon: '🔗' },
    audio:    { label: 'Audio',    icon: '🎧' },
    storage:  { label: 'Storage',  icon: '💾' },
    power:    { label: 'Power',    icon: '🔋' },
  };

  /* -------------------------------------------------------
     DEFAULT INVENTORY
     ------------------------------------------------------- */
  const DEFAULT_INVENTORY = [
    { id:'d1',  name:'USB to Lightning Cable',          category:'cables',   connA:'usb-a',     connB:'lightning',  qty:1, notes:'' },
    { id:'d2',  name:'USB to Micro USB Cable',          category:'cables',   connA:'usb-a',     connB:'micro-usb',  qty:3, notes:'' },
    { id:'d3',  name:'USB to Type C Cable',             category:'cables',   connA:'usb-a',     connB:'usb-c',      qty:2, notes:'' },
    { id:'d4',  name:'Lightning EarPods',               category:'audio',    connA:'lightning',  connB:'',           qty:1, notes:'Apple wired EarPods' },
    { id:'d5',  name:'Duracell AAA Battery',            category:'power',    connA:'aaa',        connB:'',           qty:2, notes:'Duracell cells' },
    { id:'d6',  name:'USB-C to USB Hub',                category:'adapters', connA:'usb-c',      connB:'usb-a',      qty:1, notes:'Multi-port hub' },
    { id:'d7',  name:'USB-C to 3.5mm Jack Adapter',     category:'adapters', connA:'usb-c',      connB:'3.5mm',      qty:2, notes:'' },
    { id:'d8',  name:'Aux Cable',                       category:'cables',   connA:'3.5mm',      connB:'3.5mm',      qty:1, notes:'' },
    { id:'d9',  name:'Collar Bluetooth Earbuds',        category:'audio',    connA:'bluetooth',  connB:'',           qty:1, notes:'Neckband style' },
    { id:'d10', name:'Philips Trimmer Charger',         category:'power',    connA:'proprietary',connB:'',           qty:1, notes:'Philips trimmer specific' },
    { id:'d11', name:'Micro USB Charger',               category:'power',    connA:'micro-usb',  connB:'wall-plug',  qty:1, notes:'' },
    { id:'d12', name:'Lightning to 3.5mm Jack',         category:'adapters', connA:'lightning',   connB:'3.5mm',      qty:1, notes:'' },
    { id:'d13', name:'Type C to HDMI Adapter',          category:'adapters', connA:'usb-c',       connB:'hdmi',       qty:1, notes:'' },
    { id:'d14', name:'SanDisk 8GB Pendrive',            category:'storage',  connA:'usb-a',       connB:'',           qty:1, notes:'' },
    { id:'d15', name:'SanDisk 128GB Pendrive',          category:'storage',  connA:'usb-a',       connB:'',           qty:1, notes:'' },
    { id:'d16', name:'SanDisk 32GB Pendrive',           category:'storage',  connA:'usb-a',       connB:'',           qty:1, notes:'' },
    { id:'d17', name:'SanDisk 64GB Type C Pendrive',    category:'storage',  connA:'usb-c',       connB:'',           qty:1, notes:'' },
    { id:'d18', name:'Type C to MagSafe Cable',         category:'cables',   connA:'usb-c',       connB:'magsafe',    qty:1, notes:'MacBook charging cable' },
    { id:'d19', name:'35W Apple Adapter',               category:'power',    connA:'usb-c',       connB:'wall-plug',  qty:1, notes:'Apple 35W USB-C charger' },
  ];

  /* -------------------------------------------------------
     SMART SEARCH — Synonym & Device mapping
     ------------------------------------------------------- */
  // Map device/concept names → connector IDs that the device typically uses
  const DEVICE_TO_CONNECTORS = {
    'iphone':      ['lightning','usb-c'],
    'ipad':        ['lightning','usb-c'],
    'apple':       ['lightning','usb-c','magsafe'],
    'macbook':     ['usb-c','magsafe'],
    'mac':         ['usb-c','magsafe','usb-a'],
    'android':     ['usb-c','micro-usb'],
    'samsung':     ['usb-c'],
    'pixel':       ['usb-c'],
    'oneplus':     ['usb-c'],
    'laptop':      ['usb-a','usb-c','hdmi'],
    'computer':    ['usb-a','usb-c','hdmi'],
    'pc':          ['usb-a','usb-c','hdmi'],
    'tv':          ['hdmi'],
    'television':  ['hdmi'],
    'monitor':     ['hdmi','usb-c'],
    'display':     ['hdmi','usb-c'],
    'projector':   ['hdmi'],
    'speaker':     ['3.5mm','bluetooth'],
    'headphones':  ['3.5mm','bluetooth','usb-c','lightning'],
    'earphones':   ['3.5mm','lightning','bluetooth'],
    'earbuds':     ['bluetooth','usb-c','lightning'],
    'earpods':     ['lightning'],
    'airpods':     ['lightning','bluetooth'],
    'car':         ['3.5mm','bluetooth','usb-a'],
    'camera':      ['usb-c','micro-usb','hdmi'],
    'printer':     ['usb-a'],
    'power bank':  ['usb-a','usb-c','micro-usb'],
    'powerbank':   ['usb-a','usb-c','micro-usb'],
    'trimmer':     ['proprietary','micro-usb','usb-c'],
    'shaver':      ['proprietary','micro-usb'],
    'controller':  ['usb-a','usb-c','bluetooth'],
    'kindle':      ['micro-usb','usb-c'],
    'tablet':      ['usb-c','lightning','micro-usb'],
    'switch':      ['usb-c'],
    'xbox':        ['usb-a','usb-c'],
    'playstation': ['usb-a','usb-c'],
    'ps5':         ['usb-a','usb-c'],
    'gopro':       ['usb-c'],
    'drone':       ['usb-c'],
    'raspberry pi':['usb-c','micro-usb','hdmi'],
  };

  // Map intent verbs → category/connector filters
  const INTENT_MAP = {
    'charge':   { categories: ['cables','power','adapters'], hint: 'Showing charging-related items' },
    'charging': { categories: ['cables','power','adapters'], hint: 'Showing charging-related items' },
    'listen':   { categories: ['audio','cables','adapters'], connectors: ['3.5mm','bluetooth','lightning'], hint: 'Showing audio items' },
    'music':    { categories: ['audio','cables','adapters'], connectors: ['3.5mm','bluetooth'], hint: 'Showing items for music' },
    'audio':    { categories: ['audio','cables','adapters'], connectors: ['3.5mm','bluetooth','lightning'], hint: 'Showing audio-related items' },
    'sound':    { categories: ['audio','cables','adapters'], connectors: ['3.5mm','bluetooth'], hint: 'Showing audio items' },
    'watch':    { connectors: ['hdmi'], hint: 'Showing video output items' },
    'video':    { connectors: ['hdmi'], hint: 'Showing video items' },
    'screen':   { connectors: ['hdmi','usb-c'], hint: 'Showing display connection items' },
    'transfer': { categories: ['storage','cables'], hint: 'Showing data transfer items' },
    'files':    { categories: ['storage','cables'], hint: 'Showing file transfer items' },
    'data':     { categories: ['storage','cables'], hint: 'Showing data transfer items' },
    'store':    { categories: ['storage'], hint: 'Showing storage items' },
    'storage':  { categories: ['storage'], hint: 'Showing storage items' },
    'backup':   { categories: ['storage'], hint: 'Showing storage items' },
    'connect':  { hint: 'Showing compatible connections' },
    'plug':     { hint: 'Showing compatible connections' },
    'hook':     { hint: 'Showing compatible connections' },
    'pair':     { hint: 'Showing compatible items' },
  };

  // Synonym / alias expansion for connector names
  const CONNECTOR_ALIASES = {
    'type c':       'usb-c',
    'type-c':       'usb-c',
    'typec':        'usb-c',
    'usbc':         'usb-c',
    'usb c':        'usb-c',
    'usb-c':        'usb-c',
    'thunderbolt':  'usb-c',
    'usb a':        'usb-a',
    'usba':         'usb-a',
    'usb-a':        'usb-a',
    'lightning':    'lightning',
    'micro usb':    'micro-usb',
    'microusb':     'micro-usb',
    'micro-usb':    'micro-usb',
    'hdmi':         'hdmi',
    '3.5mm':        '3.5mm',
    '3.5 mm':       '3.5mm',
    'aux':          '3.5mm',
    'headphone jack':'3.5mm',
    'audio jack':   '3.5mm',
    'jack':         '3.5mm',
    'magsafe':      'magsafe',
    'mag safe':     'magsafe',
    'bluetooth':    'bluetooth',
    'bt':           'bluetooth',
    'wireless':     'bluetooth',
    'battery':      'aaa',
    'batteries':    'aaa',
    'cell':         'aaa',
    'cells':        'aaa',
    'aaa':          'aaa',
    'pendrive':     '_storage',
    'pen drive':    '_storage',
    'flash drive':  '_storage',
    'usb drive':    '_storage',
    'thumb drive':  '_storage',
  };

  /* -------------------------------------------------------
     STATE
     ------------------------------------------------------- */
  const STORAGE_KEY = 'cable_inventory_v2';
  let items = [];
  let editingId = null;
  let deletingId = null;
  let activeFilter = 'all';
  let activeSort = 'name-asc';
  let searchQuery = '';
  let searchHint = '';
  let activeView = 'pairing';
  let slot1Connector = null;
  let slot2Connector = null;

  /* -------------------------------------------------------
     DOM
     ------------------------------------------------------- */
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  const dom = {
    grid:           $('#item-grid'),
    emptyState:     $('#empty-state'),
    searchInput:    $('#search-input'),
    searchHint:     $('#search-hint'),
    searchHintText: $('#search-hint-text'),
    searchClear:    $('#search-clear'),
    sortSelect:     $('#sort-select'),
    addBtn:         $('#add-item-btn'),
    emptyAddBtn:    $('#empty-add-btn'),
    fab:            $('#fab'),
    // Views
    viewTabs:       $('#view-tabs'),
    inventorySection: $('#inventory-section'),
    pairingSection: $('#pairing-section'),
    pairingCanvas:  $('.pairing-canvas'),
    pairingDockScroll: $('#pairing-dock-scroll'),
    pairingResults: $('#pairing-results'),
    pairingPlaceholder: $('#pairing-placeholder'),
    slot1:          $('#slot-1'),
    slot2:          $('#slot-2'),
    slot1Remove:    $('#slot-1-remove'),
    slot2Remove:    $('#slot-2-remove'),
    pairingClear:   $('#pairing-clear-btn'),
    // Modal
    modalOverlay:   $('#modal-overlay'),
    modalTitle:     $('#modal-title'),
    modalClose:     $('#modal-close'),
    modalCancel:    $('#modal-cancel'),
    modalSave:      $('#modal-save'),
    itemForm:       $('#item-form'),
    // Confirm
    confirmOverlay: $('#confirm-overlay'),
    confirmCancel:  $('#confirm-cancel'),
    confirmDelete:  $('#confirm-delete'),
    confirmDesc:    $('#confirm-desc'),
    // Toast
    toastContainer: $('#toast-container'),
    // Dropdown
    moreBtn:        $('#more-btn'),
    moreMenu:       $('#more-menu'),
    exportBtn:      $('#export-btn'),
    importBtn:      $('#import-btn'),
    importFile:     $('#import-file'),
    // Stats
    statItems:      $('#stat-items'),
    statCategories: $('#stat-categories'),
    statConnectors: $('#stat-connectors'),
    statPairings:   $('#stat-pairings'),
  };

  const fields = {
    name:     $('#f-name'),
    category: $('#f-category'),
    qty:      $('#f-qty'),
    connA:    $('#f-conn-a'),
    connB:    $('#f-conn-b'),
    notes:    $('#f-notes'),
  };

  /* -------------------------------------------------------
     PERSISTENCE
     ------------------------------------------------------- */
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        items = JSON.parse(raw);
      } else {
        // First run — load default inventory
        items = DEFAULT_INVENTORY.map(d => ({ ...d, createdAt: new Date().toISOString() }));
        save();
      }
    } catch { items = []; }
  }
  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
  function uid() { return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9); }

  /* -------------------------------------------------------
     SMART SEARCH ENGINE
     ------------------------------------------------------- */
  function smartSearch(query) {
    if (!query) return { results: [...items], hint: '', interpreted: '' };

    const raw = query.toLowerCase().trim();
    const tokens = raw.split(/\s+/);

    // Scoring map: itemId → { item, score, reasons }
    const scoreMap = new Map();
    items.forEach(it => scoreMap.set(it.id, { item: it, score: 0, reasons: [] }));

    function addScore(id, pts, reason) {
      const e = scoreMap.get(id);
      if (e) { e.score += pts; e.reasons.push(reason); }
    }

    // 1) Direct text match — name, notes, category label
    items.forEach(it => {
      const name = it.name.toLowerCase();
      const notes = (it.notes || '').toLowerCase();
      const catLabel = (CATEGORIES[it.category]?.label || '').toLowerCase();

      if (name.includes(raw)) {
        addScore(it.id, 100, 'name match');
      } else {
        // Partial token match in name
        let tokenHits = 0;
        tokens.forEach(t => { if (name.includes(t)) tokenHits++; });
        if (tokenHits > 0) addScore(it.id, tokenHits * 25, 'partial name');
      }

      if (notes.includes(raw)) addScore(it.id, 30, 'notes match');
      tokens.forEach(t => { if (notes.includes(t)) addScore(it.id, 10, 'notes token'); });

      if (catLabel.includes(raw) || tokens.some(t => catLabel.includes(t))) {
        addScore(it.id, 20, 'category match');
      }
    });

    // 2) Connector alias resolution
    let resolvedConnectors = new Set();
    let isStorageQuery = false;

    // Try multi-word aliases first (e.g., "type c", "micro usb", "pen drive")
    let remaining = raw;
    for (const [alias, connId] of Object.entries(CONNECTOR_ALIASES).sort((a, b) => b[0].length - a[0].length)) {
      if (remaining.includes(alias)) {
        if (connId === '_storage') {
          isStorageQuery = true;
        } else {
          resolvedConnectors.add(connId);
        }
        remaining = remaining.replace(alias, '').trim();
      }
    }

    // Boost items that have matching connectors
    resolvedConnectors.forEach(connId => {
      items.forEach(it => {
        if (it.connA === connId || it.connB === connId) {
          addScore(it.id, 60, `connector: ${CONNECTORS[connId]?.label}`);
        }
      });
    });

    if (isStorageQuery) {
      items.forEach(it => {
        if (it.category === 'storage') addScore(it.id, 80, 'storage match');
      });
    }

    // 3) Device name resolution
    let detectedDevices = [];
    for (const [device, conns] of Object.entries(DEVICE_TO_CONNECTORS)) {
      if (raw.includes(device)) {
        detectedDevices.push(device);
        conns.forEach(connId => {
          items.forEach(it => {
            if (it.connA === connId || it.connB === connId) {
              addScore(it.id, 45, `device "${device}" → ${CONNECTORS[connId]?.label}`);
            }
          });
        });
      }
    }

    // 4) Intent resolution
    let detectedIntent = null;
    for (const [intent, config] of Object.entries(INTENT_MAP)) {
      if (tokens.includes(intent) || raw.includes(intent)) {
        detectedIntent = config;
        if (config.categories) {
          items.forEach(it => {
            if (config.categories.includes(it.category)) {
              addScore(it.id, 35, `intent: ${intent}`);
            }
          });
        }
        if (config.connectors) {
          config.connectors.forEach(connId => {
            items.forEach(it => {
              if (it.connA === connId || it.connB === connId) {
                addScore(it.id, 40, `intent connector: ${intent}`);
              }
            });
          });
        }
        break; // use first matched intent
      }
    }

    // 5) "Connect X to Y" pattern
    const connectMatch = raw.match(/(?:connect|plug|hook|pair|link)\s+(.+?)\s+(?:to|with|into)\s+(.+)/);
    if (connectMatch) {
      const [, srcRaw, dstRaw] = connectMatch;
      const srcConns = resolveToConnectors(srcRaw);
      const dstConns = resolveToConnectors(dstRaw);

      if (srcConns.length && dstConns.length) {
        // Find items that bridge any srcConn to any dstConn
        items.forEach(it => {
          const itemConns = [it.connA, it.connB].filter(Boolean);
          const hasSrc = itemConns.some(c => srcConns.includes(c));
          const hasDst = itemConns.some(c => dstConns.includes(c));
          if (hasSrc && hasDst) {
            addScore(it.id, 150, 'bridges both endpoints');
          } else if (hasSrc || hasDst) {
            addScore(it.id, 40, 'matches one endpoint');
          }
        });
      } else {
        // Fall back to text matching for unrecognised terms
        [srcRaw, dstRaw].forEach(term => {
          items.forEach(it => {
            if (it.name.toLowerCase().includes(term.trim())) {
              addScore(it.id, 50, 'endpoint name match');
            }
          });
        });
      }
    }

    // 6) Fuzzy fallback — Levenshtein-like for short queries
    if (tokens.length === 1 && raw.length >= 3) {
      items.forEach(it => {
        const words = it.name.toLowerCase().split(/\s+/);
        words.forEach(w => {
          if (w.length >= 3 && levenshtein(raw, w) <= 2) {
            addScore(it.id, 20, 'fuzzy match');
          }
        });
      });
    }

    // Collect results with score > 0, sorted by score desc
    const scored = [...scoreMap.values()]
      .filter(e => e.score > 0)
      .sort((a, b) => b.score - a.score);

    // Build hint text
    let hint = '';
    if (detectedIntent) {
      hint = detectedIntent.hint;
    }
    if (detectedDevices.length > 0) {
      const devList = detectedDevices.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ');
      hint = `Searching for items compatible with ${devList}`;
    }
    if (connectMatch && scored.length > 0) {
      hint = `Found ${scored.length} item${scored.length !== 1 ? 's' : ''} that can bridge this connection`;
    }
    if (!hint && scored.length > 0) {
      hint = `${scored.length} result${scored.length !== 1 ? 's' : ''} found`;
    }
    if (scored.length === 0) {
      hint = 'No matches found — try different keywords';
    }

    return { results: scored.map(e => e.item), hint };
  }

  // Resolve a text term to connector IDs
  function resolveToConnectors(text) {
    const t = text.trim().toLowerCase();
    const conns = new Set();

    // Direct alias
    for (const [alias, connId] of Object.entries(CONNECTOR_ALIASES)) {
      if (t.includes(alias) && connId !== '_storage') conns.add(connId);
    }
    // Device mapping
    for (const [device, deviceConns] of Object.entries(DEVICE_TO_CONNECTORS)) {
      if (t.includes(device)) deviceConns.forEach(c => conns.add(c));
    }
    return [...conns];
  }

  // Simple Levenshtein distance
  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    if (Math.abs(m - n) > 2) return 3; // early exit
    const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
    for (let j = 1; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i-1] === b[j-1]
          ? dp[i-1][j-1]
          : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
      }
    }
    return dp[m][n];
  }

  /* -------------------------------------------------------
     PAIRING ENGINE
     ------------------------------------------------------- */
  function getAllConnectorsFromInventory() {
    const set = new Set();
    items.forEach(it => {
      if (it.connA) set.add(it.connA);
      if (it.connB) set.add(it.connB);
    });
    return [...set].sort((a, b) => (CONNECTORS[a]?.label || a).localeCompare(CONNECTORS[b]?.label || b));
  }

  function getPairingResultsDual(conn1, conn2) {
    if (conn1 && !conn2) {
      return items.filter(it => it.connA === conn1 || it.connB === conn1).map(it => {
        const otherConns = [];
        if (it.connA && it.connA !== conn1) otherConns.push(it.connA);
        if (it.connB && it.connB !== conn1) otherConns.push(it.connB);
        if (it.connA === conn1 && it.connB === conn1) otherConns.push(conn1);
        return { item: it, bridgesTo: otherConns };
      });
    } else if (conn1 && conn2) {
      return items.filter(it => {
        const c1 = it.connA;
        const c2 = it.connB;
        if (!c1 || !c2) return false;
        return (c1 === conn1 && c2 === conn2) || (c1 === conn2 && c2 === conn1);
      }).map(it => {
        return { item: it, bridgesTo: [conn2] };
      });
    }
    return [];
  }

  function countPossiblePairings() {
    // Count unique connector-to-connector bridges
    const bridges = new Set();
    items.forEach(it => {
      if (it.connA && it.connB) {
        const pair = [it.connA, it.connB].sort().join('↔');
        bridges.add(pair);
      }
    });
    return bridges.size;
  }

  /* -------------------------------------------------------
     STATS
     ------------------------------------------------------- */
  function updateStats() {
    const totalQty = items.reduce((s, it) => s + (it.qty || 1), 0);
    const cats = new Set(items.map(it => it.category));
    const conns = getAllConnectorsFromInventory();
    const pairings = countPossiblePairings();

    animateVal(dom.statItems, totalQty);
    animateVal(dom.statCategories, cats.size);
    animateVal(dom.statConnectors, conns.length);
    animateVal(dom.statPairings, pairings);
  }

  function animateVal(el, target) {
    const current = parseInt(el.textContent) || 0;
    if (current === target) return;
    const dur = 350;
    const start = performance.now();
    (function step(ts) {
      const p = Math.min((ts - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(current + (target - current) * e);
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  /* -------------------------------------------------------
     FILTERING & SORTING
     ------------------------------------------------------- */
  function getFilteredSorted() {
    let list;

    if (searchQuery) {
      const sr = smartSearch(searchQuery);
      list = sr.results;
      searchHint = sr.hint;
    } else {
      list = [...items];
      searchHint = '';
    }

    // Category filter
    if (activeFilter !== 'all') {
      list = list.filter(it => it.category === activeFilter);
    }

    // Sort (only if not search-ranked)
    if (!searchQuery) {
      switch (activeSort) {
        case 'name-asc':  list.sort((a, b) => a.name.localeCompare(b.name)); break;
        case 'name-desc': list.sort((a, b) => b.name.localeCompare(a.name)); break;
        case 'qty-desc':  list.sort((a, b) => (b.qty||1) - (a.qty||1)); break;
        case 'qty-asc':   list.sort((a, b) => (a.qty||1) - (b.qty||1)); break;
        case 'newest':    list.sort((a, b) => new Date(b.createdAt||0) - new Date(a.createdAt||0)); break;
      }
    }
    return list;
  }

  /* -------------------------------------------------------
     RENDER — INVENTORY
     ------------------------------------------------------- */
  function render() {
    dom.inventorySection.classList.toggle('inventory-section--hidden', activeView !== 'inventory');
    dom.pairingSection.classList.toggle('pairing-section--active', activeView === 'pairing');
    
    if (activeView === 'inventory') renderInventory();
    else renderPairing();
    updateStats();
  }

  function renderInventory() {
    const list = getFilteredSorted();
    dom.grid.innerHTML = '';

    // Search hint
    if (searchHint && searchQuery) {
      dom.searchHint.style.display = 'flex';
      dom.searchHintText.textContent = searchHint;
    } else {
      dom.searchHint.style.display = 'none';
    }

    if (items.length === 0) {
      dom.emptyState.style.display = 'flex';
      dom.grid.style.display = 'none';
      return;
    }
    dom.emptyState.style.display = 'none';
    dom.grid.style.display = '';

    if (list.length === 0) {
      dom.grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-state__icon">🔍</div>
          <h3 class="empty-state__title">No matches</h3>
          <p class="empty-state__desc">Try different keywords, or ask a question like "charge my iPhone".</p>
        </div>`;
      return;
    }

    list.forEach(it => dom.grid.appendChild(createCard(it)));
  }

  function createCard(it) {
    const cat = CATEGORIES[it.category] || CATEGORIES.cables;
    const div = document.createElement('div');
    div.className = 'item-card animate-in';
    div.dataset.cat = it.category;
    div.dataset.id = it.id;

    const connA = it.connA ? CONNECTORS[it.connA] : null;
    const connB = it.connB ? CONNECTORS[it.connB] : null;

    let connHtml = '';
    if (connA) {
      connHtml += `<span class="connector-badge"><span class="connector-badge__icon">${connA.icon}</span>${connA.label}</span>`;
      if (connB) {
        connHtml += `<span class="connector-arrow">↔</span>`;
        connHtml += `<span class="connector-badge"><span class="connector-badge__icon">${connB.icon}</span>${connB.label}</span>`;
      }
    }

    div.innerHTML = `
      <div class="item-card__header">
        <div class="item-card__icon">${cat.icon}</div>
        <div class="item-card__title-wrap">
          <div class="item-card__name" title="${esc(it.name)}">${esc(it.name)}</div>
          <div class="item-card__category">${cat.label}</div>
        </div>
        <div class="item-card__actions">
          <button class="item-card__action-btn" data-action="edit" data-id="${it.id}" title="Edit" aria-label="Edit">✏️</button>
          <button class="item-card__action-btn item-card__action-btn--del" data-action="delete" data-id="${it.id}" title="Delete" aria-label="Delete">🗑️</button>
        </div>
      </div>
      ${connHtml ? `<div class="connectors-row">${connHtml}</div>` : ''}
      ${it.notes ? `<div class="item-card__notes">${esc(it.notes)}</div>` : ''}
      <div class="item-card__footer">
        <div class="item-card__qty">×<span>${it.qty || 1}</span></div>
      </div>
    `;
    return div;
  }

  /* -------------------------------------------------------
     RENDER — PAIRING
     ------------------------------------------------------- */
  /* -------------------------------------------------------
     RENDER — PAIRING (Drag & Drop)
     ------------------------------------------------------- */
  function renderPairing() {
    // Render Dock
    const connectors = getAllConnectorsFromInventory();
    dom.pairingDockScroll.innerHTML = '';
    
    connectors.forEach(connId => {
      const meta = CONNECTORS[connId];
      if (!meta) return;
      const count = items.filter(it => it.connA === connId || it.connB === connId).length;
      
      const el = document.createElement('div');
      el.className = 'dock-item';
      el.dataset.connector = connId;
      el.draggable = true;
      el.innerHTML = `
        <div class="dock-item__icon">${meta.icon}</div>
        <div class="dock-item__label">${meta.label} <span style="opacity:0.6;font-weight:400;display:block">(${count})</span></div>
      `;
      dom.pairingDockScroll.appendChild(el);
    });

    // Render Slots
    function updateSlot(slotEl, connId, defaultLabel) {
      const iconWrap = slotEl.querySelector('.pairing-slot__icon');
      const labelEl = slotEl.querySelector('.pairing-slot__label');
      const removeBtn = slotEl.querySelector('.pairing-slot__remove');
      
      if (connId && CONNECTORS[connId]) {
        const meta = CONNECTORS[connId];
        slotEl.classList.add('has-item');
        iconWrap.innerHTML = meta.icon;
        labelEl.textContent = meta.label;
        removeBtn.style.display = 'flex';
      } else {
        slotEl.classList.remove('has-item');
        iconWrap.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="m9 18 3 3 3-3"/><path d="m9 6 3-3 3 3"/></svg>';
        labelEl.textContent = defaultLabel;
        removeBtn.style.display = 'none';
      }
    }
    
    updateSlot(dom.slot1, slot1Connector, 'Drop Port 1');
    updateSlot(dom.slot2, slot2Connector, 'Drop Port 2');

    let showSlot1 = true;
    let showSlot2 = true;

    if (slot1Connector && !slot2Connector) {
      const matches = items.filter(it => it.connA === slot1Connector || it.connB === slot1Connector);
      let possible = 0;
      matches.forEach(it => {
        if (it.connA === slot1Connector && it.connB) possible++;
        if (it.connB === slot1Connector && it.connA) possible++;
      });
      if (possible === 0) showSlot2 = false;
    } else if (slot2Connector && !slot1Connector) {
      const matches = items.filter(it => it.connA === slot2Connector || it.connB === slot2Connector);
      let possible = 0;
      matches.forEach(it => {
        if (it.connA === slot2Connector && it.connB) possible++;
        if (it.connB === slot2Connector && it.connA) possible++;
      });
      if (possible === 0) showSlot1 = false;
    }

    dom.slot1.style.display = showSlot1 ? 'flex' : 'none';
    dom.slot2.style.display = showSlot2 ? 'flex' : 'none';
    
    const linkIcon = dom.pairingCanvas.querySelector('.pairing-canvas__link');
    if (linkIcon) linkIcon.style.display = (showSlot1 && showSlot2) ? 'flex' : 'none';

    dom.pairingCanvas.classList.toggle('has-both', !!(slot1Connector && slot2Connector));
    dom.pairingClear.style.display = (slot1Connector || slot2Connector) ? 'inline-flex' : 'none';

    // Render Results
    dom.pairingResults.innerHTML = '';
    if (!slot1Connector && !slot2Connector) {
      dom.pairingResults.appendChild(dom.pairingPlaceholder);
      dom.pairingPlaceholder.style.display = 'flex';
      dom.pairingPlaceholder.querySelector('.pairing-empty__title').textContent = 'Ready to pair';
      dom.pairingPlaceholder.querySelector('.pairing-empty__desc').textContent = 'Place one or two connectors onto the canvas to see your options.';
      return;
    }

    // Always sort so that we search conn1 to conn2. If only slot2 is filled, treat it as conn1.
    const c1 = slot1Connector || slot2Connector;
    const c2 = (slot1Connector && slot2Connector) ? slot2Connector : null;
    
    const results = getPairingResultsDual(c1, c2);

    let headerText = '';
    if (c1 && c2) {
      headerText = `Bridges ${CONNECTORS[c1].label} ↔ ${CONNECTORS[c2].label}`;
    } else {
      headerText = `Items with ${CONNECTORS[c1].label}`;
    }

    dom.pairingResults.innerHTML = `
      <div class="pairing-header">
        ${headerText}
        <span class="pairing-header__badge">${results.length}</span>
      </div>
    `;

    if (results.length === 0) {
      dom.pairingResults.innerHTML += `
        <div class="pairing-empty" style="padding:40px 20px;">
          <div class="pairing-empty__icon">🤷</div>
          <h3 class="pairing-empty__title">No items found</h3>
          <p class="pairing-empty__desc">No items in your inventory match this combination.</p>
        </div>`;
      return;
    }

    results.forEach(({ item, bridgesTo }) => {
      const cat = CATEGORIES[item.category] || CATEGORIES.cables;
      let bridgeHtml = '';
      if (bridgesTo.length > 0) {
        bridgeHtml = bridgesTo.map(c => {
          const m = CONNECTORS[c];
          return m ? `<span class="pairing-result__bridge-connector" style="display:inline-flex;align-items:center;gap:4px;"><span style="width:12px;height:12px;display:flex;">${m.icon}</span> ${m.label}</span>` : '';
        }).filter(Boolean).join(' ');
        bridgeHtml = `<div class="pairing-result__bridge">Bridges to → ${bridgeHtml}</div>`;
      } else {
        bridgeHtml = `<div class="pairing-result__bridge">Endpoint device</div>`;
      }

      const el = document.createElement('div');
      el.className = 'pairing-result animate-in';
      el.innerHTML = `
        <div class="pairing-result__icon">${cat.icon}</div>
        <div class="pairing-result__info">
          <div class="pairing-result__name">${esc(item.name)}</div>
          ${bridgeHtml}
        </div>
        <div class="pairing-result__qty">×${item.qty || 1}</div>
      `;
      dom.pairingResults.appendChild(el);
    });
  }

  /* -------------------------------------------------------
     MODAL
     ------------------------------------------------------- */
  function openModal(mode = 'add', item = null) {
    editingId = item ? item.id : null;
    dom.modalTitle.textContent = mode === 'edit' ? 'Edit Cable' : 'Add Cable';
    dom.modalSave.textContent = mode === 'edit' ? 'Save Changes' : 'Save';
    dom.itemForm.reset();
    fields.qty.value = 1;

    if (item) {
      fields.name.value = item.name || '';
      fields.category.value = item.category || '';
      fields.qty.value = item.qty || 1;
      fields.connA.value = item.connA || '';
      fields.connB.value = item.connB || '';
      fields.notes.value = item.notes || '';
    }

    dom.modalOverlay.classList.add('modal-overlay--visible');
    document.body.style.overflow = 'hidden';
    setTimeout(() => fields.name.focus(), 250);
  }
  function closeModal() {
    dom.modalOverlay.classList.remove('modal-overlay--visible');
    document.body.style.overflow = '';
    editingId = null;
  }

  function saveItem() {
    const data = {
      name:     fields.name.value.trim(),
      category: fields.category.value,
      qty:      Math.max(1, parseInt(fields.qty.value) || 1),
      connA:    fields.connA.value,
      connB:    fields.connB.value,
      notes:    fields.notes.value.trim(),
    };
    if (!data.name || !data.category) return;

    if (editingId) {
      const idx = items.findIndex(it => it.id === editingId);
      if (idx !== -1) items[idx] = { ...items[idx], ...data };
      showToast('Cable updated', 'success');
    } else {
      items.push({ id: uid(), ...data, createdAt: new Date().toISOString() });
      showToast('Cable added', 'success');
    }
    save();
    closeModal();
    render();
  }

  /* -------------------------------------------------------
     DELETE
     ------------------------------------------------------- */
  function openConfirm(id) {
    deletingId = id;
    const it = items.find(x => x.id === id);
    if (it) dom.confirmDesc.textContent = `"${it.name}" will be permanently removed.`;
    dom.confirmOverlay.classList.add('modal-overlay--visible');
    document.body.style.overflow = 'hidden';
  }
  function closeConfirm() {
    dom.confirmOverlay.classList.remove('modal-overlay--visible');
    document.body.style.overflow = '';
    deletingId = null;
  }
  function deleteItem() {
    if (!deletingId) return;
    items = items.filter(it => it.id !== deletingId);
    save(); closeConfirm(); render();
    showToast('Cable deleted', 'info');
  }

  /* -------------------------------------------------------
     TOAST
     ------------------------------------------------------- */
  function showToast(msg, type = 'info') {
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    const t = document.createElement('div');
    t.className = `toast toast--${type}`;
    t.innerHTML = `<span class="toast__icon">${icons[type]}</span><span>${msg}</span>`;
    dom.toastContainer.appendChild(t);
    setTimeout(() => {
      t.classList.add('toast--leaving');
      t.addEventListener('animationend', () => t.remove());
    }, 2800);
  }

  /* -------------------------------------------------------
     EXPORT / IMPORT
     ------------------------------------------------------- */
  function exportJSON() {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `cable-inventory-${new Date().toISOString().slice(0,10)}.json`;
    a.click(); URL.revokeObjectURL(url);
    showToast('Exported', 'success');
    dom.moreMenu.classList.remove('dropdown__menu--visible');
  }
  function importJSON(file) {
    if (!file) return;
    const r = new FileReader();
    r.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) throw 0;
        let added = 0;
        data.forEach(c => {
          if (c.name && c.category && !items.find(x => x.id === c.id)) {
            items.push({ id: c.id || uid(), ...c, createdAt: c.createdAt || new Date().toISOString() });
            added++;
          }
        });
        save(); render();
        showToast(`Imported ${added} cable${added !== 1 ? 's' : ''}`, 'success');
      } catch { showToast('Invalid file', 'error'); }
    };
    r.readAsText(file);
    dom.moreMenu.classList.remove('dropdown__menu--visible');
  }

  /* -------------------------------------------------------
     UTILS
     ------------------------------------------------------- */
  function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  /* -------------------------------------------------------
     EVENTS
     ------------------------------------------------------- */
  function bind() {
    // Add buttons
    dom.addBtn.addEventListener('click', () => openModal('add'));
    dom.emptyAddBtn?.addEventListener('click', () => openModal('add'));
    dom.fab.addEventListener('click', () => openModal('add'));

    // Modal
    dom.modalClose.addEventListener('click', closeModal);
    dom.modalCancel.addEventListener('click', closeModal);
    dom.modalOverlay.addEventListener('click', e => { if (e.target === dom.modalOverlay) closeModal(); });
    dom.itemForm.addEventListener('submit', e => { e.preventDefault(); saveItem(); });

    // Confirm
    dom.confirmCancel.addEventListener('click', closeConfirm);
    dom.confirmDelete.addEventListener('click', deleteItem);
    dom.confirmOverlay.addEventListener('click', e => { if (e.target === dom.confirmOverlay) closeConfirm(); });

    // Card actions (delegated)
    dom.grid.addEventListener('click', e => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const id = btn.dataset.id;
      if (btn.dataset.action === 'edit') {
        const it = items.find(x => x.id === id);
        if (it) openModal('edit', it);
      } else if (btn.dataset.action === 'delete') {
        openConfirm(id);
      }
    });

    // Search
    let searchTimer;
    dom.searchInput.addEventListener('input', e => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        searchQuery = e.target.value.trim();
        render();
      }, 200);
    });
    dom.searchClear.addEventListener('click', () => {
      searchQuery = '';
      dom.searchInput.value = '';
      render();
    });

    // Sort
    dom.sortSelect.addEventListener('change', e => { activeSort = e.target.value; render(); });

    // Filter chips
    $$('.chip[data-filter]').forEach(c => {
      c.addEventListener('click', () => {
        $$('.chip[data-filter]').forEach(x => x.classList.remove('chip--active'));
        c.classList.add('chip--active');
        activeFilter = c.dataset.filter;
        render();
      });
    });

    // View tabs
    dom.viewTabs.addEventListener('click', e => {
      const tab = e.target.closest('.view-tab');
      if (!tab) return;
      $$('.view-tab').forEach(t => t.classList.remove('view-tab--active'));
      tab.classList.add('view-tab--active');
      activeView = tab.dataset.view;

      dom.inventorySection.classList.toggle('inventory-section--hidden', activeView !== 'inventory');
      dom.pairingSection.classList.toggle('pairing-section--active', activeView === 'pairing');
      render();
    });

    // Drag and Drop Logic
    let draggedConnId = null;

    dom.pairingDockScroll.addEventListener('dragstart', e => {
      const item = e.target.closest('.dock-item');
      if (!item) return;
      draggedConnId = item.dataset.connector;
      e.dataTransfer.setData('text/plain', draggedConnId);
      e.dataTransfer.effectAllowed = 'copy';
      setTimeout(() => item.classList.add('is-dragging'), 0);
    });
    
    dom.pairingDockScroll.addEventListener('dragend', e => {
      const item = e.target.closest('.dock-item');
      if (item) item.classList.remove('is-dragging');
      draggedConnId = null;
      dom.slot1.classList.remove('drag-over');
      dom.slot2.classList.remove('drag-over');
    });

    [dom.slot1, dom.slot2].forEach(slot => {
      slot.addEventListener('dragover', e => {
        e.preventDefault();
        if (draggedConnId) {
          e.dataTransfer.dropEffect = 'copy';
          slot.classList.add('drag-over');
        }
      });
      slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
      slot.addEventListener('drop', e => {
        e.preventDefault();
        slot.classList.remove('drag-over');
        const connId = e.dataTransfer.getData('text/plain');
        if (connId) {
          if (slot.id === 'slot-1') slot1Connector = connId;
          if (slot.id === 'slot-2') slot2Connector = connId;
          renderPairing();
        }
      });
    });

    // Custom Touch Drag & Drop Logic for Mobile
    let touchGhost = null;
    let touchConnId = null;

    dom.pairingDockScroll.addEventListener('touchstart', e => {
      const item = e.target.closest('.dock-item');
      if (!item) return;
      
      touchConnId = item.dataset.connector;
      const rect = item.getBoundingClientRect();
      const touch = e.touches[0];

      // Create ghost element
      touchGhost = item.cloneNode(true);
      touchGhost.classList.add('drag-ghost');
      touchGhost.style.position = 'fixed';
      touchGhost.style.left = `${rect.left}px`;
      touchGhost.style.top = `${rect.top}px`;
      touchGhost.style.width = `${rect.width}px`;
      touchGhost.style.height = `${rect.height}px`;
      touchGhost.style.pointerEvents = 'none';
      touchGhost.style.zIndex = '9999';
      touchGhost.style.opacity = '0.85';
      touchGhost.style.transform = 'scale(1.05)';
      touchGhost.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
      document.body.appendChild(touchGhost);
      
      // Store offsets
      touchGhost.dataset.offsetX = touch.clientX - rect.left;
      touchGhost.dataset.offsetY = touch.clientY - rect.top;
      
      item.classList.add('is-dragging');
      // Delay preventDefault so scroll isn't completely broken if they just tap?
      // Actually, if we're dragging, we shouldn't preventDefault immediately unless they move.
      // But for simplicity, we'll let touchmove handle preventDefault.
    }, { passive: false });

    document.addEventListener('touchmove', e => {
      if (!touchGhost) return;
      if (e.cancelable) e.preventDefault();
      const touch = e.touches[0];
      const offsetX = parseFloat(touchGhost.dataset.offsetX);
      const offsetY = parseFloat(touchGhost.dataset.offsetY);
      touchGhost.style.left = `${touch.clientX - offsetX}px`;
      touchGhost.style.top = `${touch.clientY - offsetY}px`;

      // Highlight slots
      const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      const slot = elemBelow ? elemBelow.closest('.pairing-slot') : null;
      
      [dom.slot1, dom.slot2].forEach(s => s.classList.remove('drag-over'));
      if (slot) slot.classList.add('drag-over');
    }, { passive: false });

    document.addEventListener('touchend', e => {
      if (!touchGhost) return;
      const touch = e.changedTouches[0];
      const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      const slot = elemBelow ? elemBelow.closest('.pairing-slot') : null;
      
      if (slot && touchConnId) {
        if (slot.id === 'slot-1') slot1Connector = touchConnId;
        if (slot.id === 'slot-2') slot2Connector = touchConnId;
        renderPairing();
      }
      
      [dom.slot1, dom.slot2].forEach(s => s.classList.remove('drag-over'));
      const activeItem = dom.pairingDockScroll.querySelector('.dock-item.is-dragging');
      if (activeItem) activeItem.classList.remove('is-dragging');
      
      touchGhost.remove();
      touchGhost = null;
      touchConnId = null;
    });

    dom.slot1Remove.addEventListener('click', e => { e.stopPropagation(); slot1Connector = null; renderPairing(); });
    dom.slot2Remove.addEventListener('click', e => { e.stopPropagation(); slot2Connector = null; renderPairing(); });
    dom.pairingClear.addEventListener('click', () => { slot1Connector = null; slot2Connector = null; renderPairing(); });

    // Dropdown
    dom.moreBtn.addEventListener('click', e => { e.stopPropagation(); dom.moreMenu.classList.toggle('dropdown__menu--visible'); });
    document.addEventListener('click', () => dom.moreMenu.classList.remove('dropdown__menu--visible'));
    dom.exportBtn.addEventListener('click', exportJSON);
    dom.importBtn.addEventListener('click', () => dom.importFile.click());
    dom.importFile.addEventListener('change', e => { importJSON(e.target.files[0]); e.target.value = ''; });

    // Keyboard
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        if (dom.confirmOverlay.classList.contains('modal-overlay--visible')) closeConfirm();
        else if (dom.modalOverlay.classList.contains('modal-overlay--visible')) closeModal();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dom.searchInput.focus();
      }
    });
  }

  /* -------------------------------------------------------
     SERVICE WORKER
     ------------------------------------------------------- */
  async function registerSW() {
    if ('serviceWorker' in navigator) {
      try { await navigator.serviceWorker.register('sw.js'); }
      catch (err) { console.warn('SW:', err); }
    }
  }

  /* -------------------------------------------------------
     INIT
     ------------------------------------------------------- */
  function init() {
    load();
    bind();
    render();
    registerSW();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
