class Utils {
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
}

export default Utils;