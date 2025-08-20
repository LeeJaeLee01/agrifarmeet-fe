import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-screen bg-white">
      <div className="w-10 h-10 border-4 border-t-4 border-green-600 rounded-full lg:border-t-8 lg:border-8 lg:w-20 lg:h-20 animate-spin border-t-transparent"></div>
    </div>
  );
};

export default Loading;
