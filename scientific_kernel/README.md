# Aero-Kinetic Scientific Kernel

The **Scientific Kernel** is the Python-based reference implementation of the physics logic powering the Aero-Kinetic System. It serves as the "Ground Truth" for validating the frontend simulation.

## Core Modules

* `core.py`: Contains the `ViscosityAnalyzer` class and `ApparatusConfig`. Implements:
  * **Linearized Poiseuille Flow**: Deriving viscosity from pressure decay.
  * **Kinetic Theory**: Calculating molecular diameter from viscosity.
* `config.py`: Definitive source for physical constants ($R$, $N_A$, $k_B$) and experimental apparatus dimensions ($V$, $L$, $R_{cap}$).
* `main.py`: Interactive script for running single-gas simulations and generating verification plots.

## Usage

Run the main script to simulate a standard Nitrogen ($N_2$) experiment at 298.15 K:

```bash
python main.py
```

This will:

1. Generate synthetic pressure data with experimental noise.
2. Calculate viscosity and molecular diameter.
3. Output results to the console.
4. Generate a `viscosity_analysis.png` plot for visual verification.

## Extending

To add new gases, update the `GAS_PROPERTIES` dictionary in `core.py`. Ensure you have the correct standard Molar Mass and reference Viscosity values.
