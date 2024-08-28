import React from 'react';
import PetHeader from '../Kioskcomponents/PetHeader';
import PetFooter from '../Kioskcomponents/PetFooter';

const KioskLayout = ({ children }) => {
  return (
    <div>
      <PetHeader />
      <main>{children}</main>
      <PetFooter />
    </div>
  );
};

export default KioskLayout;