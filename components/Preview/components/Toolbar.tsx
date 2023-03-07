import { Divider, HStack, Icon } from "@chakra-ui/react";
import { PureComponent, ReactNode } from "react";
import { IconType } from "react-icons";
import { FiHome, FiMove, FiRotateCw, FiSettings, FiPlay } from 'react-icons/fi';
import { MdOpenInFull } from 'react-icons/md';
import { TfiFullscreen } from 'react-icons/tfi';

interface IToolbarProps {

}

interface IToolbarStates {

}

function IconButton({
  as
}: {
  as: IconType | undefined
}) {
  return <Icon cursor={"pointer"} as={as} />
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
        <IconButton as={TfiFullscreen} />
        <IconButton as={FiPlay} />
      </HStack>
    )
  }
}