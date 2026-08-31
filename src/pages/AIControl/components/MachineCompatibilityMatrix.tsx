import React from 'react';
import { MACHINE_COMPATIBILITY_MATRIX } from '../data/factoryState';
import { Check, X, ShieldAlert } from 'lucide-react';

export const MachineCompatibilityMatrix: React.FC = () => {
  return (
    <div className="tech-card">
      <span className="corner-tl">+</span>
      <span className="corner-tr">+</span>

      <div className="tech-card-header">
        <div className="tech-card-title">
          <ShieldAlert size={14} />
          <span>MACHINE-PRODUCT COMPATIBILITY MATRIX</span>
        </div>
        <span className="status-pill">
          STRICT ENFORCEMENT
        </span>
      </div>

      <div className="tech-card-body" style={{ padding: '12px' }}>
        <table className="compat-matrix-table">
          <thead>
            <tr>
              <th>Machine Node</th>
              <th>Product A</th>
              <th>Product B</th>
              <th>Tooling / Fixture Profile</th>
            </tr>
          </thead>
          <tbody>
            {MACHINE_COMPATIBILITY_MATRIX.map((row) => (
              <tr key={row.machineId}>
                <td style={{ fontWeight: 700 }}>{row.machineName}</td>
                <td>
                  {row.productA ? (
                    <span className="compat-badge-yes">
                      <Check size={12} /> Yes
                    </span>
                  ) : (
                    <span className="compat-badge-no">
                      <X size={12} /> No
                    </span>
                  )}
                </td>
                <td>
                  {row.productB ? (
                    <span className="compat-badge-yes">
                      <Check size={12} /> Yes
                    </span>
                  ) : (
                    <span className="compat-badge-no">
                      <X size={12} /> No
                    </span>
                  )}
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
