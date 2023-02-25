"use client"

import { IEditor } from "@/app/page";
import { Box } from "@chakra-ui/react";
import { PureComponent, ReactNode } from "react";
import {
  Tree,
  ControlledTreeEnvironment,
  TreeItemIndex
} from "react-complex-tree";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { shortTree } from "../Nodes/data";
import PanelHeader from "../PanelHeader";
import appStyles from '../../app/page.module.css'

type INodesProps = {
  editor: IEditor;
}

type INodesState = {
  focusedItem: TreeItemIndex | undefined;
  expandedItems: TreeItemIndex[];
  selectedItems: TreeItemIndex[];
}

export default class Assets extends PureComponent<INodesProps, INodesState> {
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
      <Box h="100%">
        <PanelGroup direction="horizontal">
          <Panel
            collapsible={true}
            defaultSize={20}
            maxSize={30}
            minSize={10}
          >
            <PanelHeader title="资源" />
            <ControlledTreeEnvironment
              items={shortTree.items}
              getItemTitle={item => item.data}
              viewState={{
                ['tree-assets']: {
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
              <Tree treeId="tree-assets" rootItem="root" treeLabel="Assets" />
            </ControlledTreeEnvironment>
          </Panel>
          <PanelResizeHandle className={appStyles.ResizeHandle} />
          <Panel>

          </Panel>
        </PanelGroup>

      </Box >
    )
  }
}