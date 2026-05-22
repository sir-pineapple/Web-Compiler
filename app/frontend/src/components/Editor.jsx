import MonacoEditor from "@monaco-editor/react";

function Editor({ language, code, setCode }) {
    return (
        <MonacoEditor
            height="500px"
            language={language}
            value={code}
            theme="vs-dark"
            onChange={(value) => setCode(value)}
        />
    );
}

export default Editor;