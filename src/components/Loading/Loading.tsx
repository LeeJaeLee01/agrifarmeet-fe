import React from 'react';
import { Spin } from 'antd';

const Loading: React.FC = () => {
  return (
    <Spin fullscreen size="large" tip="Đang tải gói..." />
  );
};

export default Loading;
