import React, { useEffect, useState } from "react";

import Editor, { useMonaco } from "@monaco-editor/react";
import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import files from "./files";

export default function ScriptEditor() {
  const monaco = useMonaco();
  const [fileName, setFileName] = useState("script.ts");

  const file = files[fileName];

  useEffect(() => {
    if (monaco) {
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false
      });

      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES6,
        allowJs: true,
        checkJs: true,
        allowNonTsExtensions: true
      });

      // monaco.languages.typescript.typescriptDefaults.addExtraLib(
      //   require("node_modules/@babylonjs/core").default,
      //   'file:///node_modules/@babylonjs/core/index.d.ts'
      // );
    }
  }, [monaco])

  async function getEmitOutput(typescriptModel: any) {
    const tsClient = await monaco.languages.typescript
      .getTypeScriptWorker()
      .then((worker: any) => worker(typescriptModel.uri));
    const emittedJS = (
      await tsClient.getEmitOutput(typescriptModel.uri.toString())
    )
    try {
      const codeText = emittedJS.outputFiles[0]?.text;
      if (codeText) {
        console.log(codeText)
        Function(codeText)()
      }
    } catch (e) {
      console.log(e)
    }
  }

  function onChange() {
    try {
      const typescriptModels = monaco.editor
        .getModels();
      typescriptModels.forEach(getEmitOutput)
    } catch (e) {
      console.log(e)
    }


    // /**
    //  * Updates the script content to be written.
    //  */
    // private static async _UpdateScriptContent(editor: Editor, scriptsContent: string): Promise<string> {
    // 	// Write all graphs.
    // 	await this.ExportGraphs(editor);

    // 	// Export scripts.
    // 	const all = await editor.assetsBrowser.getAllScripts();
    // 	return scriptsContent.replace("${editor-version}", editor._packageJson.version).replace("// ${scripts}", all.map((s) => {
    // 		const toReplace = `src/scenes/`;
    // 		const extension = extname(s);
    // 		return `\t"${s}": require("./${s.replace(toReplace, "").replace(extension, "")}"),`;
    // 	}).join("\n")).replace("// ${scriptsInterface}", all.map((s) => {
    // 		return `\t"${s}": ScriptMap;`;
    // 	}).join("\n"));
    // }
  }

  return (
    <Box>
      <ButtonGroup size="sm">
        <Button
          disabled={fileName === "script.ts"}
          onClick={() => setFileName("script.ts")}
        >
          script.ts
        </Button>
      </ButtonGroup>
      <Editor
        height="calc(100vh - 32px)"
        theme="vs-dark"
        path={file.name}
        defaultValue={file.value}

        defaultLanguage={file.language}
        onChange={onChange}
      />
    </Box>
  );
}