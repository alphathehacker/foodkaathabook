// ---- Food Kaatha Book i18n: English / Telugu ----
(function () {
  const STR = {
    en: {
      menu: "📋 Menu",
      menu_hint: "— tap an item to add it below",
      morning: "☀️ Morning",
      evening: "🌙 Evening",
      extra: "➕ Extra",
      customer_name: "Customer Name",
      item_name: "Item Name",
      add_item: "+ Add Item",
      katha_credit: "📒 Katha (credit)",
      paid: "💵 Paid",
      katha: "📒 Katha",
      total: "Total",
      save_txn: "Save Transaction",
      view_txns: "📒 View Transactions",
      transactions: "📒 Transactions",
      search_ph: "🔍 Search by Customer Name",
      back: "← Back",
      logout: "Logout",
      edit: "✏️ Edit",
      delete: "🗑️ Delete",
      tick_paid: "✓ Paid",
      welcome: "Namaste, {0} 🙏",
      enter_customer: "Please enter the customer name.",
      err_save: "❌ Error saving transaction.",
      err_load: "❌ Failed to load transactions.",
      confirm_delete: "Delete this transaction?",
      confirm_paid: "Mark ₹{0} from {1} as paid?",
      err_mark_paid: "❌ Could not mark as paid.",
      empty_list: "No transactions yet.<br>Add the first one above 👆",
      rate_prompt: "Default rate for {0} (₹):",
      invalid_rate: "Please enter a valid rate.",
      login_sub: "Log in to your shop ledger",
      email_ph: "Email Address",
      password_ph: "Password",
      login_btn: "Log In",
      login_logging_in: "Logging in…",
      login_new: "New here?",
      login_create: "Create an account",
      login_err_fields: "Enter your email and password.",
      login_err_failed: "Login failed.",
      err_server: "Could not reach the server. Check your connection.",
      signup_sub: "Create your shop account",
      name_ph: "Your Name",
      password_signup_ph: "Password (min 4 characters)",
      signup_btn: "Sign Up",
      signup_creating: "Creating account…",
      signup_have: "Already have an account?",
      signup_login_link: "Log in",
      signup_err_fields: "Fill in all three fields.",
      signup_err_failed: "Signup failed."
    },
    te: {
      menu: "📋 మెనూ",
      menu_hint: "— కింద జోడించడానికి నొక్కండి",
      morning: "☀️ ఉదయం",
      evening: "🌙 సాయంత్రం",
      extra: "➕ అదనపు",
      customer_name: "కస్టమర్ పేరు",
      item_name: "ఐటమ్ పేరు",
      add_item: "+ ఐటమ్ జోడించండి",
      katha_credit: "📒 కాతా (అప్పు)",
      paid: "💵 చెల్లించింది",
      katha: "📒 కాతా",
      total: "మొత్తం",
      save_txn: "లావాదేవీని సేవ్ చేయండి",
      view_txns: "📒 లావాదేవీలు చూడండి",
      transactions: "📒 లావాదేవీలు",
      search_ph: "🔍 కస్టమర్ పేరుతో వెతకండి",
      back: "← వెనుకకు",
      logout: "లాగ్‌అవుట్",
      edit: "✏️ సవరించండి",
      delete: "🗑️ తొలగించండి",
      tick_paid: "✓ చెల్లించింది",
      welcome: "నమస్తే, {0} 🙏",
      enter_customer: "దయచేసి కస్టమర్ పేరు ఇవ్వండి.",
      err_save: "❌ లావాదేవీ సేవ్ చేయడంలో పొరపాటు.",
      err_load: "❌ లావాదేవీలు లోడ్ కాలేదు.",
      confirm_delete: "ఈ లావాదేవీని తొలగించాలా?",
      confirm_paid: "{1} నుండి ₹{0} చెల్లించినట్లు గుర్తు పెట్టాలా?",
      err_mark_paid: "❌ చెల్లించినట్లు గుర్తు పెట్టలేకపోయింది.",
      empty_list: "ఇంకా లావాదేవీలు లేవు.<br>పైన మొదటిది జోడించండి 👆",
      rate_prompt: "{0} డిఫాల్ట్ ధర (₹):",
      invalid_rate: "సరైన ధర ఇవ్వండి.",
      login_sub: "మీ షాప్ లెడ్జర్‌లోకి లాగిన్ అవ్వండి",
      email_ph: "ఈమెయిల్",
      password_ph: "పాస్‌వర్డ్",
      login_btn: "లాగిన్",
      login_logging_in: "లాగిన్ అవుతోంది…",
      login_new: "కొత్తవారా?",
      login_create: "ఖాతా తెరవండి",
      login_err_fields: "ఈమెయిల్, పాస్‌వర్డ్ ఇవ్వండి.",
      login_err_failed: "లాగిన్ విఫలమైంది.",
      err_server: "సర్వర్‌ను చేరలేకపోయాం. కనెక్షన్ చూడండి.",
      signup_sub: "మీ షాప్ ఖాతా తెరవండి",
      name_ph: "మీ పేరు",
      password_signup_ph: "పాస్‌వర్డ్ (కనీసం 4 అక్షరాలు)",
      signup_btn: "సైన్ అప్",
      signup_creating: "ఖాతా తెరుస్తోంది…",
      signup_have: "ఖాతా ఇప్పటికే ఉందా?",
      signup_login_link: "లాగిన్ అవ్వండి",
      signup_err_fields: "మూడు ఖాళీలు నింపండి.",
      signup_err_failed: "సైన్ అప్ విఫలమైంది."
    }
  };

  // Telugu display names for menu items (stored in English, shown translated)
  const MENU_TE = {
    "Puri": "పూరీ",
    "Bajji": "బజ్జీ",
    "Idly": "ఇడ్లీ",
    "Attu": "అట్టు",
    "Salla punuku": "సల్ల పునుకు",
    "Mirapakaaya bajji": "మిరపకాయ బజ్జీ",
    "Tomoto bajji": "టమోటా బజ్జీ",
    "Aratikaaya bajji": "అరటికాయ బజ్జీ",
    "Milmaker": "మిల్క్‌మేకర్",
    "Sanna pusa": "సన్న పూస",
    "Boondi": "బూందీ",
    "Kommulu": "కొమ్ములు",
    "Chekodilu": "చేకోడీలు",
    "Checkkalu": "చెక్కలు"
  };

  function getLang() {
    return localStorage.getItem("fk_lang") === "te" ? "te" : "en";
  }
  function setLang(l) {
    localStorage.setItem("fk_lang", l === "te" ? "te" : "en");
  }
  function T(key) {
    let s = (STR[getLang()] && STR[getLang()][key]) || STR.en[key] || key;
    for (let i = 1; i < arguments.length; i++) {
      s = s.split("{" + (i - 1) + "}").join(arguments[i]);
    }
    return s;
  }
  function itemDisplayName(name) {
    return getLang() === "te" ? (MENU_TE[name] || name) : name;
  }
  function applyI18n() {
    document.querySelectorAll("[data-i18n]").forEach(el => { el.innerHTML = T(el.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = T(el.getAttribute("data-i18n-ph")); });
    const t = document.getElementById("lang-toggle");
    if (t) t.textContent = getLang() === "en" ? "తెలుగు" : "English";
  }

  // Auto-wire the header language toggle on every page
  document.addEventListener("DOMContentLoaded", () => {
    applyI18n();
    const t = document.getElementById("lang-toggle");
    if (t) t.addEventListener("click", () => {
      setLang(getLang() === "en" ? "te" : "en");
      applyI18n();
      window.dispatchEvent(new CustomEvent("fk-lang-change"));
    });
  });

  window.FK_I18N = { T, getLang, setLang, applyI18n, itemDisplayName };
})();
