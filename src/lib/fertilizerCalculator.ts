// Fertilizer Calculation Engine for AgriCare

export interface SoilData {
  N: number; // kg/ha available nitrogen
  P: number; // kg/ha available phosphorus  
  K: number; // kg/ha available potassium
  source: 'soil_report' | 'soil_image' | 'manual' | 'district_average';
}

export interface CropRequirements {
  N: number;
  P: number;
  K: number;
}

export interface FertilizerRecommendation {
  urea: { kgPerAcre: number; kgPerHectare: number };
  dap: { kgPerAcre: number; kgPerHectare: number };
  mop: { kgPerAcre: number; kgPerHectare: number };
  nutrientDeficit: { N: number; P: number; K: number };
  nutrientStatus: { N: 'Deficient' | 'Adequate' | 'Excess'; P: 'Deficient' | 'Adequate' | 'Excess'; K: 'Deficient' | 'Adequate' | 'Excess' };
  warnings: string[];
}

// Conversion constants
const UREA_N_CONTENT = 0.46; // 46% N in Urea
const DAP_P2O5_CONTENT = 0.46; // 46% P2O5 in DAP
const DAP_N_CONTENT = 0.18; // 18% N in DAP
const MOP_K2O_CONTENT = 0.60; // 60% K2O in MOP
const P_TO_P2O5 = 2.29; // P to P2O5 conversion factor
const K_TO_K2O = 1.21; // K to K2O conversion factor
const HECTARE_TO_ACRE = 2.471; // 1 hectare = 2.471 acres

export function calculateFertilizerRecommendation(
  soilData: SoilData,
  cropRequirements: CropRequirements,
  farmSizeAcres: number = 1
): FertilizerRecommendation {
  const warnings: string[] = [];
  
  // Calculate nutrient deficits (required - available)
  const nDeficit = Math.max(0, cropRequirements.N - soilData.N);
  const pDeficit = Math.max(0, cropRequirements.P - soilData.P);
  const kDeficit = Math.max(0, cropRequirements.K - soilData.K);
  
  // Determine nutrient status
  const getNutrientStatus = (available: number, required: number): 'Deficient' | 'Adequate' | 'Excess' => {
    const ratio = available / required;
    if (ratio < 0.8) return 'Deficient';
    if (ratio > 1.2) return 'Excess';
    return 'Adequate';
  };
  
  const nutrientStatus = {
    N: getNutrientStatus(soilData.N, cropRequirements.N),
    P: getNutrientStatus(soilData.P, cropRequirements.P),
    K: getNutrientStatus(soilData.K, cropRequirements.K),
  };
  
  // Check for excess nutrients and add warnings
  if (nutrientStatus.N === 'Excess') {
    warnings.push(`⚠️ Nitrogen level is high (${soilData.N} kg/ha). Reduce N fertilizer to prevent environmental damage.`);
  }
  if (nutrientStatus.P === 'Excess') {
    warnings.push(`⚠️ Phosphorus level is high (${soilData.P} kg/ha). Excess P can lead to water pollution.`);
  }
  if (nutrientStatus.K === 'Excess') {
    warnings.push(`⚠️ Potassium level is high (${soilData.K} kg/ha). Consider reducing K application.`);
  }
  
  // Calculate P2O5 and K2O requirements
  const p2o5Required = pDeficit * P_TO_P2O5;
  const k2oRequired = kDeficit * K_TO_K2O;
  
  // Calculate DAP first (provides both N and P)
  const dapKgPerHectare = p2o5Required / DAP_P2O5_CONTENT;
  const nFromDap = dapKgPerHectare * DAP_N_CONTENT;
  
  // Calculate remaining N needed after DAP
  const remainingNNeeded = Math.max(0, nDeficit - nFromDap);
  
  // Calculate Urea (for remaining N)
  const ureaKgPerHectare = remainingNNeeded / UREA_N_CONTENT;
  
  // Calculate MOP (for K)
  const mopKgPerHectare = k2oRequired / MOP_K2O_CONTENT;
  
  // Convert to per acre
  const ureaKgPerAcre = ureaKgPerHectare / HECTARE_TO_ACRE;
  const dapKgPerAcre = dapKgPerHectare / HECTARE_TO_ACRE;
  const mopKgPerAcre = mopKgPerHectare / HECTARE_TO_ACRE;
  
  return {
    urea: {
      kgPerAcre: Math.round(ureaKgPerAcre * 10) / 10,
      kgPerHectare: Math.round(ureaKgPerHectare * 10) / 10,
    },
    dap: {
      kgPerAcre: Math.round(dapKgPerAcre * 10) / 10,
      kgPerHectare: Math.round(dapKgPerHectare * 10) / 10,
    },
    mop: {
      kgPerAcre: Math.round(mopKgPerAcre * 10) / 10,
      kgPerHectare: Math.round(mopKgPerHectare * 10) / 10,
    },
    nutrientDeficit: {
      N: Math.round(nDeficit * 10) / 10,
      P: Math.round(pDeficit * 10) / 10,
      K: Math.round(kDeficit * 10) / 10,
    },
    nutrientStatus,
    warnings,
  };
}

// Yield prediction based on various factors
export interface YieldPredictionInput {
  crop: string;
  variety: string;
  soilData: SoilData;
  farmSizeAcres: number;
  irrigationType: string;
  sowingDate: string;
  district: string;
  previousCrop: string;
}

export interface YieldPrediction {
  predictedYieldQuintalPerAcre: number;
  confidencePercent: number;
  yieldRange: { min: number; max: number };
  scenarios: {
    nPlus10: number;
    pPlus10: number;
    balancedNPK: number;
  };
  economicAnalysis: {
    estimatedGain: number;
    additionalCost: number;
    profitDifference: number;
  };
}

export function predictYield(
  input: YieldPredictionInput,
  baseYieldRange: { min: number; max: number }
): YieldPrediction {
  let yieldMultiplier = 1.0;
  let confidence = 75;
  
  // Irrigation type impact
  const irrigationImpact: Record<string, number> = {
    'Drip Irrigation': 1.15,
    'Sprinkler': 1.12,
    'Canal Irrigation': 1.10,
    'Tube Well': 1.08,
    'Bore Well': 1.05,
    'Pond/Tank': 1.03,
    'Rainfed': 0.85,
  };
  yieldMultiplier *= irrigationImpact[input.irrigationType] || 1.0;
  
  // Soil nutrient impact
  const { N, P, K } = input.soilData;
  const nutrientScore = (N / 250 + P / 25 + K / 200) / 3;
  yieldMultiplier *= 0.7 + (nutrientScore * 0.4); // Range: 0.7 to 1.1
  
  // Sowing date impact (optimal vs late/early)
  const sowingMonth = new Date(input.sowingDate).getMonth();
  const optimalMonths = [5, 6, 10, 11]; // June, July, Nov, Dec for Odisha
  const sowingImpact = optimalMonths.includes(sowingMonth) ? 1.05 : 0.95;
  yieldMultiplier *= sowingImpact;
  
  // Previous crop impact (legume rotation benefit)
  const legumeCrops = ['Green Gram (Moong)', 'Black Gram (Urad)', 'Pigeon Pea (Arhar)', 'Groundnut'];
  if (legumeCrops.includes(input.previousCrop)) {
    yieldMultiplier *= 1.08; // 8% boost from nitrogen fixation
    confidence += 3;
  }
  
  // Calculate base yield
  const baseYield = (baseYieldRange.min + baseYieldRange.max) / 2;
  const predictedYield = baseYield * yieldMultiplier;
  
  // Calculate confidence based on data source
  if (input.soilData.source === 'soil_report') confidence += 10;
  else if (input.soilData.source === 'manual') confidence += 5;
  else if (input.soilData.source === 'district_average') confidence -= 5;
  
  confidence = Math.min(95, Math.max(50, confidence));
  
  // Calculate scenarios
  const nPlus10Yield = predictedYield * 1.08;
  const pPlus10Yield = predictedYield * 1.05;
  const balancedYield = predictedYield * 1.12;
  
  // Economic analysis (approximate values in INR)
  const pricePerQuintal = 2000; // Average price
  const fertilizerCostIncrease = 800; // Cost per acre for better fertilization
  const estimatedGain = (balancedYield - predictedYield) * pricePerQuintal;
  
  return {
    predictedYieldQuintalPerAcre: Math.round(predictedYield * 10) / 10,
    confidencePercent: Math.round(confidence),
    yieldRange: {
      min: Math.round(predictedYield * 0.85 * 10) / 10,
      max: Math.round(predictedYield * 1.15 * 10) / 10,
    },
    scenarios: {
      nPlus10: Math.round(nPlus10Yield * 10) / 10,
      pPlus10: Math.round(pPlus10Yield * 10) / 10,
      balancedNPK: Math.round(balancedYield * 10) / 10,
    },
    economicAnalysis: {
      estimatedGain: Math.round(estimatedGain),
      additionalCost: fertilizerCostIncrease,
      profitDifference: Math.round(estimatedGain - fertilizerCostIncrease),
    },
  };
}
