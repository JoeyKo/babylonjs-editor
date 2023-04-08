import { Tools as BabylonTools } from "@babylonjs/core";

class Tools {
  
  public static MESH_EXTENSIONS: string[] = [
    'fbx',
    'gltf',
    'glb',
    'babylon',
    'obj',
    'stl',
  ];

  /**
   * Returns the name of the constructor of the given object.
   * @param object the object to return its constructor name.
   */
  public static GetConstructorName(object: any): string {
    let name = (object && object.constructor) ? object.constructor.name : "";

    if (name === "") {
      name = typeof (object);
    }

    return name;
  }

  /**
   * Implementation from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#answer-2117523
   * Be aware Math.random() could cause collisions, but:
   * "All but 6 of the 128 bits of the ID are randomly generated, which means that for any two ids, there's a 1 in 2^^122 (or 5.3x10^^36) chance they'll collide"
   */
  public static RandomId(): string {
    return BabylonTools.RandomId();
  }

  public static GetFileExtension(filename: string): string {
    return filename.split('.').pop() ?? '';
  }

  public static Is3DModelFile(filename: string) {
    return Tools.MESH_EXTENSIONS.includes(
      this.GetFileExtension(filename).toLocaleLowerCase(),
    );
  }
}

export default Tools;