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
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 
  'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram', 'Kanniyakumari', 'Karur', 
  'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 
  'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 
  'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 
  'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 
  'Viluppuram', 'Virudhunagar',
];

// District-wise average NPK values (kg/ha) - simulated data
export const districtNPKAverages: Record<string, { N: number; P: number; K: number }> = {
  'Ariyalur': { N: 210, P: 14, K: 160 },
  'Chengalpattu': { N: 255, P: 20, K: 185 },
  'Chennai': { N: 190, P: 12, K: 150 },
  'Coimbatore': { N: 245, P: 18, K: 175 },
  'Cuddalore': { N: 270, P: 24, K: 200 },
  'Dharmapuri': { N: 205, P: 13, K: 155 },
  'Dindigul': { N: 220, P: 15, K: 165 },
  'Erode': { N: 240, P: 17, K: 170 },
  'Kallakurichi': { N: 230, P: 16, K: 168 },
  'Kancheepuram': { N: 260, P: 21, K: 190 },
  'Kanniyakumari': { N: 215, P: 14, K: 162 },
  'Karur': { N: 225, P: 15, K: 165 },
  'Krishnagiri': { N: 208, P: 12, K: 152 },
  'Madurai': { N: 250, P: 19, K: 180 },
  'Mayiladuthurai': { N: 280, P: 26, K: 210 },
  'Nagapattinam': { N: 275, P: 25, K: 205 },
  'Namakkal': { N: 235, P: 16, K: 172 },
  'Nilgiris': { N: 195, P: 11, K: 145 },
  'Perambalur': { N: 212, P: 14, K: 158 },
  'Pudukkottai': { N: 228, P: 16, K: 168 },
  'Ramanathapuram': { N: 185, P: 10, K: 140 },
  'Ranipet': { N: 242, P: 18, K: 178 },
  'Salem': { N: 248, P: 19, K: 182 },
  'Sivaganga': { N: 210, P: 13, K: 155 },
  'Tenkasi': { N: 232, P: 16, K: 170 },
  'Thanjavur': { N: 285, P: 28, K: 215 },
  'Theni': { N: 238, P: 17, K: 175 },
  'Thoothukudi': { N: 200, P: 12, K: 148 },
  'Tiruchirappalli': { N: 265, P: 22, K: 195 },
  'Tirunelveli': { N: 245, P: 18, K: 180 },
  'Tirupathur': { N: 222, P: 15, K: 164 },
  'Tiruppur': { N: 236, P: 16, K: 172 },
  'Tiruvallur': { N: 258, P: 21, K: 188 },
  'Tiruvannamalai': { N: 240, P: 17, K: 176 },
  'Tiruvarur': { N: 282, P: 27, K: 212 },
  'Vellore': { N: 230, P: 16, K: 168 },
  'Viluppuram': { N: 252, P: 20, K: 185 },
  'Virudhunagar': { N: 218, P: 14, K: 160 },
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
