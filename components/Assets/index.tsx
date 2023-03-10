"use client"

import { Color4, Scene } from "@babylonjs/core";
import { Box, Wrap, WrapItem } from "@chakra-ui/react";
import { PureComponent, ReactNode } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Editor from "../Editor";
import PanelHeader from "../PanelHeader";
import DraggableTree from "../DraggableTree";
import AssetsToolbar from "./components/Toolbar";
import styles from './index.module.css';
import Tools from "../Editor/tools/tools";
import AssetMesh from "./components/Asset/Mesh";
import AssetTexture from "./components/Asset/Texture";

export interface IAsset {
  id: string;
  name: string;
  filename: File;
  extension: string;
}

interface INodesProps {
  editor: Editor;
}

interface INodesState {
  assets: IAsset[];
}

export default class Assets extends PureComponent<INodesProps, INodesState> {
  public sceneInstances: { [key: string]: Scene } = {};

  constructor(props: INodesProps) {
    super(props);

    this.state = {
      assets: []
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
      console.log("Selected scene: ", scene)
    }
  }

  public onFilesUpload = (files: File[]) => {
    const assets = this.state.assets;
    this.setState({
      assets: [...assets, ...files.map(file => {
        return {
          id: Tools.RandomId(),
          name: file.name,
          filename: file,
          extension: Tools.GetFileExtension(file.name).toLowerCase()
        }
      })]
    })
  }

  render(): ReactNode {
    return (
      <Box h="100%">
        <PanelHeader title="资源" content={<AssetsToolbar onUpload={this.onFilesUpload} />} />
        <PanelGroup direction="horizontal">
          <Panel
            collapsible={false}
            defaultSize={18}
            maxSize={30}
            minSize={12}
          >
            <Box h="100%">
              <DraggableTree />
            </Box>
          </Panel>
          <PanelResizeHandle className={styles.ResizeHandle} />
          <Panel>
            <Box height="calc(100% - 32px)" overflow={"auto"}>
              <Wrap p={2} spacing={2}>
                {this.state.assets.map(asset => (
                  <WrapItem onClick={() => this.onAssetClick(asset.id)} key={asset.id} alignItems="center" justifyContent="center" w="100px" height="100px">
                    {AssetMesh.MESH_EXTENSIONS.includes(asset.extension) ?
                      <AssetMesh
                        name={asset.name}
                        filename={asset.filename}
                        editor={this.props.editor}
                        onSceneMount={scene => this.onSceneMount(asset.id, scene)}
                      /> : <AssetTexture name={asset.name} filename={asset.filename} />}
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