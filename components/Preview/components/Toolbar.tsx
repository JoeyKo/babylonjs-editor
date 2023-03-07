import { HStack, Icon } from "@chakra-ui/react";
import { PureComponent, ReactNode } from "react";
import { BsArrowsMove } from 'react-icons/bs';

export default class Toolbar extends PureComponent {
  render(): ReactNode {
    return (
      <HStack>
        <Icon as={BsArrowsMove} />
      </HStack>
    )
  }
}