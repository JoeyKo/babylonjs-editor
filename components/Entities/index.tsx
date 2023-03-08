"use client"

import { Box, HStack, IconButton, Input, InputGroup, InputLeftElement, Stack } from "@chakra-ui/react";
import { PureComponent, ReactNode } from "react";
import Editor from "../Editor";
import PanelHeader from "../PanelHeader";
import DraggableTree from "../DraggableTree";
import { SearchIcon } from "@chakra-ui/icons";
import { MdAdd } from "react-icons/md";

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
        <Stack>
          <HStack px="2" pt="0.5rem" pb="0">
            <InputGroup size="xs">
              <InputLeftElement
                pointerEvents='none'
                // eslint-disable-next-line react/no-children-prop
                children={<SearchIcon />}
              />
              <Input placeholder='搜索名称' variant="filled" />
            </InputGroup>
            <IconButton size="xs" fontSize={"md"} icon={<MdAdd />} aria-label={"创建"} />
          </HStack>
          <DraggableTree />
        </Stack>
      </Box >
    )
  }
}