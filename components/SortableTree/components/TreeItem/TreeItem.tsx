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