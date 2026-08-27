const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/User/Downloads/VectorAI';
const machinesJsonPath = path.join(projectRoot, 'src/data/machines.json');
const seedMachinesTsPath = path.join(projectRoot, 'src/features/machines/data/seedMachines.ts');

const machines = JSON.parse(fs.readFileSync(machinesJsonPath, 'utf8'));

const MANUAL_SPECS = {
  'wafer-saw': {
    manualId: 'VAI-MAN-WS-001',
    knowledgeBaseRef: 'machine_knowledge/wafer-saw',
    title: '300mm Precision Wafer Dicing Saw Technical Manual (PDF)',
    size: '38 KB',
    tags: ['Wafer Saw', 'ISO 5', 'Spindle & Coolant Specification']
  },
  'stocker': {
    manualId: 'VAI-MAN-STK-001',
    knowledgeBaseRef: 'machine_knowledge/stocker',
    title: 'AMHS Automated Cleanroom FOUP Stocker Technical Manual (PDF)',
    size: '34 KB',
    tags: ['AMHS', 'ISO 5', 'N2 Purge & Crane Rail Specification']
  },
  'die-attach': {
    manualId: 'VAI-MAN-DA-001',
    knowledgeBaseRef: 'machine_knowledge/die-attach',
    title: 'High-Precision Epoxy & Eutectic Die Bonder Technical Manual (PDF)',
    size: '39 KB',
    tags: ['Die Attach', 'ISO 6', 'Collet Vacuum & Ejector Specification']
  },
  'plasma-cleaner': {
    manualId: 'VAI-MAN-PC-001',
    knowledgeBaseRef: 'machine_knowledge/plasma-cleaner',
    title: 'RF Argon & Oxygen Plasma Surface Activation Chamber Technical Manual (PDF)',
    size: '36 KB',
    tags: ['Plasma Activation', 'ISO 6', '13.56 MHz RF Match & Vacuum Specification']
  },
  'wire-bonding': {
    manualId: 'VAI-MAN-WB-001',
    knowledgeBaseRef: 'machine_knowledge/wire-bonding',
    title: 'High-Speed Thermosonic Ball Bonder Technical Manual (PDF)',
    size: '41 KB',
    tags: ['Wire Bonder', 'ISO 6', 'PZT Transducer & Capillary Specification']
  },
  'molding-press': {
    manualId: 'VAI-MAN-MP-001',
    knowledgeBaseRef: 'machine_knowledge/molding-press',
    title: 'Multi-Cavity Auto Molding Encapsulation Press Technical Manual (PDF)',
    size: '37 KB',
    tags: ['Molding Press', 'ISO 7', 'Hydraulic Plunger & Platen Temp Specification']
  },
  'aoi-inspection': {
    manualId: 'VAI-MAN-AOI-001',
    knowledgeBaseRef: 'machine_knowledge/aoi-inspection',
    title: '3D Optical AOI Metrology & Coplanarity System Technical Manual (PDF)',
    size: '35 KB',
    tags: ['3D AOI', 'ISO 6', 'Telecentric Optics & Gantry Specification']
  },
  'x-ray-inspection': {
    manualId: 'VAI-MAN-XR-001',
    knowledgeBaseRef: 'machine_knowledge/x-ray-inspection',
    title: 'Lead-Shielded Microfocus X-Ray NDT Cell Technical Manual (PDF)',
    size: '36 KB',
    tags: ['X-Ray NDT', 'ISO 6', '130 kV Microfocus & Manipulator Specification']
  },
  'laser-marking': {
    manualId: 'VAI-MAN-LM-001',
    knowledgeBaseRef: 'machine_knowledge/laser-marking',
    title: 'Galvo Fiber Laser Serialization Marker Technical Manual (PDF)',
    size: '34 KB',
    tags: ['Laser Marker', 'ISO 7', '30W MOPA Fiber Laser & F-Theta Specification']
  },
  'test-handler': {
    manualId: 'VAI-MAN-TH-001',
    knowledgeBaseRef: 'machine_knowledge/test-handler',
    title: 'Tri-Temp High-Throughput IC Test Handler Technical Manual (PDF)',
    size: '38 KB',
    tags: ['Test Handler', 'ISO 7', 'Kelvin Socket & Soak Chamber Specification']
  },
  'tape-reel': {
    manualId: 'VAI-MAN-TR-001',
    knowledgeBaseRef: 'machine_knowledge/tape-reel',
    title: 'Automated High-Speed Tape & Reel Packaging Cell Technical Manual (PDF)',
    size: '35 KB',
    tags: ['Tape & Reel', 'ISO 7', 'Floating Heat Seal & EIA-481 Peel Specification']
  }
};

const updatedMachines = machines.map(m => {
  const spec = MANUAL_SPECS[m.machineType] || MANUAL_SPECS['wire-bonding'];

  const updatedDocs = [
    {
      id: `DOC-${spec.manualId}`,
      title: spec.title,
      type: 'PDF',
      category: 'Manual',
      updatedAt: '2026-08-27',
      size: spec.size,
      tags: spec.tags
    }
  ];

  return {
    ...m,
    manualId: spec.manualId,
    knowledgeBaseRef: spec.knowledgeBaseRef,
    documents: updatedDocs
  };
});

fs.writeFileSync(machinesJsonPath, JSON.stringify(updatedMachines, null, 2), 'utf8');
console.log(`Updated ${updatedMachines.length} machines in: ${machinesJsonPath}`);

const seedTsContent = `import { Machine } from '../types/machine';\n\nexport const SEED_MACHINES: Machine[] = ${JSON.stringify(updatedMachines, null, 2)};\n`;
fs.writeFileSync(seedMachinesTsPath, seedTsContent, 'utf8');
console.log(`Updated seedMachines.ts in: ${seedMachinesTsPath}`);
