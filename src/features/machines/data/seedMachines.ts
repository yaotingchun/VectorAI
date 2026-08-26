import { Machine } from '../types/machine';

export const SEED_MACHINES: Machine[] = [
  {
    "status": "healthy",
    "lastTelemetryTimestamp": "2026-08-22T12:51:05Z",
    "ipAddress": "10.24.114.1",
    "anomalies": [],
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
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
      ]
    },
    "firmwareVersion": "v8.1.0",
    "machineType": "ic_tester",
    "sensors": [
      {
        "sensorId": "vibration_handler",
        "name": "Handler Vibration",
        "value": 0.32,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "5s ago"
      },
      {
        "sensorId": "temperature_chamber",
        "name": "Test Chamber Temp",
        "value": 24.5,
        "unit": "\u00b0C",
        "status": "normal",
        "lastUpdated": "5s ago"
      },
      {
        "sensorId": "load_actuator",
        "name": "Socket Actuator Load",
        "value": 48,
        "unit": "N",
        "status": "normal",
        "lastUpdated": "5s ago"
      }
    ],
    "documents": [
      {
        "id": "DOC-VAI-MAN-ATE-001",
        "title": "High-Speed Automated IC Tester & Pick-and-Place Sorter Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-26",
        "size": "36 KB",
        "tags": [
          "Tester",
          "Sorter",
          "Synthetic_Prototype",
          "Manual"
        ]
      }
    ],
    "rul": {
      "degradationStage": "Normal",
      "estimatedDays": 66.6,
      "unit": "hours",
      "confidence": 0.95,
      "criticalThresholdHours": 50,
      "value": 1600
    },
    "knowledgeBaseRef": "machine_knowledge/ic_tester",
    "location": {
      "area": "ATE Cell Bay 1",
      "line": "Test Line 1",
      "station": "Station T-01",
      "gridCoordinate": {
        "x": 2,
        "y": 17
      },
      "floor": "Level 2 - Final Test Area",
      "facility": "Fab 2 OSAT Hub"
    },
    "healthScore": 98,
    "processStage": "Testing & Sort",
    "installationDate": "2025-01-10",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-15",
      "technician": "Kenji Sato",
      "nextScheduledDate": "2026-09-15",
      "type": "Preventive Inspection",
      "status": "scheduled"
    },
    "manualId": "VAI-MAN-ATE-001",
    "operatingHours": 2900,
    "name": "IC Test & Sort Cell 01",
    "id": "ATE-001"
  },
  {
    "operatingHours": 6850,
    "healthScore": 74,
    "name": "IC Test & Sort Cell 02",
    "status": "warning",
    "firmwareVersion": "v8.1.0",
    "processStage": "Testing & Sort",
    "installationDate": "2024-04-22",
    "rul": {
      "degradationStage": "Early Drift",
      "estimatedDays": 8.7,
      "unit": "hours",
      "confidence": 0.86,
      "criticalThresholdHours": 50,
      "value": 210
    },
    "id": "ATE-002",
    "lastTelemetryTimestamp": "2026-08-22T12:51:20Z",
    "maintenance": {
      "lastMaintenanceDate": "2026-07-20",
      "technician": "Kenji Sato",
      "nextScheduledDate": "2026-08-27",
      "type": "Sensor Replacement",
      "status": "scheduled"
    },
    "machineType": "ic_tester",
    "location": {
      "area": "ATE Cell Bay 1",
      "line": "Test Line 1",
      "station": "Station T-02",
      "gridCoordinate": {
        "x": 5,
        "y": 17
      },
      "floor": "Level 2 - Final Test Area",
      "facility": "Fab 2 OSAT Hub"
    },
    "healthTrend": {
      "24h": [
        {
          "timestamp": "12h ago",
          "health": 82
        },
        {
          "timestamp": "Now",
          "health": 74
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 93
        },
        {
          "timestamp": "Wk 4",
          "health": 74
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 88
        },
        {
          "timestamp": "Day 7",
          "health": 74
        }
      ]
    },
    "sensors": [
      {
        "sensorId": "vibration_handler",
        "name": "Handler Vibration",
        "value": 0.95,
        "unit": "mm/s",
        "status": "warning",
        "lastUpdated": "10s ago"
      },
      {
        "sensorId": "temperature_chamber",
        "name": "Test Chamber Temp",
        "value": 29.8,
        "unit": "\u00b0C",
        "status": "normal",
        "lastUpdated": "10s ago"
      },
      {
        "sensorId": "load_actuator",
        "name": "Socket Actuator Load",
        "value": 72,
        "unit": "N",
        "status": "normal",
        "lastUpdated": "10s ago"
      }
    ],
    "documents": [
      {
        "id": "DOC-VAI-MAN-ATE-001",
        "title": "High-Speed Automated IC Tester & Pick-and-Place Sorter Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-26",
        "size": "36 KB",
        "tags": [
          "Tester",
          "Sorter",
          "Synthetic_Prototype",
          "Manual"
        ]
      }
    ],
    "anomalies": [
      {
        "id": "ANO-ATE02-01",
        "timestamp": "2026-08-22 07:44",
        "type": "Carriage Track Alignment & Optical Jitter Drift",
        "severity": "medium",
        "description": "Optical alignment sensor tracking error and pneumatic carriage micro-chatter during high-speed device binning cycle.",
        "sensor": "Optical Alignment Sensor",
        "confidence": 0.68,
        "status": "active",
        "recommendedAction": "Inspect optical encoder strip, recalibrate pick position coordinates, and clean linear guide rails."
      }
    ],
    "ipAddress": "10.24.114.2"
  },
  {
    "installationDate": "2024-05-18",
    "operatingHours": 5120,
    "name": "Die Attacher 01",
    "knowledgeBaseRef": "machine_knowledge/die_attacher",
    "healthScore": 95,
    "firmwareVersion": "v3.5.1",
    "status": "healthy",
    "maintenance": {
      "lastMaintenanceDate": "2026-07-28",
      "technician": "Sarah Jenkins",
      "nextScheduledDate": "2026-09-02",
      "type": "Preventive Inspection",
      "status": "scheduled"
    },
    "processStage": "Die Attach",
    "sensors": [
      {
        "sensorId": "vibration_arm",
        "name": "Arm Vibration",
        "value": 0.22,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "pressure_vacuum",
        "name": "Collet Vacuum Pressure",
        "value": -82.4,
        "unit": "kPa",
        "status": "normal",
        "lastUpdated": "4s ago"
      },
      {
        "sensorId": "temperature_heater",
        "name": "Heater Block Temp",
        "value": 165,
        "unit": "\u00b0C",
        "status": "normal",
        "lastUpdated": "4s ago"
      }
    ],
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
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
      ]
    },
    "machineType": "die_attacher",
    "location": {
      "area": "Die Bond Bay A",
      "line": "Line DA-1",
      "station": "Station DA-01",
      "gridCoordinate": {
        "x": 2,
        "y": 5
      },
      "floor": "Level 2 - Cleanroom ISO 5",
      "facility": "Fab 2 OSAT Hub"
    },
    "rul": {
      "degradationStage": "Normal",
      "estimatedDays": 56.2,
      "unit": "hours",
      "confidence": 0.92,
      "criticalThresholdHours": 40,
      "value": 1350
    },
    "id": "DA-001",
    "documents": [
      {
        "id": "DOC-VAI-MAN-DA-001",
        "title": "Thermo-Compression Precision Die Attacher Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-26",
        "size": "36 KB",
        "tags": [
          "DieAttach",
          "BondHead",
          "Synthetic_Prototype",
          "Manual"
        ]
      }
    ],
    "manualId": "VAI-MAN-DA-001",
    "ipAddress": "10.24.111.1",
    "lastTelemetryTimestamp": "2026-08-22T12:51:40Z",
    "anomalies": []
  },
  {
    "operatingHours": 9800,
    "documents": [
      {
        "id": "DOC-VAI-MAN-DA-001",
        "title": "Thermo-Compression Precision Die Attacher Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-26",
        "size": "36 KB",
        "tags": [
          "DieAttach",
          "BondHead",
          "Synthetic_Prototype",
          "Manual"
        ]
      }
    ],
    "healthScore": 48,
    "installationDate": "2023-12-01",
    "ipAddress": "10.24.111.2",
    "anomalies": [
      {
        "id": "ANO-DA02-01",
        "timestamp": "2026-08-22 10:15",
        "type": "Collet Vacuum Seal Leakage & Arm Jerk",
        "severity": "critical",
        "description": "Vacuum pressure dropped to -52 kPa causing 3 die misalignment drop events in 30 mins.",
        "sensor": "Collet Vacuum Pressure",
        "confidence": 0.95,
        "status": "active",
        "recommendedAction": "Halt line, replace silicone pickup tip, clean vacuum solenoid valve."
      }
    ],
    "location": {
      "area": "Die Bond Bay A",
      "line": "Line DA-1",
      "station": "Station DA-02",
      "gridCoordinate": {
        "x": 5,
        "y": 5
      },
      "floor": "Level 2 - Cleanroom ISO 5",
      "facility": "Fab 2 OSAT Hub"
    },
    "maintenance": {
      "lastMaintenanceDate": "2026-06-25",
      "technician": "Sarah Jenkins",
      "nextScheduledDate": "2026-08-23",
      "type": "Sensor Replacement",
      "status": "scheduled"
    },
    "sensors": [
      {
        "sensorId": "vibration_arm",
        "name": "Arm Vibration",
        "value": 1.12,
        "unit": "mm/s",
        "status": "critical",
        "lastUpdated": "2s ago"
      },
      {
        "sensorId": "pressure_vacuum",
        "name": "Collet Vacuum Pressure",
        "value": -52,
        "unit": "kPa",
        "status": "critical",
        "lastUpdated": "2s ago"
      },
      {
        "sensorId": "temperature_heater",
        "name": "Heater Block Temp",
        "value": 172.5,
        "unit": "\u00b0C",
        "status": "normal",
        "lastUpdated": "2s ago"
      }
    ],
    "firmwareVersion": "v3.5.0",
    "status": "critical",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "12h ago",
          "health": 70
        },
        {
          "timestamp": "Now",
          "health": 48
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 90
        },
        {
          "timestamp": "Wk 4",
          "health": 48
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 82
        },
        {
          "timestamp": "Day 7",
          "health": 48
        }
      ]
    },
    "machineType": "die_attacher",
    "processStage": "Die Attach",
    "lastTelemetryTimestamp": "2026-08-22T12:51:55Z",
    "name": "Die Attacher 02",
    "rul": {
      "degradationStage": "Imminent Failure",
      "estimatedDays": 1.7,
      "unit": "hours",
      "confidence": 0.93,
      "criticalThresholdHours": 40,
      "value": 42
    },
    "id": "DA-002"
  },
  {
    "healthScore": 94,
    "knowledgeBaseRef": "machine_knowledge/wafer_dicing",
    "ipAddress": "10.24.110.1",
    "anomalies": [],
    "firmwareVersion": "v2.8.4",
    "processStage": "Wafer Prep",
    "documents": [
      {
        "id": "DOC-VAI-MAN-DIC-001",
        "title": "High-Precision Wafer Dicing Saw Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-26",
        "size": "36 KB",
        "tags": [
          "Dicing",
          "Spindle",
          "Synthetic_Prototype",
          "Manual"
        ]
      }
    ],
    "installationDate": "2024-11-12",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-05",
      "technician": "David Kim",
      "nextScheduledDate": "2026-09-05",
      "type": "Tool Calibration",
      "status": "scheduled"
    },
    "sensors": [
      {
        "sensorId": "vibration_spindle",
        "name": "Spindle Vibration",
        "value": 0.28,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "8s ago"
      },
      {
        "sensorId": "temperature_coolant",
        "name": "Coolant Temperature",
        "value": 20.4,
        "unit": "\u00b0C",
        "status": "normal",
        "lastUpdated": "8s ago"
      },
      {
        "sensorId": "load_motor",
        "name": "Motor Spindle Load",
        "value": 48,
        "unit": "%",
        "status": "normal",
        "lastUpdated": "8s ago"
      }
    ],
    "location": {
      "area": "Dicing Bay 1",
      "line": "Line Prep-1",
      "station": "Dicer-01",
      "gridCoordinate": {
        "x": 2,
        "y": 2
      },
      "floor": "Level 1 - Front Prep",
      "facility": "Fab 2 OSAT Hub"
    },
    "id": "DIC-001",
    "machineType": "wafer_dicing",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 94
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 96
        },
        {
          "timestamp": "Wk 4",
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
      ]
    },
    "status": "healthy",
    "lastTelemetryTimestamp": "2026-08-22T12:51:15Z",
    "operatingHours": 3210,
    "manualId": "VAI-MAN-DIC-001",
    "rul": {
      "degradationStage": "Normal",
      "estimatedDays": 37,
      "unit": "hours",
      "confidence": 0.89,
      "criticalThresholdHours": 50,
      "value": 890
    },
    "name": "Wafer Dicing Unit 01"
  },
  {
    "healthScore": 68,
    "name": "Wafer Dicing Unit 02",
    "ipAddress": "10.24.110.2",
    "anomalies": [
      {
        "id": "ANO-DIC02-01",
        "timestamp": "2026-08-22 09:18",
        "type": "Spindle Bearing Harmonic Anomaly",
        "severity": "medium",
        "description": "Vibration frequency analysis indicates micro-spalling on upper spindle ceramic bearings.",
        "sensor": "Spindle Vibration",
        "confidence": 0.88,
        "status": "active",
        "recommendedAction": "Schedule diamond blade re-truing and spindle lubrication flush."
      }
    ],
    "documents": [
      {
        "id": "DOC-VAI-MAN-DIC-001",
        "title": "High-Precision Wafer Dicing Saw Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-26",
        "size": "36 KB",
        "tags": [
          "Dicing",
          "Spindle",
          "Synthetic_Prototype",
          "Manual"
        ]
      }
    ],
    "location": {
      "area": "Dicing Bay 1",
      "line": "Line Prep-1",
      "station": "Dicer-02",
      "gridCoordinate": {
        "x": 5,
        "y": 2
      },
      "floor": "Level 1 - Front Prep",
      "facility": "Fab 2 OSAT Hub"
    },
    "sensors": [
      {
        "sensorId": "vibration_spindle",
        "name": "Spindle Vibration",
        "value": 0.89,
        "unit": "mm/s",
        "status": "warning",
        "lastUpdated": "6s ago"
      },
      {
        "sensorId": "temperature_coolant",
        "name": "Coolant Temperature",
        "value": 26.8,
        "unit": "\u00b0C",
        "status": "normal",
        "lastUpdated": "6s ago"
      },
      {
        "sensorId": "load_motor",
        "name": "Motor Spindle Load",
        "value": 78,
        "unit": "%",
        "status": "warning",
        "lastUpdated": "6s ago"
      }
    ],
    "maintenance": {
      "lastMaintenanceDate": "2026-07-15",
      "technician": "David Kim",
      "nextScheduledDate": "2026-08-25",
      "type": "Spindle Rebuild",
      "status": "scheduled"
    },
    "processStage": "Wafer Prep",
    "operatingHours": 7650,
    "status": "warning",
    "id": "DIC-002",
    "machineType": "wafer_dicing",
    "rul": {
      "degradationStage": "Accelerated Wear",
      "estimatedDays": 5.9,
      "unit": "hours",
      "confidence": 0.85,
      "criticalThresholdHours": 50,
      "value": 142
    },
    "healthTrend": {
      "24h": [
        {
          "timestamp": "12h ago",
          "health": 78
        },
        {
          "timestamp": "Now",
          "health": 68
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 92
        },
        {
          "timestamp": "Wk 4",
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
      ]
    },
    "installationDate": "2024-01-20",
    "lastTelemetryTimestamp": "2026-08-22T12:51:25Z",
    "firmwareVersion": "v2.8.4"
  },
  {
    "maintenance": {
      "lastMaintenanceDate": "2026-07-10",
      "technician": "Facility Team",
      "nextScheduledDate": "2026-08-24",
      "type": "Preventive Inspection",
      "status": "scheduled"
    },
    "installationDate": "2024-04-10",
    "lastTelemetryTimestamp": "2026-08-20T04:12:00Z",
    "healthScore": 0,
    "id": "DIC-003",
    "location": {
      "area": "Dicing Bay 2",
      "line": "Line Prep-2",
      "station": "Dicer-03",
      "gridCoordinate": {
        "x": 8,
        "y": 2
      },
      "floor": "Level 1 - Front Prep",
      "facility": "Fab 2 OSAT Hub"
    },
    "processStage": "Wafer Prep",
    "sensors": [
      {
        "sensorId": "vibration_spindle",
        "name": "Spindle Vibration",
        "value": 0,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "2d ago"
      },
      {
        "sensorId": "temperature_coolant",
        "name": "Coolant Temperature",
        "value": 0,
        "unit": "\u00b0C",
        "status": "normal",
        "lastUpdated": "2d ago"
      },
      {
        "sensorId": "load_motor",
        "name": "Motor Spindle Load",
        "value": 0,
        "unit": "%",
        "status": "normal",
        "lastUpdated": "2d ago"
      }
    ],
    "ipAddress": "10.24.110.3",
    "rul": {
      "degradationStage": "Normal",
      "estimatedDays": 0,
      "unit": "hours",
      "confidence": 0,
      "criticalThresholdHours": 50,
      "value": 0
    },
    "anomalies": [
      {
        "id": "ANO-DIC03-01",
        "timestamp": "2026-08-20 04:12",
        "type": "Telemetry Connection Lost",
        "severity": "medium",
        "description": "Edge MQTT Gateway disconnected. Hardware power shut off for cleanroom facility electrical upgrade.",
        "sensor": "System Gateway",
        "confidence": 1,
        "status": "acknowledged"
      }
    ],
    "operatingHours": 6400,
    "documents": [
      {
        "id": "DOC-VAI-MAN-DIC-001",
        "title": "High-Precision Wafer Dicing Saw Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-26",
        "size": "36 KB",
        "tags": [
          "Dicing",
          "Spindle",
          "Synthetic_Prototype",
          "Manual"
        ]
      }
    ],
    "status": "offline",
    "name": "Wafer Dicing Unit 03",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 0
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 95
        },
        {
          "timestamp": "Wk 4",
          "health": 0
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 91
        },
        {
          "timestamp": "Day 7",
          "health": 0
        }
      ]
    },
    "firmwareVersion": "v2.8.2",
    "machineType": "wafer_dicing"
  },
  {
    "maintenance": {
      "lastMaintenanceDate": "2026-08-08",
      "technician": "Elena Rostova",
      "nextScheduledDate": "2026-09-08",
      "type": "Preventive Inspection",
      "status": "scheduled"
    },
    "processStage": "Encapsulation",
    "location": {
      "area": "Molding Bay M1",
      "line": "Line Mold-1",
      "station": "Station M-01",
      "gridCoordinate": {
        "x": 2,
        "y": 11
      },
      "floor": "Level 1 - Packaging Line",
      "facility": "Fab 2 OSAT Hub"
    },
    "firmwareVersion": "v5.0.2",
    "operatingHours": 6200,
    "manualId": "VAI-MAN-MOLD-001",
    "healthScore": 93,
    "sensors": [
      {
        "sensorId": "temperature_mold",
        "name": "Mold Chase Temp",
        "value": 174.2,
        "unit": "\u00b0C",
        "status": "normal",
        "lastUpdated": "15s ago"
      },
      {
        "sensorId": "pressure_hydraulic",
        "name": "Hydraulic Pressure",
        "value": 138,
        "unit": "bar",
        "status": "normal",
        "lastUpdated": "15s ago"
      },
      {
        "sensorId": "load_plunger",
        "name": "Plunger Force Load",
        "value": 21.5,
        "unit": "kN",
        "status": "normal",
        "lastUpdated": "15s ago"
      }
    ],
    "documents": [
      {
        "id": "DOC-VAI-MAN-MOLD-001",
        "title": "Multi-Plunger Transfer Molding Press Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-26",
        "size": "36 KB",
        "tags": [
          "Molding",
          "Plunger",
          "Synthetic_Prototype",
          "Manual"
        ]
      }
    ],
    "name": "Auto Molding Press 01",
    "installationDate": "2024-02-14",
    "rul": {
      "degradationStage": "Normal",
      "estimatedDays": 50.8,
      "unit": "hours",
      "confidence": 0.9,
      "criticalThresholdHours": 60,
      "value": 1220
    },
    "knowledgeBaseRef": "machine_knowledge/molding",
    "anomalies": [],
    "ipAddress": "10.24.113.1",
    "lastTelemetryTimestamp": "2026-08-22T12:51:10Z",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
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
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 94
        },
        {
          "timestamp": "Day 7",
          "health": 93
        }
      ]
    },
    "status": "healthy",
    "machineType": "molding",
    "id": "MOLD-001"
  },
  {
    "maintenance": {
      "lastMaintenanceDate": "2026-08-22",
      "notes": "Active mold chase chemical cleaning and thermocouple recalibration in progress.",
      "technician": "Elena Rostova",
      "workOrderId": "WO-2026-8910",
      "nextScheduledDate": "2026-09-22",
      "type": "Tool Calibration",
      "status": "in_progress"
    },
    "status": "maintenance",
    "operatingHours": 7100,
    "firmwareVersion": "v5.0.2",
    "lastTelemetryTimestamp": "2026-08-22T11:30:00Z",
    "processStage": "Encapsulation",
    "healthScore": 85,
    "name": "Auto Molding Press 02",
    "id": "MOLD-002",
    "installationDate": "2024-02-14",
    "sensors": [
      {
        "sensorId": "temperature_mold",
        "name": "Mold Chase Temp",
        "value": 170,
        "unit": "\u00b0C",
        "status": "normal",
        "lastUpdated": "1h ago"
      },
      {
        "sensorId": "pressure_hydraulic",
        "name": "Hydraulic Pressure",
        "value": 142,
        "unit": "bar",
        "status": "normal",
        "lastUpdated": "1h ago"
      },
      {
        "sensorId": "load_plunger",
        "name": "Plunger Force Load",
        "value": 22,
        "unit": "kN",
        "status": "normal",
        "lastUpdated": "1h ago"
      }
    ],
    "ipAddress": "10.24.113.2",
    "anomalies": [],
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 85
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 91
        },
        {
          "timestamp": "Wk 4",
          "health": 85
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 88
        },
        {
          "timestamp": "Day 7",
          "health": 85
        }
      ]
    },
    "rul": {
      "degradationStage": "Normal",
      "estimatedDays": 39.5,
      "unit": "hours",
      "confidence": 0.85,
      "criticalThresholdHours": 60,
      "value": 950
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-MOLD-001",
        "title": "Multi-Plunger Transfer Molding Press Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-26",
        "size": "36 KB",
        "tags": [
          "Molding",
          "Plunger",
          "Synthetic_Prototype",
          "Manual"
        ]
      }
    ],
    "location": {
      "area": "Molding Bay M1",
      "line": "Line Mold-1",
      "station": "Station M-02",
      "gridCoordinate": {
        "x": 5,
        "y": 11
      },
      "floor": "Level 1 - Packaging Line",
      "facility": "Fab 2 OSAT Hub"
    },
    "machineType": "molding"
  },
  {
    "maintenance": {
      "lastMaintenanceDate": "2026-08-01",
      "technician": "Marcus Vance",
      "workOrderId": "WO-2026-8712",
      "nextScheduledDate": "2026-09-01",
      "type": "Preventive Inspection",
      "status": "scheduled"
    },
    "rul": {
      "degradationStage": "Normal",
      "estimatedDays": 59.1,
      "unit": "hours",
      "confidence": 0.94,
      "criticalThresholdHours": 48,
      "value": 1420
    },
    "location": {
      "area": "Assembly Line A",
      "line": "Line A",
      "station": "Station 01",
      "gridCoordinate": {
        "x": 3,
        "y": 8
      },
      "floor": "Level 2 - Cleanroom ISO 5",
      "facility": "Fab 2 OSAT Hub"
    },
    "processStage": "Assembly",
    "sensors": [
      {
        "sensorId": "vibration_ultrasonic",
        "name": "Ultrasonic Vibration",
        "value": 0.38,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "5s ago"
      },
      {
        "sensorId": "load_clamp",
        "name": "Clamp Clamping Force",
        "value": 66,
        "unit": "N",
        "status": "normal",
        "lastUpdated": "5s ago"
      },
      {
        "sensorId": "temperature_transducer",
        "name": "Transducer Temp",
        "value": 44.5,
        "unit": "\u00b0C",
        "status": "normal",
        "lastUpdated": "5s ago"
      }
    ],
    "operatingHours": 4120,
    "lastTelemetryTimestamp": "2026-08-22T12:51:00Z",
    "manualId": "VAI-MAN-WB-001",
    "name": "Wire Bonder 01",
    "ipAddress": "10.24.112.1",
    "anomalies": [],
    "healthScore": 96,
    "documents": [
      {
        "id": "DOC-VAI-MAN-WB-001",
        "title": "High-Speed Thermosonic Ball-Wedge Wire Bonder Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-26",
        "size": "36 KB",
        "tags": [
          "WireBonding",
          "Transducer",
          "Synthetic_Prototype",
          "Manual"
        ]
      }
    ],
    "installationDate": "2024-09-10",
    "status": "healthy",
    "id": "WB-001",
    "knowledgeBaseRef": "machine_knowledge/wire_bonder",
    "firmwareVersion": "v4.12.8-RT",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "12h ago",
          "health": 97
        },
        {
          "timestamp": "Now",
          "health": 96
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 99
        },
        {
          "timestamp": "Wk 4",
          "health": 96
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 98
        },
        {
          "timestamp": "Day 7",
          "health": 96
        }
      ]
    },
    "machineType": "wire_bonder"
  },
  {
    "healthScore": 91,
    "id": "WB-002",
    "maintenance": {
      "lastMaintenanceDate": "2026-07-20",
      "technician": "Marcus Vance",
      "workOrderId": "WO-2026-8550",
      "nextScheduledDate": "2026-09-10",
      "type": "Tool Calibration",
      "status": "scheduled"
    },
    "lastTelemetryTimestamp": "2026-08-22T12:51:30Z",
    "sensors": [
      {
        "sensorId": "vibration_ultrasonic",
        "name": "Ultrasonic Vibration",
        "value": 0.42,
        "unit": "mm/s",
        "status": "normal",
        "lastUpdated": "12s ago"
      },
      {
        "sensorId": "load_clamp",
        "name": "Clamp Clamping Force",
        "value": 68.5,
        "unit": "N",
        "status": "normal",
        "lastUpdated": "12s ago"
      },
      {
        "sensorId": "temperature_transducer",
        "name": "Transducer Temp",
        "value": 45.2,
        "unit": "\u00b0C",
        "status": "normal",
        "lastUpdated": "12s ago"
      }
    ],
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 91
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 95
        },
        {
          "timestamp": "Wk 4",
          "health": 91
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 93
        },
        {
          "timestamp": "Day 7",
          "health": 91
        }
      ]
    },
    "firmwareVersion": "v4.12.8-RT",
    "status": "healthy",
    "machineType": "wire_bonder",
    "operatingHours": 5890,
    "name": "Wire Bonder 02",
    "installationDate": "2024-06-20",
    "location": {
      "area": "Assembly Line A",
      "line": "Line A",
      "station": "Station 02",
      "gridCoordinate": {
        "x": 6,
        "y": 8
      },
      "floor": "Level 2 - Cleanroom ISO 5",
      "facility": "Fab 2 OSAT Hub"
    },
    "processStage": "Assembly",
    "ipAddress": "10.24.112.2",
    "anomalies": [],
    "rul": {
      "degradationStage": "Normal",
      "estimatedDays": 49.1,
      "unit": "hours",
      "confidence": 0.88,
      "criticalThresholdHours": 48,
      "value": 1180
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-WB-001",
        "title": "High-Speed Thermosonic Ball-Wedge Wire Bonder Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-26",
        "size": "36 KB",
        "tags": [
          "WireBonding",
          "Transducer",
          "Synthetic_Prototype",
          "Manual"
        ]
      }
    ]
  },
  {
    "ipAddress": "10.24.112.3",
    "installationDate": "2023-11-05",
    "anomalies": [
      {
        "id": "ANO-WB03-99",
        "timestamp": "2026-08-22 12:10",
        "type": "Piezo Transducer Thermal Runaway",
        "severity": "critical",
        "description": "Transducer temperature surpassed critical limit (69.4\u00b0C). Ultrasonic vibration resonance decoupling.",
        "sensor": "Transducer Temp",
        "confidence": 0.97,
        "status": "active",
        "recommendedAction": "Immediate emergency halt & reroute lots to WB-001 / WB-002."
      }
    ],
    "location": {
      "area": "Assembly Line B",
      "line": "Line B",
      "station": "Station 01",
      "gridCoordinate": {
        "x": 3,
        "y": 14
      },
      "floor": "Level 2 - Cleanroom ISO 5",
      "facility": "Fab 2 OSAT Hub"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-WB-001",
        "title": "High-Speed Thermosonic Ball-Wedge Wire Bonder Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-26",
        "size": "36 KB",
        "tags": [
          "WireBonding",
          "Transducer",
          "Synthetic_Prototype",
          "Manual"
        ]
      }
    ],
    "healthTrend": {
      "24h": [
        {
          "timestamp": "12h ago",
          "health": 65
        },
        {
          "timestamp": "Now",
          "health": 41
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 88
        },
        {
          "timestamp": "Wk 4",
          "health": 41
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 80
        },
        {
          "timestamp": "Day 7",
          "health": 41
        }
      ]
    },
    "machineType": "wire_bonder",
    "firmwareVersion": "v4.11.2-RT",
    "maintenance": {
      "lastMaintenanceDate": "2026-06-15",
      "technician": "Carlos Mendez",
      "workOrderId": "WO-2026-9001",
      "nextScheduledDate": "2026-08-22",
      "type": "Spindle Rebuild",
      "status": "overdue"
    },
    "processStage": "Assembly",
    "name": "Wire Bonder 03",
    "status": "critical",
    "sensors": [
      {
        "sensorId": "vibration_ultrasonic",
        "name": "Ultrasonic Vibration",
        "value": 1.25,
        "unit": "mm/s",
        "status": "critical",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "load_clamp",
        "name": "Clamp Clamping Force",
        "value": 98.2,
        "unit": "N",
        "status": "critical",
        "lastUpdated": "3s ago"
      },
      {
        "sensorId": "temperature_transducer",
        "name": "Transducer Temp",
        "value": 69.4,
        "unit": "\u00b0C",
        "status": "critical",
        "lastUpdated": "3s ago"
      }
    ],
    "operatingHours": 12450,
    "lastTelemetryTimestamp": "2026-08-22T12:51:50Z",
    "id": "WB-003",
    "rul": {
      "degradationStage": "Imminent Failure",
      "estimatedDays": 1.1,
      "unit": "hours",
      "confidence": 0.96,
      "criticalThresholdHours": 48,
      "value": 28
    },
    "healthScore": 41
  },
  {
    "installationDate": "2024-03-15",
    "operatingHours": 8426,
    "machineType": "wire_bonder",
    "status": "warning",
    "id": "WB-024",
    "processStage": "Assembly",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "12h ago",
          "health": 88
        },
        {
          "timestamp": "10h ago",
          "health": 85
        },
        {
          "timestamp": "8h ago",
          "health": 82
        },
        {
          "timestamp": "6h ago",
          "health": 79
        },
        {
          "timestamp": "4h ago",
          "health": 75
        },
        {
          "timestamp": "2h ago",
          "health": 73
        },
        {
          "timestamp": "Now",
          "health": 72
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 97
        },
        {
          "timestamp": "Wk 2",
          "health": 94
        },
        {
          "timestamp": "Wk 3",
          "health": 88
        },
        {
          "timestamp": "Wk 4",
          "health": 72
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 94
        },
        {
          "timestamp": "Day 2",
          "health": 92
        },
        {
          "timestamp": "Day 3",
          "health": 89
        },
        {
          "timestamp": "Day 4",
          "health": 85
        },
        {
          "timestamp": "Day 5",
          "health": 80
        },
        {
          "timestamp": "Day 6",
          "health": 75
        },
        {
          "timestamp": "Day 7",
          "health": 72
        }
      ]
    },
    "lastTelemetryTimestamp": "2026-08-22T12:50:00Z",
    "firmwareVersion": "v4.12.8-RT",
    "healthScore": 72,
    "anomalies": [
      {
        "id": "ANO-WB24-001",
        "timestamp": "2026-08-22 11:42",
        "type": "Ultrasonic Harmonics Drift",
        "severity": "medium",
        "description": "Ultrasonic vibration trend increasing beyond 0.85 mm/s. Horn resonance damping indicated.",
        "sensor": "Ultrasonic Vibration",
        "confidence": 0.91,
        "status": "active",
        "recommendedAction": "Inspect piezo-electric transducer horn for micro-fissures or recalibrate bond force."
      },
      {
        "id": "ANO-WB24-002",
        "timestamp": "2026-08-21 14:32",
        "type": "Clamp Load Elevation",
        "severity": "medium",
        "description": "Leadframe clamping force sustained at 84N (+18% above nominal mean).",
        "sensor": "Clamp Clamping Force",
        "confidence": 0.84,
        "status": "acknowledged",
        "recommendedAction": "Check pneumatic pressure regulator on station clamp cylinder."
      },
      {
        "id": "ANO-WB24-003",
        "timestamp": "2026-08-18 08:15",
        "type": "Minor Frequency Shift",
        "severity": "low",
        "description": "Transient 138kHz resonance frequency flutter during high-density BGA wire cycle.",
        "sensor": "Ultrasonic Vibration",
        "confidence": 0.76,
        "status": "resolved",
        "recommendedAction": "Clean capillary tip with ultrasonic bath."
      }
    ],
    "ipAddress": "10.24.112.24",
    "rul": {
      "degradationStage": "Accelerated Wear",
      "estimatedDays": 7.8,
      "unit": "hours",
      "confidence": 0.91,
      "criticalThresholdHours": 48,
      "value": 186
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-WB-001",
        "title": "High-Speed Thermosonic Ball-Wedge Wire Bonder Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-26",
        "size": "36 KB",
        "tags": [
          "WireBonding",
          "Transducer",
          "Synthetic_Prototype",
          "Manual"
        ]
      }
    ],
    "location": {
      "area": "Assembly Line A",
      "line": "Line A",
      "station": "Station 04",
      "gridCoordinate": {
        "x": 12,
        "y": 8
      },
      "floor": "Level 2 - Cleanroom ISO 5",
      "facility": "Fab 2 OSAT Hub"
    },
    "name": "Wire Bonder 24",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-12",
      "notes": "Scheduled for 8,500-hour bond head overhaul and piezo stack impedance tuning.",
      "technician": "Marcus Vance (ID: TECH-48)",
      "workOrderId": "WO-2026-8841",
      "nextScheduledDate": "2026-08-28",
      "type": "Preventive Inspection",
      "status": "scheduled",
      "checklistCount": {
        "total": 12,
        "completed": 8
      }
    },
    "sensors": [
      {
        "sensorId": "vibration_ultrasonic",
        "name": "Ultrasonic Vibration",
        "value": 0.88,
        "unit": "mm/s",
        "status": "warning",
        "lastUpdated": "10s ago",
        "history": [
          {
            "timestamp": "12:00",
            "value": 0.52
          },
          {
            "timestamp": "12:10",
            "value": 0.61
          },
          {
            "timestamp": "12:20",
            "value": 0.73
          },
          {
            "timestamp": "12:30",
            "value": 0.79
          },
          {
            "timestamp": "12:40",
            "value": 0.84
          },
          {
            "timestamp": "12:50",
            "value": 0.88
          }
        ]
      },
      {
        "sensorId": "load_clamp",
        "name": "Clamp Clamping Force",
        "value": 84,
        "unit": "N",
        "status": "warning",
        "lastUpdated": "10s ago",
        "history": [
          {
            "timestamp": "12:00",
            "value": 68
          },
          {
            "timestamp": "12:10",
            "value": 72.5
          },
          {
            "timestamp": "12:20",
            "value": 77
          },
          {
            "timestamp": "12:30",
            "value": 81.2
          },
          {
            "timestamp": "12:40",
            "value": 83.5
          },
          {
            "timestamp": "12:50",
            "value": 84
          }
        ]
      },
      {
        "sensorId": "temperature_transducer",
        "name": "Transducer Temp",
        "value": 48.1,
        "unit": "\u00b0C",
        "status": "normal",
        "lastUpdated": "10s ago",
        "history": [
          {
            "timestamp": "12:00",
            "value": 46.2
          },
          {
            "timestamp": "12:10",
            "value": 46.8
          },
          {
            "timestamp": "12:20",
            "value": 47.4
          },
          {
            "timestamp": "12:30",
            "value": 47.9
          },
          {
            "timestamp": "12:40",
            "value": 48
          },
          {
            "timestamp": "12:50",
            "value": 48.1
          }
        ]
      }
    ]
  }
];
