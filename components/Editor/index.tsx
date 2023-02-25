"use client"

import { Flex, Heading, HStack, Spinner } from '@chakra-ui/react';
import { Inspector } from '@/components/Inspectors/Inspector';
import Nodes from '@/components/Nodes';
import Preview from '@/components/Preview';
import { Nullable, Observable, Scene } from '@babylonjs/core';
import React, { PureComponent } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Assets from '@/components/Assets';
import styles from './index.module.css'

// Inspector
import '@/components/Inspectors/Scene/SceneInspector';

type IEditorStates = {
  nodesCollapsed: boolean;
  inspectorCollapsed: boolean;
  assetsCollapsed: boolean;
  engineLoaded: boolean;
}

type IEditorProps = {

}

export type IEditor = {
  scene: Nullable<Scene>;
}

export default class Editor extends PureComponent<IEditorProps, IEditorStates> {
  public scene: Nullable<Scene> = null;
  public inspector: Nullable<Inspector> = null;
  public selectedSceneObservable: Observable<Scene> = new Observable<Scene>();

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

  public onSceneMount = (scene: Scene) => {
    this.scene = scene;
    this.setState({ engineLoaded: true });

    this._bindEvents();

    this.selectedSceneObservable.notifyObservers(this.scene!);
  }

  public resize = () => {
    this.scene?.getEngine().resize()
  }

  private _bindEvents(): void {
    this.selectedSceneObservable.add((s) => this.inspector?.setSelectedObject(s));
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
          color="gray.100"
          bg="gray.700"
          zIndex={999}
          overflow="hide"
          hidden={engineLoaded}
        >
          <HStack spacing={2} w="100vw" h="100vh" justify="center">
            <Spinner size="sm" />
            <Heading as="p" fontSize="md">编辑器初始化中...</Heading>
          </HStack>
        </Flex>
        <main className={styles.main}>
          <PanelGroup direction="horizontal">
            <Panel
              collapsible={true}
              onResize={this.resize}
              defaultSize={20}
              maxSize={30}
              minSize={15}
            >
              {engineLoaded ? <Nodes editor={this} /> : null}
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
        </main>
      </>
    )
  }
}
