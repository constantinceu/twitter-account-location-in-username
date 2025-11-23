// Popup script for extension toggle
const TOGGLE_KEY = 'extension_enabled';
const DEFAULT_ENABLED = true;

// Unified API for Chrome + Firefox
const browserAPI = typeof browser !== "undefined" ? browser : chrome;

// Get toggle element
const toggleSwitch = document.getElementById('toggleSwitch');
const status = document.getElementById('status');

// Load current state
browserAPI.storage.local.get(TOGGLE_KEY).then((result) => {
  const isEnabled = result[TOGGLE_KEY] !== undefined ? result[TOGGLE_KEY] : DEFAULT_ENABLED;
  updateToggle(isEnabled);
});

// Toggle click handler
toggleSwitch.addEventListener('click', async () => {
  const result = await browserAPI.storage.local.get(TOGGLE_KEY);
  const currentState = result[TOGGLE_KEY] !== undefined ? result[TOGGLE_KEY] : DEFAULT_ENABLED;
  const newState = !currentState;

  await browserAPI.storage.local.set({ [TOGGLE_KEY]: newState });
  updateToggle(newState);

  try {
    const tabs = await browserAPI.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
      await browserAPI.tabs.sendMessage(tabs[0].id, {
        type: 'extensionToggle',
        enabled: newState
      });
    }
  } catch (e) {
    // Content script may not be loaded yet — ignore
  }
});

function updateToggle(isEnabled) {
  if (isEnabled) {
    toggleSwitch.classList.add('enabled');
    status.textContent = 'Extension is enabled';
    status.style.color = '#1d9bf0';
  } else {
    toggleSwitch.classList.remove('enabled');
    status.textContent = 'Extension is disabled';
    status.style.color = '#536471';
  }
}
