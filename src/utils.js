/**
 * Convert a country object from raw data into a workable
 * format for the area graph
 * @param {Object} countryObj - Row from the csv table
 * @returns {Object} - D3-readable data
 */
export function countryToGraphData(countryObj) {
  const percentiles = [];
  for (let i = 7; i <= 12; i += 1) {
    percentiles.push(parseFloat(countryObj[i]));
  }

  return {
    'Bottom 10%': (percentiles[0]).toFixed(2),
    '10-20%': (percentiles[1] - percentiles[0]).toFixed(2),
    '20-40%': (percentiles[2] - percentiles[1]).toFixed(2),
    '40-60%': (100 - percentiles[2] - percentiles[3]).toFixed(2),
    '60-80%': (percentiles[3] - percentiles[4]).toFixed(2),
    '80-90%': (percentiles[4] - percentiles[5]).toFixed(2),
    'Top 10%': (percentiles[5]).toFixed(2),
  };
}

// Sorting methods for country data
export const sortingMethods = {
  alpha: (a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  },
  gini: (a, b) => a.gini - b.gini,
};
