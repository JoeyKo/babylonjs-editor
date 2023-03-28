"use client";

import { createRef, PureComponent, ReactNode } from "react"
import { Engine, Scene, HemisphericLight, Vector3, ArcRotateCamera, CreateBox, Observable } from '@babylonjs/core';
import Editor from "../Editor";
import { Box } from "@chakra-ui/react";
import Toolbar from "./components/Toolbar";
import styles from './index.module.scss';
import { ScenePicker } from "../Editor/scene/picker";
import { GizmoType, SceneGizmo } from "../Editor/scene/gizmo";
import { Nullable } from "@/utils/types";

export enum PreviewCanvasEventType {
  /**
   * Defines the event raised when the preview canvas is focused.
   */
  Focused = 0,
  /**
   * Defines the vent raised when the preview canvas is blurred.
   */
  Blurred,
}

type IPreviewProps = {
  editor: Editor;
  onSceneMount: (scene: Scene) => void;
}

type IPreviewStates = {
  gizmoType: GizmoType;
  canvasFocused: boolean;
  overNodeName: string;
}

export default class Preview extends PureComponent<IPreviewProps, IPreviewStates> {
  public renderCanvas = createRef<HTMLCanvasElement>();
  public picker: Nullable<ScenePicker> = null;
  public gizmo: Nullable<SceneGizmo> = null;
  public onCanvasEventObservable: Observable<PreviewCanvasEventType> = new Observable<PreviewCanvasEventType>();

  private _editor: Editor;

  constructor(props: IPreviewProps) {
    super(props);

    this._editor = props.editor;

    this._editor.preview = this;

    this.state = {
      gizmoType: GizmoType.None,
      canvasFocused: false,
      overNodeName: ''
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.init();
    }, 0);
    
    this._editor.editorInitializedObservable.addOnce(() => this._createPicker());
  }

  public init() {
    if (this.props.editor.scene) { return; }

    // Associate a Babylon Engine to it.
    const engine = new Engine(this.renderCanvas.current, false, {}, false);

    window.addEventListener("resize", () => {
      engine?.resize()
    });

    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Editor Camera", 0, 0, 5, Vector3.Zero(), scene);
    camera.minZ = 0.1;
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
      <Box h="100%" pos={'relative'}>
        <Box
          p="2"
          bg="gray.800"
          pos={"absolute"}
          borderRadius={2}
          top={2}
          left="50%"
          transform={"translateX(-50%)"}
        >
          <Toolbar editor={this._editor} gizmoType={this.state.gizmoType} />
        </Box>
        <canvas ref={this.renderCanvas} className={styles.renderCanvas}></canvas>
      </Box>
    )
  }

  /**
   * Creates the scene picker.
   */
  private _createPicker(): void {
    this.picker = new ScenePicker(this._editor);
    this.picker.onNodeOver.add((n) => {
      this.setState({ overNodeName: n.name });
    });

    this.gizmo = new SceneGizmo(this._editor);

    this._bindEvents();
  }

  /**
   * Binds the events.
   */
  private _bindEvents(): void {
    const canvas = this._editor.scene?.getEngine().getRenderingCanvas();
    if (!canvas) { return; }

    canvas.addEventListener("mouseenter", () => {
      this.setState({ canvasFocused: true });
      this.onCanvasEventObservable.notifyObservers(PreviewCanvasEventType.Focused);
    });
    canvas.addEventListener("mouseleave", () => {
      this.setState({ canvasFocused: false });
      this.picker?.canvasBlur();
      this.onCanvasEventObservable.notifyObservers(PreviewCanvasEventType.Blurred);
    });
  }

  /**
    * Sets the new gizmo type to be used in the preview.
    * If the given gizmo type is the same as the current, it just sets the current type as "None".
    * @param gizmoType the new type of gizmo to be used in the preview.
    */
  public setGizmoType(gizmoType: GizmoType): void {
    if (this.state.gizmoType === gizmoType) { gizmoType = GizmoType.None; }

    this.gizmo!.gizmoType = gizmoType;
    this.setState({ gizmoType });
  }
}