import Editor from "@/components/Editor";
import { Nullable } from "@/utils/types";
import {
  HemisphericLight,
  Scene, TargetCamera, Vector3, Color4, CubeTexture, MeshBuilder, SceneLoader
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { createRef, PureComponent, ReactNode } from "react"
import { Box, Progress, Stack, Text } from "@chakra-ui/react";

type IAssetMeshStates = {
  loadedPercent: number;
}

type IAssetMeshProps = {
  editor: Editor;
  name: string;
  filename: File;
  onSceneMount: (scene: Scene) => void;
}


export default class AssetMesh extends PureComponent<IAssetMeshProps, IAssetMeshStates> {
  public editor: Editor;
  public assetMeshCanvas = createRef<HTMLCanvasElement>();
  public scene: Nullable<Scene> = null;

  constructor(props: IAssetMeshProps) {
    super(props);
    this.editor = props.editor;
  }

  async componentDidMount(): Promise<void> {
    if (this.scene) { return; }

    const engine = this.editor.assetRenderEngine;
    if (engine) {
      const scene = new Scene(engine);
      this.scene = scene;
      this.scene.clearColor = new Color4(0, 0, 0, 0);
      this.scene.defaultMaterial.backFaceCulling = false;

      const camera = new TargetCamera("AssetsHelperCamera", new Vector3(0, 0, 0), this.scene, true);
      camera.minZ = 0.1;

      new HemisphericLight("AssetsHelperLight", new Vector3(0, 1, 0), this.scene);
      const texture = CubeTexture.CreateFromPrefilteredData("/textures/studio.env", this.scene);
      this.scene.environmentTexture = texture;
      MeshBuilder.CreateSphere("MaterialsSphere", { segments: 32 }, this.scene);
    }
  }

  componentWillUnmount(): void {
    this.scene?.dispose();
    this.scene = null;
  }

  render(): ReactNode {
    return (
      <Stack pos="relative" spacing={1} w="100px" align="center" overflow={"hidden"}>
        <Box w="64px" h="64px" pos="relative">
          <canvas width={"100%"} height="100%" ref={this.assetMeshCanvas} />
          <Progress value={80} w="64px" size='xs' top="50%" transform={'translateY(-50%)'} pos={"absolute"} />
        </Box>
        <Text maxW={"100px"} fontSize={"xs"} noOfLines={1} textAlign="center">{this.props.name}</Text>
      </Stack>
    )
  }
}