# This script performs the "1/P vs t" regression and extracts the molecular diameter.
import numpy as np
from scipy.stats import linregress
from .config import PhysicalConstants, ApparatusConfig

class ViscosityAnalyzer:
    def __init__(self, gas_type, temp_k):
        self.gas_type = gas_type
        self.temp_k = temp_k
        self.apparatus = ApparatusConfig()

    def calculate_viscosity(self, time_s, pressure_pa):
        """
        Calculates viscosity using the slope of 1/P vs t graph.
        Theory: 1/P = 1/P_initial + (pi * r^4 / (16 * eta * L * V)) * t
        Slope m = (pi * r^4) / (16 * eta * L * V)
        => eta = (pi * r^4) / (16 * m * L * V)
        """
        # Convert P to 1/P
        inv_P = 1.0 / np.array(pressure_pa)
        
        # Linear regression: 1/P vs t
        slope, intercept, r_value, p_value, std_err = linregress(time_s, inv_P)
        r_squared = r_value**2

        # Calculate Viscosity (eta)
        # eta = (pi * r^4) / (16 * slope * L * V)
        numerator = np.pi * (self.apparatus.capillary_radius_m**4)
        denominator = 16 * slope * self.apparatus.capillary_length_m * self.apparatus.volume_bulb_m3
        
        viscosity = numerator / denominator
        return viscosity, r_squared

    def calculate_molecular_diameter(self, viscosity, molar_mass):
        """
        Calculates molecular diameter (d) using Kinetic Theory (Hard Sphere model).
        eta = (5/16) * sqrt( (M*R*T) / pi ) * (1 / (NA * d^2))
        
        => d^2 = (5/16 * sqrt(M*R*T/pi)) / (NA * eta)
        => d = sqrt(...)
        """
        # Constants
        R = PhysicalConstants.R
        NA = PhysicalConstants.NA
        T = self.temp_k
        M = molar_mass
        
        # Term 1: 5/16 * sqrt(M*R*T / pi)
        sqrt_term = np.sqrt((M * R * T) / np.pi)
        numerator = (5.0 / 16.0) * sqrt_term
        
        # Term 2: NA * eta
        denominator = NA * viscosity
        
        d_squared = numerator / denominator
        diameter = np.sqrt(d_squared)
        
        return diameter