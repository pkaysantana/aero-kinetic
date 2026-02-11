// interface/src/physicsEngine.js
export const CONSTANTS = {
    R: 8.31446261815324,
    NA: 6.02214076e23,
    KB: 1.380649e-23,
    APPARATUS: {
        V: 500e-6,
        L: 0.15,
        R_CAP: 1.5e-4
    }
};

export const GAS_LIBRARY = {
    "N2": { name: "Nitrogen", mass: 28.0134e-3, color: "#22d3ee", viscosity_ref: 17.76e-6, sutherlandC: 111 },
    "Ar": { name: "Argon", mass: 39.948e-3, color: "#94a3b8", viscosity_ref: 22.61e-6, sutherlandC: 144 },
    "He": { name: "Helium", mass: 4.0026e-3, color: "#fbbf24", viscosity_ref: 19.85e-6, sutherlandC: 79 },
    "CO2": { name: "Carbon Dioxide", mass: 44.01e-3, color: "#f87171", viscosity_ref: 14.90e-6, sutherlandC: 240 }
};

export function analyzeViscosity(timeData, pressureData) {
    const n = timeData.length;
    const invP = pressureData.map(p => 1 / p);

    const sumX = timeData.reduce((a, b) => a + b, 0);
    const sumY = invP.reduce((a, b) => a + b, 0);
    const sumXY = timeData.reduce((prev, curr, i) => prev + curr * invP[i], 0);
    const sumX2 = timeData.reduce((prev, curr) => prev + curr * curr, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

    // R-Squared Calculation
    const meanY = sumY / n;
    const ssTot = invP.reduce((acc, y) => acc + Math.pow(y - meanY, 2), 0);
    // Fixed residual calculation: (y_i - (mx_i + c))^2
    const intercept = (sumY - slope * sumX) / n;
    const ssRes = invP.reduce((acc, y, i) => acc + Math.pow(y - (slope * timeData[i] + intercept), 2), 0);
    const rSquared = 1 - (ssRes / ssTot);

    const viscosity = (Math.PI * Math.pow(CONSTANTS.APPARATUS.R_CAP, 4)) /
        (16 * slope * CONSTANTS.APPARATUS.L * CONSTANTS.APPARATUS.V);

    return { viscosity, rSquared, slope };
}

export function calculateDiameter(viscosity, molarMass, T = 298.15) {
    const m_molecule = molarMass / CONSTANTS.NA;
    const term1 = 2 / (3 * Math.pow(Math.PI, 1.5));
    const term2 = Math.sqrt(m_molecule * CONSTANTS.KB * T) / viscosity;
    return Math.sqrt(term1 * term2);
}

// Wrapper for UI convenience (defaults to 298.15 K)
export const calculateMolecularDiameter = (viscosity, molarMass, T = 298.15) =>
    calculateDiameter(viscosity, molarMass, T);

// Export Utility
export function exportRunToJson(gasName, points, results, apparatus, temp) {
    const dataStr = JSON.stringify({
        timestamp: new Date().toISOString(),
        gas: gasName,
        temperature_K: temp,
        apparatus_constants: apparatus,
        raw_data: points,
        calculated_results: {
            viscosity_uPa_s: (results.viscosity * 1e6).toFixed(4),
            diameter_nm: results.diameterNm.toFixed(4),
            r_squared: results.rSquared
        }
    }, null, 2);

    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AeroKinetic_${gasName}_${Date.now()}.json`;
    link.click();
}
