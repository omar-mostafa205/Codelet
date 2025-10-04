import SyntaxHighlighter from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/hljs";
import MermaidDiagram from "./MermaidDiagram";

const CodeBlock = ({ inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const code = String(children).replace(/\n$/, '');
  
    if (language === 'mermaid') {
      return <MermaidDiagram chart={code} />;
    }
  
    if (!inline && match) {
      return (
        <SyntaxHighlighter
          style={tomorrow}
          language={language}
          PreTag="div"
          className="rounded-lg"
          {...props}
        >
          {code}
        </SyntaxHighlighter>
      );
    }
  
    return (
      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    );
  };