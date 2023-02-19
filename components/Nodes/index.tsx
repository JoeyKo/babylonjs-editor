"use client"

import { Scene } from "@babylonjs/core";
import { Box } from "@chakra-ui/react";
import {
  UncontrolledTreeEnvironment,
  Tree,
  StaticTreeDataProvider
} from "react-complex-tree";
import PanelHeader from "../PanelHeader";
import { longTree } from "./data";

function Nodes({
  loading,
  scene,
}: {
  loading: boolean;
  scene: Scene | null;
}) {
  console.log(scene?.rootNodes)
  if (loading) { return null; }

  return (
    <Box>
      <PanelHeader title="层级" />
      <UncontrolledTreeEnvironment
        dataProvider={
          new StaticTreeDataProvider(longTree.items, (item, data) => ({
            ...item,
            data
          }))
        }
        getItemTitle={(item) => item.data}
        viewState={{
          "tree-1": {
            expandedItems: ["Fruit"]
          }
        }}
      >
        <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
      </UncontrolledTreeEnvironment>
    </Box>
  )
}

export default Nodes;