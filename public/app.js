// ---- Auth helpers (token-based) ----
function getToken() {
  return localStorage.getItem("fk_token");
}
function requireLogin() {
  if (!getToken()) {
    window.location.href = "/login.html";
    return false;
  }
  return true;
}
function authHeaders(extra) {
  return Object.assign(
    { "Content-Type": "application/json", "Authorization": "Bearer " + getToken() },
    extra || {}
  );
}
async function apiFetch(url, options) {
  const res = await fetch(url, options);
  if (res.status === 401) {
    // token missing/invalid/expired -> back to login
    localStorage.removeItem("fk_token");
    localStorage.removeItem("fk_name");
    window.location.href = "/login.html";
    throw new Error("unauthorized");
  }
  return res;
}

if (!requireLogin()) {
  // redirected to login; stop running the rest
} else {

const LIVE_API = "https://food-katha.onrender.com";
// In the installed Android app (Capacitor) pages run on https://localhost with
// no port, so API calls must target the live backend explicitly.
// On the web (Render) and local dev (localhost:5000), same-origin is correct.
const API_BASE = (window.location.protocol === "capacitor:" ||
  ((window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") && !window.location.port))
  ? LIVE_API
  : window.location.origin;
const welcome = document.getElementById("welcome");
if (welcome && localStorage.getItem("fk_name")) {
  welcome.textContent = "Namaste, " + localStorage.getItem("fk_name") + " 🙏";
}

// ---- Page detection: form page (index) vs list page (transactions) ----
const formEl = document.getElementById("transaction-form");
const listEl = document.getElementById("transactions");
const isFormPage = !!formEl;
const isListPage = !!listEl;

// ---- Fixed menu: tap an item to add it to the transaction ----
const DEFAULT_MENU = {
  morning: [
    { name: "Puri", price: 20 },
    { name: "Bajji", price: 20 },
    { name: "Idly", price: 20 },
    { name: "Attu", price: 20 },
  ],
  evening: [
    { name: "Salla punuku", price: null },
    { name: "Mirapakaaya bajji", price: null },
    { name: "Tomoto bajji", price: null },
    { name: "Aratikaaya bajji", price: null },
    { name: "Milmaker", price: null },
  ],
  extra: [
    { name: "Sanna pusa", price: null },
    { name: "Boondi", price: null },
    { name: "Kommulu", price: null },
    { name: "Chekodilu", price: null },
    { name: "Checkkalu", price: null },
  ],
};
const MENU_GROUPS = [
  { key: "morning", title: "☀️ Morning", editable: true },
  { key: "evening", title: "🌙 Evening", editable: false },
  { key: "extra", title: "➕ Extra", editable: false },
];

function getRateOverrides() {
  try { return JSON.parse(localStorage.getItem("fk_menu_rates") || "{}"); }
  catch (e) { return {}; }
}
function saveRateOverrides(o) {
  localStorage.setItem("fk_menu_rates", JSON.stringify(o));
}
function menuPrice(groupKey, item) {
  if (groupKey !== "morning") return item.price;
  const o = getRateOverrides();
  return o[item.name] !== undefined ? o[item.name] : item.price;
}

function renderMenu() {
  const menu = document.getElementById("menu");
  if (!menu) return;
  menu.innerHTML = "";
  MENU_GROUPS.forEach(g => {
    const wrap = document.createElement("div");
    const title = document.createElement("p");
    title.className = "text-sm font-semibold text-gray-600 mb-1";
    title.textContent = g.title;
    wrap.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "grid grid-cols-2 gap-2";
    DEFAULT_MENU[g.key].forEach(item => {
      const price = menuPrice(g.key, item);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "min-w-0 flex items-center justify-between gap-1 px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 active:bg-green-100 text-left";
      const nameSpan = document.createElement("span");
      nameSpan.className = "text-sm font-medium min-w-0 break-words";
      nameSpan.textContent = item.name;
      const right = document.createElement("span");
      right.className = "flex items-center gap-1 shrink-0";
      const priceSpan = document.createElement("span");
      priceSpan.className = "text-sm font-semibold text-green-700";
      priceSpan.textContent = (price === null || price === undefined || price === "") ? "₹?" : "₹" + price;
      right.appendChild(priceSpan);
      if (g.editable) {
        const edit = document.createElement("span");
        edit.className = "text-gray-400 text-sm px-1";
        edit.textContent = "✎";
        edit.title = "Edit default rate";
        edit.addEventListener("click", (ev) => {
          ev.stopPropagation();
          const cur = menuPrice(g.key, item);
          const val = prompt("Default rate for " + item.name + " (₹):", cur);
          if (val === null) return;
          const num = parseFloat(val);
          if (isNaN(num) || num < 0) { alert("Please enter a valid rate."); return; }
          const o = getRateOverrides();
          o[item.name] = num;
          saveRateOverrides(o);
          renderMenu();
        });
        right.appendChild(edit);
      }
      btn.appendChild(nameSpan);
      btn.appendChild(right);
      btn.addEventListener("click", () => addMenuItem(item.name, price));
      grid.appendChild(btn);
    });
    wrap.appendChild(grid);
    menu.appendChild(wrap);
  });
}

function addMenuItem(name, price) {
  createItemRow(name, (price === null || price === undefined) ? "" : price);
  calculateTotal();
  // focus the price box when the rate still needs to be entered
  const rows = document.querySelectorAll("#items-container .item-row");
  const last = rows[rows.length - 1];
  if (last && (price === null || price === undefined || price === "")) {
    const input = last.querySelector(".item-price");
    if (input) input.focus();
  }
}

// ---- Paid / Katha toggle ----
let txnType = "katha";
const btnKatha = document.getElementById("type-katha");
const btnPaid = document.getElementById("type-paid");
function paintTypeButtons() {
  const on = ["border-2", "font-semibold"];
  if (txnType === "katha") {
    btnKatha.className = "txn-type py-2 rounded-lg font-semibold border-2 border-amber-500 bg-amber-100 text-amber-800";
    btnPaid.className = "txn-type py-2 rounded-lg font-semibold border-2 border-gray-200 bg-white text-gray-500";
  } else {
    btnPaid.className = "txn-type py-2 rounded-lg font-semibold border-2 border-green-600 bg-green-100 text-green-800";
    btnKatha.className = "txn-type py-2 rounded-lg font-semibold border-2 border-gray-200 bg-white text-gray-500";
  }
}
if (btnKatha) btnKatha.addEventListener("click", () => { txnType = "katha"; paintTypeButtons(); });
if (btnPaid) btnPaid.addEventListener("click", () => { txnType = "paid"; paintTypeButtons(); });

// ---- Item rows + live total ----
function calculateTotal() {
  const itemRows = document.querySelectorAll("#items-container .item-row");
  let total = 0;
  itemRows.forEach(row => {
    const price = parseFloat(row.querySelector(".item-price").value);
    if (!isNaN(price)) total += price;
  });
  document.getElementById("total-display").textContent = "Total: ₹" + total;
  return total;
}

function createItemRow(name, price) {
  const container = document.getElementById("items-container");
  const row = document.createElement("div");
  row.className = "item-row flex space-x-2";
  row.innerHTML =
    '<input type="text" placeholder="Item Name" value="' + (name || "") + '" class="item-name min-w-0 flex-1 p-2 border rounded-lg text-base" />' +
    '<input type="number" inputmode="decimal" placeholder="₹" value="' + (price === undefined ? "" : price) + '" class="item-price shrink-0 w-24 p-2 border rounded-lg text-base" />' +
    '<button type="button" class="remove-item shrink-0 text-red-500 text-xl px-1">✕</button>';
  container.appendChild(row);
  row.querySelector(".item-price").addEventListener("input", calculateTotal);
}
if (isFormPage) createItemRow(); // one empty row to start

const addItemBtn = document.getElementById("add-item");
if (addItemBtn) addItemBtn.addEventListener("click", () => createItemRow());

const itemsContainer = document.getElementById("items-container");
if (itemsContainer) itemsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-item")) {
    e.target.parentElement.remove();
    calculateTotal();
  }
});

// ---- Save (create / update) ----
if (formEl) formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const customer = document.getElementById("customer").value.trim();
  if (!customer) { alert("Please enter the customer name."); return; }
  const amount = calculateTotal();
  const id = document.getElementById("edit-id").value;

  const items = Array.prototype.map.call(
    document.querySelectorAll("#items-container .item-row"),
    (row) => ({
      name: row.querySelector(".item-name").value.trim(),
      price: parseFloat(row.querySelector(".item-price").value) || 0
    })
  ).filter(i => i.name || i.price);

  const transaction = { customer, amount, type: txnType, items };

  try {
    const url = id ? API_BASE + "/api/transactions/" + id : API_BASE + "/api/transactions";
    const res = await apiFetch(url, {
      method: id ? "PUT" : "POST",
      headers: authHeaders(),
      body: JSON.stringify(transaction)
    });
    const data = await res.json();
    if (!res.ok) { alert("❌ " + (data.error || "Error saving transaction.")); return; }

    // Coming back from an edit on the Transactions page → return there.
    if (id) { window.location.href = "/transactions.html"; return; }

    document.getElementById("transaction-form").reset();
    document.getElementById("edit-id").value = "";
    document.getElementById("items-container").innerHTML = "";
    createItemRow();
    txnType = "katha"; paintTypeButtons();
    calculateTotal();
  } catch (err) {
    if (err.message !== "unauthorized") alert("❌ Error saving transaction.");
  }
});

// ---- List / search ----
const searchEl = document.getElementById("search");
if (searchEl) searchEl.addEventListener("input", loadTransactions);

async function loadTransactions() {
  try {
    const res = await apiFetch(API_BASE + "/api/transactions", { headers: authHeaders() });
    const data = await res.json();
    const search = document.getElementById("search").value.toLowerCase();
    displayTransactions(data.filter(t => (t.customer || "").toLowerCase().includes(search)));
  } catch (err) {
    if (err.message !== "unauthorized") {
      document.getElementById("transactions").innerHTML = "<p class='text-red-500 text-center'>❌ Failed to load transactions.</p>";
    }
  }
}

function typeBadge(t) {
  return t.type === "paid"
    ? "<span class='text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700'>💵 Paid</span>"
    : "<span class='text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700'>📒 Katha</span>";
}

function displayTransactions(transactions) {
  const container = document.getElementById("transactions");
  container.innerHTML = "";

  if (!transactions.length) {
    container.innerHTML = "<p class='text-gray-400 text-center py-8'>No transactions yet.<br>Add the first one above 👆</p>";
    return;
  }

  transactions.forEach(t => {
    const div = document.createElement("div");
    div.className = "bg-white p-3 rounded-xl shadow";
    const itemsList = (t.items || []).map(i => "<li>" + escapeHtml(i.name) + " - ₹" + i.price + "</li>").join("");
    const paidBtn = t.type === "paid" ? "" :
      "<button data-paid='" + t._id + "' class='text-green-700 text-sm font-semibold'>✓ Paid</button>";
    div.innerHTML =
      "<div class='flex items-center justify-between gap-2'><p class='min-w-0 truncate'><strong>" + escapeHtml(t.customer) + "</strong> - ₹" + t.amount + "</p>" + typeBadge(t) + "</div>" +
      (itemsList ? "<ul class='text-sm text-gray-600 mt-1'>" + itemsList + "</ul>" : "") +
      "<p class='text-xs text-gray-400 text-right mt-1'>" + new Date(t.createdAt).toLocaleString() + "</p>" +
      "<div class='mt-2 flex justify-end space-x-4'>" +
      paidBtn +
      "<button data-edit='" + t._id + "' class='text-blue-600 text-sm'>✏️ Edit</button>" +
      "<button data-del='" + t._id + "' class='text-red-600 text-sm'>🗑️ Delete</button>" +
      "</div>";
    container.appendChild(div);
  });

  container.querySelectorAll("[data-edit]").forEach(b =>
    b.addEventListener("click", () => { window.location.href = "/index.html?edit=" + b.getAttribute("data-edit"); }));
  container.querySelectorAll("[data-del]").forEach(b =>
    b.addEventListener("click", () => deleteTransaction(b.getAttribute("data-del"))));
  container.querySelectorAll("[data-paid]").forEach(b =>
    b.addEventListener("click", () => markPaid(b.getAttribute("data-paid"))));
}

function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

async function deleteTransaction(id) {
  if (!confirm("Delete this transaction?")) return;
  try {
    await apiFetch(API_BASE + "/api/transactions/" + id, { method: "DELETE", headers: authHeaders() });
    loadTransactions();
  } catch (err) { /* unauthorized handled in apiFetch */ }
}

// Customer paid up their katha: tick this entry as paid
async function markPaid(id) {
  try {
    const res = await apiFetch(API_BASE + "/api/transactions", { headers: authHeaders() });
    const data = await res.json();
    const t = data.find(x => x._id === id);
    if (!t) return;
    if (!confirm("Mark ₹" + t.amount + " from " + t.customer + " as paid?")) return;
    const upd = await apiFetch(API_BASE + "/api/transactions/" + id, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ type: "paid" })
    });
    if (!upd.ok) { alert("❌ Could not mark as paid."); return; }
    loadTransactions();
  } catch (err) { /* unauthorized handled in apiFetch */ }
}

async function editTransaction(id) {
  try {
    const res = await apiFetch(API_BASE + "/api/transactions", { headers: authHeaders() });
    const data = await res.json();
    const t = data.find(x => x._id === id);
    if (!t) return;
    document.getElementById("edit-id").value = t._id;
    document.getElementById("customer").value = t.customer;
    document.getElementById("items-container").innerHTML = "";
    (t.items || []).forEach(item => createItemRow(item.name, item.price));
    if (!(t.items || []).length) createItemRow();
    txnType = t.type === "paid" ? "paid" : "katha";
    paintTypeButtons();
    calculateTotal();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) { /* unauthorized handled in apiFetch */ }
}

// ---- Logout ----
const logoutBtn = document.getElementById("logout");
if (logoutBtn) logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("fk_token");
  localStorage.removeItem("fk_name");
  window.location.href = "/login.html";
});

// ---- Per-page init ----
if (isFormPage) {
  paintTypeButtons();
  renderMenu();
  // Opened from Transactions → Edit: pre-fill the form.
  const editId = new URLSearchParams(window.location.search).get("edit");
  if (editId) editTransaction(editId);
}
if (isListPage) {
  loadTransactions();
}

} // end requireLogin gate
