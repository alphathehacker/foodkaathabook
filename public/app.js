const API_BASE = window.location.origin;

document.getElementById("transaction-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const customer = document.getElementById("customer").value;
  const itemName = document.getElementById("item").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  const items = itemName ? [{ name: itemName, price: amount }] : [];

  const transaction = { customer, items, amount, type };

  try {
    await fetch(`${API_BASE}/api/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
    });
    document.getElementById("transaction-form").reset();
    loadTransactions();
  } catch (err) {
    alert("❌ Error adding transaction.");
    console.error(err);
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
  } catch (err) {
    document.getElementById("transactions").innerHTML = "<p class='text-red-500'>❌ Failed to load transactions.</p>";
  }
}

function displayTransactions(transactions) {
  const container = document.getElementById("transactions");
  if (transactions.length === 0) {
    container.innerHTML = "<p class='text-gray-500 text-center'>No transactions found.</p>";
    return;
  }

  container.innerHTML = transactions.map(t => `
    <div class="bg-white p-3 rounded shadow">
      <p><strong>${t.customer}</strong> - ₹${t.amount} (${t.type})</p>
      ${t.items.map(i => `<p class="text-sm text-gray-600">• ${i.name} - ₹${i.price}</p>`).join("")}
      <p class="text-xs text-gray-400 text-right">${new Date(t.createdAt).toLocaleString()}</p>
    </div>
  `).join("");
}

loadTransactions();
