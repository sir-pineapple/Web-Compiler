import { useState } from 'react';

const LANGUAGES = [
  {
    id: 'c',
    name: 'C',
    endpoint: '/compile/c',
    template: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
  },
  {
    id: 'cpp',
    name: 'C++',
    endpoint: '/compile/cpp',
    template: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
  },
  {
    id: 'java',
    name: 'Java',
    endpoint: '/compile/java',
    template: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
  },
  {
    id: 'python',
    name: 'Python',
    endpoint: '/compile/python',
    template: `print("Hello, World!")`,
  },
];

export default function App() {
  const [activeLanguage, setActiveLanguage] = useState('c');
  const [code, setCode] = useState(LANGUAGES[0].template);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const currentLanguage = LANGUAGES.find((lang) => lang.id === activeLanguage);

  const handleLanguageChange = (languageId) => {
    setActiveLanguage(languageId);
    const lang = LANGUAGES.find((l) => l.id === languageId);
    setCode(lang.template);
    setOutput('');
    setStatus(null);
  };

  const handleCompile = async () => {
    if (!code.trim()) {
      setOutput('Error: Code cannot be empty');
      setStatus('error');
      return;
    }

    setLoading(true);
    setOutput('');
    setStatus(null);

    try {
      const response = await fetch(`http://localhost:3000${currentLanguage.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file: code }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOutput(data.message || '');
      setStatus(data.status === 'success' ? 'success' : 'error');
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCode = () => {
    const lang = LANGUAGES.find((l) => l.id === activeLanguage);
    setCode(lang.template);
  };

  const handleClearOutput = () => {
    setOutput('');
    setStatus(null);
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800 px-6 py-4">
        <h1 className="text-3xl font-bold">Online Compiler</h1>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Language Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-700">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleLanguageChange(lang.id)}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeLanguage === lang.id
                  ? 'border-b-2 border-blue-500 text-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>

        {/* Code Editor Section */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-gray-300">
            Code Editor
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-96 w-full rounded-lg border border-gray-700 bg-gray-800 p-4 font-mono text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            placeholder="Write your code here..."
            spellCheck="false"
          />
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={handleCompile}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Compiling...' : 'Compile & Run'}
          </button>
          <button
            onClick={handleClearCode}
            className="rounded-lg bg-gray-700 px-6 py-2 font-semibold text-gray-100 hover:bg-gray-600 transition-colors"
          >
            Clear Code
          </button>
          <button
            onClick={handleClearOutput}
            className="rounded-lg bg-gray-700 px-6 py-2 font-semibold text-gray-100 hover:bg-gray-600 transition-colors"
          >
            Clear Output
          </button>
        </div>

        {/* Output Section */}
        {(output || status) && (
          <div className="rounded-lg border-2 bg-gray-800 p-4" style={{
            borderColor: status === 'error' ? '#ef4444' : '#22c55e',
          }}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-300">Output</span>
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: status === 'error' ? '#ef4444' : '#22c55e',
                  }}
                />
              </div>
              <button
                onClick={handleCopyOutput}
                className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
              >
                Copy
              </button>
            </div>
            <pre className="max-h-48 overflow-auto rounded bg-gray-900 p-3 font-mono text-sm">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
