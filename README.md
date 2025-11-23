# Twitter Account Location Flag Browser Extension

A browser extension (Chrome + Firefox) that displays **country flag emojis** next to Twitter/X usernames based on the account’s publicly available location information.

## Features

- 🚩 Adds a country flag next to Twitter/X usernames  
- 🔍 Uses Twitter’s GraphQL API to detect account location  
- ⚡ Supports infinite scrolling and dynamically loaded content  
- 📦 Caches results to reduce API calls  
- 🔐 Uses the user’s own authenticated session (no external servers)

---

## Installation

### Chrome / Chromium-based Browsers (Brave, Edge, Opera, Vivaldi)

1. Download or clone this repository  
2. Open `chrome://extensions/`  
3. Enable **Developer mode** (top-right corner)  
4. Click **Load unpacked**  
5. Select the folder containing this extension  
6. Visit Twitter/X — the extension will activate automatically

### Firefox Permanent Installation

1. Download or clone this repository
2. Install the Firefox Developer edition: https://www.firefox.com/en-GB/channel/desktop/?redirect_source=mozilla-org
3. Open about:config in Firefox and set xpinstall.signatures.required to false
4. Compress: content.js, countryFlags.js, manifest.json, pageScript.js, popup.html, popup.js into a single .zip File
5. Open about:addons in Firefox and drag the .zip Folder in the Window.
6. Give necessary Permissions and you are good to go.

#### Temporary Installation (recommended)

1. Download or clone this repository  
2. Open Firefox and navigate to:  
   `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on**  
4. Select any file inside the extension directory (e.g., `manifest.json`)  
5. The extension will load and work until Firefox is closed
---

## How It Works

1. A content script scans Twitter/X pages for username elements  
2. When a username is detected, a page-injected script requests profile data from Twitter’s GraphQL `AboutAccountQuery`  
3. The returned location (if available) is mapped to a flag emoji  
4. The emoji is added next to all matching username elements on the page

---

## Files

| File                 | Purpose |
|----------------------|---------|
| `manifest.json`      | Extension configuration (Manifest V3) |
| `content.js`         | Scans the page and communicates with page script |
| `pageScript.js`      | Injected script with access to Twitter’s authenticated API |
| `countryFlags.js`    | Maps country/location names to flag emojis |
| `popup.html`         | Extension popup UI |
| `popup.js`           | Toggle logic for enabling/disabling the extension |
| `README.md`          | Documentation |

---

## Twitter API Details

The extension uses the following GraphQL endpoint:
https://x.com/i/api/graphql/XRqGa7EeokUU5kppkh13EA/AboutAccountQuery

