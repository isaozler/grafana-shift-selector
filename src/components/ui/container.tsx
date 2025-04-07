import React, { ComponentType } from 'react';
import { Container, ResponsiveBox } from '../../styles/ui/container';
import { Indicators } from './indicators';

export const Wrapper: ComponentType<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Container>
      <ResponsiveBox>
        {children}
        <Indicators />
      </ResponsiveBox>
    </Container>
  );
};
