import { Machine } from '../types/machine';

export const SEED_MACHINES: Machine[] = [
  {
    "machineType": "aoi-inspection",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-15",
      "nextScheduledDate": "2026-10-15",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Elena Vance"
    },
    "firmwareVersion": "v8.2.1",
    "status": "healthy",
    "documents": [
      {
        "id": "DOC-VAI-MAN-AOI-001",
        "title": "3D Optical AOI Metrology & Coplanarity System Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "35 KB",
        "tags": [
          "3D AOI",
          "ISO 6",
          "Telecentric Optics & Gantry Specification"
        ]
      }
    ],
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "rul": {
      "value": 3200,
      "unit": "hours",
      "confidence": 0.98,
      "estimatedDays": 133.3,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "operatingHours": 3200,
    "ipAddress": "10.24.106.1",
    "knowledgeBaseRef": "machine_knowledge/aoi-inspection",
    "healthScore": 99,
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
    "processStage": "Bay 5A: 3D Optical AOI Metrology",
    "name": "3D Optical AOI Line 01",
    "installationDate": "2024-10-15",
    "anomalies": [],
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
    "manualId": "VAI-MAN-AOI-001",
    "id": "AOI-01"
  },
  {
    "operatingHours": 3050,
    "rul": {
      "value": 3050,
      "unit": "hours",
      "confidence": 0.97,
      "estimatedDays": 127.1,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "installationDate": "2024-10-15",
    "ipAddress": "10.24.106.2",
    "firmwareVersion": "v8.2.1",
    "healthScore": 98,
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
    "manualId": "VAI-MAN-AOI-001",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-16",
      "nextScheduledDate": "2026-10-16",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Elena Vance"
    },
    "machineType": "aoi-inspection",
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "documents": [
      {
        "id": "DOC-VAI-MAN-AOI-001",
        "title": "3D Optical AOI Metrology & Coplanarity System Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "35 KB",
        "tags": [
          "3D AOI",
          "ISO 6",
          "Telecentric Optics & Gantry Specification"
        ]
      }
    ],
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
    "processStage": "Bay 5A: 3D Optical AOI Metrology",
    "id": "AOI-02",
    "anomalies": [],
    "name": "3D Optical AOI Line 02",
    "knowledgeBaseRef": "machine_knowledge/aoi-inspection",
    "status": "healthy",
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
    "anomalies": [],
    "processStage": "Bay 5A: 3D Optical AOI Metrology",
    "id": "AOI-03",
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
    "manualId": "VAI-MAN-AOI-001",
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
    "name": "3D Optical AOI Line 03",
    "knowledgeBaseRef": "machine_knowledge/aoi-inspection",
    "installationDate": "2024-10-15",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-17",
      "nextScheduledDate": "2026-10-17",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Elena Vance"
    },
    "machineType": "aoi-inspection",
    "documents": [
      {
        "id": "DOC-VAI-MAN-AOI-001",
        "title": "3D Optical AOI Metrology & Coplanarity System Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "35 KB",
        "tags": [
          "3D AOI",
          "ISO 6",
          "Telecentric Optics & Gantry Specification"
        ]
      }
    ],
    "operatingHours": 3180,
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "status": "healthy",
    "firmwareVersion": "v8.2.1",
    "rul": {
      "value": 3180,
      "unit": "hours",
      "confidence": 0.98,
      "estimatedDays": 132.5,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "ipAddress": "10.24.106.3",
    "healthScore": 99
  },
  {
    "ipAddress": "10.24.106.4",
    "knowledgeBaseRef": "machine_knowledge/aoi-inspection",
    "processStage": "Bay 5A: 3D Optical AOI Metrology",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-18",
      "nextScheduledDate": "2026-10-18",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Elena Vance"
    },
    "machineType": "aoi-inspection",
    "healthScore": 98,
    "name": "3D Optical AOI Line 04",
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "documents": [
      {
        "id": "DOC-VAI-MAN-AOI-001",
        "title": "3D Optical AOI Metrology & Coplanarity System Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "35 KB",
        "tags": [
          "3D AOI",
          "ISO 6",
          "Telecentric Optics & Gantry Specification"
        ]
      }
    ],
    "status": "healthy",
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
    "rul": {
      "value": 3100,
      "unit": "hours",
      "confidence": 0.97,
      "estimatedDays": 129.2,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
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
    "manualId": "VAI-MAN-AOI-001",
    "operatingHours": 3100,
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
    "id": "AOI-04",
    "firmwareVersion": "v8.2.1",
    "anomalies": [],
    "installationDate": "2024-10-15"
  },
  {
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
    "firmwareVersion": "v5.3.1",
    "documents": [
      {
        "id": "DOC-VAI-MAN-DA-001",
        "title": "High-Precision Epoxy & Eutectic Die Bonder Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "39 KB",
        "tags": [
          "Die Attach",
          "ISO 6",
          "Collet Vacuum & Ejector Specification"
        ]
      }
    ],
    "installationDate": "2025-02-10",
    "processStage": "Bay 2: Die Attach & SMT",
    "rul": {
      "value": 1580,
      "unit": "hours",
      "confidence": 0.95,
      "estimatedDays": 65.8,
      "criticalThresholdHours": 80,
      "degradationStage": "Normal"
    },
    "ipAddress": "10.24.102.1",
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "operatingHours": 1580,
    "id": "DA-01",
    "status": "healthy",
    "name": "High-Precision Die Bonder 01",
    "anomalies": [],
    "machineType": "die-attach",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-05",
      "nextScheduledDate": "2026-09-05",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Marcus Thorne"
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
    "knowledgeBaseRef": "machine_knowledge/die-attach",
    "healthScore": 97,
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
    "manualId": "VAI-MAN-DA-001"
  },
  {
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "ipAddress": "10.24.102.2",
    "installationDate": "2025-02-10",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "12h ago",
          "health": 79
        },
        {
          "timestamp": "Now",
          "health": 69
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 88
        },
        {
          "timestamp": "Day 7",
          "health": 69
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 96
        },
        {
          "timestamp": "Wk 4",
          "health": 69
        }
      ]
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-DA-001",
        "title": "High-Precision Epoxy & Eutectic Die Bonder Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "39 KB",
        "tags": [
          "Die Attach",
          "ISO 6",
          "Collet Vacuum & Ejector Specification"
        ]
      }
    ],
    "processStage": "Bay 2: Die Attach & SMT",
    "firmwareVersion": "v5.3.1",
    "healthScore": 69,
    "operatingHours": 1420,
    "name": "High-Precision Die Bonder 02",
    "status": "warning",
    "rul": {
      "value": 72,
      "unit": "hours",
      "confidence": 0.91,
      "estimatedDays": 3,
      "criticalThresholdHours": 80,
      "degradationStage": "Accelerated Wear"
    },
    "id": "DA-02",
    "sensors": [
      {
        "sensorId": "vibration_arm",
        "name": "Arm Vibration",
        "value": 0.68,
        "unit": "mm/s",
        "status": "warning",
        "lastUpdated": "2s ago"
      },
      {
        "sensorId": "pressure_vacuum",
        "name": "Collet Vacuum Pressure",
        "value": -54,
        "unit": "kPa",
        "status": "warning",
        "lastUpdated": "2s ago"
      },
      {
        "sensorId": "temperature_heater",
        "name": "Heater Block Temp",
        "value": 172,
        "unit": "°C",
        "status": "warning",
        "lastUpdated": "2s ago"
      }
    ],
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
    "manualId": "VAI-MAN-DA-001",
    "anomalies": [
      {
        "id": "ANO-DA02-01",
        "timestamp": "2026-08-27 04:15",
        "type": "Collet Vacuum Seal Leakage & Ejector Pin Timing Drift",
        "severity": "high",
        "description": "Collet vacuum pressure dropped to -54 kPa causing die pickup misalignment and bond-line thickness (BLT) variance risk.",
        "sensor": "Collet Vacuum Pressure",
        "confidence": 0.93,
        "status": "active",
        "recommendedAction": "Flush vacuum solenoid line, replace silicon collet seal, and re-teach ejector needle Z-coordinates."
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/die-attach",
    "machineType": "die-attach",
    "maintenance": {
      "lastMaintenanceDate": "2026-07-28",
      "nextScheduledDate": "2026-08-29",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Marcus Thorne"
    }
  },
  {
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "ipAddress": "10.24.102.3",
    "knowledgeBaseRef": "machine_knowledge/die-attach",
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
    "firmwareVersion": "v5.3.1",
    "processStage": "Bay 2: Die Attach & SMT",
    "operatingHours": 1750,
    "id": "DA-03",
    "documents": [
      {
        "id": "DOC-VAI-MAN-DA-001",
        "title": "High-Precision Epoxy & Eutectic Die Bonder Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "39 KB",
        "tags": [
          "Die Attach",
          "ISO 6",
          "Collet Vacuum & Ejector Specification"
        ]
      }
    ],
    "status": "healthy",
    "machineType": "die-attach",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-11",
      "nextScheduledDate": "2026-09-11",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "rul": {
      "value": 1750,
      "unit": "hours",
      "confidence": 0.96,
      "estimatedDays": 72.9,
      "criticalThresholdHours": 80,
      "degradationStage": "Normal"
    },
    "manualId": "VAI-MAN-DA-001",
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
    "installationDate": "2025-02-10",
    "name": "High-Precision Die Bonder 03",
    "anomalies": [],
    "healthScore": 98
  },
  {
    "documents": [
      {
        "id": "DOC-VAI-MAN-DA-001",
        "title": "High-Precision Epoxy & Eutectic Die Bonder Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "39 KB",
        "tags": [
          "Die Attach",
          "ISO 6",
          "Collet Vacuum & Ejector Specification"
        ]
      }
    ],
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
    "installationDate": "2025-02-10",
    "manualId": "VAI-MAN-DA-001",
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
    "ipAddress": "10.24.102.4",
    "status": "healthy",
    "processStage": "Bay 2: Die Attach & SMT",
    "operatingHours": 1600,
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "name": "High-Precision Die Bonder 04",
    "machineType": "die-attach",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-14",
      "nextScheduledDate": "2026-09-14",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "rul": {
      "value": 1600,
      "unit": "hours",
      "confidence": 0.95,
      "estimatedDays": 66.7,
      "criticalThresholdHours": 80,
      "degradationStage": "Normal"
    },
    "anomalies": [],
    "firmwareVersion": "v5.3.1",
    "id": "DA-04",
    "healthScore": 96,
    "knowledgeBaseRef": "machine_knowledge/die-attach"
  },
  {
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
    "anomalies": [],
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "knowledgeBaseRef": "machine_knowledge/laser-marking",
    "firmwareVersion": "v5.1.0",
    "name": "Galvo Fiber Laser Marker 01",
    "processStage": "Bay 5C: Laser Marking Cell",
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
    "installationDate": "2024-09-10",
    "documents": [
      {
        "id": "DOC-VAI-MAN-LM-001",
        "title": "Galvo Fiber Laser Serialization Marker Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "34 KB",
        "tags": [
          "Laser Marker",
          "ISO 7",
          "30W MOPA Fiber Laser & F-Theta Specification"
        ]
      }
    ],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-08",
      "nextScheduledDate": "2026-11-08",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "machineType": "laser-marking",
    "status": "healthy",
    "manualId": "VAI-MAN-LM-001",
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
    "healthScore": 98,
    "operatingHours": 3500,
    "ipAddress": "10.24.108.1",
    "rul": {
      "value": 3500,
      "unit": "hours",
      "confidence": 0.97,
      "estimatedDays": 145.8,
      "criticalThresholdHours": 120,
      "degradationStage": "Normal"
    },
    "id": "LM-01"
  },
  {
    "firmwareVersion": "v5.1.0",
    "sensors": [
      {
        "sensorId": "laser_power",
        "name": "Fiber Laser Power",
        "value": 0,
        "unit": "W",
        "status": "normal",
        "lastUpdated": "10m ago"
      },
      {
        "sensorId": "galvo_temp",
        "name": "Galvo Head Temp",
        "value": 22,
        "unit": "°C",
        "status": "normal",
        "lastUpdated": "10m ago"
      },
      {
        "sensorId": "exhaust_flow",
        "name": "Exhaust Air Velocity",
        "value": 0,
        "unit": "m/s",
        "status": "normal",
        "lastUpdated": "10m ago"
      }
    ],
    "operatingHours": 3350,
    "healthScore": 88,
    "name": "Galvo Fiber Laser Marker 02",
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
    "manualId": "VAI-MAN-LM-001",
    "anomalies": [
      {
        "id": "ANO-LM02-01",
        "timestamp": "2026-08-27 06:00",
        "type": "Planned Optical Window Cleaning & F-Theta Lens Calibration",
        "severity": "low",
        "description": "Machine taken offline for scheduled 500-hour beam collimator cleaning and OCR fiducial recalibration.",
        "sensor": "Optical Encoder Beam Line",
        "confidence": 0.99,
        "status": "active",
        "recommendedAction": "Complete optical lens wipe and run 2D DataMatrix verification target lot before re-energizing beam."
      }
    ],
    "machineType": "laser-marking",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-27",
      "nextScheduledDate": "2026-11-27",
      "status": "in_progress",
      "type": "Tool Calibration",
      "technician": "Marcus Thorne"
    },
    "knowledgeBaseRef": "machine_knowledge/laser-marking",
    "rul": {
      "value": 3350,
      "unit": "hours",
      "confidence": 0.96,
      "estimatedDays": 139.6,
      "criticalThresholdHours": 120,
      "degradationStage": "Normal"
    },
    "id": "LM-02",
    "documents": [
      {
        "id": "DOC-VAI-MAN-LM-001",
        "title": "Galvo Fiber Laser Serialization Marker Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "34 KB",
        "tags": [
          "Laser Marker",
          "ISO 7",
          "30W MOPA Fiber Laser & F-Theta Specification"
        ]
      }
    ],
    "status": "offline",
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "installationDate": "2024-09-10",
    "processStage": "Bay 5C: Laser Marking Cell",
    "ipAddress": "10.24.108.2",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "Now",
          "health": 88
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 96
        },
        {
          "timestamp": "Day 7",
          "health": 88
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 98
        },
        {
          "timestamp": "Wk 4",
          "health": 88
        }
      ]
    }
  },
  {
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
    "ipAddress": "10.24.105.1",
    "installationDate": "2024-12-01",
    "id": "MP-01",
    "healthScore": 94,
    "processStage": "Bay 4: Encapsulation & Mold Chase",
    "documents": [
      {
        "id": "DOC-VAI-MAN-MP-001",
        "title": "Multi-Cavity Auto Molding Encapsulation Press Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "37 KB",
        "tags": [
          "Molding Press",
          "ISO 7",
          "Hydraulic Plunger & Platen Temp Specification"
        ]
      }
    ],
    "machineType": "molding-press",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-01",
      "nextScheduledDate": "2026-09-01",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "name": "Auto Molding Press 01 (Multi-Cavity)",
    "operatingHours": 1980,
    "status": "healthy",
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "rul": {
      "value": 1980,
      "unit": "hours",
      "confidence": 0.94,
      "estimatedDays": 82.5,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "knowledgeBaseRef": "machine_knowledge/molding-press",
    "firmwareVersion": "v6.1.4",
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
    "anomalies": [],
    "manualId": "VAI-MAN-MP-001",
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
    }
  },
  {
    "ipAddress": "10.24.105.2",
    "id": "MP-02",
    "installationDate": "2024-12-01",
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
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "documents": [
      {
        "id": "DOC-VAI-MAN-MP-001",
        "title": "Multi-Cavity Auto Molding Encapsulation Press Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "37 KB",
        "tags": [
          "Molding Press",
          "ISO 7",
          "Hydraulic Plunger & Platen Temp Specification"
        ]
      }
    ],
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
    "operatingHours": 1850,
    "firmwareVersion": "v6.1.4",
    "healthScore": 93,
    "rul": {
      "value": 1850,
      "unit": "hours",
      "confidence": 0.93,
      "estimatedDays": 77.1,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "machineType": "molding-press",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-03",
      "nextScheduledDate": "2026-09-03",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "processStage": "Bay 4: Encapsulation & Mold Chase",
    "name": "Auto Molding Press 02 (Multi-Cavity)",
    "manualId": "VAI-MAN-MP-001",
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
    "anomalies": [],
    "status": "healthy",
    "knowledgeBaseRef": "machine_knowledge/molding-press"
  },
  {
    "machineType": "molding-press",
    "maintenance": {
      "lastMaintenanceDate": "2026-07-22",
      "nextScheduledDate": "2026-08-30",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-MP-001",
        "title": "Multi-Cavity Auto Molding Encapsulation Press Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "37 KB",
        "tags": [
          "Molding Press",
          "ISO 7",
          "Hydraulic Plunger & Platen Temp Specification"
        ]
      }
    ],
    "name": "Auto Molding Press 03 (Multi-Cavity)",
    "processStage": "Bay 4: Encapsulation & Mold Chase",
    "rul": {
      "value": 84,
      "unit": "hours",
      "confidence": 0.92,
      "estimatedDays": 3.5,
      "criticalThresholdHours": 100,
      "degradationStage": "Accelerated Wear"
    },
    "ipAddress": "10.24.105.3",
    "healthScore": 73,
    "knowledgeBaseRef": "machine_knowledge/molding-press",
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
    "manualId": "VAI-MAN-MP-001",
    "firmwareVersion": "v6.1.4",
    "sensors": [
      {
        "sensorId": "temperature_mold",
        "name": "Mold Chase Temp",
        "value": 188.5,
        "unit": "°C",
        "status": "warning",
        "lastUpdated": "1s ago"
      },
      {
        "sensorId": "pressure_hydraulic",
        "name": "Hydraulic Pressure",
        "value": 178,
        "unit": "bar",
        "status": "warning",
        "lastUpdated": "1s ago"
      },
      {
        "sensorId": "load_plunger",
        "name": "Plunger Load",
        "value": 44.2,
        "unit": "kN",
        "status": "warning",
        "lastUpdated": "1s ago"
      }
    ],
    "status": "warning",
    "installationDate": "2024-12-01",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "12h ago",
          "health": 81
        },
        {
          "timestamp": "Now",
          "health": 73
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 89
        },
        {
          "timestamp": "Day 7",
          "health": 73
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 96
        },
        {
          "timestamp": "Wk 4",
          "health": 73
        }
      ]
    },
    "id": "MP-03",
    "anomalies": [
      {
        "id": "ANO-MP03-01",
        "timestamp": "2026-08-27 03:20",
        "type": "Hydraulic Transfer Ram Pressure Exceedance & Flash Vent Blockage",
        "severity": "medium",
        "description": "Hydraulic ram pressure climbed to 178 bar with resin flash accumulation in mold cavity vents.",
        "sensor": "Hydraulic Pressure",
        "confidence": 0.92,
        "status": "active",
        "recommendedAction": "Schedule platen air vent ultrasonic cleaning and hydraulic cylinder piston ring seal inspection."
      }
    ],
    "operatingHours": 2150,
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z"
  },
  {
    "healthScore": 95,
    "documents": [
      {
        "id": "DOC-VAI-MAN-MP-001",
        "title": "Multi-Cavity Auto Molding Encapsulation Press Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "37 KB",
        "tags": [
          "Molding Press",
          "ISO 7",
          "Hydraulic Plunger & Platen Temp Specification"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/molding-press",
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
    "operatingHours": 2020,
    "processStage": "Bay 4: Encapsulation & Mold Chase",
    "ipAddress": "10.24.105.4",
    "rul": {
      "value": 2020,
      "unit": "hours",
      "confidence": 0.95,
      "estimatedDays": 84.2,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "machineType": "molding-press",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-09",
      "nextScheduledDate": "2026-09-09",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "name": "Auto Molding Press 04 (Multi-Cavity)",
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "anomalies": [],
    "id": "MP-04",
    "installationDate": "2024-12-01",
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
    "status": "healthy",
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
    "manualId": "VAI-MAN-MP-001",
    "firmwareVersion": "v6.1.4"
  },
  {
    "anomalies": [],
    "rul": {
      "value": 2800,
      "unit": "hours",
      "confidence": 0.95,
      "estimatedDays": 116.6,
      "criticalThresholdHours": 120,
      "degradationStage": "Normal"
    },
    "name": "RF Argon Plasma Surface Cleaner 01",
    "installationDate": "2025-03-01",
    "id": "PC-01",
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
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "operatingHours": 2800,
    "machineType": "plasma-cleaner",
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
        "title": "RF Argon & Oxygen Plasma Surface Activation Chamber Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "36 KB",
        "tags": [
          "Plasma Activation",
          "ISO 6",
          "13.56 MHz RF Match & Vacuum Specification"
        ]
      }
    ],
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
    "manualId": "VAI-MAN-PC-001",
    "status": "healthy",
    "knowledgeBaseRef": "machine_knowledge/plasma-cleaner",
    "healthScore": 97,
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
    "ipAddress": "10.24.103.1",
    "processStage": "Bay 3A: Plasma Activation",
    "firmwareVersion": "v3.2.0"
  },
  {
    "anomalies": [
      {
        "id": "ANO-PC02-01",
        "timestamp": "2026-08-27 06:05",
        "type": "Optical Emission Spectroscopy (OES) Plasma Radical Density Drift",
        "severity": "medium",
        "description": "OES endpoint radical intensity ratio drifted by 18.5% with secondary argon-to-oxygen dissociation variance during 13.56 MHz glow discharge.",
        "sensor": "Optical Emission Plasma Density",
        "confidence": 0.88,
        "status": "active",
        "recommendedAction": "Perform RAG-guided multi-point mass flow ratio calibration and inspect optical emission collimator window."
      }
    ],
    "machineType": "plasma-cleaner",
    "maintenance": {
      "lastMaintenanceDate": "2026-07-20",
      "nextScheduledDate": "2026-08-29",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Elena Vance"
    },
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
    "manualId": "VAI-MAN-PC-001",
    "status": "warning",
    "operatingHours": 2650,
    "rul": {
      "value": 94,
      "unit": "hours",
      "confidence": 0.92,
      "estimatedDays": 3.9,
      "criticalThresholdHours": 120,
      "degradationStage": "Accelerated Wear"
    },
    "knowledgeBaseRef": "machine_knowledge/plasma-cleaner",
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "processStage": "Bay 3A: Plasma Activation",
    "healthScore": 75,
    "id": "PC-02",
    "installationDate": "2025-03-01",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "12h ago",
          "health": 84
        },
        {
          "timestamp": "Now",
          "health": 75
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 91
        },
        {
          "timestamp": "Day 7",
          "health": 75
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 97
        },
        {
          "timestamp": "Wk 4",
          "health": 75
        }
      ]
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-PC-001",
        "title": "RF Argon & Oxygen Plasma Surface Activation Chamber Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "36 KB",
        "tags": [
          "Plasma Activation",
          "ISO 6",
          "13.56 MHz RF Match & Vacuum Specification"
        ]
      }
    ],
    "sensors": [
      {
        "sensorId": "vibration_vacuum_pump",
        "name": "Vacuum Pump Vibration",
        "value": 0.48,
        "unit": "mm/s",
        "status": "warning",
        "lastUpdated": "1s ago"
      },
      {
        "sensorId": "chamber_pressure",
        "name": "Chamber Pressure",
        "value": 108,
        "unit": "kPa",
        "status": "warning",
        "lastUpdated": "1s ago"
      },
      {
        "sensorId": "density_oes_plasma",
        "name": "Optical Emission Plasma Density",
        "value": 64.2,
        "unit": "%",
        "status": "warning",
        "lastUpdated": "1s ago"
      }
    ],
    "ipAddress": "10.24.103.2",
    "name": "RF Argon Plasma Surface Cleaner 02",
    "firmwareVersion": "v3.2.0"
  },
  {
    "operatingHours": 4500,
    "processStage": "Bay 1: Wafer Dicing & Prep",
    "id": "STK-01",
    "documents": [
      {
        "id": "DOC-VAI-MAN-STK-001",
        "title": "AMHS Automated Cleanroom FOUP Stocker Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "34 KB",
        "tags": [
          "AMHS",
          "ISO 5",
          "N2 Purge & Crane Rail Specification"
        ]
      }
    ],
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
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
    "name": "AMHS Cleanroom FOUP Stocker 01",
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
    "ipAddress": "10.24.101.99",
    "installationDate": "2024-11-10",
    "firmwareVersion": "v2.4.0",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-01",
      "nextScheduledDate": "2026-11-01",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Elena Vance"
    },
    "machineType": "stocker",
    "rul": {
      "value": 4500,
      "unit": "hours",
      "confidence": 0.98,
      "estimatedDays": 187.5,
      "criticalThresholdHours": 150,
      "degradationStage": "Normal"
    },
    "anomalies": [],
    "status": "healthy",
    "knowledgeBaseRef": "machine_knowledge/stocker",
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
    "manualId": "VAI-MAN-STK-001",
    "healthScore": 99
  },
  {
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
    "manualId": "VAI-MAN-TH-001",
    "rul": {
      "value": 98,
      "unit": "hours",
      "confidence": 0.92,
      "estimatedDays": 4.1,
      "criticalThresholdHours": 80,
      "degradationStage": "Accelerated Wear"
    },
    "maintenance": {
      "lastMaintenanceDate": "2026-07-25",
      "nextScheduledDate": "2026-08-30",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Kenji Sato"
    },
    "machineType": "test-handler",
    "name": "IC Tri-Temp Test Handler 01",
    "healthScore": 76,
    "anomalies": [
      {
        "id": "ANO-TH01-01",
        "timestamp": "2026-08-27 05:10",
        "type": "Cryogenic LN2 Proportional Injection Valve Thermal Hysteresis",
        "severity": "medium",
        "description": "Cryogenic soak zone temperature instability (-34.2°C vs -40.0°C setpoint) with LN2 proportional injection valve hysteresis.",
        "sensor": "LN2 Cryogenic Flow Rate",
        "confidence": 0.86,
        "status": "active",
        "recommendedAction": "Perform semantic RAG-guided cryogenic valve PID re-tuning and check vacuum insulated transfer line integrity."
      }
    ],
    "firmwareVersion": "v9.0.2",
    "installationDate": "2025-01-05",
    "operatingHours": 2100,
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "12h ago",
          "health": 83
        },
        {
          "timestamp": "Now",
          "health": 76
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 91
        },
        {
          "timestamp": "Day 7",
          "health": 76
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 97
        },
        {
          "timestamp": "Wk 4",
          "health": 76
        }
      ]
    },
    "id": "TH-01",
    "knowledgeBaseRef": "machine_knowledge/test-handler",
    "ipAddress": "10.24.109.1",
    "status": "warning",
    "sensors": [
      {
        "sensorId": "vibration_handler",
        "name": "Handler Vibration",
        "value": 0.78,
        "unit": "mm/s",
        "status": "warning",
        "lastUpdated": "2s ago"
      },
      {
        "sensorId": "temperature_chamber",
        "name": "Soak Chamber Temp",
        "value": 92.4,
        "unit": "°C",
        "status": "warning",
        "lastUpdated": "2s ago"
      },
      {
        "sensorId": "flow_cryogenic_ln2",
        "name": "LN2 Cryogenic Flow Rate",
        "value": 4.8,
        "unit": "L/min",
        "status": "warning",
        "lastUpdated": "2s ago"
      }
    ],
    "processStage": "Bay 6A: Tri-Temp Final Test",
    "documents": [
      {
        "id": "DOC-VAI-MAN-TH-001",
        "title": "Tri-Temp High-Throughput IC Test Handler Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "38 KB",
        "tags": [
          "Test Handler",
          "ISO 7",
          "Kelvin Socket & Soak Chamber Specification"
        ]
      }
    ]
  },
  {
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "documents": [
      {
        "id": "DOC-VAI-MAN-TH-001",
        "title": "Tri-Temp High-Throughput IC Test Handler Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "38 KB",
        "tags": [
          "Test Handler",
          "ISO 7",
          "Kelvin Socket & Soak Chamber Specification"
        ]
      }
    ],
    "operatingHours": 2250,
    "firmwareVersion": "v9.0.2",
    "healthScore": 97,
    "status": "healthy",
    "ipAddress": "10.24.109.2",
    "installationDate": "2025-01-05",
    "machineType": "test-handler",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-14",
      "nextScheduledDate": "2026-09-14",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Kenji Sato"
    },
    "name": "IC Tri-Temp Test Handler 02",
    "knowledgeBaseRef": "machine_knowledge/test-handler",
    "rul": {
      "value": 2250,
      "unit": "hours",
      "confidence": 0.96,
      "estimatedDays": 93.8,
      "criticalThresholdHours": 80,
      "degradationStage": "Normal"
    },
    "processStage": "Bay 6A: Tri-Temp Final Test",
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
    "id": "TH-02",
    "anomalies": [],
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
    "manualId": "VAI-MAN-TH-001"
  },
  {
    "machineType": "tape-reel",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-06",
      "nextScheduledDate": "2026-09-06",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "anomalies": [],
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "installationDate": "2024-11-01",
    "healthScore": 96,
    "firmwareVersion": "v3.8.0",
    "operatingHours": 2400,
    "documents": [
      {
        "id": "DOC-VAI-MAN-TR-001",
        "title": "Automated High-Speed Tape & Reel Packaging Cell Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "35 KB",
        "tags": [
          "Tape & Reel",
          "ISO 7",
          "Floating Heat Seal & EIA-481 Peel Specification"
        ]
      }
    ],
    "processStage": "Bay 6B: Tape & Reel Packaging",
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
    "name": "Automated Tape & Reel 01",
    "knowledgeBaseRef": "machine_knowledge/tape-reel",
    "id": "TR-01",
    "ipAddress": "10.24.110.1",
    "status": "healthy",
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
    "manualId": "VAI-MAN-TR-001",
    "rul": {
      "value": 2400,
      "unit": "hours",
      "confidence": 0.95,
      "estimatedDays": 100,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    }
  },
  {
    "ipAddress": "10.24.110.2",
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "documents": [
      {
        "id": "DOC-VAI-MAN-TR-001",
        "title": "Automated High-Speed Tape & Reel Packaging Cell Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "35 KB",
        "tags": [
          "Tape & Reel",
          "ISO 7",
          "Floating Heat Seal & EIA-481 Peel Specification"
        ]
      }
    ],
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
    "name": "Automated Tape & Reel 02",
    "installationDate": "2024-11-01",
    "id": "TR-02",
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
    "knowledgeBaseRef": "machine_knowledge/tape-reel",
    "firmwareVersion": "v3.8.0",
    "healthScore": 95,
    "operatingHours": 2280,
    "rul": {
      "value": 2280,
      "unit": "hours",
      "confidence": 0.94,
      "estimatedDays": 95,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "processStage": "Bay 6B: Tape & Reel Packaging",
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
    "manualId": "VAI-MAN-TR-001",
    "anomalies": [],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-08",
      "nextScheduledDate": "2026-09-08",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "machineType": "tape-reel",
    "status": "healthy"
  },
  {
    "installationDate": "2024-11-01",
    "documents": [
      {
        "id": "DOC-VAI-MAN-TR-001",
        "title": "Automated High-Speed Tape & Reel Packaging Cell Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "35 KB",
        "tags": [
          "Tape & Reel",
          "ISO 7",
          "Floating Heat Seal & EIA-481 Peel Specification"
        ]
      }
    ],
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
    "operatingHours": 2600,
    "rul": {
      "value": 2600,
      "unit": "hours",
      "confidence": 0.97,
      "estimatedDays": 108.3,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "firmwareVersion": "v3.8.0",
    "id": "TR-03",
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
    "ipAddress": "10.24.110.3",
    "name": "Automated Tape & Reel 03",
    "machineType": "tape-reel",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-11",
      "nextScheduledDate": "2026-09-11",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "status": "healthy",
    "anomalies": [],
    "processStage": "Bay 6B: Tape & Reel Packaging",
    "manualId": "VAI-MAN-TR-001",
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
    "knowledgeBaseRef": "machine_knowledge/tape-reel",
    "healthScore": 98
  },
  {
    "id": "TR-04",
    "rul": {
      "value": 2150,
      "unit": "hours",
      "confidence": 0.94,
      "estimatedDays": 89.6,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "documents": [
      {
        "id": "DOC-VAI-MAN-TR-001",
        "title": "Automated High-Speed Tape & Reel Packaging Cell Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "35 KB",
        "tags": [
          "Tape & Reel",
          "ISO 7",
          "Floating Heat Seal & EIA-481 Peel Specification"
        ]
      }
    ],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-13",
      "nextScheduledDate": "2026-09-13",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "machineType": "tape-reel",
    "manualId": "VAI-MAN-TR-001",
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
    "knowledgeBaseRef": "machine_knowledge/tape-reel",
    "processStage": "Bay 6B: Tape & Reel Packaging",
    "healthScore": 94,
    "ipAddress": "10.24.110.4",
    "status": "healthy",
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
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
    "operatingHours": 2150,
    "anomalies": [],
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
    "name": "Automated Tape & Reel 04",
    "firmwareVersion": "v3.8.0",
    "installationDate": "2024-11-01"
  },
  {
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
    "processStage": "Bay 6B: Tape & Reel Packaging",
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
    "documents": [
      {
        "id": "DOC-VAI-MAN-TR-001",
        "title": "Automated High-Speed Tape & Reel Packaging Cell Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "35 KB",
        "tags": [
          "Tape & Reel",
          "ISO 7",
          "Floating Heat Seal & EIA-481 Peel Specification"
        ]
      }
    ],
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "knowledgeBaseRef": "machine_knowledge/tape-reel",
    "firmwareVersion": "v3.8.0",
    "id": "TR-05",
    "ipAddress": "10.24.110.5",
    "operatingHours": 2520,
    "installationDate": "2024-11-01",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-15",
      "nextScheduledDate": "2026-09-15",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "machineType": "tape-reel",
    "status": "healthy",
    "anomalies": [],
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
    "manualId": "VAI-MAN-TR-001",
    "rul": {
      "value": 2520,
      "unit": "hours",
      "confidence": 0.96,
      "estimatedDays": 105,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "name": "Automated Tape & Reel 05",
    "healthScore": 97
  },
  {
    "operatingHours": 2700,
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
    "manualId": "VAI-MAN-TR-001",
    "ipAddress": "10.24.110.6",
    "documents": [
      {
        "id": "DOC-VAI-MAN-TR-001",
        "title": "Automated High-Speed Tape & Reel Packaging Cell Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "35 KB",
        "tags": [
          "Tape & Reel",
          "ISO 7",
          "Floating Heat Seal & EIA-481 Peel Specification"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/tape-reel",
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "name": "Automated Tape & Reel 06",
    "status": "healthy",
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
    "id": "TR-06",
    "installationDate": "2024-11-01",
    "processStage": "Bay 6B: Tape & Reel Packaging",
    "healthScore": 98,
    "firmwareVersion": "v3.8.0",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-16",
      "nextScheduledDate": "2026-09-16",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Marcus Thorne"
    },
    "machineType": "tape-reel",
    "anomalies": [],
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
    ]
  },
  {
    "id": "WB-01",
    "anomalies": [],
    "rul": {
      "value": 1650,
      "unit": "hours",
      "confidence": 0.95,
      "estimatedDays": 68.7,
      "criticalThresholdHours": 80,
      "degradationStage": "Normal"
    },
    "processStage": "Bay 3B: Wire Bonding Cleanroom",
    "machineType": "wire-bonding",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-11",
      "nextScheduledDate": "2026-09-11",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Kenji Sato"
    },
    "firmwareVersion": "v7.4.2",
    "name": "Thermosonic Ball Bonder 01",
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
    "healthScore": 95,
    "installationDate": "2025-01-20",
    "status": "healthy",
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
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "documents": [
      {
        "id": "DOC-VAI-MAN-WB-001",
        "title": "High-Speed Thermosonic Ball Bonder Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "41 KB",
        "tags": [
          "Wire Bonder",
          "ISO 6",
          "PZT Transducer & Capillary Specification"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/wire-bonding",
    "manualId": "VAI-MAN-WB-001",
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
    "ipAddress": "10.24.104.1",
    "operatingHours": 1650
  },
  {
    "id": "WB-02",
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
    "manualId": "VAI-MAN-WB-001",
    "firmwareVersion": "v7.4.2",
    "status": "healthy",
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
    "ipAddress": "10.24.104.2",
    "rul": {
      "value": 1520,
      "unit": "hours",
      "confidence": 0.94,
      "estimatedDays": 63.3,
      "criticalThresholdHours": 80,
      "degradationStage": "Normal"
    },
    "operatingHours": 1520,
    "documents": [
      {
        "id": "DOC-VAI-MAN-WB-001",
        "title": "High-Speed Thermosonic Ball Bonder Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "41 KB",
        "tags": [
          "Wire Bonder",
          "ISO 6",
          "PZT Transducer & Capillary Specification"
        ]
      }
    ],
    "knowledgeBaseRef": "machine_knowledge/wire-bonding",
    "machineType": "wire-bonding",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-08",
      "nextScheduledDate": "2026-09-08",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Kenji Sato"
    },
    "installationDate": "2025-01-20",
    "anomalies": [],
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
    "processStage": "Bay 3B: Wire Bonding Cleanroom",
    "name": "Thermosonic Ball Bonder 02",
    "healthScore": 94,
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z"
  },
  {
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
    "status": "healthy",
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
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
    "operatingHours": 1720,
    "documents": [
      {
        "id": "DOC-VAI-MAN-WB-001",
        "title": "High-Speed Thermosonic Ball Bonder Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "41 KB",
        "tags": [
          "Wire Bonder",
          "ISO 6",
          "PZT Transducer & Capillary Specification"
        ]
      }
    ],
    "id": "WB-03",
    "knowledgeBaseRef": "machine_knowledge/wire-bonding",
    "healthScore": 96,
    "name": "Thermosonic Ball Bonder 03",
    "processStage": "Bay 3B: Wire Bonding Cleanroom",
    "installationDate": "2025-01-20",
    "rul": {
      "value": 1720,
      "unit": "hours",
      "confidence": 0.96,
      "estimatedDays": 71.6,
      "criticalThresholdHours": 80,
      "degradationStage": "Normal"
    },
    "machineType": "wire-bonding",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-10",
      "nextScheduledDate": "2026-09-10",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Kenji Sato"
    },
    "anomalies": []
  },
  {
    "knowledgeBaseRef": "machine_knowledge/wire-bonding",
    "documents": [
      {
        "id": "DOC-VAI-MAN-WB-001",
        "title": "High-Speed Thermosonic Ball Bonder Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "41 KB",
        "tags": [
          "Wire Bonder",
          "ISO 6",
          "PZT Transducer & Capillary Specification"
        ]
      }
    ],
    "manualId": "VAI-MAN-WB-001",
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
    "name": "Thermosonic Ball Bonder 04",
    "ipAddress": "10.24.104.4",
    "sensors": [
      {
        "sensorId": "vibration_ultrasonic",
        "name": "Ultrasonic Vibration",
        "value": 3.42,
        "unit": "mm/s",
        "status": "critical",
        "lastUpdated": "1s ago"
      },
      {
        "sensorId": "load_clamp",
        "name": "Clamping Force",
        "value": 86,
        "unit": "warning",
        "status": "warning",
        "lastUpdated": "1s ago"
      },
      {
        "sensorId": "temperature_transducer",
        "name": "Transducer Temp",
        "value": 69.2,
        "unit": "°C",
        "status": "critical",
        "lastUpdated": "1s ago"
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
          "health": 48
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 78
        },
        {
          "timestamp": "Day 7",
          "health": 48
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 92
        },
        {
          "timestamp": "Wk 4",
          "health": 48
        }
      ]
    },
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "operatingHours": 3200,
    "anomalies": [
      {
        "id": "ANO-WB04-01",
        "timestamp": "2026-08-27 06:10",
        "type": "PZT Transducer Thermal Runaway & Acoustic Resonance Decoupling",
        "severity": "high",
        "description": "Piezo transducer head temp spiked to 69.2°C with vibration at 3.42 mm/s causing high non-stick on pad (NSOP) failure rates.",
        "sensor": "Ultrasonic Vibration",
        "confidence": 0.97,
        "status": "active",
        "recommendedAction": "Immediate emergency tool stop: Replace capillary tool (25µm ceramic) and retune piezo transducer stack at 138.4 kHz."
      }
    ],
    "processStage": "Bay 3B: Wire Bonding Cleanroom",
    "rul": {
      "value": 28,
      "unit": "hours",
      "confidence": 0.94,
      "estimatedDays": 1.1,
      "criticalThresholdHours": 80,
      "degradationStage": "Imminent Failure"
    },
    "healthScore": 48,
    "installationDate": "2025-01-20",
    "machineType": "wire-bonding",
    "maintenance": {
      "lastMaintenanceDate": "2026-07-20",
      "nextScheduledDate": "2026-08-27",
      "status": "overdue",
      "type": "Spindle Rebuild",
      "technician": "Kenji Sato"
    },
    "status": "critical",
    "id": "WB-04",
    "firmwareVersion": "v7.4.2"
  },
  {
    "rul": {
      "value": 1550,
      "unit": "hours",
      "confidence": 0.94,
      "estimatedDays": 64.5,
      "criticalThresholdHours": 80,
      "degradationStage": "Normal"
    },
    "manualId": "VAI-MAN-WB-001",
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
    "knowledgeBaseRef": "machine_knowledge/wire-bonding",
    "firmwareVersion": "v7.4.2",
    "machineType": "wire-bonding",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-12",
      "nextScheduledDate": "2026-09-12",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Kenji Sato"
    },
    "installationDate": "2025-01-20",
    "name": "Thermosonic Ball Bonder 05",
    "status": "healthy",
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "ipAddress": "10.24.104.5",
    "id": "WB-05",
    "processStage": "Bay 3B: Wire Bonding Cleanroom",
    "documents": [
      {
        "id": "DOC-VAI-MAN-WB-001",
        "title": "High-Speed Thermosonic Ball Bonder Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "41 KB",
        "tags": [
          "Wire Bonder",
          "ISO 6",
          "PZT Transducer & Capillary Specification"
        ]
      }
    ],
    "operatingHours": 1550,
    "healthScore": 94
  },
  {
    "healthScore": 96,
    "documents": [
      {
        "id": "DOC-VAI-MAN-WB-001",
        "title": "High-Speed Thermosonic Ball Bonder Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "41 KB",
        "tags": [
          "Wire Bonder",
          "ISO 6",
          "PZT Transducer & Capillary Specification"
        ]
      }
    ],
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
    "manualId": "VAI-MAN-WB-001",
    "installationDate": "2025-01-20",
    "name": "Thermosonic Ball Bonder 06",
    "ipAddress": "10.24.104.6",
    "machineType": "wire-bonding",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-14",
      "nextScheduledDate": "2026-09-14",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Kenji Sato"
    },
    "rul": {
      "value": 1680,
      "unit": "hours",
      "confidence": 0.95,
      "estimatedDays": 70,
      "criticalThresholdHours": 80,
      "degradationStage": "Normal"
    },
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "firmwareVersion": "v7.4.2",
    "operatingHours": 1680,
    "anomalies": [],
    "status": "healthy",
    "id": "WB-06",
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
    "processStage": "Bay 3B: Wire Bonding Cleanroom",
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
    "knowledgeBaseRef": "machine_knowledge/wire-bonding"
  },
  {
    "anomalies": [],
    "name": "Thermosonic Ball Bonder 07",
    "rul": {
      "value": 1480,
      "unit": "hours",
      "confidence": 0.93,
      "estimatedDays": 61.6,
      "criticalThresholdHours": 80,
      "degradationStage": "Normal"
    },
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "id": "WB-07",
    "installationDate": "2025-01-20",
    "manualId": "VAI-MAN-WB-001",
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
    "knowledgeBaseRef": "machine_knowledge/wire-bonding",
    "documents": [
      {
        "id": "DOC-VAI-MAN-WB-001",
        "title": "High-Speed Thermosonic Ball Bonder Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "41 KB",
        "tags": [
          "Wire Bonder",
          "ISO 6",
          "PZT Transducer & Capillary Specification"
        ]
      }
    ],
    "healthScore": 93,
    "machineType": "wire-bonding",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-05",
      "nextScheduledDate": "2026-09-05",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Kenji Sato"
    },
    "processStage": "Bay 3B: Wire Bonding Cleanroom",
    "operatingHours": 1480,
    "ipAddress": "10.24.104.7",
    "status": "healthy",
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
    "firmwareVersion": "v7.4.2"
  },
  {
    "rul": {
      "value": 1600,
      "unit": "hours",
      "confidence": 0.95,
      "estimatedDays": 66.7,
      "criticalThresholdHours": 80,
      "degradationStage": "Normal"
    },
    "healthScore": 95,
    "anomalies": [],
    "processStage": "Bay 3B: Wire Bonding Cleanroom",
    "knowledgeBaseRef": "machine_knowledge/wire-bonding",
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
    "manualId": "VAI-MAN-WB-001",
    "operatingHours": 1600,
    "status": "healthy",
    "machineType": "wire-bonding",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-10",
      "nextScheduledDate": "2026-09-10",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Kenji Sato"
    },
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "name": "Thermosonic Ball Bonder 08",
    "id": "WB-08",
    "documents": [
      {
        "id": "DOC-VAI-MAN-WB-001",
        "title": "High-Speed Thermosonic Ball Bonder Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "41 KB",
        "tags": [
          "Wire Bonder",
          "ISO 6",
          "PZT Transducer & Capillary Specification"
        ]
      }
    ],
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
    "firmwareVersion": "v7.4.2",
    "installationDate": "2025-01-20",
    "ipAddress": "10.24.104.8"
  },
  {
    "status": "healthy",
    "healthScore": 98,
    "operatingHours": 2400,
    "documents": [
      {
        "id": "DOC-VAI-MAN-WS-001",
        "title": "300mm Precision Wafer Dicing Saw Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "38 KB",
        "tags": [
          "Wafer Saw",
          "ISO 5",
          "Spindle & Coolant Specification"
        ]
      }
    ],
    "name": "300mm Precision Wafer Saw 01",
    "rul": {
      "value": 2400,
      "unit": "hours",
      "confidence": 0.96,
      "estimatedDays": 100,
      "criticalThresholdHours": 100,
      "degradationStage": "Normal"
    },
    "knowledgeBaseRef": "machine_knowledge/wafer-saw",
    "id": "WS-01",
    "ipAddress": "10.24.101.1",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-10",
      "nextScheduledDate": "2026-09-10",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Kenji Sato"
    },
    "machineType": "wafer-saw",
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
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
    "installationDate": "2025-01-15",
    "firmwareVersion": "v4.1.8",
    "anomalies": [],
    "processStage": "Bay 1: Wafer Dicing & Prep",
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
    "manualId": "VAI-MAN-WS-001"
  },
  {
    "processStage": "Bay 1: Wafer Dicing & Prep",
    "documents": [
      {
        "id": "DOC-VAI-MAN-WS-001",
        "title": "300mm Precision Wafer Dicing Saw Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "38 KB",
        "tags": [
          "Wafer Saw",
          "ISO 5",
          "Spindle & Coolant Specification"
        ]
      }
    ],
    "installationDate": "2025-01-15",
    "operatingHours": 2180,
    "rul": {
      "value": 64,
      "unit": "hours",
      "confidence": 0.93,
      "estimatedDays": 2.6,
      "criticalThresholdHours": 100,
      "degradationStage": "Accelerated Wear"
    },
    "name": "300mm Precision Wafer Saw 02",
    "ipAddress": "10.24.101.2",
    "healthTrend": {
      "24h": [
        {
          "timestamp": "12h ago",
          "health": 82
        },
        {
          "timestamp": "Now",
          "health": 71
        }
      ],
      "7d": [
        {
          "timestamp": "Day 1",
          "health": 91
        },
        {
          "timestamp": "Day 7",
          "health": 71
        }
      ],
      "30d": [
        {
          "timestamp": "Wk 1",
          "health": 97
        },
        {
          "timestamp": "Wk 4",
          "health": 71
        }
      ]
    },
    "id": "WS-02",
    "anomalies": [
      {
        "id": "ANO-WS02-01",
        "timestamp": "2026-08-27 05:40",
        "type": "Spindle Ceramic Bearing Harmonic Micro-Spalling",
        "severity": "medium",
        "description": "High-frequency 12.4 kHz vibration harmonics indicating ceramic air-bearing raceway wear and blade micro-binding.",
        "sensor": "Spindle Radial Vibration",
        "confidence": 0.92,
        "status": "active",
        "recommendedAction": "Inspect labyrinth seal, replace resinoid diamond dicing blade, and balance spindle rotor."
      }
    ],
    "firmwareVersion": "v4.1.8",
    "manualId": "VAI-MAN-WS-001",
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
    "sensors": [
      {
        "sensorId": "vibration_spindle",
        "name": "Spindle Vibration",
        "value": 1.65,
        "unit": "mm/s",
        "status": "warning",
        "lastUpdated": "1s ago"
      },
      {
        "sensorId": "temperature_coolant",
        "name": "Coolant Temp",
        "value": 38.4,
        "unit": "°C",
        "status": "warning",
        "lastUpdated": "1s ago"
      },
      {
        "sensorId": "load_motor",
        "name": "Spindle Motor Load",
        "value": 74,
        "unit": "%",
        "status": "warning",
        "lastUpdated": "1s ago"
      }
    ],
    "healthScore": 71,
    "machineType": "wafer-saw",
    "maintenance": {
      "lastMaintenanceDate": "2026-08-01",
      "nextScheduledDate": "2026-08-28",
      "status": "scheduled",
      "type": "Tool Calibration",
      "technician": "Kenji Sato"
    },
    "status": "warning",
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "knowledgeBaseRef": "machine_knowledge/wafer-saw"
  },
  {
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
    "knowledgeBaseRef": "machine_knowledge/x-ray-inspection",
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
    "anomalies": [],
    "manualId": "VAI-MAN-XR-001",
    "id": "XR-01",
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "name": "Microfocus X-Ray NDT Cell 01",
    "rul": {
      "value": 2450,
      "unit": "hours",
      "confidence": 0.96,
      "estimatedDays": 102.1,
      "criticalThresholdHours": 120,
      "degradationStage": "Normal"
    },
    "operatingHours": 2450,
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
    "documents": [
      {
        "id": "DOC-VAI-MAN-XR-001",
        "title": "Lead-Shielded Microfocus X-Ray NDT Cell Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "36 KB",
        "tags": [
          "X-Ray NDT",
          "ISO 6",
          "130 kV Microfocus & Manipulator Specification"
        ]
      }
    ],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-01",
      "nextScheduledDate": "2026-11-01",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Elena Vance"
    },
    "machineType": "x-ray-inspection",
    "firmwareVersion": "v4.0.5",
    "status": "healthy",
    "healthScore": 97,
    "processStage": "Bay 5B: Lead-Shielded X-Ray",
    "ipAddress": "10.24.107.1",
    "installationDate": "2024-11-20"
  },
  {
    "id": "XR-02",
    "rul": {
      "value": 2380,
      "unit": "hours",
      "confidence": 0.95,
      "estimatedDays": 99.2,
      "criticalThresholdHours": 120,
      "degradationStage": "Normal"
    },
    "healthScore": 96,
    "ipAddress": "10.24.107.2",
    "knowledgeBaseRef": "machine_knowledge/x-ray-inspection",
    "firmwareVersion": "v4.0.5",
    "documents": [
      {
        "id": "DOC-VAI-MAN-XR-001",
        "title": "Lead-Shielded Microfocus X-Ray NDT Cell Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-27",
        "size": "36 KB",
        "tags": [
          "X-Ray NDT",
          "ISO 6",
          "130 kV Microfocus & Manipulator Specification"
        ]
      }
    ],
    "maintenance": {
      "lastMaintenanceDate": "2026-08-03",
      "nextScheduledDate": "2026-11-03",
      "status": "scheduled",
      "type": "Preventive Inspection",
      "technician": "Elena Vance"
    },
    "machineType": "x-ray-inspection",
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
    "lastTelemetryTimestamp": "2026-08-27T06:12:00Z",
    "installationDate": "2024-11-20",
    "anomalies": [],
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
    "manualId": "VAI-MAN-XR-001",
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
    "name": "Microfocus X-Ray NDT Cell 02",
    "operatingHours": 2380,
    "processStage": "Bay 5B: Lead-Shielded X-Ray",
    "status": "healthy"
  }
];
