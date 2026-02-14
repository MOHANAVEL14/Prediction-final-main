// Crop and Variety Data for Odisha Agriculture
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

// Odisha Districts
export const odishaDistricts = [
  'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack',
  'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur',
  'Jharsuguda', 'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khordha',
  'Koraput', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada',
  'Puri', 'Rayagada', 'Sambalpur', 'Subarnapur', 'Sundargarh',
];

// District-wise average NPK values (kg/ha) - simulated data
export const districtNPKAverages: Record<string, { N: number; P: number; K: number }> = {
  'Angul': { N: 245, P: 18, K: 180 },
  'Balangir': { N: 220, P: 15, K: 165 },
  'Balasore': { N: 265, P: 22, K: 195 },
  'Bargarh': { N: 255, P: 20, K: 185 },
  'Bhadrak': { N: 270, P: 24, K: 200 },
  'Boudh': { N: 230, P: 16, K: 170 },
  'Cuttack': { N: 280, P: 26, K: 210 },
  'Deogarh': { N: 215, P: 14, K: 160 },
  'Dhenkanal': { N: 250, P: 19, K: 185 },
  'Gajapati': { N: 210, P: 13, K: 155 },
  'Ganjam': { N: 240, P: 17, K: 175 },
  'Jagatsinghpur': { N: 275, P: 25, K: 205 },
  'Jajpur': { N: 260, P: 21, K: 190 },
  'Jharsuguda': { N: 235, P: 16, K: 170 },
  'Kalahandi': { N: 225, P: 15, K: 165 },
  'Kandhamal': { N: 205, P: 12, K: 150 },
  'Kendrapara': { N: 278, P: 25, K: 208 },
  'Kendujhar': { N: 230, P: 16, K: 168 },
  'Khordha': { N: 285, P: 28, K: 215 },
  'Koraput': { N: 200, P: 11, K: 145 },
  'Malkangiri': { N: 195, P: 10, K: 140 },
  'Mayurbhanj': { N: 238, P: 17, K: 175 },
  'Nabarangpur': { N: 208, P: 12, K: 152 },
  'Nayagarh': { N: 248, P: 19, K: 182 },
  'Nuapada': { N: 218, P: 14, K: 162 },
  'Puri': { N: 272, P: 24, K: 202 },
  'Rayagada': { N: 202, P: 11, K: 148 },
  'Sambalpur': { N: 242, P: 18, K: 178 },
  'Subarnapur': { N: 228, P: 15, K: 168 },
  'Sundargarh': { N: 232, P: 16, K: 172 },
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
