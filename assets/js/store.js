/* ------------------------------------------------------------------
   eBallot — data layer
   Persists to localStorage. The voter roll and the ballot box are
   kept in separate collections: a ballot never stores the voter ID,
   so a cast vote cannot be traced back to the person who cast it.
------------------------------------------------------------------- */

const Store = (() => {
  const KEY = "eballot_db_v1";
  const SESSION_KEY = "eballot_session";
  const ADMIN_KEY = "eballot_admin";

  /* Demo credentials — documented in README.md */
  const DEMO_ADMIN = { user: "admin", pass: "Admin@2026" };
  const DEMO_VOTER = { id: "DEM1234567", pass: "Demo@1234" };
  /* Extra ready-made demo electors (one per constituency) — also in README.md */
  const DEMO_VOTERS = [
    { id: "TST4821630", pass: "Vote@4821", name: "Aarav Demo",  gender: "Male",   dob: "2001-06-12", mobile: "9000000101", constituency: "AC-01" },
    { id: "TST5937204", pass: "Vote@5937", name: "Diya Demo",   gender: "Female", dob: "1995-02-28", mobile: "9000000102", constituency: "AC-03" },
    { id: "TST7264019", pass: "Vote@7264", name: "Kabir Demo",  gender: "Male",   dob: "1988-11-03", mobile: "9000000103", constituency: "AC-04" },
    { id: "TST8150362", pass: "Vote@8150", name: "Meera Demo",  gender: "Female", dob: "1979-08-19", mobile: "9000000104", constituency: "AC-05" }
  ];

  async function ensureDemoVoters(target) {
    let added = false;
    for (const d of DEMO_VOTERS) {
      if (target.voters[d.id]) continue;
      target.voters[d.id] = await makeVoter({
        voterId: d.id, name: d.name, fatherName: "Demo Guardian", dob: d.dob, gender: d.gender,
        mobile: d.mobile, email: "", address: "Demo address", constituency: d.constituency, synthetic: false
      }, d.pass);
      added = true;
    }
    return added;
  }

  let db = null;

  /* ---------- hashing ---------- */
  async function sha256(text) {
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
      return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
    }
    // Fallback (non-secure contexts): FNV-1a, repeated to 64 hex chars
    let out = "", h = 0x811c9dc5;
    for (let r = 0; r < 8; r++) {
      for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i) + r; h = Math.imul(h, 16777619) >>> 0; }
      out += h.toString(16).padStart(8, "0");
    }
    return out;
  }

  function randomHex(bytes = 16) {
    const a = new Uint8Array(bytes);
    crypto.getRandomValues(a);
    return [...a].map(b => b.toString(16).padStart(2, "0")).join("");
  }

  function randInt(max) {
    const a = new Uint32Array(1);
    crypto.getRandomValues(a);
    return a[0] % max;
  }

  /* ---------- persistence ---------- */
  function persist() { localStorage.setItem(KEY, JSON.stringify(db)); }

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
  }

  async function makeVoter(data, password) {
    const salt = randomHex(8);
    return {
      ...data,
      salt,
      pwHash: await sha256(salt + ":" + password),
      registeredAt: new Date().toISOString(),
      hasVoted: false,
      votedAt: null,
      failedAttempts: 0,
      lockedUntil: null
    };
  }

  async function freshDb() {
    const adminSalt = randomHex(8);
    const fresh = {
      version: 1,
      createdAt: new Date().toISOString(),
      election: { status: "open", resultsPublished: true, updatedAt: new Date().toISOString() },
      admin: { user: DEMO_ADMIN.user, salt: adminSalt, hash: await sha256(adminSalt + ":" + DEMO_ADMIN.pass) },
      voters: {},
      ballots: [],
      audit: []
    };
    fresh.voters[DEMO_VOTER.id] = await makeVoter({
      voterId: DEMO_VOTER.id, name: "Demo Voter", fatherName: "Demo Guardian",
      dob: "1998-04-15", gender: "Other", mobile: "9876543210", email: "",
      address: "House 12, Station Road", constituency: "AC-02", synthetic: false
    }, DEMO_VOTER.pass);
    await ensureDemoVoters(fresh);
    return fresh;
  }

  async function init() {
    db = load();
    if (!db || db.version !== 1) {
      db = await freshDb();
      db.audit.push({ ts: new Date().toISOString(), actor: "system", event: "Database initialised" });
      persist();
    } else if (await ensureDemoVoters(db)) {
      // existing browser data: add any demo electors that are missing
      db.audit.unshift({ ts: new Date().toISOString(), actor: "system", event: "Demo electors added" });
      persist();
    }
    // keep tabs in sync
    window.addEventListener("storage", e => { if (e.key === KEY) { db = load(); document.dispatchEvent(new Event("store:changed")); } });
    return db;
  }

  const ready = init();

  function log(actor, event) {
    db.audit.unshift({ ts: new Date().toISOString(), actor, event });
    if (db.audit.length > 500) db.audit.length = 500;
  }

  /* ---------- voters ---------- */
  function getVoter(id) { return db.voters[(id || "").toUpperCase()] || null; }

  async function registerVoter(data, password) {
    const id = data.voterId.toUpperCase();
    if (db.voters[id]) throw new Error("A voter with this EPIC number is already registered.");
    const dupMobile = Object.values(db.voters).find(v => v.mobile === data.mobile && !v.synthetic);
    if (dupMobile) throw new Error("This mobile number is already linked to another voter.");
    db.voters[id] = await makeVoter({ ...data, voterId: id, synthetic: false }, password);
    log("voter", `New registration ${maskId(id)} in ${data.constituency}`);
    persist();
    return db.voters[id];
  }

  async function checkPassword(id, password) {
    const v = getVoter(id);
    if (!v || v.synthetic) return { ok: false, reason: "Invalid EPIC number or password." };
    if (v.lockedUntil && Date.now() < new Date(v.lockedUntil).getTime()) {
      const mins = Math.ceil((new Date(v.lockedUntil).getTime() - Date.now()) / 60000);
      return { ok: false, reason: `Account locked after repeated failed attempts. Try again in ${mins} min.` };
    }
    const hash = await sha256(v.salt + ":" + password);
    if (hash !== v.pwHash) {
      v.failedAttempts = (v.failedAttempts || 0) + 1;
      let reason = `Invalid EPIC number or password. ${ELECTION.maxLoginAttempts - v.failedAttempts} attempt(s) remaining.`;
      if (v.failedAttempts >= ELECTION.maxLoginAttempts) {
        v.lockedUntil = new Date(Date.now() + ELECTION.lockMinutes * 60000).toISOString();
        v.failedAttempts = 0;
        reason = `Too many failed attempts. Account locked for ${ELECTION.lockMinutes} minutes.`;
        log("system", `Account ${maskId(v.voterId)} locked`);
      }
      persist();
      return { ok: false, reason };
    }
    v.failedAttempts = 0; v.lockedUntil = null; persist();
    return { ok: true, voter: v };
  }

  /* ---------- voting ---------- */
  async function castVote(voterId, partyId) {
    const v = getVoter(voterId);
    if (!v) throw new Error("Voter not found.");
    if (db.election.status !== "open") throw new Error("Polling is not open at this time.");
    if (v.hasVoted) throw new Error("A vote has already been recorded for this EPIC number.");
    if (partyId !== "NOTA" && !PARTIES.some(p => p.id === partyId)) throw new Error("Invalid selection.");

    const nonce = randomHex(16);
    const digest = (await sha256(nonce + partyId + Date.now())).toUpperCase();
    const receipt = `EB-${digest.slice(0, 4)}-${digest.slice(4, 8)}-${digest.slice(8, 12)}`;
    const ts = new Date();
    ts.setSeconds(0, 0); // coarse timestamp — limits timing correlation

    const ballot = { receipt, constituency: v.constituency, choice: partyId, castAt: ts.toISOString() };
    // insert at a random position so storage order does not reveal voting order
    db.ballots.splice(randInt(db.ballots.length + 1), 0, ballot);

    v.hasVoted = true;
    v.votedAt = new Date().toISOString();
    log("voter", `Vote recorded in ${v.constituency}`);
    persist();
    return { receipt, castAt: v.votedAt, constituency: v.constituency };
  }

  function findReceipt(code) {
    const c = (code || "").trim().toUpperCase();
    const b = db.ballots.find(x => x.receipt === c);
    return b ? { receipt: b.receipt, constituency: b.constituency, castAt: b.castAt } : null;
  }

  /* ---------- results ---------- */
  function tally() {
    const options = [...PARTIES.map(p => p.id), "NOTA"];
    const byParty = Object.fromEntries(options.map(id => [id, 0]));
    const byConst = {};
    CONSTITUENCIES.forEach(c => {
      byConst[c.id] = { votes: Object.fromEntries(options.map(id => [id, 0])), total: 0, registered: 0, winner: null, margin: 0 };
    });
    Object.values(db.voters).forEach(v => { if (byConst[v.constituency]) byConst[v.constituency].registered++; });
    db.ballots.forEach(b => {
      if (!byConst[b.constituency]) return;
      byParty[b.choice]++;
      byConst[b.constituency].votes[b.choice]++;
      byConst[b.constituency].total++;
    });
    const seats = Object.fromEntries(PARTIES.map(p => [p.id, 0]));
    Object.values(byConst).forEach(c => {
      const ranked = PARTIES.map(p => [p.id, c.votes[p.id]]).sort((a, b) => b[1] - a[1]);
      if (ranked[0][1] > 0 && ranked[0][1] !== ranked[1][1]) {
        c.winner = ranked[0][0];
        c.margin = ranked[0][1] - ranked[1][1];
        seats[c.winner]++;
      } else if (ranked[0][1] > 0) {
        c.winner = "TIE";
      }
    });
    const total = db.ballots.length;
    const registered = Object.keys(db.voters).length;
    return { byParty, byConst, seats, total, registered, turnout: registered ? total / registered : 0 };
  }

  /* ---------- election control ---------- */
  function setStatus(status) {
    db.election.status = status;
    db.election.updatedAt = new Date().toISOString();
    log("admin", `Polling status changed to ${status.toUpperCase()}`);
    persist();
  }
  function setResultsPublished(flag) {
    db.election.resultsPublished = flag;
    db.election.updatedAt = new Date().toISOString();
    log("admin", flag ? "Results published" : "Results withdrawn from public view");
    persist();
  }

  async function checkAdmin(user, pass) {
    if (user !== db.admin.user) return false;
    return (await sha256(db.admin.salt + ":" + pass)) === db.admin.hash;
  }

  /* ---------- sample data (for demonstration) ---------- */
  function seedSample(count = 400) {
    const L = "ABCDEFGHJKLMNPRSTUVWXYZ";
    const options = [...PARTIES.map(p => ({ id: p.id, w: p.popularity })), { id: "NOTA", w: 1.5 }];
    let made = 0, votes = 0;
    for (let i = 0; i < count; i++) {
      let id;
      do { id = L[randInt(L.length)] + L[randInt(L.length)] + L[randInt(L.length)] + String(1000000 + randInt(9000000)); }
      while (db.voters[id]);
      const c = CONSTITUENCIES[randInt(CONSTITUENCIES.length)];
      db.voters[id] = {
        voterId: id, name: "Sample Elector", gender: ["Male", "Female"][randInt(2)],
        dob: `${1950 + randInt(55)}-0${1 + randInt(9)}-1${randInt(9)}`,
        mobile: "", constituency: c.id, synthetic: true,
        registeredAt: new Date().toISOString(), hasVoted: false, votedAt: null
      };
      made++;
      if (randInt(100) < 68) {
        // regional bias makes constituency results differ from each other
        const ci = CONSTITUENCIES.indexOf(c);
        const weighted = options.map((o, k) => ({ id: o.id, w: o.w * (1 + (((k + ci * 3) % 5) - 2) * 0.22) }));
        const sum = weighted.reduce((s, o) => s + o.w, 0);
        let r = (randInt(100000) / 100000) * sum, choice = weighted[0].id;
        for (const o of weighted) { r -= o.w; if (r <= 0) { choice = o.id; break; } }
        const d = new Date(); d.setSeconds(0, 0); d.setMinutes(d.getMinutes() - randInt(600));
        const h = randomHex(6).toUpperCase();
        db.ballots.splice(randInt(db.ballots.length + 1), 0,
          { receipt: `EB-${h.slice(0, 4)}-${h.slice(4, 8)}-${h.slice(8, 12)}`, constituency: c.id, choice, castAt: d.toISOString() });
        db.voters[id].hasVoted = true;
        db.voters[id].votedAt = d.toISOString();
        votes++;
      }
    }
    log("admin", `Loaded ${made} sample electors and ${votes} sample ballots`);
    persist();
    return { made, votes };
  }

  async function resetAll() {
    db = await freshDb();
    log("admin", "All election data reset");
    persist();
    sessionStorage.removeItem(SESSION_KEY);
  }

  /* ---------- sessions ---------- */
  const Session = {
    start(voterId) {
      const s = { voterId, issued: Date.now(), expires: Date.now() + ELECTION.sessionMinutes * 60000, token: randomHex(12) };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
      return s;
    },
    get() {
      try {
        const s = JSON.parse(sessionStorage.getItem(SESSION_KEY));
        if (!s || Date.now() > s.expires) { sessionStorage.removeItem(SESSION_KEY); return null; }
        return s;
      } catch { return null; }
    },
    end() { sessionStorage.removeItem(SESSION_KEY); }
  };

  const AdminSession = {
    start() { sessionStorage.setItem(ADMIN_KEY, JSON.stringify({ at: Date.now(), expires: Date.now() + 30 * 60000 })); },
    active() {
      try { const s = JSON.parse(sessionStorage.getItem(ADMIN_KEY)); return !!s && Date.now() < s.expires; }
      catch { return false; }
    },
    end() { sessionStorage.removeItem(ADMIN_KEY); }
  };

  function maskId(id) { return id ? id.slice(0, 3) + "****" + id.slice(-3) : ""; }

  return {
    ready, sha256, randInt, log, persist,
    get db() { return db; },
    getVoter, registerVoter, checkPassword, castVote, findReceipt, tally,
    setStatus, setResultsPublished, checkAdmin, seedSample, resetAll,
    Session, AdminSession, maskId
  };
})();
