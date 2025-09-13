import React from 'react';
import { Spin } from 'antd';

const SpinnerAdmin: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <Spin size="large" />
    </div>
  );
};

export default SpinnerAdmin;
