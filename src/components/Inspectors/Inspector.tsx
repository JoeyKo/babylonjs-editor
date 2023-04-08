import { Undefinable } from "@/utils/types";
import { Scene } from "@babylonjs/core";
import Tools from "@/components/Editor/tools/tools";
import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import Editor from "../Editor";
import PanelHeader from "../PanelHeader";
import { AbstractInspector } from "./AbstractInspector";

export interface IObjectInspector {
  ctor: (new (props: IObjectInspectorProps) => AbstractInspector<any, any>);
  ctorNames: string[];
  title: string;
  isSupported?: Undefinable<(obj: any) => boolean>;
  /**
   * The reference to the inspector.
   * @hidden
   */
  _ref?: Undefinable<AbstractInspector<any, any>>;
  /**
   * @hidden
   */
  _id?: Undefinable<string>;
}

export interface IObjectInspectorProps {
  /**
   * Defines the editor reference.
   */
  editor: Editor;
  /**
    * Defines the id of the tool.
    */
  toolId: string;
  /**
 * The object reference to edit.
 * @hidden
 */
  _objectRef: any;
}

export interface IInspectorProps {
  /**
   * Defines the editor reference.
   */
  editor: Editor;
}

export interface IInspectorState {
  /**
   * Defines the reference to the selected object in the editor.
   */
  selectedObject: any;
}

export class Inspector extends React.PureComponent<IInspectorProps, IInspectorState> {
  /**
   * The selected object reference.
   */
  public selectedObject: any = null;

  private _editor: Editor;

  private _forceUpdateId: number = 0;
  private _sceneInspectorKey: string = Tools.RandomId();

  private _refHandler = {
    getInspector: (ref: AbstractInspector<any, any>) => ref && (Inspector._ObjectInspectorsConfigurations.find((a) => a._id === ref.props.toolId)!._ref = ref),
  };

  private static _ObjectInspectorsConfigurations: IObjectInspector[] = [];
  /**
   * Constructor.
   * @param props the component's props.
   */
  public constructor(props: IInspectorProps) {
    super(props);

    this._editor = props.editor;
    this._editor.inspector = this;

    this.state = {
      selectedObject: null,
    };
  }
  /**
      * Registers the given object inspector.
      * @param objectInspectorConfiguration the object inspector configuration.
      */
  public static RegisterObjectInspector(objectInspectorConfiguration: IObjectInspector): void {
    const exists = this._ObjectInspectorsConfigurations.find((o) => o.ctor === objectInspectorConfiguration.ctor);
    if (exists) { return; }

    objectInspectorConfiguration._id = Tools.RandomId();
    this._ObjectInspectorsConfigurations.push(objectInspectorConfiguration);
  }

  /**
  * Removes the given object inspector configuration from the available object inspectors.
  * @param objectInspectorConfiguration defines the object inspector configuration to remove.
  */
  public static UnregisterObjectInspector(objectInspectorConfiguration: IObjectInspector): void {
    const index = this._ObjectInspectorsConfigurations.indexOf(objectInspectorConfiguration);
    if (index !== -1) {
      this._ObjectInspectorsConfigurations.splice(index, 1);
    }
  }

  render(): React.ReactNode {
    if (!this.state.selectedObject) {
      return (
        <Box>
          <PanelHeader title="检查器" />
          <Heading p={2} textAlign="center" as="p" fontSize="xs">没有选中的物体</Heading>
        </Box>
      );
    }

    let objectInspector = null;
    const ctor = Tools.GetConstructorName(this.state.selectedObject);

    Inspector._ObjectInspectorsConfigurations.forEach((i) => {
      if (i.isSupported) {
        if (!i.isSupported(this.state.selectedObject)) { return; }
      } else {
        if (i.ctorNames.indexOf(ctor) === -1) { return; }
      }

      let key = this.state.selectedObject.id ?? this.state.selectedObject._id ?? this.state.selectedObject.uniqueId ?? this.state.selectedObject.name ?? "";
      if (this.state.selectedObject instanceof Scene) {
        key = this._sceneInspectorKey;
      }

      objectInspector = <i.ctor key={`${key.toString()}_${this._forceUpdateId}_${Tools.RandomId()}`} editor={this._editor} _objectRef={this.state.selectedObject} toolId={i._id!} ref={this._refHandler.getInspector} />
    });

    return (
      <Box>
        <PanelHeader title="检查器" />
        {objectInspector}
      </Box>
    )
  }

  /**
   * Sets the selected object in the scene or graph to be edited.
   * @param object the selected object reference used by the inspector to be modified.
   */
  public setSelectedObject<T>(object: T): void {
    this.selectedObject = object;

    this.setState({ selectedObject: object });
  }

  /**
   * Forces the update of the component.
   * @param callback defines the callback called on the update is done.
   */
  public forceUpdate(callback?: (() => void) | undefined): void {
    this._forceUpdateId++;

    super.forceUpdate(callback);
  }

}
