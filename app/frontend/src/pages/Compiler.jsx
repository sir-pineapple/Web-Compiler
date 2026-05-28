import Editor from "../components/Editor";
import LanguageSelector from "../components/LanguageSelector";
import Terminal from "../components/Terminal";
import Navbar from "../components/Navbar";
import { executeCode, getExecution } from "../api/executionApi";
import { getProject } from "../api/projectApi";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

function Compiler() {
    const [language, setLanguage] = useState("cpp");
    const [searchParams] = useSearchParams();
    const [projectId, setProjectId] = useState(null);
    const [projectName, setProjectName] = useState("Untitled Project");

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

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setCode(starterCode[lang]);
    }

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const runCode = useCallback(async () => {
        try {
            setLoading(true);
            setResult(null);

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
    });

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
                    <h1 className="text-2xl font-bold">
                        {projectId ? projectName : "Web Compiler"}
                    </h1>

                    {projectId && (
                        <p className="text-sm text-zinc-400">
                            Project Mode
                        </p>
                    )}

                    <LanguageSelector
                        language={language}
                        setLanguage={handleLanguageChange}
                    />

                    <button onClick={runCode} disabled={loading} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:bg-zinc-700 disabled:cursor-not-allowed">
                        {loading ? "Running..." : "Run"}
                    </button>
                </div>

                <div className="grid grid-cols-12 gap-4 h-[calc(100vh-120px)]">
                    <div className="col-span-8 h-full">
                        <Editor
                            language={language}
                            code={code}
                            setCode={setCode}
                            runCode={runCode}
                        />
                    </div>

                    <div className="col-span-4 h-full">
                        <Terminal
                            stdin={stdin}
                            setStdin={setStdin}
                            result={result}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Compiler;