# eBallot — Online Voting System

A complete front-end online voting system for a (fictional) state assembly election. Plain HTML, CSS and
JavaScript; no build step and no server required. Open `index.html` in a browser.

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Election overview, live statistics, schedule, eligibility rules, FAQ |
| `parties.html` | 10 contesting parties with symbol, leader, ideology, manifesto; candidates per constituency |
| `register.html` | Voter registration form with full validation (age 18+, EPIC format, mobile, password strength) |
| `login.html` | Two-step sign-in: EPIC + password, then a 6-digit OTP (simulated SMS) |
| `vote.html` | EVM-style ballot, confirmation dialog, receipt with unique number |
| `verify.html` | Check that a receipt's ballot is in the ballot box (without revealing the choice) |
| `results.html` | Vote share, seat tally, majority mark, constituency-wise counts and turnout |
| `demo.html` | Stand-alone demo booth (not for real elections): one vote per browser, stored in localStorage, with running totals |
| `admin.html` | Returning Officer panel: open/close poll, publish results, electoral roll, audit log, CSV export, reset |

## Demo accounts

| Role | Username / EPIC | Password |
|---|---|---|
| Voter (AC-02 Rajgarh Central) | `DEM1234567` | `Demo@1234` |
| Voter (AC-01 Shantipur North) | `TST4821630` | `Vote@4821` |
| Voter (AC-03 Devnagar) | `TST5937204` | `Vote@5937` |
| Voter (AC-04 Sagar Coastal) | `TST7264019` | `Vote@7264` |
| Voter (AC-05 Kisanpur Rural) | `TST8150362` | `Vote@8150` |
| Returning Officer | `admin` | `Admin@2026` |

The OTP appears on screen as a simulated SMS notification. Each voter can vote once; to vote again with the
same accounts, use **Reset all data** in the Returning Officer panel (the demo accounts are recreated).

## Contesting parties (all fictional)

NPF – National Progressive Front (Rising Sun) · PDA – People's Democratic Alliance (Lamp) ·
GEP – Green Earth Party (Tree) · KMS – Kisan Mazdoor Sangh (Wheat Sheaf) · BVM – Bharat Vikas Morcha (Wheel) ·
LCU – Liberal Citizens Union (Open Book) · SJD – Samata Janata Dal (Scales) · YRP – Yuva Rashtra Party (Star) ·
CFP – Coastal Federal Party (Anchor) · JSP – Jan Shakti Party (Mountain) · plus NOTA.

## Security and integrity features

- Passwords are salted and hashed with SHA-256 (Web Crypto API); plain passwords are never stored.
- Two-factor sign-in with a 2-minute OTP and 3 attempts per code.
- Account lock for 15 minutes after 5 wrong passwords.
- Voting session expires 10 minutes after sign-in.
- One vote per elector, enforced before a ballot is accepted.
- **Ballot secrecy:** the voter roll records only *that* someone voted; the ballot box stores the choice,
  constituency and a timestamp rounded to the minute — never the EPIC number. Ballots are inserted at a
  random position so storage order cannot reveal voting order.
- Receipt numbers let voters verify their ballot was counted without exposing their choice.
- Integrity check in the admin panel (ballot count must equal electors marked as voted).
- Audit log of sign-ins, registrations, votes, lockouts and admin actions.

## Project structure

```
index.html  parties.html  register.html  login.html
vote.html   verify.html   results.html   admin.html
assets/css/style.css
assets/js/data.js    – election config, constituencies, parties, symbols
assets/js/store.js   – storage, hashing, sessions, voting, tally
assets/js/ui.js      – shared header/footer, formatting, toasts
```

## Limitations

This is an academic project. All data is kept in the browser's `localStorage`, so each browser has its own
election. A real deployment would need a server-side database, real SMS delivery, identity verification
against the electoral roll, and an independent audit of the code.
