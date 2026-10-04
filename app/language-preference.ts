export type SiteLanguage = "traditional" | "simplified";

export function languageForCountry(country:unknown):SiteLanguage {
  return typeof country === "string" && country.toUpperCase() === "CN" ? "simplified" : "traditional";
}
