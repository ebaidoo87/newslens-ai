CATEGORY_QUERIES: dict[str, str] = {
    "technology": (
        'technology OR artificial intelligence OR software '
        'OR cybersecurity OR smartphone OR computing'
    ),

    "business": (
        'business OR companies OR economy OR markets '
        'OR trade OR corporate'
    ),

    "sports": (
        'sports OR football OR soccer OR basketball '
        'OR tennis OR cricket OR Formula 1'
    ),

    "science": (
        'science OR research OR space OR climate '
        'OR astronomy OR discovery'
    ),

    "health": (
        'health OR medicine OR healthcare OR disease '
        'OR hospitals OR public health'
    ),

    "entertainment": (
        'entertainment OR film OR television OR music '
        'OR celebrities OR streaming'
    ),

    "general": (
        'world news OR international news OR global affairs '
        'OR breaking news'
    ),

    "food": (
        'food OR cooking OR cuisine OR restaurants '
        'OR recipes OR nutrition'
    ),

    "lifestyle": (
        'lifestyle OR travel OR fashion OR wellness '
        'OR relationships OR home'
    ),

    "money": (
        '"personal finance" OR investing OR savings '
        'OR banking OR mortgages OR "cost of living"'
    ),
}


ALLOWED_CATEGORIES = set(
    CATEGORY_QUERIES.keys()
)