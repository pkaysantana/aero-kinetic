# This file acts as a database for physical constants and apparatus dimensions
class PhysicalConstants:
    R = 8.31446261815324 # Ideal Gas Constant (J/(mol*K))
    NA = 6.02214076e23 # Avogadro's Number (1/mol)
    KB = 1.380649e-23 # Boltzmann Constant (J/K)

class ApparatusConfig:
    """
    Standard dimensions for the Nottingham Viscometer.
    These can be calibrated later.
    """
    def __init__(self):
        self.volume_bulb_m3 = 500e-6    # 500 mL converted to m^3
        self.capillary_length_m = 0.15  # 15 cm converted to m
        self.capillary_radius_m = 1.5e-4 # 0.15 mm converted to m (Critical dimension)

class GasProperties:
    """
    Reference data for validation.
    Viscosity in Pa.s at 298K.
    """
    REF_DATA = {
        "N2": {"molar_mass": 28.0134e-3, "viscosity_ref": 17.76e-6, "sutherland_C": 111},
        "Ar": {"molar_mass": 39.948e-3, "viscosity_ref": 22.61e-6, "sutherland_C": 144},
        "He": {"molar_mass": 4.0026e-3, "viscosity_ref": 19.85e-6, "sutherland_C": 79},
        "CO2": {"molar_mass": 44.01e-3, "viscosity_ref": 14.90e-6, "sutherland_C": 240},
    }