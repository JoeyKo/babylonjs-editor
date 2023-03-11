"use client";

import Editor from "@/components/Editor";
import { Nullable } from "@/utils/types";
import {
  HemisphericLight,
  Scene, Vector3, Color4, CubeTexture, SceneLoader,
  BRDFTextureTools,
  ArcRotateCamera,
  AbstractMesh,
  Tags
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { createRef, PureComponent, ReactNode } from "react"
import { Box, Progress, Stack, Text } from "@chakra-ui/react";
import { SceneUtils } from "@/components/Editor/scene/utils";
import { MdShapeLine } from "react-icons/md";

type IAssetMeshStates = {
  loadedPercent: number;
  loaded: boolean;
}

type IAssetMeshProps = {
  editor: Editor;
  name: string;
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
  public sceneUtils: Nullable<SceneUtils> = null;
  public rootMesh: Nullable<AbstractMesh> = null;
  private _pivotMesh: Nullable<AbstractMesh> = null;

  constructor(props: IAssetMeshProps) {
    super(props);
    this.editor = props.editor;
    this.state = {
      loadedPercent: 0,
      loaded: false,
    }

  }

  componentDidMount(): void {
    if (this.scene) { return; }

    const engine = this.editor.assetRenderEngine;
    if (engine) {
      const scene = new Scene(engine);

      this.scene = scene;
      this.scene.clearColor = new Color4(0, 0, 0, 0);
      this.scene.defaultMaterial.backFaceCulling = false;

      const light = new HemisphericLight("AssetsHelperLight", new Vector3(0, 1, 0), this.scene);
      light.doNotSerialize = true;

      const envTexture = CubeTexture.CreateFromPrefilteredData("/textures/studio.env", this.scene);
      envTexture.name = "studio env"
      this.scene.environmentTexture = envTexture;

      SceneLoader.ImportMesh("", "", this.props.filename, scene, async (meshes, particleSystems, skeletons, animationGroups, transformNodes, geometries, lights) => {
        animationGroups.forEach(animationGroup => animationGroup.stop())
        // console.log(scene.meshes
        //   .filter((m) => !m._masterMesh))
        // const materials = scene.materials;
        // const textures = scene.textures;
        // console.log(transformNodes.map(transformNode => transformNode.serialize()))
        // // console.log(geometries.map(geometry => geometry.serialize()))
        // console.log(geometries.map(geometry => geometry.serializeVerticeData())) // extract geometreis files
        // console.log(meshes.map(mesh => mesh.serialize()))
        // console.log(materials.filter(material => material !== scene.defaultMaterial).map(material => material.serialize()))
        // console.log(textures.filter(texture => texture !== envTexture && texture !== BRDFTextureTools.GetEnvironmentBRDFTexture(scene)).map(material => material.serialize()))

        // meshes
        // delete m.geometryUniqueId;
        // delete m.materialUniqueId;

        scene.executeWhenReady(async () => {
          await new Promise<void>((resolve) => setTimeout(() => resolve(), 100));

          this.setState({ loaded: true });

          this.rootMesh = new AbstractMesh("assetRootMesh", scene);
          this._pivotMesh = new AbstractMesh("pivotMesh", scene);

          this._pivotMesh.parent = this.rootMesh;
          // rotate 180, gltf fun
          this._pivotMesh.rotation.y += Math.PI;

          meshes.forEach((mesh) => {
            if (!mesh.parent) {
              mesh.parent = this._pivotMesh;
            }
          });

          const camera = this.initCamera(scene);

          const boundingInfo = this.rootMesh.getHierarchyBoundingVectors(true);
          const sizeVec = boundingInfo.max.subtract(boundingInfo.min);
          const halfSizeVec = sizeVec.scale(0.5);
          const center = boundingInfo.min.add(halfSizeVec);

          camera.setTarget(center);


          const sceneDiagonalLenght = sizeVec.length();
          if (isFinite(sceneDiagonalLenght)) {
            camera.upperRadiusLimit = sceneDiagonalLenght * 4;
          }

          // setTimeout(() => {
          //   this.rootMesh?.dispose(true)
          //   this._pivotMesh?.dispose(true);
          // }, 100);

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
      }, (scene, m, exoception) => {
        console.log("Load Error: There was an error loading the model. " + m)
      });
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

    const arcRotateCamera = new ArcRotateCamera("default camera", -(Math.PI / 2), Math.PI / 2, radius, worldCenter, scene);
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
        <Box w="64px" h="64px" pos="relative">
          <canvas style={{ width: "100%", height: "100%" }} ref={this.assetMeshCanvas} />
          <Progress value={this.state.loadedPercent}
            hidden={this.state.loaded} w="64px" size='xs' top="50%" transform={'translateY(-50%)'} pos={"absolute"} />
        </Box>
        <Text maxW={"100px"} fontSize={"xs"} noOfLines={1} textAlign="center">{this.props.name}</Text>
      </Stack>
    )
  }
}