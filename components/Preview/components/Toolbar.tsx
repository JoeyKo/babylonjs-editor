import { Divider, HStack, Icon, TypographyProps } from "@chakra-ui/react";
import { PureComponent, ReactNode } from "react";
import { IconType } from "react-icons";
import { FiHome, FiMove, FiRotateCw, FiSettings } from 'react-icons/fi';
import { MdOpenInFull } from 'react-icons/md';
import { BsArrowsFullscreen, BsFillPlayFill } from 'react-icons/bs';

interface IToolbarProps {

}

interface IToolbarStates {

}

function IconButton({
  as,
  fontSize
}: {
  as: IconType | undefined,
  fontSize?: TypographyProps["fontSize"];
}) {
  return <Icon fontSize={fontSize} cursor={"pointer"} as={as} />
}

export default class Toolbar extends PureComponent<IToolbarProps, IToolbarStates> {
  constructor(props: IToolbarProps) {
    super(props);
  }
  render(): ReactNode {
    return (
      <HStack spacing={4}>
        <IconButton as={FiHome} />
        <IconButton as={FiMove} />
        <IconButton as={FiRotateCw} />
        <IconButton as={MdOpenInFull} />
        <IconButton as={FiSettings} />
        <Divider orientation='vertical' />
        <IconButton fontSize="sm" as={BsArrowsFullscreen} />
        <IconButton fontSize="lg" as={BsFillPlayFill} />
      </HStack>
    )
  }
}