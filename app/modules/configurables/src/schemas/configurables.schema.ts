/* START: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */
export interface FieldSchemaType {
  fieldName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "color"
    | "url"
    | "enum"
    | "datetime"
    | "file"
    | "files";
  required?: boolean;
  label?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  fields?: FieldSchemaType[];
  item?: FieldSchemaType;
}
/* END: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */

export type ConfigurableSchemas = {
  formSchema: FieldSchemaType[];
};

export const configurableSchemas: ConfigurableSchemas = {
  formSchema: [
    {
      fieldName: "appName",
      type: "string",
      required: true,
      label: "App Name",
      minLength: 1,
      maxLength: 100,
    },
    {
      fieldName: "tagline",
      type: "string",
      required: false,
      label: "Tagline",
      maxLength: 200,
    },
    {
      fieldName: "logoUrl",
      type: "url",
      required: true,
      label: "Logo URL",
    },
    {
      fieldName: "brandColor",
      type: "object",
      required: true,
      label: "Brand Color",
      fields: [
        {
          fieldName: "primary",
          type: "color",
          required: true,
          label: "Primary (Emerald Green)",
        },
        {
          fieldName: "secondary",
          type: "color",
          required: true,
          label: "Secondary (Gold)",
        },
        {
          fieldName: "accent",
          type: "color",
          required: true,
          label: "Accent (Dark Emerald)",
        },
      ],
    },
    {
      fieldName: "institutionName",
      type: "string",
      required: false,
      label: "Institution Name",
      maxLength: 200,
    },
    {
      fieldName: "niabGoldPricePerGram",
      type: "number",
      required: false,
      label: "Nisab Gold Price Per Gram (USD)",
      min: 1,
    },
    {
      fieldName: "nisabSilverPricePerGram",
      type: "number",
      required: false,
      label: "Nisab Silver Price Per Gram (USD)",
      min: 1,
    },
    {
      fieldName: "zakatRate",
      type: "number",
      required: false,
      label: "Zakat Rate (%)",
      min: 0,
      max: 100,
    },
    {
      fieldName: "haramCategories",
      type: "array",
      required: false,
      label: "Haram Transaction Categories",
      item: { type: "string", required: true },
    },
    {
      fieldName: "companyWebsite",
      type: "url",
      required: false,
      label: "Company Website URL",
    },
    {
      fieldName: "supportEmail",
      type: "string",
      required: false,
      label: "Support Email",
    },
    {
      fieldName: "showAzharStablecoin",
      type: "boolean",
      required: false,
      label: "Show THE AZHAR Stablecoin Panel",
    },
    {
      fieldName: "defaultCurrency",
      type: "enum",
      required: false,
      label: "Default Currency",
      options: ["USD", "MYR", "SAR", "IDR", "GBP", "EUR"],
    },
  ],
};
