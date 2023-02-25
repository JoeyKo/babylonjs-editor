import { Scene } from "@babylonjs/core";
import { ReactNode } from "react";
import { AbstractInspector } from "../AbstractInspector";
import InspectorNumber from "../../../gui/inspector/fields/InspectorNumber";
import { IScriptInspectorState, ScriptInspector } from "../Script/ScriptInspector";
import { Inspector } from "../Inspector";
import { InspectorSection } from "@/gui/inspector/fields/InspectorSection";
import { Box, Stack } from "@chakra-ui/react";
import InspectorInput from "@/gui/inspector/fields/InspectorInput";

export class SceneInspector extends ScriptInspector<Scene, IScriptInspectorState>  {

  public renderContent(): ReactNode {
    return (
      <Stack>
        <Box px={2} pt={1.5}>
          <InspectorInput label="场景名" />
        </Box>
        <InspectorSection title={"渲染"}>
          <InspectorNumber label="最大灯光数量" />
        </InspectorSection>
      </Stack>
    )
  }
}

Inspector.RegisterObjectInspector({
  ctor: SceneInspector,
  ctorNames: ["Scene"],
  title: "Scene",
});
