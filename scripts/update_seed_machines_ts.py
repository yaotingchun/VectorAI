import json

with open('src/data/machines.json', 'r', encoding='utf-8') as f:
    machines = json.load(f)

ts_content = f"""import {{ Machine }} from '../types/machine';

export const SEED_MACHINES: Machine[] = {json.dumps(machines, indent=2)};
"""

with open('src/features/machines/data/seedMachines.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Updated src/features/machines/data/seedMachines.ts successfully with {len(machines)} machines.")
