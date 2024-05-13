/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Monaco } from "@monaco-editor/react";
import type { languages } from "monaco-editor";

export const language = <languages.IMonarchLanguage>{
  tokenPostfix: ".nvs",
  defaultToken: "invalid",
  keywords: [
    "as",
    "async",
    "await",
    "box",
    "break",
    "const",
    "continue",
    "crate",
    "dyn",
    "else",
    "enum",
    "extern",
    "false",
    "fn",
    "for",
    "if",
    "impl",
    "in",
    "let",
    "loop",
    "pub",
    "ref",
    "return",
    "self",
    "struct",
    "interface",
    "true",
    "try",
    "type",
    "use",
    "where",
    "while",
    "do",
    "catch",
    "finally",
    "default",
    "do",
    "plot",
    "export",
    "meta",
    "param",
  ],

  typeKeywords: ["Self", "int", "float", "char", "bool", "string"],

  constants: ["true", "false", "nil"],

  supportConstants: ["STDOUT"],

  supportMacros: ["assert", "assert_eq", "assert_ne", "throw"],

  operators: [
    "!",
    "!=",
    "%",
    "%=",
    "&",
    "&=",
    "&&",
    "*",
    "*=",
    "+",
    "+=",
    "-",
    "-=",
    "->",
    ".",
    "..",
    "...",
    "/",
    "/=",
    ":",
    ";",
    "<<",
    "<<=",
    "<",
    "<=",
    "=",
    "==",
    "=>",
    ">",
    ">=",
    ">>",
    ">>=",
    "@",
    "^",
    "^=",
    "|",
    "|=",
    "||",
    "_",
    "?",
    "#",
  ],

  escapes: /\\([nrt0\"''\\]|x\h{2}|u\{\h{1,6}\})/,
  delimiters: /[,]/,
  symbols: /[\#\!\%\&\*\+\-\.\/\:\;\<\=\>\@\^\|_\?]+/,
  intSuffixes: /[iu](8|16|32|64|128|size)/,
  floatSuffixes: /f(32|64)/,

  tokenizer: {
    root: [
      // Raw string literals
      [
        /r(#*)"/,
        { token: "string.quote", bracket: "@open", next: "@stringraw.$1" },
      ],
      [
        /[a-zA-Z][a-zA-Z0-9_]*!?|_[a-zA-Z0-9_]+/,
        {
          cases: {
            "@typeKeywords": "keyword.type",
            "@keywords": "keyword",
            "@supportConstants": "keyword",
            "@supportMacros": "keyword",
            "@constants": "keyword",
            "@default": "identifier",
          },
        },
      ],
      // Designator
      [/\$/, "identifier"],
      // Lifetime annotations
      [/'[a-zA-Z_][a-zA-Z0-9_]*(?=[^\'])/, "identifier"],
      // Byte literal
      [/'(\S|@escapes)'/, "string.byteliteral"],
      // Strings
      [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
      [
        /`/,
        {
          token: "string.template",
          bracket: "@open",
          next: "@string_tempalte",
        },
      ],
      { include: "@numbers" },
      { include: "@colors" },
      // Whitespace + comments
      { include: "@whitespace" },
      [
        /@delimiters/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "delimiter",
          },
        },
      ],

      [/[{}()\[\]<>]/, "@brackets"],
      [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],
    ],

    whitespace: [
      [/[ \t\r\n]+/, "white"],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"],
    ],

    comment: [
      [/[^\/*]+/, "comment"],
      [/\/\*/, "comment", "@push"],
      ["\\*/", "comment", "@pop"],
      [/[\/*]/, "comment"],
    ],

    string: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
    ],

    string_tempalte: [
      [/[^\\`]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/`/, { token: "string.template", bracket: "@close", next: "@pop" }],
    ],

    stringraw: [
      [/[^"#]+/, { token: "string" }],
      [
        /"(#*)/,
        {
          cases: {
            "$1==$S2": {
              token: "string.quote",
              bracket: "@close",
              next: "@pop",
            },
            "@default": { token: "string" },
          },
        },
      ],
      [/["#]/, { token: "string" }],
    ],

    numbers: [
      //Octal
      [/(0o[0-7_]+)(@intSuffixes)?/, { token: "number" }],
      //Binary
      [/(0b[0-1_]+)(@intSuffixes)?/, { token: "number" }],
      //Exponent
      [
        /[\d][\d_]*(\.[\d][\d_]*)?[eE][+-][\d_]+(@floatSuffixes)?/,
        { token: "number" },
      ],
      //Float
      [/\b(\d\.?[\d_]*)(@floatSuffixes)?\b/, { token: "number" }],
      //Hexadecimal
      [/(0x[\da-fA-F]+)_?(@intSuffixes)?/, { token: "number" }],
      //Integer
      [/[\d][\d_]*(@intSuffixes?)?/, { token: "number" }],
    ],

    colors: [
      // Hexcolor #f0f0f0
      [/#[a-zA-Z0-9]{6,8}/, { token: "number" }],
      [/#[\w]/, { token: "number" }],
    ],
  },
};

export const addNaviStreamLanguage = (monaco: Monaco) => {
  monaco.languages.register({ id: "navi-stream" });

  monaco.languages.setMonarchTokensProvider("navi-stream", language);
};
