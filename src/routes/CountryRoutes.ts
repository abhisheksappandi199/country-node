import { Router } from "express";
import { fetchCountries, fetchCountryByCode, fetchCountryByRegion } from "../services/CountryService";

const router = Router();

router.get("/countries", async (req, res) => {
  try {
    const data = await fetchCountries();
    if (data) {
      res.json(data);
    } else {
      throw new Error('Invalid data');
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch countries" });
  }
});

router.get("/countries/search", async (req, res) => {
  try {
    const { name, capital, region, timezone } = req.query;
    const data = await fetchCountries();

    const nameQuery = name ? (name as string).toLowerCase() : "";
    const capitalQuery = capital ? (capital as string).toLowerCase() : "";
    const regionQuery = region ? (region as string).toLowerCase() : "";
    const timezoneQuery = timezone ? (timezone as string) : "";

    let countries = data.filter((country: any) => {
      return (
        (!nameQuery || (country.name && country.name.toLowerCase() == (nameQuery))) &&
        (!capitalQuery || (country.capital && country.capital?.toLowerCase() == (capitalQuery))) &&
        (!regionQuery || (country.region && country.region.toLowerCase() === regionQuery)) &&
        (!timezoneQuery || (country.timezones && country.timezones.toLowerCase() == timezoneQuery.toLowerCase()))
      );
    });

    if (countries.length === 0) {
      res.status(404).json({ error: "No countries found matching the criteria." });
    }

    if (countries) {
      res.json(countries);
    } else {
      throw new Error('Invalid data');
    }
  } catch (error) {
    console.error("Error fetching country data:", error);
    res.status(500).json({ error: "Failed to fetch filtered country data" });
  }
});

router.get("/countries/:code", async (req, res) => {
  try {
    const country = await fetchCountryByCode(req.params.code.toUpperCase());
    if (country) {
      res.json(country);
    } else {
      throw new Error('Invalid data');
    }
  } catch {
    res.status(404).json({ error: "Country not found" });
  }
});

router.get("/countries/region/:region", async (req, res) => {
  try {
    const country = await fetchCountryByRegion(req.params.region.toUpperCase());
    if (country) {
      res.json(country);
    } else {
      throw new Error('Invalid data');
    }
  } catch {
    res.status(404).json({ error: "Country not found" });
  }
});



export default router;
