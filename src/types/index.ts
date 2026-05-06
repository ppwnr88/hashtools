export type OutputFormat = "hexLower" | "hexUpper" | "base64";

export type AlgorithmCategory =
  | "Common Hash"
  | "SHA Family"
  | "SHA3 / Keccak"
  | "Checksum";

export type HashAlgorithm = {
  id: string;
  label: string;
  category: AlgorithmCategory;
  available: boolean;
  outputFormats: readonly OutputFormat[];
  description: string;
  bestFor: string;
  avoidFor: string;
  warning?: string;
};

export type HashResult = {
  algorithmId: string;
  algorithmLabel: string;
  hexLower?: string;
  hexUpper?: string;
  base64?: string;
};

export type HistoryItem = {
  id: string;
  tool: string;
  label: string;
  result: string;
  createdAt: string;
};

export type IdentifierGuess = {
  name: string;
  confidence: "High" | "Medium" | "Low";
  reason: string;
};
