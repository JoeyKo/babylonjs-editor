import { Scene } from "@babylonjs/core";
import { PureComponent, ReactNode } from "react";
import { AbstractInspector } from "../AbstractInspector";
import InspectorNumber from "../Fields/InspectorNumber";
import { IScriptInspectorState, ScriptInspector } from "../Script/ScriptInspector";

export class SceneInspector extends ScriptInspector<Scene, IScriptInspectorState>  {

  render(): ReactNode {
    return (
      <InspectorNumber />
    )
  }
}
