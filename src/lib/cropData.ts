// Crop and Variety Data for Tamil Nadu Agriculture
export interface CropVariety {
  name: string;
  varieties: string[];
  idealNPK: { N: number; P: number; K: number };
  yieldRange: { min: number; max: number }; // quintal per acre
  growingDays: number;
  waterRequirement: 'Low' | 'Medium' | 'High';
}

export const crops: Record<string, CropVariety> = {
  Rice: {
    name: 'Rice',
    varieties: ['Swarna', 'MTU-1010', 'IR-36', 'Naveen', 'Lalat', 'Khandagiri', 'NDR-359', 'Ranjit'],
    idealNPK: { N: 120, P: 60, K: 60 },
    yieldRange: { min: 15, max: 25 },
    growingDays: 120,
    waterRequirement: 'High',
  },
  Maize: {
    name: 'Maize',
    varieties: ['HQPM-1', 'DHM-117', 'Ganga-11', 'Bio-9681', 'Kanchan', 'Vivek-165', 'African Tall'],
    idealNPK: { N: 150, P: 75, K: 50 },
    yieldRange: { min: 20, max: 35 },
    growingDays: 100,
    waterRequirement: 'Medium',
  },
  'Pigeon Pea (Arhar)': {
    name: 'Pigeon Pea (Arhar)',
    varieties: ['PUSA-9', 'ICPL-88039', 'ICPH-2671', 'T-21', 'Maruti', 'RTA-1', 'MALS-25'],
    idealNPK: { N: 25, P: 50, K: 25 },
    yieldRange: { min: 5, max: 10 },
    growingDays: 180,
    waterRequirement: 'Low',
  },
  'Green Gram (Moong)': {
    name: 'Green Gram (Moong)',
    varieties: ['Pusa-9531', 'TARM-1', 'IPM 02-3', 'Samrat', 'ML-131', 'Asha', 'Konkan Ghati-1'],
    idealNPK: { N: 20, P: 40, K: 20 },
    yieldRange: { min: 4, max: 8 },
    growingDays: 65,
    waterRequirement: 'Low',
  },
  'Black Gram (Urad)': {
    name: 'Black Gram (Urad)',
    varieties: ['TU-40', 'PU-19', 'Vamban-6', 'IPU-2', 'Pant U-19', 'KU-301', 'Trombay'],
    idealNPK: { N: 20, P: 40, K: 20 },
    yieldRange: { min: 4, max: 7 },
    growingDays: 70,
    waterRequirement: 'Low',
  },
  Groundnut: {
    name: 'Groundnut',
    varieties: ['K-6', 'TAG-24', 'ICGV 91114', 'JL-24', 'Girnar', 'TG-37A', 'GG-2'],
    idealNPK: { N: 25, P: 50, K: 45 },
    yieldRange: { min: 8, max: 15 },
    growingDays: 110,
    waterRequirement: 'Medium',
  },
  Sesame: {
    name: 'Sesame',
    varieties: ['Krishna', 'RT-346', 'TKG-22', 'Swetha', 'BSR-2', 'Samrat', 'K-6 (til)'],
    idealNPK: { N: 40, P: 20, K: 20 },
    yieldRange: { min: 3, max: 6 },
    growingDays: 90,
    waterRequirement: 'Low',
  },
  Ragi: {
    name: 'Ragi',
    varieties: ['GPU-28', 'VL-352', 'PR-202', 'CO-9', 'MR-1', 'Indaf-9', 'GPU-67'],
    idealNPK: { N: 60, P: 30, K: 30 },
    yieldRange: { min: 10, max: 18 },
    growingDays: 110,
    waterRequirement: 'Low',
  },
};

// Tamil Nadu Districts
export const tamilNaduDistricts = [
  'Ariyalur', 'Chengalpet', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul',
  'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanniyakumari', 'Karur', 'Krishnagiri',
  'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur',
  'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivagangai', 'Tenkasi',
  'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur',
  'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram',
  'Virudhunagar',
];

// District-wise average NPK values (kg/ha) - simulated data for Tamil Nadu
export const districtNPKAverages: Record<string, { N: number; P: number; K: number }> = {
  'Ariyalur': { N: 240, P: 18, K: 175 },
  'Chengalpet': { N: 255, P: 20, K: 185 },
  'Chennai': { N: 220, P: 15, K: 160 }, // Urban area
  'Coimbatore': { N: 275, P: 25, K: 205 }, // Rich soil
  'Cuddalore': { N: 260, P: 22, K: 195 },
  'Dharmapuri': { N: 230, P: 16, K: 170 },
  'Dindigul': { N: 245, P: 19, K: 180 },
  'Erode': { N: 280, P: 26, K: 210 }, // Turmeric belt
  'Kallakurichi': { N: 235, P: 17, K: 172 },
  'Kanchipuram': { N: 250, P: 21, K: 190 },
  'Kanniyakumari': { N: 290, P: 30, K: 220 }, // High rainfall
  'Karur': { N: 255, P: 18, K: 188 },
  'Krishnagiri': { N: 242, P: 16, K: 175 },
  'Madurai': { N: 265, P: 24, K: 198 },
  'Mayiladuthurai': { N: 270, P: 23, K: 200 }, // Delta
  'Nagapattinam': { N: 268, P: 24, K: 202 }, // Delta
  'Namakkal': { N: 248, P: 19, K: 182 },
  'Nilgiris': { N: 210, P: 14, K: 150 }, // Hilly
  'Perambalur': { N: 238, P: 17, K: 176 },
  'Pudukkottai': { N: 244, P: 18, K: 178 },
  'Ramanathapuram': { N: 195, P: 12, K: 145 }, // Dry
  'Ranipet': { N: 252, P: 20, K: 186 },
  'Salem': { N: 258, P: 21, K: 192 },
  'Sivagangai': { N: 225, P: 15, K: 165 },
  'Tenkasi': { N: 272, P: 25, K: 204 },
  'Thanjavur': { N: 285, P: 28, K: 215 }, // Delta - Rice bowl
  'Theni': { N: 268, P: 24, K: 200 },
  'Thoothukudi': { N: 215, P: 14, K: 155 },
  'Tiruchirappalli': { N: 278, P: 26, K: 208 }, // Kaveri banks
  'Tirunelveli': { N: 264, P: 23, K: 196 },
  'Tirupathur': { N: 246, P: 18, K: 184 },
  'Tiruppur': { N: 254, P: 19, K: 189 },
  'Tiruvallur': { N: 256, P: 21, K: 191 },
  'Tiruvannamalai': { N: 249, P: 19, K: 183 },
  'Tiruvarur': { N: 282, P: 27, K: 212 }, // Delta
  'Vellore': { N: 251, P: 20, K: 187 },
  'Viluppuram': { N: 247, P: 19, K: 180 },
  'Virudhunagar': { N: 228, P: 16, K: 168 },
};

// Irrigation types
export const irrigationTypes = [
  'Rainfed',
  'Canal Irrigation',
  'Tube Well',
  'Bore Well',
  'Drip Irrigation',
  'Sprinkler',
  'Pond/Tank',
];

// Soil types
export const soilTypes = [
  'Alluvial',
  'Red Soil',
  'Black Cotton',
  'Laterite',
  'Sandy Loam',
  'Clay Loam',
  'Mixed',
];

export const getCropVarieties = (cropName: string): string[] => {
  return crops[cropName]?.varieties || [];
};

export const getCropIdealNPK = (cropName: string) => {
  return crops[cropName]?.idealNPK || { N: 100, P: 50, K: 50 };
};

export const getDistrictNPK = (district: string) => {
  return districtNPKAverages[district] || { N: 240, P: 18, K: 175 };
};
