"use client"

import { Box, HStack, IconButton, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuItem, MenuList, Stack } from "@chakra-ui/react";
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
              <Input placeholder="搜索名称" />
            </InputGroup>
            <Menu size={"xs"}>
              <MenuButton
                as={IconButton}
                size="xs"
                fontSize={"md"}
                aria-label='创建'
                icon={<MdAdd />}
              />
              <MenuList>
                <MenuItem>组</MenuItem>
                <MenuItem>盒子</MenuItem>
                <MenuItem>球体</MenuItem>
                <MenuItem>面片</MenuItem>
                <MenuItem>粒子</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
          <DraggableTree />
        </Stack>
      </Box >
    )
  }
}