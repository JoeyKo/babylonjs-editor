import { Scene, Node } from "@babylonjs/core";
import Editor from "../Editor";

export interface INodeResult {
  /**
   * Defines the Id of the node.
   */
  id: string;
  /**
   * Defines the name of the node.
   */
  name: string;
}

export interface IMeshResult extends INodeResult {
  /**
   * Defines the type of the mesh.
   */
  type: string;
}

export interface ICameraResult extends INodeResult {
  /**
   * Defines the type of the mesh.
   */
  type: string;
}

export interface ILightResult extends INodeResult {
  /**
   * Defines the type of the mesh.
   */
  type: string;
}

export interface IAssetResult {
  /**
   * Defines the name drawn in the editor.
   */
  name: string;
}

export interface IMaterialResult extends IAssetResult {
  /**
   * Defines the type of material.
   */
  type: string;
}

export class SceneUtils {
  /**
   * Defines the current scene.
   */
  public readonly scene: Scene;

  private readonly _editor: Editor;

  /**
   * Constructor.
   * @param scene defines the scene reference.
   */
  public constructor(editor: Editor) {
    this._editor = editor;
    this.scene = editor.scene!;
  }

  /**
   * Returns the list of all available nodes in the scene.
   */
  public getAllNodes(): INodeResult[] {
    return (this.getAllMeshes() as INodeResult[])
      .concat(this.getAllLights())
      .concat(this.getAllCameras())
      .concat(this.getAllTransformNodes());
  }

  /**
   * Returns the list of all meshes.
   */
  public getAllMeshes(): IMeshResult[] {
    return this.scene.meshes
      .filter((m) => !m._masterMesh)
      .map((m) => ({ id: m.id, name: m.name, type: m.getClassName() }));
  }

  /**
   * Returns the list of all lights.
   */
  public getAllLights(): ILightResult[] {
    return this.scene.lights.map((l) => ({ id: l.id, name: l.name, type: l.getClassName() }));
  }

  /**
   * Returns the list of all cameras.
   */
  public getAllCameras(): ICameraResult[] {
    return this.scene.cameras
      .filter((c) => !c.doNotSerialize)
      .map((c) => ({ id: c.id, name: c.name, type: c.getClassName() }));
  }

  /**
   * Returns the list of all transform nodes.
   */
  public getAllTransformNodes(): INodeResult[] {
    return this._getAsNodeResult(this.scene.transformNodes);
  }

  /**
   * Returns the list of all particle systems.
   */
  public getAllParticleSystems(): INodeResult[] {
    return this.scene.particleSystems.map((ps) => ({ name: ps.name, id: ps.id }));
  }

  /**
   * Returns the given nodes as INodeResult.
   */
  private _getAsNodeResult(nodes: Node[]): INodeResult[] {
    return nodes.map((n) => ({ name: n.name, id: n.id }));
  }

  /**
   * Returns the list of all sounds in the scene.
   */
  public getAllSounds(): string[] {
    return this.scene.mainSoundTrack.soundCollection.map((s) => s.name);
  }

  /**
   * Returns the list of all animation groups in the scene.
   */
  public getAllAnimationGroups(): string[] {
    return this.scene.animationGroups.map((a) => a.name);
  }

  /**
   * Returns the list of all skeletons.
   */
  public getAllSkeletons(): INodeResult[] {
    return this.scene.skeletons.map((s) => ({ name: s.name, id: s.id }));
  }

}
