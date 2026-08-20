import { parsePhoneNumberWithError, isValidPhoneNumber } from "libphonenumber-js";

/**
 * Country metadata dictionary for localization, dialing codes, currencies, and exchange rates.
 * Exchange rates are relative to base currency USD (1.0 USD).
 */
export const COUNTRIES = [
    {
        code: "US",
        name: "United States",
        dialCode: "+1",
        currency: "USD",
        locale: "en-US",
        rate: 1.0,
        flag: "🇺🇸",
        defaultTimezone: "Pacific Time (PT) - UTC-8",
    },
    {
        code: "IN",
        name: "India",
        dialCode: "+91",
        currency: "INR",
        locale: "en-IN",
        rate: 83.5,
        flag: "🇮🇳",
        defaultTimezone: "India Standard Time (IST) - UTC+5:30",
    },
    {
        code: "GB",
        name: "United Kingdom",
        dialCode: "+44",
        currency: "GBP",
        locale: "en-GB",
        rate: 0.79,
        flag: "🇬🇧",
        defaultTimezone: "Greenwich Mean Time (GMT) - UTC+0",
    },
    {
        code: "DE",
        name: "Germany",
        dialCode: "+49",
        currency: "EUR",
        locale: "de-DE",
        rate: 0.92,
        flag: "🇩🇪",
        defaultTimezone: "Central European Time (CET) - UTC+1",
    },
    {
        code: "FR",
        name: "France",
        dialCode: "+33",
        currency: "EUR",
        locale: "fr-FR",
        rate: 0.92,
        flag: "🇫🇷",
        defaultTimezone: "Central European Time (CET) - UTC+1",
    },
    {
        code: "AU",
        name: "Australia",
        dialCode: "+61",
        currency: "AUD",
        locale: "en-AU",
        rate: 1.52,
        flag: "🇦🇺",
        defaultTimezone: "Australian Eastern Time (AEST) - UTC+10",
    },
    {
        code: "CA",
        name: "Canada",
        dialCode: "+1",
        currency: "CAD",
        locale: "en-CA",
        rate: 1.36,
        flag: "🇨🇦",
        defaultTimezone: "Eastern Time (ET) - UTC-5",
    },
    {
        code: "JP",
        name: "Japan",
        dialCode: "+81",
        currency: "JPY",
        locale: "ja-JP",
        rate: 155.0,
        flag: "🇯🇵",
        defaultTimezone: "Japan Standard Time (JST) - UTC+9",
    },
];

export const COUNTRY_MAP = COUNTRIES.reduce((acc, c) => {
    acc[c.code] = c;
    return acc;
}, {});

/**
 * Infers country code from explicit saved country, timezone string, or browser locale.
 */
export function detectUserCountry(savedCountry, savedTimezone) {
    // 1. Explicit saved country code or country name match
    if (savedCountry) {
        const upper = String(savedCountry).trim().toUpperCase();
        if (COUNTRY_MAP[upper]) return upper;

        const matchedByName = COUNTRIES.find(
            (c) => c.name.toUpperCase() === upper
        );
        if (matchedByName) return matchedByName.code;
    }

    // 2. Map saved timezone string to country
    if (savedTimezone) {
        const tz = String(savedTimezone).toUpperCase();
        if (tz.includes("IST") || tz.includes("INDIA")) return "IN";
        if (tz.includes("CET") || tz.includes("EUROPEAN")) return "DE";
        if (tz.includes("GMT") || tz.includes("GREENWICH") || tz.includes("UTC+0")) return "GB";
        if (tz.includes("AEST") || tz.includes("AUSTRALIAN")) return "AU";
        if (tz.includes("PT") || tz.includes("ET") || tz.includes("PACIFIC") || tz.includes("EASTERN")) return "US";
        if (tz.includes("JST") || tz.includes("JAPAN")) return "JP";
    }

    // 3. Fallback to Browser System Timezone
    try {
        const sysTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
        if (sysTz.startsWith("Asia/Kolkata") || sysTz.startsWith("Asia/Calcutta")) return "IN";
        if (sysTz.startsWith("Europe/London")) return "GB";
        if (sysTz.startsWith("Europe/Berlin") || sysTz.startsWith("Europe/Paris")) return "DE";
        if (sysTz.startsWith("America/")) return "US";
        if (sysTz.startsWith("Australia/")) return "AU";
        if (sysTz.startsWith("Asia/Tokyo")) return "JP";
    } catch {
        // ignore fallback errors
    }

    // 4. Default fallback
    return "US";
}

/**
 * Validates a phone number for the given country code using libphonenumber-js.
 */
export function validatePhoneNumber(phoneNumberStr, countryCode = "US") {
    if (!phoneNumberStr || !String(phoneNumberStr).trim()) {
        return {
            isValid: true, // Empty is allowed unless required
            e164Format: "",
            formattedNational: "",
            formattedInternational: "",
            error: null,
        };
    }

    const trimmed = String(phoneNumberStr).trim();
    const cData = COUNTRY_MAP[countryCode] || COUNTRY_MAP["US"];

    try {
        // If user already typed with '+', attempt global parse
        const parseInput = trimmed.startsWith("+")
            ? trimmed
            : `${cData.dialCode}${trimmed}`;

        const isVal = isValidPhoneNumber(parseInput, countryCode);
        if (!isVal) {
            return {
                isValid: false,
                e164Format: trimmed,
                formattedNational: trimmed,
                formattedInternational: trimmed,
                error: `Invalid phone number format for ${cData.name} (${cData.dialCode})`,
            };
        }

        const phoneNumber = parsePhoneNumberWithError(parseInput, countryCode);
        return {
            isValid: phoneNumber.isValid(),
            e164Format: phoneNumber.format("E.164"),
            formattedNational: phoneNumber.formatNational(),
            formattedInternational: phoneNumber.formatInternational(),
            error: phoneNumber.isValid()
                ? null
                : `Invalid phone number format for ${cData.name} (${cData.dialCode})`,
        };
    } catch (err) {
        return {
            isValid: false,
            e164Format: trimmed,
            formattedNational: trimmed,
            formattedInternational: trimmed,
            error: `Invalid phone number format for ${cData.name} (${cData.dialCode})`,
        };
    }
}

/**
 * Localizes subscription price according to country and locale using Intl.NumberFormat.
 */
export function formatSubscriptionPrice(priceTextOrNumber, countryCode = "US") {
    const cData = COUNTRY_MAP[countryCode] || COUNTRY_MAP["US"];
    let baseAmountUSD = 19.99;
    let period = "per month";

    if (typeof priceTextOrNumber === "number") {
        baseAmountUSD = priceTextOrNumber;
    } else if (typeof priceTextOrNumber === "string" && priceTextOrNumber.trim()) {
        const matches = priceTextOrNumber.match(/[\d.]+/);
        if (matches && matches[0]) {
            baseAmountUSD = parseFloat(matches[0]);
        }
        if (priceTextOrNumber.includes("per ")) {
            period = `per ${priceTextOrNumber.split("per ")[1].trim()}`;
        }
    }

    const convertedAmount = baseAmountUSD * cData.rate;

    const formatter = new Intl.NumberFormat(cData.locale, {
        style: "currency",
        currency: cData.currency,
        minimumFractionDigits: cData.currency === "JPY" ? 0 : 2,
        maximumFractionDigits: cData.currency === "JPY" ? 0 : 2,
    });

    const formattedPrice = formatter.format(convertedAmount);

    return {
        formattedPrice,
        priceAmount: formattedPrice,
        pricePeriod: period,
        currencyCode: cData.currency,
        countryName: cData.name,
    };
}
