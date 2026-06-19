# 🔌 Cable

**Your cable clutter, finally organised.**

Cable is a sleek, offline-first Progressive Web App that helps you catalogue every cable, adapter, charger, and accessory you own. No more buying duplicates. No more digging through drawers. Just search, find, and know exactly what you have.

> **[→ Open Cable](https://spandansaxena.github.io/Cable/)**

---

## ✨ Features

### 📦 Full Inventory Management
Add, edit, and delete items with details like connector types, quantity, category, and notes. Your data lives in your browser's local storage — no account needed, no data leaves your device.

### 🧠 Smart Natural Language Search
Don't remember the exact name? Just describe what you need:

| You type | Cable understands |
|---|---|
| `charge iphone` | Shows Lightning & USB-C cables, chargers, and adapters |
| `connect laptop to tv` | Finds your HDMI adapters and cables |
| `audio from macbook` | Surfaces USB-C to 3.5mm adapters and aux cables |
| `transfer files` | Shows pendrives and data cables |
| `headphones` | Lists audio gear with 3.5mm, Lightning, or Bluetooth |

The search engine uses synonym expansion, device-to-connector mapping, intent detection, fuzzy matching, and a `connect X to Y` bridging pattern — all running locally in your browser.

### 🔗 Pairing Mode
Select a connector type (USB-C, Lightning, HDMI, etc.) and instantly see every item in your inventory that uses it — along with what the *other* end connects to. Perfect for answering _"I have a USB-C port… what can I plug into it?"_

### 🎨 Skeuomorphic Dark UI
A premium dark interface inspired by physical control panels — beveled buttons, inset inputs, raised cards with multi-layer shadows, subtle noise textures, and a brushed-metal header. Every element feels tactile and intentional.

### 📱 PWA — Install & Go Offline
Install Cable to your home screen on any device. The service worker caches everything, so it works fully offline — your inventory is always at your fingertips.

### 📤 Export & Import
Back up your inventory as JSON, or share it across devices. Import merges intelligently without creating duplicates.

---

## 🛠️ Tech Stack

| | |
|---|---|
| **Structure** | Semantic HTML5 |
| **Styling** | Vanilla CSS — custom properties, gradients, multi-layer shadows |
| **Logic** | Vanilla JavaScript (ES2020+, no dependencies) |
| **Fonts** | [Inter](https://fonts.google.com/specimen/Inter) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) |
| **Storage** | `localStorage` |
| **Offline** | Service Worker with cache-first strategy |
| **Hosting** | GitHub Pages (static files only) |

**Zero dependencies. Zero build step. Just open `index.html`.**

---

## 🚀 Getting Started

### Run locally

```bash
# Clone the repo
git clone https://github.com/spandansaxena/Cable.git
cd Cable

# Serve with any static server
npx serve .
# or
python3 -m http.server 3000
```

Open `http://localhost:3000` in your browser.

### Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to **main branch**, root `/`
4. Your app is live at `https://<username>.github.io/Cable/`

---

## 📁 Project Structure

```
Cable/
├── index.html          # App shell & semantic markup
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (offline caching)
├── claude.png          # Claude logo
├── css/
│   └── style.css       # Complete design system
├── js/
│   └── app.js          # App logic, smart search, pairing engine
└── icons/
    ├── favicon.svg     # Vector favicon
    ├── icon-192.png    # PWA icon (192×192)
    └── icon-512.png    # PWA icon (512×512)
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Focus search bar |
| `Escape` | Close any open modal |

---

## 📸 Screenshots

> _Screenshots coming soon — or just [open the app](https://spandansaxena.github.io/Cable/) and see for yourself._

---

<p align="center">
  Made with ❤️ by <strong>Spandan</strong> and <strong>Claude</strong>
</p>
