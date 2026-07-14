function Terminal({
    stdin,
    setStdin,
    result,
    debugResult,
    setDebugResult,
    setCode
}) {
    return (
        <div className="h-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900">
                <h2 className="text-sm font-semibold text-zinc-300">
                    Terminal
                </h2>

                {result && (
                    <span className={`text-xs px-2 py-1 rounded-md ${result.status === "success" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
                        {result.status}
                    </span>
                )}
            </div>

            <div className="p-4 font-mono text-sm space-y-4">
                <div >
                    <p className="text-blue-400 mb-2 text-left">
                        $ stdin
                    </p>

                    <textarea value={stdin} onChange={(e) => setStdin(e.target.value)} placeholder="Enter program input..." className="w-full min-h-[100px] bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-zinc-200 resize-none outline-none" />
                </div>

                <div className="border-t border-zinc-800 pt-4">
                    {debugResult ? (
                        <>
                            <h2 className="text-lg font-semibold mb-4 text-center">
                                AI Debugger
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-red-400 font-medium mb-1">
                                        Problem
                                    </p>
                                    <p className="text-zinc-300 break-words">
                                        {debugResult.problem}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-yellow-400 font-medium mb-1">
                                        Cause
                                    </p>
                                    <p className="text-zinc-300 break-words">
                                        {debugResult.cause}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-green-400 font-medium mb-1">
                                        Fix
                                    </p>
                                    <p className="text-zinc-300 break-words">
                                        {debugResult.fix}
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setCode(debugResult.updatedCode);
                                        setDebugResult(null);
                                    }}
                                    className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer"
                                >
                                    Auto Fix
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-green-400 mb-2 text-left">
                                $ output
                            </p>

                            <div className="bg-black rounded-lg p-4 overflow-auto whitespace-pre-wrap text-left">
                                {!result && (
                                    <span className="text-zinc-500">
                                        Run code to see output
                                    </span>
                                )}

                                {result?.stdout && (
                                    <pre className="text-zinc-200">
                                        {result.stdout}
                                    </pre>
                                )}

                                {result?.stderr && (
                                    <pre className="text-red-400">
                                        {result.stderr}
                                    </pre>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Terminal;