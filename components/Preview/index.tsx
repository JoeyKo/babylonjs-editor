"use client";
import { createRef, PureComponent, ReactNode, useEffect, useRef } from "react"
import { Engine, Scene, FreeCamera, HemisphericLight, Vector3, CreateSphere, ParticleSystem, Texture, Color4 } from '@babylonjs/core';
import styles from './index.module.scss';
import { IEditor } from "@/app/page";

type IPreviewProps = {
  editor: IEditor;
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

    // Create our first scene.
    const scene = new Scene(engine);

    // This creates and positions a free camera (non-mesh)
    const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(this.renderCanvas.current, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    const sphere = CreateSphere("sphere1", { segments: 16, diameter: 2 }, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 2;
 
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