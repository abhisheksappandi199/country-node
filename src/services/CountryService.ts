import axios from "axios";
import cache from "../utils/cache";

const BASE_URL = "https://restcountries.com/v3.1";

export const fetchCountries = async () => {
    const cacheKey = "all_countries";
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    const response = await axios.get(`${BASE_URL}/all`);
    const data = response.data.map((country: any) => ({
        name: country.name.common,
        code: country.cca2,
        population: country.population,
        flag: country.flags?.png || country.flags?.svg,
        region: country.region,
        capital: country.capital?.[0] || "N/A",
        timezones: country.timezones?.[0],
        currencies: country.currencies
    }));

    cache.set(cacheKey, data);
    return data;
};

export const fetchCountryByCode = async (code: string) => {
    const cacheKey = `country_${code}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    try {
        const response = await axios.get(`${BASE_URL}/alpha/${code}`);
        const country = response.data[0];
        const countryData = {
            name: country.name.common,
            code: country.cca2,
            population: country.population,
            flag: country.flags?.png || country.flags?.svg,
            region: country.region,
            capital: country.capital?.[0] || "N/A",
            timezones: country.timezones?.[0],
            currencies: country.currencies
        };

        cache.set(cacheKey, countryData);
        return countryData;
    } catch {
        throw new Error("Country not found");
    }
};

export const fetchCountryByRegion = async (code: string) => {
    const cacheKey = `countries_region_${code}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    try {
        const response = await axios.get(`${BASE_URL}/region/${code}`);
        const countries = response.data.map((country: any) => ({
            name: country.name.common,
            code: country.cca2,
            population: country.population,
            flag: country.flags?.png || country.flags?.svg,
            region: country.region,
            capital: country.capital?.[0] || "N/A",
            timezones: country.timezones?.[0] || [],
            currencies: country.currencies || {}
        }));

        cache.set(cacheKey, countries);
        return countries;
    } catch {
        throw new Error("No countries found for this region");
    }
};

