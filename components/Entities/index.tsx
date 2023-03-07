"use client"

import { Box } from "@chakra-ui/react";
import { PureComponent, ReactNode } from "react";
import Editor from "../Editor";
import PanelHeader from "../PanelHeader";
import DraggableTree from "../DraggableTree";

type IEntitiesProps = {
  editor: Editor;
}

type IEntitiesState = {

}

export default class Entities extends PureComponent<IEntitiesProps, IEntitiesState> {
  constructor(props: IEntitiesProps) {
    super(props);

    this.state = {
    }
  }

  render(): ReactNode {
    return (
      <Box h="100%">
        <PanelHeader title="层级" />
        <DraggableTree />
      </Box >
    )
  }
}