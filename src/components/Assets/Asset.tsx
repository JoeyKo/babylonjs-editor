import { PickingInfo, Scene, SceneLoader, Vector3, SceneSerializer, AbstractMesh } from "@babylonjs/core";
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
import FileAPI from "@/api/file";
import AssetMaterial from "./components/Asset/Material";
import AssetBianry from "./components/Asset/Binary";

export enum IAssetType {
  MODELSROUCE = 'modelSource',
  MODEL = 'model',
  MESH = 'mesh',
  MATERIAL = 'material',
  TEXTURE = 'texture',
  BINARY = 'binary',
}

export interface IAsset {
  id: string;
  name: string;
  filename?: any;
  type: IAssetType
}

interface IAssetsProps {
  editor: Editor;
}

interface IAssetsState {
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

// TODO: 初次加载只渲染当前页面下的mesh material
export default class Assets extends PureComponent<IAssetsProps, IAssetsState> {
  public sceneInstances: { [key: string]: Scene } = {};
  public editor: Editor;
  private _dropListener: Nullable<(ev: DragEvent) => void> = null;

  constructor(props: IAssetsProps) {
    super(props);

    this.editor = props.editor;

    this.state = {
      assets: [],
      isContextMenuOpen: false,
    }
  }

  // Store each asset scene with id.
  public onAssetLoaded = (asset: IAsset, scene: Scene) => {
    this.sceneInstances[asset.id] = scene;
  }

  // Update asset scene property
  public onAssetClick = (asset: IAsset) => {
    const scene = this.sceneInstances[asset.id];
    if (scene) {
      console.log("selected asset scene: ", scene)
    }
  }

  public onFilesUpload = async (files: File[]) => {
    if (files.length === 0) { return; }

    // Upload files
    const formdata = new FormData();
    files.forEach(file => formdata.append('files', file));
    const filesRes = await FileAPI.uploadFiles(formdata);

    const pendingAssets: IAsset[] = [];

    for (const name in filesRes) {
      const modelSources = filesRes[name].modelSources ?? [];
      const meshes = filesRes[name].meshes ?? [];
      const materials = filesRes[name].materials ?? [];
      const textures = filesRes[name].textures ?? [];
      const binaries = filesRes[name].binaries ?? [];
   
      for (const modelSource of modelSources) {
        pendingAssets.push({
          id: Tools.RandomId(),
          name: modelSource.name,
          type: IAssetType.MODELSROUCE
        })
      }

      for (const mesh of meshes) {
        delete mesh.meshes[0].materialId;
        const Nfile = new File([JSON.stringify(mesh)], mesh.meshes[0].name + ".babylon");

        pendingAssets.push({
          id: Tools.RandomId(),
          name: mesh.meshes[0].name,
          filename: Nfile,
          type: IAssetType.MESH
        })
      }

      for (const material of materials) {
        pendingAssets.push({
          id: Tools.RandomId(),
          name: material.name,
          filename: material,
          type: IAssetType.MATERIAL
        })
      }

      for (const texture of textures) {
        pendingAssets.push({
          id: Tools.RandomId(),
          name: texture.name,
          filename: texture.url,
          type: IAssetType.TEXTURE
        })
      }

      for (const binary of binaries) {
        pendingAssets.push({
          id: Tools.RandomId(),
          name: binary.name,
          type: IAssetType.BINARY
        })
      }
    }

    this.setState(prevState => {
      return {
        assets: [...prevState.assets, ...pendingAssets]
      }
    });
  }

  public async addOrUpdateMeshesInScene(asset: IAsset, pickInfo?: PickingInfo) {
    import("@babylonjs/loaders");

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

  public dragStart = (item: IAsset) => {
    this._dropListener = this._getDropListener(item);
    this.editor.scene?.getEngine().getRenderingCanvas()?.addEventListener("drop", this._dropListener);
  }

  public dragEnd = () => {
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
                  <AssetItem
                    draggable={asset.type === IAssetType.MODEL || asset.type === IAssetType.MATERIAL}
                    key={asset.id}
                    editor={this.props.editor}
                    asset={asset}
                    onClick={this.onAssetClick}
                    onLoaded={this.onAssetLoaded}
                    dragStart={this.dragStart}
                    dragEnd={this.dragEnd}
                  />
                ))}
              </Wrap>
            </Box>
          </Panel>
        </PanelGroup>
      </Box >
    )
  }
}

interface IAssetProps {
  draggable: boolean;
  editor: Editor;
  asset: IAsset;
  onLoaded: (asset: IAsset, scene: Scene) => void;
  onClick: (asset: IAsset) => void;
  dragStart: (asset: IAsset) => void;
  dragEnd: () => void;
}

interface IAssetState {
  isContextMenuOpen: boolean;
}

class AssetItem extends PureComponent<IAssetProps, IAssetState>{
  constructor(props: IAssetProps) {
    super(props);

    this.state = {
      isContextMenuOpen: false
    }
  }

  private _handleContextMenuOpenChange = (isOpen: boolean) => {
    this.setState({ isContextMenuOpen: isOpen })
  }

  render(): ReactNode {
    const { draggable, asset, onLoaded, onClick, dragStart, dragEnd } = this.props;
    return (
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
          onClick={() => onClick(asset)}
          draggable={draggable}
          onDragStart={() => dragStart(asset)}
          onDragEnd={() => dragEnd()}
        >
          {IAssetType.MESH === asset.type ?
            <AssetMesh
              name={asset.name}
              filename={asset.filename}
              editor={this.props.editor}
              onLoaded={scene => onLoaded(asset, scene)}
            /> :
            (IAssetType.MATERIAL === asset.type ?
              <AssetMaterial
                name={asset.name}
                filename={asset.filename}
                editor={this.props.editor}
                onLoaded={scene => onLoaded(asset, scene)}
              /> : 
              (IAssetType.TEXTURE === asset.type ? 
                <AssetTexture name={asset.name} filename={asset.filename} />
                : <AssetBianry name={asset.name} type={asset.type} />))}
        </WrapItem>
      </Dropdown>
    )
  }
}