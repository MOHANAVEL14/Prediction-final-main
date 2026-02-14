let soilNpkMap: Record<string, { N: number; P: number; K: number }> = {};

export const loadSoilNpk = async (url = '/data/soil_npk.json') => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch soil NPK JSON');
    const data = await res.json();
    soilNpkMap = data;
    console.info('Loaded soil NPK mapping', Object.keys(soilNpkMap));
    return soilNpkMap;
  } catch (err) {
    console.warn('Could not load soil NPK mapping;', err);
    // Fallback: small default map
    soilNpkMap = {
      Alluvial: { N: 240, P: 18, K: 175 },
      'Red Soil': { N: 200, P: 15, K: 160 },
      'Black Cotton': { N: 260, P: 22, K: 190 },
    };
    return soilNpkMap;
  }
};

export const getNPKValues = (soilType: string) => {
  if (!soilType) return { N: 0, P: 0, K: 0 };
  return soilNpkMap[soilType] || { N: 0, P: 0, K: 0 };
};

export const getSoilNpkMap = () => soilNpkMap;
