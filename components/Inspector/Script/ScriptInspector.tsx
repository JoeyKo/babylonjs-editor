import { Scene } from "@babylonjs/core";
import { AbstractInspector } from "../AbstractInspector";

export interface IScriptInspectorState {

}

export class ScriptInspector<T extends (Scene | Node), S extends IScriptInspectorState> extends AbstractInspector<T, S> {
}