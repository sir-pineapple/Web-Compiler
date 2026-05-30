import Editor from "../components/Editor";
import LanguageSelector from "../components/LanguageSelector";
import Terminal from "../components/Terminal";
import Navbar from "../components/Navbar";
import { executeCode, getExecution } from "../api/executionApi";
import { getProject } from "../api/projectApi";
import { debugCode } from "../api/debugApi";
import useAutosave from "../hooks/useAutosave";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

function Compiler() {
    const [language, setLanguage] = useState("cpp");
    const [searchParams] = useSearchParams();
    const [projectId, setProjectId] = useState(null);
    const [projectName, setProjectName] = useState("Untitled Project");
    const [saveStatus, setSaveStatus] = useState(null);
    const [debugResult, setDebugResult] = useState(null);
    const [debugLoading, setDebugLoading] = useState(false);

    const starterCode = {
        cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your code here
}`,
        c: `#include <stdio.h>

int main() {
    // Write your code here
}`,
        java: `public class Main {
    public static void main(String[] args) {
        // Write your code here
    }
}`,
        python: `# Write your code here`
    };

    const [code, setCode] = useState(starterCode.cpp);
    const [stdin, setStdin] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLanguageChange = (lang) => {
        setDebugResult(null);
        setLanguage(lang);
        setCode(starterCode[lang]);
    }

    const handleDebug = async() => {
        try {
            setDebugLoading(true);
            const debug = await debugCode({ language, code, stdin, stdout: result?.stdout || "", stderr: result?.stderr || "", status: result?.status || "", exitCode: result?.exitCode || 0 });
            setDebugResult(debug);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setDebugLoading(false);
        }
    };

    const runCode = useCallback(async () => {
        try {
            setLoading(true);
            setResult(null);
            setDebugResult(null);

            const execute = await executeCode(language, code, stdin);
            const { executionId } = execute;
            const interval = setInterval(async () => {
                const res = await getExecution(executionId);
                if (res.status !== "running") {
                    setResult(res);
                    clearInterval(interval);
                    setLoading(false);
                }
            }, 1000);
        }
        catch(err) {
            console.error(err);
            setLoading(false);
        }
    }, [language, code, stdin]);

    useAutosave({ projectId, projectName, language, code, stdin, setSaveStatus });

    useEffect(() => {
        const handler = (e) => {
            const isCtrlEnter = e.ctrlKey && e.key === "Enter";
            const isCmdEnter = e.metaKey && e.key === "Enter";
            if (isCtrlEnter || isCmdEnter) {
                e.preventDefault();
                if (!loading) runCode();
            }
        };
        document.addEventListener("keydown", handler);
        return () => {document.removeEventListener("keydown", handler);};
    }, [runCode, loading]);

    useEffect(() => {
        const id = searchParams.get("project");
        if (!id) {
            return;
        }
        const loadProject = async () => {
            try {
                const project = await getProject(id);
                setProjectId(project.id);
                setProjectName(project.name);
                setLanguage(project.language);
                setCode(project.code);
                setStdin(project.stdin);
            }
            catch (err) {
                console.error(err);
            }
        };
        loadProject();
    }, [searchParams]);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-zinc-950 text-white p-6">
                <div className="flex items-center gap-4 mb-4">
                    {projectId ? (
                        <input type="text" value={projectName} placeholder="Untitled Project" onChange={(e) => setProjectName(e.target.value)} className="text-2xl font-bold bg-transparent border-b border-transparent focus:border-zinc-600 outline-none text-white w-full" />
                    ) : (
                        <h1 className="text-2xl font-bold">
                            Web Compiler
                        </h1>
                    )}

                    {projectId && (
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <p>
                                Project Mode
                            </p>
                            {saveStatus === "saving" && (
                                <span>Saving...</span>
                            )}
                            {saveStatus === "saved" && (
                                <span className="text-green-400">Saved</span>
                            )}
                        </div>
                    )}

                    <LanguageSelector
                        language={language}
                        setLanguage={handleLanguageChange}
                    />

                    <button onClick={runCode} disabled={loading} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:bg-zinc-700 disabled:cursor-not-allowed">
                        {loading ? "Running..." : "Run"}
                    </button>

                    {result && ["compile_error", "runtime_error", "timeout"].includes(result.status) && (
                        <button onClick={handleDebug} disabled={debugLoading} className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 cursor-pointer disabled:bg-zinc-700 disabled:cursor-not-allowed">
                            {debugLoading ? "Debugging..." : "Debug with AI"}
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-12 gap-4 h-[calc(100vh-120px)] overflow-hidden">
                    <div className="col-span-8 h-full">
                        <Editor
                            language={language}
                            code={code}
                            setCode={setCode}
                            runCode={runCode}
                        />
                    </div>

                    <div className="col-span-4 h-full flex flex-col gap-4 overflow-hidden">
                        <div className="shrink-0 overflow-hidden">
                            <Terminal
                                stdin={stdin}
                                setStdin={setStdin}
                                result={result}
                            />
                        </div>

                        {debugResult && (
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex-1 min-h-0 overflow-y-auto">
                                <h2 className="text-lg font-semibold mb-4 text-center">
                                    AI Debugger
                                </h2>

                                <div className="space-y-4">
                                    <p className="text-red-400 font-medium mb-1">
                                        Problem
                                    </p>
                                    <p className="text-zinc-300 break-words">
                                        {debugResult.problem}
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <p className="text-yellow-400 font-medium mb-1">
                                        Cause
                                    </p>
                                    <p className="text-zinc-300 break-words">
                                        {debugResult.cause}
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <p className="text-green-400 font-mediu, mb-1">
                                        Fix
                                    </p>
                                    <p className="text-zinc-300 break-words">
                                        {debugResult.fix}
                                    </p>
                                </div>

                                <button onClick={() => {
                                    setCode(debugResult.updatedCode);
                                    setDebugResult(null);
                                }} className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors sticky bottom-0 cursor-pointer">
                                    Auto Fix
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Compiler;