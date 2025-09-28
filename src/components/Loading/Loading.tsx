import React from 'react';
import { Spin } from 'antd';

const Loading: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-screen bg-white">
      <Spin size="large" tip="Đang tải gói..." />
    </div>
  );
};

export default Loading;
