from dataclasses import dataclass
from urllib.parse import urlparse


@dataclass(frozen=True)
class SourceMetadata:
    country: str
    country_name: str
    flag: str
    display_name: str | None = None


SOURCE_METADATA: dict[str, SourceMetadata] = {
    # Your source entries go here.
}


SOURCE_METADATA: dict[str, SourceMetadata] = {
    # United Kingdom
    "bbc news": SourceMetadata(
        country="gb",
        country_name="United Kingdom",
        flag="🇬🇧",
        display_name="BBC News",
    ),
    "bbc": SourceMetadata(
        country="gb",
        country_name="United Kingdom",
        flag="🇬🇧",
        display_name="BBC",
    ),
    "the guardian": SourceMetadata(
        country="gb",
        country_name="United Kingdom",
        flag="🇬🇧",
    ),
    "sky news": SourceMetadata(
        country="gb",
        country_name="United Kingdom",
        flag="🇬🇧",
    ),
    "the independent": SourceMetadata(
        country="gb",
        country_name="United Kingdom",
        flag="🇬🇧",
    ),
    "financial times": SourceMetadata(
        country="gb",
        country_name="United Kingdom",
        flag="🇬🇧",
    ),
    "the telegraph": SourceMetadata(
        country="gb",
        country_name="United Kingdom",
        flag="🇬🇧",
    ),
    "metro.co.uk": SourceMetadata(
        country="gb",
        country_name="United Kingdom",
        flag="🇬🇧",
        display_name="Metro",
    ),

    # International
    "reuters": SourceMetadata(
        country="global",
        country_name="International",
        flag="🌍",
    ),
    "associated press": SourceMetadata(
        country="global",
        country_name="International",
        flag="🌍",
        display_name="Associated Press",
    ),
    "ap": SourceMetadata(
        country="global",
        country_name="International",
        flag="🌍",
        display_name="Associated Press",
    ),
    "al jazeera english": SourceMetadata(
        country="qa",
        country_name="Qatar",
        flag="🇶🇦",
        display_name="Al Jazeera",
    ),
    "al jazeera": SourceMetadata(
        country="qa",
        country_name="Qatar",
        flag="🇶🇦",
    ),
    "dw": SourceMetadata(
        country="de",
        country_name="Germany",
        flag="🇩🇪",
        display_name="Deutsche Welle",
    ),
    "deutsche welle": SourceMetadata(
        country="de",
        country_name="Germany",
        flag="🇩🇪",
    ),

    # United States
    "cnn": SourceMetadata(
        country="us",
        country_name="United States",
        flag="🇺🇸",
    ),
    "cnn international": SourceMetadata(
        country="us",
        country_name="United States",
        flag="🇺🇸",
    ),
    "the new york times": SourceMetadata(
        country="us",
        country_name="United States",
        flag="🇺🇸",
    ),
    "the washington post": SourceMetadata(
        country="us",
        country_name="United States",
        flag="🇺🇸",
    ),
    "bloomberg": SourceMetadata(
        country="us",
        country_name="United States",
        flag="🇺🇸",
    ),
    "forbes": SourceMetadata(
        country="us",
        country_name="United States",
        flag="🇺🇸",
    ),
    "cnbc": SourceMetadata(
        country="us",
        country_name="United States",
        flag="🇺🇸",
    ),
    "nbc news": SourceMetadata(
        country="us",
        country_name="United States",
        flag="🇺🇸",
    ),
    "abc news": SourceMetadata(
        country="us",
        country_name="United States",
        flag="🇺🇸",
    ),
    "cbs news": SourceMetadata(
        country="us",
        country_name="United States",
        flag="🇺🇸",
    ),
    "fox news": SourceMetadata(
        country="us",
        country_name="United States",
        flag="🇺🇸",
    ),
    "politico": SourceMetadata(
        country="us",
        country_name="United States",
        flag="🇺🇸",
    ),
    "axios": SourceMetadata(
        country="us",
        country_name="United States",
        flag="🇺🇸",
    ),
    "techcrunch": SourceMetadata(
        country="us",
        country_name="United States",
        flag="🇺🇸",
    ),
    "the verge": SourceMetadata(
        country="us",
        country_name="United States",
        flag="🇺🇸",
    ),
    "wired": SourceMetadata(
        country="us",
        country_name="United States",
        flag="🇺🇸",
    ),
    "ars technica": SourceMetadata(
        country="us",
        country_name="United States",
        flag="🇺🇸",
    ),

    # Canada
    "cbc news": SourceMetadata(
        country="ca",
        country_name="Canada",
        flag="🇨🇦",
    ),
    "global news": SourceMetadata(
        country="ca",
        country_name="Canada",
        flag="🇨🇦",
    ),
    "the globe and mail": SourceMetadata(
        country="ca",
        country_name="Canada",
        flag="🇨🇦",
    ),

    # Australia
    "abc news (au)": SourceMetadata(
        country="au",
        country_name="Australia",
        flag="🇦🇺",
        display_name="ABC Australia",
    ),
    "abc australia": SourceMetadata(
        country="au",
        country_name="Australia",
        flag="🇦🇺",
    ),
    "the sydney morning herald": SourceMetadata(
        country="au",
        country_name="Australia",
        flag="🇦🇺",
    ),

    # India
    "the times of india": SourceMetadata(
        country="in",
        country_name="India",
        flag="🇮🇳",
    ),
    "times of india": SourceMetadata(
        country="in",
        country_name="India",
        flag="🇮🇳",
    ),
    "india today": SourceMetadata(
        country="in",
        country_name="India",
        flag="🇮🇳",
    ),
    "the hindu": SourceMetadata(
        country="in",
        country_name="India",
        flag="🇮🇳",
    ),
    "hindustan times": SourceMetadata(
        country="in",
        country_name="India",
        flag="🇮🇳",
    ),
    "ndtv": SourceMetadata(
        country="in",
        country_name="India",
        flag="🇮🇳",
    ),

    # France
    "le monde": SourceMetadata(
        country="fr",
        country_name="France",
        flag="🇫🇷",
    ),
    "france 24": SourceMetadata(
        country="fr",
        country_name="France",
        flag="🇫🇷",
    ),

    # Germany
    "der spiegel": SourceMetadata(
        country="de",
        country_name="Germany",
        flag="🇩🇪",
    ),

    # Ireland
    "the irish times": SourceMetadata(
        country="ie",
        country_name="Ireland",
        flag="🇮🇪",
    ),

    # South Africa
    "news24": SourceMetadata(
        country="za",
        country_name="South Africa",
        flag="🇿🇦",
    ),

    # Nigeria
    "punch newspapers": SourceMetadata(
        country="ng",
        country_name="Nigeria",
        flag="🇳🇬",
        display_name="Punch",
    ),
    "premium times": SourceMetadata(
        country="ng",
        country_name="Nigeria",
        flag="🇳🇬",
    ),
    "the guardian nigeria": SourceMetadata(
        country="ng",
        country_name="Nigeria",
        flag="🇳🇬",
    ),

    # Ghana
    "ghanaweb": SourceMetadata(
        country="gh",
        country_name="Ghana",
        flag="🇬🇭",
    ),
    "myjoyonline": SourceMetadata(
        country="gh",
        country_name="Ghana",
        flag="🇬🇭",
        display_name="MyJoyOnline",
    ),
    "graphic online": SourceMetadata(
        country="gh",
        country_name="Ghana",
        flag="🇬🇭",
    ),

    # Japan
    "the japan times": SourceMetadata(
        country="jp",
        country_name="Japan",
        flag="🇯🇵",
    ),
    "nhk world-japan": SourceMetadata(
        country="jp",
        country_name="Japan",
        flag="🇯🇵",
    ),

    # Singapore
    "channel newsasia": SourceMetadata(
        country="sg",
        country_name="Singapore",
        flag="🇸🇬",
        display_name="CNA",
    ),
}


DOMAIN_METADATA: dict[str, SourceMetadata] = {
    "bbc.com": SourceMetadata("gb", "United Kingdom", "🇬🇧", "BBC"),
    "bbc.co.uk": SourceMetadata("gb", "United Kingdom", "🇬🇧", "BBC"),
    "theguardian.com": SourceMetadata("gb", "United Kingdom", "🇬🇧"),
    "independent.co.uk": SourceMetadata("gb", "United Kingdom", "🇬🇧"),
    "telegraph.co.uk": SourceMetadata("gb", "United Kingdom", "🇬🇧"),
    "ft.com": SourceMetadata("gb", "United Kingdom", "🇬🇧", "Financial Times"),

    "reuters.com": SourceMetadata("global", "International", "🌍"),
    "apnews.com": SourceMetadata("global", "International", "🌍", "Associated Press"),
    "aljazeera.com": SourceMetadata("qa", "Qatar", "🇶🇦", "Al Jazeera"),

    "cnn.com": SourceMetadata("us", "United States", "🇺🇸", "CNN"),
    "nytimes.com": SourceMetadata("us", "United States", "🇺🇸", "The New York Times"),
    "washingtonpost.com": SourceMetadata("us", "United States", "🇺🇸"),
    "bloomberg.com": SourceMetadata("us", "United States", "🇺🇸"),
    "forbes.com": SourceMetadata("us", "United States", "🇺🇸"),
    "cnbc.com": SourceMetadata("us", "United States", "🇺🇸"),
    "techcrunch.com": SourceMetadata("us", "United States", "🇺🇸"),
    "theverge.com": SourceMetadata("us", "United States", "🇺🇸"),
    "arstechnica.com": SourceMetadata("us", "United States", "🇺🇸"),

    "cbc.ca": SourceMetadata("ca", "Canada", "🇨🇦", "CBC"),
    "abc.net.au": SourceMetadata("au", "Australia", "🇦🇺", "ABC Australia"),

    "indiatoday.in": SourceMetadata("in", "India", "🇮🇳", "India Today"),
    "timesofindia.indiatimes.com": SourceMetadata("in", "India", "🇮🇳", "Times of India"),
    "thehindu.com": SourceMetadata("in", "India", "🇮🇳", "The Hindu"),

    "france24.com": SourceMetadata("fr", "France", "🇫🇷", "France 24"),
    "lemonde.fr": SourceMetadata("fr", "France", "🇫🇷", "Le Monde"),

    "ghanaweb.com": SourceMetadata("gh", "Ghana", "🇬🇭", "GhanaWeb"),
    "myjoyonline.com": SourceMetadata("gh", "Ghana", "🇬🇭", "MyJoyOnline"),

    "punchng.com": SourceMetadata("ng", "Nigeria", "🇳🇬", "Punch"),
    "premiumtimesng.com": SourceMetadata("ng", "Nigeria", "🇳🇬", "Premium Times"),
}


TLD_METADATA: dict[str, SourceMetadata] = {
    ".co.uk": SourceMetadata("gb", "United Kingdom", "🇬🇧"),
    ".uk": SourceMetadata("gb", "United Kingdom", "🇬🇧"),
    ".ca": SourceMetadata("ca", "Canada", "🇨🇦"),
    ".com.au": SourceMetadata("au", "Australia", "🇦🇺"),
    ".au": SourceMetadata("au", "Australia", "🇦🇺"),
    ".co.in": SourceMetadata("in", "India", "🇮🇳"),
    ".in": SourceMetadata("in", "India", "🇮🇳"),
    ".fr": SourceMetadata("fr", "France", "🇫🇷"),
    ".de": SourceMetadata("de", "Germany", "🇩🇪"),
    ".ie": SourceMetadata("ie", "Ireland", "🇮🇪"),
    ".co.za": SourceMetadata("za", "South Africa", "🇿🇦"),
    ".za": SourceMetadata("za", "South Africa", "🇿🇦"),
    ".com.ng": SourceMetadata("ng", "Nigeria", "🇳🇬"),
    ".ng": SourceMetadata("ng", "Nigeria", "🇳🇬"),
    ".com.gh": SourceMetadata("gh", "Ghana", "🇬🇭"),
    ".gh": SourceMetadata("gh", "Ghana", "🇬🇭"),
    ".co.jp": SourceMetadata("jp", "Japan", "🇯🇵"),
    ".jp": SourceMetadata("jp", "Japan", "🇯🇵"),
    ".sg": SourceMetadata("sg", "Singapore", "🇸🇬"),
    ".nz": SourceMetadata("nz", "New Zealand", "🇳🇿"),
}


DEFAULT_SOURCE_METADATA = SourceMetadata(
    country="global",
    country_name="International",
    flag="🌍",
)


def normalize_source_name(source_name: str | None) -> str:
    return (source_name or "").strip().lower()


def extract_domain(url: str | None) -> str:
    if not url:
        return ""

    hostname = urlparse(url).hostname or ""

    hostname = hostname.lower()

    hostname = hostname.removeprefix("www.")

    return hostname


def get_source_metadata(
    source_name: str | None,
    article_url: str | None,
) -> SourceMetadata:
    normalized_name = normalize_source_name(
        source_name
    )

    if normalized_name in SOURCE_METADATA:
        return SOURCE_METADATA[normalized_name]

    domain = extract_domain(article_url)

    if domain in DOMAIN_METADATA:
        return DOMAIN_METADATA[domain]

    for known_domain, metadata in DOMAIN_METADATA.items():
        if domain.endswith(f".{known_domain}"):
            return metadata

    for suffix, metadata in TLD_METADATA.items():
        if domain.endswith(suffix):
            return metadata

    return DEFAULT_SOURCE_METADATA