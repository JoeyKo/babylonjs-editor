"use client"

import { Box } from "@chakra-ui/react";
import { PureComponent, ReactNode } from "react";
import {
  Tree,
  ControlledTreeEnvironment,
  TreeItemIndex
} from "react-complex-tree";
import Editor from "../Editor";
import PanelHeader from "../PanelHeader";
import { longTree, shortTree } from "./data";

type INodesProps = {
  editor: Editor;
}

type INodesState = {
  focusedItem: TreeItemIndex | undefined;
  expandedItems: TreeItemIndex[];
  selectedItems: TreeItemIndex[];
}

export default class Nodes extends PureComponent<INodesProps, INodesState> {
  constructor(props: INodesProps) {
    super(props);

    this.state = {
      focusedItem: undefined,
      expandedItems: [],
      selectedItems: []
    }
  }

  public setFocusedItem(item: TreeItemIndex) {
    this.setState({ focusedItem: item });
  }

  public setExpandedItems(items: TreeItemIndex[]) {
    this.setState({ expandedItems: items })
  }

  public setSelectedItems(items: TreeItemIndex[]) {
    this.setState({ selectedItems: items })
  }

  render(): ReactNode {
    const { focusedItem, expandedItems, selectedItems } = this.state;
    return (
      <Box>
        <PanelHeader title="层级" />
        <ControlledTreeEnvironment
          items={longTree.items}
          getItemTitle={item => item.data}
          viewState={{
            ['tree-nodes']: {
              focusedItem,
              expandedItems,
              selectedItems,
            },
          }}
          onFocusItem={item => this.setFocusedItem(item.index)}
          onExpandItem={item => this.setExpandedItems([...expandedItems, item.index])}
          onCollapseItem={item =>
            this.setExpandedItems(expandedItems.filter(expandedItemIndex => expandedItemIndex !== item.index))
          }
          onSelectItems={items => this.setSelectedItems(items)}
        >
          <Tree treeId="tree-nodes" rootItem="root" treeLabel="Nodes" />
        </ControlledTreeEnvironment>
      </Box >
    )
  }
}