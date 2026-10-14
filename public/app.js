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

const API_BASE = window.location.origin;
const welcome = document.getElementById("welcome");
if (welcome && localStorage.getItem("fk_name")) {
  welcome.textContent = "Namaste, " + localStorage.getItem("fk_name") + " 🙏";
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
btnKatha.addEventListener("click", () => { txnType = "katha"; paintTypeButtons(); });
btnPaid.addEventListener("click", () => { txnType = "paid"; paintTypeButtons(); });

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
    '<input type="text" placeholder="Item Name" value="' + (name || "") + '" class="item-name flex-1 p-2 border rounded-lg text-base" />' +
    '<input type="number" inputmode="decimal" placeholder="₹" value="' + (price === undefined ? "" : price) + '" class="item-price w-24 p-2 border rounded-lg text-base" />' +
    '<button type="button" class="remove-item text-red-500 text-xl px-1">✕</button>';
  container.appendChild(row);
  row.querySelector(".item-price").addEventListener("input", calculateTotal);
}
createItemRow(); // one empty row to start

document.getElementById("add-item").addEventListener("click", () => createItemRow());

document.getElementById("items-container").addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-item")) {
    e.target.parentElement.remove();
    calculateTotal();
  }
});

// ---- Save (create / update) ----
document.getElementById("transaction-form").addEventListener("submit", async (e) => {
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

    document.getElementById("transaction-form").reset();
    document.getElementById("edit-id").value = "";
    document.getElementById("items-container").innerHTML = "";
    createItemRow();
    txnType = "katha"; paintTypeButtons();
    calculateTotal();
    loadTransactions();
  } catch (err) {
    if (err.message !== "unauthorized") alert("❌ Error saving transaction.");
  }
});

// ---- List / search ----
document.getElementById("search").addEventListener("input", loadTransactions);

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
    div.innerHTML =
      "<div class='flex items-center justify-between'><p><strong>" + escapeHtml(t.customer) + "</strong> - ₹" + t.amount + "</p>" + typeBadge(t) + "</div>" +
      (itemsList ? "<ul class='text-sm text-gray-600 mt-1'>" + itemsList + "</ul>" : "") +
      "<p class='text-xs text-gray-400 text-right mt-1'>" + new Date(t.createdAt).toLocaleString() + "</p>" +
      "<div class='mt-2 flex justify-end space-x-4'>" +
      "<button data-edit='" + t._id + "' class='text-blue-600 text-sm'>✏️ Edit</button>" +
      "<button data-del='" + t._id + "' class='text-red-600 text-sm'>🗑️ Delete</button>" +
      "</div>";
    container.appendChild(div);
  });

  container.querySelectorAll("[data-edit]").forEach(b =>
    b.addEventListener("click", () => editTransaction(b.getAttribute("data-edit"))));
  container.querySelectorAll("[data-del]").forEach(b =>
    b.addEventListener("click", () => deleteTransaction(b.getAttribute("data-del"))));
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
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("fk_token");
  localStorage.removeItem("fk_name");
  window.location.href = "/login.html";
});

paintTypeButtons();
loadTransactions();

} // end requireLogin gate
