import { AbstractInspector } from "@/components/Inspectors/AbstractInspector";
import { Nullable } from "@/lib/types";
import Utils from "@/lib/utils";

class InspectorUtils {
  private static _CurrentInspector: Nullable<AbstractInspector<any, any>> = null;
  private static _CurrentInspectorName: Nullable<string> = null;

  /**
   * Sets the current inspector being mounted.
   * @param inspector defines the reference to the current inspector being mounted.
   */
  public static SetCurrentInspector(inspector: AbstractInspector<any, any>): string {
      this._CurrentInspector = inspector;
      this._CurrentInspectorName = Utils.GetConstructorName(inspector);

      return this._CurrentInspectorName;
  }

  /**
   * Gets the name of the current inspector being mounted.
   */
  public static get CurrentInspectorName(): Nullable<string> {
      return this._CurrentInspectorName;
  }

  /**
   * Gets the reference to the current inspector being mounted.
   */
  public static get CurrentInspector(): Nullable<AbstractInspector<any, any>> {
      return this._CurrentInspector;
  }
}

export default InspectorUtils;