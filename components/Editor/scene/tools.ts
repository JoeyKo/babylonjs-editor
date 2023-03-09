import { Nullable } from "@/utils/types";
import { ISceneLoaderAsyncResult, Mesh, Scene, SceneLoader, } from "@babylonjs/core";
import Tools from "../tools/tools";
import { createStandaloneToast } from '@chakra-ui/toast'

const { toast } = createStandaloneToast();

export class SceneTools {
  public static async ImportMeshAsync(rootUrl: string, filename: File | string, scene: Scene): Promise<ISceneLoaderAsyncResult> {
    return await SceneLoader.ImportMeshAsync("", rootUrl, filename, scene, null, null);
  }

  /**
   * Merges the given meshes into a single one, by creating sub meshes and keeping materials.
   * @param meshes the list of all meshes to merge into a single mesh.
   */
  public static MergeMeshes(meshes: Mesh[]): Nullable<Mesh> {
    const merged = Mesh.MergeMeshes(meshes, false, true, undefined, true, undefined);
    if (!merged) {
      toast({
        title: "Can't merge meshes",
        status: "error"
      });
      return null;
    }

    merged.id = Tools.RandomId();

    return merged;
  }
}