"use client";
import { createRef, PureComponent, ReactNode } from "react"
import { Engine, Scene, FreeCamera, HemisphericLight, Vector3, CreateSphere, ParticleSystem, Texture, Color4, ArcRotateCamera, CreateBox } from '@babylonjs/core';
import styles from './index.module.scss';
import Editor from "../Editor";

type IPreviewProps = {
  editor: Editor;
  onSceneMount: (scene: Scene) => void;
}

type IPreviewStates = {

}

export default class Preview extends PureComponent<IPreviewProps, IPreviewStates> {
  public renderCanvas = createRef<HTMLCanvasElement>();

  constructor(props: IPreviewProps) {
    super(props)
  }

  componentDidMount() {
    setTimeout(() => {
      this.init();
    }, 0);
  }

  public init() {
    if (this.props.editor.scene) { return; }

    // Associate a Babylon Engine to it.
    const engine = new Engine(this.renderCanvas.current);

    window.addEventListener("resize", () => {
      engine?.resize()
    });

    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Editor Camera", 0, 0, 5, Vector3.Zero(), scene);
    camera.attachControl(this.renderCanvas.current, true);
    const light = new HemisphericLight("Editor Light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    const sphere = CreateBox("Box", { size: 1 }, scene);
    sphere.position = Vector3.Zero();
    this.props.onSceneMount(scene);

    // Render every frame
    scene.getEngine().runRenderLoop(() => {
      scene.render();
    });
  }

  render(): ReactNode {
    return (
      <canvas ref={this.renderCanvas} className={styles.renderCanvas}></canvas>
    )
  }
}