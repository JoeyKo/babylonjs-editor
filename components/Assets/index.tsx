"use client"

import { PickingInfo, Scene, SceneLoader, Vector3 } from "@babylonjs/core";
import { Box, Heading, HStack, Icon, Stack, Wrap, WrapItem } from "@chakra-ui/react";
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
import { Nullable } from "@/utils/types";
import { Dropdown } from "antd";
import { BiDuplicate, BiTrash } from "react-icons/bi";

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
  isContextMenuOpen: boolean;
}

const menuItems: any[] = [
  {
    label: '复制',
    key: 'clone',
    icon: BiDuplicate
  },
  {
    label: '删除',
    key: 'remove',
    icon: BiTrash
  },
];
export default class Assets extends PureComponent<INodesProps, INodesState> {
  public sceneInstances: { [key: string]: Scene } = {};
  public editor: Editor;
  private _dropListener: Nullable<(ev: DragEvent) => void> = null;

  constructor(props: INodesProps) {
    super(props);

    this.editor = props.editor;

    this.state = {
      assets: [],
      isContextMenuOpen: false,
    }
  }

  // Store each asset scene with id.
  public onSceneMount(id: string, scene: Scene) {
    this.sceneInstances[id] = scene;
  }

  // Update asset scene property
  public onAssetClick(asset: IAsset) {
    const scene = this.sceneInstances[asset.id];
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

  public async addOrUpdateMeshesInScene(asset: IAsset, pickInfo?: PickingInfo) {
    import("@babylonjs/loaders");

    const extension = Tools.GetFileExtension(asset.name).toLowerCase();
    const isGltf = extension === ".glb" || extension === ".gltf";

    // Load and stop all animations
    const result = await SceneLoader.ImportMeshAsync("", "", asset.filename, this.editor.scene!);
    this.editor.scene!.stopAllAnimations();

    for (const mesh of result.meshes) {
      // Place mesh
      if (!mesh.parent && pickInfo?.pickedPoint) {
        mesh.position.addInPlace(pickInfo.pickedPoint);
      }

      mesh.id = Tools.RandomId();
    }
  }

  public dragStart(item: IAsset) {
    this._dropListener = this._getDropListener(item);
    this.editor.scene?.getEngine().getRenderingCanvas()?.addEventListener("drop", this._dropListener);
  }

  public dragEnd() {
    this.editor.scene?.getEngine().getRenderingCanvas()?.removeEventListener("drop", this._dropListener!);
    this._dropListener = null;
  }

  private _getDropListener(item: IAsset): (ev: DragEvent) => void {
    return (ev: DragEvent) => {
      const pick = this.editor.scene!.pick(
        ev.offsetX,
        ev.offsetY,
        undefined,
        false,
      );
      if (!pick) { return; }
      if (!pick.pickedMesh) { pick.pickedPoint = Vector3.Zero(); }

      this.addOrUpdateMeshesInScene(item, pick);
    };
  }

  private _handleContextMenuOpenChange = (isOpen: boolean) => {
    this.setState({ isContextMenuOpen: isOpen })
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
                  <Dropdown
                    key={asset.id}
                    open={this.state.isContextMenuOpen}
                    onOpenChange={this._handleContextMenuOpenChange}
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
                            onClick={() => this.setState({ isContextMenuOpen: false })}
                          >
                            <Icon fontSize="md" as={item.icon}></Icon>
                            <Heading as="span" fontSize="sm">{item.label}</Heading>
                          </HStack>
                        )}
                      </Stack>
                    )} trigger={['contextMenu']}>
                    <WrapItem
                      w="100px"
                      height="100px"
                      justifyContent="center"
                      alignItems="center"
                      cursor={"pointer"}
                      _hover={{
                        bg: 'gray.900'
                      }}
                      onClick={() => this.onAssetClick(asset)}
                      draggable
                      onDragStart={(e) => this.dragStart(asset)}
                      onDragEnd={(e) => this.dragEnd()}
                    >

                      {AssetMesh.MESH_EXTENSIONS.includes(asset.extension) ?
                        <AssetMesh
                          name={asset.name}
                          filename={asset.filename}
                          editor={this.props.editor}
                          onSceneMount={scene => this.onSceneMount(asset.id, scene)}
                        /> : <AssetTexture name={asset.name} filename={asset.filename} />}
                    </WrapItem>
                  </Dropdown>
                ))}
              </Wrap>
            </Box>
          </Panel>
        </PanelGroup>
      </Box >
    )
  }
}