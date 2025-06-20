let allTransactions = [];

document.getElementById("transactionForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const item = document.getElementById("item").value;
  const amount = document.getElementById("amount").value;
  const type = document.getElementById("type").value;

  fetch("https://your-backend-url.onrender.com/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer: name,
      items: [{ name: item, price: parseFloat(amount) }],
      amount: parseFloat(amount),
      type: type,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("status").textContent = "✅ Transaction Added!";
      document.getElementById("transactionForm").reset();
      loadTransactions(); // refresh
    })
    .catch((err) => {
      document.getElementById("status").textContent = "❌ Error adding transaction.";
    });
});

function loadTransactions() {
  fetch("https://your-backend-url.onrender.com/api/transactions")
    .then((res) => res.json())
    .then((data) => {
      allTransactions = data.slice(-50).reverse(); // keep last 50
      renderTransactions(allTransactions);
    })
    .catch((err) => {
      document.getElementById("transactions").innerText = "❌ Failed to load transactions.";
    });
}

function renderTransactions(transactions) {
  const container = document.getElementById("transactions");
  container.innerHTML = "";

  if (transactions.length === 0) {
    container.innerHTML = "<p class='text-center text-gray-500'>No transactions found.</p>";
    return;
  }

  transactions.forEach((tx) => {
    const el = document.createElement("div");
    el.className = "bg-white p-3 rounded shadow text-sm";
    el.innerHTML = `
      <div><strong>${tx.customer}</strong> (${tx.type.toUpperCase()})</div>
      <div>${tx.items.map(i => `${i.name} ₹${i.price}`).join(', ')}</div>
      <div class="text-gray-500">${new Date(tx.date).toLocaleString()}</div>
    `;
    container.appendChild(el);
  });
}

// 🔍 Search functionality
document.getElementById("searchInput").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const filtered = allTransactions.filter(tx => tx.customer.toLowerCase().includes(query));
  renderTransactions(filtered);
});

// Load when page starts
loadTransactions();
