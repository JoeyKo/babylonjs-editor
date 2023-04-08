import { Scene } from "@babylonjs/core";
import { ReactNode } from "react";
import { IScriptInspectorState, ScriptInspector } from "../Script/ScriptInspector";
import { Inspector } from "../Inspector";
import { Box, Stack } from "@chakra-ui/react";
import { InspectorSection } from "@/components/Editor/inspector/fields/InspectorSection";
import InspectorInput from "@/components/Editor/inspector/fields/InspectorInput";
import { InspectorColorPicker } from "@/components/Editor/inspector/fields/InspectorColorPicker";
import { InspectorNumber } from "@/components/Editor/inspector/fields/InspectorNumber";

export class SceneInspector extends ScriptInspector<Scene, IScriptInspectorState>  {

  public renderContent(): ReactNode {
    return (
      <Stack>
        <Box px={2} pt={1.5}>
          <InspectorInput label="场景名" />
        </Box>
        <InspectorSection title={"颜色"}>
          <InspectorColorPicker object={this.selectedObject} property={"clearColor"} label={"背景色"} />
          <InspectorColorPicker object={this.selectedObject} property="ambientColor" label="环境色" />
        </InspectorSection>
        <InspectorSection title="环境">
          <InspectorNumber object={this.selectedObject} property="environmentIntensity" label="强度" step={0.01} />
        </InspectorSection>
      </Stack>
    )
  }
}

Inspector.RegisterObjectInspector({
  ctor: SceneInspector,
  ctorNames: [Scene.name],
  title: "Scene",
});
