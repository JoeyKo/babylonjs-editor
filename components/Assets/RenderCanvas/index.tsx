import Editor from "@/components/Editor";
import { Nullable } from "@/lib/types";
import { ArcRotateCamera, HemisphericLight, MeshBuilder, Scene, Tools, Vector3 } from "@babylonjs/core";
import { createRef, PureComponent, ReactNode } from "react"
import styles from './index.module.scss';

type IAssetRenderCanvasStates = {

}

type IAssetRenderCanvasProps = {
  editor: Editor;
  onSceneMount: (scene: Scene) => void;
}


export default class AssetRenderCanvas extends PureComponent<IAssetRenderCanvasProps, IAssetRenderCanvasStates> {
  public editor: Editor;
  public assetRenderCanvas = createRef<HTMLCanvasElement>();
  public scene: Nullable<Scene> = null;

  constructor(props: IAssetRenderCanvasProps) {
    super(props);
    this.editor = props.editor;
  }

  componentDidMount(): void {
    if (this.scene) { return; }

    const engine = this.editor.assetRenderEngine;
    if (engine) {
      const scene = new Scene(engine);
      this.scene = scene;

      const light = new HemisphericLight("Asset Render Light", new Vector3(0, 1, 0), scene);
      light.intensity = 0.7;

      const camera = new ArcRotateCamera("Asset Render Camera" + Tools.RandomId(), 0, 0.8, 5, new Vector3(Math.random(), Math.random(), Math.random()), scene);
      camera.setTarget(new Vector3(Math.random(), Math.random(), Math.random()));

      const box = MeshBuilder.CreateBox("Box", { size: Math.random() }, scene);
      box.position.y = Math.random();

      if (this.assetRenderCanvas.current) {
        const view = engine.registerView(this.assetRenderCanvas.current, camera);
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
    return <canvas className={styles.renderCanvas} ref={this.assetRenderCanvas}></canvas>
  }
}