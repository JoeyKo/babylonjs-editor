import { Scene } from "@babylonjs/core";

// ${requires}

/**
 * Defines the generated class of the graph.
 */
export default class GraphClass {
    // ${properties}

    /**
     * Constructor.
     * @param scene defines the scene where the graph is running.
     */
    public constructor(private _scene: Scene, private _attachedObject: any) {

    }

    /**
     * Called on the scene starts.
     */
    public onStart(): void {
        // ${onStart}
    }

    /**
     * Called each frame.
     */
    public onUpdate(): void {
        // ${onUpdate}
    }

    /**
     * Returns the reference to the current scene the graph is running.
     */
    public getScene(): Scene {
        return this._scene;
    }

    /**
     * Returns the reference to the object the graph is attached to.
     */
    public getAttachedObject<T>(): T {
        return this._attachedObject;
    }
}
