# scientific_kernel/main.py

import numpy as np
import matplotlib.pyplot as plt
import sys
import os

# Ensure we can import from local directory if running from root or inside
from .core import ViscosityAnalyzer
from .config import GasProperties

def run_simulation():
    print("--- AERO-KINETIC: Scientific Kernel Initialization ---")
    
    # 1. Setup Dummy Experiment (Nitrogen at 298K)
    gas_type = "N2"
    temp = 298.15
    molar_mass = GasProperties.REF_DATA[gas_type]["molar_mass"]
    
    analyzer = ViscosityAnalyzer(gas_type, temp)
    
    # 2. Generate Synthetic Data (Simulating a lab run)
    # We create perfect data based on known viscosity, then add 'noise' (measurement error)
    known_viscosity = GasProperties.REF_DATA[gas_type]["viscosity_ref"]
    
    # Back-calculate expected slope
    app = analyzer.apparatus
    expected_slope = (np.pi * app.capillary_radius_m**4) / (16 * known_viscosity * app.capillary_length_m * app.volume_bulb_m3)
    
    time_s = np.linspace(0, 300, 20) # 0 to 5 minutes
    # 1/P = 1/Pi + slope*t  ->  P = 1 / (1/Pi + slope*t)
    P_initial = 100000 # Pa
    inv_P_theoretical = (1/P_initial) + (expected_slope * time_s)
    
    # Add 1% random noise to simulate real sensor data
    noise = np.random.normal(0, 0.01 * np.mean(inv_P_theoretical), len(time_s))
    inv_P_measured = inv_P_theoretical + noise
    P_measured = 1.0 / inv_P_measured

    # 3. Run analysis
    print(f"\nAnalyzing {gas_type} flow data...")
    calc_viscosity, r_squared = analyzer.calculate_viscosity(time_s, P_measured)
    
    calc_diameter = analyzer.calculate_molecular_diameter(calc_viscosity, molar_mass)
    
    # 4. Report
    print(f"Linear Fit R^2: {r_squared:.5f}")
    print(f"Calculated Viscosity: {calc_viscosity*1e6:.2f} µPa.s")
    print(f"Reference Viscosity:  {known_viscosity*1e6:.2f} µPa.s")
    print(f"Error: {abs(calc_viscosity - known_viscosity)/known_viscosity * 100:.2f}%")
    print("-" * 30)
    print(f"Calculated Molecular Diameter: {calc_diameter*1e9:.3f} nm")
    
    # Optional: Plot
    try:
        plt.plot(time_s, 1/P_measured, 'o', label='Experimental Data')
        plt.plot(time_s, inv_P_theoretical, '-', label='Theoretical Fit')
        plt.xlabel('Time (s)')
        plt.ylabel('1 / Pressure (1/Pa)')
        plt.title(f'Poiseuille Flow Analysis: {gas_type}')
        plt.legend()
        # plt.show()
        output_plot = 'viscosity_analysis.png'
        plt.savefig(output_plot)
        print(f"Plot saved to {output_plot}")
    except Exception as e:
        print(f"Plot generation failed: {e}")

if __name__ == "__main__":
    run_simulation()
