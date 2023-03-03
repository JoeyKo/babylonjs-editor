import { Icon } from '@chakra-ui/react';
import React, { forwardRef } from 'react';

import { Action, ActionProps } from '../Action';
import { MdDragIndicator } from 'react-icons/md';

// eslint-disable-next-line react/display-name
export const Handle = forwardRef<HTMLButtonElement, ActionProps>(
  (props, ref) => {
    return (
      <Action
        ref={ref}
        style={{ padding: `4px 8px` }}
        cursor="grab"
        data-cypress="draggable-handle"
        {...props}
      >
        <Icon as={MdDragIndicator} />
      </Action>
    );
  }
);