const API = window.location.origin;

// Helper to get token
function authHeader() {
  return {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem("token")
  };
}

// === Signup Page ===
if (window.location.pathname.endsWith("signup.html")) {
  document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    if (res.ok) {
      alert("Signup successful!");
      window.location.href = "login.html";
    } else {
      const data = await res.json();
      alert(data.error || "Signup failed");
    }
  });
}

// === Login Page ===
if (window.location.pathname.endsWith("login.html")) {
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    } else {
      alert(data.error || "Login failed");
    }
  });
}

// === Dashboard Page ===
if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "login.html";

  const form = document.getElementById("transaction-form");
  const list = document.getElementById("transaction-list");
  const search = document.getElementById("search");

  async function loadTransactions() {
    list.innerHTML = "";
    try {
      const res = await fetch(`${API}/api/transactions`, { headers: authHeader() });
      const data = await res.json();

      data.forEach(tr => {
        const div = document.createElement("div");
        div.innerHTML = `
          <strong>${tr.customer}</strong><br>
          ${tr.items.map(item => `${item.name} - ₹${item.price}`).join("<br>")}<br>
          <strong>Total: ₹${tr.amount}</strong>
          <button onclick="deleteTransaction('${tr._id}')">🗑️</button>
        `;
        list.appendChild(div);
      });
    } catch (err) {
      list.innerHTML = "❌ Failed to load transactions.";
    }
  }

  window.deleteTransaction = async function(id) {
    if (!confirm("Are you sure to delete this?")) return;
    await fetch(`${API}/api/transactions/${id}`, {
      method: "DELETE",
      headers: authHeader()
    });
    loadTransactions();
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const customer = document.getElementById("customer").value;
    const itemElems = document.querySelectorAll(".item");
    const items = [];

    itemElems.forEach(div => {
      const name = div.querySelector(".item-name").value;
      const price = parseFloat(div.querySelector(".item-price").value);
      if (name && price) items.push({ name, price });
    });

    const total = items.reduce((sum, i) => sum + i.price, 0);

    await fetch(`${API}/api/transactions`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ customer, items, amount: total, type: "katha" })
    });

    form.reset();
    loadTransactions();
  });

  search.addEventListener("input", async () => {
    const val = search.value.toLowerCase();
    const divs = document.querySelectorAll("#transaction-list > div");
    divs.forEach(div => {
      div.style.display = div.textContent.toLowerCase().includes(val) ? "block" : "none";
    });
  });

  document.getElementById("add-item").addEventListener("click", () => {
    const container = document.createElement("div");
    container.className = "item";
    container.innerHTML = `
      <input type="text" class="item-name" placeholder="Item Name" required>
      <input type="number" class="item-price" placeholder="Price ₹" required>
    `;
    document.getElementById("items-container").appendChild(container);
  });

  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });

  loadTransactions();
}
