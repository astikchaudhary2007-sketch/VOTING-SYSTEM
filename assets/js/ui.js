/* ------------------------------------------------------------------
   eBallot — shared page chrome and helpers
------------------------------------------------------------------- */

const UI = (() => {
  const NAV = [
    ["index.html", "Home"],
    ["parties.html", "Parties & Candidates"],
    ["register.html", "Voter Registration"],
    ["vote.html", "Cast Vote"],
    ["verify.html", "Verify Receipt"],
    ["demo.html", "Demo Booth"],
    ["results.html", "Results"]
  ];

  const emblem = `<svg viewBox="0 0 48 48" width="44" height="44" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true">
      <rect x="7" y="20" width="34" height="22" rx="1.5"/><path d="M7 27h34"/><path d="M18 20V8h12v12"/><path d="M21 13l2.5 2.5L28 11"/><path d="M19 34h10"/></svg>`;

  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function fmtDate(iso, withTime = false) {
    if (!iso) return "—";
    const d = new Date(iso);
    const opts = { day: "2-digit", month: "short", year: "numeric" };
    if (withTime) Object.assign(opts, { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleString("en-IN", opts);
  }

  function num(n) { return Number(n || 0).toLocaleString("en-IN"); }
  function pct(n, digits = 1) { return (n * 100).toFixed(digits) + "%"; }

  function statusLabel(s) {
    return { open: "Polling open", closed: "Polling closed", scheduled: "Polling not started" }[s] || s;
  }

  function header() {
    const page = location.pathname.split("/").pop() || "index.html";
    const s = Store.Session.get();
    const voter = s && Store.getVoter(s.voterId);
    const el = document.getElementById("site-header");
    if (!el) return;
    el.innerHTML = `
      <div class="gov-strip"><div class="wrap">
        <span>${esc(ELECTION.authority)} &middot; Official e-Ballot Portal</span>
        <span class="strip-right">Voter Helpline <strong>${ELECTION.helpline}</strong></span>
      </div></div>
      <div class="masthead"><div class="wrap">
        <a class="brand" href="index.html">${emblem}
          <span><span class="brand-name">eBallot</span><span class="brand-sub">${esc(ELECTION.title)}</span></span>
        </a>
        <div class="masthead-meta">
          <span class="status-pill status-${Store.db.election.status}">${statusLabel(Store.db.election.status)}</span>
          ${voter ? `<span class="who">Signed in: <strong>${esc(Store.maskId(voter.voterId))}</strong> <button class="link-btn" id="signout">Sign out</button></span>`
                  : `<a class="btn btn-sm btn-outline" href="login.html">Voter sign in</a>`}
        </div>
      </div></div>
      <nav class="mainnav" aria-label="Main"><div class="wrap">
        <button class="nav-toggle" aria-expanded="false" aria-controls="navlist">Menu</button>
        <ul id="navlist">${NAV.map(([href, label]) =>
          `<li><a href="${href}" ${page === href ? 'aria-current="page"' : ""}>${label}</a></li>`).join("")}
          <li class="nav-admin"><a href="admin.html" ${page === "admin.html" ? 'aria-current="page"' : ""}>Returning Officer</a></li>
        </ul>
      </div></nav>`;
    const so = document.getElementById("signout");
    if (so) so.onclick = () => { Store.Session.end(); location.href = "login.html"; };
    const t = el.querySelector(".nav-toggle");
    t.onclick = () => {
      const open = el.querySelector("#navlist").classList.toggle("open");
      t.setAttribute("aria-expanded", open);
    };
  }

  function footer() {
    const el = document.getElementById("site-footer");
    if (!el) return;
    el.innerHTML = `
      <div class="wrap footer-grid">
        <div>
          <h4>eBallot</h4>
          <p>Election code ${ELECTION.code}. Poll date ${fmtDate(ELECTION.pollDate)}, ${ELECTION.pollHours}.
          Counting on ${fmtDate(ELECTION.countingDate)}.</p>
        </div>
        <div>
          <h4>For voters</h4>
          <ul><li><a href="register.html">Register as a voter</a></li><li><a href="login.html">Sign in to vote</a></li>
          <li><a href="verify.html">Verify your receipt</a></li><li><a href="index.html#faq">Frequently asked questions</a></li></ul>
        </div>
        <div>
          <h4>Information</h4>
          <ul><li><a href="parties.html">Contesting parties</a></li><li><a href="results.html">Results &amp; turnout</a></li>
          <li><a href="index.html#schedule">Election schedule</a></li><li><a href="admin.html">Returning Officer login</a></li></ul>
        </div>
      </div>
      <div class="wrap footer-note">
        This portal is an academic demonstration. All parties, candidates and constituencies are fictional.
        Data is stored only in this browser.
      </div>`;
  }

  function toast(msg, kind = "info", ms = 4000) {
    let box = document.getElementById("toasts");
    if (!box) { box = document.createElement("div"); box.id = "toasts"; box.setAttribute("aria-live", "polite"); document.body.appendChild(box); }
    const t = document.createElement("div");
    t.className = `toast toast-${kind}`;
    t.innerHTML = msg;
    box.appendChild(t);
    setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 300); }, ms);
  }

  function fieldError(input, msg) {
    const wrap = input.closest(".field");
    if (!wrap) return;
    let e = wrap.querySelector(".err");
    if (!e) { e = document.createElement("p"); e.className = "err"; wrap.appendChild(e); }
    e.textContent = msg || "";
    wrap.classList.toggle("has-error", !!msg);
    input.setAttribute("aria-invalid", msg ? "true" : "false");
  }

  async function boot(fn) {
    await Store.ready;
    header();
    footer();
    if (fn) await fn();
  }

  return { esc, fmtDate, num, pct, statusLabel, header, footer, toast, fieldError, boot };
})();
