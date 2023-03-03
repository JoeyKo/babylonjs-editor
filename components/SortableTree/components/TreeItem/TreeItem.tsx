import React, { forwardRef, HTMLAttributes, useState } from 'react';
import classNames from 'classnames';

import { Action, Handle } from '../Item';
import { HStack, Icon, Text } from '@chakra-ui/react';
import { BiPlus, BiMinus } from 'react-icons/bi'
import { ClickEvent, ControlledMenu, MenuItem } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { HiOutlineDuplicate, HiOutlineTrash } from 'react-icons/hi'

import styles from './TreeItem.module.scss';

export interface Props extends Omit<HTMLAttributes<HTMLLIElement>, 'id'> {
  childCount?: number;
  clone?: boolean;
  collapsed?: boolean;
  depth: number;
  disableInteraction?: boolean;
  disableSelection?: boolean;
  ghost?: boolean;
  handleProps?: any;
  indicator?: boolean;
  indentationWidth: number;
  value: string;
  onCollapse?(): void;
  onMenuItemClick?: (e: ClickEvent) => void;
  wrapperRef?(node: HTMLLIElement): void;
}

// eslint-disable-next-line react/display-name
export const TreeItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      childCount,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      indicator,
      collapsed,
      onCollapse,
      onMenuItemClick,
      style,
      value,
      wrapperRef,
      ...props
    },
    ref
  ) => {
    const [isOpen, setOpen] = useState(false);
    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

    const menuItemClassName = ({ hover }: { hover: boolean }) => (hover ? styles.menuItemHover : styles.menuItem);

    return (
      <div onContextMenu={(e) => {
        e.preventDefault();
        setAnchorPoint({ x: e.clientX, y: e.clientY });
        setOpen(true);
      }}>
        <li
          className={classNames(
            styles.Wrapper,
            clone && styles.clone,
            ghost && styles.ghost,
            indicator && styles.indicator,
            disableSelection && styles.disableSelection,
            disableInteraction && styles.disableInteraction
          )}
          ref={wrapperRef}
          style={
            {
              '--spacing': `${indentationWidth * depth}px`,
            } as React.CSSProperties
          }
          {...props}
        >
          <div className={styles.TreeItem} ref={ref} style={style}>
            <Handle {...handleProps} />
            {onCollapse && (
              <Action onClick={onCollapse}>
                <Icon width={"12px"} height={"12px"} as={collapsed ? BiPlus : BiMinus} />
              </Action>
            )}

            <span ref={ref} className={styles.Text}>{value}</span>

            {clone && childCount && childCount > 1 ? (
              <span className={styles.Count}>{childCount}</span>
            ) : null}
          </div>
        </li>
        <ControlledMenu
          menuClassName={styles.menu}
          anchorPoint={anchorPoint}
          state={isOpen ? 'open' : 'closed'}
          direction="right"
          portal
          onItemClick={onMenuItemClick}
          onClose={() => setOpen(false)}
        >
          <MenuItem className={menuItemClassName} value={"clone"}>
            <HStack><Icon fontSize={'lg'} as={HiOutlineDuplicate} /><Text fontSize={"xs"}>复制</Text></HStack>
          </MenuItem>
          <MenuItem className={menuItemClassName} value={"remove"}>
            <HStack><Icon fontSize={'lg'} as={HiOutlineTrash} /><Text fontSize={"xs"}>删除</Text></HStack></MenuItem>
        </ControlledMenu>
      </div>
    );
  }
);

const collapseIcon = (
  <svg width="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 41">
    <path d="M30.76 39.2402C31.885 40.3638 33.41 40.995 35 40.995C36.59 40.995 38.115 40.3638 39.24 39.2402L68.24 10.2402C69.2998 9.10284 69.8768 7.59846 69.8494 6.04406C69.822 4.48965 69.1923 3.00657 68.093 1.90726C66.9937 0.807959 65.5106 0.178263 63.9562 0.150837C62.4018 0.123411 60.8974 0.700397 59.76 1.76024L35 26.5102L10.24 1.76024C9.10259 0.700397 7.59822 0.123411 6.04381 0.150837C4.4894 0.178263 3.00632 0.807959 1.90702 1.90726C0.807714 3.00657 0.178019 4.48965 0.150593 6.04406C0.123167 7.59846 0.700153 9.10284 1.75999 10.2402L30.76 39.2402Z" />
  </svg>
);