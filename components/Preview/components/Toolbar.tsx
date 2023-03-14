import { Divider, HStack, Icon, TypographyProps } from "@chakra-ui/react";
import { PureComponent, ReactNode } from "react";
import { IconType } from "react-icons";
import { FiHome, FiMove, FiRotateCw, FiSettings } from 'react-icons/fi';
import { MdOpenInFull } from 'react-icons/md';
import { BsArrowsFullscreen, BsFillPlayFill } from 'react-icons/bs';
import Editor from "@/components/Editor";
import { GizmoType } from "@/components/Editor/scene/gizmo";

interface IToolbarProps {
  editor: Editor
}

interface IToolbarStates {

}

function IconButton({
  as,
  fontSize,
  onClick,
}: {
  as: IconType | undefined,
  fontSize?: TypographyProps["fontSize"];
  onClick?: () => void;
}) {
  return <Icon fontSize={fontSize} cursor={"pointer"} as={as} />
}

export default class Toolbar extends PureComponent<IToolbarProps, IToolbarStates> {
  private _editor: Editor;

  constructor(props: IToolbarProps) {
    super(props);

    this._editor = props.editor;
  }
  
   
  render(): ReactNode {
    return (
      <HStack spacing={4}>
        <IconButton as={FiHome} />
        <IconButton as={FiMove} onClick={() => this._editor.preview?.setGizmoType(GizmoType.Position)} />
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