import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  secondary?: boolean;
}

const Section: React.FC<SectionProps> = ({ children, secondary = false }) => {
  const bgClass = secondary ? 'bg-[#f6f6f6]' : 'bg-white';

  return (
    <section className={`w-full px-5 py-14 lg:py-24 lg:px-20 section ${bgClass}`}>
      {children}
    </section>
  );
};

export default Section;
