"use client"

import { Box, SimpleGrid } from "@chakra-ui/react";
import { PureComponent, ReactNode } from "react";
import {
  Tree,
  ControlledTreeEnvironment,
  TreeItemIndex
} from "react-complex-tree";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { shortTree } from "../Nodes/data";
import PanelHeader from "../PanelHeader";
import styles from './index.module.css'
import { IEditor } from "../Editor";
import RenderCanvas from "./RenderCanvas";

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
        <PanelHeader title="资源" />
        <PanelGroup direction="horizontal">
          <Panel
            collapsible={false}
            defaultSize={18}
            maxSize={30}
            minSize={12}
          >
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
          <PanelResizeHandle className={styles.ResizeHandle} />
          <Panel>
            <Box height="100%" overflow={"auto"}>
              <SimpleGrid m={2} columns={6} spacing={2}>
                {
                  [1, 2, 3, 4, 5, 6].map((id: number) => (
                    <Box key={id} height="120px"><RenderCanvas scene={this.props.editor.assetScene} /></Box>
                  ))
                }
              </SimpleGrid>
            </Box>
          </Panel>
        </PanelGroup>

      </Box >
    )
  }
}