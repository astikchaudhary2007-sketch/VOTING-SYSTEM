/* ------------------------------------------------------------------
   eBallot — static reference data
   All parties, candidates and constituencies are fictional and exist
   only for this academic demonstration.
------------------------------------------------------------------- */

const ELECTION = {
  code: "GE-LA-2026",
  title: "General Election to the Legislative Assembly, 2026",
  authority: "Electoral Services Authority",
  pollDate: "2026-11-20",
  pollHours: "07:00 – 18:00 IST",
  countingDate: "2026-11-23",
  helpline: "1800-000-2026",
  sessionMinutes: 10,
  otpSeconds: 120,
  maxLoginAttempts: 5,
  lockMinutes: 15
};

const SCHEDULE = [
  { event: "Issue of notification", date: "2026-10-12" },
  { event: "Last date for voter registration", date: "2026-11-05" },
  { event: "Scrutiny of nominations", date: "2026-10-24" },
  { event: "Last date for withdrawal of candidature", date: "2026-10-27" },
  { event: "Date of poll", date: "2026-11-20" },
  { event: "Counting of votes", date: "2026-11-23" },
  { event: "Completion of election process", date: "2026-11-26" }
];

const CONSTITUENCIES = [
  { id: "AC-01", name: "Shantipur North", district: "Shantipur", booths: 214, category: "General" },
  { id: "AC-02", name: "Rajgarh Central", district: "Rajgarh",   booths: 188, category: "General" },
  { id: "AC-03", name: "Devnagar",        district: "Rajgarh",   booths: 161, category: "SC" },
  { id: "AC-04", name: "Sagar Coastal",   district: "Sagarpur",  booths: 197, category: "General" },
  { id: "AC-05", name: "Kisanpur Rural",  district: "Sagarpur",  booths: 233, category: "ST" }
];

/* Symbols are drawn as simple line icons (48×48 viewBox). */
const SYMBOLS = {
  sun: '<circle cx="24" cy="24" r="8"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6M9.9 9.9l4.2 4.2M33.9 33.9l4.2 4.2M9.9 38.1l4.2-4.2M33.9 14.1l4.2-4.2"/>',
  lamp: '<path d="M8 28c0 6 7 10 16 10s16-4 16-10H8z"/><path d="M40 28l4-3"/><path d="M24 22c-3-3-3-7 0-12 3 5 3 9 0 12z"/><path d="M18 42h12"/>',
  tree: '<path d="M24 6c-8 0-13 6-13 13 0 6 5 11 13 11s13-5 13-11c0-7-5-13-13-13z"/><path d="M24 30v12M17 42h14M24 34l-5-4M24 32l5-4"/>',
  wheat: '<path d="M24 44V12"/><path d="M24 14c-4-2-5-6-4-9 3 1 5 4 4 9zM24 14c4-2 5-6 4-9-3 1-5 4-4 9z"/><path d="M24 22c-5-1-7-5-7-8 4 0 6 3 7 8zM24 22c5-1 7-5 7-8-4 0-6 3-7 8z"/><path d="M24 30c-5-1-7-5-7-8 4 0 6 3 7 8zM24 30c5-1 7-5 7-8-4 0-6 3-7 8z"/>',
  wheel: '<circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="4"/><path d="M24 7v13M24 28v13M7 24h13M28 24h13M12 12l9.2 9.2M26.8 26.8L36 36M12 36l9.2-9.2M26.8 21.2L36 12"/>',
  book: '<path d="M24 12c-5-3-11-3-17-2v28c6-1 12-1 17 2 5-3 11-3 17-2V10c-6-1-12-1-17 2z"/><path d="M24 12v28"/>',
  scales: '<path d="M24 6v34M14 42h20M10 12h28"/><path d="M10 12l-6 13h12l-6-13zM38 12l-6 13h12l-6-13z"/><path d="M4 25c0 3 3 5 6 5s6-2 6-5M32 25c0 3 3 5 6 5s6-2 6-5"/>',
  star: '<path d="M24 5l5.6 12.2 13.4 1.4-10 9 2.9 13.1L24 34l-11.9 6.7L15 27.6l-10-9 13.4-1.4z"/>',
  anchor: '<circle cx="24" cy="9" r="4"/><path d="M24 13v29M16 20h16"/><path d="M7 28c1 8 8 14 17 14s16-6 17-14"/><path d="M4 31l3-3 3 3M38 31l3-3 3 3"/>',
  mountain: '<path d="M3 40l14-22 7 10 6-8 15 20z"/><path d="M13 24.5l4 3 3-3"/><path d="M30 20l3 4"/>',
  nota: '<rect x="8" y="8" width="32" height="32" rx="2"/><path d="M15 15l18 18M33 15L15 33"/>'
};

const PARTIES = [
  {
    id: "NPF", name: "National Progressive Front", symbol: "sun", symbolName: "Rising Sun",
    color: "#c2581b", founded: 1978, leader: "Harish Chandra Mehta", hq: "Rajgarh",
    ideology: "Centre-left, social democracy", popularity: 24,
    tagline: "Growth that reaches every household.",
    manifesto: [
      "Universal primary healthcare centre within 5 km of every village",
      "1.2 lakh state government vacancies to be filled in two years",
      "Free bus travel for students and senior citizens",
      "Doubling of the state scholarship fund for higher education"
    ],
    candidates: ["Anita Raghavan", "Suresh Kulkarni", "Meena Paswan", "Joseph D'Souza", "Birsa Hembram"]
  },
  {
    id: "PDA", name: "People's Democratic Alliance", symbol: "lamp", symbolName: "Lamp",
    color: "#7a2e8f", founded: 1991, leader: "Kavita Deshpande", hq: "Shantipur",
    ideology: "Centre-right, economic liberalism", popularity: 22,
    tagline: "Light the way to prosperity.",
    manifesto: [
      "Single-window clearance for small businesses within 15 days",
      "Industrial corridor connecting Rajgarh and Sagarpur",
      "Reduction of stamp duty for first-time home buyers",
      "Digital land records for all districts by 2028"
    ],
    candidates: ["Rakesh Agarwal", "Priya Venkatesh", "Mohan Lal Jatav", "Farida Sheikh", "Lakshman Munda"]
  },
  {
    id: "GEP", name: "Green Earth Party", symbol: "tree", symbolName: "Tree",
    color: "#2f7a3e", founded: 2009, leader: "Dr. Neha Iyer", hq: "Sagarpur",
    ideology: "Green politics, environmentalism", popularity: 9,
    tagline: "A liveable state for the next generation.",
    manifesto: [
      "40% of state electricity from renewable sources by 2030",
      "Protection of mangroves along the Sagar coastline",
      "Ban on single-use plastics in all municipal areas",
      "Urban tree cover target of 25% in every city"
    ],
    candidates: ["Arjun Bhatt", "Sneha Pillai", "Ravi Kumar Valmiki", "Clara Fernandes", "Sona Oraon"]
  },
  {
    id: "KMS", name: "Kisan Mazdoor Sangh", symbol: "wheat", symbolName: "Wheat Sheaf",
    color: "#a27a12", founded: 1984, leader: "Balwant Singh Rathore", hq: "Kisanpur",
    ideology: "Agrarianism, labour rights", popularity: 13,
    tagline: "Fair price for the farmer, fair wage for the worker.",
    manifesto: [
      "Legal guarantee of minimum support price for 23 crops",
      "Interest-free crop loans up to ₹3 lakh",
      "Minimum daily wage of ₹550 for agricultural labour",
      "Cold-storage unit in every block"
    ],
    candidates: ["Gurpreet Sandhu", "Ramesh Yadav", "Sunita Ahirwar", "Ibrahim Khan", "Mangal Tudu"]
  },
  {
    id: "BVM", name: "Bharat Vikas Morcha", symbol: "wheel", symbolName: "Wheel",
    color: "#1d4e89", founded: 1996, leader: "Prakash Narayan Joshi", hq: "Rajgarh",
    ideology: "Development-centric, regionalism", popularity: 12,
    tagline: "Roads, power and water — on time.",
    manifesto: [
      "All-weather road connectivity to every habitation above 250 people",
      "24-hour power supply in all district headquarters",
      "Piped drinking water to 100% of households",
      "New medical college in each of the three districts"
    ],
    candidates: ["Vikram Chauhan", "Deepa Nair", "Kailash Meghwal", "Thomas Varghese", "Rupa Gond"]
  },
  {
    id: "LCU", name: "Liberal Citizens Union", symbol: "book", symbolName: "Open Book",
    color: "#2b7a8c", founded: 2014, leader: "Aditya Sen", hq: "Shantipur",
    ideology: "Liberalism, good governance", popularity: 7,
    tagline: "Transparent government, accountable officials.",
    manifesto: [
      "Time-bound public service delivery with penalties for delay",
      "Live-streaming of all Legislative Assembly sessions",
      "Independent state anti-corruption ombudsman",
      "Smart classrooms in every government secondary school"
    ],
    candidates: ["Nikhil Banerjee", "Tara Menon", "Pooja Kori", "Samuel Rao", "Ajay Bhil"]
  },
  {
    id: "SJD", name: "Samata Janata Dal", symbol: "scales", symbolName: "Scales",
    color: "#8a2b2b", founded: 1989, leader: "Shobha Rani Paswan", hq: "Devnagar",
    ideology: "Social justice, egalitarianism", popularity: 8,
    tagline: "Equal opportunity is not a privilege.",
    manifesto: [
      "Expansion of residential schools for first-generation learners",
      "Monthly pension of ₹2,000 for widows and persons with disabilities",
      "Fast-track courts for crimes against women",
      "Land titles for landless families within three years"
    ],
    candidates: ["Ramvilas Prasad", "Shalini Gupta", "Dinesh Kumar Bairwa", "Ayesha Siddiqui", "Phulmani Marandi"]
  },
  {
    id: "YRP", name: "Yuva Rashtra Party", symbol: "star", symbolName: "Star",
    color: "#b23a6a", founded: 2019, leader: "Rohan Malhotra", hq: "Rajgarh",
    ideology: "Youth empowerment, technology", popularity: 6,
    tagline: "The future is ours to build.",
    manifesto: [
      "State start-up fund of ₹500 crore for founders under 35",
      "Free high-speed Wi-Fi in all public libraries and colleges",
      "Skill-certification centres with guaranteed apprenticeships",
      "Sports complex in every district within four years"
    ],
    candidates: ["Ishaan Kapoor", "Ritika Sharma", "Akash Jatav", "Zoya Ansari", "Karan Soren"]
  },
  {
    id: "CFP", name: "Coastal Federal Party", symbol: "anchor", symbolName: "Anchor",
    color: "#24577a", founded: 2003, leader: "Antony Pereira", hq: "Sagarpur",
    ideology: "Federalism, coastal welfare", popularity: 5,
    tagline: "A voice for the coast.",
    manifesto: [
      "Insurance for fishing boats and fishermen at zero premium",
      "Modern fishing harbour at Sagarpur with export facility",
      "Greater fiscal autonomy for district councils",
      "Cyclone shelters in every coastal panchayat"
    ],
    candidates: ["Francis Gomes", "Lata Shetty", "Babu Ram Koli", "Maria Lobo", "Jagan Majhi"]
  },
  {
    id: "JSP", name: "Jan Shakti Party", symbol: "mountain", symbolName: "Mountain",
    color: "#5b5f2a", founded: 2001, leader: "Uma Devi Negi", hq: "Kisanpur",
    ideology: "Tribal and hill-region rights", popularity: 6,
    tagline: "Our land, our forests, our future.",
    manifesto: [
      "Full implementation of forest rights for tribal communities",
      "Hill-area development authority with dedicated budget",
      "Mobile health units for remote habitations",
      "Education in mother tongue up to Class 5"
    ],
    candidates: ["Devendra Rawat", "Kamla Bisht", "Hiralal Bhuria", "Grace Lyngdoh", "Somra Kujur"]
  }
];

const NOTA = { id: "NOTA", name: "None of the Above", short: "NOTA", symbol: "nota", symbolName: "NOTA", color: "#555b63" };

function symbolSvg(key, size = 40, color = "currentColor") {
  return `<svg class="sym" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SYMBOLS[key] || ""}</svg>`;
}

function partyById(id) {
  if (id === "NOTA") return NOTA;
  return PARTIES.find(p => p.id === id);
}

function constituencyById(id) {
  return CONSTITUENCIES.find(c => c.id === id);
}

function candidateFor(partyId, constituencyId) {
  const p = PARTIES.find(x => x.id === partyId);
  const idx = CONSTITUENCIES.findIndex(c => c.id === constituencyId);
  return p && idx >= 0 ? p.candidates[idx] : "—";
}
