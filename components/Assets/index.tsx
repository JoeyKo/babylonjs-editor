"use client"

import { Box, Wrap, WrapItem } from "@chakra-ui/react";
import { PureComponent, ReactNode } from "react";
import {
  Tree,
  ControlledTreeEnvironment,
  TreeItemIndex
} from "react-complex-tree";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Editor from "../Editor";
import { shortTree } from "../Nodes/data";
import PanelHeader from "../PanelHeader";
import RenderCanvas from "./RenderCanvas";
import styles from './index.module.css'
import { Color4, Scene } from "@babylonjs/core";

type INodesProps = {
  editor: Editor;
}

type INodesState = {
  focusedItem: TreeItemIndex | undefined;
  expandedItems: TreeItemIndex[];
  selectedItems: TreeItemIndex[];
  assets: any[];
}

export default class Assets extends PureComponent<INodesProps, INodesState> {
  public sceneInstances: { [key: string]: Scene } = {};
  constructor(props: INodesProps) {
    super(props);

    this.state = {
      focusedItem: undefined,
      expandedItems: [],
      selectedItems: [],
      assets: [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }, { id: "6" }]
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

  // Store each asset scene with id.
  public onSceneMount(id: string, scene: Scene) {
    this.sceneInstances[id] = scene;
  }

  // Update asset scene property
  public onAssetClick(id: string) {
    const scene = this.sceneInstances[id];
    if (scene) {
      scene.clearColor = Color4.FromHexString("#ddd333")
    }
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
            <Box h="100%" bg="gray.800">
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
            </Box>
          </Panel>
          <PanelResizeHandle className={styles.ResizeHandle} />
          <Panel>
            <Box height="calc(100% - 32px)" overflow={"auto"}>
              <Wrap p={2} spacing={2}>
                {this.state.assets.map(asset => (
                  <WrapItem onClick={() => this.onAssetClick(asset.id)} key={asset.id} alignItems="center" justifyContent="center" w="100px" height="100px">
                    <RenderCanvas
                      editor={this.props.editor}
                      onSceneMount={scene => this.onSceneMount(asset.id, scene)}
                    />
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          </Panel>
        </PanelGroup>

      </Box >
    )
  }
}