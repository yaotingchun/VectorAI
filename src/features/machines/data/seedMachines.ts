import { Machine } from '../types/machine';

export const SEED_MACHINES: Machine[] = [
  {
    "id": "WS-01",
    "name": "300mm Precision Wafer Saw 01",
    "machineType": "wafer-saw",
    "processStage": "Bay 1: Wafer Dicing & Prep",
    "status": "healthy",
    "healthScore": 98,
    "operatingHours": 2400,
    "installationDate": "2025-01-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z",
    "firmwareVersion": "v4.1.8",
    "ipAddress": "10.24.101.1",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 1: Wafer Dicing & Prep",
      "line": "Saw Line 1",
      "station": "Station WS-01",
      "gridCoordinate": {
        "x": 235,
        "y": 109
      }
    },
    "rul": {
      "value": 2400,
      "unit": "hours",
      "confidence": 0.96,
      "estimatedDays": 100,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_spindle",
        "name": "Spindle Vibration",
        "value": 0.38,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "temperature_coolant",
        "name": "Coolant Temp",
        "value": 23.8,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "load_motor",
        "name": "Spindle Motor Load",
        "value": 52,
        "unit": "%",
        "status": "normal",
        "lastUpdated": "3s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-10",
      "nextScheduledDate": "2026-09-10",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Kenji Sato"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-WS-001",
        "title": "300mm Precision Wafer Dicing Saw Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-20",
        "size": "42 KB",
        "tags": [
          "Wafer Saw",
          "ISO 5"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/wafer_dicing",
    "manualId": "VAI-MAN-DIC-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 98
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 99
        },
        {
          "timestamp": "Day 7",
          "health": 98
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 99
        },
        {
          "timestamp": "Wk 4",
          "health": 98
        }
      ]
    }
  },
  {
    "id": "WS-02",
    "name": "300mm Precision Wafer Saw 02",
    "machineType": "wafer-saw",
    "processStage": "Bay 1: Wafer Dicing & Prep",
    "status": "healthy",
    "healthScore": 96,
    "operatingHours": 2180,
    "firmwareVersion": "v4.1.8",
    "ipAddress": "10.24.101.2",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 1: Wafer Dicing & Prep",
      "line": "Saw Line 2",
      "station": "Station WS-02",
      "gridCoordinate": {
        "x": 310,
        "y": 109
      }
    },
    "rul": {
      "value": 2180,
      "unit": "hours",
      "confidence": 0.95,
      "estimatedDays": 90.8,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_spindle",
        "name": "Spindle Vibration",
        "value": 0.42,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "temperature_coolant",
        "name": "Coolant Temp",
        "value": 24.2,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "load_motor",
        "name": "Spindle Motor Load",
        "value": 55,
        "unit": "%",
        "status": "normal",
        "lastUpdated": "4s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-12",
      "nextScheduledDate": "2026-09-12",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Kenji Sato"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-WS-001",
        "title": "300mm Precision Wafer Dicing Saw Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-20",
        "size": "42 KB",
        "tags": [
          "Wafer Saw",
          "ISO 5"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/wafer_dicing",
    "manualId": "VAI-MAN-DIC-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 96
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 97
        },
        {
          "timestamp": "Day 7",
          "health": 96
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 98
        },
        {
          "timestamp": "Wk 4",
          "health": 96
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "STK-01",
    "name": "AMHS Cleanroom FOUP Stocker 01",
    "machineType": "stocker",
    "processStage": "Bay 1: Wafer Dicing & Prep",
    "status": "healthy",
    "healthScore": 99,
    "operatingHours": 4500,
    "firmwareVersion": "v2.4.0",
    "ipAddress": "10.24.101.99",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 1: Wafer Dicing & Prep",
      "line": "AMHS Loop Alpha",
      "station": "Stocker 01",
      "gridCoordinate": {
        "x": 385,
        "y": 105
      }
    },
    "rul": {
      "value": 4500,
      "unit": "hours",
      "confidence": 0.98,
      "estimatedDays": 187.5,
      "criticalThresholdHours": 150,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_crane",
        "name": "Robotic Crane Vibration",
        "value": 0.12,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "2s ago"
      },
      {
        "sensorId": "pressure_n2",
        "name": "N2 Purge Pressure",
        "value": 52,
        "unit": "kPa",
        "status": "normal",
        "lastUpdated": "2s ago"
      },
      {
        "sensorId": "temp_stocker",
        "name": "Internal Enclosure Temp",
        "value": 21.2,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "2s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-01",
      "nextScheduledDate": "2026-11-01",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Elena Vance"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-STK-001",
        "title": "Automated Cleanroom Stocker Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-15",
        "size": "28 KB",
        "tags": [
          "AMHS",
          "N2 Purge"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/wafer_dicing",
    "manualId": "VAI-MAN-DIC-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 99
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 99
        },
        {
          "timestamp": "Day 7",
          "health": 99
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 100
        },
        {
          "timestamp": "Wk 4",
          "health": 99
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "DA-01",
    "name": "High-Precision Die Bonder 01",
    "machineType": "die-attach",
    "processStage": "Bay 2: Die Attach & SMT",
    "status": "healthy",
    "healthScore": 97,
    "operatingHours": 1580,
    "firmwareVersion": "v5.3.1",
    "ipAddress": "10.24.102.1",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 2: Die Attach & SMT",
      "line": "Die Attach Line 1",
      "station": "Station DA-01",
      "gridCoordinate": {
        "x": 480,
        "y": 109
      }
    },
    "rul": {
      "value": 1580,
      "unit": "hours",
      "confidence": 0.95,
      "estimatedDays": 65.8,
      "criticalThresholdHours": 80,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_arm",
        "name": "Arm Vibration",
        "value": 0.38,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "pressure_vacuum",
        "name": "Collet Vacuum Pressure",
        "value": -82,
        "unit": "kPa",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "temperature_heater",
        "name": "Heater Block Temp",
        "value": 165,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "4s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-05",
      "nextScheduledDate": "2026-09-05",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Marcus Thorne"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-DA-001",
        "title": "High-Precision Die Bonder Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-18",
        "size": "38 KB",
        "tags": [
          "Die Attach",
          "Epoxy"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/die_attacher",
    "manualId": "VAI-MAN-DA-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 97
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 98
        },
        {
          "timestamp": "Day 7",
          "health": 97
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 99
        },
        {
          "timestamp": "Wk 4",
          "health": 97
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "DA-02",
    "name": "High-Precision Die Bonder 02",
    "machineType": "die-attach",
    "processStage": "Bay 2: Die Attach & SMT",
    "status": "healthy",
    "healthScore": 95,
    "operatingHours": 1420,
    "firmwareVersion": "v5.3.1",
    "ipAddress": "10.24.102.2",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 2: Die Attach & SMT",
      "line": "Die Attach Line 1",
      "station": "Station DA-02",
      "gridCoordinate": {
        "x": 555,
        "y": 109
      }
    },
    "rul": {
      "value": 1420,
      "unit": "hours",
      "confidence": 0.94,
      "estimatedDays": 59.1,
      "criticalThresholdHours": 80,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_arm",
        "name": "Arm Vibration",
        "value": 0.4,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "5s ago"
      },
      {
        "sensorId": "pressure_vacuum",
        "name": "Collet Vacuum Pressure",
        "value": -80,
        "unit": "kPa",
        "status": "normal",
        "lastUpdated": "5s ago"
      },
      {
        "sensorId": "temperature_heater",
        "name": "Heater Block Temp",
        "value": 168,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "5s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-08",
      "nextScheduledDate": "2026-09-08",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Marcus Thorne"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-DA-001",
        "title": "High-Precision Die Bonder Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-18",
        "size": "38 KB",
        "tags": [
          "Die Attach",
          "Epoxy"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/die_attacher",
    "manualId": "VAI-MAN-DA-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 95
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 96
        },
        {
          "timestamp": "Day 7",
          "health": 95
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 98
        },
        {
          "timestamp": "Wk 4",
          "health": 95
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "DA-03",
    "name": "High-Precision Die Bonder 03",
    "machineType": "die-attach",
    "processStage": "Bay 2: Die Attach & SMT",
    "status": "healthy",
    "healthScore": 98,
    "operatingHours": 1750,
    "firmwareVersion": "v5.3.1",
    "ipAddress": "10.24.102.3",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 2: Die Attach & SMT",
      "line": "Die Attach Line 2",
      "station": "Station DA-03",
      "gridCoordinate": {
        "x": 630,
        "y": 109
      }
    },
    "rul": {
      "value": 1750,
      "unit": "hours",
      "confidence": 0.96,
      "estimatedDays": 72.9,
      "criticalThresholdHours": 80,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_arm",
        "name": "Arm Vibration",
        "value": 0.35,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "pressure_vacuum",
        "name": "Collet Vacuum Pressure",
        "value": -84,
        "unit": "kPa",
        "status": "normal",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "temperature_heater",
        "name": "Heater Block Temp",
        "value": 164,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "3s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-11",
      "nextScheduledDate": "2026-09-11",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-DA-001",
        "title": "High-Precision Die Bonder Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-18",
        "size": "38 KB",
        "tags": [
          "Die Attach",
          "Epoxy"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/die_attacher",
    "manualId": "VAI-MAN-DA-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 98
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 99
        },
        {
          "timestamp": "Day 7",
          "health": 98
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 99
        },
        {
          "timestamp": "Wk 4",
          "health": 98
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "DA-04",
    "name": "High-Precision Die Bonder 04",
    "machineType": "die-attach",
    "processStage": "Bay 2: Die Attach & SMT",
    "status": "healthy",
    "healthScore": 96,
    "operatingHours": 1600,
    "firmwareVersion": "v5.3.1",
    "ipAddress": "10.24.102.4",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 2: Die Attach & SMT",
      "line": "Die Attach Line 2",
      "station": "Station DA-04",
      "gridCoordinate": {
        "x": 705,
        "y": 109
      }
    },
    "rul": {
      "value": 1600,
      "unit": "hours",
      "confidence": 0.95,
      "estimatedDays": 66.7,
      "criticalThresholdHours": 80,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_arm",
        "name": "Arm Vibration",
        "value": 0.37,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "6s ago"
      },
      {
        "sensorId": "pressure_vacuum",
        "name": "Collet Vacuum Pressure",
        "value": -82,
        "unit": "kPa",
        "status": "normal",
        "lastUpdated": "6s ago"
      },
      {
        "sensorId": "temperature_heater",
        "name": "Heater Block Temp",
        "value": 166,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "6s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-14",
      "nextScheduledDate": "2026-09-14",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-DA-001",
        "title": "High-Precision Die Bonder Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-18",
        "size": "38 KB",
        "tags": [
          "Die Attach",
          "Epoxy"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/die_attacher",
    "manualId": "VAI-MAN-DA-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 96
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 97
        },
        {
          "timestamp": "Day 7",
          "health": 96
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 98
        },
        {
          "timestamp": "Wk 4",
          "health": 96
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "PC-01",
    "name": "RF Argon Plasma Surface Cleaner 01",
    "machineType": "plasma-cleaner",
    "processStage": "Bay 3A: Plasma Activation",
    "status": "healthy",
    "healthScore": 97,
    "operatingHours": 2800,
    "firmwareVersion": "v3.2.0",
    "ipAddress": "10.24.103.1",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 3A: Plasma Activation",
      "line": "Plasma Line 1",
      "station": "Station PC-01",
      "gridCoordinate": {
        "x": 65,
        "y": 319
      }
    },
    "rul": {
      "value": 2800,
      "unit": "hours",
      "confidence": 0.95,
      "estimatedDays": 116.6,
      "criticalThresholdHours": 120,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_vacuum_pump",
        "name": "Vacuum Pump Vibration",
        "value": 0.18,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "chamber_pressure",
        "name": "Chamber Pressure",
        "value": 85,
        "unit": "kPa",
        "status": "normal",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "rf_reflected_power",
        "name": "RF Reflected Power",
        "value": 18,
        "unit": "W",
        "status": "normal",
        "lastUpdated": "3s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-02",
      "nextScheduledDate": "2026-10-02",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Elena Vance"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-PC-001",
        "title": "RF Plasma Surface Treatment Chamber Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-10",
        "size": "32 KB",
        "tags": [
          "RF Plasma",
          "Vacuum"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/die_attacher",
    "manualId": "VAI-MAN-DA-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 97
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 98
        },
        {
          "timestamp": "Day 7",
          "health": 97
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 99
        },
        {
          "timestamp": "Wk 4",
          "health": 97
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "PC-02",
    "name": "RF Argon Plasma Surface Cleaner 02",
    "machineType": "plasma-cleaner",
    "processStage": "Bay 3A: Plasma Activation",
    "status": "healthy",
    "healthScore": 96,
    "operatingHours": 2650,
    "firmwareVersion": "v3.2.0",
    "ipAddress": "10.24.103.2",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 3A: Plasma Activation",
      "line": "Plasma Line 2",
      "station": "Station PC-02",
      "gridCoordinate": {
        "x": 145,
        "y": 319
      }
    },
    "rul": {
      "value": 2650,
      "unit": "hours",
      "confidence": 0.94,
      "estimatedDays": 110.4,
      "criticalThresholdHours": 120,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_vacuum_pump",
        "name": "Vacuum Pump Vibration",
        "value": 0.19,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "chamber_pressure",
        "name": "Chamber Pressure",
        "value": 82,
        "unit": "kPa",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "rf_reflected_power",
        "name": "RF Reflected Power",
        "value": 19,
        "unit": "W",
        "status": "normal",
        "lastUpdated": "4s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-04",
      "nextScheduledDate": "2026-10-04",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Elena Vance"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-PC-001",
        "title": "RF Plasma Surface Treatment Chamber Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-10",
        "size": "32 KB",
        "tags": [
          "RF Plasma",
          "Vacuum"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/die_attacher",
    "manualId": "VAI-MAN-DA-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 96
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 97
        },
        {
          "timestamp": "Day 7",
          "health": 96
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 98
        },
        {
          "timestamp": "Wk 4",
          "health": 96
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "WB-01",
    "name": "Thermosonic Ball Bonder 01",
    "machineType": "wire-bonding",
    "processStage": "Bay 3B: Wire Bonding Cleanroom",
    "status": "healthy",
    "healthScore": 95,
    "operatingHours": 1650,
    "firmwareVersion": "v7.4.2",
    "ipAddress": "10.24.104.1",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 3B: Wire Bonding Cleanroom",
      "line": "Bonding Cell 1",
      "station": "Station WB-01",
      "gridCoordinate": {
        "x": 270,
        "y": 319
      }
    },
    "rul": {
      "value": 1650,
      "unit": "hours",
      "confidence": 0.95,
      "estimatedDays": 68.7,
      "criticalThresholdHours": 80,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_ultrasonic",
        "name": "Ultrasonic Vibration",
        "value": 0.45,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "2s ago"
      },
      {
        "sensorId": "load_clamp",
        "name": "Clamping Force",
        "value": 68,
        "unit": "N",
        "status": "normal",
        "lastUpdated": "2s ago"
      },
      {
        "sensorId": "temperature_transducer",
        "name": "Transducer Temp",
        "value": 46,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "2s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-11",
      "nextScheduledDate": "2026-09-11",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Kenji Sato"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-WB-001",
        "title": "High-Speed Thermosonic Ball Bonder Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-15",
        "size": "45 KB",
        "tags": [
          "Wire Bonder",
          "Au Wire"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/wire_bonder",
    "manualId": "VAI-MAN-WB-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 95
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 96
        },
        {
          "timestamp": "Day 7",
          "health": 95
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 98
        },
        {
          "timestamp": "Wk 4",
          "health": 95
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "WB-02",
    "name": "Thermosonic Ball Bonder 02",
    "machineType": "wire-bonding",
    "processStage": "Bay 3B: Wire Bonding Cleanroom",
    "status": "healthy",
    "healthScore": 94,
    "operatingHours": 1520,
    "firmwareVersion": "v7.4.2",
    "ipAddress": "10.24.104.2",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 3B: Wire Bonding Cleanroom",
      "line": "Bonding Cell 1",
      "station": "Station WB-02",
      "gridCoordinate": {
        "x": 325,
        "y": 319
      }
    },
    "rul": {
      "value": 1520,
      "unit": "hours",
      "confidence": 0.94,
      "estimatedDays": 63.3,
      "criticalThresholdHours": 80,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_ultrasonic",
        "name": "Ultrasonic Vibration",
        "value": 0.48,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "load_clamp",
        "name": "Clamping Force",
        "value": 69,
        "unit": "N",
        "status": "normal",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "temperature_transducer",
        "name": "Transducer Temp",
        "value": 47.2,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "3s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-08",
      "nextScheduledDate": "2026-09-08",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Kenji Sato"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-WB-001",
        "title": "High-Speed Thermosonic Ball Bonder Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-15",
        "size": "45 KB",
        "tags": [
          "Wire Bonder",
          "Au Wire"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/wire_bonder",
    "manualId": "VAI-MAN-WB-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 94
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 95
        },
        {
          "timestamp": "Day 7",
          "health": 94
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 97
        },
        {
          "timestamp": "Wk 4",
          "health": 94
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "WB-03",
    "name": "Thermosonic Ball Bonder 03",
    "machineType": "wire-bonding",
    "processStage": "Bay 3B: Wire Bonding Cleanroom",
    "status": "healthy",
    "healthScore": 96,
    "operatingHours": 1720,
    "firmwareVersion": "v7.4.2",
    "ipAddress": "10.24.104.3",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 3B: Wire Bonding Cleanroom",
      "line": "Bonding Cell 1",
      "station": "Station WB-03",
      "gridCoordinate": {
        "x": 380,
        "y": 319
      }
    },
    "rul": {
      "value": 1720,
      "unit": "hours",
      "confidence": 0.96,
      "estimatedDays": 71.6,
      "criticalThresholdHours": 80,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_ultrasonic",
        "name": "Ultrasonic Vibration",
        "value": 0.44,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "load_clamp",
        "name": "Clamping Force",
        "value": 67,
        "unit": "N",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "temperature_transducer",
        "name": "Transducer Temp",
        "value": 45.8,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "4s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-10",
      "nextScheduledDate": "2026-09-10",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Kenji Sato"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-WB-001",
        "title": "High-Speed Thermosonic Ball Bonder Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-15",
        "size": "45 KB",
        "tags": [
          "Wire Bonder",
          "Au Wire"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/wire_bonder",
    "manualId": "VAI-MAN-WB-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 96
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 97
        },
        {
          "timestamp": "Day 7",
          "health": 96
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 98
        },
        {
          "timestamp": "Wk 4",
          "health": 96
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "WB-04",
    "name": "Thermosonic Ball Bonder 04",
    "machineType": "wire-bonding",
    "processStage": "Bay 3B: Wire Bonding Cleanroom",
    "status": "warning",
    "healthScore": 68,
    "operatingHours": 3200,
    "firmwareVersion": "v7.4.2",
    "ipAddress": "10.24.104.4",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 3B: Wire Bonding Cleanroom",
      "line": "Bonding Cell 1",
      "station": "Station WB-04",
      "gridCoordinate": {
        "x": 435,
        "y": 319
      }
    },
    "rul": {
      "value": 120,
      "unit": "hours",
      "confidence": 0.91,
      "estimatedDays": 5,
      "criticalThresholdHours": 80,
      "degradationStage": "Accelerated Wear"
    },
    "sensors": [
      {
        "sensorId": "vibration_ultrasonic",
        "name": "Ultrasonic Vibration",
        "value": 2.85,
        "unit": "mm/s",
        "status": "warning",
        "lastUpdated": "1s ago"
      },
      {
        "sensorId": "load_clamp",
        "name": "Clamping Force",
        "value": 84,
        "unit": "N",
        "status": "warning",
        "lastUpdated": "1s ago"
      },
      {
        "sensorId": "temperature_transducer",
        "name": "Transducer Temp",
        "value": 64.8,
        "unit": "°C",
        "status": "warning",
        "lastUpdated": "1s ago"
      }
    ],
    "anomalies": [
      {
        "id": "ANO-WB04-01",
        "timestamp": "2026-08-26 08:15",
        "type": "Ultrasonic Transducer Resonance Drift",
        "severity": "high",
        "description": "PZT piezo resonance deviation (+4.2 kHz) causing non-stick on pad (NSOP) risk during 18µm Cu bonding.",
        "sensor": "Ultrasonic Vibration",
        "confidence": 0.94,
        "status": "active",
        "recommendedAction": "Replace capillary tool & recalibrate transducer resonance frequency."
      }
    ],
    "maintenance": {
      "lastMaintenanceDate": "2026-07-20",
      "nextScheduledDate": "2026-08-27",
      "status": "overdue",
      "type": "Spindle Rebuild",
      "technician": "Kenji Sato"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-WB-001",
        "title": "High-Speed Thermosonic Ball Bonder Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-15",
        "size": "45 KB",
        "tags": [
          "Wire Bonder",
          "Cu Wire",
          "Priority Alert"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/wire_bonder",
    "manualId": "VAI-MAN-WB-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "12h ago",
          "health": 76
        },
        {
          "timestamp": "Now",
          "health": 68
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 85
        },
        {
          "timestamp": "Day 7",
          "health": 68
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 94
        },
        {
          "timestamp": "Wk 4",
          "health": 68
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "WB-05",
    "name": "Thermosonic Ball Bonder 05",
    "machineType": "wire-bonding",
    "processStage": "Bay 3B: Wire Bonding Cleanroom",
    "status": "healthy",
    "healthScore": 94,
    "operatingHours": 1550,
    "firmwareVersion": "v7.4.2",
    "ipAddress": "10.24.104.5",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 3B: Wire Bonding Cleanroom",
      "line": "Bonding Cell 2",
      "station": "Station WB-05",
      "gridCoordinate": {
        "x": 490,
        "y": 319
      }
    },
    "rul": {
      "value": 1550,
      "unit": "hours",
      "confidence": 0.94,
      "estimatedDays": 64.5,
      "criticalThresholdHours": 80,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_ultrasonic",
        "name": "Ultrasonic Vibration",
        "value": 0.46,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "load_clamp",
        "name": "Clamping Force",
        "value": 68,
        "unit": "N",
        "status": "normal",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "temperature_transducer",
        "name": "Transducer Temp",
        "value": 46.5,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "3s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-12",
      "nextScheduledDate": "2026-09-12",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Kenji Sato"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-WB-001",
        "title": "High-Speed Thermosonic Ball Bonder Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-15",
        "size": "45 KB",
        "tags": [
          "Wire Bonder"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/wire_bonder",
    "manualId": "VAI-MAN-WB-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 94
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 95
        },
        {
          "timestamp": "Day 7",
          "health": 94
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 97
        },
        {
          "timestamp": "Wk 4",
          "health": 94
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "WB-06",
    "name": "Thermosonic Ball Bonder 06",
    "machineType": "wire-bonding",
    "processStage": "Bay 3B: Wire Bonding Cleanroom",
    "status": "healthy",
    "healthScore": 96,
    "operatingHours": 1680,
    "firmwareVersion": "v7.4.2",
    "ipAddress": "10.24.104.6",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 3B: Wire Bonding Cleanroom",
      "line": "Bonding Cell 2",
      "station": "Station WB-06",
      "gridCoordinate": {
        "x": 545,
        "y": 319
      }
    },
    "rul": {
      "value": 1680,
      "unit": "hours",
      "confidence": 0.95,
      "estimatedDays": 70,
      "criticalThresholdHours": 80,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_ultrasonic",
        "name": "Ultrasonic Vibration",
        "value": 0.42,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "load_clamp",
        "name": "Clamping Force",
        "value": 67,
        "unit": "N",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "temperature_transducer",
        "name": "Transducer Temp",
        "value": 45.4,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "4s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-14",
      "nextScheduledDate": "2026-09-14",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Kenji Sato"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-WB-001",
        "title": "High-Speed Thermosonic Ball Bonder Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-15",
        "size": "45 KB",
        "tags": [
          "Wire Bonder"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/wire_bonder",
    "manualId": "VAI-MAN-WB-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 96
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 97
        },
        {
          "timestamp": "Day 7",
          "health": 96
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 98
        },
        {
          "timestamp": "Wk 4",
          "health": 96
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "WB-07",
    "name": "Thermosonic Ball Bonder 07",
    "machineType": "wire-bonding",
    "processStage": "Bay 3B: Wire Bonding Cleanroom",
    "status": "healthy",
    "healthScore": 93,
    "operatingHours": 1480,
    "firmwareVersion": "v7.4.2",
    "ipAddress": "10.24.104.7",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 3B: Wire Bonding Cleanroom",
      "line": "Bonding Cell 2",
      "station": "Station WB-07",
      "gridCoordinate": {
        "x": 600,
        "y": 319
      }
    },
    "rul": {
      "value": 1480,
      "unit": "hours",
      "confidence": 0.93,
      "estimatedDays": 61.6,
      "criticalThresholdHours": 80,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_ultrasonic",
        "name": "Ultrasonic Vibration",
        "value": 0.5,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "5s ago"
      },
      {
        "sensorId": "load_clamp",
        "name": "Clamping Force",
        "value": 70,
        "unit": "N",
        "status": "normal",
        "lastUpdated": "5s ago"
      },
      {
        "sensorId": "temperature_transducer",
        "name": "Transducer Temp",
        "value": 48,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "5s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-05",
      "nextScheduledDate": "2026-09-05",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Kenji Sato"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-WB-001",
        "title": "High-Speed Thermosonic Ball Bonder Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-15",
        "size": "45 KB",
        "tags": [
          "Wire Bonder"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/wire_bonder",
    "manualId": "VAI-MAN-WB-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 93
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 95
        },
        {
          "timestamp": "Day 7",
          "health": 93
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 97
        },
        {
          "timestamp": "Wk 4",
          "health": 93
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "WB-08",
    "name": "Thermosonic Ball Bonder 08",
    "machineType": "wire-bonding",
    "processStage": "Bay 3B: Wire Bonding Cleanroom",
    "status": "healthy",
    "healthScore": 95,
    "operatingHours": 1600,
    "firmwareVersion": "v7.4.2",
    "ipAddress": "10.24.104.8",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 3B: Wire Bonding Cleanroom",
      "line": "Bonding Cell 2",
      "station": "Station WB-08",
      "gridCoordinate": {
        "x": 655,
        "y": 319
      }
    },
    "rul": {
      "value": 1600,
      "unit": "hours",
      "confidence": 0.95,
      "estimatedDays": 66.7,
      "criticalThresholdHours": 80,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_ultrasonic",
        "name": "Ultrasonic Vibration",
        "value": 0.44,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "load_clamp",
        "name": "Clamping Force",
        "value": 68,
        "unit": "N",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "temperature_transducer",
        "name": "Transducer Temp",
        "value": 46.8,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "4s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-10",
      "nextScheduledDate": "2026-09-10",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Kenji Sato"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-WB-001",
        "title": "High-Speed Thermosonic Ball Bonder Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-15",
        "size": "45 KB",
        "tags": [
          "Wire Bonder"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/wire_bonder",
    "manualId": "VAI-MAN-WB-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 95
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 96
        },
        {
          "timestamp": "Day 7",
          "health": 95
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 98
        },
        {
          "timestamp": "Wk 4",
          "health": 95
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "MP-01",
    "name": "Auto Molding Press 01 (Multi-Cavity)",
    "machineType": "molding-press",
    "processStage": "Bay 4: Encapsulation & Mold Chase",
    "status": "healthy",
    "healthScore": 94,
    "operatingHours": 1980,
    "firmwareVersion": "v6.1.4",
    "ipAddress": "10.24.105.1",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 4: Encapsulation & Mold Chase",
      "line": "Molding Line 1",
      "station": "Press MP-01",
      "gridCoordinate": {
        "x": 745,
        "y": 316
      }
    },
    "rul": {
      "value": 1980,
      "unit": "hours",
      "confidence": 0.94,
      "estimatedDays": 82.5,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "temperature_mold",
        "name": "Mold Chase Temp",
        "value": 175.4,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "5s ago"
      },
      {
        "sensorId": "pressure_hydraulic",
        "name": "Hydraulic Pressure",
        "value": 135,
        "unit": "bar",
        "status": "normal",
        "lastUpdated": "5s ago"
      },
      {
        "sensorId": "load_plunger",
        "name": "Plunger Load",
        "value": 22.4,
        "unit": "kN",
        "status": "normal",
        "lastUpdated": "5s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-01",
      "nextScheduledDate": "2026-09-01",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-MP-001",
        "title": "Multi-Cavity Auto Molding Press Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-12",
        "size": "52 KB",
        "tags": [
          "Molding",
          "EMC"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/molding",
    "manualId": "VAI-MAN-MOLD-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 94
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 95
        },
        {
          "timestamp": "Day 7",
          "health": 94
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 97
        },
        {
          "timestamp": "Wk 4",
          "health": 94
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "MP-02",
    "name": "Auto Molding Press 02 (Multi-Cavity)",
    "machineType": "molding-press",
    "processStage": "Bay 4: Encapsulation & Mold Chase",
    "status": "healthy",
    "healthScore": 93,
    "operatingHours": 1850,
    "firmwareVersion": "v6.1.4",
    "ipAddress": "10.24.105.2",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 4: Encapsulation & Mold Chase",
      "line": "Molding Line 1",
      "station": "Press MP-02",
      "gridCoordinate": {
        "x": 830,
        "y": 316
      }
    },
    "rul": {
      "value": 1850,
      "unit": "hours",
      "confidence": 0.93,
      "estimatedDays": 77.1,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "temperature_mold",
        "name": "Mold Chase Temp",
        "value": 174.8,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "6s ago"
      },
      {
        "sensorId": "pressure_hydraulic",
        "name": "Hydraulic Pressure",
        "value": 138,
        "unit": "bar",
        "status": "normal",
        "lastUpdated": "6s ago"
      },
      {
        "sensorId": "load_plunger",
        "name": "Plunger Load",
        "value": 23.1,
        "unit": "kN",
        "status": "normal",
        "lastUpdated": "6s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-03",
      "nextScheduledDate": "2026-09-03",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-MP-001",
        "title": "Multi-Cavity Auto Molding Press Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-12",
        "size": "52 KB",
        "tags": [
          "Molding",
          "EMC"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/molding",
    "manualId": "VAI-MAN-MOLD-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 93
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 95
        },
        {
          "timestamp": "Day 7",
          "health": 93
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 96
        },
        {
          "timestamp": "Wk 4",
          "health": 93
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "MP-03",
    "name": "Auto Molding Press 03 (Multi-Cavity)",
    "machineType": "molding-press",
    "processStage": "Bay 4: Encapsulation & Mold Chase",
    "status": "healthy",
    "healthScore": 96,
    "operatingHours": 2150,
    "firmwareVersion": "v6.1.4",
    "ipAddress": "10.24.105.3",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 4: Encapsulation & Mold Chase",
      "line": "Molding Line 2",
      "station": "Press MP-03",
      "gridCoordinate": {
        "x": 915,
        "y": 316
      }
    },
    "rul": {
      "value": 2150,
      "unit": "hours",
      "confidence": 0.96,
      "estimatedDays": 89.6,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "temperature_mold",
        "name": "Mold Chase Temp",
        "value": 176,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "pressure_hydraulic",
        "name": "Hydraulic Pressure",
        "value": 133,
        "unit": "bar",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "load_plunger",
        "name": "Plunger Load",
        "value": 21.8,
        "unit": "kN",
        "status": "normal",
        "lastUpdated": "4s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-06",
      "nextScheduledDate": "2026-09-06",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-MP-001",
        "title": "Multi-Cavity Auto Molding Press Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-12",
        "size": "52 KB",
        "tags": [
          "Molding",
          "EMC"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/molding",
    "manualId": "VAI-MAN-MOLD-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 96
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 97
        },
        {
          "timestamp": "Day 7",
          "health": 96
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 98
        },
        {
          "timestamp": "Wk 4",
          "health": 96
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "MP-04",
    "name": "Auto Molding Press 04 (Multi-Cavity)",
    "machineType": "molding-press",
    "processStage": "Bay 4: Encapsulation & Mold Chase",
    "status": "healthy",
    "healthScore": 95,
    "operatingHours": 2020,
    "firmwareVersion": "v6.1.4",
    "ipAddress": "10.24.105.4",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 4: Encapsulation & Mold Chase",
      "line": "Molding Line 2",
      "station": "Press MP-04",
      "gridCoordinate": {
        "x": 1000,
        "y": 316
      }
    },
    "rul": {
      "value": 2020,
      "unit": "hours",
      "confidence": 0.95,
      "estimatedDays": 84.2,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "temperature_mold",
        "name": "Mold Chase Temp",
        "value": 175.2,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "5s ago"
      },
      {
        "sensorId": "pressure_hydraulic",
        "name": "Hydraulic Pressure",
        "value": 136,
        "unit": "bar",
        "status": "normal",
        "lastUpdated": "5s ago"
      },
      {
        "sensorId": "load_plunger",
        "name": "Plunger Load",
        "value": 22.8,
        "unit": "kN",
        "status": "normal",
        "lastUpdated": "5s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-09",
      "nextScheduledDate": "2026-09-09",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-MP-001",
        "title": "Multi-Cavity Auto Molding Press Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-12",
        "size": "52 KB",
        "tags": [
          "Molding",
          "EMC"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/molding",
    "manualId": "VAI-MAN-MOLD-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 95
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 96
        },
        {
          "timestamp": "Day 7",
          "health": 95
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 98
        },
        {
          "timestamp": "Wk 4",
          "health": 95
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "AOI-01",
    "name": "3D Optical AOI Line 01",
    "machineType": "aoi-inspection",
    "processStage": "Bay 5A: 3D Optical AOI Metrology",
    "status": "healthy",
    "healthScore": 99,
    "operatingHours": 3200,
    "firmwareVersion": "v8.2.1",
    "ipAddress": "10.24.106.1",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 5A: 3D Optical AOI Metrology",
      "line": "AOI Line 1",
      "station": "Station AOI-01",
      "gridCoordinate": {
        "x": 65,
        "y": 524
      }
    },
    "rul": {
      "value": 3200,
      "unit": "hours",
      "confidence": 0.98,
      "estimatedDays": 133.3,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_camera_gantry",
        "name": "Camera Gantry Vibration",
        "value": 0.08,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "2s ago"
      },
      {
        "sensorId": "temp_optics",
        "name": "Optical Sensor Temp",
        "value": 22.8,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "2s ago"
      },
      {
        "sensorId": "optical_intensity",
        "name": "Illumination Uniformity",
        "value": 98.5,
        "unit": "%",
        "status": "normal",
        "lastUpdated": "2s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-15",
      "nextScheduledDate": "2026-10-15",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Elena Vance"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-AOI-001",
        "title": "3D Optical AOI Metrology Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-16",
        "size": "36 KB",
        "tags": [
          "AOI",
          "3D Vision"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/ic_tester",
    "manualId": "VAI-MAN-ATE-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 99
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 99
        },
        {
          "timestamp": "Day 7",
          "health": 99
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 100
        },
        {
          "timestamp": "Wk 4",
          "health": 99
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "AOI-02",
    "name": "3D Optical AOI Line 02",
    "machineType": "aoi-inspection",
    "processStage": "Bay 5A: 3D Optical AOI Metrology",
    "status": "healthy",
    "healthScore": 98,
    "operatingHours": 3050,
    "firmwareVersion": "v8.2.1",
    "ipAddress": "10.24.106.2",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 5A: 3D Optical AOI Metrology",
      "line": "AOI Line 1",
      "station": "Station AOI-02",
      "gridCoordinate": {
        "x": 130,
        "y": 524
      }
    },
    "rul": {
      "value": 3050,
      "unit": "hours",
      "confidence": 0.97,
      "estimatedDays": 127.1,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_camera_gantry",
        "name": "Camera Gantry Vibration",
        "value": 0.09,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "temp_optics",
        "name": "Optical Sensor Temp",
        "value": 23.2,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "optical_intensity",
        "name": "Illumination Uniformity",
        "value": 98.1,
        "unit": "%",
        "status": "normal",
        "lastUpdated": "3s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-16",
      "nextScheduledDate": "2026-10-16",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Elena Vance"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-AOI-001",
        "title": "3D Optical AOI Metrology Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-16",
        "size": "36 KB",
        "tags": [
          "AOI",
          "3D Vision"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/ic_tester",
    "manualId": "VAI-MAN-ATE-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 98
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 99
        },
        {
          "timestamp": "Day 7",
          "health": 98
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 99
        },
        {
          "timestamp": "Wk 4",
          "health": 98
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "AOI-03",
    "name": "3D Optical AOI Line 03",
    "machineType": "aoi-inspection",
    "processStage": "Bay 5A: 3D Optical AOI Metrology",
    "status": "healthy",
    "healthScore": 99,
    "operatingHours": 3180,
    "firmwareVersion": "v8.2.1",
    "ipAddress": "10.24.106.3",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 5A: 3D Optical AOI Metrology",
      "line": "AOI Line 2",
      "station": "Station AOI-03",
      "gridCoordinate": {
        "x": 195,
        "y": 524
      }
    },
    "rul": {
      "value": 3180,
      "unit": "hours",
      "confidence": 0.98,
      "estimatedDays": 132.5,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_camera_gantry",
        "name": "Camera Gantry Vibration",
        "value": 0.08,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "2s ago"
      },
      {
        "sensorId": "temp_optics",
        "name": "Optical Sensor Temp",
        "value": 22.9,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "2s ago"
      },
      {
        "sensorId": "optical_intensity",
        "name": "Illumination Uniformity",
        "value": 98.6,
        "unit": "%",
        "status": "normal",
        "lastUpdated": "2s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-17",
      "nextScheduledDate": "2026-10-17",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Elena Vance"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-AOI-001",
        "title": "3D Optical AOI Metrology Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-16",
        "size": "36 KB",
        "tags": [
          "AOI",
          "3D Vision"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/ic_tester",
    "manualId": "VAI-MAN-ATE-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 99
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 99
        },
        {
          "timestamp": "Day 7",
          "health": 99
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 100
        },
        {
          "timestamp": "Wk 4",
          "health": 99
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "AOI-04",
    "name": "3D Optical AOI Line 04",
    "machineType": "aoi-inspection",
    "processStage": "Bay 5A: 3D Optical AOI Metrology",
    "status": "healthy",
    "healthScore": 98,
    "operatingHours": 3100,
    "firmwareVersion": "v8.2.1",
    "ipAddress": "10.24.106.4",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 5A: 3D Optical AOI Metrology",
      "line": "AOI Line 2",
      "station": "Station AOI-04",
      "gridCoordinate": {
        "x": 260,
        "y": 524
      }
    },
    "rul": {
      "value": 3100,
      "unit": "hours",
      "confidence": 0.97,
      "estimatedDays": 129.2,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_camera_gantry",
        "name": "Camera Gantry Vibration",
        "value": 0.09,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "temp_optics",
        "name": "Optical Sensor Temp",
        "value": 23,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "optical_intensity",
        "name": "Illumination Uniformity",
        "value": 98.2,
        "unit": "%",
        "status": "normal",
        "lastUpdated": "3s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-18",
      "nextScheduledDate": "2026-10-18",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Elena Vance"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-AOI-001",
        "title": "3D Optical AOI Metrology Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-16",
        "size": "36 KB",
        "tags": [
          "AOI",
          "3D Vision"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/ic_tester",
    "manualId": "VAI-MAN-ATE-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 98
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 99
        },
        {
          "timestamp": "Day 7",
          "health": 98
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 99
        },
        {
          "timestamp": "Wk 4",
          "health": 98
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "XR-01",
    "name": "Microfocus X-Ray NDT Cell 01",
    "machineType": "x-ray-inspection",
    "processStage": "Bay 5B: Lead-Shielded X-Ray",
    "status": "healthy",
    "healthScore": 97,
    "operatingHours": 2450,
    "firmwareVersion": "v4.0.5",
    "ipAddress": "10.24.107.1",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 5B: Lead-Shielded X-Ray",
      "line": "NDT Vault 1",
      "station": "Station XR-01",
      "gridCoordinate": {
        "x": 385,
        "y": 524
      }
    },
    "rul": {
      "value": 2450,
      "unit": "hours",
      "confidence": 0.96,
      "estimatedDays": 102.1,
      "criticalThresholdHours": 120,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "tube_voltage",
        "name": "Tube High Voltage",
        "value": 130,
        "unit": "kV",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "tube_temp",
        "name": "Target Temp",
        "value": 34.8,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "vibration_stage",
        "name": "Manipulator Vibration",
        "value": 0.22,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "4s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-01",
      "nextScheduledDate": "2026-11-01",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Elena Vance"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-XR-001",
        "title": "Microfocus X-Ray NDT Station Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-10",
        "size": "40 KB",
        "tags": [
          "X-Ray",
          "NDT"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/ic_tester",
    "manualId": "VAI-MAN-ATE-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 97
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 98
        },
        {
          "timestamp": "Day 7",
          "health": 97
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 99
        },
        {
          "timestamp": "Wk 4",
          "health": 97
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "XR-02",
    "name": "Microfocus X-Ray NDT Cell 02",
    "machineType": "x-ray-inspection",
    "processStage": "Bay 5B: Lead-Shielded X-Ray",
    "status": "healthy",
    "healthScore": 96,
    "operatingHours": 2380,
    "firmwareVersion": "v4.0.5",
    "ipAddress": "10.24.107.2",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 5B: Lead-Shielded X-Ray",
      "line": "NDT Vault 2",
      "station": "Station XR-02",
      "gridCoordinate": {
        "x": 495,
        "y": 524
      }
    },
    "rul": {
      "value": 2380,
      "unit": "hours",
      "confidence": 0.95,
      "estimatedDays": 99.2,
      "criticalThresholdHours": 120,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "tube_voltage",
        "name": "Tube High Voltage",
        "value": 132,
        "unit": "kV",
        "status": "normal",
        "lastUpdated": "5s ago"
      },
      {
        "sensorId": "tube_temp",
        "name": "Target Temp",
        "value": 35.2,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "5s ago"
      },
      {
        "sensorId": "vibration_stage",
        "name": "Manipulator Vibration",
        "value": 0.24,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "5s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-03",
      "nextScheduledDate": "2026-11-03",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Elena Vance"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-XR-001",
        "title": "Microfocus X-Ray NDT Station Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-10",
        "size": "40 KB",
        "tags": [
          "X-Ray",
          "NDT"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/ic_tester",
    "manualId": "VAI-MAN-ATE-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 96
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 97
        },
        {
          "timestamp": "Day 7",
          "health": 96
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 98
        },
        {
          "timestamp": "Wk 4",
          "health": 96
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "LM-01",
    "name": "Galvo Fiber Laser Marker 01",
    "machineType": "laser-marking",
    "processStage": "Bay 5C: Laser Marking Cell",
    "status": "healthy",
    "healthScore": 98,
    "operatingHours": 3500,
    "firmwareVersion": "v5.1.0",
    "ipAddress": "10.24.108.1",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 5C: Laser Marking Cell",
      "line": "Laser Line 1",
      "station": "Station LM-01",
      "gridCoordinate": {
        "x": 650,
        "y": 524
      }
    },
    "rul": {
      "value": 3500,
      "unit": "hours",
      "confidence": 0.97,
      "estimatedDays": 145.8,
      "criticalThresholdHours": 120,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "laser_power",
        "name": "Fiber Laser Power",
        "value": 30.2,
        "unit": "W",
        "status": "normal",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "galvo_temp",
        "name": "Galvo Head Temp",
        "value": 28.5,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "exhaust_flow",
        "name": "Exhaust Air Velocity",
        "value": 11.2,
        "unit": "m/s",
        "status": "normal",
        "lastUpdated": "3s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-08",
      "nextScheduledDate": "2026-11-08",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-LM-001",
        "title": "Galvo Fiber Laser Marker Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-14",
        "size": "30 KB",
        "tags": [
          "Laser Marker",
          "2D Matrix"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/ic_tester",
    "manualId": "VAI-MAN-ATE-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 98
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 99
        },
        {
          "timestamp": "Day 7",
          "health": 98
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 99
        },
        {
          "timestamp": "Wk 4",
          "health": 98
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "LM-02",
    "name": "Galvo Fiber Laser Marker 02",
    "machineType": "laser-marking",
    "processStage": "Bay 5C: Laser Marking Cell",
    "status": "healthy",
    "healthScore": 97,
    "operatingHours": 3350,
    "firmwareVersion": "v5.1.0",
    "ipAddress": "10.24.108.2",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 5C: Laser Marking Cell",
      "line": "Laser Line 2",
      "station": "Station LM-02",
      "gridCoordinate": {
        "x": 745,
        "y": 524
      }
    },
    "rul": {
      "value": 3350,
      "unit": "hours",
      "confidence": 0.96,
      "estimatedDays": 139.6,
      "criticalThresholdHours": 120,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "laser_power",
        "name": "Fiber Laser Power",
        "value": 29.8,
        "unit": "W",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "galvo_temp",
        "name": "Galvo Head Temp",
        "value": 29.1,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "exhaust_flow",
        "name": "Exhaust Air Velocity",
        "value": 11,
        "unit": "m/s",
        "status": "normal",
        "lastUpdated": "4s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-10",
      "nextScheduledDate": "2026-11-10",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-LM-001",
        "title": "Galvo Fiber Laser Marker Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-14",
        "size": "30 KB",
        "tags": [
          "Laser Marker",
          "2D Matrix"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/ic_tester",
    "manualId": "VAI-MAN-ATE-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 97
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 98
        },
        {
          "timestamp": "Day 7",
          "health": 97
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 99
        },
        {
          "timestamp": "Wk 4",
          "health": 97
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "TH-01",
    "name": "IC Tri-Temp Test Handler 01",
    "machineType": "test-handler",
    "processStage": "Bay 6A: Tri-Temp Final Test",
    "status": "healthy",
    "healthScore": 96,
    "operatingHours": 2100,
    "firmwareVersion": "v9.0.2",
    "ipAddress": "10.24.109.1",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 6A: Tri-Temp Final Test",
      "line": "Test Line 1",
      "station": "Handler TH-01",
      "gridCoordinate": {
        "x": 900,
        "y": 522
      }
    },
    "rul": {
      "value": 2100,
      "unit": "hours",
      "confidence": 0.95,
      "estimatedDays": 87.5,
      "criticalThresholdHours": 80,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_handler",
        "name": "Handler Vibration",
        "value": 0.52,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "temperature_chamber",
        "name": "Soak Chamber Temp",
        "value": 85,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "load_actuator",
        "name": "Socket Actuator Load",
        "value": 52,
        "unit": "N",
        "status": "normal",
        "lastUpdated": "3s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-12",
      "nextScheduledDate": "2026-09-12",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Kenji Sato"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-TH-001",
        "title": "Tri-Temp Final Test Handler Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-16",
        "size": "48 KB",
        "tags": [
          "ATE",
          "Tri-Temp"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/ic_tester",
    "manualId": "VAI-MAN-ATE-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 96
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 97
        },
        {
          "timestamp": "Day 7",
          "health": 96
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 98
        },
        {
          "timestamp": "Wk 4",
          "health": 96
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "TH-02",
    "name": "IC Tri-Temp Test Handler 02",
    "machineType": "test-handler",
    "processStage": "Bay 6A: Tri-Temp Final Test",
    "status": "healthy",
    "healthScore": 97,
    "operatingHours": 2250,
    "firmwareVersion": "v9.0.2",
    "ipAddress": "10.24.109.2",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 6A: Tri-Temp Final Test",
      "line": "Test Line 2",
      "station": "Handler TH-02",
      "gridCoordinate": {
        "x": 1000,
        "y": 522
      }
    },
    "rul": {
      "value": 2250,
      "unit": "hours",
      "confidence": 0.96,
      "estimatedDays": 93.8,
      "criticalThresholdHours": 80,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_handler",
        "name": "Handler Vibration",
        "value": 0.48,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "temperature_chamber",
        "name": "Soak Chamber Temp",
        "value": -40,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "load_actuator",
        "name": "Socket Actuator Load",
        "value": 50,
        "unit": "N",
        "status": "normal",
        "lastUpdated": "4s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-14",
      "nextScheduledDate": "2026-09-14",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Kenji Sato"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-TH-001",
        "title": "Tri-Temp Final Test Handler Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-16",
        "size": "48 KB",
        "tags": [
          "ATE",
          "Tri-Temp"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/ic_tester",
    "manualId": "VAI-MAN-ATE-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 97
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 98
        },
        {
          "timestamp": "Day 7",
          "health": 97
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 99
        },
        {
          "timestamp": "Wk 4",
          "health": 97
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "TR-01",
    "name": "Automated Tape & Reel 01",
    "machineType": "tape-reel",
    "processStage": "Bay 6B: Tape & Reel Packaging",
    "status": "healthy",
    "healthScore": 96,
    "operatingHours": 2400,
    "firmwareVersion": "v3.8.0",
    "ipAddress": "10.24.110.1",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 6B: Tape & Reel Packaging",
      "line": "Pack Line 1",
      "station": "Station TR-01",
      "gridCoordinate": {
        "x": 65,
        "y": 729
      }
    },
    "rul": {
      "value": 2400,
      "unit": "hours",
      "confidence": 0.95,
      "estimatedDays": 100,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_indexer",
        "name": "Indexer Vibration",
        "value": 0.32,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "temp_sealer",
        "name": "Heat Seal Bar Temp",
        "value": 175,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "peel_force",
        "name": "Tape Peel Force",
        "value": 0.45,
        "unit": "N",
        "status": "normal",
        "lastUpdated": "3s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-06",
      "nextScheduledDate": "2026-09-06",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-TR-001",
        "title": "Tape & Reel Packaging System Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-12",
        "size": "32 KB",
        "tags": [
          "Tape & Reel",
          "Packaging"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/ic_tester",
    "manualId": "VAI-MAN-ATE-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 96
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 97
        },
        {
          "timestamp": "Day 7",
          "health": 96
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 98
        },
        {
          "timestamp": "Wk 4",
          "health": 96
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "TR-02",
    "name": "Automated Tape & Reel 02",
    "machineType": "tape-reel",
    "processStage": "Bay 6B: Tape & Reel Packaging",
    "status": "healthy",
    "healthScore": 95,
    "operatingHours": 2280,
    "firmwareVersion": "v3.8.0",
    "ipAddress": "10.24.110.2",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 6B: Tape & Reel Packaging",
      "line": "Pack Line 1",
      "station": "Station TR-02",
      "gridCoordinate": {
        "x": 140,
        "y": 729
      }
    },
    "rul": {
      "value": 2280,
      "unit": "hours",
      "confidence": 0.94,
      "estimatedDays": 95,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_indexer",
        "name": "Indexer Vibration",
        "value": 0.34,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "temp_sealer",
        "name": "Heat Seal Bar Temp",
        "value": 176,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "peel_force",
        "name": "Tape Peel Force",
        "value": 0.46,
        "unit": "N",
        "status": "normal",
        "lastUpdated": "4s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-08",
      "nextScheduledDate": "2026-09-08",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-TR-001",
        "title": "Tape & Reel Packaging System Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-12",
        "size": "32 KB",
        "tags": [
          "Tape & Reel",
          "Packaging"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/ic_tester",
    "manualId": "VAI-MAN-ATE-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 95
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 96
        },
        {
          "timestamp": "Day 7",
          "health": 95
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 97
        },
        {
          "timestamp": "Wk 4",
          "health": 95
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "TR-03",
    "name": "Automated Tape & Reel 03",
    "machineType": "tape-reel",
    "processStage": "Bay 6B: Tape & Reel Packaging",
    "status": "healthy",
    "healthScore": 98,
    "operatingHours": 2600,
    "firmwareVersion": "v3.8.0",
    "ipAddress": "10.24.110.3",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 6B: Tape & Reel Packaging",
      "line": "Pack Line 2",
      "station": "Station TR-03",
      "gridCoordinate": {
        "x": 215,
        "y": 729
      }
    },
    "rul": {
      "value": 2600,
      "unit": "hours",
      "confidence": 0.97,
      "estimatedDays": 108.3,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_indexer",
        "name": "Indexer Vibration",
        "value": 0.3,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "temp_sealer",
        "name": "Heat Seal Bar Temp",
        "value": 174,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "peel_force",
        "name": "Tape Peel Force",
        "value": 0.44,
        "unit": "N",
        "status": "normal",
        "lastUpdated": "3s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-11",
      "nextScheduledDate": "2026-09-11",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-TR-001",
        "title": "Tape & Reel Packaging System Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-12",
        "size": "32 KB",
        "tags": [
          "Tape & Reel",
          "Packaging"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/ic_tester",
    "manualId": "VAI-MAN-ATE-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 98
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 99
        },
        {
          "timestamp": "Day 7",
          "health": 98
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 99
        },
        {
          "timestamp": "Wk 4",
          "health": 98
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "TR-04",
    "name": "Automated Tape & Reel 04",
    "machineType": "tape-reel",
    "processStage": "Bay 6B: Tape & Reel Packaging",
    "status": "healthy",
    "healthScore": 94,
    "operatingHours": 2150,
    "firmwareVersion": "v3.8.0",
    "ipAddress": "10.24.110.4",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 6B: Tape & Reel Packaging",
      "line": "Pack Line 2",
      "station": "Station TR-04",
      "gridCoordinate": {
        "x": 290,
        "y": 729
      }
    },
    "rul": {
      "value": 2150,
      "unit": "hours",
      "confidence": 0.94,
      "estimatedDays": 89.6,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_indexer",
        "name": "Indexer Vibration",
        "value": 0.36,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "temp_sealer",
        "name": "Heat Seal Bar Temp",
        "value": 178,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "peel_force",
        "name": "Tape Peel Force",
        "value": 0.48,
        "unit": "N",
        "status": "normal",
        "lastUpdated": "4s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-13",
      "nextScheduledDate": "2026-09-13",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-TR-001",
        "title": "Tape & Reel Packaging System Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-12",
        "size": "32 KB",
        "tags": [
          "Tape & Reel",
          "Packaging"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/ic_tester",
    "manualId": "VAI-MAN-ATE-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 94
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 95
        },
        {
          "timestamp": "Day 7",
          "health": 94
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 97
        },
        {
          "timestamp": "Wk 4",
          "health": 94
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "TR-05",
    "name": "Automated Tape & Reel 05",
    "machineType": "tape-reel",
    "processStage": "Bay 6B: Tape & Reel Packaging",
    "status": "healthy",
    "healthScore": 97,
    "operatingHours": 2520,
    "firmwareVersion": "v3.8.0",
    "ipAddress": "10.24.110.5",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 6B: Tape & Reel Packaging",
      "line": "Pack Line 3",
      "station": "Station TR-05",
      "gridCoordinate": {
        "x": 365,
        "y": 729
      }
    },
    "rul": {
      "value": 2520,
      "unit": "hours",
      "confidence": 0.96,
      "estimatedDays": 105,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_indexer",
        "name": "Indexer Vibration",
        "value": 0.31,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "temp_sealer",
        "name": "Heat Seal Bar Temp",
        "value": 175,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "peel_force",
        "name": "Tape Peel Force",
        "value": 0.45,
        "unit": "N",
        "status": "normal",
        "lastUpdated": "3s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-15",
      "nextScheduledDate": "2026-09-15",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-TR-001",
        "title": "Tape & Reel Packaging System Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-12",
        "size": "32 KB",
        "tags": [
          "Tape & Reel",
          "Packaging"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/ic_tester",
    "manualId": "VAI-MAN-ATE-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 97
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 98
        },
        {
          "timestamp": "Day 7",
          "health": 97
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 99
        },
        {
          "timestamp": "Wk 4",
          "health": 97
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  },
  {
    "id": "TR-06",
    "name": "Automated Tape & Reel 06",
    "machineType": "tape-reel",
    "processStage": "Bay 6B: Tape & Reel Packaging",
    "status": "healthy",
    "healthScore": 98,
    "operatingHours": 2700,
    "firmwareVersion": "v3.8.0",
    "ipAddress": "10.24.110.6",
    "location": {
      "facility": "Fab 2 Cleanroom",
      "floor": "Level 1 - Front-End Cleanzone",
      "area": "Bay 6B: Tape & Reel Packaging",
      "line": "Pack Line 3",
      "station": "Station TR-06",
      "gridCoordinate": {
        "x": 440,
        "y": 729
      }
    },
    "rul": {
      "value": 2700,
      "unit": "hours",
      "confidence": 0.97,
      "estimatedDays": 112.5,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "sensors": [
      {
        "sensorId": "vibration_indexer",
        "name": "Indexer Vibration",
        "value": 0.29,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "2s ago"
      },
      {
        "sensorId": "temp_sealer",
        "name": "Heat Seal Bar Temp",
        "value": 174,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "2s ago"
      },
      {
        "sensorId": "peel_force",
        "name": "Tape Peel Force",
        "value": 0.43,
        "unit": "N",
        "status": "normal",
        "lastUpdated": "2s ago"
      }
    ],
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-16",
      "nextScheduledDate": "2026-09-16",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-TR-001",
        "title": "Tape & Reel Packaging System Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-12",
        "size": "32 KB",
        "tags": [
          "Tape & Reel",
          "Packaging"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/ic_tester",
    "manualId": "VAI-MAN-ATE-001",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 98
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 99
        },
        {
          "timestamp": "Day 7",
          "health": 98
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 99
        },
        {
          "timestamp": "Wk 4",
          "health": 98
        }
      ]
    },
    "installationDate": "2025-02-15",
    "lastTelemetryTimestamp": "2026-08-26T15:30:00Z"
  }
];
