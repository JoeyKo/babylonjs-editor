import Editor from "@/components/Editor";
import { SceneTools } from "@/components/Editor/scene/tools";
import { Nullable } from "@/utils/types";
import { ArcRotateCamera, HemisphericLight, Scene, Tools, Vector3 } from "@babylonjs/core";
import { createRef, PureComponent, ReactNode } from "react"
import styles from './index.module.scss';
import "@babylonjs/loaders"
type IAssetMeshStates = {

}

type IAssetMeshProps = {
  editor: Editor;
  filename: File;
  onSceneMount: (scene: Scene) => void;
}


export default class AssetMesh extends PureComponent<IAssetMeshProps, IAssetMeshStates> {
  public static MESH_EXTENSIONS: string[] = [
    ".fbx",
    ".gltf", ".glb",
    ".babylon",
    ".obj", ".stl",
  ];
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

      const light = new HemisphericLight("Asset Render Light", new Vector3(0, 1, 0), scene);
      light.intensity = 0.7;

      const camera = new ArcRotateCamera("Asset Render Camera" + Tools.RandomId(), 0, 0.8, 5, new Vector3(Math.random(), Math.random(), Math.random()), scene);
      camera.setTarget(new Vector3(Math.random(), Math.random(), Math.random()));

      await SceneTools.ImportMeshAsync("", this.props.filename, scene);
      scene.stopAllAnimations();
      
      if (this.assetMeshCanvas.current) {
        const view = engine.registerView(this.assetMeshCanvas.current, camera);
        engine.runRenderLoop(() => {
          if (engine.activeView?.target === view?.target) {
            scene.render()
          }
        });
      }

      this.props.onSceneMount(scene);
    }
  }

  componentWillUnmount(): void {
    this.scene?.dispose();
    this.scene = null;
  }

  render(): ReactNode {
    return <canvas className={styles.renderCanvas} ref={this.assetMeshCanvas}></canvas>
  }
}