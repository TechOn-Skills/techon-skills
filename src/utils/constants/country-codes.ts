export const COUNTRY_CODES = {
    PAKISTAN: {
        code: "+92",
        name: "Pakistan",
        countryCode: "PK",
        flag: "🇵🇰",
    },
    INDIA: {
        code: "+91",
        name: "India",
        countryCode: "IN",
        flag: "🇮🇳",
    },
    UAE: {
        code: "+971",
        name: "United Arab Emirates",
        countryCode: "AE",
        flag: "🇦🇪",
    },
    KUWAIT: {
        code: "+965",
        name: "Kuwait",
        countryCode: "KW",
        flag: "🇰🇼",
    },
    QATAR: {
        code: "+974",
        name: "Qatar",
        countryCode: "QA",
        flag: "🇶🇦",
    },
    SAUDI_ARABIA: {
        code: "+966",
        name: "Saudi Arabia",
        countryCode: "SA",
        flag: "🇸🇦",
    },
    BAHRAIN: {
        code: "+973",
        name: "Bahrain",
        countryCode: "BH",
        flag: "🇧🇭",
    },
    OMAN: {
        code: "+968",
        name: "Oman",
        countryCode: "OM",
        flag: "🇴🇲",
    },
} as const

export type CountryCodeEntry = (typeof COUNTRY_CODES)[keyof typeof COUNTRY_CODES]

export const COUNTRY_CODES_LIST: CountryCodeEntry[] = Object.values(COUNTRY_CODES)