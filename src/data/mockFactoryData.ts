import {
  DashboardData,
  MachineNode,
  AlertItem,
  MaintenanceTask,
  TrendTimeRange,
  OeeTrendDataPoint,
  ProcessRiskItem,
  PredictiveRiskOverviewData,
} from '../types/dashboard';

export const MOCK_MACHINES: MachineNode[] = [
  {
    "id": "WS-01",
    "code": "MACH // WS-01",
    "name": "300mm Precision Wafer Saw 01",
    "type": "Wafer Dicing Machine",
    "typeShort": "WS",
    "bay": "Bay 1: Wafer Dicing & Prep",
    "line": "Line 01 - Wafer Prep",
    "position": {
      "x": 10,
      "y": 15
    },
    "status": "healthy",
    "healthScore": 98,
    "rulHours": 2400,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.38,
      "vibrationThreshold": 1.2,
      "temperature": 23.8,
      "tempThreshold": 55,
      "powerDraw": 7.8,
      "cycleTime": 44,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-10",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "WS-02",
    "code": "MACH // WS-02",
    "name": "300mm Precision Wafer Saw 02",
    "type": "Wafer Dicing Machine",
    "typeShort": "WS",
    "bay": "Bay 1: Wafer Dicing & Prep",
    "line": "Line 01 - Wafer Prep",
    "position": {
      "x": 22,
      "y": 15
    },
    "status": "warning",
    "healthScore": 71,
    "rulHours": 64,
    "riskLevel": "moderate",
    "telemetry": {
      "vibration": 1.65,
      "vibrationThreshold": 1.2,
      "temperature": 38.4,
      "tempThreshold": 55,
      "powerDraw": 7.8,
      "cycleTime": 44,
      "oee": 84.5
    },
    "lastServiceDate": "2026-08-01",
    "productionImpact": "MODERATE (Cycle time extension; Yield risk)"
  },
  {
    "id": "STK-01",
    "code": "MACH // STK-01",
    "name": "AMHS Cleanroom FOUP Stocker 01",
    "type": "AMHS Stocker",
    "typeShort": "STK",
    "bay": "Bay 1: Wafer Dicing & Prep",
    "line": "AMHS Loop Alpha",
    "position": {
      "x": 34,
      "y": 15
    },
    "status": "healthy",
    "healthScore": 99,
    "rulHours": 4500,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.12,
      "vibrationThreshold": 1.2,
      "temperature": 21.2,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-01",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "DA-01",
    "code": "MACH // DA-01",
    "name": "High-Precision Die Bonder 01",
    "type": "Die Attacher",
    "typeShort": "DA",
    "bay": "Bay 2: Die Attach & SMT",
    "line": "Line 02 - Die Attach Matrix",
    "position": {
      "x": 46,
      "y": 15
    },
    "status": "healthy",
    "healthScore": 97,
    "rulHours": 1580,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.38,
      "vibrationThreshold": 1.2,
      "temperature": 165,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-05",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "DA-02",
    "code": "MACH // DA-02",
    "name": "High-Precision Die Bonder 02",
    "type": "Die Attacher",
    "typeShort": "DA",
    "bay": "Bay 2: Die Attach & SMT",
    "line": "Line 02 - Die Attach Matrix",
    "position": {
      "x": 58,
      "y": 15
    },
    "status": "warning",
    "healthScore": 69,
    "rulHours": 72,
    "riskLevel": "moderate",
    "telemetry": {
      "vibration": 0.68,
      "vibrationThreshold": 1.2,
      "temperature": 172,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 84.5
    },
    "lastServiceDate": "2026-07-28",
    "productionImpact": "MODERATE (Cycle time extension; Yield risk)"
  },
  {
    "id": "DA-03",
    "code": "MACH // DA-03",
    "name": "High-Precision Die Bonder 03",
    "type": "Die Attacher",
    "typeShort": "DA",
    "bay": "Bay 2: Die Attach & SMT",
    "line": "Line 02 - Die Attach Matrix",
    "position": {
      "x": 70,
      "y": 15
    },
    "status": "healthy",
    "healthScore": 98,
    "rulHours": 1750,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.35,
      "vibrationThreshold": 1.2,
      "temperature": 164,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-11",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "DA-04",
    "code": "MACH // DA-04",
    "name": "High-Precision Die Bonder 04",
    "type": "Die Attacher",
    "typeShort": "DA",
    "bay": "Bay 2: Die Attach & SMT",
    "line": "Line 02 - Die Attach Matrix",
    "position": {
      "x": 82,
      "y": 15
    },
    "status": "healthy",
    "healthScore": 96,
    "rulHours": 1600,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.37,
      "vibrationThreshold": 1.2,
      "temperature": 166,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-14",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "PC-01",
    "code": "MACH // PC-01",
    "name": "RF Argon Plasma Surface Cleaner 01",
    "type": "RF Plasma Cleaner",
    "typeShort": "PC",
    "bay": "Bay 3A: Plasma Activation",
    "line": "Line 03 - Surface Activation",
    "position": {
      "x": 94,
      "y": 15
    },
    "status": "healthy",
    "healthScore": 97,
    "rulHours": 2800,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.18,
      "vibrationThreshold": 1.2,
      "temperature": 28.5,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-02",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "PC-02",
    "code": "MACH // PC-02",
    "name": "RF Argon Plasma Surface Cleaner 02",
    "type": "RF Plasma Cleaner",
    "typeShort": "PC",
    "bay": "Bay 3A: Plasma Activation",
    "line": "Line 03 - Surface Activation",
    "position": {
      "x": 10,
      "y": 35
    },
    "status": "warning",
    "healthScore": 75,
    "rulHours": 94,
    "riskLevel": "moderate",
    "telemetry": {
      "vibration": 0.48,
      "vibrationThreshold": 1.2,
      "temperature": 28.5,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 84.5
    },
    "lastServiceDate": "2026-07-20",
    "productionImpact": "MODERATE (Cycle time extension; Yield risk)"
  },
  {
    "id": "WB-01",
    "code": "MACH // WB-01",
    "name": "Thermosonic Ball Bonder 01",
    "type": "Wire Bonder",
    "typeShort": "WB",
    "bay": "Bay 3B: Wire Bonding Cleanroom",
    "line": "Line 04 - Micro-Interconnect",
    "position": {
      "x": 22,
      "y": 35
    },
    "status": "healthy",
    "healthScore": 95,
    "rulHours": 1650,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.45,
      "vibrationThreshold": 1.2,
      "temperature": 46,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-11",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "WB-02",
    "code": "MACH // WB-02",
    "name": "Thermosonic Ball Bonder 02",
    "type": "Wire Bonder",
    "typeShort": "WB",
    "bay": "Bay 3B: Wire Bonding Cleanroom",
    "line": "Line 04 - Micro-Interconnect",
    "position": {
      "x": 34,
      "y": 35
    },
    "status": "healthy",
    "healthScore": 94,
    "rulHours": 1520,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.48,
      "vibrationThreshold": 1.2,
      "temperature": 47.2,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-08",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "WB-03",
    "code": "MACH // WB-03",
    "name": "Thermosonic Ball Bonder 03",
    "type": "Wire Bonder",
    "typeShort": "WB",
    "bay": "Bay 3B: Wire Bonding Cleanroom",
    "line": "Line 04 - Micro-Interconnect",
    "position": {
      "x": 46,
      "y": 35
    },
    "status": "healthy",
    "healthScore": 96,
    "rulHours": 1720,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.44,
      "vibrationThreshold": 1.2,
      "temperature": 45.8,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-10",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "WB-04",
    "code": "MACH // WB-04",
    "name": "Thermosonic Ball Bonder 04",
    "type": "Wire Bonder",
    "typeShort": "WB",
    "bay": "Bay 3B: Wire Bonding Cleanroom",
    "line": "Line 04 - Micro-Interconnect",
    "position": {
      "x": 58,
      "y": 35
    },
    "status": "critical",
    "healthScore": 48,
    "rulHours": 28,
    "riskLevel": "critical",
    "telemetry": {
      "vibration": 3.42,
      "vibrationThreshold": 1.2,
      "temperature": 69.2,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 74.8
    },
    "lastServiceDate": "2026-07-20",
    "productionImpact": "CRITICAL (Severe throughput loss; Tool stop required)"
  },
  {
    "id": "WB-05",
    "code": "MACH // WB-05",
    "name": "Thermosonic Ball Bonder 05",
    "type": "Wire Bonder",
    "typeShort": "WB",
    "bay": "Bay 3B: Wire Bonding Cleanroom",
    "line": "Line 04 - Micro-Interconnect",
    "position": {
      "x": 70,
      "y": 35
    },
    "status": "healthy",
    "healthScore": 94,
    "rulHours": 1550,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.46,
      "vibrationThreshold": 1.2,
      "temperature": 46.5,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-12",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "WB-06",
    "code": "MACH // WB-06",
    "name": "Thermosonic Ball Bonder 06",
    "type": "Wire Bonder",
    "typeShort": "WB",
    "bay": "Bay 3B: Wire Bonding Cleanroom",
    "line": "Line 04 - Micro-Interconnect",
    "position": {
      "x": 82,
      "y": 35
    },
    "status": "healthy",
    "healthScore": 96,
    "rulHours": 1680,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.42,
      "vibrationThreshold": 1.2,
      "temperature": 45.4,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-14",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "WB-07",
    "code": "MACH // WB-07",
    "name": "Thermosonic Ball Bonder 07",
    "type": "Wire Bonder",
    "typeShort": "WB",
    "bay": "Bay 3B: Wire Bonding Cleanroom",
    "line": "Line 04 - Micro-Interconnect",
    "position": {
      "x": 94,
      "y": 35
    },
    "status": "healthy",
    "healthScore": 93,
    "rulHours": 1480,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.5,
      "vibrationThreshold": 1.2,
      "temperature": 48,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-05",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "WB-08",
    "code": "MACH // WB-08",
    "name": "Thermosonic Ball Bonder 08",
    "type": "Wire Bonder",
    "typeShort": "WB",
    "bay": "Bay 3B: Wire Bonding Cleanroom",
    "line": "Line 04 - Micro-Interconnect",
    "position": {
      "x": 10,
      "y": 55
    },
    "status": "healthy",
    "healthScore": 95,
    "rulHours": 1600,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.44,
      "vibrationThreshold": 1.2,
      "temperature": 46.8,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-10",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "MP-01",
    "code": "MACH // MP-01",
    "name": "Auto Molding Press 01 (Multi-Cavity)",
    "type": "Molding Machine",
    "typeShort": "MP",
    "bay": "Bay 4: Encapsulation & Mold Chase",
    "line": "Line 05 - Auto Encapsulation",
    "position": {
      "x": 22,
      "y": 55
    },
    "status": "healthy",
    "healthScore": 94,
    "rulHours": 1980,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.35,
      "vibrationThreshold": 1.2,
      "temperature": 175.4,
      "tempThreshold": 55,
      "powerDraw": 14.5,
      "cycleTime": 140,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-01",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "MP-02",
    "code": "MACH // MP-02",
    "name": "Auto Molding Press 02 (Multi-Cavity)",
    "type": "Molding Machine",
    "typeShort": "MP",
    "bay": "Bay 4: Encapsulation & Mold Chase",
    "line": "Line 05 - Auto Encapsulation",
    "position": {
      "x": 34,
      "y": 55
    },
    "status": "healthy",
    "healthScore": 93,
    "rulHours": 1850,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.35,
      "vibrationThreshold": 1.2,
      "temperature": 174.8,
      "tempThreshold": 55,
      "powerDraw": 14.5,
      "cycleTime": 140,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-03",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "MP-03",
    "code": "MACH // MP-03",
    "name": "Auto Molding Press 03 (Multi-Cavity)",
    "type": "Molding Machine",
    "typeShort": "MP",
    "bay": "Bay 4: Encapsulation & Mold Chase",
    "line": "Line 05 - Auto Encapsulation",
    "position": {
      "x": 46,
      "y": 55
    },
    "status": "warning",
    "healthScore": 73,
    "rulHours": 84,
    "riskLevel": "moderate",
    "telemetry": {
      "vibration": 1.65,
      "vibrationThreshold": 1.2,
      "temperature": 188.5,
      "tempThreshold": 55,
      "powerDraw": 14.5,
      "cycleTime": 140,
      "oee": 84.5
    },
    "lastServiceDate": "2026-07-22",
    "productionImpact": "MODERATE (Cycle time extension; Yield risk)"
  },
  {
    "id": "MP-04",
    "code": "MACH // MP-04",
    "name": "Auto Molding Press 04 (Multi-Cavity)",
    "type": "Molding Machine",
    "typeShort": "MP",
    "bay": "Bay 4: Encapsulation & Mold Chase",
    "line": "Line 05 - Auto Encapsulation",
    "position": {
      "x": 58,
      "y": 55
    },
    "status": "healthy",
    "healthScore": 95,
    "rulHours": 2020,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.35,
      "vibrationThreshold": 1.2,
      "temperature": 175.2,
      "tempThreshold": 55,
      "powerDraw": 14.5,
      "cycleTime": 140,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-09",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "AOI-01",
    "code": "MACH // AOI-01",
    "name": "3D Optical AOI Line 01",
    "type": "3D Optical AOI",
    "typeShort": "AOI",
    "bay": "Bay 5A: 3D Optical AOI Metrology",
    "line": "Line 06 - 3D Metrology QA",
    "position": {
      "x": 70,
      "y": 55
    },
    "status": "healthy",
    "healthScore": 99,
    "rulHours": 3200,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.08,
      "vibrationThreshold": 1.2,
      "temperature": 22.8,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-15",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "AOI-02",
    "code": "MACH // AOI-02",
    "name": "3D Optical AOI Line 02",
    "type": "3D Optical AOI",
    "typeShort": "AOI",
    "bay": "Bay 5A: 3D Optical AOI Metrology",
    "line": "Line 06 - 3D Metrology QA",
    "position": {
      "x": 82,
      "y": 55
    },
    "status": "healthy",
    "healthScore": 98,
    "rulHours": 3050,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.09,
      "vibrationThreshold": 1.2,
      "temperature": 23.2,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-16",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "AOI-03",
    "code": "MACH // AOI-03",
    "name": "3D Optical AOI Line 03",
    "type": "3D Optical AOI",
    "typeShort": "AOI",
    "bay": "Bay 5A: 3D Optical AOI Metrology",
    "line": "Line 06 - 3D Metrology QA",
    "position": {
      "x": 94,
      "y": 55
    },
    "status": "healthy",
    "healthScore": 99,
    "rulHours": 3180,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.08,
      "vibrationThreshold": 1.2,
      "temperature": 22.9,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-17",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "AOI-04",
    "code": "MACH // AOI-04",
    "name": "3D Optical AOI Line 04",
    "type": "3D Optical AOI",
    "typeShort": "AOI",
    "bay": "Bay 5A: 3D Optical AOI Metrology",
    "line": "Line 06 - 3D Metrology QA",
    "position": {
      "x": 10,
      "y": 75
    },
    "status": "healthy",
    "healthScore": 98,
    "rulHours": 3100,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.09,
      "vibrationThreshold": 1.2,
      "temperature": 23,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-18",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "XR-01",
    "code": "MACH // XR-01",
    "name": "Microfocus X-Ray NDT Cell 01",
    "type": "Microfocus X-Ray",
    "typeShort": "XR",
    "bay": "Bay 5B: Lead-Shielded X-Ray",
    "line": "Line 07 - Volumetric NDT",
    "position": {
      "x": 22,
      "y": 75
    },
    "status": "healthy",
    "healthScore": 97,
    "rulHours": 2450,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.22,
      "vibrationThreshold": 1.2,
      "temperature": 34.8,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-01",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "XR-02",
    "code": "MACH // XR-02",
    "name": "Microfocus X-Ray NDT Cell 02",
    "type": "Microfocus X-Ray",
    "typeShort": "XR",
    "bay": "Bay 5B: Lead-Shielded X-Ray",
    "line": "Line 07 - Volumetric NDT",
    "position": {
      "x": 34,
      "y": 75
    },
    "status": "healthy",
    "healthScore": 96,
    "rulHours": 2380,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.24,
      "vibrationThreshold": 1.2,
      "temperature": 35.2,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-03",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "LM-01",
    "code": "MACH // LM-01",
    "name": "Galvo Fiber Laser Marker 01",
    "type": "Laser Marker",
    "typeShort": "LM",
    "bay": "Bay 5C: Laser Marking Cell",
    "line": "Line 08 - Laser Serialization",
    "position": {
      "x": 46,
      "y": 75
    },
    "status": "healthy",
    "healthScore": 98,
    "rulHours": 3500,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.35,
      "vibrationThreshold": 1.2,
      "temperature": 28.5,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-08",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "LM-02",
    "code": "MACH // LM-02",
    "name": "Galvo Fiber Laser Marker 02",
    "type": "Laser Marker",
    "typeShort": "LM",
    "bay": "Bay 5C: Laser Marking Cell",
    "line": "Line 08 - Laser Serialization",
    "position": {
      "x": 58,
      "y": 75
    },
    "status": "offline",
    "healthScore": 88,
    "rulHours": 3350,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.35,
      "vibrationThreshold": 1.2,
      "temperature": 22,
      "tempThreshold": 55,
      "powerDraw": 0,
      "cycleTime": 0,
      "oee": 0
    },
    "lastServiceDate": "2026-08-27",
    "productionImpact": "PLANNED DOWNTIME (Preventive calibration in progress)"
  },
  {
    "id": "TH-01",
    "code": "MACH // TH-01",
    "name": "IC Tri-Temp Test Handler 01",
    "type": "IC Test Handler",
    "typeShort": "TH",
    "bay": "Bay 6A: Tri-Temp Final Test",
    "line": "Line 09 - Tri-Temp Test",
    "position": {
      "x": 70,
      "y": 75
    },
    "status": "warning",
    "healthScore": 76,
    "rulHours": 98,
    "riskLevel": "moderate",
    "telemetry": {
      "vibration": 0.78,
      "vibrationThreshold": 1.2,
      "temperature": 92.4,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 84.5
    },
    "lastServiceDate": "2026-07-25",
    "productionImpact": "MODERATE (Cycle time extension; Yield risk)"
  },
  {
    "id": "TH-02",
    "code": "MACH // TH-02",
    "name": "IC Tri-Temp Test Handler 02",
    "type": "IC Test Handler",
    "typeShort": "TH",
    "bay": "Bay 6A: Tri-Temp Final Test",
    "line": "Line 09 - Tri-Temp Test",
    "position": {
      "x": 82,
      "y": 75
    },
    "status": "healthy",
    "healthScore": 97,
    "rulHours": 2250,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.48,
      "vibrationThreshold": 1.2,
      "temperature": -40,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-14",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "TR-01",
    "code": "MACH // TR-01",
    "name": "Automated Tape & Reel 01",
    "type": "Tape & Reel Packaging",
    "typeShort": "TR",
    "bay": "Bay 6B: Tape & Reel Packaging",
    "line": "Line 10 - Reel Packaging",
    "position": {
      "x": 94,
      "y": 75
    },
    "status": "healthy",
    "healthScore": 96,
    "rulHours": 2400,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.32,
      "vibrationThreshold": 1.2,
      "temperature": 175,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-06",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "TR-02",
    "code": "MACH // TR-02",
    "name": "Automated Tape & Reel 02",
    "type": "Tape & Reel Packaging",
    "typeShort": "TR",
    "bay": "Bay 6B: Tape & Reel Packaging",
    "line": "Line 10 - Reel Packaging",
    "position": {
      "x": 10,
      "y": 95
    },
    "status": "healthy",
    "healthScore": 95,
    "rulHours": 2280,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.34,
      "vibrationThreshold": 1.2,
      "temperature": 176,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-08",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "TR-03",
    "code": "MACH // TR-03",
    "name": "Automated Tape & Reel 03",
    "type": "Tape & Reel Packaging",
    "typeShort": "TR",
    "bay": "Bay 6B: Tape & Reel Packaging",
    "line": "Line 10 - Reel Packaging",
    "position": {
      "x": 22,
      "y": 95
    },
    "status": "healthy",
    "healthScore": 98,
    "rulHours": 2600,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.3,
      "vibrationThreshold": 1.2,
      "temperature": 174,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-11",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "TR-04",
    "code": "MACH // TR-04",
    "name": "Automated Tape & Reel 04",
    "type": "Tape & Reel Packaging",
    "typeShort": "TR",
    "bay": "Bay 6B: Tape & Reel Packaging",
    "line": "Line 10 - Reel Packaging",
    "position": {
      "x": 34,
      "y": 95
    },
    "status": "healthy",
    "healthScore": 94,
    "rulHours": 2150,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.36,
      "vibrationThreshold": 1.2,
      "temperature": 178,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-13",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "TR-05",
    "code": "MACH // TR-05",
    "name": "Automated Tape & Reel 05",
    "type": "Tape & Reel Packaging",
    "typeShort": "TR",
    "bay": "Bay 6B: Tape & Reel Packaging",
    "line": "Line 10 - Reel Packaging",
    "position": {
      "x": 46,
      "y": 95
    },
    "status": "healthy",
    "healthScore": 97,
    "rulHours": 2520,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.31,
      "vibrationThreshold": 1.2,
      "temperature": 175,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-15",
    "productionImpact": "Nominal throughput (100% capacity)"
  },
  {
    "id": "TR-06",
    "code": "MACH // TR-06",
    "name": "Automated Tape & Reel 06",
    "type": "Tape & Reel Packaging",
    "typeShort": "TR",
    "bay": "Bay 6B: Tape & Reel Packaging",
    "line": "Line 10 - Reel Packaging",
    "position": {
      "x": 58,
      "y": 95
    },
    "status": "healthy",
    "healthScore": 98,
    "rulHours": 2700,
    "riskLevel": "low",
    "telemetry": {
      "vibration": 0.29,
      "vibrationThreshold": 1.2,
      "temperature": 174,
      "tempThreshold": 55,
      "powerDraw": 3.5,
      "cycleTime": 18,
      "oee": 96.5
    },
    "lastServiceDate": "2026-08-16",
    "productionImpact": "Nominal throughput (100% capacity)"
  }
];

export const MOCK_ALERTS: AlertItem[] = [
  {
    "id": "ALERT-WB-04",
    "machineId": "WB-04",
    "machineName": "Thermosonic Ball Bonder 04",
    "machineType": "Wire Bonder",
    "severity": "critical",
    "message": "Piezo Transducer Thermal Runaway & Acoustic Resonance Decoupling (3.42 mm/s vibration)",
    "timestamp": "15m ago",
    "rulHours": 28,
    "acknowledged": false,
    "recommendedAction": "Immediate emergency tool stop: Replace 25µm capillary tool and recalibrate transducer stack at 138.4 kHz.",
    "impact": "Bond cycle time extended (+14s); High NSOP and lift-off defect risk"
  },
  {
    "id": "ALERT-WS-02",
    "machineId": "WS-02",
    "machineName": "300mm Precision Wafer Saw 02",
    "machineType": "Wafer Dicing Machine",
    "severity": "warning",
    "message": "Spindle Air-Bearing 12.4 kHz Harmonic Spalling & Coolant Temp Drift (38.4°C)",
    "timestamp": "42m ago",
    "rulHours": 64,
    "acknowledged": false,
    "recommendedAction": "Inspect labyrinth seal, replace resinoid diamond dicing blade, and dynamic-balance spindle rotor.",
    "impact": "Wafer backside chipping risk on 300mm GaN substrate lot"
  },
  {
    "id": "ALERT-DA-02",
    "machineId": "DA-02",
    "machineName": "High-Precision Die Bonder 02",
    "machineType": "Die Attacher",
    "severity": "warning",
    "message": "Collet Vacuum Pressure Drop (-54 kPa) & Ejector Needle Timing Drift",
    "timestamp": "1h 10m ago",
    "rulHours": 72,
    "acknowledged": false,
    "recommendedAction": "Flush vacuum solenoid line, replace silicon collet seal, and re-teach ejector needle Z-coordinates.",
    "impact": "Die pickup tilt variance and bond-line thickness (BLT) irregularity"
  },
  {
    "id": "ALERT-MP-03",
    "machineId": "MP-03",
    "machineName": "Auto Molding Press 03",
    "machineType": "Molding Machine",
    "severity": "warning",
    "message": "Hydraulic Transfer Ram Pressure Spike (178 bar) & Mold Cavity Vent Flash Buildup",
    "timestamp": "2h 05m ago",
    "rulHours": 84,
    "acknowledged": false,
    "recommendedAction": "Schedule mold chase vent ultrasonic cleaning and hydraulic cylinder piston ring seal inspection.",
    "impact": "Epoxy resin transfer voiding and flash bleed over leadframes"
  },
  {
    "id": "ALERT-PC-02",
    "machineId": "PC-02",
    "machineName": "RF Argon Plasma Cleaner 02",
    "machineType": "RF Plasma Cleaner",
    "severity": "warning",
    "message": "RF Matching Network Reflected Power Surge (42W) & Vacuum O-Ring Degradation",
    "timestamp": "2h 45m ago",
    "rulHours": 94,
    "acknowledged": true,
    "recommendedAction": "Tune RF auto-match network capacitor and replace chamber fluoroelastomer vacuum seal.",
    "impact": "Copper pad surface activation energy dropped below 52 dyn/cm"
  },
  {
    "id": "ALERT-TH-01",
    "machineId": "TH-01",
    "machineName": "IC Tri-Temp Test Handler 01",
    "machineType": "IC Test Handler",
    "severity": "warning",
    "message": "Kelvin RF Socket Pogo Pin Resistance Elevation (68 mΩ) during +85°C Soak",
    "timestamp": "3h 20m ago",
    "rulHours": 98,
    "acknowledged": true,
    "recommendedAction": "Replace 128-pin high-frequency pogo pin socket block and clean rotary theta optical encoder.",
    "impact": "Parametric false-failure rate increased +1.4% on logic test lot"
  },
  {
    "id": "ALERT-LM-02",
    "machineId": "LM-02",
    "machineName": "Galvo Fiber Laser Marker 02",
    "machineType": "Laser Marker",
    "severity": "warning",
    "message": "Tool Offline: Scheduled 500-Hour F-Theta Beam Collimator Cleaning in Progress",
    "timestamp": "45m ago",
    "rulHours": 3200,
    "acknowledged": true,
    "recommendedAction": "Complete optical lens wipe and run 2D DataMatrix verification target lot before re-energizing beam.",
    "impact": "Laser marking routed to parallel unit LM-01 (100% capacity maintained)"
  }
];

export const MOCK_MAINTENANCE_TASKS: MaintenanceTask[] = [
  {
    taskId: "WO-2026-WB04",
    id: "WO-2026-WB04",
    machineId: "WB-04",
    machineName: "Thermosonic Ball Bonder 04",
    location: "Bay 3B • Line 04",
    taskTitle: "Emergency PZT Transducer & Capillary Overhaul",
    type: "Emergency PZT Transducer & Capillary Overhaul",
    category: "Component Replacement",
    priority: "urgent",
    dueDate: "Today, 08:30",
    scheduledDate: "2026-08-27 08:30",
    estimatedDuration: "2.0 hrs",
    estimatedDurationHours: 2,
    assignedTechnician: "Kenji Sato",
    status: "due_today",
    partsRequired: [
      "Capillary Tool 25µm Ceramic",
      "PZT Transducer Stack Calibrator",
      "Acoustic Sensor Probe"
    ]
  },
  {
    taskId: "WO-2026-WS02",
    id: "WO-2026-WS02",
    machineId: "WS-02",
    machineName: "300mm Precision Wafer Saw 02",
    location: "Bay 1 • Line 01",
    taskTitle: "Spindle Air-Bearing Rebalance & Blade Swap",
    type: "Spindle Air-Bearing Rebalance & Blade Swap",
    category: "Predictive Service",
    priority: "high",
    dueDate: "Today, 11:00",
    scheduledDate: "2026-08-27 11:00",
    estimatedDuration: "2.5 hrs",
    estimatedDurationHours: 2.5,
    assignedTechnician: "Kenji Sato",
    status: "due_today",
    partsRequired: [
      "Resinoid Diamond Blade 0.025mm",
      "Spindle Dynamic Balancer Kit",
      "DI Water Filter"
    ]
  },
  {
    taskId: "WO-2026-DA02",
    id: "WO-2026-DA02",
    machineId: "DA-02",
    machineName: "High-Precision Die Bonder 02",
    location: "Bay 2 • Line 02",
    taskTitle: "Collet Vacuum Line Flush & Ejector Pin Re-teach",
    type: "Collet Vacuum Line Flush & Ejector Pin Re-teach",
    category: "Calibration",
    priority: "high",
    dueDate: "Today, 13:30",
    scheduledDate: "2026-08-27 13:30",
    estimatedDuration: "1.5 hrs",
    estimatedDurationHours: 1.5,
    assignedTechnician: "Marcus Thorne",
    status: "due_today",
    partsRequired: [
      "Silicon Collet 1.5x1.5mm",
      "Vacuum Solenoid Valve",
      "Tungsten Carbide Ejector Needle"
    ]
  },
  {
    taskId: "WO-2026-MP03",
    id: "WO-2026-MP03",
    machineId: "MP-03",
    machineName: "Auto Molding Press 03",
    location: "Bay 4 • Line 05",
    taskTitle: "Hydraulic Plunger Seal Swap & Vent Ultrasonic Clean",
    type: "Hydraulic Plunger Seal Swap & Vent Ultrasonic Clean",
    category: "Overhaul",
    priority: "medium",
    dueDate: "Today, 15:00",
    scheduledDate: "2026-08-27 15:00",
    estimatedDuration: "3.0 hrs",
    estimatedDurationHours: 3,
    assignedTechnician: "Marcus Thorne",
    status: "due_today",
    partsRequired: [
      "Hydraulic Piston Seal Ring Set",
      "Mold Chase Release Foil",
      "Ultrasonic Vent Cleaner"
    ]
  },
  {
    taskId: "WO-2026-PC02",
    id: "WO-2026-PC02",
    machineId: "PC-02",
    machineName: "RF Argon Plasma Cleaner 02",
    location: "Bay 3A • Line 03",
    taskTitle: "RF Auto-Match Tuning & Vacuum O-Ring Refresh",
    type: "RF Auto-Match Tuning & Vacuum O-Ring Refresh",
    category: "Calibration",
    priority: "medium",
    dueDate: "Tomorrow, 09:00",
    scheduledDate: "2026-08-28 09:00",
    estimatedDuration: "2.0 hrs",
    estimatedDurationHours: 2,
    assignedTechnician: "Elena Vance",
    status: "due_week",
    partsRequired: [
      "Fluoroelastomer Vacuum O-Ring #214",
      "RF Match Vacuum Variable Capacitor"
    ]
  },
  {
    taskId: "WO-2026-TH01",
    id: "WO-2026-TH01",
    machineId: "TH-01",
    machineName: "IC Tri-Temp Test Handler 01",
    location: "Bay 6A • Line 09",
    taskTitle: "Kelvin RF Contact Pogo Pin Block Replacement",
    type: "Kelvin RF Contact Pogo Pin Block Replacement",
    category: "Component Replacement",
    priority: "medium",
    dueDate: "Tomorrow, 11:30",
    scheduledDate: "2026-08-28 11:30",
    estimatedDuration: "1.5 hrs",
    estimatedDurationHours: 1.5,
    assignedTechnician: "Kenji Sato",
    status: "due_week",
    partsRequired: [
      "128-Pin Kelvin High-Frequency Contactor Block",
      "Optical Rotary Encoder Cleaner"
    ]
  },
  {
    taskId: "WO-2026-LM02",
    id: "WO-2026-LM02",
    machineId: "LM-02",
    machineName: "Galvo Fiber Laser Marker 02",
    location: "Bay 5C • Line 08",
    taskTitle: "500-Hour Optical Window & F-Theta Calibration",
    type: "500-Hour Optical Window & F-Theta Calibration",
    category: "Calibration",
    priority: "low",
    dueDate: "Today, 07:00",
    scheduledDate: "2026-08-27 07:00",
    estimatedDuration: "1.0 hr",
    estimatedDurationHours: 1,
    assignedTechnician: "Marcus Thorne",
    status: "in_progress",
    partsRequired: [
      "Laser Optical Lens Wipe Kit",
      "F-Theta Quartz Window",
      "2D Calibration Target"
    ]
  }
];

export const MOCK_OEE_TRENDS: Record<TrendTimeRange, OeeTrendDataPoint[]> = {
  '24H': [
    { timestamp: '00:00', label: '00:00', oee: 96.8, availability: 98.2, performance: 98.4, quality: 99.8 },
    { timestamp: '04:00', label: '04:00', oee: 96.5, availability: 98.0, performance: 98.2, quality: 99.8 },
    { timestamp: '08:00', label: '08:00', oee: 93.4, availability: 95.4, performance: 96.8, quality: 98.8 },
    { timestamp: '12:00', label: '12:00', oee: 92.1, availability: 94.2, performance: 95.5, quality: 98.2 },
    { timestamp: '14:00', label: '14:00', oee: 92.8, availability: 94.8, performance: 96.0, quality: 98.4 },
    { timestamp: '16:00', label: 'Now', oee: 93.2, availability: 95.1, performance: 96.4, quality: 98.5 },
  ],
  '7D': [
    { timestamp: 'Aug 20', label: 'Thu 20', oee: 96.4, availability: 98.0, performance: 98.1, quality: 99.7 },
    { timestamp: 'Aug 21', label: 'Fri 21', oee: 96.8, availability: 98.2, performance: 98.5, quality: 99.8 },
    { timestamp: 'Aug 22', label: 'Sat 22', oee: 96.2, availability: 97.8, performance: 98.0, quality: 99.6 },
    { timestamp: 'Aug 23', label: 'Sun 23', oee: 95.5, availability: 97.0, performance: 97.5, quality: 99.2 },
    { timestamp: 'Aug 24', label: 'Mon 24', oee: 94.8, availability: 96.5, performance: 97.0, quality: 99.0 },
    { timestamp: 'Aug 25', label: 'Tue 25', oee: 93.9, availability: 95.8, performance: 96.5, quality: 98.7 },
    { timestamp: 'Aug 26', label: 'Today', oee: 93.2, availability: 95.1, performance: 96.4, quality: 98.5 },
  ],
  '30D': [
    { timestamp: 'W1', label: 'Week 30', oee: 96.8, availability: 98.4, performance: 98.5, quality: 99.8 },
    { timestamp: 'W2', label: 'Week 31', oee: 96.5, availability: 98.1, performance: 98.2, quality: 99.7 },
    { timestamp: 'W3', label: 'Week 32', oee: 95.8, availability: 97.4, performance: 97.8, quality: 99.4 },
    { timestamp: 'W4', label: 'Week 33', oee: 94.6, availability: 96.2, performance: 97.1, quality: 99.0 },
    { timestamp: 'W5', label: 'Current', oee: 93.2, availability: 95.1, performance: 96.4, quality: 98.5 },
  ],
};

export const MOCK_PROCESS_RISK: ProcessRiskItem[] = [
  {
    "processId": "PROC-WS",
    "processName": "Wafer Dicing & Prep",
    "shortCode": "WS",
    "bay": "Bay 1",
    "lines": "Line 01",
    "totalMachines": 3,
    "healthyCount": 2,
    "warningCount": 1,
    "criticalCount": 0,
    "riskScore": 38,
    "riskLevel": "moderate",
    "primaryBottleneck": "WS-02 Spindle 12.4 kHz harmonic vibration (64h RUL)",
    "urgency": "< 24h Blade & Spindle Service"
  },
  {
    "processId": "PROC-DA",
    "processName": "Die Attach & SMT",
    "shortCode": "DA",
    "bay": "Bay 2",
    "lines": "Line 02",
    "totalMachines": 4,
    "healthyCount": 3,
    "warningCount": 1,
    "criticalCount": 0,
    "riskScore": 44,
    "riskLevel": "moderate",
    "primaryBottleneck": "DA-02 Vacuum collet seal leakage (-54 kPa) (72h RUL)",
    "urgency": "< 36h Vacuum Line Service"
  },
  {
    "processId": "PROC-PC",
    "processName": "Plasma Activation",
    "shortCode": "PC",
    "bay": "Bay 3A",
    "lines": "Line 03",
    "totalMachines": 2,
    "healthyCount": 1,
    "warningCount": 1,
    "criticalCount": 0,
    "riskScore": 35,
    "riskLevel": "moderate",
    "primaryBottleneck": "PC-02 RF reflected power rise (42W) (94h RUL)",
    "urgency": "< 48h RF Auto-Match Tune"
  },
  {
    "processId": "PROC-WB",
    "processName": "Wire Bonding Cleanroom",
    "shortCode": "WB",
    "bay": "Bay 3B",
    "lines": "Line 04",
    "totalMachines": 8,
    "healthyCount": 7,
    "warningCount": 0,
    "criticalCount": 1,
    "riskScore": 82,
    "riskLevel": "critical",
    "primaryBottleneck": "WB-04 PZT Transducer resonance decoupling (28h RUL)",
    "urgency": "IMMEDIATE Tool Stop & Repair"
  },
  {
    "processId": "PROC-MP",
    "processName": "Auto Molding Press",
    "shortCode": "MP",
    "bay": "Bay 4",
    "lines": "Line 05",
    "totalMachines": 4,
    "healthyCount": 3,
    "warningCount": 1,
    "criticalCount": 0,
    "riskScore": 40,
    "riskLevel": "moderate",
    "primaryBottleneck": "MP-03 Hydraulic ram pressure spike 178 bar (84h RUL)",
    "urgency": "< 40h Plunger Seal Swap"
  },
  {
    "processId": "PROC-AOI",
    "processName": "3D Optical AOI Metrology",
    "shortCode": "AOI",
    "bay": "Bay 5A",
    "lines": "Line 06",
    "totalMachines": 4,
    "healthyCount": 4,
    "warningCount": 0,
    "criticalCount": 0,
    "riskScore": 8,
    "riskLevel": "low",
    "primaryBottleneck": "None — multi-angle RGB+W dome calibrated",
    "urgency": "Routine Monitoring"
  },
  {
    "processId": "PROC-XR",
    "processName": "Microfocus X-Ray NDT",
    "shortCode": "XR",
    "bay": "Bay 5B",
    "lines": "Line 07",
    "totalMachines": 2,
    "healthyCount": 2,
    "warningCount": 0,
    "criticalCount": 0,
    "riskScore": 12,
    "riskLevel": "low",
    "primaryBottleneck": "None — zero package internal voiding",
    "urgency": "Routine Monitoring"
  },
  {
    "processId": "PROC-LM",
    "processName": "Laser Marking Cell",
    "shortCode": "LM",
    "bay": "Bay 5C",
    "lines": "Line 08",
    "totalMachines": 2,
    "healthyCount": 1,
    "warningCount": 0,
    "criticalCount": 0,
    "riskScore": 15,
    "riskLevel": "low",
    "primaryBottleneck": "LM-02 in planned 500h optical cleaning PM",
    "urgency": "PM in Progress (ETA 45m)"
  },
  {
    "processId": "PROC-TH",
    "processName": "Tri-Temp Final Test",
    "shortCode": "TH",
    "bay": "Bay 6A",
    "lines": "Line 09",
    "totalMachines": 2,
    "healthyCount": 1,
    "warningCount": 1,
    "criticalCount": 0,
    "riskScore": 36,
    "riskLevel": "moderate",
    "primaryBottleneck": "TH-01 Kelvin socket contact resistance elevation (98h RUL)",
    "urgency": "< 48h Pogo Contactor Swap"
  },
  {
    "processId": "PROC-TR",
    "processName": "Tape & Reel Packaging",
    "shortCode": "TR",
    "bay": "Bay 6B",
    "lines": "Line 10",
    "totalMachines": 6,
    "healthyCount": 6,
    "warningCount": 0,
    "criticalCount": 0,
    "riskScore": 11,
    "riskLevel": "low",
    "primaryBottleneck": "None — cover tape thermal seal peel force nominal",
    "urgency": "Routine Monitoring"
  }
];

export const MOCK_PREDICTIVE_RISK: PredictiveRiskOverviewData = {
  "criticalCount": 1,
  "highRiskCount": 3,
  "mediumRiskCount": 2,
  "lowRiskCount": 31,
  "horizon": {
    "next7Days": 6,
    "next30Days": 4,
    "stableBeyond30Days": 27
  },
  "topRiskMachines": [
    {
      "id": "WB-04",
      "name": "Thermosonic Ball Bonder 04",
      "type": "Wire Bonder",
      "healthScore": 48,
      "rulHours": 28,
      "status": "critical",
      "bay": "Bay 3B: Wire Bonding Cleanroom",
      "line": "Line 04 - Micro-Interconnect",
      "issue": "PZT Transducer thermal runaway (69.2°C) & 3.42 mm/s vibration resonance decoupling",
      "actionUrgency": "Immediate Tool Stop (< 4 Hours)"
    },
    {
      "id": "WS-02",
      "name": "300mm Precision Wafer Saw 02",
      "type": "Wafer Dicing Machine",
      "healthScore": 71,
      "rulHours": 64,
      "status": "warning",
      "bay": "Bay 1: Wafer Dicing & Prep",
      "line": "Line 01 - Wafer Prep",
      "issue": "Spindle ceramic bearing 12.4 kHz micro-spalling harmonic & blade binding",
      "actionUrgency": "< 24 Hours"
    },
    {
      "id": "DA-02",
      "name": "High-Precision Die Bonder 02",
      "type": "Die Attacher",
      "healthScore": 69,
      "rulHours": 72,
      "status": "warning",
      "bay": "Bay 2: Die Attach & SMT",
      "line": "Line 02 - Die Attach Matrix",
      "issue": "Collet vacuum seal leakage (-54 kPa) causing pickup BLT variance",
      "actionUrgency": "< 36 Hours"
    },
    {
      "id": "MP-03",
      "name": "Auto Molding Press 03",
      "type": "Molding Machine",
      "healthScore": 73,
      "rulHours": 84,
      "status": "warning",
      "bay": "Bay 4: Encapsulation & Molding",
      "line": "Line 05 - Auto Encapsulation",
      "issue": "Hydraulic ram pressure spike (178 bar) & mold chase vent resin flash",
      "actionUrgency": "< 40 Hours"
    },
    {
      "id": "PC-02",
      "name": "RF Argon Plasma Cleaner 02",
      "type": "RF Plasma Cleaner",
      "healthScore": 75,
      "rulHours": 94,
      "status": "warning",
      "bay": "Bay 3A: Plasma Activation",
      "line": "Line 03 - Surface Activation",
      "issue": "RF matching network reflected power surge (42W) & chamber vacuum O-ring leak",
      "actionUrgency": "< 48 Hours"
    },
    {
      "id": "TH-01",
      "name": "IC Tri-Temp Test Handler 01",
      "type": "IC Test Handler",
      "healthScore": 76,
      "rulHours": 98,
      "status": "warning",
      "bay": "Bay 6A: Tri-Temp Final Test",
      "line": "Line 09 - Tri-Temp Test",
      "issue": "Kelvin RF socket pogo pin resistance elevation (68 mΩ) during +85°C soak",
      "actionUrgency": "< 48 Hours"
    }
  ]
};

export const MOCK_DASHBOARD_DATA: DashboardData = {
  overview: {
    factoryHealthScore: 92.4,
    healthScoreDelta: -3.8,
    factoryHealthStatus: 'ATTENTION',
    
    // OEE Top KPI
    oeePercentage: 93.2,
    oeeDelta: -2.6,
    oeeAvailability: 95.1,
    oeePerformance: 96.4,
    oeeQuality: 98.5,

    // Fleet breakdown (37 Total: 30 Healthy, 5 Warning, 1 Critical, 1 Offline)
    totalMachines: 37,
    healthyMachines: 30,
    warningMachines: 5,
    criticalMachines: 1,
    offlineMachines: 1,
    onlineMachines: 36,

    // Active alerts
    activeAlertsCount: 6,
    criticalAlertsCount: 1,
    warningAlertsCount: 5,
    imminentSlaCount: 3,

    // Production context
    criticalRiskCount: 1,
    minRulHours: 28,
    minRulMachineId: 'WB-04',
    minRulMachineType: 'Wire Bonder',
    productionRiskLevel: 'high',
    productionRiskDescription: 'ELEVATED RISK (1 Critical Wire Bonder [WB-04: 28h RUL] + 5 Moderate Warnings across Saw, Die Attach, Plasma, Mold, and Test)',
    capacityAtRiskPercentage: 16.2,
  },
  machines: MOCK_MACHINES,
  production: {
    currentThroughput: 26800,
    targetThroughput: 29000,
    yieldPercentage: 98.52,
    targetYieldPercentage: 99.70,
    activeLinesCount: 10,
    totalLinesCount: 10,
    linesAtRiskCount: 4,
    throughputAtRiskPercentage: 16.2,
    lines: [
      {
        lineId: 'LINE-01',
        lineName: 'Line 01 - Wafer Dicing Prep',
        bay: 'Bay 1',
        targetUph: 2800,
        currentUph: 2620,
        efficiency: 93.5,
        yieldRate: 98.80,
        status: 'at-risk',
        riskFactor: 'WS-02 Spindle vibration harmonic (1.65 mm/s)',
      },
      {
        lineId: 'LINE-02',
        lineName: 'Line 02 - Die Attach Matrix',
        bay: 'Bay 2',
        targetUph: 3200,
        currentUph: 2950,
        efficiency: 92.1,
        yieldRate: 98.40,
        status: 'at-risk',
        riskFactor: 'DA-02 Collet vacuum pressure drop (-54 kPa)',
      },
      {
        lineId: 'LINE-03',
        lineName: 'Line 03 - Surface Activation',
        bay: 'Bay 3A',
        targetUph: 3000,
        currentUph: 2820,
        efficiency: 94.0,
        yieldRate: 99.10,
        status: 'at-risk',
        riskFactor: 'PC-02 RF reflected power surge (42W)',
      },
      {
        lineId: 'LINE-04',
        lineName: 'Line 04 - Micro-Interconnect',
        bay: 'Bay 3B',
        targetUph: 3600,
        currentUph: 3040,
        efficiency: 84.4,
        yieldRate: 97.20,
        status: 'at-risk',
        riskFactor: 'WB-04 PZT Transducer resonance decoupling (3.42 mm/s, 28h RUL)',
      },
      {
        lineId: 'LINE-05',
        lineName: 'Line 05 - Auto Encapsulation',
        bay: 'Bay 4',
        targetUph: 2600,
        currentUph: 2480,
        efficiency: 95.3,
        yieldRate: 98.90,
        status: 'at-risk',
        riskFactor: 'MP-03 Hydraulic ram pressure spike (178 bar)',
      },
      {
        lineId: 'LINE-06',
        lineName: 'Line 06 - 3D Metrology QA',
        bay: 'Bay 5A',
        targetUph: 3200,
        currentUph: 3190,
        efficiency: 99.6,
        yieldRate: 99.80,
        status: 'optimal',
      },
      {
        lineId: 'LINE-07',
        lineName: 'Line 07 - Volumetric NDT',
        bay: 'Bay 5B',
        targetUph: 2400,
        currentUph: 2390,
        efficiency: 99.5,
        yieldRate: 99.75,
        status: 'optimal',
      },
      {
        lineId: 'LINE-08',
        lineName: 'Line 08 - Laser Serialization',
        bay: 'Bay 5C',
        targetUph: 3400,
        currentUph: 3350,
        efficiency: 98.5,
        yieldRate: 99.90,
        status: 'optimal',
      },
      {
        lineId: 'LINE-09',
        lineName: 'Line 09 - Tri-Temp Test',
        bay: 'Bay 6A',
        targetUph: 2800,
        currentUph: 2640,
        efficiency: 94.2,
        yieldRate: 98.60,
        status: 'at-risk',
        riskFactor: 'TH-01 Kelvin socket contact resistance (68 mΩ)',
      },
      {
        lineId: 'LINE-10',
        lineName: 'Line 10 - Reel Packaging',
        bay: 'Bay 6B',
        targetUph: 3500,
        currentUph: 3480,
        efficiency: 99.4,
        yieldRate: 99.85,
        status: 'optimal',
      },
    ],
  },
  alerts: MOCK_ALERTS,
  healthTrends: {
    '24H': [
      { timestamp: '00:00', label: '00:00', factoryHealth: 96.8, healthyCount: 36, warningCount: 1, criticalCount: 0 },
      { timestamp: '04:00', label: '04:00', factoryHealth: 95.4, healthyCount: 34, warningCount: 3, criticalCount: 0 },
      { timestamp: '08:00', label: '08:00', factoryHealth: 93.8, healthyCount: 32, warningCount: 4, criticalCount: 1 },
      { timestamp: '12:00', label: '12:00', factoryHealth: 92.6, healthyCount: 31, warningCount: 5, criticalCount: 1 },
      { timestamp: '14:00', label: '14:00', factoryHealth: 92.4, healthyCount: 30, warningCount: 5, criticalCount: 1 },
      { timestamp: '16:00', label: 'Now', factoryHealth: 92.4, healthyCount: 30, warningCount: 5, criticalCount: 1 },
    ],
    '7D': [
      { timestamp: 'Aug 20', label: 'Thu 20', factoryHealth: 97.2, healthyCount: 37, warningCount: 0, criticalCount: 0 },
      { timestamp: 'Aug 21', label: 'Fri 21', factoryHealth: 97.4, healthyCount: 37, warningCount: 0, criticalCount: 0 },
      { timestamp: 'Aug 22', label: 'Sat 22', factoryHealth: 96.9, healthyCount: 37, warningCount: 0, criticalCount: 0 },
      { timestamp: 'Aug 23', label: 'Sun 23', factoryHealth: 95.8, healthyCount: 35, warningCount: 2, criticalCount: 0 },
      { timestamp: 'Aug 24', label: 'Mon 24', factoryHealth: 94.6, healthyCount: 33, warningCount: 4, criticalCount: 0 },
      { timestamp: 'Aug 25', label: 'Tue 25', factoryHealth: 93.5, healthyCount: 31, warningCount: 5, criticalCount: 1 },
      { timestamp: 'Aug 26', label: 'Today', factoryHealth: 92.4, healthyCount: 30, warningCount: 5, criticalCount: 1 },
    ],
    '30D': [
      { timestamp: 'W1', label: 'Week 30', factoryHealth: 97.6, healthyCount: 37, warningCount: 0, criticalCount: 0 },
      { timestamp: 'W2', label: 'Week 31', factoryHealth: 97.2, healthyCount: 37, warningCount: 0, criticalCount: 0 },
      { timestamp: 'W3', label: 'Week 32', factoryHealth: 96.2, healthyCount: 36, warningCount: 1, criticalCount: 0 },
      { timestamp: 'W4', label: 'Week 33', factoryHealth: 94.5, healthyCount: 33, warningCount: 3, criticalCount: 1 },
      { timestamp: 'W5', label: 'Current', factoryHealth: 92.4, healthyCount: 30, warningCount: 5, criticalCount: 1 },
    ],
  },
  oeeTrends: MOCK_OEE_TRENDS,
  processRisk: MOCK_PROCESS_RISK,
  predictiveRisk: MOCK_PREDICTIVE_RISK,
  maintenance: {
    dueToday: 4,
    dueThisWeek: 7,
    overdue: 1,
    inProgress: 1,
    recentlyCompleted: 14,
    priorityTasks: MOCK_MAINTENANCE_TASKS,
  },
};
