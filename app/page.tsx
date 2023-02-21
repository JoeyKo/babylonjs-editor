"use client"

import Nodes from '@/components/Nodes';
import Preview from '@/components/Preview';
import { Nullable, Scene } from '@babylonjs/core';
import React, { Component, PureComponent } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import styles from './page.module.css'

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
    this.setState({ engineLoaded: true })
  }

  public resize = () => {
    this.scene?.getEngine().resize()
  }

  render(): React.ReactNode {
    const { nodesCollapsed, inspectorCollapsed, assetsCollapsed, engineLoaded } = this.state;
    return (
      <main className={styles.main} >
        <PanelGroup direction="horizontal">
          <Panel
            collapsible={true}
            onResize={this.resize}
            defaultSize={20}
            maxSize={30}
            minSize={15}
          >
            <Nodes editor={this} />
          </Panel>
          <PanelResizeHandle className={
            nodesCollapsed
              ? styles.ResizeHandleCollapsed
              : styles.ResizeHandle
          } />
          <Panel>
            <PanelGroup direction="vertical">
              <Panel
                collapsible={true}
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
                <PanelGroup direction="horizontal">
                  <Panel
                    collapsible={true}
                    defaultSize={20}
                    maxSize={30}
                    minSize={10}
                  >
                    资源
                  </Panel>
                  <PanelResizeHandle className={styles.ResizeHandle} />
                  <Panel>
                    资源列表
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>
          <PanelResizeHandle className={
            inspectorCollapsed
              ? styles.ResizeHandleCollapsed
              : styles.ResizeHandle
          } />
          <Panel
            collapsible={true}
            onResize={this.resize}
            defaultSize={20}
            maxSize={30}
            minSize={15}
          >
            检查器
          </Panel>
        </PanelGroup>
      </main>
    )
  }
}
