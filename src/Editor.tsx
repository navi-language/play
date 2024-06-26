import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { useEffect, useState } from 'react';
import { addNaviLanguage } from './languages';

loader.config({ monaco });

import examples from './examples';
import { getTheme, registerThemeChanged } from './theme';

const SERVER_URL = import.meta.env.PROD
  ? 'https://play.navi-lang.org'
  : 'http://localhost:3000';

const DEFAULT_VALUE = examples['hello_world.nv'];

const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  theme: getTheme() == 'dark' ? 'vs-dark' : 'vs',
  tabSize: 4,
  useTabStops: false,
  lineNumbers: 'on',
  padding: {
    top: 10,
    bottom: 10,
  },
  scrollbar: {
    verticalScrollbarSize: 5,
    horizontalScrollbarSize: 5,
    useShadows: false,
  },
  renderLineHighlight: 'none',
  minimap: {
    enabled: false,
  },
  formatOnPaste: true,
  unicodeHighlight: {
    ambiguousCharacters: false,
  },
};

export const AppEditor = () => {
  const [currentExample, setCurrentExample] = useState('hello_world.nv');
  const [running, setRunning] = useState(false);
  const [formating, setFormating] = useState(false);
  const [output, setOutput] = useState('');
  const [monaco, setMonaco] = useState<any>();
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor>();
  const [, showMessage] = useState('');

  useEffect(() => {
    if (monaco) {
      addNaviLanguage(monaco);

      registerThemeChanged((theme) => {
        monaco.editor.setTheme(theme == 'dark' ? 'vs-dark' : 'vs');
      });

      monaco.editor.defineTheme('vs-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#030712',
        },
      });
    }
  }, [monaco]);

  const executeCode = (is_test = false) => {
    if (!editor) {
      return;
    }

    setOutput('Executing please wait...');
    setRunning(true);

    const path = is_test ? '/test' : '/execute';

    const start = new Date();
    fetch(`${SERVER_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

    setOutput('Formating...');
    setFormating(true);

    const start = new Date();
    fetch(`${SERVER_URL}/format`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: editor.getValue(),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.out) {
          setOutput('Format successfully.');
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
    monaco: any
  ) => {
    setEditor(editor);
    setMonaco(monaco);
  };

  useEffect(() => {
    // Load default value from query
    // ?source=base64
    if (window.location.search) {
      const params = new URLSearchParams(window.location.search);
      if (params.get('source')) {
        const source = atob(params.get('source') || '').toString();
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
    <div className="py-4 text-left app-editor-wrap">
      <div className="flex flex-col-reverse justify-between gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
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
            {formating ? 'Formating...' : 'Format'}
          </button>
          <span className="message">{running ? 'Executing...' : ''}</span>
        </div>
        <ExampleSelector />
      </div>
      <div className="mt-4 editor-wraper">
        <Editor
          defaultLanguage="navi"
          className="editor-input"
          theme={editorOptions.theme}
          options={editorOptions}
          onMount={onEditorMounted}
        />
        <pre className="editor-output">{output || 'No output.'}</pre>
      </div>
    </div>
  );
};
