const API_BASE = window.location.origin;

document.getElementById("add-item").addEventListener("click", () => {
  const container = document.getElementById("items-container");
  const row = document.createElement("div");
  row.className = "flex space-x-2";
  row.innerHTML = `
    <input type="text" placeholder="Item Name" class="item-name flex-1 p-2 border rounded" />
    <input type="number" placeholder="₹" class="item-price w-24 p-2 border rounded" />
    <button type="button" class="remove-item text-red-500">❌</button>
  `;
  container.appendChild(row);
});

document.getElementById("items-container").addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-item")) {
    e.target.parentElement.remove();
  }
});

document.getElementById("transaction-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const customer = document.getElementById("customer").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const id = document.getElementById("edit-id").value;

  const items = [...document.querySelectorAll("#items-container .flex")].map(row => ({
    name: row.querySelector(".item-name").value,
    price: parseFloat(row.querySelector(".item-price").value)
  }));

  const transaction = { customer, amount, type: "katha", items };

  try {
    if (id) {
      await fetch(`${API_BASE}/api/transactions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction)
      });
    } else {
      await fetch(`${API_BASE}/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction)
      });
    }
    document.getElementById("transaction-form").reset();
    document.getElementById("edit-id").value = "";
    document.getElementById("items-container").innerHTML = "";
    loadTransactions();
  } catch (err) {
    alert("❌ Error saving transaction.");
  }
});

document.getElementById("search").addEventListener("input", loadTransactions);

async function loadTransactions() {
  try {
    const res = await fetch(`${API_BASE}/api/transactions`);
    const data = await res.json();
    const search = document.getElementById("search").value.toLowerCase();
    const filtered = data.filter(t => t.customer.toLowerCase().includes(search));
    displayTransactions(filtered);
  } catch {
    document.getElementById("transactions").innerHTML = "<p class='text-red-500'>❌ Failed to load transactions.</p>";
  }
}

function displayTransactions(transactions) {
  const container = document.getElementById("transactions");
  container.innerHTML = "";

  if (transactions.length === 0) {
    container.innerHTML = "<p class='text-gray-500 text-center'>No transactions found.</p>";
    return;
  }

  transactions.forEach(t => {
    const div = document.createElement("div");
    div.className = "bg-white p-3 rounded shadow";

    const itemsList = t.items.map(i => `<li>${i.name} - ₹${i.price}</li>`).join("");

    div.innerHTML = `
      <p><strong>${t.customer}</strong> - ₹${t.amount} (Katha)</p>
      <ul class="text-sm text-gray-600">${itemsList}</ul>
      <p class="text-xs text-gray-400 text-right">${new Date(t.createdAt).toLocaleString()}</p>
      <div class="mt-2 flex justify-end space-x-2">
        <button onclick="editTransaction('${t._id}')" class="text-blue-600 text-sm">✏️ Edit</button>
        <button onclick="deleteTransaction('${t._id}')" class="text-red-600 text-sm">🗑️ Delete</button>
      </div>
    `;

    container.appendChild(div);
  });
}

async function deleteTransaction(id) {
  if (!confirm("Are you sure you want to delete this transaction?")) return;
  await fetch(`${API_BASE}/api/transactions/${id}`, { method: "DELETE" });
  loadTransactions();
}

async function editTransaction(id) {
  const res = await fetch(`${API_BASE}/api/transactions`);
  const data = await res.json();
  const t = data.find(x => x._id === id);
  if (!t) return;

  document.getElementById("edit-id").value = t._id;
  document.getElementById("customer").value = t.customer;
  document.getElementById("amount").value = t.amount;

  document.getElementById("items-container").innerHTML = "";
  t.items.forEach(item => {
    const row = document.createElement("div");
    row.className = "flex space-x-2";
    row.innerHTML = `
      <input type="text" value="${item.name}" class="item-name flex-1 p-2 border rounded" />
      <input type="number" value="${item.price}" class="item-price w-24 p-2 border rounded" />
      <button type="button" class="remove-item text-red-500">❌</button>
    `;
    document.getElementById("items-container").appendChild(row);
  });
}

loadTransactions();
