import { Scene } from "@babylonjs/core";
import { ReactNode } from "react";
import { AbstractInspector } from "../AbstractInspector";

export interface IScriptInspectorState {

}

export class ScriptInspector<T extends (Scene | Node), S extends IScriptInspectorState> extends AbstractInspector<T, S> {
  public renderContent(): ReactNode {
    throw new Error("Method not implemented.");
  }
}