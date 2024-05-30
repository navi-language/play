import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useEffect, useState } from "react";
import { addNaviLanguage } from "./languages";

import examples from "./examples";

const SERVER_URL = import.meta.env.PROD
  ? "https://play.navi-lang.org"
  : "http://localhost:3000";

const DEFAULT_VALUE = examples["hello_world.nv"];

const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  theme: window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "vs-dark"
    : "vs",
  tabSize: 4,
  useTabStops: false,
  lineNumbers: "off",
  padding: {
    top: 10,
    bottom: 10,
  },
  scrollbar: {
    verticalScrollbarSize: 5,
    horizontalScrollbarSize: 5,
    useShadows: false,
  },
  renderLineHighlight: "none",
  minimap: {
    enabled: false,
  },
  formatOnPaste: true,
  unicodeHighlight: {
    ambiguousCharacters: false,
  },
};

export const AppEditor = () => {
  const [currentExample, setCurrentExample] = useState("hello_world.nv");
  const [running, setRunning] = useState(false);
  const [formating, setFormating] = useState(false);
  const [output, setOutput] = useState("");
  const [monaco, setMonaco] = useState<any>();
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor>();
  const [message, showMessage] = useState("");

  useEffect(() => {
    if (monaco) {
      addNaviLanguage(monaco);

      // Get media query is dark mode
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      // Watch dark mode change
      mediaQuery.addEventListener("change", (e) => {
        const newTheme = e.matches ? "vs-dark" : "vs";
        monaco?.editor?.setTheme(newTheme);
      });

      monaco.editor.defineTheme("vs-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#030712",
        },
      });
    }
  }, [monaco]);

  const executeCode = (is_test = false) => {
    if (!editor) {
      return;
    }

    setOutput("Executing please wait...");
    setRunning(true);

    const path = is_test ? "/test" : "/execute";

    const start = new Date();
    fetch(`${SERVER_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: editor.getValue(),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.out) {
          setOutput(res.out);
        } else {
          setOutput(res.error);
        }
      })
      .finally(() => {
        // @ts-expect-error false
        const duration = new Date() - start;
        showMessage(`Speed time: ${duration}ms`);
        setRunning(false);
      });

    return false;
  };

  const formatText = (e: any) => {
    e.preventDefault();
    if (!editor) {
      return;
    }

    setOutput("Formating...");
    setFormating(true);

    const start = new Date();
    fetch(`${SERVER_URL}/format`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: editor.getValue(),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.out) {
          setOutput("Format successfully.");
          editor.setValue(res.out);
        } else {
          setOutput(res.error);
        }
      })
      .finally(() => {
        // @ts-expect-error false
        const duration = new Date() - start;
        showMessage(`Speed time: ${duration}ms`);
        setFormating(false);
      });

    return false;
  };

  const onEditorMounted = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: any,
  ) => {
    setEditor(editor);
    setMonaco(monaco);
  };

  useEffect(() => {
    // Load default value from query
    // ?source=base64
    if (window.location.search) {
      const params = new URLSearchParams(window.location.search);
      if (params.get("source")) {
        const source = atob(params.get("source") || "").toString();
        editor?.setValue(source);
      }
    } else {
      editor?.setValue(DEFAULT_VALUE);
    }
  }, [editor]);

  const ExampleSelector = () => {
    return (
      <select
        className="select"
        onChange={(e) => {
          const key = e.target.value;
          setCurrentExample(key);
          editor?.setValue(examples[key]);
        }}
      >
        {Object.keys(examples).map((key) => (
          <option key={key} value={key} selected={currentExample == key}>
            {key}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="p-4 text-left app-editor-wrap">
      <div className="flex items-center justify-between space-x-3">
        <div className="flex gap-3">
          <button
            className="btn-primary"
            disabled={running}
            onClick={() => executeCode()}
          >
            Run
          </button>
          <button
            className="btn-secondary"
            disabled={running}
            onClick={() => executeCode(true)}
          >
            Test
          </button>
          <button className="btn" disabled={formating} onClick={formatText}>
            {formating ? "Formating..." : "Format"}
          </button>
          <span className="message">{running ? "Executing..." : ""}</span>
        </div>
        <ExampleSelector />
      </div>
      <div className="editor-wraper mt-4">
        <Editor
          defaultLanguage="navi"
          className="flex-1 w-full h-screen max-h-[50vh]"
          theme={editorOptions.theme}
          options={editorOptions}
          onMount={onEditorMounted}
        />
        <pre className="editor-output text-wrap overflow-y-scroll h-screen max-h-[25vh] border-t border-t-gray-300 dark:border-t-gray-700 bg-gray-100 text-gray-600 dark:text-gray-400 dark:bg-gray-950 p-3">
          {output || "No output."}
        </pre>
      </div>
    </div>
  );
};
