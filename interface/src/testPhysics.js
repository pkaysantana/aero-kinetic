import { analyzeViscosity, calculateMolecularDiameter, CONSTANTS } from './physicsEngine.js';

// Simulation parameters matching Python script
const gasType = "N2";
const temp = 298.15;
const molarMass = 28.0134e-3; // kg/mol
const knownViscosity = 17.76e-6; // Pa.s

// Apparatus
const app = CONSTANTS.APPARATUS;
const expectedSlope = (Math.PI * Math.pow(app.R_CAP, 4)) / (16 * knownViscosity * app.L * app.V);

// Generate synthetic data
const timeS = [];
const pressurePa = [];
const steps = 20;
const maxTime = 300;

for (let i = 0; i < steps; i++) {
    const t = (i / (steps - 1)) * maxTime;
    timeS.push(t);

    // Perfect data (no noise for verification)
    const invP = (1 / 100000) + (expectedSlope * t);
    pressurePa.push(1.0 / invP);
}

// Run Analysis
console.log(`Analyzing ${gasType} flow data (JS Port)...`);
const result = analyzeViscosity(timeS, pressurePa);
const diameter = calculateMolecularDiameter(result.viscosity, molarMass, temp);

console.log(`Linear Fit R^2: ${result.rSquared.toFixed(5)}`);
console.log(`Calculated Viscosity: ${(result.viscosity * 1e6).toFixed(2)} µPa.s`);
console.log(`Reference Viscosity:  ${(knownViscosity * 1e6).toFixed(2)} µPa.s`);

// Error check
const error = Math.abs(result.viscosity - knownViscosity) / knownViscosity * 100;
console.log(`Error: ${error.toFixed(2)}%`);
console.log("------------------------------");
console.log(`Calculated Molecular Diameter: ${(diameter * 1e9).toFixed(3)} nm`);

if (error < 0.1) {
    console.log("VERIFICATION SUCCESSFUL");
} else {
    console.log("VERIFICATION FAILED");
    process.exit(1);
}
