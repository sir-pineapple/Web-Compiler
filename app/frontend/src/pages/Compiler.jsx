import Editor from "../components/Editor"
import LanguageSelector from "../components/LanguageSelector"
import OutputPanel from "../components/OutputPanel"
import { executeCode, getExecution } from "../api/executionApi"
import { useState } from "react"
function Compiler() {
    const [language, setLanguage] = useState("cpp");

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

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setCode(starterCode[lang]);
    }

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const runCode = async () => {
        try {
            setLoading(true);
            setResult(null);

            const execute = await executeCode(language, code);
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
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6">
            <div className="flex items-center gap-4 mb-4">
                <h1 className="text-2xl font-bold">
                    Web Compiler
                </h1>

                <LanguageSelector
                    language={language}
                    setLanguage={handleLanguageChange}
                />

                <button onClick={runCode} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition cursor-pointer">
                    {loading ? "Running..." : "Run"}
                </button>
            </div>

            <Editor
                language={language}
                code={code}
                setCode={setCode}
            />

            <OutputPanel
                result={result}
            />
        </div>
    );
}

export default Compiler;