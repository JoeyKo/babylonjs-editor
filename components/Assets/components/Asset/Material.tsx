import Editor from "@/components/Editor";
import { SceneTools } from "@/components/Editor/scene/tools";
import { Nullable } from "@/utils/types";
import {
  AbstractMesh, ArcRotateCamera, Camera, HemisphericLight,
  Mesh, Scene, TargetCamera, Tools, Vector3, Animation, Color4, CubeTexture, MeshBuilder
} from "@babylonjs/core";
import { createRef, PureComponent, ReactNode } from "react"
import styles from './index.module.scss';
import "@babylonjs/loaders"
import { Stack, Text } from "@chakra-ui/react";
type IAssetMeshStates = {

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
      const { meshes } = await SceneTools.ImportMeshAsync("", this.props.filename, scene);

      scene.executeWhenReady(async () => {
        await new Promise<void>((resolve) => setTimeout(() => resolve(), 100));

        const minimum = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        const maximum = new Vector3(Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE);

        meshes.forEach((d) => {
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
    }
  }

  componentWillUnmount(): void {
    this.scene?.dispose();
    this.scene = null;
  }

  render(): ReactNode {
    return (
      <Stack spacing={1} w="100px" align="center" overflow={"hidden"}>
        <canvas className={styles.renderCanvas} ref={this.assetMeshCanvas}></canvas>
        <Text maxW={"100px"} fontSize={"xs"} noOfLines={1} textAlign="center">{this.props.name}</Text>
      </Stack>)
  }
}