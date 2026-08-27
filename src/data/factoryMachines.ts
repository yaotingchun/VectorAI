import { MachineData } from '../types/factory';

export const INITIAL_MACHINES: MachineData[] = [
  {
    "id": "WS-01",
    "code": "WS-01",
    "type": "wafer-saw",
    "name": "300mm Precision Wafer Saw 01",
    "category": "backend",
    "stage": "Stage 01: Wafer Dicing & Prep",
    "status": "running",
    "statusMessage": "300mm Precision Wafer Saw 01 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 60,
    "y": 80,
    "width": 240,
    "height": 95,
    "telemetry": {
      "oee": 96,
      "temperature": 23.8,
      "vibration": 0.38,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 98
    },
    "maintenance": {
      "lastServiced": "2026-08-10",
      "nextServiceDue": "2026-09-10",
      "operatingHours": 2400,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "DA-01",
      "DA-02"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "WS-02",
    "code": "WS-02",
    "type": "wafer-saw",
    "name": "300mm Precision Wafer Saw 02",
    "category": "backend",
    "stage": "Stage 01: Wafer Dicing & Prep",
    "status": "warning",
    "statusMessage": "Spindle 12.4 kHz harmonic micro-spalling — Vibration 1.65 mm/s",
    "efficiency": 0.82,
    "x": 60,
    "y": 190,
    "width": 240,
    "height": 95,
    "telemetry": {
      "oee": 82,
      "temperature": 38.4,
      "vibration": 1.65,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 71
    },
    "maintenance": {
      "lastServiced": "2026-08-01",
      "nextServiceDue": "2026-08-28",
      "operatingHours": 2180,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "DA-03",
      "DA-04"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "STK-01",
    "code": "STK-01",
    "type": "stocker",
    "name": "AMHS Cleanroom FOUP Stocker 01",
    "category": "transport",
    "stage": "Stage 01: Wafer Dicing & Prep",
    "status": "running",
    "statusMessage": "AMHS Cleanroom FOUP Stocker 01 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 60,
    "y": 300,
    "width": 240,
    "height": 95,
    "telemetry": {
      "oee": 96,
      "temperature": 21.2,
      "vibration": 0.12,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 99
    },
    "maintenance": {
      "lastServiced": "2026-08-01",
      "nextServiceDue": "2026-11-01",
      "operatingHours": 4500,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "WS-01",
      "WS-02"
    ],
    "connectionType": "agv-path"
  },
  {
    "id": "DA-01",
    "code": "DA-01",
    "type": "die-attach",
    "name": "High-Precision Die Bonder 01",
    "category": "backend",
    "stage": "Stage 02: Die Attach & SMT",
    "status": "running",
    "statusMessage": "High-Precision Die Bonder 01 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 360,
    "y": 80,
    "width": 240,
    "height": 95,
    "telemetry": {
      "oee": 96,
      "temperature": 165,
      "vibration": 0.38,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 97
    },
    "maintenance": {
      "lastServiced": "2026-08-05",
      "nextServiceDue": "2026-09-05",
      "operatingHours": 1580,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "PC-01"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "DA-02",
    "code": "DA-02",
    "type": "die-attach",
    "name": "High-Precision Die Bonder 02",
    "category": "backend",
    "stage": "Stage 02: Die Attach & SMT",
    "status": "warning",
    "statusMessage": "Collet vacuum pressure drop (-54 kPa) — BLT variance risk",
    "efficiency": 0.84,
    "x": 360,
    "y": 190,
    "width": 240,
    "height": 95,
    "telemetry": {
      "oee": 84,
      "temperature": 172,
      "vibration": 0.68,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 69
    },
    "maintenance": {
      "lastServiced": "2026-07-28",
      "nextServiceDue": "2026-08-29",
      "operatingHours": 1420,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "PC-01"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "DA-03",
    "code": "DA-03",
    "type": "die-attach",
    "name": "High-Precision Die Bonder 03",
    "category": "backend",
    "stage": "Stage 02: Die Attach & SMT",
    "status": "running",
    "statusMessage": "High-Precision Die Bonder 03 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 360,
    "y": 300,
    "width": 240,
    "height": 95,
    "telemetry": {
      "oee": 96,
      "temperature": 164,
      "vibration": 0.35,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 98
    },
    "maintenance": {
      "lastServiced": "2026-08-11",
      "nextServiceDue": "2026-09-11",
      "operatingHours": 1750,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "PC-02"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "DA-04",
    "code": "DA-04",
    "type": "die-attach",
    "name": "High-Precision Die Bonder 04",
    "category": "backend",
    "stage": "Stage 02: Die Attach & SMT",
    "status": "running",
    "statusMessage": "High-Precision Die Bonder 04 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 360,
    "y": 410,
    "width": 240,
    "height": 95,
    "telemetry": {
      "oee": 96,
      "temperature": 166,
      "vibration": 0.37,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 96
    },
    "maintenance": {
      "lastServiced": "2026-08-14",
      "nextServiceDue": "2026-09-14",
      "operatingHours": 1600,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "PC-02"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "PC-01",
    "code": "PC-01",
    "type": "plasma-cleaner",
    "name": "RF Argon Plasma Surface Cleaner 01",
    "category": "backend",
    "stage": "Stage 03: Plasma Surface Activation",
    "status": "running",
    "statusMessage": "RF Argon Plasma Surface Cleaner 01 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 660,
    "y": 135,
    "width": 240,
    "height": 95,
    "telemetry": {
      "oee": 96,
      "temperature": 28.5,
      "vibration": 0.18,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 97
    },
    "maintenance": {
      "lastServiced": "2026-08-02",
      "nextServiceDue": "2026-10-02",
      "operatingHours": 2800,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "WB-01",
      "WB-02",
      "WB-03",
      "WB-04"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "PC-02",
    "code": "PC-02",
    "type": "plasma-cleaner",
    "name": "RF Argon Plasma Surface Cleaner 02",
    "category": "backend",
    "stage": "Stage 03: Plasma Surface Activation",
    "status": "warning",
    "statusMessage": "RF matching reflected power rise (42W) — Surface energy 48 dyn/cm",
    "efficiency": 0.86,
    "x": 660,
    "y": 355,
    "width": 240,
    "height": 95,
    "telemetry": {
      "oee": 86,
      "temperature": 28.5,
      "vibration": 0.48,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 75
    },
    "maintenance": {
      "lastServiced": "2026-07-20",
      "nextServiceDue": "2026-08-29",
      "operatingHours": 2650,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "WB-05",
      "WB-06",
      "WB-07",
      "WB-08"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "WB-01",
    "code": "WB-01",
    "type": "wire-bonding",
    "name": "Thermosonic Ball Bonder 01",
    "category": "backend",
    "stage": "Stage 04: Wire Bonding Cleanroom",
    "status": "running",
    "statusMessage": "Thermosonic Ball Bonder 01 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 960,
    "y": 30,
    "width": 240,
    "height": 80,
    "telemetry": {
      "oee": 96,
      "temperature": 46,
      "vibration": 0.45,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 95
    },
    "maintenance": {
      "lastServiced": "2026-08-11",
      "nextServiceDue": "2026-09-11",
      "operatingHours": 1650,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "MP-01"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "WB-02",
    "code": "WB-02",
    "type": "wire-bonding",
    "name": "Thermosonic Ball Bonder 02",
    "category": "backend",
    "stage": "Stage 04: Wire Bonding Cleanroom",
    "status": "running",
    "statusMessage": "Thermosonic Ball Bonder 02 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 960,
    "y": 115,
    "width": 240,
    "height": 80,
    "telemetry": {
      "oee": 96,
      "temperature": 47.2,
      "vibration": 0.48,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 94
    },
    "maintenance": {
      "lastServiced": "2026-08-08",
      "nextServiceDue": "2026-09-08",
      "operatingHours": 1520,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "MP-01"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "WB-03",
    "code": "WB-03",
    "type": "wire-bonding",
    "name": "Thermosonic Ball Bonder 03",
    "category": "backend",
    "stage": "Stage 04: Wire Bonding Cleanroom",
    "status": "running",
    "statusMessage": "Thermosonic Ball Bonder 03 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 960,
    "y": 200,
    "width": 240,
    "height": 80,
    "telemetry": {
      "oee": 96,
      "temperature": 45.8,
      "vibration": 0.44,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 96
    },
    "maintenance": {
      "lastServiced": "2026-08-10",
      "nextServiceDue": "2026-09-10",
      "operatingHours": 1720,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "MP-02"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "WB-04",
    "code": "WB-04",
    "type": "wire-bonding",
    "name": "Thermosonic Ball Bonder 04",
    "category": "backend",
    "stage": "Stage 04: Wire Bonding Cleanroom",
    "status": "error",
    "statusMessage": "Critical PZT resonance drift (+4.2 kHz) — Vibration 3.42 mm/s (28h RUL)",
    "efficiency": 0.74,
    "x": 960,
    "y": 285,
    "width": 240,
    "height": 80,
    "telemetry": {
      "oee": 74,
      "temperature": 69.2,
      "vibration": 3.42,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 48
    },
    "maintenance": {
      "lastServiced": "2026-07-20",
      "nextServiceDue": "2026-08-27",
      "operatingHours": 3200,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "MP-02"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "WB-05",
    "code": "WB-05",
    "type": "wire-bonding",
    "name": "Thermosonic Ball Bonder 05",
    "category": "backend",
    "stage": "Stage 04: Wire Bonding Cleanroom",
    "status": "running",
    "statusMessage": "Thermosonic Ball Bonder 05 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 960,
    "y": 370,
    "width": 240,
    "height": 80,
    "telemetry": {
      "oee": 96,
      "temperature": 46.5,
      "vibration": 0.46,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 94
    },
    "maintenance": {
      "lastServiced": "2026-08-12",
      "nextServiceDue": "2026-09-12",
      "operatingHours": 1550,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "MP-03"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "WB-06",
    "code": "WB-06",
    "type": "wire-bonding",
    "name": "Thermosonic Ball Bonder 06",
    "category": "backend",
    "stage": "Stage 04: Wire Bonding Cleanroom",
    "status": "running",
    "statusMessage": "Thermosonic Ball Bonder 06 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 960,
    "y": 455,
    "width": 240,
    "height": 80,
    "telemetry": {
      "oee": 96,
      "temperature": 45.4,
      "vibration": 0.42,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 96
    },
    "maintenance": {
      "lastServiced": "2026-08-14",
      "nextServiceDue": "2026-09-14",
      "operatingHours": 1680,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "MP-03"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "WB-07",
    "code": "WB-07",
    "type": "wire-bonding",
    "name": "Thermosonic Ball Bonder 07",
    "category": "backend",
    "stage": "Stage 04: Wire Bonding Cleanroom",
    "status": "running",
    "statusMessage": "Thermosonic Ball Bonder 07 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 960,
    "y": 540,
    "width": 240,
    "height": 80,
    "telemetry": {
      "oee": 96,
      "temperature": 48,
      "vibration": 0.5,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 93
    },
    "maintenance": {
      "lastServiced": "2026-08-05",
      "nextServiceDue": "2026-09-05",
      "operatingHours": 1480,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "MP-04"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "WB-08",
    "code": "WB-08",
    "type": "wire-bonding",
    "name": "Thermosonic Ball Bonder 08",
    "category": "backend",
    "stage": "Stage 04: Wire Bonding Cleanroom",
    "status": "running",
    "statusMessage": "Thermosonic Ball Bonder 08 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 960,
    "y": 625,
    "width": 240,
    "height": 80,
    "telemetry": {
      "oee": 96,
      "temperature": 46.8,
      "vibration": 0.44,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 95
    },
    "maintenance": {
      "lastServiced": "2026-08-10",
      "nextServiceDue": "2026-09-10",
      "operatingHours": 1600,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "MP-04"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "MP-01",
    "code": "MP-01",
    "type": "molding-press",
    "name": "Auto Molding Press 01 (Multi-Cavity)",
    "category": "backend",
    "stage": "Stage 05: Encapsulation & Molding",
    "status": "running",
    "statusMessage": "Auto Molding Press 01 (Multi-Cavity) nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 1260,
    "y": 80,
    "width": 240,
    "height": 95,
    "telemetry": {
      "oee": 96,
      "temperature": 175.4,
      "vibration": 0.35,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 94
    },
    "maintenance": {
      "lastServiced": "2026-08-01",
      "nextServiceDue": "2026-09-01",
      "operatingHours": 1980,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "AOI-01"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "MP-02",
    "code": "MP-02",
    "type": "molding-press",
    "name": "Auto Molding Press 02 (Multi-Cavity)",
    "category": "backend",
    "stage": "Stage 05: Encapsulation & Molding",
    "status": "running",
    "statusMessage": "Auto Molding Press 02 (Multi-Cavity) nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 1260,
    "y": 190,
    "width": 240,
    "height": 95,
    "telemetry": {
      "oee": 96,
      "temperature": 174.8,
      "vibration": 0.35,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 93
    },
    "maintenance": {
      "lastServiced": "2026-08-03",
      "nextServiceDue": "2026-09-03",
      "operatingHours": 1850,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "AOI-02"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "MP-03",
    "code": "MP-03",
    "type": "molding-press",
    "name": "Auto Molding Press 03 (Multi-Cavity)",
    "category": "backend",
    "stage": "Stage 05: Encapsulation & Molding",
    "status": "warning",
    "statusMessage": "Hydraulic ram pressure spike (178 bar) — Vent resin flash",
    "efficiency": 0.85,
    "x": 1260,
    "y": 300,
    "width": 240,
    "height": 95,
    "telemetry": {
      "oee": 85,
      "temperature": 188.5,
      "vibration": 0.35,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 73
    },
    "maintenance": {
      "lastServiced": "2026-07-22",
      "nextServiceDue": "2026-08-30",
      "operatingHours": 2150,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "AOI-03"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "MP-04",
    "code": "MP-04",
    "type": "molding-press",
    "name": "Auto Molding Press 04 (Multi-Cavity)",
    "category": "backend",
    "stage": "Stage 05: Encapsulation & Molding",
    "status": "running",
    "statusMessage": "Auto Molding Press 04 (Multi-Cavity) nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 1260,
    "y": 410,
    "width": 240,
    "height": 95,
    "telemetry": {
      "oee": 96,
      "temperature": 175.2,
      "vibration": 0.35,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 95
    },
    "maintenance": {
      "lastServiced": "2026-08-09",
      "nextServiceDue": "2026-09-09",
      "operatingHours": 2020,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "AOI-04"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "AOI-01",
    "code": "AOI-01",
    "type": "aoi-inspection",
    "name": "3D Optical AOI Line 01",
    "category": "backend",
    "stage": "Stage 06: 3D AOI & X-Ray Metrology",
    "status": "running",
    "statusMessage": "3D Optical AOI Line 01 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 1560,
    "y": 50,
    "width": 240,
    "height": 75,
    "telemetry": {
      "oee": 96,
      "temperature": 22.8,
      "vibration": 0.08,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 99
    },
    "maintenance": {
      "lastServiced": "2026-08-15",
      "nextServiceDue": "2026-10-15",
      "operatingHours": 3200,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "XR-01"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "AOI-02",
    "code": "AOI-02",
    "type": "aoi-inspection",
    "name": "3D Optical AOI Line 02",
    "category": "backend",
    "stage": "Stage 06: 3D AOI & X-Ray Metrology",
    "status": "running",
    "statusMessage": "3D Optical AOI Line 02 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 1560,
    "y": 135,
    "width": 240,
    "height": 75,
    "telemetry": {
      "oee": 96,
      "temperature": 23.2,
      "vibration": 0.09,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 98
    },
    "maintenance": {
      "lastServiced": "2026-08-16",
      "nextServiceDue": "2026-10-16",
      "operatingHours": 3050,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "XR-01"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "AOI-03",
    "code": "AOI-03",
    "type": "aoi-inspection",
    "name": "3D Optical AOI Line 03",
    "category": "backend",
    "stage": "Stage 06: 3D AOI & X-Ray Metrology",
    "status": "running",
    "statusMessage": "3D Optical AOI Line 03 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 1560,
    "y": 220,
    "width": 240,
    "height": 75,
    "telemetry": {
      "oee": 96,
      "temperature": 22.9,
      "vibration": 0.08,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 99
    },
    "maintenance": {
      "lastServiced": "2026-08-17",
      "nextServiceDue": "2026-10-17",
      "operatingHours": 3180,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "XR-02"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "AOI-04",
    "code": "AOI-04",
    "type": "aoi-inspection",
    "name": "3D Optical AOI Line 04",
    "category": "backend",
    "stage": "Stage 06: 3D AOI & X-Ray Metrology",
    "status": "running",
    "statusMessage": "3D Optical AOI Line 04 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 1560,
    "y": 305,
    "width": 240,
    "height": 75,
    "telemetry": {
      "oee": 96,
      "temperature": 23,
      "vibration": 0.09,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 98
    },
    "maintenance": {
      "lastServiced": "2026-08-18",
      "nextServiceDue": "2026-10-18",
      "operatingHours": 3100,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "XR-02"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "XR-01",
    "code": "XR-01",
    "type": "x-ray-inspection",
    "name": "Microfocus X-Ray NDT Cell 01",
    "category": "backend",
    "stage": "Stage 06: 3D AOI & X-Ray Metrology",
    "status": "running",
    "statusMessage": "Microfocus X-Ray NDT Cell 01 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 1560,
    "y": 390,
    "width": 240,
    "height": 75,
    "telemetry": {
      "oee": 96,
      "temperature": 34.8,
      "vibration": 0.22,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 97
    },
    "maintenance": {
      "lastServiced": "2026-08-01",
      "nextServiceDue": "2026-11-01",
      "operatingHours": 2450,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "LM-01"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "XR-02",
    "code": "XR-02",
    "type": "x-ray-inspection",
    "name": "Microfocus X-Ray NDT Cell 02",
    "category": "backend",
    "stage": "Stage 06: 3D AOI & X-Ray Metrology",
    "status": "running",
    "statusMessage": "Microfocus X-Ray NDT Cell 02 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 1560,
    "y": 475,
    "width": 240,
    "height": 75,
    "telemetry": {
      "oee": 96,
      "temperature": 35.2,
      "vibration": 0.24,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 96
    },
    "maintenance": {
      "lastServiced": "2026-08-03",
      "nextServiceDue": "2026-11-03",
      "operatingHours": 2380,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "LM-02"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "LM-01",
    "code": "LM-01",
    "type": "laser-marking",
    "name": "Galvo Fiber Laser Marker 01",
    "category": "backend",
    "stage": "Stage 07: Final Test & Packaging",
    "status": "running",
    "statusMessage": "Galvo Fiber Laser Marker 01 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 1860,
    "y": 30,
    "width": 240,
    "height": 70,
    "telemetry": {
      "oee": 96,
      "temperature": 28.5,
      "vibration": 0.35,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 98
    },
    "maintenance": {
      "lastServiced": "2026-08-08",
      "nextServiceDue": "2026-11-08",
      "operatingHours": 3500,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "TH-01"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "LM-02",
    "code": "LM-02",
    "type": "laser-marking",
    "name": "Galvo Fiber Laser Marker 02",
    "category": "backend",
    "stage": "Stage 07: Final Test & Packaging",
    "status": "maintenance",
    "statusMessage": "Planned 500-hour optical window & F-Theta lens calibration",
    "efficiency": 0,
    "x": 1860,
    "y": 110,
    "width": 240,
    "height": 70,
    "telemetry": {
      "oee": 0,
      "temperature": 22,
      "vibration": 0.35,
      "powerConsumptionKw": 0,
      "cycleTimeSec": 0,
      "healthScore": 88
    },
    "maintenance": {
      "lastServiced": "2026-08-27",
      "nextServiceDue": "2026-11-27",
      "operatingHours": 3350,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "TH-02"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "TH-01",
    "code": "TH-01",
    "type": "test-handler",
    "name": "IC Tri-Temp Test Handler 01",
    "category": "backend",
    "stage": "Stage 07: Final Test & Packaging",
    "status": "warning",
    "statusMessage": "Kelvin socket contact resistance elevation (68 mΩ) at +85°C soak",
    "efficiency": 0.87,
    "x": 1860,
    "y": 190,
    "width": 240,
    "height": 70,
    "telemetry": {
      "oee": 87,
      "temperature": 92.4,
      "vibration": 0.78,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 76
    },
    "maintenance": {
      "lastServiced": "2026-07-25",
      "nextServiceDue": "2026-08-30",
      "operatingHours": 2100,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "TR-01",
      "TR-02"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "TH-02",
    "code": "TH-02",
    "type": "test-handler",
    "name": "IC Tri-Temp Test Handler 02",
    "category": "backend",
    "stage": "Stage 07: Final Test & Packaging",
    "status": "running",
    "statusMessage": "IC Tri-Temp Test Handler 02 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 1860,
    "y": 270,
    "width": 240,
    "height": 70,
    "telemetry": {
      "oee": 96,
      "temperature": -40,
      "vibration": 0.48,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 97
    },
    "maintenance": {
      "lastServiced": "2026-08-14",
      "nextServiceDue": "2026-09-14",
      "operatingHours": 2250,
      "mtbfHours": 4000
    },
    "connectionsTo": [
      "TR-03",
      "TR-04"
    ],
    "connectionType": "conveyor"
  },
  {
    "id": "TR-01",
    "code": "TR-01",
    "type": "tape-reel",
    "name": "Automated Tape & Reel 01",
    "category": "backend",
    "stage": "Stage 07: Final Test & Packaging",
    "status": "running",
    "statusMessage": "Automated Tape & Reel 01 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 1860,
    "y": 350,
    "width": 240,
    "height": 60,
    "telemetry": {
      "oee": 96,
      "temperature": 175,
      "vibration": 0.32,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 96
    },
    "maintenance": {
      "lastServiced": "2026-08-06",
      "nextServiceDue": "2026-09-06",
      "operatingHours": 2400,
      "mtbfHours": 4000
    },
    "connectionsTo": [],
    "connectionType": "conveyor"
  },
  {
    "id": "TR-02",
    "code": "TR-02",
    "type": "tape-reel",
    "name": "Automated Tape & Reel 02",
    "category": "backend",
    "stage": "Stage 07: Final Test & Packaging",
    "status": "running",
    "statusMessage": "Automated Tape & Reel 02 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 1860,
    "y": 420,
    "width": 240,
    "height": 60,
    "telemetry": {
      "oee": 96,
      "temperature": 176,
      "vibration": 0.34,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 95
    },
    "maintenance": {
      "lastServiced": "2026-08-08",
      "nextServiceDue": "2026-09-08",
      "operatingHours": 2280,
      "mtbfHours": 4000
    },
    "connectionsTo": [],
    "connectionType": "conveyor"
  },
  {
    "id": "TR-03",
    "code": "TR-03",
    "type": "tape-reel",
    "name": "Automated Tape & Reel 03",
    "category": "backend",
    "stage": "Stage 07: Final Test & Packaging",
    "status": "running",
    "statusMessage": "Automated Tape & Reel 03 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 1860,
    "y": 490,
    "width": 240,
    "height": 60,
    "telemetry": {
      "oee": 96,
      "temperature": 174,
      "vibration": 0.3,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 98
    },
    "maintenance": {
      "lastServiced": "2026-08-11",
      "nextServiceDue": "2026-09-11",
      "operatingHours": 2600,
      "mtbfHours": 4000
    },
    "connectionsTo": [],
    "connectionType": "conveyor"
  },
  {
    "id": "TR-04",
    "code": "TR-04",
    "type": "tape-reel",
    "name": "Automated Tape & Reel 04",
    "category": "backend",
    "stage": "Stage 07: Final Test & Packaging",
    "status": "running",
    "statusMessage": "Automated Tape & Reel 04 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 1860,
    "y": 560,
    "width": 240,
    "height": 60,
    "telemetry": {
      "oee": 96,
      "temperature": 178,
      "vibration": 0.36,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 94
    },
    "maintenance": {
      "lastServiced": "2026-08-13",
      "nextServiceDue": "2026-09-13",
      "operatingHours": 2150,
      "mtbfHours": 4000
    },
    "connectionsTo": [],
    "connectionType": "conveyor"
  },
  {
    "id": "TR-05",
    "code": "TR-05",
    "type": "tape-reel",
    "name": "Automated Tape & Reel 05",
    "category": "backend",
    "stage": "Stage 07: Final Test & Packaging",
    "status": "running",
    "statusMessage": "Automated Tape & Reel 05 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 1860,
    "y": 630,
    "width": 240,
    "height": 60,
    "telemetry": {
      "oee": 96,
      "temperature": 175,
      "vibration": 0.31,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 97
    },
    "maintenance": {
      "lastServiced": "2026-08-15",
      "nextServiceDue": "2026-09-15",
      "operatingHours": 2520,
      "mtbfHours": 4000
    },
    "connectionsTo": [],
    "connectionType": "conveyor"
  },
  {
    "id": "TR-06",
    "code": "TR-06",
    "type": "tape-reel",
    "name": "Automated Tape & Reel 06",
    "category": "backend",
    "stage": "Stage 07: Final Test & Packaging",
    "status": "running",
    "statusMessage": "Automated Tape & Reel 06 nominal throughput (100% capacity)",
    "efficiency": 0.96,
    "x": 1860,
    "y": 700,
    "width": 240,
    "height": 60,
    "telemetry": {
      "oee": 96,
      "temperature": 174,
      "vibration": 0.29,
      "powerConsumptionKw": 3.5,
      "cycleTimeSec": 18,
      "healthScore": 98
    },
    "maintenance": {
      "lastServiced": "2026-08-16",
      "nextServiceDue": "2026-09-16",
      "operatingHours": 2700,
      "mtbfHours": 4000
    },
    "connectionsTo": [],
    "connectionType": "conveyor"
  }
];
