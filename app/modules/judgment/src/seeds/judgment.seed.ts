import { createLogger } from "~/lib/logger";
import { JudgmentConfigModel } from "../models/config.model";
import { normalizeGeneratedConfigPayload, validateConfigPayload } from "../lib/judgment.utils";

const logger = createLogger("JudgmentSeed");

type SeedConfig = Record<string, any>;

const SEED_CONFIGS: SeedConfig[] = [
  {
    pluginId: "shariah_transaction_compliance_audit",
    name: "Shariah Transaction Compliance Audit",
    rules: `You are a Shariah compliance officer reviewing a financial transaction submission.
Evaluate the submitted evidence against AAOIFI Shariah Standards (SS-21 and related).
Check for the following violations:
1. Riba (Interest): Any form of interest income, conventional bond coupons, or usurious loans.
2. Maysir (Gambling): Speculative activity, casino revenues, gambling platform income.
3. Gharar (Uncertainty): Excessive speculation, derivatives with unclear outcomes.
4. Haram Products: Alcohol, pork, tobacco, adult entertainment, conventional weapons.
5. Non-Compliant Financing: Conventional insurance, non-Shariah banking products.
Rate the transaction as: Halal (fully compliant), Mashbooh (doubtful, requires review), or Haram (prohibited).
Provide a score from 0 (fully Haram) to 100 (fully Halal). Reference the relevant AAOIFI standard or fatwa.`,
    inputSchema: {
      type: "object",
      properties: {
        transactionId: {
          type: "string",
          title: "Transaction ID",
          description: "Unique identifier of the transaction being audited.",
        },
        transactionDescription: {
          type: "string",
          title: "Transaction Description",
          description: "Full description of the transaction including purpose and nature.",
        },
        counterparty: {
          type: "string",
          title: "Counterparty Name",
          description: "The counterparty or entity involved in the transaction.",
        },
        counterpartyBusiness: {
          type: "string",
          title: "Counterparty Business Activity",
          description: "Describe the primary business activities of the counterparty.",
        },
        amount: {
          type: "number",
          title: "Transaction Amount (USD)",
          description: "Transaction amount in USD or USD equivalent.",
        },
        transactionType: {
          type: "string",
          title: "Transaction Type",
          description: "E.g.: Trade financing, investment, dividend, loan repayment, equity purchase.",
        },
        evidenceText: {
          type: "string",
          title: "Supporting Evidence / Notes",
          description: "Any supporting information, contracts, or notes relevant to the Shariah compliance assessment.",
        },
        supportingDocument: {
          type: "string",
          title: "Supporting Document (optional)",
          description: "Upload a contract, invoice, or relevant document for review.",
          "x-ui": { widget: "file" },
        },
      },
      required: [
        "transactionId",
        "transactionDescription",
        "counterparty",
        "counterpartyBusiness",
        "amount",
        "transactionType",
        "evidenceText",
      ],
    },
    outputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        evidenceSubmissionId: { type: "string" },
        criterionId: { type: "string" },
        verdict: {
          type: "string",
          enum: ["pass", "partial", "fail", "risk", "ready", "not_ready"],
        },
        score: { type: "number", minimum: 0, maximum: 100 },
        confidence: { type: "number", minimum: 0, maximum: 1 },
        severity: {
          type: "string",
          enum: ["low", "medium", "high", "critical"],
        },
        reason: { type: "string" },
        fixSuggestion: { type: "string" },
        requiresHumanReview: { type: "boolean" },
        provider: { type: "string" },
        model: { type: "string" },
        resultData: {
          type: "object",
          properties: {
            shariahVerdict: {
              type: "string",
              enum: ["Halal", "Mashbooh", "Haram"],
            },
            violationTypes: {
              type: "array",
              items: { type: "string" },
            },
            fatwahReference: { type: "string" },
            complianceNotes: { type: "string" },
          },
        },
      },
      required: [
        "id",
        "evidenceSubmissionId",
        "criterionId",
        "verdict",
        "score",
        "confidence",
        "severity",
        "reason",
        "fixSuggestion",
        "requiresHumanReview",
      ],
    },
    criteria: [
      {
        id: "criterion_no_riba",
        category: "Riba Prohibition",
        name: "No Interest (Riba) Involved",
        passCriteria:
          "The transaction does not involve interest payments, conventional bond coupons, or any usurious income.",
        severity: "critical",
        weight: 30,
        autoFailIfMissing: false,
      },
      {
        id: "criterion_no_maysir",
        category: "Maysir Prohibition",
        name: "No Gambling / Speculation (Maysir)",
        passCriteria:
          "The transaction is not related to gambling, lottery, speculative derivatives, or casino operations.",
        severity: "critical",
        weight: 25,
        autoFailIfMissing: false,
      },
      {
        id: "criterion_halal_business",
        category: "Business Activity",
        name: "Halal Business Activity",
        passCriteria:
          "The counterparty's primary business is not in alcohol, pork, tobacco, adult entertainment, or conventional weapons.",
        severity: "high",
        weight: 25,
        autoFailIfMissing: true,
      },
      {
        id: "criterion_no_gharar",
        category: "Gharar Prohibition",
        name: "No Excessive Uncertainty (Gharar)",
        passCriteria:
          "The transaction terms are clear and do not contain excessive ambiguity or speculative elements.",
        severity: "medium",
        weight: 20,
        autoFailIfMissing: false,
      },
    ],
    variables: {
      labels: {
        unitLabel: "Branch",
        workerLabel: "Compliance Officer",
        managerLabel: "Shariah Board Member",
      },
      actions: {
        defaultTaskDueHours: 48,
      },
      dashboard: {
        title: "Shariah Transaction Compliance Dashboard",
        company: "AZHAR Finance Platform",
      },
    },
  },
  {
    pluginId: "halal_investment_due_diligence",
    name: "Halal Investment Due Diligence",
    rules: `You are a Shariah-certified investment analyst performing due diligence on an investment proposal.
Evaluate the submitted investment details against AAOIFI SS-21 (Shariah Standards for Equities).
Check the following criteria:
1. Revenue from Haram activities must be less than 5% of total revenue.
2. Total debt must be less than 33% of total assets.
3. Interest income and non-compliant income must be less than 33% of total income.
4. The company must not be in a prohibited sector (alcohol, gambling, pork, weapons, tobacco, adult entertainment, conventional banking).
5. If conditionally compliant, calculate the purification amount as a % of dividends.
Provide a compliance rating: Fully Compliant, Conditionally Compliant, or Non-Compliant.`,
    inputSchema: {
      type: "object",
      properties: {
        companyName: {
          type: "string",
          title: "Company / Fund Name",
          description: "Full legal name of the company or fund being screened.",
        },
        ticker: {
          type: "string",
          title: "Ticker / ISIN",
          description: "Stock ticker or ISIN identifier.",
        },
        sector: {
          type: "string",
          title: "Primary Business Sector",
          description: "The company's main industry or sector.",
        },
        revenueFromHaram: {
          type: "number",
          title: "Haram Revenue (%)",
          description: "Percentage of total revenue derived from Haram activities.",
        },
        debtToAssets: {
          type: "number",
          title: "Debt-to-Assets Ratio (%)",
          description: "Total debt as a percentage of total assets.",
        },
        interestIncome: {
          type: "number",
          title: "Interest Income (%)",
          description: "Interest and non-compliant income as % of total income.",
        },
        evidenceText: {
          type: "string",
          title: "Due Diligence Notes",
          description: "Additional information, analyst notes, or observations about this investment.",
        },
        annualReport: {
          type: "string",
          title: "Annual Report / Prospectus (optional)",
          description: "Upload the company annual report or fund prospectus for AI analysis.",
          "x-ui": { widget: "file" },
        },
      },
      required: [
        "companyName",
        "ticker",
        "sector",
        "revenueFromHaram",
        "debtToAssets",
        "interestIncome",
        "evidenceText",
      ],
    },
    outputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        evidenceSubmissionId: { type: "string" },
        criterionId: { type: "string" },
        verdict: {
          type: "string",
          enum: ["pass", "partial", "fail", "risk", "ready", "not_ready"],
        },
        score: { type: "number", minimum: 0, maximum: 100 },
        confidence: { type: "number", minimum: 0, maximum: 1 },
        severity: { type: "string", enum: ["low", "medium", "high", "critical"] },
        reason: { type: "string" },
        fixSuggestion: { type: "string" },
        requiresHumanReview: { type: "boolean" },
        provider: { type: "string" },
        model: { type: "string" },
        resultData: {
          type: "object",
          properties: {
            complianceRating: {
              type: "string",
              enum: ["Fully Compliant", "Conditionally Compliant", "Non-Compliant"],
            },
            purificationRate: { type: "number" },
            failedCriteria: { type: "array", items: { type: "string" } },
            aaoifiReference: { type: "string" },
          },
        },
      },
      required: [
        "id",
        "evidenceSubmissionId",
        "criterionId",
        "verdict",
        "score",
        "confidence",
        "severity",
        "reason",
        "fixSuggestion",
        "requiresHumanReview",
      ],
    },
    criteria: [
      {
        id: "criterion_haram_revenue",
        category: "Revenue Screening",
        name: "Haram Revenue < 5%",
        passCriteria:
          "Revenue from prohibited activities (alcohol, gambling, pork, weapons, etc.) is less than 5% of total revenue.",
        severity: "critical",
        weight: 40,
        autoFailIfMissing: true,
      },
      {
        id: "criterion_debt_ratio",
        category: "Financial Ratios",
        name: "Debt-to-Assets < 33%",
        passCriteria: "Total debt does not exceed 33% of total assets.",
        severity: "high",
        weight: 30,
        autoFailIfMissing: false,
      },
      {
        id: "criterion_interest_income",
        category: "Interest Screening",
        name: "Interest Income < 33%",
        passCriteria: "Interest and non-compliant income does not exceed 33% of total income.",
        severity: "high",
        weight: 30,
        autoFailIfMissing: false,
      },
    ],
    variables: {
      labels: {
        unitLabel: "Department",
        workerLabel: "Investment Analyst",
        managerLabel: "Shariah Investment Committee",
      },
      actions: {
        defaultTaskDueHours: 72,
      },
      dashboard: {
        title: "Halal Investment Due Diligence Dashboard",
        company: "AZHAR Finance Platform",
      },
    },
  },
];

export async function seedJudgmentConfigs() {
  let seededCount = 0;

  for (const config of SEED_CONFIGS) {
    const normalized = normalizeGeneratedConfigPayload(config);
    validateConfigPayload(normalized);

    await JudgmentConfigModel.findOneAndUpdate(
      { pluginId: normalized.pluginId },
      { $set: normalized },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    seededCount += 1;
    logger.info("Seeded judgment config", { pluginId: normalized.pluginId });
  }

  logger.info("Judgment config seeding completed", { seededCount });
}

export default seedJudgmentConfigs;
