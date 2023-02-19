"use client";
import { useEffect, useRef } from "react"
import { Engine, Scene, FreeCamera, HemisphericLight, Vector3, CreateSphere } from '@babylonjs/core';
import styles from './index.module.scss';

function Preview({
  onSceneMount
}: {
  onSceneMount: (scene: Scene) => void
}) {
  const renderCanvas = useRef<HTMLCanvasElement>(null);
  let { current: editorEngine } = useRef<Engine>(null);

  useEffect(() => {
    setTimeout(() => {
      init();
    }, 0);

    return () => {
      window.removeEventListener("resize", () => editorEngine?.resize());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function init() {
    if (editorEngine) { return; }
    
    // Associate a Babylon Engine to it.
    const engine = new Engine(renderCanvas.current);

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
    camera.attachControl(renderCanvas.current, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    const sphere = CreateSphere("sphere1", { segments: 16, diameter: 2 }, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 2;

    onSceneMount(scene);

    // Render every frame
    scene.getEngine().runRenderLoop(() => {
      scene.render();
    });

    editorEngine = engine;
  }

  return (
    <canvas ref={renderCanvas} className={styles.renderCanvas}></canvas>
  )
}

export default Preview;