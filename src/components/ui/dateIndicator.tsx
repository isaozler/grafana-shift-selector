import React from 'react';

import { useStore } from '../../store';
import { Label, Value, Wrapper } from '../../styles/ui/dateIndicator';

export const DateIndicator = () => {
  const store = useStore();

  return (
    <>
      {store.props?.ui.element.date.input.value ? 
        <Wrapper>
          <Label>{store.props?.ui.element.date.label.value}</Label>
          <Value>{store.props?.ui.element.date.input.value}</Value>
        </Wrapper>
      : null}
    </>
  );
};
