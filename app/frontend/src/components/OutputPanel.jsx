function OutputPanel({ result }) {
    const isError = result?.stderr;

    return (
        <div className="mt-4 w-full">
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900">
                    <h2 className="text-sm font-semibold text-zinc-300">
                        Console
                    </h2>
                    {result && (
                        <span className={`
                            text-xs
                            px-2
                            py-1
                            rounded-md
                            ${
                                result.status === "success" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                            }
                        `}>
                            {result.status}
                        </span>
                    )}
                </div>

                <div className="p-4 text-left font-mono text-sm overflow-auto max-h-[300px] whitespace-pre-wrap break-words">
                    {result?.stdout && (
                        <pre className="text-green-300 whitespace-pre-wrap text-left">
                            {result.stdout}
                        </pre>
                    )}

                    {isError && (
                        <pre className="text-red-300 whitespace-pre-wrap text-left">
                            {result.stderr}
                        </pre>
                    )}

                    {!result && (
                        <p className="text-zinc-500">
                            Run code to see output
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OutputPanel;