/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  primary: string;
  secondary: string;
  accent: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  tagline: string;
  logoUrl: string;
  brandColor: TBrandColor;
  institutionName: string;
  niabGoldPricePerGram: number;
  nisabSilverPricePerGram: number;
  zakatRate: number;
  haramCategories: string[];
  companyWebsite: string;
  supportEmail: string;
  showAzharStablecoin: boolean;
  defaultCurrency: string;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "AZHAR",
  tagline: "Shariah-Compliant Financial Intelligence for the Modern Islamic Economy",
  logoUrl: "FILL_LOGO_URL_HERE",
  brandColor: {
    primary: "#1A6B4A",
    secondary: "#C9A84C",
    accent: "#0F3D2A",
  },
  institutionName: "AZHAR Shariah Finance Platform",
  niabGoldPricePerGram: 95.0,      // fill it here — USD per gram of gold (approximate)
  nisabSilverPricePerGram: 0.85,   // fill it here — USD per gram of silver (approximate)
  zakatRate: 2.5,                  // fill it here — 2.5% is the standard Zakat rate
  haramCategories: [
    "Alcohol & Spirits",
    "Gambling / Maysir",
    "Conventional Weapons & Defence",
    "Pork & Non-Halal Food",
    "Tobacco Products",
    "Adult Entertainment",
    "Conventional Interest (Riba)",
    "Drugs & Narcotics",
  ],
  companyWebsite: "https://azhar.finance",
  supportEmail: "support@azhar.finance",
  showAzharStablecoin: true,       // fill it here
  defaultCurrency: "USD",          // must match enum options
};
