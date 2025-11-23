// Country name to flag emoji mapping
const COUNTRY_FLAGS = {
  "Afghanistan": "🇦🇫",
  "Albania": "🇦🇱",
  "Algeria": "🇩🇿",
  "Argentina": "🇦🇷",
  "Australia": "🇦🇺",
  "Austria": "🇦🇹",
  "Bangladesh": "🇧🇩",
  "Belgium": "🇧🇪",
  "Brazil": "🇧🇷",
  "Canada": "🇨🇦",
  "Chile": "🇨🇱",
  "China": "🇨🇳",
  "Colombia": "🇨🇴",
  "Czech Republic": "🇨🇿",
  "Denmark": "🇩🇰",
  "Egypt": "🇪🇬",
  "Europe": "🇪🇺",
  "Finland": "🇫🇮",
  "France": "🇫🇷",
  "Germany": "🇩🇪",
  "Greece": "🇬🇷",
  "Hong Kong": "🇭🇰",
  "Hungary": "🇭🇺",
  "India": "🇮🇳",
  "Indonesia": "🇮🇩",
  "Iran": "🇮🇷",
  "Iraq": "🇮🇶",
  "Ireland": "🇮🇪",
  "Israel": "🇮🇱",
  "Italy": "🇮🇹",
  "Japan": "🇯🇵",
  "Kenya": "🇰🇪",
  "Malaysia": "🇲🇾",
  "Mexico": "🇲🇽",
  "Netherlands": "🇳🇱",
  "New Zealand": "🇳🇿",
  "Nigeria": "🇳🇬",
  "Norway": "🇳🇴",
  "Pakistan": "🇵🇰",
  "Philippines": "🇵🇭",
  "Poland": "🇵🇱",
  "Portugal": "🇵🇹",
  "Romania": "🇷🇴",
  "Russia": "🇷🇺",
  "Saudi Arabia": "🇸🇦",
  "Singapore": "🇸🇬",
  "South Africa": "🇿🇦",
  "Korea": "🇰🇷",
  "South Korea": "🇰🇷",
  "Spain": "🇪🇸",
  "Sweden": "🇸🇪",
  "Switzerland": "🇨🇭",
  "Taiwan": "🇹🇼",
  "Thailand": "🇹🇭",
  "Turkey": "🇹🇷",
  "Ukraine": "🇺🇦",
  "United Arab Emirates": "🇦🇪",
  "United Kingdom": "🇬🇧",
  "United States": "🇺🇸",
  "Venezuela": "🇻🇪",
  "Vietnam": "🇻🇳"
};

// Extra aliases, alternative spellings, abbreviations, and local-language names
const COUNTRY_ALIASES = {
  // USA
  "usa": "United States",
  "u.s.": "United States",
  "u.s.a": "United States",
  "united states of america": "United States",
  "america": "United States",

  // UK
  "uk": "United Kingdom",
  "u.k.": "United Kingdom",
  "england": "United Kingdom",
  "scotland": "United Kingdom",
  "wales": "United Kingdom",

  // Germany
  "germany": "Germany",
  "deutschland": "Germany",

  // Austria
  "österreich": "Austria",

  // Spain
  "españa": "Spain",

  // Italy
  "italia": "Italy",

  // Brazil
  "brasil": "Brazil",

  // Russia
  "россия": "Russia",

  // Japan
  "日本": "Japan",

  // South Korea
  "republic of korea": "South Korea",
  "korea, republic of": "South Korea",

  // UAE
  "uae": "United Arab Emirates",
  "u.a.e": "United Arab Emirates",

  // Hong Kong
  "hong kong sar": "Hong Kong"
};

// Normalize: lowercase, remove punctuation, collapse spaces
function normalize(name) {
  return name
    .toLowerCase()
    .replace(/[.,']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getCountryFlag(countryName) {
  if (!countryName) return null;

  // Exact match first
  if (COUNTRY_FLAGS[countryName]) {
    return COUNTRY_FLAGS[countryName];
  }

  const norm = normalize(countryName);

  // Aliases (case-insensitive)
  if (COUNTRY_ALIASES[norm]) {
    const canonical = COUNTRY_ALIASES[norm];
    return COUNTRY_FLAGS[canonical] || null;
  }

  // Case-insensitive direct match
  for (const [country, flag] of Object.entries(COUNTRY_FLAGS)) {
    if (normalize(country) === norm) {
      return flag;
    }
  }

  return null;
}
