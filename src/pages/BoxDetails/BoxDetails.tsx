import React from 'react';
import Section from '../../components/Section/Section';

const BoxDetails: React.FC = () => {
  return (
    <Section>
      <div className="container mx-auto">
        <h1 className="mb-10 text-2xl font-bold md:text-3xl lg:text-4xl text-text1">Trial 199k</h1>
        <div className="flex flex-col justify-between w-full gap-10 pb-10 mb-10 lg:flex-row item-center"></div>
      </div>
    </Section>
  );
};

export default BoxDetails;
