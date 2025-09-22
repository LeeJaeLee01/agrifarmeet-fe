import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  secondary?: boolean;
  fullScreen?: boolean;
}

const Section: React.FC<SectionProps> = ({ children, secondary = false, fullScreen }) => {
  const bgClass = secondary && 'bg-[#f6f6f6]';

  return (
    <section className={`w-full section ${bgClass} ${fullScreen && 'page-height'} overflow-hidden`}>
      <div className="px-5 mt-10 content lg:mt-24 md:mt-20 lg:px-20">{children}</div>
    </section>
  );
};

export default Section;
