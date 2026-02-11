# Aero-Kinetic Analytical System v1.3

**A comprehensive, interactive simulation platform for gas viscosity analysis using linearized Poiseuille flow.**

This project bridges the gap between theoretical physical chemistry and modern web-based data visualization. It features a robust Python simulation kernel capable of generating high-fidelity experimental data and a React-based "Mission Control" interface for real-time analysis, visualization, and reporting.

## Key Features (v1.3)

* **Dual-Core Architecture**:
  * **Scientific Kernel (Python)**: High-precision simulation of pressure decay experiments based on Poiseuille's Law.
  * **Interactive Interface (React + Vite)**: A "Mission Control" style dashboard for analyzing data, visualizing molecular properties, and generating lab reports.
* **Scientific Realism**:
  * **Sutherland's Law Integration**: Dynamic viscosity adjustment based on temperature ($200K - 400K$).
  * **Experimental Noise**: Simulated sensor fluctuations ($\pm 0.5\%$) for realistic data analysis.
  * **Molecular Visualization**: Physically accurate 3D representations of $N_2$, $CO_2$, and Noble Gases.
* **Production Capabilities**:
  * **Persistance Layer**: JSON export of full experimental runs for longitudinal study.
  * **Lab Report Engine**: Printer-friendly CSS for generating academic-standard reports directly from the browser.

## Project Structure

* **/interface**: The frontend application (React, Tailwind CSS, Recharts).
* **/scientific_kernel**: The backend logic (Python, NumPy, SciPy) for verifying physical constants and generating reference data.

## Quick Start

### Frontend (User Interface)

1. Navigate to the interface directory:

    ```bash
    cd interface
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

### Backend (Scientific Kernel)

1. Navigate to the kernel directory:

    ```bash
    cd scientific_kernel
    ```

2. Run the main simulation script:

    ```bash
    python main.py
    ```

## License

MIT License. See [LICENSE](LICENSE) for details.

---

**Developed for the Aero-Kinetic Project by Don.**
