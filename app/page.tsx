"use client"

import Nodes from '@/components/Nodes';
import Preview from '@/components/Preview';
import Utils from '@/lib/utils';
import { Scene } from '@babylonjs/core';
import React, { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import styles from './page.module.css'

let editorScene: Scene | null = null;

export default function Home() {
  const [nodesCollapsed, setNodesCollapsed] = useState<boolean>(false);
  const [inspectorCollapsed, setInspectorCollapsed] = useState<boolean>(false);
  const [assetsCollapsed, setAssetsCollapsed] = useState<boolean>(false);
  const [sceneLoaded, setSceneLoaded] = useState<boolean>(false)

  function toggleNodesCollapsed() {
    setNodesCollapsed(!nodesCollapsed)
  }

  function toggleInspectorCollapsed() {
    setInspectorCollapsed(!inspectorCollapsed)
  }

  function onSceneMount(scene: Scene) {
    editorScene = scene;
    setSceneLoaded(true)
  }

  const onSceneResize = Utils.debounce(() => {
    editorScene?.getEngine().resize()
  }, 150)

  return (
    <main className={styles.main}>
      <PanelGroup direction="horizontal">
        <Panel
          collapsible={true}
          onResize={onSceneResize}
          defaultSize={20}
          maxSize={30}
          minSize={15}
        >
          <Nodes loading={!sceneLoaded} scene={editorScene} />
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
              onResize={onSceneResize}
              defaultSize={75}
              maxSize={85}
              minSize={50}
            >
              <Preview onSceneMount={onSceneMount} />
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
          onResize={onSceneResize}
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
