"use client"

import { Box } from "@chakra-ui/react";
import { PureComponent, ReactNode } from "react";
import Editor from "../Editor";
import PanelHeader from "../PanelHeader";
import { SortableTree } from "../SortableTree/SortableTree";

type INodesProps = {
  editor: Editor;
}

type INodesState = {

}

export default class Nodes extends PureComponent<INodesProps, INodesState> {
  constructor(props: INodesProps) {
    super(props);

    this.state = {
    }
  }

  render(): ReactNode {
    return (
      <Box>
        <PanelHeader title="层级" />
        <SortableTree collapsible indicator />
      </Box >
    )
  }
}