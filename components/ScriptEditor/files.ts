const someTSCodeExample = `/**
 * Defines the generated class of the graph.
 */
class GraphClass {

    /**
     * Constructor.
     * @param scene defines the scene where the graph is running.
     */
    public constructor(private _scene: any, private _attachedObject: any) {

    }

    /**
     * Called on the scene starts.
     */
    public onStart(): void {

    }

    /**
     * Called each frame.
     */
    public onUpdate(): void {

    }

    /**
     * Returns the reference to the current scene the graph is running.
     */
    public getScene(): any {
        return this._scene;
    }

    /**
     * Returns the reference to the object the graph is attached to.
     */
    public getAttachedObject<T>(): T {
        return this._attachedObject;
    }
}`;

const files: any = {
  "script.ts": {
    name: "script.ts",
    language: "typescript",
    value: someTSCodeExample
  },
};

export default files;
