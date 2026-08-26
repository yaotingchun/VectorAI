"""
VectorAI - Synthetic Machine Manuals and Knowledge Generator
Generates:
1. Structured JSON Knowledge Files in data/machines/
2. High-Quality Technical PDF Manuals in manuals/ and public/manuals/
3. 100% Single-Source-of-Truth consistency across all parameters, thresholds, and RUL configs.
"""

import os
import json
import shutil
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

# Base output directories
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DATA_DIR = os.path.join(PROJECT_ROOT, "data", "machines")
MANUALS_DIR = os.path.join(PROJECT_ROOT, "manuals")
PUBLIC_MANUALS_DIR = os.path.join(PROJECT_ROOT, "public", "manuals")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(MANUALS_DIR, exist_ok=True)
os.makedirs(PUBLIC_MANUALS_DIR, exist_ok=True)

DISCLAIMER_TEXT = (
    "SYNTHETIC PROTOTYPE TECHNICAL MANUAL\n\n"
    "This document is artificially generated for the VectorAI demonstration and software development.\n\n"
    "The specifications, thresholds, service-life values, maintenance intervals, and operating parameters "
    "are synthetic and must not be used for real industrial equipment operation or maintenance."
)

# -------------------------------------------------------------------------
# MACHINE DEFINITIONS (SINGLE SOURCE OF TRUTH)
# -------------------------------------------------------------------------

MACHINES_DATA = [
    # ---------------------------------------------------------------------
    # 1. WAFER DICING MACHINE
    # ---------------------------------------------------------------------
    {
        "filename": "wafer-dicing-machine",
        "machine": {
            "name": "High-Precision Wafer Dicing Saw",
            "type": "wafer_dicing",
            "prototypeMachineId": "DIC-001",
            "manualId": "VAI-MAN-DIC-001",
            "version": "1.0",
            "generatedDate": "2026-08-26",
            "documentStatus": "Synthetic Prototype Technical Manual",
            "purpose": "VectorAI Demonstration and Development",
            "disclaimer": DISCLAIMER_TEXT,
            "processStage": "Wafer Prep & Dicing",
            "description": (
                "Precision dual-spindle wafer dicing system designed for cutting incoming 200mm/300mm "
                "semiconductor silicon, GaAs, and GaN wafers into individual micro-dies using high-speed "
                "diamond blade spindles operating up to 60,000 RPM with deionized coolant delivery."
            ),
            "manufacturingProcess": (
                "The dicing process utilizes resinoid/nickel-bond diamond blades mounted on high-frequency "
                "air-bearing spindles. Silicon wafers mounted on dicing tape are secured on a porous ceramic "
                "vacuum chuck table. High-pressure DI water jets cool the cutting zone, remove silicon swarf, "
                "and lubricate the blade kerf while optical cameras align scribe lanes with sub-micron precision."
            ),
            "subsystems": [
                "Air-Bearing High-Speed Spindle Assembly",
                "Porous Ceramic Vacuum Chuck & Work Stage",
                "DI Water Coolant Delivery & Jet Nozzle System",
                "High-Resolution Vision Alignment & Kerf Inspection Optical System",
                "Diamond Blade Flange & Auto-Contact Touch Sensor",
                "Dressing Board Mechanism for Blade Sharpening"
            ]
        },
        "components": [
            {
                "name": "Air-Bearing Spindle Assembly",
                "function": "Drives diamond cutting blade at rotational speeds from 30,000 to 60,000 RPM with minimal radial runout.",
                "importantParameters": "Spindle rotation speed (RPM), radial vibration (mm/s), motor winding current (A), bearing air pressure (MPa).",
                "degradationIndicators": "Increased high-frequency harmonic vibration (>0.8 mm/s), spindle bearing temperature rise, motor current spikes."
            },
            {
                "name": "Diamond Dicing Blade",
                "function": "Precision mechanical shearing and material removal along scribe lanes on silicon and compound semiconductor wafers.",
                "importantParameters": "Blade outer diameter (mm), diamond grit exposure, kerf width (µm), blade wear index (µm).",
                "degradationIndicators": "Increased cutting resistance, wafer backside chipping (>25 µm), kerf width widening, blade edge loading."
            },
            {
                "name": "Coolant Delivery System",
                "function": "Directs constant laminar DI water flow to blade kerf to dissipate cutting friction heat and flush silicon particulate.",
                "importantParameters": "Coolant temperature (°C), nozzle pressure (bar), volumetric flow rate (L/min), resistivity (MΩ·cm).",
                "degradationIndicators": "Nozzle pressure drop (<1.5 bar), coolant temperature rise (>28°C), nozzle orifice particulate fouling."
            },
            {
                "name": "Porous Ceramic Vacuum Chuck",
                "function": "Immobilizes wafer dicing tape carrier securely during high-velocity cutting passes.",
                "importantParameters": "Holding vacuum level (kPa), chuck table flatness (µm), surface temperature (°C).",
                "degradationIndicators": "Vacuum leakage (>-60 kPa), micro-vibration transfer, particulate clogging in ceramic pores."
            },
            {
                "name": "Vision Alignment Optical System",
                "function": "Performs dual-axis sub-pixel recognition of wafer alignment targets and post-cut kerf placement accuracy.",
                "importantParameters": "Illumination intensity (lux), focal distance (mm), pattern match confidence score (%).",
                "degradationIndicators": "Alignment search timeouts, optical lens dust contamination, LED strobe brightness decay."
            }
        ],
        "sensors": [
            {
                "sensorId": "vibration_spindle",
                "name": "Spindle Radial Vibration",
                "unit": "mm/s",
                "purpose": "Monitors mechanical vibration amplitude and air-bearing stability on the primary cutting spindle.",
                "minScale": 0.0,
                "maxScale": 2.0,
                "normalRange": [0.10, 0.50],
                "warningRange": [0.50, 0.80],
                "criticalRange": [0.80, 2.00],
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "temperature_coolant",
                "name": "DI Water Coolant Temp",
                "unit": "°C",
                "purpose": "Measures the temperature of DI water sprayed directly on the diamond blade and silicon interface.",
                "minScale": 10.0,
                "maxScale": 50.0,
                "normalRange": [18.0, 24.0],
                "warningRange": [24.0, 28.0],
                "criticalRange": [28.0, 50.0],
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "load_motor",
                "name": "Spindle Motor Load",
                "unit": "%",
                "purpose": "Monitors the percentage of electrical motor current capacity drawn by the high-torque cutting spindle.",
                "minScale": 0.0,
                "maxScale": 100.0,
                "normalRange": [30.0, 65.0],
                "warningRange": [65.0, 80.0],
                "criticalRange": [80.0, 100.0],
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "pressure_coolant",
                "name": "Coolant Nozzle Pressure",
                "unit": "bar",
                "purpose": "Monitors fluid pressure delivered to the dual-jet cutting nozzle manifold.",
                "minScale": 0.0,
                "maxScale": 5.0,
                "normalRange": [2.2, 3.5],
                "warningRange": [1.5, 2.2],
                "criticalRange": [0.0, 1.5],
                "direction": "LOWER_IS_WORSE"
            },
            {
                "sensorId": "blade_wear_index",
                "name": "Diamond Blade Wear Index",
                "unit": "µm",
                "purpose": "Calculates cumulative diamond matrix radius erosion relative to new blade baseline.",
                "minScale": 0.0,
                "maxScale": 50.0,
                "normalRange": [0.0, 15.0],
                "warningRange": [15.0, 30.0],
                "criticalRange": [30.0, 50.0],
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "chuck_vacuum",
                "name": "Work Chuck Vacuum",
                "unit": "kPa",
                "purpose": "Measures negative vacuum pressure securing the wafer substrate on the ceramic stage.",
                "minScale": -100.0,
                "maxScale": 0.0,
                "normalRange": [-90.0, -75.0],
                "warningRange": [-75.0, -60.0],
                "criticalRange": [-60.0, 0.0],
                "direction": "HIGHER_IS_WORSE"
            }
        ],
        "thresholds": [
            {
                "sensorId": "vibration_spindle",
                "sensorName": "Spindle Radial Vibration",
                "unit": "mm/s",
                "normal": {"min": 0.10, "max": 0.50, "description": "Nominal spindle dynamic balance and hydrodynamic air film."},
                "warning": {"min": 0.50, "max": 0.80, "description": "Early bearing air film instability or minor blade unbalance."},
                "critical": {"min": 0.80, "max": 2.00, "description": "Severe bearing wear or imminent air-bearing spindle crash."},
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "temperature_coolant",
                "sensorName": "DI Water Coolant Temp",
                "unit": "°C",
                "normal": {"min": 18.0, "max": 24.0, "description": "Optimal thermal stabilization for blade lubrication and wafer cooling."},
                "warning": {"min": 24.0, "max": 28.0, "description": "Heat exchanger thermal drift or partial chiller degradation."},
                "critical": {"min": 28.0, "max": 50.0, "description": "Severe thermal dissipation failure causing kerf thermal stress and micro-cracking."},
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "load_motor",
                "sensorName": "Spindle Motor Load",
                "unit": "%",
                "normal": {"min": 30.0, "max": 65.0, "description": "Standard cutting torque through silicon substrate."},
                "warning": {"min": 65.0, "max": 80.0, "description": "Diamond blade dulling or excessive feed rate resistance."},
                "critical": {"min": 80.0, "max": 100.0, "description": "Severe blade loading, spindle stalling risk, or blade breakage hazard."},
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "pressure_coolant",
                "sensorName": "Coolant Nozzle Pressure",
                "unit": "bar",
                "normal": {"min": 2.2, "max": 3.5, "description": "Adequate jet velocity to evacuate kerf swarf particles."},
                "warning": {"min": 1.5, "max": 2.2, "description": "Filter restriction or partial nozzle orifice clogging."},
                "critical": {"min": 0.0, "max": 1.5, "description": "Inadequate coolant supply causing immediate blade burning and wafer thermal shock."},
                "direction": "LOWER_IS_WORSE"
            },
            {
                "sensorId": "blade_wear_index",
                "sensorName": "Diamond Blade Wear Index",
                "unit": "µm",
                "normal": {"min": 0.0, "max": 15.0, "description": "Normal blade exposure and sharp diamond cutting facets."},
                "warning": {"min": 15.0, "max": 30.0, "description": "Substantial matrix wear requiring dressing cycle or replacement schedule."},
                "critical": {"min": 30.0, "max": 50.0, "description": "Blade end-of-life; risk of blade breakout, kerf drift, and die damage."},
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "chuck_vacuum",
                "sensorName": "Work Chuck Vacuum",
                "unit": "kPa",
                "normal": {"min": -90.0, "max": -75.0, "description": "Firm vacuum clamp holding wafer tape flat during cutting stroke."},
                "warning": {"min": -75.0, "max": -60.0, "description": "Minor seal leak or tape micro-lifting risk at wafer edges."},
                "critical": {"min": -60.0, "max": 0.0, "description": "Insufficient vacuum clamping resulting in wafer shift or die flying hazard."},
                "direction": "HIGHER_IS_WORSE"
            }
        ],
        "operatingConditions": {
            "ambientTemperature": "20.0 - 24.0 °C (Cleanroom ISO Class 5 / Class 100)",
            "relativeHumidity": "40% - 55% RH non-condensing",
            "normalOperatingTemperature": "20.0 - 25.0 °C",
            "normalOperatingPressure": "0.55 - 0.65 MPa (Clean Dry Air for Air Bearing)",
            "normalOperatingSpeed": "40,000 - 60,000 RPM",
            "normalCycleTime": "45 - 75 seconds per 300mm wafer (standard die pitch)",
            "normalOperatingHours": "20 - 24 hours/day continuous production",
            "recommendedOperatingConditions": "Spindle warm-up cycle for 15 minutes before first cut; DI water resistivity > 15 MΩ·cm.",
            "maximumContinuousOperation": "168 hours (7 days) before scheduled dressing and optical calibration"
        },
        "maintenance": [
            {
                "component": "Diamond Dicing Blade",
                "recommendedMaintenanceIntervalHours": 250,
                "expectedServiceLifeHours": 400,
                "maintenanceAction": "Inspect blade exposure, perform dressing board sharpening or install replacement blade with torque wrench calibration.",
                "procedureSummary": "Use optical microscope to inspect blade edge. Dress blade using GC-1200 dressing plate for 5 passes at 20 mm/s."
            },
            {
                "component": "Air-Bearing Spindle Flange",
                "recommendedMaintenanceIntervalHours": 1000,
                "expectedServiceLifeHours": 6000,
                "maintenanceAction": "Check spindle axial and radial runout with capacitive displacement probe; clean flange mating surface.",
                "procedureSummary": "Verify runout is < 0.5 µm. Inspect air bearing filtration unit and dew point."
            },
            {
                "component": "Coolant Delivery & Nozzle Manifold",
                "recommendedMaintenanceIntervalHours": 500,
                "expectedServiceLifeHours": 4000,
                "maintenanceAction": "Ultrasonic clean nozzle orifices, flush supply lines, and replace 0.2 µm DI water cartridge filter.",
                "procedureSummary": "Remove nozzle bar, sonicate in 5% citric acid for 15 min, rinse with DI water, verify spray fan pattern."
            },
            {
                "component": "Porous Ceramic Chuck Table",
                "recommendedMaintenanceIntervalHours": 750,
                "expectedServiceLifeHours": 8000,
                "maintenanceAction": "Perform chemical back-flush and ultrasonic surface wipe down to eliminate embedded silicon slurry.",
                "procedureSummary": "Apply isopropyl alcohol with lint-free cleanroom wipe, run back-purge vacuum cycle at +0.2 MPa."
            },
            {
                "component": "Vision Optical Lens & Camera",
                "recommendedMaintenanceIntervalHours": 350,
                "expectedServiceLifeHours": 10000,
                "maintenanceAction": "Clean front objective lens with optical solvent and execute sub-pixel reticle recalibration.",
                "procedureSummary": "Use standard calibration grid target; verify telecentric distortion is < 0.05%."
            }
        ],
        "degradationIndicators": [
            {
                "parameter": "Spindle Radial Vibration",
                "normalCondition": "Vibration amplitude between 0.10 and 0.50 mm/s with stable spectral baseline.",
                "degradedCondition": "Vibration levels drift into 0.50 - 0.80 mm/s due to diamond blade micro-chipping or bearing air film instability.",
                "criticalCondition": "Vibration exceeds 0.80 mm/s; mechanical imbalance causes severe wafer kerf damage.",
                "indicatorMechanism": "Indicates physical loss of diamond matrix uniformity, blade flange clamping looseness, or bearing air clearance degradation."
            },
            {
                "parameter": "Spindle Motor Load",
                "normalCondition": "Motor load steady between 30% and 65% during standard cutting feed.",
                "degradedCondition": "Motor load climbs to 65% - 80% as cutting resistance increases.",
                "criticalCondition": "Motor load exceeds 80%; spindle inverter experiences overcurrent and risks stall.",
                "indicatorMechanism": "Indicates diamond grit dulling/loading, where friction replaces clean shearing, transferring excess mechanical resistance to spindle motor."
            },
            {
                "parameter": "DI Water Coolant Temperature",
                "normalCondition": "Coolant temperature maintained strictly within 18.0 - 24.0 °C.",
                "degradedCondition": "Temperature climbs to 24.0 - 28.0 °C as heat exchanger efficiency declines.",
                "criticalCondition": "Coolant temperature exceeds 28.0 °C; silicon substrate suffers thermal expansion and stress micro-fractures.",
                "indicatorMechanism": "Indicates fouling of heat exchanger or chiller refrigeration loop decay, degrading heat transfer away from blade cutting zone."
            },
            {
                "parameter": "Coolant Nozzle Pressure",
                "normalCondition": "Continuous nozzle line pressure between 2.2 and 3.5 bar.",
                "degradedCondition": "Pressure drops to 1.5 - 2.2 bar due to upstream filter loading.",
                "criticalCondition": "Pressure drops below 1.5 bar; laminar cooling jet collapses into turbulent mist.",
                "indicatorMechanism": "Indicates particulate clogging in line filters or nozzle aperture buildup, starving the cutting interface of lubrication."
            },
            {
                "parameter": "Diamond Blade Wear Index",
                "normalCondition": "Radial blade wear below 15 µm.",
                "degradedCondition": "Blade wear between 15 and 30 µm; kerf profile begins widening.",
                "criticalCondition": "Blade wear exceeds 30 µm; blade diameter reduced to core substrate limit.",
                "indicatorMechanism": "Represents the direct physical attrition of synthetic diamond abrasive matrix through cumulative silicon cutting distance."
            }
        ],
        "rulModel": {
            "baseUsefulLifeHours": 6000,
            "formulaDescription": "Deterministic multi-parameter linear degradation model. Each parameter degradation is computed relative to healthy and critical limits, clamped [0, 1], weighted, and subtracted from Base Useful Life.",
            "weightsSum": 1.00,
            "parameters": [
                {
                    "parameter": "Spindle Vibration",
                    "sensorId": "vibration_spindle",
                    "sensorName": "Spindle Radial Vibration",
                    "unit": "mm/s",
                    "weight": 0.30,
                    "healthyLimit": 0.50,
                    "criticalLimit": 1.20,
                    "direction": "HIGHER_IS_WORSE"
                },
                {
                    "parameter": "Spindle Motor Load",
                    "sensorId": "load_motor",
                    "sensorName": "Spindle Motor Load",
                    "unit": "%",
                    "weight": 0.25,
                    "healthyLimit": 65.0,
                    "criticalLimit": 90.0,
                    "direction": "HIGHER_IS_WORSE"
                },
                {
                    "parameter": "Coolant Temperature",
                    "sensorId": "temperature_coolant",
                    "sensorName": "DI Water Coolant Temp",
                    "unit": "°C",
                    "weight": 0.15,
                    "healthyLimit": 24.0,
                    "criticalLimit": 35.0,
                    "direction": "HIGHER_IS_WORSE"
                },
                {
                    "parameter": "Coolant Pressure",
                    "sensorId": "pressure_coolant",
                    "sensorName": "Coolant Nozzle Pressure",
                    "unit": "bar",
                    "weight": 0.15,
                    "healthyLimit": 2.5,
                    "criticalLimit": 1.2,
                    "direction": "LOWER_IS_WORSE"
                },
                {
                    "parameter": "Blade Wear Index",
                    "sensorId": "blade_wear_index",
                    "sensorName": "Diamond Blade Wear Index",
                    "unit": "µm",
                    "weight": 0.15,
                    "healthyLimit": 15.0,
                    "criticalLimit": 35.0,
                    "direction": "HIGHER_IS_WORSE"
                }
            ]
        },
        "symptoms": [
            {
                "symptomId": "SYM-DIC-01",
                "symptom": "Spindle Radial Vibration Exceedance",
                "severity": "High",
                "relatedSensors": ["vibration_spindle", "load_motor"],
                "possibleCauses": [
                    "Diamond blade dynamic imbalance or flange clamping runout",
                    "Air-bearing air supply pressure fluctuation or moisture contamination",
                    "Spindle internal ceramic bearing race wear"
                ],
                "recommendedAction": "Halt dicing cycle, inspect blade flange torque (0.8 Nm), verify CDA dew point (-40°C), perform dynamic balance calibration."
            },
            {
                "symptomId": "SYM-DIC-02",
                "symptom": "Elevated Coolant Supply Temperature",
                "severity": "Medium",
                "relatedSensors": ["temperature_coolant"],
                "possibleCauses": [
                    "DI water chiller heat exchanger bio-fouling or sediment accumulation",
                    "Coolant circulation pump flow rate reduction",
                    "Chiller refrigerant leak or compressor duty overload"
                ],
                "recommendedAction": "Inspect chiller loop temperature, clean heat exchanger plates, verify 4.5 L/min minimum flow rate."
            },
            {
                "symptomId": "SYM-DIC-03",
                "symptom": "Spindle Motor High Load Surge During Cut",
                "severity": "High",
                "relatedSensors": ["load_motor", "blade_wear_index"],
                "possibleCauses": [
                    "Diamond blade glazing and lost abrasive grit exposure",
                    "Work table feed velocity exceeding blade cutting capacity",
                    "Insufficient DI water lubrication at cutting kerf"
                ],
                "recommendedAction": "Execute 5-pass dressing cycle on GC board, reduce feed rate by 15%, inspect coolant nozzle alignment."
            },
            {
                "symptomId": "SYM-DIC-04",
                "symptom": "Coolant Jet Pressure Drop Below Limit",
                "severity": "Critical",
                "relatedSensors": ["pressure_coolant", "temperature_coolant"],
                "possibleCauses": [
                    "Inline 0.2 µm DI water particulate filter clogged with silicon fines",
                    "Coolant delivery solenoid valve coil failure",
                    "Nozzle orifice blockage from crystallized mineral deposits"
                ],
                "recommendedAction": "Immediately replace filter cartridge, perform ultrasonic purge of nozzle manifold, confirm 2.8 bar baseline pressure."
            },
            {
                "symptomId": "SYM-DIC-05",
                "symptom": "Work Chuck Vacuum Pressure Degradation",
                "severity": "Critical",
                "relatedSensors": ["chuck_vacuum"],
                "possibleCauses": [
                    "Ceramic chuck surface micro-porosity contamination with slurry",
                    "Vacuum generator ejector venturi nozzle wear",
                    "Dicing tape puncture or bottom seal perimeter leak"
                ],
                "recommendedAction": "Perform chemical back-flush of chuck with IPA, inspect ejector vacuum generator, verify wafer frame tape seal tension."
            }
        ],
        "failureScenarios": [
            {
                "scenarioId": "SCEN-DIC-001",
                "symptom": "High-Frequency Harmonic Spindle Vibration",
                "sensorPattern": "vibration_spindle rises from 0.42 to 0.88 mm/s; load_motor stable at 48%",
                "possibleCauses": [
                    "Diamond blade edge micro-chipping",
                    "Spindle flange tightening screw relaxation",
                    "Spindle shaft air film thickness reduction"
                ],
                "severity": "high",
                "recommendedAction": "Retorque blade clamping flange to 0.8 Nm with calibrated torque wrench. If vibration persists, replace blade.",
                "verificationSteps": ["Run 10,000 RPM idle spin test", "Measure radial runout with capacitive sensor", "Execute dry run without wafer load"]
            },
            {
                "scenarioId": "SCEN-DIC-002",
                "symptom": "Diamond Blade Loading & Cutting Resistance Spike",
                "sensorPattern": "load_motor surges from 52% to 84%; blade_wear_index jumps to 28 µm",
                "possibleCauses": [
                    "Silicon swarf embedded in diamond matrix resinoid pores",
                    "Excessive feed velocity on thick wafer substrate",
                    "Improper coolant spray angle"
                ],
                "severity": "high",
                "recommendedAction": "Initiate automated blade dressing sequence on silicon carbide block for 8 strokes. Adjust nozzle angle to 45°.",
                "verificationSteps": ["Verify motor load returns to < 55% during test cut", "Inspect kerf edge for burrs under 50x magnification"]
            },
            {
                "scenarioId": "SCEN-DIC-003",
                "symptom": "Coolant Delivery Manifold Pressure Drop",
                "sensorPattern": "pressure_coolant drops from 2.8 bar to 1.3 bar; temperature_coolant rises by 4.2°C",
                "possibleCauses": [
                    "Main 0.2 µm DI filter differential pressure threshold exceeded",
                    "Coolant pump impeller cavitation",
                    "Nozzle feed line kink"
                ],
                "severity": "critical",
                "recommendedAction": "Replace primary and secondary coolant filter cartridges. Purge trapped air from manifold.",
                "verificationSteps": ["Check pressure gauge reads > 2.5 bar at full flow", "Inspect spray symmetry across dual nozzles"]
            },
            {
                "scenarioId": "SCEN-DIC-004",
                "symptom": "Wafer Micro-Shift During High-Speed X-Feed",
                "sensorPattern": "chuck_vacuum degrades from -82 kPa to -54 kPa",
                "possibleCauses": [
                    "Silicon slurry accumulation inside porous ceramic chuck channels",
                    "Vacuum solenoid valve seal leak",
                    "Improper wafer dicing tape lamination pressure"
                ],
                "severity": "critical",
                "recommendedAction": "Perform hot DI water and IPA reverse purge of ceramic chuck table. Test vacuum holding force.",
                "verificationSteps": ["Verify vacuum level drops to < -80 kPa with test frame", "Perform pull force gauge test (> 15 N)"]
            },
            {
                "scenarioId": "SCEN-DIC-005",
                "symptom": "Spindle Thermal Expansion and Z-Axis Kerf Depth Drift",
                "sensorPattern": "vibration_spindle at 0.65 mm/s; load_motor at 72%; coolant temp at 27.5°C",
                "possibleCauses": [
                    "Spindle internal chiller coolant jacket restriction",
                    "Continuous operation exceeding 12 hours without thermal stabilization",
                    "Room cleanroom ambient temperature fluctuation"
                ],
                "severity": "medium",
                "recommendedAction": "Recalibrate non-contact height sensor baseline. Clean spindle cooling jacket circuit.",
                "verificationSteps": ["Perform touch-sensor zero calibration", "Check kerf depth on test wafer (nominal ± 2 µm)"]
            },
            {
                "scenarioId": "SCEN-DIC-006",
                "symptom": "Excessive Wafer Backside Chipping on Die Corners",
                "sensorPattern": "blade_wear_index at 32 µm; vibration_spindle at 0.74 mm/s",
                "possibleCauses": [
                    "Diamond blade wear past nominal diamond matrix boundary",
                    "Blade kerf tapering due to side-face erosion",
                    "Dicing tape adhesion loss from coolant over-penetration"
                ],
                "severity": "high",
                "recommendedAction": "Replace diamond blade immediately. Inspect wafer backing tape UV cure parameters.",
                "verificationSteps": ["Measure backside chipping width on sample die (< 15 µm allowable)", "Confirm new blade zero reference"]
            },
            {
                "scenarioId": "SCEN-DIC-007",
                "symptom": "Spindle Inverter Harmonic Overcurrent Trip",
                "sensorPattern": "load_motor spikes to 96% instantaneously; vibration_spindle at 1.1 mm/s",
                "possibleCauses": [
                    "Blade jamming caused by silicon fragment wedged in blade cover",
                    "Spindle inverter IGBT phase imbalance",
                    "Spindle bearing air pressure dropped below interlock limit"
                ],
                "severity": "critical",
                "recommendedAction": "Emergency stop. Clear blade chamber of fragments. Inspect air supply regulator (min 0.55 MPa).",
                "verificationSteps": ["Manually spin spindle by hand with air on (must rotate freely)", "Reset inverter faults", "Perform slow ramp-up test"]
            },
            {
                "scenarioId": "SCEN-DIC-008",
                "symptom": "Coolant Chiller Loop Heat Saturation",
                "sensorPattern": "temperature_coolant drifts continuously up to 31.2°C; pressure_coolant stable",
                "possibleCauses": [
                    "External facility chilled water loop temperature elevated",
                    "Chiller condenser coil dust clogging",
                    "Refrigerant R134a undercharge"
                ],
                "severity": "high",
                "recommendedAction": "Notify facilities team to check primary loop. Clean chiller condenser filters. Verify temperature returns to 21°C.",
                "verificationSteps": ["Monitor temperature log over 30 min", "Verify stability at 22.0 ± 0.5°C"]
            },
            {
                "scenarioId": "SCEN-DIC-009",
                "symptom": "Vision Alignment Optical Target Misrecognition",
                "sensorPattern": "Cycle time increases by 25 seconds per wafer; sensor telemetry nominal",
                "possibleCauses": [
                    "Microscope front protective glass coated with dried silicon aerosol mist",
                    "Ring light LED intensity degradation",
                    "Wafer surface reflectivity change from new metal layer"
                ],
                "severity": "medium",
                "recommendedAction": "Clean microscope protective glass with optical tissue and lens cleaner. Run illumination auto-calibration.",
                "verificationSteps": ["Run vision recognition test on standard wafer pattern", "Confirm match score > 95%"]
            },
            {
                "scenarioId": "SCEN-DIC-010",
                "symptom": "Work Table Y-Axis Ball Screw Linear Pitch Error",
                "sensorPattern": "Kerf positioning offset increases linearly across wafer diameter (+8 µm)",
                "possibleCauses": [
                    "Y-axis precision linear guide lubrication starvation",
                    "Linear optical scale glass grating contamination",
                    "Ball screw pre-load spring fatigue"
                ],
                "severity": "high",
                "recommendedAction": "Apply cleanroom grease (Kluber Isoflex NBU 15) to linear guides. Clean optical scale reading head.",
                "verificationSteps": ["Execute laser interferometer positioning verification", "Verify repeatability < 1.0 µm"]
            },
            {
                "scenarioId": "SCEN-DIC-011",
                "symptom": "Blade Dressing Board Auto-Mechanism Jam",
                "sensorPattern": "load_motor at 68% during dressing cycle; dressing cycle timeout alert",
                "possibleCauses": [
                    "Dressing board mechanical feed stage lead screw bound by slurry",
                    "Dressing board material thickness exhausted",
                    "Pneumatic actuator cylinder seal sticking"
                ],
                "severity": "medium",
                "recommendedAction": "Replace dressing board plate. Clean and lubricate dressing stage pneumatic cylinder.",
                "verificationSteps": ["Run manual dress test", "Confirm touch sensor triggers at correct Z coordinate"]
            },
            {
                "scenarioId": "SCEN-DIC-012",
                "symptom": "Air-Bearing Clean Dry Air Dew Point Alert",
                "sensorPattern": "vibration_spindle exhibits micro-spikes (0.35 to 0.65 mm/s intermittently)",
                "possibleCauses": [
                    "Compressed air desiccant dryer saturation",
                    "Air filter oil coalescing element breakthrough",
                    "Main air line condensate buildup"
                ],
                "severity": "critical",
                "recommendedAction": "Immediately check air supply dew point sensor. Replace air filter sub-assembly before moisture ruins air bearings.",
                "verificationSteps": ["Verify CDA dew point is < -40°C", "Verify zero oil aerosol with particle counter"]
            },
            {
                "scenarioId": "SCEN-DIC-013",
                "symptom": "Blade Touchdown Sensor Sensitivity Drift",
                "sensorPattern": "Blade wear index calculation fluctuates erratically (± 10 µm between cuts)",
                "possibleCauses": [
                    "Electrical grounding contact resistance increase at workpiece chuck",
                    "Non-contact electrical discharge sensor probe oxidized",
                    "Substrate tape dielectric thickness variation"
                ],
                "severity": "medium",
                "recommendedAction": "Clean touchdown contact plate with scotch-brite pad and IPA. Calibrate electrical sensor threshold.",
                "verificationSteps": ["Execute 5 repeated touchdown tests", "Verify standard deviation < 1.0 µm"]
            }
        ]
    },

    # ---------------------------------------------------------------------
    # 2. DIE ATTACHER
    # ---------------------------------------------------------------------
    {
        "filename": "die-attacher",
        "machine": {
            "name": "Thermo-Compression Precision Die Attacher",
            "type": "die_attacher",
            "prototypeMachineId": "DA-001",
            "manualId": "VAI-MAN-DA-001",
            "version": "1.0",
            "generatedDate": "2026-08-26",
            "documentStatus": "Synthetic Prototype Technical Manual",
            "purpose": "VectorAI Demonstration and Development",
            "disclaimer": DISCLAIMER_TEXT,
            "processStage": "Die Attach & Bonding",
            "description": (
                "High-speed, ultra-precision die bonding system designed to pick singulated semiconductor dies "
                "from diced wafer film frames and place them onto leadframes, organic substrates, or ceramic carriers "
                "with sub-micron positional accuracy using epoxy dispensing or eutectic bonding."
            ),
            "manufacturingProcess": (
                "The die attach cycle begins with wafer expansion and bottom-up ejector pin actuation. A high-speed "
                "pick-and-place robotic bond head fitted with a vacuum collet lifts the die. An epoxy dispensing unit "
                "applies programmable dot or cross patterns onto the leadframe pad. The heated substrate indexer stage "
                "maintains precise temperature while the bond head applies controlled compression force to achieve uniform bond line thickness."
            ),
            "subsystems": [
                "High-Speed Voice-Coil Pick-and-Place Bond Arm",
                "Substrate Indexer & Heated Workholder Stage",
                "Precision Augered Epoxy Dispense Pump",
                "Wafer Ejector Pin & Expansion Table",
                "Dual Optical Look-Up/Look-Down Vision Alignment Cameras",
                "Collet Vacuum & Programmable Positive Purge Manifold"
            ]
        },
        "components": [
            {
                "name": "Pick-and-Place Bond Head Arm",
                "function": "Transfers dies from diced wafer carrier to leadframe with precise Z-axis touchdown force and X-Y-theta orientation.",
                "importantParameters": "Arm linear traverse vibration (mm/s), voice-coil current (A), positioning repeatability (µm).",
                "degradationIndicators": "Traverse vibration spikes (>0.7 mm/s), bond position drift, linear encoder jitter."
            },
            {
                "name": "Vacuum Collet / Pickup Tool",
                "function": "Secures delicate silicon die surface via suction during high acceleration (up to 10G) transit.",
                "importantParameters": "Collet vacuum pressure (kPa), tip wear/contamination, positive blow-off purge time (ms).",
                "degradationIndicators": "Vacuum leakage (>-55 kPa), die dropping, collet rubber tip deformation, silicone residue."
            },
            {
                "name": "Epoxy Dispense System",
                "function": "Applies micro-liter volumes of thermally or electrically conductive adhesive to target bond pads.",
                "importantParameters": "Dispense fluid pressure (bar), syringe temperature (°C), needle Z-gap (µm), dot volume repeatability.",
                "degradationIndicators": "Dispense pressure creep (>5.5 bar), epoxy tailing, dispensing void formation, needle partial clogging."
            },
            {
                "name": "Heated Substrate Indexer Stage",
                "function": "Heats leadframe/substrate to facilitate adhesive curing or eutectic bonding while indexing strip carriers.",
                "importantParameters": "Heater block temperature (°C), temperature uniformity across heater zone (± 2°C), clamp pressure.",
                "degradationIndicators": "Heater block temperature drift (>195°C), heater cartridge resistance imbalance, leadframe warping."
            },
            {
                "name": "Wafer Ejector Pin Assembly",
                "function": "Pushes up through dicing tape under target die to delaminate die backside from adhesive tape.",
                "importantParameters": "Ejector pin travel height (µm), ascent velocity (mm/s), pin tip radius of curvature.",
                "degradationIndicators": "Die cracking, tape piercing, ejector guide bushing play, pin tip deformation."
            }
        ],
        "sensors": [
            {
                "sensorId": "vibration_arm",
                "name": "Arm Vibration",
                "unit": "mm/s",
                "purpose": "Measures linear motor traverse vibration on the pick-and-place robotic arm during transfer strokes.",
                "minScale": 0.0,
                "maxScale": 2.0,
                "normalRange": [0.10, 0.40],
                "warningRange": [0.40, 0.70],
                "criticalRange": [0.70, 2.00],
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "pressure_vacuum",
                "name": "Collet Vacuum Pressure",
                "unit": "kPa",
                "purpose": "Measures negative vacuum pressure holding the silicon die securely on the pickup collet.",
                "minScale": -100.0,
                "maxScale": 0.0,
                "normalRange": [-85.0, -70.0],
                "warningRange": [-70.0, -55.0],
                "criticalRange": [-55.0, 0.0],
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "temperature_heater",
                "name": "Heater Block Temp",
                "unit": "°C",
                "purpose": "Measures operating temperature of the substrate preheat and curing stage.",
                "minScale": 50.0,
                "maxScale": 260.0,
                "normalRange": [140.0, 180.0],
                "warningRange": [180.0, 195.0],
                "criticalRange": [195.0, 260.0],
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "bond_force",
                "name": "Placement Bond Force",
                "unit": "N",
                "purpose": "Measures dynamic Z-axis compression force applied by bond head when pressing die into epoxy.",
                "minScale": 0.0,
                "maxScale": 15.0,
                "normalRange": [4.5, 6.5],
                "warningRange": [6.5, 8.0],
                "criticalRange": [8.0, 15.0],
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "dispense_pressure",
                "name": "Epoxy Dispense Pressure",
                "unit": "bar",
                "purpose": "Monitors pneumatic fluid pressure driving the epoxy adhesive dispensing syringe and valve.",
                "minScale": 0.0,
                "maxScale": 8.0,
                "normalRange": [3.5, 4.5],
                "warningRange": [4.5, 5.5],
                "criticalRange": [5.5, 8.0],
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "placement_offset",
                "name": "Placement Positional Offset",
                "unit": "µm",
                "purpose": "Measures post-placement X/Y spatial deviation relative to target pad centroid.",
                "minScale": 0.0,
                "maxScale": 25.0,
                "normalRange": [0.0, 5.0],
                "warningRange": [5.0, 10.0],
                "criticalRange": [10.0, 25.0],
                "direction": "HIGHER_IS_WORSE"
            }
        ],
        "thresholds": [
            {
                "sensorId": "vibration_arm",
                "sensorName": "Arm Vibration",
                "unit": "mm/s",
                "normal": {"min": 0.10, "max": 0.40, "description": "Smooth linear motion with well-damped voice-coil servo loop."},
                "warning": {"min": 0.40, "max": 0.70, "description": "Linear guide rail dry friction or slight servo gain oscillation."},
                "critical": {"min": 0.70, "max": 2.00, "description": "Severe mechanical guide binding or loose bond head mounting assembly."},
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "pressure_vacuum",
                "sensorName": "Collet Vacuum Pressure",
                "unit": "kPa",
                "normal": {"min": -85.0, "max": -70.0, "description": "Firm suction seal holding silicon die without slippage."},
                "warning": {"min": -70.0, "max": -55.0, "description": "Collet tip rubber wear, minor particulate leak, or tape residue on collet."},
                "critical": {"min": -55.0, "max": 0.0, "description": "Vacuum seal compromised; high probability of dropped die during transfer."},
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "temperature_heater",
                "sensorName": "Heater Block Temp",
                "unit": "°C",
                "normal": {"min": 140.0, "max": 180.0, "description": "Target curing and wetting temperature profile for silver epoxy."},
                "warning": {"min": 180.0, "max": 195.0, "description": "Thermal overshoot; risk of accelerated resin pre-curing on nozzle."},
                "critical": {"min": 195.0, "max": 260.0, "description": "Severe thermal runaway risking substrate oxidation and epoxy degradation."},
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "bond_force",
                "sensorName": "Placement Bond Force",
                "unit": "N",
                "normal": {"min": 4.5, "max": 6.5, "description": "Optimal compression for uniform adhesive bond line thickness (BLT)."},
                "warning": {"min": 6.5, "max": 8.0, "description": "Excessive force causing epoxy squeeze-out and potential die edge micro-cracking."},
                "critical": {"min": 8.0, "max": 15.0, "description": "Excessive compression force; high probability of silicon die fracture."},
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "dispense_pressure",
                "sensorName": "Epoxy Dispense Pressure",
                "unit": "bar",
                "normal": {"min": 3.5, "max": 4.5, "description": "Nominal fluid delivery through dispense needle."},
                "warning": {"min": 4.5, "max": 5.5, "description": "Epoxy viscosity increase due to pot-life expiration or partial needle clogging."},
                "critical": {"min": 5.5, "max": 8.0, "description": "Severe needle clogging or cured epoxy blockage in dispensing valve."},
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "placement_offset",
                "sensorName": "Placement Positional Offset",
                "unit": "µm",
                "normal": {"min": 0.0, "max": 5.0, "description": "Within high-yield precision placement envelope."},
                "warning": {"min": 5.0, "max": 10.0, "description": "Optical calibration drift or thermal expansion offset in staging."},
                "critical": {"min": 10.0, "max": 25.0, "description": "Gross misalignment risking bond pad shorts or wire bonding failure."},
                "direction": "HIGHER_IS_WORSE"
            }
        ],
        "operatingConditions": {
            "ambientTemperature": "21.0 - 23.0 °C (Cleanroom ISO Class 6)",
            "relativeHumidity": "40% - 50% RH non-condensing",
            "normalOperatingTemperature": "150.0 - 175.0 °C (Substrate Heater)",
            "normalOperatingPressure": "0.50 - 0.60 MPa (CDA pneumatic supply)",
            "normalOperatingSpeed": "4,500 - 8,000 Units Per Hour (UPH)",
            "normalCycleTime": "0.45 - 0.80 seconds per placed die",
            "normalOperatingHours": "20 - 24 hours/day continuous",
            "recommendedOperatingConditions": "Epoxy syringe must be thawed at room temperature for 60 min before loading; syringe pot-life < 8 hours.",
            "maximumContinuousOperation": "120 hours before required dispense calibration and collet replacement"
        },
        "maintenance": [
            {
                "component": "Pickup Collet & Vacuum Tip",
                "recommendedMaintenanceIntervalHours": 150,
                "expectedServiceLifeHours": 350,
                "maintenanceAction": "Inspect rubber/ceramic tip for wear, clean with alcohol swab, or install replacement collet.",
                "procedureSummary": "Use collet microscope gauge to verify zero tip chipping. Perform vacuum pull test on calibration die."
            },
            {
                "component": "Epoxy Dispensing Valve & Needle",
                "recommendedMaintenanceIntervalHours": 24,
                "expectedServiceLifeHours": 500,
                "maintenanceAction": "Flush fluidics, purge expired epoxy, clean needle tip or replace with new calibrated gauge needle.",
                "procedureSummary": "Purge 10 test dots onto calibration sheet. Measure dot diameter repeatability with vision system (target ± 5%)."
            },
            {
                "component": "Bond Head Linear Guide & Voice Coil",
                "recommendedMaintenanceIntervalHours": 600,
                "expectedServiceLifeHours": 5000,
                "maintenanceAction": "Clean linear rails, lubricate guide bearings with cleanroom synthetic grease, calibrate voice-coil response.",
                "procedureSummary": "Perform automated friction compensation test in diagnostic menu. Verify smooth Z-travel."
            },
            {
                "component": "Wafer Ejector Pin Block",
                "recommendedMaintenanceIntervalHours": 400,
                "expectedServiceLifeHours": 2500,
                "maintenanceAction": "Inspect pin sharpness under microscope, check pin height synchronization, replace bent pins.",
                "procedureSummary": "Verify all 4 pins extend to identical height within 5 µm using optical depth sensor."
            },
            {
                "component": "Substrate Heater Block & Thermocouples",
                "recommendedMaintenanceIntervalHours": 800,
                "expectedServiceLifeHours": 6000,
                "maintenanceAction": "Check thermocouple contact resistance, verify thermal profile uniformity across all indexing zones.",
                "procedureSummary": "Place multi-channel thermal logger on heater surface; verify temperature variance < ± 2°C across surface."
            }
        ],
        "degradationIndicators": [
            {
                "parameter": "Arm Traverse Vibration",
                "normalCondition": "Vibration amplitude between 0.10 and 0.40 mm/s during rapid pick-and-place motions.",
                "degradedCondition": "Vibration climbs into 0.40 - 0.70 mm/s due to linear guide bearing wear or servo damping loss.",
                "criticalCondition": "Vibration exceeds 0.70 mm/s; mechanical resonance causes die position jitter during placement.",
                "indicatorMechanism": "Indicates mechanical raceway pitting on linear slides or loosened mechanical fasteners on bond head carriage."
            },
            {
                "parameter": "Collet Vacuum Pressure",
                "normalCondition": "Vacuum seal maintains deep negative pressure between -85 and -70 kPa.",
                "degradedCondition": "Vacuum degrades into -70 to -55 kPa range as rubber tip hardens or collects silicone dust.",
                "criticalCondition": "Vacuum drops worse than -55 kPa; suction insufficient to hold die during high-acceleration travel.",
                "indicatorMechanism": "Indicates elastomer tip fatigue, particulate clogging in collet vacuum channel, or solenoid valve seal degradation."
            },
            {
                "parameter": "Heater Block Temperature",
                "normalCondition": "Stable temperature holding at 140 - 180 °C.",
                "degradedCondition": "Temperature drifts to 180 - 195 °C due to thermocouple contact oxidation or solid-state relay aging.",
                "criticalCondition": "Temperature exceeds 195 °C; high risk of epoxy premature skinning and substrate thermal stress.",
                "indicatorMechanism": "Reflects heating element degradation, loose thermocouple sensor mounting, or PID loop tuning deviation."
            },
            {
                "parameter": "Placement Bond Force",
                "normalCondition": "Compression force stable at 4.5 - 6.5 N.",
                "degradedCondition": "Force creeps into 6.5 - 8.0 N range as voice coil calibration drifts.",
                "criticalCondition": "Force exceeds 8.0 N; high risk of micro-fracturing delicate ultra-thin silicon dies.",
                "indicatorMechanism": "Indicates load cell amplifier drift, voice coil magnet thermal demagnetization, or mechanical guide binding."
            },
            {
                "parameter": "Epoxy Dispense Pressure",
                "normalCondition": "Fluid delivery pressure steady at 3.5 - 4.5 bar.",
                "degradedCondition": "Pressure climbs into 4.5 - 5.5 bar to push increasingly viscous epoxy.",
                "criticalCondition": "Pressure exceeds 5.5 bar; fluidics nearing complete blockage.",
                "indicatorMechanism": "Direct indicator of epoxy polymerization in the fluid line or partial dried resin clogging the dispense nozzle orifice."
            }
        ],
        "rulModel": {
            "baseUsefulLifeHours": 5000,
            "formulaDescription": "Deterministic multi-parameter linear degradation model for Die Attacher. Weights sum to 1.00.",
            "weightsSum": 1.00,
            "parameters": [
                {
                    "parameter": "Arm Vibration",
                    "sensorId": "vibration_arm",
                    "sensorName": "Arm Vibration",
                    "unit": "mm/s",
                    "weight": 0.25,
                    "healthyLimit": 0.40,
                    "criticalLimit": 1.00,
                    "direction": "HIGHER_IS_WORSE"
                },
                {
                    "parameter": "Collet Vacuum",
                    "sensorId": "pressure_vacuum",
                    "sensorName": "Collet Vacuum Pressure",
                    "unit": "kPa",
                    "weight": 0.25,
                    "healthyLimit": -70.0,
                    "criticalLimit": -45.0,
                    "direction": "HIGHER_IS_WORSE"
                },
                {
                    "parameter": "Heater Temperature",
                    "sensorId": "temperature_heater",
                    "sensorName": "Heater Block Temp",
                    "unit": "°C",
                    "weight": 0.20,
                    "healthyLimit": 180.0,
                    "criticalLimit": 215.0,
                    "direction": "HIGHER_IS_WORSE"
                },
                {
                    "parameter": "Placement Bond Force",
                    "sensorId": "bond_force",
                    "sensorName": "Placement Bond Force",
                    "unit": "N",
                    "weight": 0.15,
                    "healthyLimit": 6.5,
                    "criticalLimit": 9.0,
                    "direction": "HIGHER_IS_WORSE"
                },
                {
                    "parameter": "Dispense Pressure",
                    "sensorId": "dispense_pressure",
                    "sensorName": "Epoxy Dispense Pressure",
                    "unit": "bar",
                    "weight": 0.15,
                    "healthyLimit": 4.5,
                    "criticalLimit": 6.0,
                    "direction": "HIGHER_IS_WORSE"
                }
            ]
        },
        "symptoms": [
            {
                "symptomId": "SYM-DA-01",
                "symptom": "Collet Vacuum Drop / Die Dropping During Transfer",
                "severity": "Critical",
                "relatedSensors": ["pressure_vacuum"],
                "possibleCauses": [
                    "Pickup collet elastomer tip abrasion or tearing",
                    "Silicone/epoxy particulate accumulation inside collet vacuum lumen",
                    "Vacuum solenoid valve seat leakage"
                ],
                "recommendedAction": "Replace pickup collet, clean vacuum filter line, verify holding vacuum reaches -80 kPa on calibration die."
            },
            {
                "symptomId": "SYM-DA-02",
                "symptom": "Epoxy Dispensing Volume Shortage / Dot Tail-Off",
                "severity": "High",
                "relatedSensors": ["dispense_pressure"],
                "possibleCauses": [
                    "Epoxy exceeding pot-life shelf time and undergoing room-temperature crosslinking",
                    "Partial curing of adhesive inside dispense needle cannula",
                    "Pneumatic pressure regulator valve diaphragm failure"
                ],
                "recommendedAction": "Purge fluidics, replace dispense needle, thaw and install fresh epoxy syringe."
            },
            {
                "symptomId": "SYM-DA-03",
                "symptom": "Pick-and-Place Bond Head Linear Traverse Jitter",
                "severity": "Medium",
                "relatedSensors": ["vibration_arm", "placement_offset"],
                "possibleCauses": [
                    "Voice-coil linear motor magnetic track debris contamination",
                    "Linear guide rail dry friction due to grease degradation",
                    "Servo amplifier velocity feed-forward gain mistuning"
                ],
                "recommendedAction": "Clean linear motor magnetic track, apply cleanroom grease to rails, re-run auto-tuning routine."
            },
            {
                "symptomId": "SYM-DA-04",
                "symptom": "Substrate Stage Over-Temperature Condition",
                "severity": "High",
                "relatedSensors": ["temperature_heater"],
                "possibleCauses": [
                    "Thermocouple probe mechanical contact separation from heater copper block",
                    "Solid-State Relay (SSR) short circuit failure in conductive mode",
                    "PID temperature controller loop saturation"
                ],
                "recommendedAction": "Inspect and tighten thermocouple fastening screw, test SSR continuity, verify 160°C setpoint stability."
            },
            {
                "symptomId": "SYM-DA-05",
                "symptom": "Die Micro-Cracking During Z-Placement Touchdown",
                "severity": "Critical",
                "relatedSensors": ["bond_force", "placement_offset"],
                "possibleCauses": [
                    "Voice-coil touchdown impact force threshold set excessively high",
                    "Z-axis optical encoder scale missing counts during descent",
                    "Uneven epoxy thickness causing mechanical stress concentration"
                ],
                "recommendedAction": "Perform Z-axis touchdown force calibration with load cell gauge (set to 5.0 N), inspect encoder scale."
            }
        ],
        "failureScenarios": [
            {
                "scenarioId": "SCEN-DA-001",
                "symptom": "Collet Tip Wear Causing Die Release Failure",
                "sensorPattern": "pressure_vacuum degrades to -58 kPa; cycle time spikes",
                "possibleCauses": [
                    "Rubber collet suction cup rim micro-tears",
                    "Positive air purge blow-off solenoid response delayed",
                    "Epoxy bleed adhesive contamination on collet perimeter"
                ],
                "severity": "high",
                "recommendedAction": "Replace pickup collet with new PEEK/rubber tool. Clean collet holder seat. Calibrate blow-off purge pulse duration.",
                "verificationSteps": ["Test pick-and-place cycle on 20 dummy dies", "Verify zero drop/stick errors"]
            },
            {
                "scenarioId": "SCEN-DA-002",
                "symptom": "Epoxy Dispense Needle Progressive Clogging",
                "sensorPattern": "dispense_pressure rises from 3.8 to 5.4 bar; dot size decreases by 30%",
                "possibleCauses": [
                    "Conductive silver flakes settling and agglomerating at needle restriction",
                    "Syringe temperature elevated above 28°C",
                    "Epoxy pot-life exceeded 8 hours"
                ],
                "severity": "high",
                "recommendedAction": "Unload syringe, replace needle with new 25G precision cannula, load fresh batch of epoxy.",
                "verificationSteps": ["Perform 5 weight test dispenses on precision balance", "Verify dot weight within ± 3% target"]
            },
            {
                "scenarioId": "SCEN-DA-003",
                "symptom": "Bond Arm Voice Coil Vibration Resonance",
                "sensorPattern": "vibration_arm climbs to 0.78 mm/s; placement_offset reaches 8.5 µm",
                "possibleCauses": [
                    "Bond head mounting screws loose due to repetitive high-G cycling",
                    "Linear optical encoder tape dirt smudge",
                    "Voice-coil flexible ribbon cable fatigue"
                ],
                "severity": "high",
                "recommendedAction": "Torque all bond head mounting bolts to 1.2 Nm. Clean optical encoder scale with anhydrous ethanol.",
                "verificationSteps": ["Execute vibration frequency FFT sweep", "Verify arm vibration returns to < 0.35 mm/s"]
            },
            {
                "scenarioId": "SCEN-DA-004",
                "symptom": "Substrate Stage Thermocouple Detachment",
                "sensorPattern": "temperature_heater reads erratic swings (130°C to 210°C in seconds)",
                "possibleCauses": [
                    "Thermocouple clamp screw stripped",
                    "Thermocouple lead wire shield frayed",
                    "Heater cartridge internal resistance imbalance"
                ],
                "severity": "high",
                "recommendedAction": "Replace thermocouple assembly, verify thermal paste application, verify stable reading at 165°C.",
                "verificationSteps": ["Log temperature for 15 minutes", "Verify temperature ripple is < ± 1.0°C"]
            },
            {
                "scenarioId": "SCEN-DA-005",
                "symptom": "Wafer Ejector Pin Misalignment and Silicon Chipping",
                "sensorPattern": "placement_offset drifts; pressure_vacuum fluctuates during pick stroke",
                "possibleCauses": [
                    "Central ejector pin tip bent from tape puncture collision",
                    "Wafer expander ring tension relaxed",
                    "Ejector Z-axis motor zero-position lost"
                ],
                "severity": "critical",
                "recommendedAction": "Replace 4-pin ejector set. Re-teach wafer table ejector X-Y-Z coordinates with alignment fixture.",
                "verificationSteps": ["Perform dry ejection test under camera inspection", "Verify concentricity with collet"]
            },
            {
                "scenarioId": "SCEN-DA-006",
                "symptom": "Die Tilt & Uneven Epoxy Bond Line Thickness",
                "sensorPattern": "bond_force creeps to 7.6 N; placement_offset at 6.8 µm",
                "possibleCauses": [
                    "Collet shank angle misaligned relative to substrate plane",
                    "Heater stage clamping plate warped from thermal cycling",
                    "Asymmetrical epoxy dot dispense volume"
                ],
                "severity": "medium",
                "recommendedAction": "Perform optical planarity calibration on bond head. Inspect leadframe clamping insert flatness.",
                "verificationSteps": ["Inspect bond line thickness on cross-section sample (target 25 ± 3 µm)", "Verify die tilt < 5 µm"]
            },
            {
                "scenarioId": "SCEN-DA-007",
                "symptom": "Vision Alignment Optical Lens Fogging",
                "sensorPattern": "Placement offset increases to 11.2 µm; camera lighting intensity alert",
                "possibleCauses": [
                    "Epoxy volatile solvent vapor condensing on bottom look-down camera lens",
                    "LED strobe illuminator brightness decay",
                    "Focal height shift due to thermal expansion"
                ],
                "severity": "high",
                "recommendedAction": "Clean camera optical windows with lens fluid. Re-calibrate camera pixel-to-micron scaling factor.",
                "verificationSteps": ["Run dot-grid calibration target", "Verify vision repeatability < 0.8 µm"]
            },
            {
                "scenarioId": "SCEN-DA-008",
                "symptom": "Leadframe Indexing Stepper Motor Jam",
                "sensorPattern": "Cycle time alert; vibration_arm at 0.55 mm/s; line jam interlock",
                "possibleCauses": [
                    "Leadframe strip bent or guide track width set too narrow",
                    "Indexer feed claw wear or mechanical backlash",
                    "Epoxy stringing onto indexing track guide"
                ],
                "severity": "medium",
                "recommendedAction": "Clear leadframe jam, clean track rails with IPA, adjust track width with thickness shim.",
                "verificationSteps": ["Index 50 leadframe strips automatically", "Verify index pitch repeatability < 10 µm"]
            },
            {
                "scenarioId": "SCEN-DA-009",
                "symptom": "Dispense Syringe Temperature Controller Drift",
                "sensorPattern": "dispense_pressure creeping up; dot shape changing from round to oval",
                "possibleCauses": [
                    "Peltier cooling/heating jacket fan blocked",
                    "Syringe jacket RTD sensor loose",
                    "Ambient cleanroom draft disrupting thermal balance"
                ],
                "severity": "medium",
                "recommendedAction": "Clean cooling fan filters. Reseat RTD probe inside syringe thermal block.",
                "verificationSteps": ["Verify syringe maintains 25.0 ± 0.5°C", "Measure dispense consistency"]
            },
            {
                "scenarioId": "SCEN-DA-010",
                "symptom": "Load Cell Zero-Offset Saturation",
                "sensorPattern": "bond_force registers false baseline offset (+2.5 N at rest)",
                "possibleCauses": [
                    "Bond head load cell strain gauge pre-stress",
                    "Signal amplifier grounding loop noise",
                    "Cable flex strain on sensor lead wires"
                ],
                "severity": "critical",
                "recommendedAction": "Perform zero tare calibration in service utility. Check sensor cable strain relief.",
                "verificationSteps": ["Verify 0.0 N reading with head unloaded", "Test 5.0 N precision weight block"]
            },
            {
                "scenarioId": "SCEN-DA-011",
                "symptom": "Wafer Stage Vacuum Chuck Tape Slippage",
                "sensorPattern": "Ejector pin pickup failure rate increases; vision alignment offsets jump",
                "possibleCauses": [
                    "Wafer stage vacuum level decayed below -60 kPa",
                    "Porosity of stage ceramic disc blocked by adhesive residue",
                    "Tape frame clamping ring latch loose"
                ],
                "severity": "medium",
                "recommendedAction": "Clean ceramic wafer chuck with acetone wipe. Replace vacuum line seal.",
                "verificationSteps": ["Verify wafer ring clamp lock tension", "Verify -80 kPa vacuum under wafer frame"]
            },
            {
                "scenarioId": "SCEN-DA-012",
                "symptom": "Positive Blow-Off Air Pressure Regulator Leak",
                "sensorPattern": "pressure_vacuum fails to recover quickly after blow-off pulse",
                "possibleCauses": [
                    "Blow-off solenoid valve plunger seal sticking",
                    "Pneumatic pressure regulator diaphragm pinhole",
                    "Debris in exhaust muffler"
                ],
                "severity": "medium",
                "recommendedAction": "Replace blow-off pneumatic solenoid valve. Clean manifold exhaust port.",
                "verificationSteps": ["Measure vacuum release transition time (< 20 ms)", "Verify complete die release"]
            },
            {
                "scenarioId": "SCEN-DA-013",
                "symptom": "Bond Arm Theta Rotation Motor Backlash",
                "sensorPattern": "placement_offset theta component drifts ± 0.5 degrees",
                "possibleCauses": [
                    "Direct-drive theta motor bearing play",
                    "Theta rotary encoder disk contamination",
                    "Collet holder clamp set screw loose"
                ],
                "severity": "high",
                "recommendedAction": "Inspect and tighten collet holder set screw. Execute theta homing and alignment calibration.",
                "verificationSteps": ["Measure rotational alignment accuracy on glass calibration die (< 0.1 deg)"]
            }
        ]
    },

    # ---------------------------------------------------------------------
    # 3. WIRE BONDER
    # ---------------------------------------------------------------------
    {
        "filename": "wire-bonder",
        "machine": {
            "name": "High-Speed Thermosonic Ball-Wedge Wire Bonder",
            "type": "wire_bonder",
            "prototypeMachineId": "WB-001",
            "manualId": "VAI-MAN-WB-001",
            "version": "1.0",
            "generatedDate": "2026-08-26",
            "documentStatus": "Synthetic Prototype Technical Manual",
            "purpose": "VectorAI Demonstration and Development",
            "disclaimer": DISCLAIMER_TEXT,
            "processStage": "Wire Interconnect Assembly",
            "description": (
                "Ultra-fast thermosonic ball-wedge wire bonder designed to create microscopic electrical interconnects "
                "between semiconductor die pads and leadframe fingers/substrate traces using gold (Au) or copper (Cu) wire "
                "via high-frequency ultrasonic energy, controlled mechanical force, and stage heating."
            ),
            "manufacturingProcess": (
                "The wire bonding sequence operates at up to 25 wires per second. An Electronic Flame-Off (EFO) spark creates "
                "a molten Free Air Ball (FAB) at the tip of the wire protruding from a ceramic capillary. The bond head drives "
                "the ball into the die pad, applying 138 kHz ultrasonic resonance to form a metallurgical intermetallic bond (First Bond). "
                "The capillary then forms a precision wire loop and presses the wire onto the leadframe finger, creating a crescent/wedge bond "
                "(Second Bond) before wire clamps tear the tail."
            ),
            "subsystems": [
                "138 kHz Piezoelectric Ultrasonic Transducer & Horn Stack",
                "Precision Ceramic Capillary Tooling & Z-Axis Voice Coil",
                "Electronic Flame-Off (EFO) Spark Generator & Electrode",
                "High-Precision Workholder Heated Clamp & Vacuum Stage",
                "Wire Feed Spool & Micro-Air Tensioner Delivery System",
                "High-Speed Look-Down Vision Alignment & Wire Loop Profiling Camera"
            ]
        },
        "components": [
            {
                "name": "Ultrasonic Transducer & Horn Stack",
                "function": "Converts high-frequency electrical drive signals into mechanical ultrasonic resonance to scrub and weld gold/copper wire to metal pads.",
                "importantParameters": "Ultrasonic vibration magnitude (mm/s), resonance frequency (kHz), transducer temperature (°C), impedance (Ω).",
                "degradationIndicators": "Vibration harmonic drift (>0.75 mm/s), piezo stack heating (>58°C), impedance increase, unbonded wires."
            },
            {
                "name": "Ceramic Capillary Tool",
                "function": "Guides the ultra-fine bonding wire (18-25 µm diameter), shapes the ball bond, and presses the stitch bond.",
                "importantParameters": "Tip outer diameter (µm), hole diameter (µm), face angle, touchdown impact force (gf).",
                "degradationIndicators": "Capillary tip wear/erosion, gold buildup in chamfer, touchdown force elevation (>28 gf), non-stick on pad."
            },
            {
                "name": "Electronic Flame-Off (EFO) Wand",
                "function": "Discharges a high-voltage, low-current micro-arc to melt the wire tip into a symmetrical Free Air Ball.",
                "importantParameters": "Spark voltage (V), spark current (mA), spark duration (µs), electrode gap distance (mm).",
                "degradationIndicators": "Spark voltage spikes (>2450 V), asymmetrical ball formation, electrode carbonization/oxidation."
            },
            {
                "name": "Leadframe Workholder & Clamp",
                "function": "Rigidly clamps leadframe against heated pedestal block to eliminate micro-motion during ultrasonic scrubbing.",
                "importantParameters": "Clamping force (N), clamp insert flatness, heater stage temperature (°C).",
                "degradationIndicators": "Clamping force degradation (>85 N or <45 N), leadframe bouncing, poor stitch adhesion, clamp wear."
            },
            {
                "name": "Wire Feed Clamp & Air Tensioner",
                "function": "Maintains constant light tension on bonding wire spool and executes precision tail breaking.",
                "importantParameters": "Air tension pressure (kPa), clamp opening/closing response time (ms), wire drag friction.",
                "degradationIndicators": "Wire sagging, loop height variance, wire drag friction increase, tail length inconsistency."
            }
        ],
        "sensors": [
            {
                "sensorId": "vibration_ultrasonic",
                "name": "Ultrasonic Vibration",
                "unit": "mm/s",
                "purpose": "Measures harmonic vibration magnitude directly at the ultrasonic transducer horn during the bonding burst.",
                "minScale": 0.0,
                "maxScale": 2.0,
                "normalRange": [0.30, 0.50],
                "warningRange": [0.50, 0.75],
                "criticalRange": [0.75, 2.00],
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "load_clamp",
                "name": "Clamp Clamping Force",
                "unit": "N",
                "purpose": "Measures mechanical clamping force exerted on leadframe to prevent substrate micro-vibration.",
                "minScale": 0.0,
                "maxScale": 120.0,
                "normalRange": [55.0, 75.0],
                "warningRange": [75.0, 85.0],
                "criticalRange": [85.0, 120.0],
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "temperature_transducer",
                "name": "Transducer Temp",
                "unit": "°C",
                "purpose": "Monitors the internal operating temperature of the piezoelectric crystal stack in the transducer horn.",
                "minScale": 20.0,
                "maxScale": 80.0,
                "normalRange": [42.0, 50.0],
                "warningRange": [50.0, 58.0],
                "criticalRange": [58.0, 80.0],
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "ultrasonic_power",
                "name": "Ultrasonic Power Output",
                "unit": "W",
                "purpose": "Monitors electrical power delivered to the transducer during the bonding scrub cycle.",
                "minScale": 0.0,
                "maxScale": 6.0,
                "normalRange": [1.8, 2.8],
                "warningRange": [2.8, 3.6],
                "criticalRange": [3.6, 6.0],
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "efo_spark_voltage",
                "name": "EFO Spark Voltage",
                "unit": "V",
                "purpose": "Monitors the ignition voltage of the Electronic Flame-Off arc used to create Free Air Balls.",
                "minScale": 1000.0,
                "maxScale": 3000.0,
                "normalRange": [1800.0, 2200.0],
                "warningRange": [2200.0, 2450.0],
                "criticalRange": [2450.0, 3000.0],
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "capillary_touchdown_force",
                "name": "Touchdown Impact Force",
                "unit": "gf",
                "purpose": "Measures initial impact force (gram-force) when capillary tip touches die pad surface.",
                "minScale": 0.0,
                "maxScale": 50.0,
                "normalRange": [18.0, 24.0],
                "warningRange": [24.0, 28.0],
                "criticalRange": [28.0, 50.0],
                "direction": "HIGHER_IS_WORSE"
            }
        ],
        "thresholds": [
            {
                "sensorId": "vibration_ultrasonic",
                "sensorName": "Ultrasonic Vibration",
                "unit": "mm/s",
                "normal": {"min": 0.30, "max": 0.50, "description": "Resonant harmonic energy properly transmitted through horn and capillary."},
                "warning": {"min": 0.50, "max": 0.75, "description": "Acoustic impedance mismatch or loosened capillary locking screw."},
                "critical": {"min": 0.75, "max": 2.00, "description": "Severe transducer piezo cracking or uncontrolled mechanical oscillation."},
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "load_clamp",
                "sensorName": "Clamp Clamping Force",
                "unit": "N",
                "normal": {"min": 55.0, "max": 75.0, "description": "Firm clamping holding leadframe flat against heater block without substrate damage."},
                "warning": {"min": 75.0, "max": 85.0, "description": "Excessive clamping force causing leadframe indentation or clamp actuator fatigue."},
                "critical": {"min": 85.0, "max": 120.0, "description": "Excessive force causing leadframe deformation or lead pin crushing."},
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "temperature_transducer",
                "sensorName": "Transducer Temp",
                "unit": "°C",
                "normal": {"min": 42.0, "max": 50.0, "description": "Nominal thermal equilibrium under continuous 20 W/sec bonding load."},
                "warning": {"min": 50.0, "max": 58.0, "description": "Piezoelectric internal dielectric loss and self-heating."},
                "critical": {"min": 58.0, "max": 80.0, "description": "Thermal depolarization hazard for PZT crystals; imminent transducer failure."},
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "ultrasonic_power",
                "sensorName": "Ultrasonic Power Output",
                "unit": "W",
                "normal": {"min": 1.8, "max": 2.8, "description": "Standard energy required to establish Au-Al or Cu-Al intermetallic bond."},
                "warning": {"min": 2.8, "max": 3.6, "description": "Generator boosting power to overcome bonding interface contamination or capillary wear."},
                "critical": {"min": 3.6, "max": 6.0, "description": "Excessive power delivery risking pad metal cratering and silicon fracture."},
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "efo_spark_voltage",
                "sensorName": "EFO Spark Voltage",
                "unit": "V",
                "normal": {"min": 1800.0, "max": 2200.0, "description": "Clean, repeatable arc breakdown forming spherical FAB."},
                "warning": {"min": 2200.0, "max": 2450.0, "description": "Electrode gap widening or tip oxidation increasing ionization potential."},
                "critical": {"min": 2450.0, "max": 3000.0, "description": "EFO arc failure or unstable spark causing golf-club shaped deformed balls."},
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "capillary_touchdown_force",
                "sensorName": "Touchdown Impact Force",
                "unit": "gf",
                "normal": {"min": 18.0, "max": 24.0, "description": "Gentle touchdown preserving delicate underlying low-k dielectric under die pads."},
                "warning": {"min": 24.0, "max": 28.0, "description": "Voice-coil velocity dampening drift causing hard touchdown impacts."},
                "critical": {"min": 28.0, "max": 50.0, "description": "Severe impact force causing micro-crater fractures beneath bond pads."},
                "direction": "HIGHER_IS_WORSE"
            }
        ],
        "operatingConditions": {
            "ambientTemperature": "20.0 - 23.0 °C (Cleanroom ISO Class 5 / Class 100)",
            "relativeHumidity": "35% - 50% RH non-condensing (strictly controlled for Cu wire oxidation prevention)",
            "normalOperatingTemperature": "180.0 - 220.0 °C (Workholder heater for Au wire; 150-180°C for Cu wire)",
            "normalOperatingPressure": "0.45 - 0.55 MPa (CDA & 95% N2 / 5% H2 forming gas for Cu wire)",
            "normalOperatingSpeed": "18 - 25 wires per second",
            "normalCycleTime": "0.04 - 0.06 seconds per bonded wire",
            "normalOperatingHours": "20 - 24 hours/day continuous",
            "recommendedOperatingConditions": "Forming gas flow 0.5 L/min during EFO fire; capillary clean cycle every 100,000 bonds.",
            "maximumContinuousOperation": "100 operating hours before capillary inspection/replacement"
        },
        "maintenance": [
            {
                "component": "Ceramic Capillary Tool",
                "recommendedMaintenanceIntervalHours": 100,
                "expectedServiceLifeHours": 250,
                "maintenanceAction": "Inspect tip wear with optical scope, clean tip with ceramic polishing sheet, replace when worn.",
                "procedureSummary": "Torque capillary locking screw to precisely 0.35 Nm using preset torque wrench. Verify vertical orientation."
            },
            {
                "component": "Ultrasonic Transducer Horn",
                "recommendedMaintenanceIntervalHours": 1000,
                "expectedServiceLifeHours": 5000,
                "maintenanceAction": "Perform electrical impedance analyzer scan; clean horn mounting interface and check resonance curve.",
                "procedureSummary": "Verify resonance peak is at 138.0 ± 0.5 kHz with series resistance < 25 Ω."
            },
            {
                "component": "EFO Wand & Electrode",
                "recommendedMaintenanceIntervalHours": 200,
                "expectedServiceLifeHours": 2000,
                "maintenanceAction": "Clean electrode tip with fine abrasive pad, inspect gap setting to wire (target 0.8 mm), check high-voltage cable.",
                "procedureSummary": "Measure spark gap with optical reticle. Fire 20 sample sparks; verify ball symmetry under 100x scope."
            },
            {
                "component": "Leadframe Clamp Insert",
                "recommendedMaintenanceIntervalHours": 300,
                "expectedServiceLifeHours": 3000,
                "maintenanceAction": "Inspect clamp edge for gold dust contamination and mechanical burrs; verify clamping force with load cell.",
                "procedureSummary": "Place load cell wafer under clamp; calibrate clamp motor current to deliver exactly 65 N."
            },
            {
                "component": "Wire Feed Spool & Tensioner",
                "recommendedMaintenanceIntervalHours": 150,
                "expectedServiceLifeHours": 4000,
                "maintenanceAction": "Clean sapphire wire guides, replace air tensioner filter, verify zero wire snagging along feed path.",
                "procedureSummary": "Inspect wire under microscope for scratches. Verify tension gauge reads 3.0 ± 0.5 gf."
            }
        ],
        "degradationIndicators": [
            {
                "parameter": "Ultrasonic Vibration",
                "normalCondition": "Vibration amplitude 0.30 - 0.50 mm/s with sharp 138 kHz resonance.",
                "degradedCondition": "Vibration drifts into 0.50 - 0.75 mm/s due to capillary screw loosening or horn impedance rise.",
                "criticalCondition": "Vibration exceeds 0.75 mm/s; transducer resonance breaks down into chaotic noise.",
                "indicatorMechanism": "Indicates physical micro-cracking in piezoelectric crystal stack or mechanical loosening of the capillary clamping screw."
            },
            {
                "parameter": "Transducer Temperature",
                "normalCondition": "Operates steadily between 42 and 50 °C.",
                "degradedCondition": "Temperature climbs to 50 - 58 °C as internal electrical dissipation increases.",
                "criticalCondition": "Temperature exceeds 58 °C; approaching Curie temperature depolarization limit.",
                "indicatorMechanism": "Indicates internal dielectric breakdown and heat dissipation from micro-fractured piezo ceramic disks."
            },
            {
                "parameter": "Ultrasonic Power Output",
                "normalCondition": "Power stable between 1.8 and 2.8 W.",
                "degradedCondition": "Power creeps up to 2.8 - 3.6 W to overcome bonding interface contamination or capillary tip wear.",
                "criticalCondition": "Power exceeds 3.6 W; high risk of pad metal lifting and silicon micro-cracking.",
                "indicatorMechanism": "Compensates for loss of acoustic scrubbing efficiency caused by eroded capillary tip chamfer."
            },
            {
                "parameter": "Clamp Clamping Force",
                "normalCondition": "Force maintained at 55 - 75 N.",
                "degradedCondition": "Force creeps into 75 - 85 N due to actuator motor friction.",
                "criticalCondition": "Force exceeds 85 N or drops below 40 N; leads move during bonding.",
                "indicatorMechanism": "Indicates wear in the clamping toggle linkage, pneumatic piston friction, or clamp spring fatigue."
            },
            {
                "parameter": "Touchdown Impact Force",
                "normalCondition": "Gentle touchdown force between 18 and 24 gf.",
                "degradedCondition": "Impact force increases to 24 - 28 gf.",
                "criticalCondition": "Impact force exceeds 28 gf; dangerous shock loads delivered to active die circuitry.",
                "indicatorMechanism": "Indicates loss of voice-coil velocity feedback damping or friction in Z-axis linear air-bearing slides."
            }
        ],
        "rulModel": {
            "baseUsefulLifeHours": 5000,
            "formulaDescription": "Deterministic multi-parameter linear degradation model for Wire Bonder. Weights sum to 1.00.",
            "weightsSum": 1.00,
            "parameters": [
                {
                    "parameter": "Ultrasonic Vibration",
                    "sensorId": "vibration_ultrasonic",
                    "sensorName": "Ultrasonic Vibration",
                    "unit": "mm/s",
                    "weight": 0.30,
                    "healthyLimit": 0.50,
                    "criticalLimit": 1.10,
                    "direction": "HIGHER_IS_WORSE"
                },
                {
                    "parameter": "Transducer Temperature",
                    "sensorId": "temperature_transducer",
                    "sensorName": "Transducer Temp",
                    "unit": "°C",
                    "weight": 0.20,
                    "healthyLimit": 50.0,
                    "criticalLimit": 68.0,
                    "direction": "HIGHER_IS_WORSE"
                },
                {
                    "parameter": "Ultrasonic Power",
                    "sensorId": "ultrasonic_power",
                    "sensorName": "Ultrasonic Power Output",
                    "unit": "W",
                    "weight": 0.20,
                    "healthyLimit": 2.8,
                    "criticalLimit": 4.0,
                    "direction": "HIGHER_IS_WORSE"
                },
                {
                    "parameter": "Clamp Clamping Force",
                    "sensorId": "load_clamp",
                    "sensorName": "Clamp Clamping Force",
                    "unit": "N",
                    "weight": 0.15,
                    "healthyLimit": 75.0,
                    "criticalLimit": 95.0,
                    "direction": "HIGHER_IS_WORSE"
                },
                {
                    "parameter": "Touchdown Force",
                    "sensorId": "capillary_touchdown_force",
                    "sensorName": "Touchdown Impact Force",
                    "unit": "gf",
                    "weight": 0.15,
                    "healthyLimit": 24.0,
                    "criticalLimit": 32.0,
                    "direction": "HIGHER_IS_WORSE"
                }
            ]
        },
        "symptoms": [
            {
                "symptomId": "SYM-WB-01",
                "symptom": "Ultrasonic Transducer Resonance Drift / Vibration Spike",
                "severity": "Critical",
                "relatedSensors": ["vibration_ultrasonic", "temperature_transducer"],
                "possibleCauses": [
                    "Capillary fastening screw torque relaxation (< 0.35 Nm)",
                    "Piezoelectric crystal disk micro-cracking or electrode delamination",
                    "Transducer horn mounting bracket misalignment"
                ],
                "recommendedAction": "Retorque capillary screw to 0.35 Nm. If vibration persists, execute impedance sweep and replace transducer stack."
            },
            {
                "symptomId": "SYM-WB-02",
                "symptom": "Non-Stick on Pad (NSOP) / First Bond Lift-Off",
                "severity": "Critical",
                "relatedSensors": ["ultrasonic_power", "vibration_ultrasonic", "capillary_touchdown_force"],
                "possibleCauses": [
                    "Ceramic capillary tip chamfer wear or gold clogging",
                    "Substrate surface organic contamination or pad aluminum oxidation",
                    "Insufficient ultrasonic power delivery"
                ],
                "recommendedAction": "Replace ceramic capillary tool, execute capillary tip alignment, verify substrate heater temperature (200°C)."
            },
            {
                "symptomId": "SYM-WB-03",
                "symptom": "Electronic Flame-Off (EFO) Spark Failure / Tail Open",
                "severity": "High",
                "relatedSensors": ["efo_spark_voltage"],
                "possibleCauses": [
                    "EFO electrode tip carbonization or oxidation buildup",
                    "Electrode spark gap out of specification (> 1.2 mm)",
                    "Forming gas flow deficiency causing copper wire oxidation"
                ],
                "recommendedAction": "Clean electrode tip with abrasive pad, readjust gap to 0.8 mm, verify 0.5 L/min forming gas flow."
            },
            {
                "symptomId": "SYM-WB-04",
                "symptom": "Second Bond (Stitch) Peeling / Non-Stick on Lead (NSOL)",
                "severity": "High",
                "relatedSensors": ["load_clamp", "ultrasonic_power"],
                "possibleCauses": [
                    "Leadframe clamp insert wear or insufficient clamping force allowing substrate bounce",
                    "Heater stage pedestal surface particulate buildup",
                    "Capillary outer radius wear"
                ],
                "recommendedAction": "Inspect leadframe clamping force (target 65 N), clean heater pedestal surface, replace capillary."
            },
            {
                "symptomId": "SYM-WB-05",
                "symptom": "Die Pad Metal Cratering / Silicon Damage",
                "severity": "Critical",
                "relatedSensors": ["capillary_touchdown_force", "ultrasonic_power"],
                "possibleCauses": [
                    "Z-axis touchdown impact force exceeding 28 gf",
                    "Ultrasonic power burst applied prior to complete touchdown seating",
                    "Excessive ultrasonic power amplitude (> 3.6 W)"
                ],
                "recommendedAction": "Calibrate Z-axis touchdown damping and velocity profile, reduce ultrasonic power by 15%, inspect pad under acoustic scope."
            }
        ],
        "failureScenarios": [
            {
                "scenarioId": "SCEN-WB-001",
                "symptom": "Transducer Piezo Stack Micro-Crack Breakdown",
                "sensorPattern": "vibration_ultrasonic rises from 0.44 to 0.88 mm/s; temperature_transducer hits 56.5°C",
                "possibleCauses": [
                    "Repetitive mechanical shock fatigue on piezo crystal discs",
                    "High-voltage drive amplifier transient spike",
                    "Capillary overtightened beyond 0.50 Nm"
                ],
                "severity": "critical",
                "recommendedAction": "Replace ultrasonic transducer horn assembly. Calibrate generator resonant frequency to 138 kHz.",
                "verificationSteps": ["Run impedance analyzer scan (target 138.0 kHz, < 25 Ω)", "Execute 100 test bonds with wire pull test (> 8 gf)"]
            },
            {
                "scenarioId": "SCEN-WB-002",
                "symptom": "Capillary Tip Chamfer Erosion and Gold Buildup",
                "sensorPattern": "ultrasonic_power creeps from 2.2W to 3.4W; NSOP rate climbs to 1.5%",
                "possibleCauses": [
                    "Abrasive friction from gold/copper wire after 150,000 bond cycles",
                    "Gold buildup in capillary wire hole causing feed drag",
                    "Capillary touched off-center on hard leadframe edge"
                ],
                "severity": "high",
                "recommendedAction": "Replace capillary with new ceramic tool. Torque to 0.35 Nm. Re-teach optical bond locations.",
                "verificationSteps": ["Inspect capillary tip under microscope", "Perform wire pull and ball shear test (> 25 gf shear)"]
            },
            {
                "scenarioId": "SCEN-WB-003",
                "symptom": "EFO Electrode Oxidation Causing Misshaped Free Air Ball",
                "sensorPattern": "efo_spark_voltage rises to 2520 V; ball diameter variance increases",
                "possibleCauses": [
                    "Forming gas shield tube misaligned",
                    "Electrode tip oxidized from ambient air exposure",
                    "Spark duration timing drift"
                ],
                "severity": "high",
                "recommendedAction": "Polish electrode tip, readjust spark gap to 0.8 mm, verify 95% N2 / 5% H2 gas shield.",
                "verificationSteps": ["Fire 50 test balls onto leadframe", "Verify FAB diameter is 35 ± 1.5 µm under vision inspection"]
            },
            {
                "scenarioId": "SCEN-WB-004",
                "symptom": "Leadframe Clamp Wear Causing Substrate Resonance Bounce",
                "sensorPattern": "load_clamp reads 84.0 N; ultrasonic_power elevated; NSOL stitch peels",
                "possibleCauses": [
                    "Clamp insert contact pads worn and grooved by leadframe strips",
                    "Clamp air cylinder seal friction",
                    "Heater block vacuum channels blocked by solder residue"
                ],
                "severity": "high",
                "recommendedAction": "Replace leadframe clamp insert. Clean heater pedestal vacuum channels with brass scraper and IPA.",
                "verificationSteps": ["Test clamping force with calibrated load cell (target 65 N)", "Check stitch bond pull strength (> 5 gf)"]
            },
            {
                "scenarioId": "SCEN-WB-005",
                "symptom": "Z-Axis Voice Coil Damping Loss & Pad Cratering Hazard",
                "sensorPattern": "capillary_touchdown_force surges to 31.0 gf; bond force alarm",
                "possibleCauses": [
                    "Z-axis voice-coil velocity feedback circuit gain drift",
                    "Linear air slide bearing particulate contamination",
                    "Touchdown sensor optical flag bent"
                ],
                "severity": "critical",
                "recommendedAction": "Clean Z-axis air bearing slides, recalibrate voice coil velocity damping profile, verify 20 gf touchdown.",
                "verificationSteps": ["Perform touchdown test on piezoelectric sensor block", "Acoustic microscopy check for cratering"]
            },
            {
                "scenarioId": "SCEN-WB-006",
                "symptom": "Wire Spool Tensioner Air Damper Instability",
                "sensorPattern": "Wire loop height variance exceeds ± 15 µm; cycle time erratic",
                "possibleCauses": [
                    "Air tensioner glass tube dirty with gold dust flakes",
                    "Tension air regulator pressure fluctuation",
                    "Wire spool drag brake pad worn"
                ],
                "severity": "medium",
                "recommendedAction": "Clean glass tensioner tube with alcohol swab. Inspect spool brake spring.",
                "verificationSteps": ["Measure loop profile on 30 sample wires with vision system (target height 120 ± 3 µm)"]
            },
            {
                "scenarioId": "SCEN-WB-007",
                "symptom": "Substrate Heater Block Zone 2 Thermal Degradation",
                "sensorPattern": "Bond temperature fluctuates between 165°C and 198°C; heater duty cycle alert",
                "possibleCauses": [
                    "Heater cartridge internal resistance aging",
                    "Thermocouple loose in heater pocket",
                    "Thermal paste dried and calcified"
                ],
                "severity": "high",
                "recommendedAction": "Replace heater cartridge element, apply high-temperature thermal paste, reseat thermocouple.",
                "verificationSteps": ["Measure temperature profile across heater block with surface pyrometer (uniformity ± 2°C)"]
            },
            {
                "scenarioId": "SCEN-WB-008",
                "symptom": "Wire Clamping Solenoid Response Latency",
                "sensorPattern": "Tail length fluctuates (50 µm to 250 µm); occasional tail-less open alarm",
                "possibleCauses": [
                    "Wire clamp solenoid pivot jewel bearing dirt",
                    "Clamp driving pulse voltage drop",
                    "Clamp ruby inserts contaminated with wire drawing lubricant"
                ],
                "severity": "medium",
                "recommendedAction": "Clean wire clamp ruby jaws with optical solvent wipe. Calibrate clamp open/close timing.",
                "verificationSteps": ["Verify tail length consistency (target 100 ± 10 µm) over 500 wires"]
            },
            {
                "scenarioId": "SCEN-WB-009",
                "symptom": "Vision System Pattern Recognition Offset Drift",
                "sensorPattern": "Die pad alignment search time increases by 40 ms; occasional false PR rejects",
                "possibleCauses": [
                    "Look-down camera objective lens coated with leadframe flux vapor",
                    "LED coaxial illumination brightness decay",
                    "Thermal drift of optical mounting bracket"
                ],
                "severity": "medium",
                "recommendedAction": "Clean camera front glass with lens tissue. Execute illumination auto-calibration and optics zeroing.",
                "verificationSteps": ["Run PR test on 50 reference dies", "Verify location accuracy < 0.5 µm"]
            },
            {
                "scenarioId": "SCEN-WB-010",
                "symptom": "Capillary Clamping Screw Torque Relaxation",
                "sensorPattern": "vibration_ultrasonic exhibits erratic noise spikes (0.35 to 0.72 mm/s)",
                "possibleCauses": [
                    "Thermal expansion cycling of aluminum horn threads",
                    "Capillary screw thread stripped or worn",
                    "Improper torque wrench used during last tool change"
                ],
                "severity": "high",
                "recommendedAction": "Replace clamping screw with new titanium screw. Torque to exactly 0.35 Nm.",
                "verificationSteps": ["Verify vibration stability during continuous 1000-wire test run"]
            },
            {
                "scenarioId": "SCEN-WB-011",
                "symptom": "Forming Gas Flow Interruption During Cu Bonding",
                "sensorPattern": "efo_spark_voltage rises to 2600 V; copper wire ball heavily oxidized (dark red/purple)",
                "possibleCauses": [
                    "Forming gas mass flow controller valve stuck closed",
                    "Gas line cylinder pressure depleted",
                    "Gas delivery nozzle tip clogged with spatter"
                ],
                "severity": "critical",
                "recommendedAction": "Inspect gas supply line, clear nozzle orifice, verify 0.5 L/min flow rate with inline rotameter.",
                "verificationSteps": ["Inspect copper FAB under microscope (must be bright shiny copper sphere)"]
            },
            {
                "scenarioId": "SCEN-WB-012",
                "symptom": "Second Bond Stitch Cutter Blade Chipping",
                "sensorPattern": "Wire tail fails to break cleanly; wire dragging across package leads",
                "possibleCauses": [
                    "Tear clamp stroke distance insufficient",
                    "Capillary outer radius chipped on lead edge",
                    "Leadframe metal burrs catching wire"
                ],
                "severity": "high",
                "recommendedAction": "Replace capillary tool. Check tear clamp motion profile.",
                "verificationSteps": ["Verify clean tail separation without wire necking or sagging"]
            },
            {
                "scenarioId": "SCEN-WB-013",
                "symptom": "Heater Pedestal Vacuum Suction Loss",
                "sensorPattern": "load_clamp at 72 N; leadframe vibration detected during scrub",
                "possibleCauses": [
                    "Vacuum generator venturi clogged with cleanroom dust",
                    "Heater pedestal vacuum manifold seal O-ring degraded",
                    "Leadframe strip bottom surface burrs preventing vacuum seal"
                ],
                "severity": "medium",
                "recommendedAction": "Clean vacuum venturi nozzle, replace high-temp silicone O-ring, check leadframe incoming quality.",
                "verificationSteps": ["Verify vacuum level < -70 kPa under clamped leadframe"]
            }
        ]
    },

    # ---------------------------------------------------------------------
    # 4. MOLDING MACHINE
    # ---------------------------------------------------------------------
    {
        "filename": "molding-machine",
        "machine": {
            "name": "Multi-Plunger Transfer Molding Press",
            "type": "molding",
            "prototypeMachineId": "MOLD-001",
            "manualId": "VAI-MAN-MOLD-001",
            "version": "1.0",
            "generatedDate": "2026-08-26",
            "documentStatus": "Synthetic Prototype Technical Manual",
            "purpose": "VectorAI Demonstration and Development",
            "disclaimer": DISCLAIMER_TEXT,
            "processStage": "Encapsulation & Package Molding",
            "description": (
                "High-precision automated multi-plunger transfer molding system designed to encapsulate wire-bonded "
                "semiconductor sub-assemblies in high-grade thermoset Epoxy Molding Compound (EMC) using high-tonnage "
                "hydraulic/servo clamping and precision vacuum-assisted cavity injection."
            ),
            "manufacturingProcess": (
                "Leadframe strips are loaded into heated top and bottom mold chases. Solid EMC pellets are loaded into multiple "
                "plunger pots. The main press closes under 180 tons of clamping force, pulling a deep vacuum (< 10 mbar) inside the mold "
                "chases. Motorized or hydraulic transfer rams melt and inject the liquefied epoxy compound through runner channels into "
                "the package cavities, encapsulating the fragile die and gold wire loops without wire sweep or void formation."
            ),
            "subsystems": [
                "180-Ton High-Rigidity Hydraulic Clamping Press & Tie-Bars",
                "Precision Multi-Plunger Transfer Injection Ram System",
                "Top & Bottom Precision Mold Chase Tooling with Vacuum Seal",
                "Multi-Zone Cartridge Heating & PID Mold Temperature Controllers",
                "Vacuum De-Gassing Cavity Chamber & High-Capacity Vacuum Pump",
                "Automated Degate, Ejector Pin Bar & Leadframe Unloading Handler"
            ]
        },
        "components": [
            {
                "name": "Mold Chase Tooling (Top & Bottom)",
                "function": "Precision-machined hardened tool steel blocks with mirror-polished, hard-chrome plated cavities forming the IC package package exterior.",
                "importantParameters": "Mold chase temperature (°C), parting line planarity (µm), vacuum seal integrity, air vent depth (µm).",
                "degradationIndicators": "Mold temperature gradient (>10°C delta), resin flash leakage, cavity chrome plating abrasion, air vent clogging."
            },
            {
                "name": "Multi-Plunger Transfer Injection System",
                "function": "Drives hardened transfer plungers to compress and melt epoxy pellets, injecting viscous resin into mold runners at controlled velocity.",
                "importantParameters": "Plunger force load (kN), plunger velocity (mm/s), transfer time (s), plunger tip clearance.",
                "degradationIndicators": "Plunger force surge (>30 kN), plunger tip wear, resin bleed past plunger seal, velocity stutter."
            },
            {
                "name": "Hydraulic Press Clamping Unit",
                "function": "Exerts up to 200 tons of clamping force across the mold chase parting line to contain high internal injection pressures.",
                "importantParameters": "Hydraulic system pressure (bar), clamping tonnage (tons), hydraulic oil temperature (°C).",
                "degradationIndicators": "Hydraulic pressure creep (>175 bar), oil overheating (>62°C), tie-bar elongation imbalance, cylinder seal leakage."
            },
            {
                "name": "Vacuum Assist De-Gassing System",
                "function": "Evacuates air and volatile organic gases from closed mold cavities prior to resin injection to prevent void formation.",
                "importantParameters": "Cavity vacuum pressure (mbar), evacuation time (s), vacuum valve response latency.",
                "degradationIndicators": "Cavity vacuum loss (>25 mbar), vacuum filter clogging with epoxy dust, O-ring seal hardening."
            },
            {
                "name": "Ejector Pin & Degating Mechanism",
                "function": "Pushes encapsulated leadframe out of mold cavities and shears hardened runner gates after cure cycle completes.",
                "importantParameters": "Ejector stroke length (mm), ejector motor force (N), degate shear blade sharpness.",
                "degradationIndicators": "Ejector pin seizure, package surface indentation, leadframe deformation, incomplete degating."
            }
        ],
        "sensors": [
            {
                "sensorId": "temperature_mold",
                "name": "Mold Chase Temp",
                "unit": "°C",
                "purpose": "Monitors the surface temperature of the upper and lower mold chase heating plates.",
                "minScale": 100.0,
                "maxScale": 230.0,
                "normalRange": [165.0, 180.0],
                "warningRange": [180.0, 190.0],
                "criticalRange": [190.0, 230.0],
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "pressure_hydraulic",
                "name": "Hydraulic Pressure",
                "unit": "bar",
                "purpose": "Measures hydraulic system pressure driving the transfer ram during compound injection.",
                "minScale": 0.0,
                "maxScale": 250.0,
                "normalRange": [120.0, 150.0],
                "warningRange": [150.0, 175.0],
                "criticalRange": [175.0, 250.0],
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "load_plunger",
                "name": "Plunger Force Load",
                "unit": "kN",
                "purpose": "Monitors dynamic compression force exerted by the motorized/hydraulic multi-plunger system.",
                "minScale": 0.0,
                "maxScale": 50.0,
                "normalRange": [18.0, 25.0],
                "warningRange": [25.0, 30.0],
                "criticalRange": [30.0, 50.0],
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "vacuum_chamber_pressure",
                "name": "Mold Cavity Vacuum Pressure",
                "unit": "mbar",
                "purpose": "Measures absolute vacuum level achieved inside the mold cavity chamber before resin injection.",
                "minScale": 0.0,
                "maxScale": 100.0,
                "normalRange": [1.0, 10.0],
                "warningRange": [10.0, 25.0],
                "criticalRange": [25.0, 100.0],
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "clamping_tonnage",
                "name": "Main Press Clamping Force",
                "unit": "tons",
                "purpose": "Measures total clamping tonnage holding upper and lower mold chases closed during transfer.",
                "minScale": 0.0,
                "maxScale": 260.0,
                "normalRange": [160.0, 190.0],
                "warningRange": [190.0, 215.0],
                "criticalRange": [215.0, 260.0],
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "hydraulic_oil_temperature",
                "name": "Hydraulic Oil Temp",
                "unit": "°C",
                "purpose": "Monitors the bulk temperature of hydraulic oil in the main power unit reservoir.",
                "minScale": 20.0,
                "maxScale": 90.0,
                "normalRange": [40.0, 52.0],
                "warningRange": [52.0, 62.0],
                "criticalRange": [62.0, 90.0],
                "direction": "HIGHER_IS_WORSE"
            }
        ],
        "thresholds": [
            {
                "sensorId": "temperature_mold",
                "sensorName": "Mold Chase Temp",
                "unit": "°C",
                "normal": {"min": 165.0, "max": 180.0, "description": "Optimal thermoset epoxy polymerization and curing temperature window."},
                "warning": {"min": 180.0, "max": 190.0, "description": "Thermal overshoot risking premature resin gelation and incomplete fill."},
                "critical": {"min": 190.0, "max": 230.0, "description": "Severe thermal runaway causing resin scorch, gas burns, and mold thermal damage."},
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "pressure_hydraulic",
                "sensorName": "Hydraulic Pressure",
                "unit": "bar",
                "normal": {"min": 120.0, "max": 150.0, "description": "Nominal hydraulic line pressure delivering smooth transfer stroke."},
                "warning": {"min": 150.0, "max": 175.0, "description": "Proportional valve restriction or resin flow resistance elevation."},
                "critical": {"min": 175.0, "max": 250.0, "description": "Hydraulic over-pressurization risking hose rupture and excessive mold stress."},
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "load_plunger",
                "sensorName": "Plunger Force Load",
                "unit": "kN",
                "normal": {"min": 18.0, "max": 25.0, "description": "Balanced multi-plunger compaction and resin flow through runners."},
                "warning": {"min": 25.0, "max": 30.0, "description": "Pellet pre-cure resistance or plunger tip friction in pot sleeve."},
                "critical": {"min": 30.0, "max": 50.0, "description": "Plunger mechanical binding, gate freeze-off, or severe wire sweep risk."},
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "vacuum_chamber_pressure",
                "sensorName": "Mold Cavity Vacuum Pressure",
                "unit": "mbar",
                "normal": {"min": 1.0, "max": 10.0, "description": "Deep vacuum ensuring complete elimination of micro-voids in package corners."},
                "warning": {"min": 10.0, "max": 25.0, "description": "Vacuum seal degradation or particulate debris on mold parting line."},
                "critical": {"min": 25.0, "max": 100.0, "description": "Inadequate vacuum causing severe internal package voids and wire sweep defects."},
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "clamping_tonnage",
                "sensorName": "Main Press Clamping Force",
                "unit": "tons",
                "normal": {"min": 160.0, "max": 190.0, "description": "Nominal clamping force sealing parting line without tool deformation."},
                "warning": {"min": 190.0, "max": 215.0, "description": "Clamping compensation required due to parting line flash buildup."},
                "critical": {"min": 215.0, "max": 260.0, "description": "Excessive tonnage causing mold chase plastic deformation or tie-bar fatigue."},
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "hydraulic_oil_temperature",
                "sensorName": "Hydraulic Oil Temp",
                "unit": "°C",
                "normal": {"min": 40.0, "max": 52.0, "description": "Optimal oil viscosity and lubrication for proportional valves and pumps."},
                "warning": {"min": 52.0, "max": 62.0, "description": "Oil cooler degradation or continuous high-cycle hydraulic loading."},
                "critical": {"min": 62.0, "max": 90.0, "description": "Severe oil thermal oxidation, viscosity breakdown, and seal deterioration."},
                "direction": "HIGHER_IS_WORSE"
            }
        ],
        "operatingConditions": {
            "ambientTemperature": "20.0 - 24.0 °C (Cleanroom ISO Class 7 / Class 10,000)",
            "relativeHumidity": "40% - 60% RH non-condensing",
            "normalOperatingTemperature": "170.0 - 178.0 °C (Upper and Lower Mold Chases)",
            "normalOperatingPressure": "130.0 - 150.0 bar (Hydraulic system pressure)",
            "normalOperatingSpeed": "45 - 90 seconds per complete mold cycle (injection + cure)",
            "normalCycleTime": "60 - 80 seconds cure time (epoxy formulation dependent)",
            "normalOperatingHours": "20 - 24 hours/day continuous",
            "recommendedOperatingConditions": "Melamine cleaning cycle every 200 shots; wax conditioning cycle every 500 shots.",
            "maximumContinuousOperation": "168 hours before scheduled mold chase tear-down and ultrasonic cleaning"
        },
        "maintenance": [
            {
                "component": "Mold Chase Cavity Inserts",
                "recommendedMaintenanceIntervalHours": 200,
                "expectedServiceLifeHours": 8000,
                "maintenanceAction": "Run melamine cleaning compound shots, clean air vents with brass scraper, apply carnauba release wax.",
                "procedureSummary": "Execute 3 shots of melamine cleaning block. Wipe mold chase with cleanroom cloth, measure air vent depth (target 15 µm)."
            },
            {
                "component": "Transfer Plunger Tips & Pot Sleeves",
                "recommendedMaintenanceIntervalHours": 500,
                "expectedServiceLifeHours": 3500,
                "maintenanceAction": "Inspect plunger tip OD and pot ID for score marks and resin flash; replace worn plunger tips.",
                "procedureSummary": "Verify radial clearance between plunger tip and pot sleeve is 0.035 - 0.050 mm using feeler gauge."
            },
            {
                "component": "Hydraulic Power Unit & Proportional Valves",
                "recommendedMaintenanceIntervalHours": 1000,
                "expectedServiceLifeHours": 10000,
                "maintenanceAction": "Replace 5 µm hydraulic return filter, test oil viscosity/particle count (ISO 4406), clean oil cooler radiator.",
                "procedureSummary": "Draw oil sample from reservoir. Verify moisture content < 150 ppm and particle cleanliness level 16/14/11."
            },
            {
                "component": "Vacuum Chamber Seal & Exhaust Valves",
                "recommendedMaintenanceIntervalHours": 350,
                "expectedServiceLifeHours": 2500,
                "maintenanceAction": "Replace silicone vacuum perimeter gasket, clean vacuum trap exhaust filter of condensed resin volatiles.",
                "procedureSummary": "Inspect gasket for hardening or cracks. Verify vacuum decay rate is < 2.0 mbar/sec."
            },
            {
                "component": "Tie-Bars & Press Mechanical Structure",
                "recommendedMaintenanceIntervalHours": 2000,
                "expectedServiceLifeHours": 20000,
                "maintenanceAction": "Measure tie-bar ultrasonic elongation to verify balanced tonnage distribution across all 4 columns.",
                "procedureSummary": "Use ultrasonic bolt tension meter on all 4 tie-bars; verify strain variance across columns is < 3%."
            }
        ],
        "degradationIndicators": [
            {
                "parameter": "Hydraulic System Pressure",
                "normalCondition": "Hydraulic pressure stable between 120 and 150 bar during transfer.",
                "degradedCondition": "Pressure climbs into 150 - 175 bar as internal valve friction rises or resin viscosity thickens.",
                "criticalCondition": "Pressure exceeds 175 bar; proportional valve saturation and risk of hydraulic shock.",
                "indicatorMechanism": "Indicates proportional directional valve spool wear, internal pump slippage, or fluid contamination."
            },
            {
                "parameter": "Plunger Force Load",
                "normalCondition": "Plunger compression force maintains steady 18 - 25 kN profile.",
                "degradedCondition": "Force increases to 25 - 30 kN due to plunger tip carbon buildup or resin pre-gelation.",
                "criticalCondition": "Force exceeds 30 kN; high risk of wire sweep, die pad fracture, and plunger jamming.",
                "indicatorMechanism": "Indicates physical friction between plunger tips and pot sleeves or premature EMC curing in runners."
            },
            {
                "parameter": "Mold Chase Temperature",
                "normalCondition": "Uniform thermal holding at 165 - 180 °C (zone gradient < 2°C).",
                "degradedCondition": "Temperature climbs to 180 - 190 °C or zone temperature delta exceeds 6°C.",
                "criticalCondition": "Temperature exceeds 190 °C; high risk of epoxy blister defect and scorch burning.",
                "indicatorMechanism": "Indicates cartridge heater resistance oxidation, loose thermocouple contact, or SSR phase breakdown."
            },
            {
                "parameter": "Mold Cavity Vacuum Pressure",
                "normalCondition": "Pulls deep negative vacuum down to 1.0 - 10.0 mbar prior to injection.",
                "degradedCondition": "Vacuum only reaches 10.0 - 25.0 mbar as perimeter O-ring seals age.",
                "criticalCondition": "Vacuum level worse than 25.0 mbar; entrapped air creates catastrophic void defects.",
                "indicatorMechanism": "Indicates vacuum seal hardening, parting line resin flash buildup, or vacuum pump vane degradation."
            },
            {
                "parameter": "Hydraulic Oil Temperature",
                "normalCondition": "Bulk oil temperature stabilized between 40 and 52 °C.",
                "degradedCondition": "Oil temperature climbs into 52 - 62 °C range.",
                "criticalCondition": "Oil temperature exceeds 62 °C; thermal oxidation rapidly accelerates.",
                "indicatorMechanism": "Indicates heat exchanger fouling, continuous high-pressure relief valve bypass, or low fluid level."
            }
        ],
        "rulModel": {
            "baseUsefulLifeHours": 8000,
            "formulaDescription": "Deterministic multi-parameter linear degradation model for Molding Machine. Weights sum to 1.00.",
            "weightsSum": 1.00,
            "parameters": [
                {
                    "parameter": "Hydraulic Pressure",
                    "sensorId": "pressure_hydraulic",
                    "sensorName": "Hydraulic Pressure",
                    "unit": "bar",
                    "weight": 0.25,
                    "healthyLimit": 150.0,
                    "criticalLimit": 200.0,
                    "direction": "HIGHER_IS_WORSE"
                },
                {
                    "parameter": "Plunger Force Load",
                    "sensorId": "load_plunger",
                    "sensorName": "Plunger Force Load",
                    "unit": "kN",
                    "weight": 0.25,
                    "healthyLimit": 25.0,
                    "criticalLimit": 38.0,
                    "direction": "HIGHER_IS_WORSE"
                },
                {
                    "parameter": "Mold Chase Temp",
                    "sensorId": "temperature_mold",
                    "sensorName": "Mold Chase Temp",
                    "unit": "°C",
                    "weight": 0.20,
                    "healthyLimit": 180.0,
                    "criticalLimit": 205.0,
                    "direction": "HIGHER_IS_WORSE"
                },
                {
                    "parameter": "Cavity Vacuum Pressure",
                    "sensorId": "vacuum_chamber_pressure",
                    "sensorName": "Mold Cavity Vacuum Pressure",
                    "unit": "mbar",
                    "weight": 0.15,
                    "healthyLimit": 10.0,
                    "criticalLimit": 35.0,
                    "direction": "HIGHER_IS_WORSE"
                },
                {
                    "parameter": "Hydraulic Oil Temp",
                    "sensorId": "hydraulic_oil_temperature",
                    "sensorName": "Hydraulic Oil Temp",
                    "unit": "°C",
                    "weight": 0.15,
                    "healthyLimit": 52.0,
                    "criticalLimit": 70.0,
                    "direction": "HIGHER_IS_WORSE"
                }
            ]
        },
        "symptoms": [
            {
                "symptomId": "SYM-MOLD-01",
                "symptom": "Plunger Injection Force Surge / Wire Sweep Risk",
                "severity": "Critical",
                "relatedSensors": ["load_plunger", "pressure_hydraulic"],
                "possibleCauses": [
                    "Epoxy molding compound pellets pre-curing in preheat hopper",
                    "Transfer runner gate freeze-off due to low mold temperature in runner zone",
                    "Plunger tip carbon residue buildup and mechanical binding"
                ],
                "recommendedAction": "Halt injection stroke, purge mold cavities, clean plunger tips and pot sleeves, verify pellet preheat time (< 45 sec)."
            },
            {
                "symptomId": "SYM-MOLD-02",
                "symptom": "Mold Cavity Vacuum Loss / Incomplete Void Elimination",
                "severity": "High",
                "relatedSensors": ["vacuum_chamber_pressure"],
                "possibleCauses": [
                    "Silicone vacuum perimeter seal gasket burnt, cracked, or hardened",
                    "Parting line resin flash preventing complete seal compression",
                    "Vacuum exhaust solenoid valve filter clogged with condensed epoxy vapor"
                ],
                "recommendedAction": "Replace vacuum perimeter seal gasket, clean parting line sealing surfaces, clean vacuum line filter trap."
            },
            {
                "symptomId": "SYM-MOLD-03",
                "symptom": "Hydraulic System Pressure Elevation & Oil Overheating",
                "severity": "High",
                "relatedSensors": ["pressure_hydraulic", "hydraulic_oil_temperature"],
                "possibleCauses": [
                    "Hydraulic proportional directional valve spool varnish contamination",
                    "Heat exchanger water flow restricted by scale deposits",
                    "Main pump relief valve setting drifting high"
                ],
                "recommendedAction": "Flush proportional valve assembly, descale heat exchanger with chemical flush, verify oil temperature stays < 50°C."
            },
            {
                "symptomId": "SYM-MOLD-04",
                "symptom": "Mold Chase Temperature Asymmetry / Package Warpage",
                "severity": "Medium",
                "relatedSensors": ["temperature_mold"],
                "possibleCauses": [
                    "Cartridge heater element in zone 3 open-circuit or high resistance",
                    "Thermocouple probe loose in heater pocket",
                    "SSR controller channel intermittent conduction"
                ],
                "recommendedAction": "Measure heater cartridge resistances (nominal 45 Ω each), replace damaged cartridge, verify zone uniformity ± 2°C."
            },
            {
                "symptomId": "SYM-MOLD-05",
                "symptom": "Parting Line Resin Flash / Excess Bleed Defect",
                "severity": "High",
                "relatedSensors": ["clamping_tonnage", "pressure_hydraulic"],
                "possibleCauses": [
                    "Main clamping cylinder hydraulic pressure droop under injection load",
                    "Tie-bar elongation imbalance causing parting line tilting",
                    "Mold chase insert wear or mechanical debris caught on parting surface"
                ],
                "recommendedAction": "Verify 180-ton clamping force calibration, inspect parting line with feeler gauge (< 5 µm), clean mold faces."
            }
        ],
        "failureScenarios": [
            {
                "scenarioId": "SCEN-MOLD-001",
                "symptom": "Transfer Plunger Tip Friction Binding & Force Surge",
                "sensorPattern": "load_plunger surges from 22.0 to 32.5 kN; pressure_hydraulic elevated to 168 bar",
                "possibleCauses": [
                    "Burnt epoxy resin carbonizing in pot sleeve clearance",
                    "Plunger tip thermal expansion exceeding pot bore tolerance",
                    "Plunger rod misalignment relative to mold base"
                ],
                "severity": "critical",
                "recommendedAction": "Manually retract plungers. Clean pot sleeves with brass brush and release wax. Replace worn plunger tips.",
                "verificationSteps": ["Run empty plunger stroke test", "Verify plunger force < 5 kN at zero load", "Run test shot with dummy leadframe"]
            },
            {
                "scenarioId": "SCEN-MOLD-002",
                "symptom": "Mold Cavity Vacuum Seal Breakdown",
                "sensorPattern": "vacuum_chamber_pressure degrades from 4.2 mbar to 28.5 mbar; micro-void alert",
                "possibleCauses": [
                    "Perimeter fluoroelastomer vacuum seal O-ring baked and embrittled",
                    "Vacuum line check valve sticking open",
                    "Resin flash trapped beneath vacuum seal land"
                ],
                "severity": "high",
                "recommendedAction": "Replace mold perimeter vacuum seal. Clean vacuum sealing groove. Verify vacuum achieves < 8 mbar within 3.0 sec.",
                "verificationSteps": ["Run vacuum decay rate test (< 1.5 mbar/sec)", "Inspect X-ray package samples for voiding"]
            },
            {
                "scenarioId": "SCEN-MOLD-003",
                "symptom": "Hydraulic Proportional Valve Sticking & Pressure Spike",
                "sensorPattern": "pressure_hydraulic rises to 182 bar; transfer velocity stutters during injection",
                "possibleCauses": [
                    "Hydraulic oil varnish deposits on proportional valve spool lands",
                    "Hydraulic oil particle contamination exceeding ISO 18/16/13",
                    "Valve LVDT position feedback sensor drift"
                ],
                "severity": "critical",
                "recommendedAction": "Replace proportional flow control valve. Replace 5 µm high-pressure system filter. Flush hydraulic lines.",
                "verificationSteps": ["Execute hydraulic step-response calibration", "Verify smooth transfer velocity profile"]
            },
            {
                "scenarioId": "SCEN-MOLD-004",
                "symptom": "Mold Chase Cartridge Heater Open Circuit",
                "sensorPattern": "temperature_mold zone 3 drops to 154°C while other zones at 175°C",
                "possibleCauses": [
                    "Internal nickel-chromium wire burnout in cartridge heater",
                    "Terminal connection terminal block screw loosened by thermal cycling",
                    "Solid-state relay gate drive failure"
                ],
                "severity": "high",
                "recommendedAction": "Replace burnt cartridge heater in zone 3. Apply thermal conductive grease. Verify zone reaches 175°C.",
                "verificationSteps": ["Thermal camera scan of mold chase", "Verify temperature uniformity across all cavities ± 2°C"]
            },
            {
                "scenarioId": "SCEN-MOLD-005",
                "symptom": "Hydraulic Reservoir Heat Exchanger Scale Fouling",
                "sensorPattern": "hydraulic_oil_temperature climbs to 64.2°C under continuous 24/7 production",
                "possibleCauses": [
                    "Facility cooling water mineral scale clogging tube-and-shell heat exchanger",
                    "Thermostatic water regulation valve failed in closed position",
                    "Oil circulation pump flow rate reduction"
                ],
                "severity": "high",
                "recommendedAction": "Descale heat exchanger with circulating acid cleaner. Clean cooling water strainer. Verify oil cools to 45°C.",
                "verificationSteps": ["Monitor oil temperature over 5 mold cycles", "Verify stability at 46 ± 2°C"]
            },
            {
                "scenarioId": "SCEN-MOLD-006",
                "symptom": "Tie-Bar Strain Imbalance Causing Parting Line Flash",
                "sensorPattern": "clamping_tonnage reads 195 tons; resin flash detected on right cavity bay",
                "possibleCauses": [
                    "Uneven thermal expansion of tie-bar columns",
                    "Clamping nut lock washer backing off on column 4",
                    "Mold chase mounting base parallel alignment error"
                ],
                "severity": "high",
                "recommendedAction": "Measure tie-bar strain with ultrasonic gauge. Re-torque column nuts to equalize 45 tons per column.",
                "verificationSteps": ["Check parting line contact with pressure-sensitive film (Fuji Prescale)", "Verify even color density across all 4 corners"]
            },
            {
                "scenarioId": "SCEN-MOLD-007",
                "symptom": "Degating Shear Blade Dullness and Package Chipping",
                "sensorPattern": "Ejector motor current climbs by 25%; package leadframe trim burr alert",
                "possibleCauses": [
                    "Tungsten carbide degating cutter blade edge chipped from repeated shearing",
                    "Degate hydraulic cylinder pressure drop",
                    "Leadframe carrier rail guide play"
                ],
                "severity": "medium",
                "recommendedAction": "Replace degating shear blade set. Adjust shear clearance to 0.02 mm.",
                "verificationSteps": ["Inspect 20 degated leadframes under scope", "Verify clean runner separation without gate residue"]
            },
            {
                "scenarioId": "SCEN-MOLD-008",
                "symptom": "Ejector Pin Galling and Mechanical Seizure",
                "sensorPattern": "Ejector cylinder travel timeout alarm; hydraulic pressure brief surge",
                "possibleCauses": [
                    "Resin flash migrating into ejector pin guide bushings",
                    "Ejector pin lubrication breakdown at 175°C operating temperature",
                    "Ejector plate guide pillar binding"
                ],
                "severity": "critical",
                "recommendedAction": "Disassemble ejector plate, clean pin bushings with brass reamer, apply high-temp Krytox grease.",
                "verificationSteps": ["Perform 10 full ejector stroke cycles in dry run", "Verify smooth actuation without sticking"]
            },
            {
                "scenarioId": "SCEN-MOLD-009",
                "symptom": "Pellet Auto-Feeder Vacuum Loader Malfunction",
                "sensorPattern": "Cycle pause alert; pellet feed tray empty sensor triggers false alarm",
                "possibleCauses": [
                    "Pellet hopper suction cup vacuum line cracked",
                    "Pellet dust blocking optical level sensor lens",
                    "Pellet carousel stepper motor drive belt slipped"
                ],
                "severity": "low",
                "recommendedAction": "Clean optical pellet sensor windows with IPA wipe. Inspect feeder vacuum tubing.",
                "verificationSteps": ["Run automatic pellet loading sequence for 10 pots", "Verify correct pellet delivery"]
            },
            {
                "scenarioId": "SCEN-MOLD-010",
                "symptom": "Mold Cavity Air Vent Clogging & Gas Burning",
                "sensorPattern": "Resin scorch burn marks on end cavities; vacuum pressure reading stable",
                "possibleCauses": [
                    "Condensed epoxy wax and silica filler accumulating in 15 µm air vent grooves",
                    "Melamine cleaning interval exceeded 300 shots",
                    "Excessive injection speed compressing entrapped volatiles"
                ],
                "severity": "high",
                "recommendedAction": "Perform 4 melamine cleaning shots. Clean air vent channels manually with soft brass scraper.",
                "verificationSteps": ["Inspect molded package corners under microscope", "Confirm zero dark scorch marks"]
            },
            {
                "scenarioId": "SCEN-MOLD-011",
                "symptom": "Clamping Cylinder Piston Hydraulic Seal Bypass",
                "sensorPattern": "clamping_tonnage decays by 15 tons during high-pressure transfer hold phase",
                "possibleCauses": [
                    "High-pressure hydraulic piston polyurethane U-cup seal extrusion",
                    "Cylinder inner bore micro-scoring",
                    "Clamping pilot-operated check valve seat leakage"
                ],
                "severity": "critical",
                "recommendedAction": "Replace clamping cylinder piston seal set. Inspect pilot check valve.",
                "verificationSteps": ["Perform 15-minute clamping pressure hold test at 180 tons", "Verify pressure drop < 2 bar"]
            },
            {
                "scenarioId": "SCEN-MOLD-012",
                "symptom": "Thermocouple Cold-Junction Compensation Error",
                "sensorPattern": "All mold zone temperatures read 15°C offset from actual surface pyrometer",
                "possibleCauses": [
                    "Temperature controller terminal block isothermal cold-junction RTD open",
                    "Thermocouple extension wire polarity reversed",
                    "Electrical enclosure internal cooling fan failed"
                ],
                "severity": "high",
                "recommendedAction": "Replace temperature input module cold-junction reference sensor. Verify with calibrated thermocouple calibrator.",
                "verificationSteps": ["Compare controller display with NIST-traceable surface probe (must match within ± 1.0°C)"]
            },
            {
                "scenarioId": "SCEN-MOLD-013",
                "symptom": "Mold Chase Bottom Plate Vacuum Gasket Creep",
                "sensorPattern": "vacuum_chamber_pressure fluctuates erratically between 6 and 22 mbar",
                "possibleCauses": [
                    "Gasket retaining groove corner expansion",
                    "Residual epoxy pellet fragments pinching gasket perimeter",
                    "Vacuum line manifold quick-disconnect coupling loose"
                ],
                "severity": "medium",
                "recommendedAction": "Inspect gasket retention groove, clean debris, replace silicone profile seal.",
                "verificationSteps": ["Verify vacuum seal seating with vacuum test cycle (< 8 mbar)"]
            }
        ]
    },

    # ---------------------------------------------------------------------
    # 5. IC TESTER & SORTER
    # ---------------------------------------------------------------------
    {
        "filename": "ic-tester-sorter",
        "machine": {
            "name": "High-Speed Automated IC Tester & Pick-and-Place Sorter",
            "type": "ic_tester",
            "prototypeMachineId": "ATE-001",
            "manualId": "VAI-MAN-ATE-001",
            "version": "1.0",
            "generatedDate": "2026-08-26",
            "documentStatus": "Synthetic Prototype Technical Manual",
            "purpose": "VectorAI Demonstration and Development",
            "disclaimer": DISCLAIMER_TEXT,
            "processStage": "Final Electrical Test & Sort",
            "description": (
                "Automated Test Equipment (ATE) system integrated with a high-throughput pick-and-place device handler, "
                "tri-temperature environmental conditioning chamber, and multi-bin sorter designed to execute parametric "
                "and functional electrical validation at speed, sorting verified ICs into pass/fail bins or tape-and-reel carriers."
            ),
            "manufacturingProcess": (
                "Packaged integrated circuits are fed from input tubes, trays, or bulk bowls. The high-speed robotic handler picks "
                "devices, brings them to temperature in an environmental chamber (-40°C to +125°C), and compresses them into precision "
                "pogo-pin test sockets on the Device-Under-Test (DUT) interface board. The ATE instrumentation executes DC parametric, "
                "AC timing, and functional RF/digital tests in milliseconds. Tested ICs are sorted into designated bin categories or transferred "
                "to high-speed tape-and-reel packaging."
            ),
            "subsystems": [
                "Automated High-Speed Pick-and-Place Device Handler & Shuttle",
                "Precision DUT Test Socket Interface & Pogo Pin Array",
                "Tri-Temperature Environmental Conditioning Chamber",
                "High-Speed Parametric Measurement Unit (PMU) & Pin Electronics",
                "2D DataMatrix Optical Inspection & Laser Marking Station",
                "Multi-Bin Sorting Shuttles & Tape-and-Reel Packaging Output"
            ]
        },
        "components": [
            {
                "name": "DUT Interface Socket & Pogo Pin Block",
                "function": "Provides temporary, highly reliable electrical contact to IC package pins/balls with minimal contact resistance and signal distortion.",
                "importantParameters": "Pogo pin contact resistance (mΩ), compression stroke force (N), contact lifecycle count, socket surface temperature (°C).",
                "degradationIndicators": "Contact resistance elevation (>85 mΩ), false open-circuit test failures, pogo pin spring fatigue, socket debris buildup."
            },
            {
                "name": "High-Speed Handler Robotic Carriage",
                "function": "Transfers untested chips to test sockets and sorts tested devices into pass/fail bin positions at accelerations up to 15G.",
                "importantParameters": "Carriage linear vibration (mm/s), positioning repeatability (µm), vacuum pickup seal integrity.",
                "degradationIndicators": "Handler vibration spikes (>0.90 mm/s), mechanical positioning jitter, device dropping, track belt slack."
            },
            {
                "name": "Socket Actuator Press",
                "function": "Applies programmable compression force to seat device pins firmly into pogo pin matrix during test execution.",
                "importantParameters": "Actuator compression force (N), descent velocity (mm/s), force planarity balance.",
                "degradationIndicators": "Actuator force creep (>75 N), lead deformation on packages, pneumatic seal leakage."
            },
            {
                "name": "Tri-Temp Environmental Chamber",
                "function": "Maintains precise device testing temperature from cold test (-40°C) to room temp (25°C) to hot burn-in (125°C).",
                "importantParameters": "Chamber air temperature (°C), thermal airflow rate (CFM), thermocouple accuracy.",
                "degradationIndicators": "Chamber temperature drift (>35°C in room test), fan bearing noise, thermal gradient across DUT sites."
            },
            {
                "name": "Sorting Shuttle & Tape-and-Reel Unit",
                "function": "Directs tested ICs into up to 8 bin classes and seals passing units into carrier tape with heated cover tape shoe.",
                "importantParameters": "Sorting accuracy (µm), sealing shoe temperature (°C), tape peel force (N).",
                "degradationIndicators": "Sorting positioning error (>15 µm), bin mis-sorting, carrier tape jam, sealing shoe temperature decay."
            }
        ],
        "sensors": [
            {
                "sensorId": "vibration_handler",
                "name": "Handler Vibration",
                "unit": "mm/s",
                "purpose": "Measures X/Y/Z linear motor carriage vibration on the high-speed device transfer handler.",
                "minScale": 0.0,
                "maxScale": 2.5,
                "normalRange": [0.20, 0.60],
                "warningRange": [0.60, 0.90],
                "criticalRange": [0.90, 2.50],
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "temperature_chamber",
                "name": "Test Chamber Temp",
                "unit": "°C",
                "purpose": "Measures ambient thermal condition inside the device-under-test socket environmental enclosure.",
                "minScale": -40.0,
                "maxScale": 150.0,
                "normalRange": [22.0, 28.0],
                "warningRange": [28.0, 35.0],
                "criticalRange": [35.0, 150.0],
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "load_actuator",
                "name": "Socket Actuator Load",
                "unit": "N",
                "purpose": "Measures contact compression force exerted when seating chips into the pogo pin test socket.",
                "minScale": 0.0,
                "maxScale": 120.0,
                "normalRange": [40.0, 60.0],
                "warningRange": [60.0, 75.0],
                "criticalRange": [75.0, 120.0],
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "contact_resistance",
                "name": "Pogo Pin Contact Resistance",
                "unit": "mΩ",
                "purpose": "Monitors the average electrical loop resistance across critical power and signal test pins.",
                "minScale": 0.0,
                "maxScale": 200.0,
                "normalRange": [25.0, 55.0],
                "warningRange": [55.0, 85.0],
                "criticalRange": [85.0, 200.0],
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "sorting_accuracy",
                "name": "Bin Sorting Positional Error",
                "unit": "µm",
                "purpose": "Measures positional placement offset when inserting tested devices into sorting output bins.",
                "minScale": 0.0,
                "maxScale": 40.0,
                "normalRange": [0.0, 8.0],
                "warningRange": [8.0, 15.0],
                "criticalRange": [15.0, 40.0],
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "test_socket_temperature",
                "name": "Socket Surface Temp",
                "unit": "°C",
                "purpose": "Monitors localized surface heating of the DUT socket elastomer/PEEK body during continuous testing.",
                "minScale": 10.0,
                "maxScale": 80.0,
                "normalRange": [24.0, 32.0],
                "warningRange": [32.0, 40.0],
                "criticalRange": [40.0, 80.0],
                "direction": "HIGHER_IS_WORSE"
            }
        ],
        "thresholds": [
            {
                "sensorId": "vibration_handler",
                "sensorName": "Handler Vibration",
                "unit": "mm/s",
                "normal": {"min": 0.20, "max": 0.60, "description": "Smooth handler carriage traverse and pick-and-place indexing."},
                "warning": {"min": 0.60, "max": 0.90, "description": "Linear guide rail dry friction or belt tension relaxation."},
                "critical": {"min": 0.90, "max": 2.50, "description": "Severe mechanical guide binding or loose carriage bearings causing device jams."},
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "temperature_chamber",
                "sensorName": "Test Chamber Temp",
                "unit": "°C",
                "normal": {"min": 22.0, "max": 28.0, "description": "Stable room-temperature parametric testing thermal envelope."},
                "warning": {"min": 28.0, "max": 35.0, "description": "Chamber air circulation fan degradation or cleanroom thermal drift."},
                "critical": {"min": 35.0, "max": 150.0, "description": "Thermal condition out of specification causing parametric test yield fallout."},
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "load_actuator",
                "sensorName": "Socket Actuator Load",
                "unit": "N",
                "normal": {"min": 40.0, "max": 60.0, "description": "Nominal compression seating pogo pins to optimal working travel."},
                "warning": {"min": 60.0, "max": 75.0, "description": "Actuator friction increase or socket guide pin resistance."},
                "critical": {"min": 75.0, "max": 120.0, "description": "Excessive force causing package lead bending or pogo pin destruction."},
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "contact_resistance",
                "sensorName": "Pogo Pin Contact Resistance",
                "unit": "mΩ",
                "normal": {"min": 25.0, "max": 55.0, "description": "Clean gold/palladium-alloy contact interfaces with minimal voltage drop."},
                "warning": {"min": 55.0, "max": 85.0, "description": "Pogo pin tip oxidation or solder plating transfer buildup."},
                "critical": {"min": 85.0, "max": 200.0, "description": "Severe contact degradation causing false electrical test failures (Yield crash)."},
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "sorting_accuracy",
                "sensorName": "Bin Sorting Positional Error",
                "unit": "µm",
                "normal": {"min": 0.0, "max": 8.0, "description": "High-precision pocket placement into tape pocket or tray."},
                "warning": {"min": 8.0, "max": 15.0, "description": "Linear belt stretch or optical encoder scale dust fouling."},
                "critical": {"min": 15.0, "max": 40.0, "description": "High risk of device jamming on pocket walls and lead damage."},
                "direction": "HIGHER_IS_WORSE"
            },
            {
                "sensorId": "test_socket_temperature",
                "sensorName": "Socket Surface Temp",
                "unit": "°C",
                "normal": {"min": 24.0, "max": 32.0, "description": "Optimal thermal baseline during high-frequency DUT switching."},
                "warning": {"min": 32.0, "max": 40.0, "description": "Localized ohmic heating from elevated pin contact resistance."},
                "critical": {"min": 40.0, "max": 80.0, "description": "Dangerous socket heating risking PEEK body softening and pin misregistration."},
                "direction": "HIGHER_IS_WORSE"
            }
        ],
        "operatingConditions": {
            "ambientTemperature": "20.0 - 23.0 °C (Cleanroom ISO Class 7)",
            "relativeHumidity": "40% - 60% RH non-condensing (ESD safe environment)",
            "normalOperatingTemperature": "25.0 °C (Room temp test) / -40.0 to +125.0 °C (Tri-Temp modes)",
            "normalOperatingPressure": "0.50 - 0.60 MPa (CDA pneumatic supply)",
            "normalOperatingSpeed": "8,000 - 15,000 Units Per Hour (UPH)",
            "normalCycleTime": "0.24 - 0.45 seconds per tested device",
            "normalOperatingHours": "20 - 24 hours/day continuous",
            "recommendedOperatingConditions": "Automated pogo pin cleaning brush cycle every 5,000 devices; socket life check every 250,000 cycles.",
            "maximumContinuousOperation": "120 hours before required socket electrical calibration and alignment verification"
        },
        "maintenance": [
            {
                "component": "DUT Pogo Pin Test Socket Block",
                "recommendedMaintenanceIntervalHours": 100,
                "expectedServiceLifeHours": 1500,
                "maintenanceAction": "Run automated abrasive brush cycle, clean pin tips with isopropyl alcohol swab, check contact resistance.",
                "procedureSummary": "Use Kelvin 4-wire micro-ohmmeter on gold test coupon. Replace socket when average resistance > 60 mΩ."
            },
            {
                "component": "Handler Robotic Linear Drive Belts & Guides",
                "recommendedMaintenanceIntervalHours": 500,
                "expectedServiceLifeHours": 6000,
                "maintenanceAction": "Clean linear rails, lubricate guide bearings with cleanroom synthetic grease, check belt tension with sonic meter.",
                "procedureSummary": "Verify timing belt tension is 85 ± 5 Hz using optical/acoustic tension meter. Inspect belt teeth for wear."
            },
            {
                "component": "Socket Actuator Pneumatic Press",
                "recommendedMaintenanceIntervalHours": 350,
                "expectedServiceLifeHours": 4000,
                "maintenanceAction": "Inspect actuator guide bushings, replace pneumatic cylinder seals, calibrate compression load cell.",
                "procedureSummary": "Place load cell calibration tool into socket nest; verify actuator delivers exactly 50 ± 2 N."
            },
            {
                "component": "Tri-Temp Thermal Circulation System",
                "recommendedMaintenanceIntervalHours": 750,
                "expectedServiceLifeHours": 8000,
                "maintenanceAction": "Clean air circulation blower fans, check thermoelectric Peltier modules, calibrate RTD temperature sensors.",
                "procedureSummary": "Place 4-wire platinum RTD logger into chamber; verify thermal uniformity across all 4 test sites ± 0.5°C."
            },
            {
                "component": "Tape-and-Reel Sealing Shoe & Cutter",
                "recommendedMaintenanceIntervalHours": 250,
                "expectedServiceLifeHours": 3000,
                "maintenanceAction": "Clean Teflon sealing shoe surface, check heater cartridge, perform cover tape peel force test.",
                "procedureSummary": "Run peel force tester on 500 mm of sealed carrier tape (verify peel force is 30 - 80 gf per EIA-481 standard)."
            }
        ],
        "degradationIndicators": [
            {
                "parameter": "Pogo Pin Contact Resistance",
                "normalCondition": "Average pin resistance between 25 and 55 mΩ with low variance.",
                "degradedCondition": "Contact resistance climbs to 55 - 85 mΩ due to solder transfer and tip oxidation.",
                "criticalCondition": "Resistance exceeds 85 mΩ; causes false parametric test bin failures and yield crashes.",
                "indicatorMechanism": "Direct physical indication of solder intermetallic transfer, noble metal coating wear, or internal pogo spring fatigue."
            },
            {
                "parameter": "Handler Carriage Vibration",
                "normalCondition": "Vibration amplitude 0.20 - 0.60 mm/s during high-speed indexing.",
                "degradedCondition": "Vibration climbs to 0.60 - 0.90 mm/s due to guide rail dry friction or belt slack.",
                "criticalCondition": "Vibration exceeds 0.90 mm/s; mechanical resonance causes device pickup misregistration.",
                "indicatorMechanism": "Indicates mechanical guide wear, linear motor bearing play, or timing belt tooth wear."
            },
            {
                "parameter": "Socket Actuator Load",
                "normalCondition": "Compression force maintains nominal 40 - 60 N.",
                "degradedCondition": "Force climbs to 60 - 75 N as actuator friction increases.",
                "criticalCondition": "Force exceeds 75 N; high risk of crushing delicate IC package leads.",
                "indicatorMechanism": "Indicates pneumatic guide cylinder seal friction, mechanical guide binding, or load cell drift."
            },
            {
                "parameter": "Test Chamber Temperature",
                "normalCondition": "Maintained strictly at 22 - 28 °C during room temp validation.",
                "degradedCondition": "Temperature drifts to 28 - 35 °C.",
                "criticalCondition": "Temperature exceeds 35 °C; thermal drift alters semiconductor bandgap parameters.",
                "indicatorMechanism": "Indicates blower fan failure, thermal insulation loss, or environmental chamber control loop failure."
            },
            {
                "parameter": "Bin Sorting Positional Error",
                "normalCondition": "Pocket placement offset below 8 µm.",
                "degradedCondition": "Positional error increases to 8 - 15 µm.",
                "criticalCondition": "Positional error exceeds 15 µm; device edges catch on pocket walls causing jams.",
                "indicatorMechanism": "Indicates timing belt elongation, optical encoder scale contamination, or theta rotational backlash."
            }
        ],
        "rulModel": {
            "baseUsefulLifeHours": 6000,
            "formulaDescription": "Deterministic multi-parameter linear degradation model for IC Tester & Sorter. Weights sum to 1.00.",
            "weightsSum": 1.00,
            "parameters": [
                {
                    "parameter": "Contact Resistance",
                    "sensorId": "contact_resistance",
                    "sensorName": "Pogo Pin Contact Resistance",
                    "unit": "mΩ",
                    "weight": 0.30,
                    "healthyLimit": 55.0,
                    "criticalLimit": 110.0,
                    "direction": "HIGHER_IS_WORSE"
                },
                {
                    "parameter": "Handler Vibration",
                    "sensorId": "vibration_handler",
                    "sensorName": "Handler Vibration",
                    "unit": "mm/s",
                    "weight": 0.25,
                    "healthyLimit": 0.60,
                    "criticalLimit": 1.30,
                    "direction": "HIGHER_IS_WORSE"
                },
                {
                    "parameter": "Actuator Load",
                    "sensorId": "load_actuator",
                    "sensorName": "Socket Actuator Load",
                    "unit": "N",
                    "weight": 0.20,
                    "healthyLimit": 60.0,
                    "criticalLimit": 90.0,
                    "direction": "HIGHER_IS_WORSE"
                },
                {
                    "parameter": "Chamber Temperature",
                    "sensorId": "temperature_chamber",
                    "sensorName": "Test Chamber Temp",
                    "unit": "°C",
                    "weight": 0.15,
                    "healthyLimit": 28.0,
                    "criticalLimit": 45.0,
                    "direction": "HIGHER_IS_WORSE"
                },
                {
                    "parameter": "Sorting Positional Error",
                    "sensorId": "sorting_accuracy",
                    "sensorName": "Bin Sorting Positional Error",
                    "unit": "µm",
                    "weight": 0.10,
                    "healthyLimit": 8.0,
                    "criticalLimit": 22.0,
                    "direction": "HIGHER_IS_WORSE"
                }
            ]
        },
        "symptoms": [
            {
                "symptomId": "SYM-ATE-01",
                "symptom": "Pogo Pin Contact Resistance Elevation / False Open Fails",
                "severity": "Critical",
                "relatedSensors": ["contact_resistance", "test_socket_temperature"],
                "possibleCauses": [
                    "Solder and tin plating transfer onto gold-plated pogo pin crown tips",
                    "Pogo pin internal helical spring fatigue or contact micro-oxidation",
                    "Dust and resin particulate accumulation inside socket guide holes"
                ],
                "recommendedAction": "Run automated diamond cleaning brush sequence. If resistance > 60 mΩ persists, replace pogo pin socket insert."
            },
            {
                "symptomId": "SYM-ATE-02",
                "symptom": "Handler Carriage Vibration Surge / Pick Jitter",
                "severity": "High",
                "relatedSensors": ["vibration_handler", "sorting_accuracy"],
                "possibleCauses": [
                    "Linear guide rail dry friction and cleanroom grease breakdown",
                    "Timing belt tension relaxation or tooth pitch wear",
                    "Pick-and-place head mounting screw looseness"
                ],
                "recommendedAction": "Clean linear guides, lubricate with cleanroom grease, adjust timing belt tension to 85 Hz with sonic meter."
            },
            {
                "symptomId": "SYM-ATE-03",
                "symptom": "Socket Actuator High Compression Force / Lead Bending",
                "severity": "High",
                "relatedSensors": ["load_actuator"],
                "possibleCauses": [
                    "Pneumatic cylinder guide rod mechanical binding",
                    "Actuator downward stroke limit stop set too deep",
                    "Foreign particle trapped between device nest and socket face"
                ],
                "recommendedAction": "Inspect socket nest for debris, verify actuator load calibration (50 N), lubricate cylinder guide pins."
            },
            {
                "symptomId": "SYM-ATE-04",
                "symptom": "Test Chamber Temperature Drift / Thermal Yield Shift",
                "severity": "Medium",
                "relatedSensors": ["temperature_chamber"],
                "possibleCauses": [
                    "Environmental chamber air circulation fan bearing wear or failure",
                    "Thermoelectric Peltier module thermal paste degradation",
                    "Chamber thermal door seal gasket air leak"
                ],
                "recommendedAction": "Inspect circulation blower, check Peltier drive current, verify 25.0°C chamber temperature stability."
            },
            {
                "symptomId": "SYM-ATE-05",
                "symptom": "Tape-and-Reel Pocket Placement Jam / Mis-Sort",
                "severity": "High",
                "relatedSensors": ["sorting_accuracy"],
                "possibleCauses": [
                    "Sorting shuttle X/Y positioning belt stretch or encoder skip",
                    "Carrier tape sprocket indexing pin wear",
                    "Vacuum pickup collet tip wear causing device tilt during placement"
                ],
                "recommendedAction": "Re-teach tape pocket pickup coordinates, replace vacuum collet, clean optical encoder strip."
            }
        ],
        "failureScenarios": [
            {
                "scenarioId": "SCEN-ATE-001",
                "symptom": "Pogo Pin Solder Transfer & Contact Resistance Spike",
                "sensorPattern": "contact_resistance surges from 38 mΩ to 92 mΩ; false Continuity Fail rate climbs to 4.2%",
                "possibleCauses": [
                    "Lead-free tin plating transferring from device balls to pogo crown tips",
                    "Internal spring relaxation after 200,000 mechanical actuations",
                    "Socket guide plate pocket contamination"
                ],
                "severity": "critical",
                "recommendedAction": "Execute 20 strokes with abrasive cleaning coupon. Replace socket insert if resistance remains > 60 mΩ.",
                "verificationSteps": ["Run automated socket diagnostic self-test with gold coupon", "Verify pin resistance < 40 mΩ across all channels"]
            },
            {
                "scenarioId": "SCEN-ATE-002",
                "symptom": "Handler Carriage Timing Belt Tooth Wear & Vibration",
                "sensorPattern": "vibration_handler rises from 0.42 to 0.94 mm/s; sorting_accuracy error jumps to 16.5 µm",
                "possibleCauses": [
                    "Kevlar timing belt tooth shear wear after 2,000 operating hours",
                    "Belt tension dropped below 60 Hz",
                    "Linear guide bearing ball recirculation fatigue"
                ],
                "severity": "high",
                "recommendedAction": "Replace timing belt, adjust tension to 85 Hz using acoustic meter, clean and re-grease linear rails.",
                "verificationSteps": ["Execute high-speed multi-point positioning test", "Verify repeatability < 5.0 µm"]
            },
            {
                "scenarioId": "SCEN-ATE-003",
                "symptom": "Socket Actuator Cylinder Friction Binding",
                "sensorPattern": "load_actuator climbs from 50 N to 78 N; cycle time delay alert",
                "possibleCauses": [
                    "Pneumatic cylinder piston rod seal friction and contamination",
                    "Socket guide bushing misaligned",
                    "Force sensor amplifier baseline drift"
                ],
                "severity": "high",
                "recommendedAction": "Replace pneumatic actuator seal kit. Re-align socket guide pins. Calibrate force sensor.",
                "verificationSteps": ["Perform 50 actuation cycles with load cell tool", "Verify load is 50 ± 2 N consistently"]
            },
            {
                "scenarioId": "SCEN-ATE-004",
                "symptom": "Test Chamber Air Blower Fan Bearing Failure",
                "sensorPattern": "temperature_chamber rises from 24.5°C to 36.8°C; thermal gradient alert",
                "possibleCauses": [
                    "Circulation fan brushless motor bearing seizure",
                    "Peltier cooling heat sink fins clogged with dust",
                    "Chamber intake air filter restriction"
                ],
                "severity": "medium",
                "recommendedAction": "Replace circulation blower fan. Clean heat sink radiator fins. Replace intake air filter.",
                "verificationSteps": ["Log chamber temperature over 20 minutes", "Verify temperature stays at 25.0 ± 0.5°C"]
            },
            {
                "scenarioId": "SCEN-ATE-005",
                "symptom": "Tape-and-Reel Sealing Shoe Temperature Decay",
                "sensorPattern": "Cover tape peel force drops below 20 gf (carrier open defect risk)",
                "possibleCauses": [
                    "Sealing shoe heater cartridge resistance increase",
                    "Teflon tape build-up on sealing shoe blade",
                    "Thermocouple probe loose"
                ],
                "severity": "high",
                "recommendedAction": "Clean sealing shoe with brass brush, replace heater element if resistance > 120 Ω, verify 160°C setpoint.",
                "verificationSteps": ["Run peel force test on 1 meter of sealed tape (target 45 ± 10 gf)"]
            },
            {
                "scenarioId": "SCEN-ATE-006",
                "symptom": "Vacuum Pickup Collet Tip Contamination and Device Drop",
                "sensorPattern": "Handler pickup error rate climbs to 1.8%; vibration_handler nominal",
                "possibleCauses": [
                    "Silicone suction cup rim coated with package mold compound dust",
                    "Vacuum solenoid valve response delayed",
                    "Vacuum generator venturi clogged"
                ],
                "severity": "high",
                "recommendedAction": "Clean suction cup tips with IPA swab. Inspect vacuum level (min -75 kPa).",
                "verificationSteps": ["Run 200 dummy devices in loop mode", "Verify zero drop errors"]
            },
            {
                "scenarioId": "SCEN-ATE-007",
                "symptom": "2D DataMatrix Laser Reader Optical Blur",
                "sensorPattern": "Vision scan timeout increases by 15 ms per device; occasional unreadable ID",
                "possibleCauses": [
                    "Optical scanner window coated with cleanroom dust film",
                    "Laser scanner focal distance drifted due to bracket vibration",
                    "LED illumination ring half-channel failure"
                ],
                "severity": "medium",
                "recommendedAction": "Clean scanner optical window with lens tissue. Recalibrate focal distance and illumination.",
                "verificationSteps": ["Test scan 100 sample 2D barcodes", "Verify 100% first-pass read rate"]
            },
            {
                "scenarioId": "SCEN-ATE-008",
                "symptom": "Pogo Pin Breakage Causing Short Circuit on DUT Site",
                "sensorPattern": "contact_resistance on Channel 4 reads 0.0 mΩ (short) or infinite (open)",
                "possibleCauses": [
                    "Mechanical fatigue fracture of internal pin spring",
                    "Foreign metallic burr bridging adjacent socket pins",
                    "Socket guide plate cracked"
                ],
                "severity": "critical",
                "recommendedAction": "Remove socket block immediately. Replace broken pogo pin using pin insertion tool.",
                "verificationSteps": ["Inspect all pins with 50x microscope", "Perform pin-to-pin isolation test (> 100 MΩ)"]
            },
            {
                "scenarioId": "SCEN-ATE-009",
                "symptom": "Handler Theta Rotation Backlash & Misalignment",
                "sensorPattern": "sorting_accuracy theta error increases to ± 1.2 degrees",
                "possibleCauses": [
                    "Harmonic drive theta gearbox wear",
                    "Theta stepper motor coupling set screw loose",
                    "Rotary optical home sensor dirty"
                ],
                "severity": "medium",
                "recommendedAction": "Tighten motor shaft coupling set screw with threadlocker. Clean home optical sensor.",
                "verificationSteps": ["Run theta rotation calibration routine", "Verify angular repeatability < 0.1 deg"]
            },
            {
                "scenarioId": "SCEN-ATE-010",
                "symptom": "Electrostatic Discharge (ESD) Grounding Resistance Drift",
                "sensorPattern": "ESD grounding monitor alert; resistance climbs from 0.8 Ω to 15.4 Ω",
                "possibleCauses": [
                    "Handler wrist strap grounding wire braid broken",
                    "Conductive table mat ground snap corroded",
                    "Socket grounding bus connection loose"
                ],
                "severity": "critical",
                "recommendedAction": "Replace ESD grounding cable. Clean ground lug interface with wire brush. Verify resistance < 1.0 Ω.",
                "verificationSteps": ["Measure point-to-ground resistance with calibrated megohmmeter (< 1.0 Ω)"]
            },
            {
                "scenarioId": "SCEN-ATE-011",
                "symptom": "Carrier Tape Sprocket Hole Indexer Tooth Wear",
                "sensorPattern": "Tape feeder jam alert; sorting_accuracy in tape direction drifts ± 20 µm",
                "possibleCauses": [
                    "Sprocket wheel teeth worn down from continuous plastic tape indexing",
                    "Feeder advance stepper belt loose",
                    "Cover tape peel tension too high pulling carrier backward"
                ],
                "severity": "high",
                "recommendedAction": "Replace indexing sprocket wheel. Calibrate tape advance pitch to 4.00 ± 0.02 mm.",
                "verificationSteps": ["Advance 100 tape pockets", "Verify pocket center alignment with vision camera"]
            },
            {
                "scenarioId": "SCEN-ATE-012",
                "symptom": "DUT Test Head Docking Latch Play",
                "sensorPattern": "contact_resistance values fluctuate across all pins when handler vibrates",
                "possibleCauses": [
                    "Pneumatic docking latch mechanism air pressure low",
                    "Docking alignment guide pins worn",
                    "Test head stiffener frame clamping torque uneven"
                ],
                "severity": "high",
                "recommendedAction": "Inspect docking latch air pressure (min 0.55 MPa). Replace worn docking guide pins.",
                "verificationSteps": ["Execute docking repeatable contact resistance test", "Verify stability < ± 2 mΩ"]
            },
            {
                "scenarioId": "SCEN-ATE-013",
                "symptom": "Socket Elastomer Body Localized Overheating",
                "sensorPattern": "test_socket_temperature climbs from 28°C to 44.5°C during continuous DC stress test",
                "possibleCauses": [
                    "High current power pin pogo resistance elevated causing I²R ohmic heating",
                    "Socket thermal cooling airflow obstructed",
                    "Continuous high duty cycle testing without dwell time"
                ],
                "severity": "high",
                "recommendedAction": "Replace high-current pogo pins with heavy-duty crown pins. Clean socket bottom cooling channels.",
                "verificationSteps": ["Thermal camera inspection of socket under full test load", "Verify max temp < 32°C"]
            }
        ]
    }
]

# -------------------------------------------------------------------------
# NUMBERED CANVAS FOR "Page X of Y" AND RUNNING HEADERS/FOOTERS
# -------------------------------------------------------------------------

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_header_footer(self, page_count):
        if self._pageNumber == 1:
            # Skip cover page
            return

        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#475569"))

        # Header
        machine_id = getattr(self, "machine_id", "VectorAI")
        manual_id = getattr(self, "manual_id", "VAI-MAN")
        doc_title = getattr(self, "doc_title", "Technical Manual")
        
        self.drawString(54, 11 * inch - 36, f"VECTORAI TECHNICAL MANUAL  |  {machine_id} ({manual_id})")
        self.drawRightString(8.5 * inch - 54, 11 * inch - 36, doc_title.upper())
        
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 11 * inch - 42, 8.5 * inch - 54, 11 * inch - 42)

        # Footer
        self.line(54, 45, 8.5 * inch - 54, 45)
        self.setFont("Helvetica-Bold", 7.5)
        self.setFillColor(colors.HexColor("#DC2626"))
        self.drawString(54, 32, "SYNTHETIC PROTOTYPE MANUAL — FOR VECTORAI DEMONSTRATION & DEVELOPMENT ONLY")
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#475569"))
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(8.5 * inch - 54, 32, page_text)
        self.restoreState()


# -------------------------------------------------------------------------
# PDF GENERATOR
# -------------------------------------------------------------------------

def build_pdf_manual(mdata, output_pdf_path):
    doc = SimpleDocTemplate(
        output_pdf_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    PRIMARY = colors.HexColor("#0F172A")    # Slate 900
    SECONDARY = colors.HexColor("#1E293B")  # Slate 800
    ACCENT = colors.HexColor("#2563EB")     # Blue 600
    BORDER_COLOR = colors.HexColor("#CBD5E1") # Slate 300
    LIGHT_BG = colors.HexColor("#F8FAFC")   # Slate 50
    WARN_BG = colors.HexColor("#FEF2F2")    # Red 50
    WARN_BORDER = colors.HexColor("#F87171")# Red 400

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=PRIMARY,
        spaceAfter=8
    )
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#475569"),
        spaceAfter=15
    )
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=PRIMARY,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )
    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=SECONDARY,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )
    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1E293B"),
        spaceAfter=6
    )
    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=3
    )
    table_text = ParagraphStyle(
        'TableText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#0F172A")
    )
    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.white
    )
    disclaimer_style = ParagraphStyle(
        'DisclaimerText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#991B1B")
    )

    story = []

    m = mdata["machine"]
    machine_name = m["name"]
    machine_id = m["prototypeMachineId"]
    manual_id = m["manualId"]
    doc_ver = m["version"]
    gen_date = m["generatedDate"]

    # ---------------------------------------------------------------------
    # COVER PAGE
    # ---------------------------------------------------------------------
    story.append(Spacer(1, 20))
    story.append(Paragraph("VECTOR.AI INDUSTRIAL KNOWLEDGE BASE", ParagraphStyle('TopHeader', fontName='Helvetica-Bold', fontSize=10, textColor=ACCENT, spaceAfter=8)))
    story.append(Paragraph(f"Machine Technical Manual: {machine_name}", title_style))
    story.append(Paragraph(f"Domain Intelligence & Anomaly Diagnostics Specification for Model {machine_id}", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=ACCENT, spaceAfter=15))

    # Meta Table on Cover
    meta_table_data = [
        [Paragraph("<b>Document Identifier:</b>", table_text), Paragraph(manual_id, table_text), Paragraph("<b>Document Version:</b>", table_text), Paragraph(f"v{doc_ver}", table_text)],
        [Paragraph("<b>Prototype Machine ID:</b>", table_text), Paragraph(machine_id, table_text), Paragraph("<b>Generation Date:</b>", table_text), Paragraph(gen_date, table_text)],
        [Paragraph("<b>Process Stage:</b>", table_text), Paragraph(m["processStage"], table_text), Paragraph("<b>Document Status:</b>", table_text), Paragraph(m["documentStatus"], table_text)],
        [Paragraph("<b>Target Platform:</b>", table_text), Paragraph("VectorAI Predictive Engine", table_text), Paragraph("<b>Knowledge Role:</b>", table_text), Paragraph("Primary Domain Source", table_text)],
    ]
    meta_table = Table(meta_table_data, colWidths=[1.5*inch, 2.0*inch, 1.5*inch, 2.0*inch])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_BG),
        ('BOX', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 15))

    # Prominent Disclaimer Box
    disclaimer_box_data = [[
        Paragraph(
            "<b>SYNTHETIC PROTOTYPE TECHNICAL MANUAL — VECTORAI SYSTEM SPECIFICATION</b><br/><br/>"
            "This document is artificially generated specifically for the VectorAI predictive maintenance "
            "demonstration, knowledge base retrieval (RAG), formula-based RUL calculation, and automated diagnostics.<br/><br/>"
            "The specifications, thresholds, sensor values, service-life hours, maintenance intervals, and operating parameters "
            "are synthetic and must NOT be used for real-world physical industrial equipment operation or maintenance.",
            disclaimer_style
        )
    ]]
    disclaimer_table = Table(disclaimer_box_data, colWidths=[7.0*inch])
    disclaimer_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), WARN_BG),
        ('BOX', (0, 0), (-1, -1), 1.5, WARN_BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ]))
    story.append(disclaimer_table)
    story.append(Spacer(1, 15))

    # Document Architecture Outline
    story.append(Paragraph("<b>Table of Contents / Knowledge Structure:</b>", h2_style))
    toc_data = [
        [Paragraph("1. Document Information & Disclaimer", table_text), Paragraph("8. Degradation Indicators & Physics", table_text)],
        [Paragraph("2. Machine Overview & Architecture", table_text), Paragraph("9. Deterministic Formula-Based RUL Model", table_text)],
        [Paragraph("3. Major Subsystems & Components", table_text), Paragraph("10. Troubleshooting & Failure Symptoms", table_text)],
        [Paragraph("4. Sensors & Telemetry Configuration", table_text), Paragraph("11. Diagnostic Knowledge & Failure Scenarios", table_text)],
        [Paragraph("5. Sensor Threshold Definitions", table_text), Paragraph("12. Standard Maintenance Procedures", table_text)],
        [Paragraph("6. Standard Operating Conditions", table_text), Paragraph("13. Document Revision History", table_text)],
        [Paragraph("7. Maintenance Intervals & Service Life", table_text), Paragraph("14. VectorAI RAG Integration Notes", table_text)],
    ]
    toc_table = Table(toc_data, colWidths=[3.5*inch, 3.5*inch])
    toc_table.setStyle(TableStyle([
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    story.append(toc_table)

    story.append(PageBreak())

    # ---------------------------------------------------------------------
    # SECTION 1: DOCUMENT INFORMATION
    # ---------------------------------------------------------------------
    story.append(Paragraph("1. Document Information & Governance", h1_style))
    story.append(Paragraph(
        f"This technical document provides authoritative machine specifications for <b>{machine_name}</b> "
        f"(Identifier: <code>{machine_id}</code>, Manual ID: <code>{manual_id}</code>). "
        "It establishes the single source of truth for the VectorAI platform, defining telemetry sensor schemas, "
        "threshold limits, maintenance intervals, and deterministic degradation parameters.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Governance Principle:</b> All diagnostic algorithms, RUL models, and threshold engines in VectorAI "
        "must strictly adhere to the limits and parameters defined herein. No machine learning regressions or stochastic models "
        "are permitted in the primary RUL calculation pipeline.",
        body_style
    ))

    # ---------------------------------------------------------------------
    # SECTION 2: MACHINE OVERVIEW
    # ---------------------------------------------------------------------
    story.append(Paragraph("2. Machine Overview & Manufacturing Process", h1_style))
    story.append(Paragraph(f"<b>Process Stage:</b> {m['processStage']}", h2_style))
    story.append(Paragraph(m["description"], body_style))
    story.append(Paragraph("<b>Detailed Process Flow:</b>", h2_style))
    story.append(Paragraph(m["manufacturingProcess"], body_style))
    
    story.append(Paragraph("<b>Key Machine Subsystems:</b>", h2_style))
    for sub in m["subsystems"]:
        story.append(Paragraph(f"• <b>{sub}</b>", bullet_style))

    story.append(Spacer(1, 8))

    # ---------------------------------------------------------------------
    # SECTION 3: MAJOR COMPONENTS TABLE
    # ---------------------------------------------------------------------
    story.append(Paragraph("3. Major Components & Degradation Characteristics", h1_style))
    comp_table_data = [[
        Paragraph("Component", table_header),
        Paragraph("Primary Function", table_header),
        Paragraph("Important Parameters", table_header),
        Paragraph("Degradation Indicators", table_header)
    ]]
    for c in mdata["components"]:
        comp_table_data.append([
            Paragraph(f"<b>{c['name']}</b>", table_text),
            Paragraph(c["function"], table_text),
            Paragraph(c["importantParameters"], table_text),
            Paragraph(c["degradationIndicators"], table_text)
        ])
    
    comp_table = Table(comp_table_data, colWidths=[1.4*inch, 2.0*inch, 1.8*inch, 1.8*inch])
    comp_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
    ]))
    story.append(comp_table)

    story.append(PageBreak())

    # ---------------------------------------------------------------------
    # SECTION 4: SENSORS TABLE
    # ---------------------------------------------------------------------
    story.append(Paragraph("4. Sensor Configuration & Telemetry Mapping", h1_style))
    story.append(Paragraph(
        "The following sensor schema represents the continuous telemetry parameters streamed by the machine controller "
        "into the VectorAI Edge Collector. Direction indicates whether increasing or decreasing values signify degradation.",
        body_style
    ))

    sensor_table_data = [[
        Paragraph("Sensor ID", table_header),
        Paragraph("Sensor Name", table_header),
        Paragraph("Unit", table_header),
        Paragraph("Normal Range", table_header),
        Paragraph("Warning Range", table_header),
        Paragraph("Critical Range", table_header),
        Paragraph("Direction", table_header)
    ]]
    for s in mdata["sensors"]:
        norm_str = f"{s['normalRange'][0]} – {s['normalRange'][1]}"
        warn_str = f"{s['warningRange'][0]} – {s['warningRange'][1]}"
        crit_str = f"{s['criticalRange'][0]} – {s['criticalRange'][1]}"
        sensor_table_data.append([
            Paragraph(f"<code>{s['sensorId']}</code>", table_text),
            Paragraph(s["name"], table_text),
            Paragraph(s["unit"], table_text),
            Paragraph(norm_str, table_text),
            Paragraph(warn_str, table_text),
            Paragraph(crit_str, table_text),
            Paragraph(s["direction"].replace("_", " "), table_text)
        ])

    sensor_table = Table(sensor_table_data, colWidths=[1.2*inch, 1.4*inch, 0.5*inch, 1.0*inch, 1.0*inch, 1.0*inch, 0.9*inch])
    sensor_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
    ]))
    story.append(sensor_table)

    story.append(Spacer(1, 10))

    # ---------------------------------------------------------------------
    # SECTION 5: THRESHOLD DEFINITIONS
    # ---------------------------------------------------------------------
    story.append(Paragraph("5. Sensor Threshold Definitions & Operational Boundaries", h1_style))
    thresh_table_data = [[
        Paragraph("Sensor / Metric", table_header),
        Paragraph("Normal Operational Band", table_header),
        Paragraph("Warning Threshold Band", table_header),
        Paragraph("Critical Fault Band", table_header)
    ]]
    for t in mdata["thresholds"]:
        norm_desc = f"<b>{t['normal']['min']} to {t['normal']['max']} {t['unit']}</b><br/>{t['normal']['description']}"
        warn_desc = f"<b>{t['warning']['min']} to {t['warning']['max']} {t['unit']}</b><br/>{t['warning']['description']}"
        crit_desc = f"<b>{t['critical']['min']} to {t['critical']['max']} {t['unit']}</b><br/>{t['critical']['description']}"
        thresh_table_data.append([
            Paragraph(f"<b>{t['sensorName']}</b><br/><code>{t['sensorId']}</code>", table_text),
            Paragraph(norm_desc, table_text),
            Paragraph(warn_desc, table_text),
            Paragraph(crit_desc, table_text)
        ])

    thresh_table = Table(thresh_table_data, colWidths=[1.5*inch, 1.8*inch, 1.85*inch, 1.85*inch])
    thresh_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
    ]))
    story.append(thresh_table)

    story.append(PageBreak())

    # ---------------------------------------------------------------------
    # SECTION 6: OPERATING CONDITIONS
    # ---------------------------------------------------------------------
    story.append(Paragraph("6. Standard Operating Conditions & Environmental Limits", h1_style))
    op = mdata["operatingConditions"]
    op_table_data = [
        [Paragraph("<b>Ambient Temperature:</b>", table_text), Paragraph(op["ambientTemperature"], table_text)],
        [Paragraph("<b>Relative Humidity:</b>", table_text), Paragraph(op["relativeHumidity"], table_text)],
        [Paragraph("<b>Normal Operating Temperature:</b>", table_text), Paragraph(op["normalOperatingTemperature"], table_text)],
        [Paragraph("<b>Operating Pressure:</b>", table_text), Paragraph(op["normalOperatingPressure"], table_text)],
        [Paragraph("<b>Operating Speed / Velocity:</b>", table_text), Paragraph(op["normalOperatingSpeed"], table_text)],
        [Paragraph("<b>Standard Cycle Time:</b>", table_text), Paragraph(op["normalCycleTime"], table_text)],
        [Paragraph("<b>Production Schedule:</b>", table_text), Paragraph(op["normalOperatingHours"], table_text)],
        [Paragraph("<b>Recommended Operating Conditions:</b>", table_text), Paragraph(op["recommendedOperatingConditions"], table_text)],
        [Paragraph("<b>Max Continuous Operation:</b>", table_text), Paragraph(op["maximumContinuousOperation"], table_text)],
    ]
    op_table = Table(op_table_data, colWidths=[2.2*inch, 4.8*inch])
    op_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), LIGHT_BG),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(op_table)

    story.append(Spacer(1, 10))

    # ---------------------------------------------------------------------
    # SECTION 7: MAINTENANCE INFORMATION
    # ---------------------------------------------------------------------
    story.append(Paragraph("7. Maintenance Schedule & Expected Service Life", h1_style))
    maint_table_data = [[
        Paragraph("Component", table_header),
        Paragraph("Interval (Hours)", table_header),
        Paragraph("Expected Life", table_header),
        Paragraph("Required Maintenance Action & Procedure", table_header)
    ]]
    for mt in mdata["maintenance"]:
        maint_table_data.append([
            Paragraph(f"<b>{mt['component']}</b>", table_text),
            Paragraph(f"{mt['recommendedMaintenanceIntervalHours']} hrs", table_text),
            Paragraph(f"{mt['expectedServiceLifeHours']} hrs", table_text),
            Paragraph(f"<b>{mt['maintenanceAction']}</b><br/><i>Procedure:</i> {mt['procedureSummary']}", table_text)
        ])

    maint_table = Table(maint_table_data, colWidths=[1.5*inch, 1.0*inch, 1.0*inch, 3.5*inch])
    maint_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
    ]))
    story.append(maint_table)

    story.append(PageBreak())

    # ---------------------------------------------------------------------
    # SECTION 8: DEGRADATION INDICATORS
    # ---------------------------------------------------------------------
    story.append(Paragraph("8. Degradation Indicators & Physics of Failure", h1_style))
    story.append(Paragraph(
        "Each parameter below reflects physical mechanical or electrical wear in machine subsystems. "
        "The VectorAI anomaly engine monitors these indicators to calculate Remaining Useful Life (RUL).",
        body_style
    ))

    deg_table_data = [[
        Paragraph("Parameter", table_header),
        Paragraph("Normal Baseline", table_header),
        Paragraph("Degraded Condition", table_header),
        Paragraph("Critical Limit", table_header),
        Paragraph("Underlying Physics / Mechanism", table_header)
    ]]
    for d in mdata["degradationIndicators"]:
        deg_table_data.append([
            Paragraph(f"<b>{d['parameter']}</b>", table_text),
            Paragraph(d["normalCondition"], table_text),
            Paragraph(d["degradedCondition"], table_text),
            Paragraph(d["criticalCondition"], table_text),
            Paragraph(d["indicatorMechanism"], table_text)
        ])

    deg_table = Table(deg_table_data, colWidths=[1.2*inch, 1.4*inch, 1.4*inch, 1.2*inch, 1.8*inch])
    deg_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
    ]))
    story.append(deg_table)

    story.append(Spacer(1, 10))

    # ---------------------------------------------------------------------
    # SECTION 9: FORMULA-BASED RUL MODEL
    # ---------------------------------------------------------------------
    story.append(Paragraph("9. Deterministic Formula-Based RUL Model Configuration", h1_style))
    story.append(Paragraph(
        f"<b>Base Useful Life (BUL):</b> <code>{mdata['rulModel']['baseUsefulLifeHours']} operating hours</code>",
        h2_style
    ))
    story.append(Paragraph(
        "<b>Mathematical Formula:</b> VectorAI computes RUL deterministically without neural networks or stochastic regression. "
        "For each parameter <i>i</i>:",
        body_style
    ))
    story.append(Paragraph(
        "• For <code>HIGHER_IS_WORSE</code>:  "
        "<code>d_i = (currentValue - healthyLimit) / (criticalLimit - healthyLimit)</code>",
        bullet_style
    ))
    story.append(Paragraph(
        "• For <code>LOWER_IS_WORSE</code>:  "
        "<code>d_i = (healthyLimit - currentValue) / (healthyLimit - criticalLimit)</code>",
        bullet_style
    ))
    story.append(Paragraph(
        "• Clamp: <code>d_i = max(0.0, min(1.0, d_i))</code>",
        bullet_style
    ))
    story.append(Paragraph(
        "• Overall Degradation: <code>D_total = Σ (w_i × d_i)</code>   [where Σ w_i = 1.00]",
        bullet_style
    ))
    story.append(Paragraph(
        "• Remaining Useful Life: <code>RUL = max(0, BaseUsefulLife × (1.0 - D_total))</code>",
        bullet_style
    ))
    story.append(Spacer(1, 4))

    rul_param_data = [[
        Paragraph("Parameter", table_header),
        Paragraph("Sensor ID", table_header),
        Paragraph("Unit", table_header),
        Paragraph("Weight (w_i)", table_header),
        Paragraph("Healthy Limit", table_header),
        Paragraph("Critical Limit", table_header),
        Paragraph("Direction", table_header)
    ]]
    for p in mdata["rulModel"]["parameters"]:
        rul_param_data.append([
            Paragraph(f"<b>{p['parameter']}</b>", table_text),
            Paragraph(f"<code>{p['sensorId']}</code>", table_text),
            Paragraph(p["unit"], table_text),
            Paragraph(f"<b>{p['weight']:.2f}</b>", table_text),
            Paragraph(str(p["healthyLimit"]), table_text),
            Paragraph(str(p["criticalLimit"]), table_text),
            Paragraph(p["direction"].replace("_", " "), table_text)
        ])
    
    # Add Total Weight row
    rul_param_data.append([
        Paragraph("<b>TOTAL WEIGHT SUM</b>", table_text),
        Paragraph("-", table_text),
        Paragraph("-", table_text),
        Paragraph("<b>1.00 (100%)</b>", table_text),
        Paragraph("-", table_text),
        Paragraph("-", table_text),
        Paragraph("VERIFIED OK", table_text)
    ])

    rul_table = Table(rul_param_data, colWidths=[1.4*inch, 1.4*inch, 0.5*inch, 0.9*inch, 0.9*inch, 0.9*inch, 1.0*inch])
    rul_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -2), [colors.white, LIGHT_BG]),
    ]))
    story.append(rul_table)

    story.append(PageBreak())

    # ---------------------------------------------------------------------
    # SECTION 10: FAILURE SYMPTOMS & TROUBLESHOOTING
    # ---------------------------------------------------------------------
    story.append(Paragraph("10. Troubleshooting & Failure Symptoms Table", h1_style))
    story.append(Paragraph(
        "The following troubleshooting matrix provides rapid diagnostic mappings between observable anomalies and root causes.",
        body_style
    ))

    sym_table_data = [[
        Paragraph("Symptom & ID", table_header),
        Paragraph("Severity", table_header),
        Paragraph("Related Sensors", table_header),
        Paragraph("Possible Causes", table_header),
        Paragraph("Recommended Corrective Action", table_header)
    ]]
    for sy in mdata["symptoms"]:
        causes_text = "<br/>".join([f"• {c}" for c in sy["possibleCauses"]])
        sensors_text = ", ".join(sy["relatedSensors"])
        sym_table_data.append([
            Paragraph(f"<b>{sy['symptom']}</b><br/><code>{sy['symptomId']}</code>", table_text),
            Paragraph(f"<b>{sy['severity']}</b>", table_text),
            Paragraph(f"<code>{sensors_text}</code>", table_text),
            Paragraph(causes_text, table_text),
            Paragraph(sy["recommendedAction"], table_text)
        ])

    sym_table = Table(sym_table_data, colWidths=[1.4*inch, 0.7*inch, 1.1*inch, 2.0*inch, 1.8*inch])
    sym_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
    ]))
    story.append(sym_table)

    story.append(PageBreak())

    # ---------------------------------------------------------------------
    # SECTION 11: DIAGNOSTIC KNOWLEDGE / FAILURE SCENARIOS
    # ---------------------------------------------------------------------
    story.append(Paragraph("11. Comprehensive Diagnostic Knowledge Base (Failure Scenarios)", h1_style))
    story.append(Paragraph(
        "This section contains 13 detailed synthetic failure scenarios used as the initial primary diagnostic knowledge base "
        "by the VectorAI Machine Agent. When an anomaly is detected, the agent queries this manual first before fallback to RAG.",
        body_style
    ))

    for idx, sc in enumerate(mdata["failureScenarios"], start=1):
        causes_list = " | ".join(sc["possibleCauses"])
        verif_list = " &gt; ".join(sc["verificationSteps"])
        
        sc_data = [
            [
                Paragraph(f"<b>Scenario {idx}: {sc['symptom']}</b> (<code>{sc['scenarioId']}</code>)", table_header),
                Paragraph(f"<b>Severity: {sc['severity'].upper()}</b>", table_header)
            ],
            [
                Paragraph("<b>Telemetry Sensor Pattern:</b>", table_text),
                Paragraph(f"<code>{sc['sensorPattern']}</code>", table_text)
            ],
            [
                Paragraph("<b>Possible Root Causes:</b>", table_text),
                Paragraph(causes_list, table_text)
            ],
            [
                Paragraph("<b>Recommended Corrective Action:</b>", table_text),
                Paragraph(sc["recommendedAction"], table_text)
            ],
            [
                Paragraph("<b>Verification & Recovery Steps:</b>", table_text),
                Paragraph(verif_list, table_text)
            ]
        ]
        sc_table = Table(sc_data, colWidths=[2.2*inch, 4.8*inch])
        sc_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), SECONDARY),
            ('BACKGROUND', (0, 1), (0, -1), LIGHT_BG),
            ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ]))
        story.append(KeepTogether([sc_table, Spacer(1, 6)]))

    story.append(PageBreak())

    # ---------------------------------------------------------------------
    # SECTION 12: MAINTENANCE PROCEDURES
    # ---------------------------------------------------------------------
    story.append(Paragraph("12. Standard Operating & Maintenance Procedures (SOP)", h1_style))
    story.append(Paragraph("<b>SOP-01: Shift Start Operational Inspection & Tool Touch-Off</b>", h2_style))
    story.append(Paragraph(
        "1. Verify Clean Dry Air (CDA) supply pressure is within 0.55 - 0.65 MPa and dew point is < -40°C.<br/>"
        "2. Ensure cleanroom ambient temperature is stabilized within specified operating window (20 - 24°C).<br/>"
        "3. Run automated sensor zero-calibration and optical target homing sequence.<br/>"
        "4. Process 2 calibration test pieces; inspect output dimensions and telemetry stability on VectorAI Dashboard.",
        body_style
    ))
    story.append(Paragraph("<b>SOP-02: Tool Replacement & Calibration Protocol</b>", h2_style))
    story.append(Paragraph(
        "1. Lock out and tag out (LOTO) machine controller before entering mechanical enclosure.<br/>"
        "2. Use calibrated preset torque wrench to fasten tool fasteners to exact manufacturer specification.<br/>"
        "3. Execute optical non-contact tool alignment and measure runout / contact resistance.<br/>"
        "4. Log maintenance record in VectorAI with work order ID, technician ID, and timestamp.",
        body_style
    ))
    story.append(Paragraph("<b>SOP-03: Anomaly Escalation Protocol</b>", h2_style))
    story.append(Paragraph(
        "When a sensor crosses from Warning into Critical threshold band:<br/>"
        "1. VectorAI generates automated Severity: High/Critical Incident.<br/>"
        "2. System automatically references Section 11 Diagnostic Knowledge for recommended immediate actions.<br/>"
        "3. If Remaining Useful Life (RUL) falls below 48 hours, dynamic production rerouting is triggered to alternate healthy lines.",
        body_style
    ))

    story.append(Spacer(1, 8))

    # ---------------------------------------------------------------------
    # SECTION 13: REVISION HISTORY
    # ---------------------------------------------------------------------
    story.append(Paragraph("13. Document Revision History", h1_style))
    rev_data = [
        [Paragraph("Revision", table_header), Paragraph("Release Date", table_header), Paragraph("Author / Organization", table_header), Paragraph("Description of Changes", table_header)],
        [Paragraph("v1.0", table_text), Paragraph("2026-08-26", table_text), Paragraph("VectorAI Knowledge Engineering", table_text), Paragraph("Initial synthetic technical specification and diagnostic manual release.", table_text)],
        [Paragraph("v0.9-RC", table_text), Paragraph("2026-08-15", table_text), Paragraph("VectorAI Systems Lab", table_text), Paragraph("Draft sensor thresholds, RUL weight configuration, and failure scenarios.", table_text)],
    ]
    rev_table = Table(rev_data, colWidths=[0.8*inch, 1.1*inch, 1.8*inch, 3.3*inch])
    rev_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
    ]))
    story.append(rev_table)

    story.append(Spacer(1, 10))

    # ---------------------------------------------------------------------
    # SECTION 14: RAG INTEGRATION NOTES
    # ---------------------------------------------------------------------
    story.append(Paragraph("14. VectorAI RAG Integration & Knowledge Indexing", h1_style))
    story.append(Paragraph(
        "This document is formatted with distinct semantic headings, tables, and structured diagnostic scenarios "
        "to facilitate high-precision chunking and vector embedding in the VectorAI RAG pipeline.<br/>"
        "• <b>Chunk Association:</b> Every indexed chunk retains metadata: <code>machineId</code>, <code>manualId</code>, <code>section</code>.<br/>"
        "• <b>Scoped Retrieval:</b> Diagnostics for machine <code>" + machine_id + "</code> prioritize chunks where <code>machineId == '" + machine_id + "'</code>.",
        body_style
    ))

    # Build Document
    def make_canvas(*args, **kwargs):
        c = NumberedCanvas(*args, **kwargs)
        c.machine_id = machine_id
        c.manual_id = manual_id
        c.doc_title = machine_name
        return c

    doc.build(story, canvasmaker=make_canvas)
    print(f"Generated PDF: {output_pdf_path}")


# -------------------------------------------------------------------------
# MAIN EXECUTION
# -------------------------------------------------------------------------

def main():
    print("=" * 70)
    print("VectorAI — Generating Synthetic Machine Manuals & JSON Knowledge Base")
    print("=" * 70)

    generated_files = []

    for mdata in MACHINES_DATA:
        filename = mdata["filename"]
        json_path = os.path.join(DATA_DIR, f"{filename}.json")
        pdf_path = os.path.join(MANUALS_DIR, f"{filename}-manual.pdf")
        public_pdf_path = os.path.join(PUBLIC_MANUALS_DIR, f"{filename}-manual.pdf")

        # 1. Write JSON Knowledge File (Single Source of Truth)
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(mdata, f, indent=2)
        print(f"Written JSON: {json_path}")

        # 2. Build PDF Technical Manual
        build_pdf_manual(mdata, pdf_path)

        # 3. Copy PDF to public/manuals/ for frontend access
        shutil.copyfile(pdf_path, public_pdf_path)
        print(f"Copied PDF to web public: {public_pdf_path}")

        generated_files.append({
            "machine": mdata["machine"]["name"],
            "machineId": mdata["machine"]["prototypeMachineId"],
            "manualId": mdata["machine"]["manualId"],
            "json": json_path,
            "pdf": pdf_path,
            "scenariosCount": len(mdata["failureScenarios"]),
            "sensorsCount": len(mdata["sensors"]),
            "rulParamsCount": len(mdata["rulModel"]["parameters"])
        })

    print("\n" + "=" * 70)
    print("Generation Summary:")
    print("=" * 70)
    for g in generated_files:
        print(f"• {g['machine']} ({g['machineId']}) | Manual: {g['manualId']}")
        print(f"  - Sensors: {g['sensorsCount']} | RUL Params: {g['rulParamsCount']} | Scenarios: {g['scenariosCount']}")
        print(f"  - JSON: {g['json']}")
        print(f"  - PDF:  {g['pdf']}")
    print("=" * 70)
    print("Successfully generated all 5 synthetic machine manuals and JSON files!")

if __name__ == "__main__":
    main()
