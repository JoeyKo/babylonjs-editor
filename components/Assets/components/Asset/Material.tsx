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
      SceneLoader.ImportMesh("", "", this.props.filename, scene, () => {
        scene.executeWhenReady(async () => {
          await new Promise<void>((resolve) => setTimeout(() => resolve(), 100));

          const minimum = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
          const maximum = new Vector3(Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE);

          scene.meshes.forEach((d) => {
            const scaling = Vector3.Zero();
            d.getWorldMatrix().decompose(scaling, undefined, undefined);

            const bMinimum = d.getBoundingInfo()?.minimum.multiply(scaling);
            const bMaximum = d.getBoundingInfo()?.maximum.multiply(scaling);

            if (!bMinimum || !bMaximum) { return; }

            maximum.x = Math.max(bMaximum.x, maximum.x);
            maximum.y = Math.max(bMaximum.y, maximum.y);
            maximum.z = Math.max(bMaximum.z, maximum.z);

            minimum.x = Math.min(bMinimum.x, minimum.x);
            minimum.y = Math.min(bMinimum.y, minimum.y);
            minimum.z = Math.min(bMinimum.z, minimum.z);
          });

          const center = Vector3.Center(minimum, maximum);
          const distance = Vector3.Distance(minimum, maximum) * 0.5;

          camera.position = center.add(new Vector3(distance, distance, distance));
          camera.setTarget(center);

          if (this.assetMeshCanvas.current) {
            const view = engine.registerView(this.assetMeshCanvas.current, camera);

            engine.runRenderLoop(() => {
              if (engine.activeView?.target === view?.target) {
                scene.render()
              }
            });

            this.props.onSceneMount(scene);
          }
        });

        scene._checkIsReady();
      }, evt => {
        let loadedPercent: number = 0;
        if (evt.lengthComputable) {
          loadedPercent = +(evt.loaded * 100 / evt.total).toFixed();
        } else {
          const dlCount = evt.loaded / (1024 * 1024);
          loadedPercent = Math.floor(dlCount * 100.0) / 100.0;
        }
        this.setState({ loadedPercent });
      });
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