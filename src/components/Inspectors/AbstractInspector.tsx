import InspectorUtils from "@/components/Editor/inspector/utils";
import { Nullable } from "@babylonjs/core";
import React from "react";
import Editor from "../Editor";
import { IObjectInspectorProps } from "./Inspector";

export abstract class AbstractInspector<T, S> extends React.Component<IObjectInspectorProps, S> {
  /**
    * Defines the reference to the editor.
    */
  protected editor: Editor;
  /**
   * Defines the reference to the edited root object (node, sound, etc.).
   */
  protected selectedObject: T;
  private _inspectorDiv: Nullable<HTMLDivElement> = null;

  /**
    * @hidden
    */
  protected readonly _inspectorName: string;

  /**
   * Constructor.
   * @param props the component's props.
   */
  public constructor(props: IObjectInspectorProps) {
    super(props);

    this.editor = props.editor;
    this.selectedObject = props._objectRef;

    this._inspectorName = InspectorUtils.SetCurrentInspector(this);
  }

  render(): React.ReactNode {
    const content = this.renderContent();
    return (
      <>
        <div ref={(ref) => this._inspectorDiv = ref} style={{ width: "100%", height: "100%", overflow: "auto" }}>
          {content}
        </div>
      </>
    );
  }

  /**
   * Renders the content of the inspector.
   */
  public abstract renderContent(): React.ReactNode;

}