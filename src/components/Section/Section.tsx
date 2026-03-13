import React, { forwardRef } from 'react';

interface SectionProps {
  children: React.ReactNode;
  spaceBottom?: boolean;
  secondary?: boolean;
  fullScreen?: boolean;
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ children, spaceBottom, fullScreen }, ref) => {
    return (
      <section ref={ref} className="bg-white">
        <div className={`pt-12 content sm:pt-16 ${spaceBottom && 'py-24 sm:py-32'}`}>
          {children}
        </div>
      </section>
    );
  }
);

export default Section;
