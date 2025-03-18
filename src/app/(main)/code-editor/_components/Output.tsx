import { Loader2 } from "lucide-react";

const Output = ({
  output,
  language,
  isExecuting,
  className,
}: {
  output: string;
  language: string;
  isExecuting: boolean;
  className?: string;
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="bg-zinc-800 text-white p-3 rounded-t-lg flex items-center justify-between">
        <h3 className="font-medium">Output</h3>
        {isExecuting && (
          <div className="flex items-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm">Executing...</span>
          </div>
        )}
      </div>
      <div className="bg-zinc-900 text-white p-4 rounded-b-lg flex-1 overflow-auto font-mono text-sm whitespace-pre-wrap">
        {output
          ? output
          : language
            ? "Click 'Run Code' to execute and see the output here"
            : "Select a language and write some code to get started"}
      </div>
    </div>
  );
};

export default Output;
