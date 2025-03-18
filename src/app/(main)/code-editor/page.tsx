"use client";
import { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import PageHeader from "@/components/LayoutContent/PageHeader";
import {
  CODE_SNIPPETS,
  LanguageSelector,
} from "./_components/LanguageSelector";
import Output from "./_components/Output";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CodeEditorPage = () => {
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("");
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const editorRef = useRef(null);

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
    setOutput("");
  };

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const executeCode = async () => {
    if (!language) {
      toast({
        title: "No language selected",
        description: "Please select a programming language first",
        variant: "destructive",
      });
      return;
    }

    if (!value.trim()) {
      toast({
        title: "Empty code",
        description: "Please write some code to execute",
        variant: "destructive",
      });
      return;
    }

    setIsExecuting(true);
    setOutput("Executing...");

    try {
      if (language === "javascript") {
        // For JavaScript, we can use a safer approach than eval
        const executeJs = () => {
          const originalConsoleLog = console.log;
          const logs = [];

          // Override console.log to capture output
          console.log = (...args) => {
            logs.push(
              args
                .map((arg) =>
                  typeof arg === "object" ? JSON.stringify(arg) : String(arg)
                )
                .join(" ")
            );
          };

          try {
            // Create a function from the code and execute it
            const func = new Function(value);
            func();
            return logs.join("\n");
          } catch (error) {
            return `Error: ${error.message}`;
          } finally {
            // Restore original console.log
            console.log = originalConsoleLog;
          }
        };

        const result = executeJs();
        setOutput(result);
      } else if (language === "typescript") {
        // For TypeScript, we'll simulate execution (transpiling would require a backend)
        setOutput(
          "TypeScript execution is simulated in this environment.\n\nOutput would be similar to JavaScript after transpilation."
        );
      } else {
        // For other languages, we'd typically need a backend service
        // Here we'll just show a message explaining this
        setOutput(
          `To execute ${language} code, you would need a backend service or API.\n\nThis is a client-side simulation only.`
        );
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <PageHeader headerTitle="Code Editor" />

      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <LanguageSelector language={language} onSelect={onSelect} />
            <Button
              onClick={executeCode}
              disabled={isExecuting || !language}
              className="bg-green-600 hover:bg-green-700"
            >
              {isExecuting ? "Executing..." : "Run Code"}
            </Button>
          </div>
          <div className="border-2 rounded-lg overflow-hidden h-[calc(100vh-250px)]">
            <Editor
              height="100%"
              width="100%"
              theme="vs-dark"
              defaultLanguage={language}
              defaultValue={value}
              onMount={onMount}
              value={value}
              onChange={(value: any) => setValue(value)}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                wordWrap: "on",
                automaticLayout: true,
              }}
            />
          </div>
        </div>
        <Output
          output={output}
          language={language}
          isExecuting={isExecuting}
          className="w-full lg:w-1/2 h-[calc(100vh-250px)]"
        />
      </div>
    </div>
  );
};

export default CodeEditorPage;
