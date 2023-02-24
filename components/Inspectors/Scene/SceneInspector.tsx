import { Scene } from "@babylonjs/core";
import { PureComponent, ReactNode } from "react";
import { AbstractInspector } from "../AbstractInspector";
import InspectorNumber from "../../../gui/inspector/fields/InspectorNumber";
import { IScriptInspectorState, ScriptInspector } from "../Script/ScriptInspector";
import { Inspector } from "../Inspector";

export class SceneInspector extends ScriptInspector<Scene, IScriptInspectorState>  {

  public renderContent(): ReactNode {
    return (
      <InspectorNumber />
    )
  }
}

Inspector.RegisterObjectInspector({
  ctor: SceneInspector,
  ctorNames: ["Scene"],
  title: "Scene",
});
