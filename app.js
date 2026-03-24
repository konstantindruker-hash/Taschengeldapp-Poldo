import { initializeApp, getApps, deleteApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const STORAGE_KEY = "polds-taschengeld-data";
const SYNC_KEY = "polds-taschengeld-sync";

const symbols = [
  { id: "fox", name: "Fuchs", emoji: "🦊", text: "Der schlaue Fuchs passt auf das Geld auf." },
  { id: "lion", name: "Loewe", emoji: "🦁", text: "Der mutige Loewe bewacht das Kinderkonto." },
  { id: "panda", name: "Panda", emoji: "🐼", text: "Der Panda sammelt ruhig jeden Euro ein." },
  { id: "penguin", name: "Pinguin", emoji: "🐧", text: "Der Pinguin merkt sich jede Ausgabe." },
  { id: "rabbit", name: "Hase", emoji: "🐰", text: "Der schnelle Hase freut sich ueber jedes Taschengeld." },
  { id: "bear", name: "Baer", emoji: "🐻", text: "Der Baer bewacht das Sparziel." },
  { id: "koala", name: "Koala", emoji: "🐨", text: "Der Koala sammelt entspannt weiter." },
  { id: "tiger", name: "Tiger", emoji: "🐯", text: "Der Tiger passt auf jeden Betrag auf." },
  { id: "dog", name: "Hund", emoji: "🐶", text: "Der Hund freut sich ueber jede gute Sparrunde." },
  { id: "cat", name: "Katze", emoji: "🐱", text: "Die Katze merkt sich jeden Cent." },
  { id: "frog", name: "Frosch", emoji: "🐸", text: "Der Frosch springt mit jedem Euro naeher ans Ziel." },
  { id: "monkey", name: "Affe", emoji: "🐵", text: "Der Affe bringt gute Laune ins Sparen." },
  { id: "owl", name: "Eule", emoji: "🦉", text: "Die Eule beobachtet alle Eintraege ganz genau." },
  { id: "unicorn", name: "Einhorn", emoji: "🦄", text: "Das Einhorn macht Sparen magisch." },
  { id: "dolphin", name: "Delfin", emoji: "🐬", text: "Der Delfin schwimmt locker durchs Taschengeld." },
  { id: "whale", name: "Wal", emoji: "🐳", text: "Der Wal sammelt grosse und kleine Betraege." },
  { id: "turtle", name: "Schildkroete", emoji: "🐢", text: "Langsam, aber sicher kommt die Schildkroete ans Ziel." },
  { id: "octopus", name: "Oktopus", emoji: "🐙", text: "Der Oktopus hat alles im Griff." },
  { id: "shark", name: "Hai", emoji: "🦈", text: "Der Hai behaelt den Kontostand im Blick." },
  { id: "butterfly", name: "Schmetterling", emoji: "🦋", text: "Der Schmetterling sorgt fuer leichte Motivation." },
  { id: "bee", name: "Biene", emoji: "🐝", text: "Die Biene sammelt fleissig." },
  { id: "ladybug", name: "Marienkaefer", emoji: "🐞", text: "Der Marienkaefer bringt Glueck beim Sparen." },
  { id: "star", name: "Stern", emoji: "⭐", text: "Der Stern zeigt, wie gut das Sparen klappt." },
  { id: "rocket", name: "Rakete", emoji: "🚀", text: "Die Rakete steht fuer grosse Sparziele." },
  { id: "crown", name: "Krone", emoji: "👑", text: "Die Krone macht aus dem Konto etwas Besonderes." },
  { id: "gem", name: "Diamant", emoji: "💎", text: "Der Diamant steht fuer wertvolle Sparziele." },
  { id: "rainbow", name: "Regenbogen", emoji: "🌈", text: "Der Regenbogen macht die App bunt." },
  { id: "sun", name: "Sonne", emoji: "☀", text: "Die Sonne bringt gute Laune ins Sparen." },
  { id: "moon", name: "Mond", emoji: "🌙", text: "Der Mond passt abends aufs Konto auf." },
  { id: "soccer", name: "Fussball", emoji: "⚽", text: "Der Ball passt gut zu kleinen Belohnungen." },
  { id: "basketball", name: "Basketball", emoji: "🏀", text: "Basketball passt zu sportlichen Sparzielen." },
  { id: "baseball", name: "Baseball", emoji: "⚾", text: "Baseball bringt Spiel in den Tracker." },
  { id: "tennis", name: "Tennis", emoji: "🎾", text: "Der Tennisball macht die Auswahl lebendig." },
  { id: "volleyball", name: "Volleyball", emoji: "🏐", text: "Volleyball steht fuer gemeinsame Ziele." },
  { id: "football", name: "Football", emoji: "🏈", text: "Football wirkt stark und verspielt." },
  { id: "rugby", name: "Rugby", emoji: "🏉", text: "Rugby bringt Energie in die App." },
  { id: "bowling", name: "Bowling", emoji: "🎳", text: "Bowling passt gut zu Wochenzielen." },
  { id: "pingpong", name: "Tischtennis", emoji: "🏓", text: "Tischtennis steht fuer schnelle kleine Fortschritte." },
  { id: "badminton", name: "Badminton", emoji: "🏸", text: "Badminton macht die Auswahl sportlich." },
  { id: "boxing", name: "Boxhandschuh", emoji: "🥊", text: "Der Boxhandschuh steht fuer Mut und Einsatz." },
  { id: "medal", name: "Medaille", emoji: "🏅", text: "Die Medaille belohnt gutes Sparen." },
  { id: "trophy", name: "Pokal", emoji: "🏆", text: "Der Pokal zeigt grosse Erfolge." },
  { id: "target", name: "Zielscheibe", emoji: "🎯", text: "Die Zielscheibe passt perfekt zu Sparzielen." },
  { id: "guitar", name: "Gitarre", emoji: "🎸", text: "Die Gitarre bringt Musik in den Tracker." },
  { id: "game", name: "Controller", emoji: "🎮", text: "Der Controller wirkt modern und spielerisch." },
  { id: "puzzle", name: "Puzzle", emoji: "🧩", text: "Das Puzzle passt zu kleinen Schritten." },
  { id: "kite", name: "Drachen", emoji: "🪁", text: "Der Drachen steigt mit jedem Euro hoeher." },
  { id: "bike", name: "Fahrrad", emoji: "🚲", text: "Das Fahrrad steht fuer Bewegung und Ziele." },
  { id: "car", name: "Auto", emoji: "🚗", text: "Das Auto faehrt dem Sparziel entgegen." },
  { id: "train", name: "Zug", emoji: "🚂", text: "Der Zug bringt Ordnung in die Eintraege." },
  { id: "plane", name: "Flugzeug", emoji: "✈", text: "Das Flugzeug steht fuer groessere Traeume." }
];

const defaultCurrencies = [
  { code: "EUR", name: "Euro" },
  { code: "USD", name: "US-Dollar" }
];

const defaultState = {
  selectedSymbol: symbols[0].id,
  baseCurrency: "EUR",
  currencies: defaultCurrencies,
  exchangeRates: { EUR: 1, USD: 0.92 },
  entries: []
};

const symbolSelect = document.getElementById("symbolSelect");
const symbolGrid = document.getElementById("symbolGrid");
const symbolPreview = document.getElementById("symbolPreview");
const symbolModal = document.getElementById("symbolModal");
const openSymbolSettings = document.getElementById("openSymbolSettings");
const closeSymbolSettings = document.getElementById("closeSymbolSettings");

const openSyncSettings = document.getElementById("openSyncSettings");
const closeSyncSettings = document.getElementById("closeSyncSettings");
const syncModal = document.getElementById("syncModal");
const syncForm = document.getElementById("syncForm");
const syncRoomId = document.getElementById("syncRoomId");
const firebaseConfigInput = document.getElementById("firebaseConfigInput");
const disconnectSyncButton = document.getElementById("disconnectSyncButton");
const syncStatus = document.getElementById("syncStatus");

const openCurrencySettings = document.getElementById("openCurrencySettings");
const closeCurrencySettings = document.getElementById("closeCurrencySettings");
const currencyModal = document.getElementById("currencyModal");
const baseCurrencySelect = document.getElementById("baseCurrencySelect");
const baseCurrencyForm = document.getElementById("baseCurrencyForm");
const currencyForm = document.getElementById("currencyForm");
const editingCurrencyCode = document.getElementById("editingCurrencyCode");
const currencyCodeInput = document.getElementById("currencyCodeInput");
const currencyNameInput = document.getElementById("currencyNameInput");
const currencyRateInput = document.getElementById("currencyRateInput");
const currencyInverseInput = document.getElementById("currencyInverseInput");
const rateHint = document.getElementById("rateHint");
const rateList = document.getElementById("rateList");
const baseCurrencyBadge = document.getElementById("baseCurrencyBadge");
const saveCurrencyButton = document.getElementById("saveCurrencyButton");
const cancelEditButton = document.getElementById("cancelEditButton");

const incomeForm = document.getElementById("incomeForm");
const expenseForm = document.getElementById("expenseForm");
const incomeCurrency = document.getElementById("incomeCurrency");
const expenseCurrency = document.getElementById("expenseCurrency");
const entryList = document.getElementById("entryList");
const emptyState = document.getElementById("emptyState");
const balanceValue = document.getElementById("balanceValue");
const incomeValue = document.getElementById("incomeValue");
const interestValue = document.getElementById("interestValue");
const expenseValue = document.getElementById("expenseValue");
const incomeIsInterest = document.getElementById("incomeIsInterest");

const entryModal = document.getElementById("entryModal");
const closeEntryModal = document.getElementById("closeEntryModal");
const entryEditForm = document.getElementById("entryEditForm");
const editingEntryId = document.getElementById("editingEntryId");
const editEntryType = document.getElementById("editEntryType");
const editEntryAmount = document.getElementById("editEntryAmount");
const editEntryCurrency = document.getElementById("editEntryCurrency");
const editEntryDate = document.getElementById("editEntryDate");
const editEntryNote = document.getElementById("editEntryNote");
const editEntryIsInterest = document.getElementById("editEntryIsInterest");
const editInterestRow = document.getElementById("editInterestRow");
const deleteEntryButton = document.getElementById("deleteEntryButton");

const today = new Date().toISOString().slice(0, 10);
document.getElementById("incomeDate").value = today;
document.getElementById("expenseDate").value = today;

let firebaseApp = null;
let firestoreDb = null;
let firebaseAuth = null;
let unsubscribeEntries = null;

function normalizeCode(code) {
  return code.trim().toUpperCase();
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...defaultState };
    }

    const parsed = JSON.parse(raw);
    const parsedCurrencies = Array.isArray(parsed.currencies) && parsed.currencies.length > 0
      ? parsed.currencies.map((currency) => ({
          code: normalizeCode(currency.code || ""),
          name: (currency.name || "").trim() || normalizeCode(currency.code || "")
        })).filter((currency) => currency.code)
      : defaultCurrencies;

    const nextBase = parsed.baseCurrency || parsedCurrencies[0].code || defaultState.baseCurrency;
    const nextRates = { ...defaultState.exchangeRates, ...(parsed.exchangeRates || {}) };
    nextRates[nextBase] = 1;

    return {
      selectedSymbol: parsed.selectedSymbol || defaultState.selectedSymbol,
      baseCurrency: nextBase,
      currencies: parsedCurrencies,
      exchangeRates: nextRates,
      entries: Array.isArray(parsed.entries) ? parsed.entries : []
    };
  } catch {
    return { ...defaultState };
  }
}

function loadSyncSettings() {
  try {
    const raw = localStorage.getItem(SYNC_KEY);
    if (!raw) {
      return { enabled: false, roomId: "", configText: "" };
    }

    const parsed = JSON.parse(raw);
    return {
      enabled: Boolean(parsed.enabled),
      roomId: parsed.roomId || "",
      configText: parsed.configText || ""
    };
  } catch {
    return { enabled: false, roomId: "", configText: "" };
  }
}

let state = loadState();
let syncState = loadSyncSettings();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function saveSyncSettings() {
  localStorage.setItem(SYNC_KEY, JSON.stringify(syncState));
}

function ensureStateShape() {
  if (!Array.isArray(state.currencies) || state.currencies.length === 0) {
    state.currencies = [...defaultCurrencies];
  }

  if (!state.baseCurrency || !state.currencies.some((currency) => currency.code === state.baseCurrency)) {
    state.baseCurrency = state.currencies[0].code;
  }

  state.exchangeRates[state.baseCurrency] = 1;
}

ensureStateShape();

function isSyncEnabled() {
  return Boolean(syncState.enabled && firestoreDb && syncState.roomId);
}

function updateSyncStatus(text) {
  syncStatus.textContent = text;
}

function isIntlCurrencyCodeSupported(code) {
  try {
    new Intl.NumberFormat("de-DE", { style: "currency", currency: code });
    return true;
  } catch {
    return false;
  }
}

function formatCurrency(value, code = state.baseCurrency) {
  if (!isIntlCurrencyCodeSupported(code)) {
    return `${new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)} ${code}`;
  }

  return new Intl.NumberFormat("de-DE", { style: "currency", currency: code }).format(value);
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }
  const [year, month, day] = dateValue.split("-");
  return `${day}.${month}.${year}`;
}

function getSortedEntries() {
  return [...state.entries].sort((left, right) => {
    const leftDate = left.date || "";
    const rightDate = right.date || "";

    if (leftDate !== rightDate) {
      return rightDate.localeCompare(leftDate);
    }

    const leftCreated = left.createdAt || "";
    const rightCreated = right.createdAt || "";
    return rightCreated.localeCompare(leftCreated);
  });
}

function openModal(modal) {
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(modal) {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

function rebuildRatesForNewBase(nextBase) {
  const oldBaseRate = state.exchangeRates[nextBase];
  if (!oldBaseRate) {
    return;
  }

  const nextRates = {};
  Object.entries(state.exchangeRates).forEach(([currencyCode, rate]) => {
    nextRates[currencyCode] = rate / oldBaseRate;
  });
  nextRates[nextBase] = 1;
  state.exchangeRates = nextRates;
  state.baseCurrency = nextBase;
}

function convertToBase(amount, currencyCode) {
  const rate = state.exchangeRates[currencyCode];
  if (!rate) {
    return Number(amount);
  }
  return Number(amount) * rate;
}

function renderCurrencyOptions() {
  const optionsMarkup = state.currencies
    .map((currency) => `<option value="${currency.code}">${currency.code} - ${currency.name}</option>`)
    .join("");

  baseCurrencySelect.innerHTML = optionsMarkup;
  incomeCurrency.innerHTML = optionsMarkup;
  expenseCurrency.innerHTML = optionsMarkup;
  editEntryCurrency.innerHTML = optionsMarkup;

  baseCurrencySelect.value = state.baseCurrency;
  incomeCurrency.value = state.baseCurrency;
  expenseCurrency.value = state.baseCurrency;
  updateRateHint();
}

function renderSymbolOptions() {
  symbolSelect.innerHTML = symbols
    .map((symbol) => `<option value="${symbol.id}">${symbol.emoji} ${symbol.name}</option>`)
    .join("");
  symbolSelect.value = state.selectedSymbol;

  symbolGrid.innerHTML = symbols
    .map((symbol) => `
      <button type="button" class="symbol-option ${symbol.id === state.selectedSymbol ? "active" : ""}" data-symbol-id="${symbol.id}" aria-label="${symbol.name}">
        ${symbol.emoji}
      </button>
    `)
    .join("");
}

function renderSymbolPreview() {
  const selected = symbols.find((item) => item.id === state.selectedSymbol) || symbols[0];
  symbolPreview.innerHTML = `
    <span class="symbol-emoji" aria-hidden="true">${selected.emoji}</span>
    <div class="symbol-preview-copy">
      <strong>${selected.name}</strong>
      <div>${selected.text}</div>
    </div>
  `;
}

function getCurrencyLabel(code) {
  const currency = state.currencies.find((item) => item.code === code);
  return currency ? `${currency.code} - ${currency.name}` : code;
}

function renderRateList() {
  baseCurrencyBadge.textContent = `Basis: ${state.baseCurrency}`;
  rateList.innerHTML = state.currencies
    .map((currency) => {
      const value = currency.code === state.baseCurrency ? 1 : Number(state.exchangeRates[currency.code] || 0);
      const actions = currency.code === state.baseCurrency
        ? "<span>Grundwaehrung</span>"
        : `<div class="rate-actions">
            <button type="button" class="ghost-btn delete-rate-btn" data-edit-currency="${currency.code}">Bearbeiten</button>
            <button type="button" class="ghost-btn delete-rate-btn" data-delete-currency="${currency.code}">Loeschen</button>
          </div>`;

      return `
        <li class="rate-item">
          <div>
            <strong>${getCurrencyLabel(currency.code)}</strong>
            <span>1 ${currency.code} = ${value.toFixed(4)} ${state.baseCurrency}</span>
          </div>
          ${actions}
        </li>
      `;
    })
    .join("");
}

function calculateTotals() {
  return state.entries.reduce(
    (totals, entry) => {
      const entryCurrency = entry.currency || state.baseCurrency;
      const baseAmount = Number(convertToBase(entry.amount, entryCurrency));
      if (entry.type === "income") {
        totals.income += baseAmount;
        if (entry.isInterest) {
          totals.interest += baseAmount;
        }
      } else {
        totals.expense += baseAmount;
      }
      totals.balance = totals.income - totals.expense;
      return totals;
    },
    { income: 0, interest: 0, expense: 0, balance: 0 }
  );
}

function renderTotals() {
  const totals = calculateTotals();
  balanceValue.textContent = formatCurrency(totals.balance);
  incomeValue.textContent = formatCurrency(totals.income);
  interestValue.textContent = formatCurrency(totals.interest);
  expenseValue.textContent = formatCurrency(totals.expense);
}

function renderEntries() {
  const sortedEntries = getSortedEntries();

  if (sortedEntries.length === 0) {
    entryList.innerHTML = "";
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;
  entryList.innerHTML = sortedEntries
    .map((entry) => {
      const icon = entry.type === "income" ? "↓" : "↑";
      const sign = entry.type === "income" ? "+" : "-";
      const amountClass = entry.type === "income" ? "income" : "expense";
      const label = entry.type === "income" ? "Taschengeld" : "Ausgabe";
      const entryCurrency = entry.currency || state.baseCurrency;
      const originalAmount = `${Number(entry.amount).toFixed(2)} ${entryCurrency}`;
      const baseAmount = formatCurrency(convertToBase(entry.amount, entryCurrency));
      const interestText = entry.type === "income" && entry.isInterest ? '<span class="entry-subline">Davon Zinsen</span>' : "";

      return `
        <li class="entry-item ${entry.type}">
          <div class="entry-icon" aria-hidden="true">${icon}</div>
          <div class="entry-main">
            <strong>${entry.note}</strong>
            <span>${label} am ${formatDate(entry.date)}</span>
            <span class="entry-subline">Original: ${originalAmount}</span>
            ${interestText}
          </div>
          <div class="entry-actions">
            <strong class="entry-amount ${amountClass}">${sign}${baseAmount}</strong>
            <span class="entry-date">in ${state.baseCurrency} umgerechnet</span>
            <button type="button" class="ghost-btn entry-action-btn" data-edit-entry="${entry.id}">Bearbeiten</button>
            <button type="button" class="ghost-btn entry-action-btn" data-delete-entry="${entry.id}">Loeschen</button>
          </div>
        </li>
      `;
    })
    .join("");
}

function renderSyncInputs() {
  syncRoomId.value = syncState.roomId || "";
  firebaseConfigInput.value = syncState.configText || "";
  updateSyncStatus(isSyncEnabled() ? `Gemeinsam synchronisiert: ${syncState.roomId}` : "Lokal auf diesem Geraet gespeichert");
}

function render() {
  ensureStateShape();
  renderCurrencyOptions();
  renderSymbolOptions();
  renderSymbolPreview();
  renderRateList();
  renderTotals();
  renderEntries();
  renderSyncInputs();
}

function updateRateHint() {
  rateHint.textContent = `Direkter Kurs: 1 Fremdwaehrung = X ${state.baseCurrency}. Kehrwert: 1 ${state.baseCurrency} = X Fremdwaehrung.`;
}

async function disconnectFirebase() {
  if (unsubscribeEntries) {
    unsubscribeEntries();
    unsubscribeEntries = null;
  }
  if (firebaseApp) {
    await deleteApp(firebaseApp);
    firebaseApp = null;
    firestoreDb = null;
    firebaseAuth = null;
  }
}

async function connectFirebase(config, roomId) {
  await disconnectFirebase();

  const appName = `polds-${roomId}`;
  const existing = getApps().find((app) => app.name === appName);
  firebaseApp = existing || initializeApp(config, appName);
  firestoreDb = getFirestore(firebaseApp);
  firebaseAuth = getAuth(firebaseApp);
  await signInAnonymously(firebaseAuth);

  unsubscribeEntries = onSnapshot(
    collection(firestoreDb, "sharedBoards", roomId, "entries"),
    (snapshot) => {
      state.entries = snapshot.docs.map((entryDoc) => ({
        id: entryDoc.id,
        ...entryDoc.data()
      }));
      render();
    },
    () => {
      updateSyncStatus("Synchronisation fehlgeschlagen, lokal weiter genutzt");
    }
  );
}

function getFirebaseConfigFromInput() {
  const configText = firebaseConfigInput.value.trim();
  if (!configText) {
    throw new Error("missing config");
  }
  return JSON.parse(configText);
}

async function enableSync() {
  const roomId = syncRoomId.value.trim();
  const config = getFirebaseConfigFromInput();
  await connectFirebase(config, roomId);
  syncState = {
    enabled: true,
    roomId,
    configText: firebaseConfigInput.value.trim()
  };
  saveSyncSettings();
  updateSyncStatus(`Gemeinsam synchronisiert: ${roomId}`);
}

async function disableSync() {
  await disconnectFirebase();
  syncState.enabled = false;
  saveSyncSettings();
  updateSyncStatus("Lokal auf diesem Geraet gespeichert");
}

async function addEntry(type, amount, currency, date, note, isInterest = false) {
  const normalizedAmount = Number(amount);
  const normalizedCurrency = currency || state.baseCurrency;
  if (!normalizedAmount || normalizedAmount < 0) {
    return;
  }

  const payload = {
    type,
    amount: normalizedAmount,
    currency: normalizedCurrency,
    date,
    createdAt: new Date().toISOString(),
    isInterest: type === "income" ? Boolean(isInterest) : false,
    note: note.trim() || (type === "income" ? "Taschengeld" : "Ausgabe")
  };

  if (isSyncEnabled()) {
    await addDoc(collection(firestoreDb, "sharedBoards", syncState.roomId, "entries"), payload);
    return;
  }

  state.entries.unshift({
    id: crypto.randomUUID(),
    ...payload
  });

  saveState();
  render();
}

function startEditingCurrency(code) {
  const currency = state.currencies.find((item) => item.code === code);
  if (!currency) {
    return;
  }

  const rate = code === state.baseCurrency ? 1 : Number(state.exchangeRates[code] || 1);
  editingCurrencyCode.value = code;
  currencyCodeInput.value = currency.code;
  currencyNameInput.value = currency.name;
  currencyRateInput.value = String(rate);
  currencyInverseInput.value = String((1 / rate).toFixed(4));
  saveCurrencyButton.textContent = "Waehrung aktualisieren";
  cancelEditButton.classList.remove("hidden");
}

function resetCurrencyForm() {
  editingCurrencyCode.value = "";
  currencyForm.reset();
  saveCurrencyButton.textContent = "Waehrung speichern";
  cancelEditButton.classList.add("hidden");
}

function upsertCurrency(previousCode, code, name, rate) {
  const existing = state.currencies.find((currency) => currency.code === previousCode || currency.code === code);
  if (existing) {
    const oldCode = existing.code;
    if (oldCode !== code) {
      existing.code = code;
      state.entries.forEach((entry) => {
        if (entry.currency === oldCode) {
          entry.currency = code;
        }
      });
      if (state.baseCurrency === oldCode) {
        state.baseCurrency = code;
      }
      state.exchangeRates[code] = state.exchangeRates[oldCode];
      delete state.exchangeRates[oldCode];
    }
    existing.name = name;
  } else {
    state.currencies.push({ code, name });
  }

  state.exchangeRates[code] = code === state.baseCurrency ? 1 : rate;
}

function deleteCurrency(code) {
  if (code === state.baseCurrency) {
    return;
  }

  state.entries = state.entries.map((entry) => {
    if (entry.currency !== code) {
      return entry;
    }

    return {
      ...entry,
      amount: convertToBase(entry.amount, code),
      currency: state.baseCurrency
    };
  });
  state.currencies = state.currencies.filter((currency) => currency.code !== code);
  delete state.exchangeRates[code];
}

function startEditingEntry(entryId) {
  const entry = state.entries.find((item) => item.id === entryId);
  if (!entry) {
    return;
  }

  editingEntryId.value = entry.id;
  editEntryType.value = entry.type;
  editEntryAmount.value = String(entry.amount);
  editEntryCurrency.value = entry.currency || state.baseCurrency;
  editEntryDate.value = entry.date;
  editEntryNote.value = entry.note;
  editEntryIsInterest.checked = Boolean(entry.isInterest);
  editInterestRow.hidden = entry.type !== "income";
  openModal(entryModal);
}

async function updateEntry(entryId, nextValues) {
  if (isSyncEnabled()) {
    await updateDoc(doc(firestoreDb, "sharedBoards", syncState.roomId, "entries", entryId), {
      type: nextValues.type,
      amount: Number(nextValues.amount),
      currency: nextValues.currency,
      date: nextValues.date,
      isInterest: nextValues.type === "income" ? Boolean(nextValues.isInterest) : false,
      note: nextValues.note
    });
    return;
  }

  const entry = state.entries.find((item) => item.id === entryId);
  if (!entry) {
    return;
  }

  entry.type = nextValues.type;
  entry.amount = Number(nextValues.amount);
  entry.currency = nextValues.currency;
  entry.date = nextValues.date;
  entry.isInterest = nextValues.type === "income" ? Boolean(nextValues.isInterest) : false;
  entry.note = nextValues.note;
  saveState();
  render();
}

async function deleteEntry(entryId) {
  if (isSyncEnabled()) {
    await deleteDoc(doc(firestoreDb, "sharedBoards", syncState.roomId, "entries", entryId));
    return;
  }

  state.entries = state.entries.filter((entry) => entry.id !== entryId);
  saveState();
  render();
}

symbolSelect.addEventListener("change", (event) => {
  state.selectedSymbol = event.target.value;
  saveState();
  render();
});

symbolGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-symbol-id]");
  if (!button) {
    return;
  }

  state.selectedSymbol = button.dataset.symbolId;
  saveState();
  render();
  closeModal(symbolModal);
});

openSymbolSettings.addEventListener("click", () => openModal(symbolModal));
closeSymbolSettings.addEventListener("click", () => closeModal(symbolModal));
symbolModal.addEventListener("click", (event) => {
  if (event.target.dataset.closeSymbolModal === "true") {
    closeModal(symbolModal);
  }
});

openSyncSettings.addEventListener("click", () => openModal(syncModal));
closeSyncSettings.addEventListener("click", () => closeModal(syncModal));
syncModal.addEventListener("click", (event) => {
  if (event.target.dataset.closeSyncModal === "true") {
    closeModal(syncModal);
  }
});

syncForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await enableSync();
    closeModal(syncModal);
  } catch {
    updateSyncStatus("Firebase-Konfiguration konnte nicht verbunden werden");
    window.alert("Die Firebase-Konfiguration oder die Familien-ID ist ungueltig.");
  }
});

disconnectSyncButton.addEventListener("click", async () => {
  await disableSync();
  closeModal(syncModal);
});

openCurrencySettings.addEventListener("click", () => openModal(currencyModal));
closeCurrencySettings.addEventListener("click", () => closeModal(currencyModal));
currencyModal.addEventListener("click", (event) => {
  if (event.target.dataset.closeModal === "true") {
    closeModal(currencyModal);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal(symbolModal);
    closeModal(syncModal);
    closeModal(currencyModal);
    closeModal(entryModal);
  }
});

baseCurrencyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  rebuildRatesForNewBase(baseCurrencySelect.value);
  saveState();
  render();
});

currencyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const previousCode = normalizeCode(editingCurrencyCode.value);
  const code = normalizeCode(currencyCodeInput.value);
  const name = currencyNameInput.value.trim();
  const directRate = Number(currencyRateInput.value);
  const inverseRate = Number(currencyInverseInput.value);
  const rate = directRate > 0 ? directRate : (inverseRate > 0 ? 1 / inverseRate : 0);

  if (!code || !name || !rate || rate <= 0) {
    return;
  }

  upsertCurrency(previousCode, code, name, rate);
  saveState();
  render();
  resetCurrencyForm();
});

rateList.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-currency]");
  if (editButton) {
    startEditingCurrency(editButton.dataset.editCurrency);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-currency]");
  if (!deleteButton) {
    return;
  }

  deleteCurrency(deleteButton.dataset.deleteCurrency);
  saveState();
  render();
});

currencyRateInput.addEventListener("input", () => {
  const value = Number(currencyRateInput.value);
  if (value > 0) {
    currencyInverseInput.value = String((1 / value).toFixed(4));
  }
});

currencyInverseInput.addEventListener("input", () => {
  const value = Number(currencyInverseInput.value);
  if (value > 0) {
    currencyRateInput.value = String((1 / value).toFixed(4));
  }
});

cancelEditButton.addEventListener("click", resetCurrencyForm);

incomeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await addEntry(
    "income",
    incomeForm.amount.value,
    incomeForm.currency.value,
    incomeForm.date.value,
    incomeForm.note.value,
    incomeIsInterest.checked
  );
  incomeForm.reset();
  document.getElementById("incomeDate").value = today;
  incomeCurrency.value = state.baseCurrency;
});

expenseForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await addEntry("expense", expenseForm.amount.value, expenseForm.currency.value, expenseForm.date.value, expenseForm.note.value);
  expenseForm.reset();
  document.getElementById("expenseDate").value = today;
  expenseCurrency.value = state.baseCurrency;
});

entryList.addEventListener("click", async (event) => {
  const editButton = event.target.closest("[data-edit-entry]");
  if (editButton) {
    startEditingEntry(editButton.dataset.editEntry);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-entry]");
  if (!deleteButton) {
    return;
  }

  await deleteEntry(deleteButton.dataset.deleteEntry);
});

entryEditForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!editingEntryId.value) {
    return;
  }

  await updateEntry(editingEntryId.value, {
    type: editEntryType.value,
    amount: editEntryAmount.value,
    currency: editEntryCurrency.value,
    date: editEntryDate.value,
    isInterest: editEntryIsInterest.checked,
    note: editEntryNote.value.trim() || (editEntryType.value === "income" ? "Taschengeld" : "Ausgabe")
  });
  closeModal(entryModal);
});

editEntryType.addEventListener("change", () => {
  editInterestRow.hidden = editEntryType.value !== "income";
  if (editEntryType.value !== "income") {
    editEntryIsInterest.checked = false;
  }
});

deleteEntryButton.addEventListener("click", async () => {
  if (!editingEntryId.value) {
    return;
  }

  await deleteEntry(editingEntryId.value);
  closeModal(entryModal);
});

closeEntryModal.addEventListener("click", () => closeModal(entryModal));
entryModal.addEventListener("click", (event) => {
  if (event.target.dataset.closeEntryModal === "true") {
    closeModal(entryModal);
  }
});

async function bootstrap() {
  render();

  if (syncState.enabled && syncState.roomId && syncState.configText) {
    try {
      const config = JSON.parse(syncState.configText);
      await connectFirebase(config, syncState.roomId);
      updateSyncStatus(`Gemeinsam synchronisiert: ${syncState.roomId}`);
    } catch {
      syncState.enabled = false;
      saveSyncSettings();
      updateSyncStatus("Lokal auf diesem Geraet gespeichert");
    }
  }
}

bootstrap();
