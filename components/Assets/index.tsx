"use client"

import { Box, Wrap, WrapItem } from "@chakra-ui/react";
import { PureComponent, ReactNode } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Editor from "../Editor";
import PanelHeader from "../PanelHeader";
import RenderCanvas from "./RenderCanvas";
import styles from './index.module.css'
import { Color4, Scene } from "@babylonjs/core";

type INodesProps = {
  editor: Editor;
}

type INodesState = {
  assets: any[];
}

export default class Assets extends PureComponent<INodesProps, INodesState> {
  public sceneInstances: { [key: string]: Scene } = {};
  constructor(props: INodesProps) {
    super(props);

    this.state = {
      assets: [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }, { id: "6" }]
    }
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