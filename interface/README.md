# Aero-Kinetic Interface (Mission Control)

The **Aero-Kinetic Interface** is a high-fidelity React application designed to visualize and analyze gas viscosity experiments. It serves as the primary user interaction point for the Aero-Kinetic System.

## Features

* **Real-Time Dashboard**: Visualizes pressure decay ($1/P$ vs $t$) with instant updates.
* **Molecular Probe**: Displays effective collision diameters with scientifically accurate molecule rendering ($N_2$, $CO_2$, $Ar$, $He$).
* **Thermal Dynamics**: Interactive temperature slider ($200K - 400K$) implementing Sutherland's Law.
* **Data Management**:
  * **Editable Table**: Manual entry/correction of experimental data points.
  * **Export**: Download standardized JSON datasets for peer review.
  * **Report**: One-click generation of printer-friendly lab reports.

## Technology Stack

* **Framework**: React (Vite)
* **Styling**: Tailwind CSS v4.0 (Dark Mode Optimized)
* **Visualization**: Recharts (Data), Custom CSS/JSX (Molecules)
* **Icons**: Lucide React

## Setup & Usage

1. **Install**: `npm install`
2. **Run**: `npm run dev`
3. **Build**: `npm run build`

## Key Components

* `App.jsx`: Main verified dashboard controller. Handles state, simulation logic, and layout.
* `physicsEngine.js`: Frontend port of the Scientific Kernel. Contains `GAS_LIBRARY` and calculation logic (Poiseuille/Sutherland).
* `components/MolecularProbe.jsx`: specialized component for visualizing atomic spacing and structure.

## Version 1.3 Changelog

* Merged Real-Time editing with Simulation Kernel.
* Added Sutherland's Law for temperature-dependent calculations.
* Implemented "Print Mode" for academic reporting.
