import { Divider, HStack, IconButton } from "@chakra-ui/react";
import { PureComponent, ReactNode } from "react";
import { FiMove, FiRotateCw, FiPlay } from 'react-icons/fi';
import { MdOpenInFull } from 'react-icons/md';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import Editor from "@/components/Editor";
import { GizmoType } from "@/components/Editor/scene/gizmo";

interface IToolbarProps {
  editor: Editor;
  gizmoType: GizmoType;
}

interface IToolbarStates {

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
        <IconButton variant='filled' size='2xs' aria-label={"移动"} as={FiMove}
          color={this.props.gizmoType === GizmoType.Position ? "blue.500" : undefined}
          onClick={() => this._editor.preview?.setGizmoType(GizmoType.Position)}
        />
        <IconButton variant='filled' size='2xs' aria-label={"旋转"} as={FiRotateCw}
          color={this.props.gizmoType === GizmoType.Rotation ? "blue.500" : undefined}
          onClick={() => this._editor.preview?.setGizmoType(GizmoType.Rotation)}
        />
        <IconButton variant='filled' size='2xs' aria-label={"缩放"} as={MdOpenInFull}
          color={this.props.gizmoType === GizmoType.Scaling ? "blue.500" : undefined}
          onClick={() => this._editor.preview?.setGizmoType(GizmoType.Scaling)}
        />
        <Divider orientation='vertical' />
        <IconButton variant='filled' size='2xs' aria-label={"部署"} as={AiOutlineCloudUpload} />
        <IconButton variant='filled' size='2xs' aria-label={"预览"} as={FiPlay} />
      </HStack>
    )
  }
}