"use client"

import { Box, HStack, Icon, IconButton, Input, InputGroup, InputLeftElement, Stack } from "@chakra-ui/react";
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
                children={<SearchIcon color='gray.300' />}
              />
              <Input type='tel' placeholder='搜索名称' />
            </InputGroup>
            <Icon as={MdAdd} />
          </HStack>
          <DraggableTree />
        </Stack>
      </Box >
    )
  }
}