export const industryMap: Record<string, string> = {
  acceleratorsIncubators: "Accelerators/Incubators",
  agriculture: "Agriculture",
  consortiums: "Consortiums",
  edtech: "Edtech",
  foundations: "Foundations",
  healthcare: "Healthcare",
  legal: "Legal & Law Firms",
  manufacturing: "Manufacturing",
  nonProfits: "Non Profits",
  realEstate: "Real Estate",
  retailEcommerce: "Retail & Ecommerce",
  technology: "Technology",
  ventureCapital: "Venture Capital",
};

export function getIndustryDisplayName(value: string): string {
  return industryMap[value] || value;
}
