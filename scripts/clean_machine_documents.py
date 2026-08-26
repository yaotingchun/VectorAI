import re
import json

MANUAL_INFO = {
    "wafer_dicing": {
        "id": "DOC-VAI-MAN-DIC-001",
        "title": "High-Precision Wafer Dicing Saw Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-26",
        "size": "36 KB",
        "tags": ["Dicing", "Spindle", "Synthetic_Prototype", "Manual"]
    },
    "die_attacher": {
        "id": "DOC-VAI-MAN-DA-001",
        "title": "Thermo-Compression Precision Die Attacher Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-26",
        "size": "36 KB",
        "tags": ["DieAttach", "BondHead", "Synthetic_Prototype", "Manual"]
    },
    "wire_bonder": {
        "id": "DOC-VAI-MAN-WB-001",
        "title": "High-Speed Thermosonic Ball-Wedge Wire Bonder Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-26",
        "size": "36 KB",
        "tags": ["WireBonding", "Transducer", "Synthetic_Prototype", "Manual"]
    },
    "molding": {
        "id": "DOC-VAI-MAN-MOLD-001",
        "title": "Multi-Plunger Transfer Molding Press Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-26",
        "size": "36 KB",
        "tags": ["Molding", "Plunger", "Synthetic_Prototype", "Manual"]
    },
    "ic_tester": {
        "id": "DOC-VAI-MAN-ATE-001",
        "title": "High-Speed Automated IC Tester & Pick-and-Place Sorter Technical Manual (PDF)",
        "type": "PDF",
        "category": "Manual",
        "updatedAt": "2026-08-26",
        "size": "36 KB",
        "tags": ["Tester", "Sorter", "Synthetic_Prototype", "Manual"]
    }
}

# Update src/data/machines.json
with open('src/data/machines.json', 'r', encoding='utf-8') as f:
    machines = json.load(f)

for m in machines:
    m_type = m.get('machineType', 'wire_bonder')
    if m_type in MANUAL_INFO:
        m['documents'] = [MANUAL_INFO[m_type]]
    else:
        m['documents'] = [MANUAL_INFO['wire_bonder']]

with open('src/data/machines.json', 'w', encoding='utf-8') as f:
    json.dump(machines, f, indent=2)

print(f"Updated src/data/machines.json with {len(machines)} machines.")
