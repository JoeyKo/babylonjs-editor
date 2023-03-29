"use client"

import { Box, Flex, Heading, HStack, Spinner } from '@chakra-ui/react';
import { Inspector } from '@/components/Inspectors/Inspector';
import Entities from '@/components/Entities/Entity';
import Preview from '@/components/Preview/Preview';
import { Engine, Nullable, Observable, Scene, Skeleton, Sound, SubMesh, Node, IParticleSystem, AbstractMesh } from '@babylonjs/core';
import React, { PureComponent } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Assets from '@/components/Assets/Asset';
import { createStandaloneToast } from '@chakra-ui/toast'
import { SceneUtils } from './scene/utils';

// Inspector
import '@/components/Inspectors/Scene/SceneInspector';

import styles from './index.module.css';
import Entity from '@/components/Entities/Entity';

const { ToastContainer } = createStandaloneToast()

type IEditorStates = {
  nodesCollapsed: boolean;
  inspectorCollapsed: boolean;
  assetsCollapsed: boolean;
  engineLoaded: boolean;
}

type IEditorProps = {

}

export default class Editor extends PureComponent<IEditorProps, IEditorStates> {
  public scene: Nullable<Scene> = null;
  public sceneUtils: Nullable<SceneUtils> = null;
  public entity: Nullable<Entity> = null;
  public preview: Nullable<Preview> = null;
  public inspector: Nullable<Inspector> = null;

  public editorInitializedObservable: Observable<void> = new Observable<void>();
  public selectedNodeObservable: Observable<Node> = new Observable<Node>();
  public selectedSubMeshObservable: Observable<SubMesh> = new Observable<SubMesh>();
  public selectedSceneObservable: Observable<Scene> = new Observable<Scene>();
  public selectedSoundObservable: Observable<Sound> = new Observable<Sound>();
  public selectedSkeletonObservable: Observable<Skeleton> = new Observable<Skeleton>();
  public selectedParticleSystemObservable: Observable<IParticleSystem> = new Observable<IParticleSystem>();

  public removedNodeObservable: Observable<Node> = new Observable<Node>();

  // Asset engine for multiple scenes
  public assetRenderEngine: Nullable<Engine> = null;

  constructor(props: IEditorProps) {
    super(props);

    this.state = {
      nodesCollapsed: false,
      inspectorCollapsed: false,
      assetsCollapsed: false,
      engineLoaded: false,
    }
  }

  public toggleNodesCollapsed() {
    this.setState({ nodesCollapsed: !this.state.nodesCollapsed })
  }

  public toggleInspectorCollapsed() {
    this.setState({ inspectorCollapsed: !this.state.inspectorCollapsed })
  }

  public createAssetRenderEngine() {
    return new Engine(document.createElement("canvas"), false, {
      audioEngine: false,
      disableWebGL2Support: false,
      powerPreference: "low-power",
    }, false);
  }

  public onSceneMount = (scene: Scene) => {
    this.scene = scene;
    this.setState({ engineLoaded: true });

    // Utils
    this.sceneUtils = new SceneUtils(this);

    this._bindEvents();

    // Notify!
    this.editorInitializedObservable.notifyObservers();
    this.selectedSceneObservable.notifyObservers(this.scene);

    // Create asset babylonjs engine
    this.assetRenderEngine = this.createAssetRenderEngine();
  }

  public resize = () => {
    this.scene?.getEngine().resize()
  }

  private _bindEvents(): void {
    // Editor events coordinator
    this.selectedNodeObservable.add((o, ev) => {
      this.inspector?.setSelectedObject(o);
      this.preview?.gizmo?.setAttachedNode(o);
    });
    this.selectedSubMeshObservable.add((o, ev) => {
      this.inspector?.setSelectedObject(o);
      this.preview?.gizmo?.setAttachedNode(o.getMesh());

    });
    this.selectedParticleSystemObservable.add((o, ev) => {
      this.inspector?.setSelectedObject(o);
      if (o.emitter instanceof AbstractMesh) {
        this.preview?.gizmo?.setAttachedNode(o.emitter);
      }
    });

    document.addEventListener("dragover", (ev) => ev.preventDefault());
  }

  render(): React.ReactNode {
    const { nodesCollapsed, inspectorCollapsed, assetsCollapsed, engineLoaded } = this.state;

    return (
      <>
        <Flex
          pos="fixed"
          left={0}
          top={0}
          w="100vw"
          h="200vh"
          bg="gray.800"
          color="gray.100"
          zIndex={999}
          overflow="hide"
          hidden={engineLoaded}
        >
          <HStack spacing={2} minW="100vw" h="100vh" justify="center">
            <Spinner size="sm" />
            <Heading as="p" fontSize="md">编辑器初始化中...</Heading>
          </HStack>
        </Flex>
        <Box as="main" w="100vw" h="100vh" overflow="hidden">
          <PanelGroup autoSaveId='editor-panel' direction="horizontal">
            <Panel
              collapsible={true}
              onResize={this.resize}
              defaultSize={20}
              maxSize={30}
              minSize={15}
            >
              {engineLoaded ? <Entities editor={this} /> : null}
            </Panel>
            <PanelResizeHandle className={
              nodesCollapsed
                ? styles.ResizeHandleCollapsed
                : styles.ResizeHandle
            } />
            <Panel>
              <PanelGroup direction="vertical">
                <Panel
                  collapsible={false}
                  onResize={this.resize}
                  defaultSize={75}
                  maxSize={85}
                  minSize={50}
                >
                  <Preview editor={this} onSceneMount={this.onSceneMount} />
                </Panel>
                <PanelResizeHandle className={
                  assetsCollapsed
                    ? styles.VerticalResizeHandleCollapsed
                    : styles.VerticalResizeHandle
                } />
                <Panel>
                  {engineLoaded ? <Assets editor={this} /> : null}
                </Panel>
              </PanelGroup>
            </Panel>
            <PanelResizeHandle className={
              inspectorCollapsed
                ? styles.ResizeHandleCollapsed
                : styles.ResizeHandle
            } />
            <Panel
              collapsible={false}
              onResize={this.resize}
              defaultSize={20}
              maxSize={30}
              minSize={15}
            >
              <Inspector editor={this} />
            </Panel>
          </PanelGroup>
        </Box>
        <ToastContainer />
      </>
    )
  }
}
