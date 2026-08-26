import React from 'react';
import { VFactoryLiveView } from '../components/vfactory/VFactoryLiveView';

export const ReroutingPage: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <VFactoryLiveView />
    </div>
  );
};

export default ReroutingPage;
