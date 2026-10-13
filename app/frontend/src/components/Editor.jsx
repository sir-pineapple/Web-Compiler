import MonacoEditor from "@monaco-editor/react";
import { useEffect, useRef } from "react";

function Editor({ language, code, setCode, runCode }) {

    const monacoLanguageMap = {
        cpp: "cpp",
        c: "c",
        java: "java",
        python: "python"
    };

    const runCodeRef = useRef(runCode);

    useEffect(() => {
        runCodeRef.current = runCode;
    }, [runCode]);

    const handleEditorDidMount = (editor, monaco) => {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
            runCodeRef.current();
        });
    };

    return (
        <div className="rounded-xl overflow-hidden border border-zinc-800">
            <MonacoEditor
                height="600px"
                language={monacoLanguageMap[language]}
                value={code}
                theme="vs-dark"
                onMount={handleEditorDidMount}
                onChange={(value) => setCode(value || "")}
                options={{
                    minimap: {enabled: false},
                    fontSize: 14,
                    fontFamily: "JetBrains Mono, monospace",
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    workWrap: "on",
                    quickSuggestions: true,
                    suggestOnTriggerCharacters: true,
                    parameterHints: {enabled: true},
                    tabSize: 4,
                    insertSpaces: true,
                    formatOnPaste: true,
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                    renderWhitespace: "selection",
                    lineNumbers: "on",
                    roundedSelection: true,
                    padding: {top: 16, bottom: 16}
                }}
            />
        </div>
    );
}

export default Editor;