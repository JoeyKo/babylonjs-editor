import { Nullable } from "@/lib/types";
import { ArcRotateCamera, MeshBuilder, Scene, Tools, Vector3 } from "@babylonjs/core";
import { useEffect, useRef } from "react"
import styles from './index.module.scss';

function RenderCanvas({
  scene
}: {
  scene: Nullable<Scene>
}) {
  const renderCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (scene) {
      const camera = new ArcRotateCamera("camera" + Tools.RandomId(), 0, 0.8, 5, Vector3.Zero(), scene);
      camera.setTarget(Vector3.Zero());

      const box = MeshBuilder.CreateBox("Box", { size: 1 }, scene);
      box.position.y = 0.5;

      if (renderCanvas.current) {
        const view = scene.getEngine().registerView(renderCanvas.current, camera);
        console.log(view)
      }

      setTimeout(() => {
        scene.render();
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <canvas className={styles.renderCanvas} ref={renderCanvas}></canvas>
}

export default RenderCanvas;