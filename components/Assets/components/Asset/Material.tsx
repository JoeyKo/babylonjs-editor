import Editor from "@/components/Editor";
import { Nullable } from "@/utils/types";
import {
  HemisphericLight,
  Scene, TargetCamera, Vector3, Color4, MeshBuilder, Material, ArcRotateCamera
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { createRef, PureComponent, ReactNode } from "react"
import { Box, Progress, Stack, Text } from "@chakra-ui/react";

type IAssetMeshStates = {
  loadedPercent: number;
  loaded: boolean,
}

type IAssetMeshProps = {
  editor: Editor;
  name: string;
  filename: any;
  onSceneMount: (scene: Scene) => void;
}


export default class AssetMaterial extends PureComponent<IAssetMeshProps, IAssetMeshStates> {
  public editor: Editor;
  public assetMaterialCanvas = createRef<HTMLCanvasElement>();
  public scene: Nullable<Scene> = null;

  constructor(props: IAssetMeshProps) {
    super(props);
    this.editor = props.editor;

    this.state = {
      loadedPercent: 0,
      loaded: false,
    }
  }

  async componentDidMount(): Promise<void> {
    if (this.scene) { return; }

    const engine = this.editor.assetRenderEngine;
    if (engine) {
      const scene = new Scene(engine);
      this.scene = scene;
      this.scene.clearColor = new Color4(0, 0, 0, 0);
      this.scene.defaultMaterial.backFaceCulling = false;

      new HemisphericLight("AssetsHelperLight", new Vector3(0, 1, 0), this.scene);

      this.setState({ loadedPercent: 50 })
      const sphere = MeshBuilder.CreateSphere("MaterialsSphere", { segments: 32 }, this.scene);

      const material = Material.Parse(this.props.filename, this.scene, "")
      sphere.material = material;

      this.setState({ loadedPercent: 100, loaded: true })

      scene.freezeActiveMeshes();
      scene.freezeMaterials();

      const camera = this.initCamera(scene);

      const boundingInfo = sphere.getHierarchyBoundingVectors(true);
      const sizeVec = boundingInfo.max.subtract(boundingInfo.min);
      const halfSizeVec = sizeVec.scale(0.5);
      const center = boundingInfo.min.add(halfSizeVec);

      camera.setTarget(center);

      const sceneDiagonalLenght = sizeVec.length();
      if (isFinite(sceneDiagonalLenght)) {
        camera.upperRadiusLimit = sceneDiagonalLenght * 4;
      }

      if (this.assetMaterialCanvas.current) {
        const view = engine.registerView(this.assetMaterialCanvas.current, camera);

        engine.runRenderLoop(() => {
          if (engine.activeView?.target === view?.target) {
            scene.render()
          }
        });

        this.assetMaterialCanvas.current.setAttribute('width', "64px")
        this.assetMaterialCanvas.current.setAttribute('height', "64px")
        this.props.onSceneMount(scene);
      }
    }
  }

  public initCamera(scene: Scene) {
    const worldExtends = scene.getWorldExtends();
    const worldSize = worldExtends.max.subtract(worldExtends.min);
    const worldCenter = worldExtends.min.add(worldSize.scale(0.5));

    let radius = worldSize.length() * 1.5;
    // empty scene scenario!
    if (!isFinite(radius)) {
      radius = 1;
      worldCenter.copyFromFloats(0, 0, 0);
    }

    const arcRotateCamera = new ArcRotateCamera("default camera", -(Math.PI / 2), Math.PI / 4, radius, worldCenter, scene);
    arcRotateCamera.lowerRadiusLimit = radius * 0.01;
    arcRotateCamera.wheelPrecision = 100 / radius;
    const camera = arcRotateCamera;

    camera.minZ = radius * 0.01;
    camera.maxZ = radius * 1000;
    camera.speed = radius * 0.2;

    return camera
  }

  componentWillUnmount(): void {
    this.scene?.dispose();
    this.scene = null;
  }

  render(): ReactNode {
    return (
      <Stack pos="relative" spacing={1} w="100px" align="center" overflow={"hidden"}>
        <Box w="64px" h="64px">
          <canvas width={"100%"} height="100%" ref={this.assetMaterialCanvas} />
          <Progress value={this.state.loadedPercent}
            hidden={this.state.loaded} w="64px" size='xs' top="50%" transform={'translateY(-50%)'} pos={"absolute"} />
        </Box>
        <Text maxW={"100px"} fontSize={"xs"} noOfLines={1} textAlign="center">{this.props.name}</Text>
      </Stack>
    )
  }
}