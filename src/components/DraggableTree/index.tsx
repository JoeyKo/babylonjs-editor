import React, { useState } from 'react';
import { Heading, HStack, Icon, Stack } from '@chakra-ui/react';
import { BsBox } from 'react-icons/bs'
import { BiDuplicate, BiTargetLock, BiTrash } from 'react-icons/bi'
import styled from '@emotion/styled';
import { Dropdown, Tree } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';

export const StyledTree = styled(Tree)`
  &.ant-tree {
    height: calc(100% - 32px);
    color: var(--chakra-colors-gray-100);
    background-color: transparent;
    border-radius: 0;
    overflow: auto;
    .ant-tree-treenode {
      /* &.drop-target {
        position: relative;
        &:after {
         
        }
      } */
      .ant-tree-node-content-wrapper {
        &.ant-tree-node-selected {
          border-radius: 0;
          background-color: var(--chakra-colors-blue-900);
        }
      }
    }
  }
`;
const x = 3;
const y = 2;
const z = 1;
const defaultData: DataNode[] = [];

const generateData = (_level: number, _preKey?: React.Key, _tns?: DataNode[]) => {
  const preKey = _preKey || '0';
  const tns = _tns || defaultData;

  const children: React.Key[] = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);
const menuItems: any[] = [
  {
    label: '复制',
    key: 'clone',
    icon: BiDuplicate
  },
  {
    label: '聚焦',
    key: 'target',
    icon: BiTargetLock
  },
  {
    label: '删除',
    key: 'remove',
    icon: BiTrash
  },
];

const DraggableTree: React.FC = () => {
  const [gData, setGData] = useState(defaultData);
  const [dragImg, setDragImage] = useState<any>()
  const [expandedKeys] = useState(['0-0', '0-0-0', '0-0-0-0']);

  const onDragEnter: TreeProps['onDragEnter'] = (info) => {
    console.log(info);
    // expandedKeys 需要受控时设置
    // setExpandedKeys(info.expandedKeys)
  };

  const onDrop: TreeProps['onDrop'] = (info) => {
    console.log(info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
      data: DataNode[],
      key: React.Key,
      callback: (node: DataNode, i: number, data: DataNode[]) => void,
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };
    const data = [...gData];

    // Find dragObject
    let dragObj: DataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      ((info.node as any).props.children || []).length > 0 && // Has children
      (info.node as any).props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar: DataNode[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!);
      } else {
        ar.splice(i! + 1, 0, dragObj!);
      }
    }
    setGData(data);
  };

  return (
    <StyledTree
      defaultExpandedKeys={expandedKeys}
      draggable={{ icon: false }}
      blockNode
      onDragEnter={onDragEnter}
      titleRender={(entity: any) => <TreeEntity entity={entity} />}
      onDrop={onDrop}
      treeData={gData}
    />
  );
};

function TreeEntity({
  entity
}: {
  entity: any
}) {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (flag: boolean) => {
    setOpen(flag);
  };

  return (
    <Dropdown
      open={open}
      onOpenChange={handleOpenChange}
      dropdownRender={() => (
        <Stack onClick={e => e.stopPropagation()} w="28" bg="gray.900" color="gray.100" borderRadius={4} p={1.5} spacing={0}>
          {menuItems.map(item =>
            <HStack
              p={1.5}
              align="center"
              borderRadius={4}
              cursor='pointer'
              fontSize="xs"
              _hover={{ bg: 'blue.500' }}
              key={item.key}
              onClick={() => setOpen(false)}
            >
              <Icon fontSize="md" as={item.icon}></Icon>
              <Heading as="span" fontSize="sm">{item.label}</Heading>
            </HStack>
          )}
        </Stack>
      )} trigger={['contextMenu']}
    >
      <HStack h="24px" align="center">
        <Icon fontSize="xs" as={BsBox}></Icon>
        <Heading fontSize="xs" noOfLines={1} as="span">{entity.title}</Heading>
      </HStack>
    </Dropdown>
  )
}

export default DraggableTree;