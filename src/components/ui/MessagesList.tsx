/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable react/display-name */
import React, { useEffect, useRef, useMemo } from 'react'
import { type UIMessage } from 'ai'
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import mermaid from 'mermaid';
import { Copy, Check, User , AlertCircle, Lightbulb, Code, BarChart3, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface MessagesListProps {
  messages: UIMessage[]
  status: "submitted" | "ready" | "streaming" | "error"
}


const MessagesList = ({ messages, status }: MessagesListProps) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      themeVariables: {
        primaryColor: '#3b82f6',
        primaryTextColor: '#1f2937',
        primaryBorderColor: '#e5e7eb',
        lineColor: '#6b7280',
        secondaryColor: '#f3f4f6',
        tertiaryColor: '#ffffff'
      },
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      fontSize: 14,
      flowchart: {
        nodeSpacing: 50,
        rankSpacing: 50,
        curve: 'basis'
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const copyToClipboard = async (text: string, codeId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(codeId);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const MermaidDiagram = useMemo(() => ({ diagramCode, index }: { diagramCode: string, index: number }) => {
    if (!diagramCode || diagramCode.trim() === '') {
      return <div className="text-gray-500 italic">No diagram content found</div>;
    }

    let mermaidCode = diagramCode.trim();
    
    try {
      if (mermaidCode.startsWith('```mermaid')) {
        const mermaidMatch = mermaidCode.match(/```mermaid\n([\s\S]*?)\n```/);
        if (mermaidMatch) {
          mermaidCode = mermaidMatch[1]?.trim() || '';
        }
      } else if (mermaidCode.startsWith('mermaid\n') || mermaidCode.startsWith('mermaid ')) {
        mermaidCode = mermaidCode.replace(/^mermaid\s*\n?/, '').trim();
      }

      if (!mermaidCode || mermaidCode === '') {
        return <div className="text-gray-500 italic">Empty diagram content</div>;
      }

      // Validate Mermaid diagram types
      const validMermaidTypes = [
        'flowchart', 'sequencediagram', 'graph', 'gantt', 'pie', 
        'gitgraph', 'erdiagram', 'journey', 'quadrantchart', 
        'requirementdiagram', 'classdiagram', 'statediagram', 'mindmap'
      ];
      const firstLine = mermaidCode.split('\n')[0].toLowerCase().trim();
      const hasValidType = validMermaidTypes.some(type => firstLine.includes(type));
      
      if (!hasValidType) {
        return (
          <div className="border border-amber-200 bg-amber-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle size={16} />
              <span className="text-sm">Invalid diagram type: {firstLine}</span>
            </div>
          </div>
        );
      }

      mermaidCode = mermaidCode 
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');

      const diagramId = `mermaid-${index}-${Date.now()}`;

      return (
        <div className="my-6 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
            <BarChart3 size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Architecture Diagram</span>
          </div>
          <div className="p-6">
            <div
              id={diagramId}
              className="mermaid"
              style={{
                minHeight: '200px',
                textAlign: 'center',
                fontSize: '14px'
              }}
            >
              {mermaidCode}
            </div>
          </div>
        </div>
      );
    } catch (error) {
      return (
        <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle size={16} />
            <span className="text-sm">Error processing diagram: {(error as Error).message}</span>
          </div>
        </div>
      );
    }
  }, []);
  useEffect(() => {
    if (status !== 'streaming') {
      const timer = setTimeout(() => {
        mermaid.run();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [messages, status]);

  const getMessageIcon = (role: string) => {
    switch (role) {
      case 'user':
        return <User size={20} className="text-purple-600" />;
      case 'assistant':
        return <Sparkles size={20} className="text-gray-600" />;
      case 'system':
        return <AlertCircle size={20} className="text-amber-600" />;
      default:
        return <AlertCircle size={20} className="text-gray-600" />;
    }
  };

  const processMessageContent = (content: string) => {
    return content
    .replace(/`([A-Z][a-zA-Z]*)`/g, '$1') 
    .replace(/`([a-zA-Z0-9_-]+\.[a-zA-Z0-9]+)`/g, '$1') 
    .replace(/`([a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+)`/g, '$1'); 
  }

  return (
    <div className='flex flex-col gap-6 p-6 max-w-5xl mx-auto min-w-[900px] font-inter'>
      {messages.map((message, index) => {
        const isUser = message.role === 'user';
        const isAssistant = message.role === 'assistant';
        
        return (
          <div 
            key={message.id || index}
            className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} w-full`}
          >

            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${
              isUser ? 'bg-gray-100' : isAssistant ? 'bg-gray-100' : 'bg-amber-100'
            } flex items-center justify-center`}>
              {getMessageIcon(message.role)}
            </div>

            <div className={`flex-1 ${isUser ? 'max-w-[70%]' : 'max-w-[85%]'}`}>
              <div className={`rounded-2xl ${
                isUser 
                ? 'bg-black/2 shadow-md text-black'
                : isAssistant 
                    ? 'bg-white border border-gray-200 shadow-sm' 
                    : 'bg-amber-50 border border-amber-200'
              } ${isUser ? 'rounded-br-sm' : 'rounded-bl-sm'}`}>
                
                                    {!isUser && (
                      <div className={`px-4 py-2 border-b ${
                        isAssistant 
                          ? 'border-gray-100 bg-gray-50' 
                          : 'border-amber-200'
                      } rounded-t-2xl`}>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-gray-700">
                            Codelet AI
                          </span>
                          <span className="text-xs text-gray-500">
                          </span>
                        </div>
                      </div>
                    )}

                <div className="p-4">
                  {isUser ? (
                    <div className="text-black leading-relaxed ">
                      {message.parts?.map((part, partIndex) =>
                        part.type === 'text' ? (
                          <span key={partIndex} >
                            {part.text}
                          </span>
                        ) : null
                      )}
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          h3: ({ children }) => (
                            <h3 className="text-lg font-bold mt-6 mb-3 pb-2 border-b border-gray-200 text-gray-800 flex items-center gap-2">
                              {children}
                            </h3>
                          ),
                          h4: ({ children }) => (
                            <h4 className="text-base font-semibold mt-4 mb-2 text-gray-700">
                              {children}
                            </h4>
                          ),
                          p: ({ children }) => (
                            <p className="mb-3 text-gray-700 leading-relaxed">
                              {children}
                            </p>
                          ),
                          ul: ({ children }) => (
                            <ul className="mb-4 space-y-1 ml-4">
                              {children}
                            </ul>
                          ),
                          li: ({ children }) => (
                            <li className="text-gray-700 flex gap-2 justify-center">
                              <span className="flex-1">{children}</span>
                            </li>
                          ),
                          ol: ({ children }) => (
                            <ol className="mb-4 space-y-2 ml-4 list-decimal">
                              {children}
                            </ol>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-gray-800">
                              {children}
                            </strong>
                          ),
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            const language = match ? match[1] : 'text';
                            const codeContent = String(children).replace(/\n$/, '');
                            const cleanedCode = codeContent
                            .split('\n')
                            .map(line => {
                              return line.replace(/`([^`]+)`/g, (match, content) => {
                                const cleaned = content.trim().replace(/^` +/, '').replace(/`+$/, '');
                                return cleaned;
                              });
                            })
                            .join('\n');
                            const codeId = `code-${index}-${Math.random()}`;
                            
                            const firstLine = cleanedCode.trim().split('\n')[0].toLowerCase();
                            if (language === 'mermaid' || 
                                firstLine.match(/^(graph|flowchart|sequencediagram|classdiagram|statediagram|erdiagram|gantt|pie|journey|gitgraph|requirementdiagram|mindmap|timeline|quadrantchart|xychart|block|packet)/)) {
                              return <MermaidDiagram diagramCode={cleanedCode} index={index} />;
                            }
                            
                            if (!inline && match) {
                              return (
                                <div className="relative group my-4">
                                  <div className="bg-gray-900 rounded-t-lg px-4 py-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Code size={16} className="text-gray-400" />
                                      <span className="text-sm text-gray-300 font-mono">
                                        {language}
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => copyToClipboard(cleanedCode, codeId)}
                                      className="flex items-center gap-2 px-2 py-1 rounded text-xs text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                                    >
                                      {copiedCode === codeId ? (
                                        <>
                                          <Check size={14} />
                                          Copied!
                                        </>
                                      ) : (
                                        <>
                                          <Copy size={14} />
                                          Copy
                                        </>
                                      )}
                                    </button>
                                  </div>
                                  <SyntaxHighlighter
                                    language={language}
                                    style={dracula}
                                    customStyle={{
                                      margin: 0,
                                      borderTopLeftRadius: 0,
                                      borderTopRightRadius: 0,
                                      fontSize: '14px',
                                      lineHeight: '1.5',
                                    }}
                                    showLineNumbers={language !== 'bash' && language !== 'shell'}
                                    wrapLines={true}
                                    {...(props as any)}
                                  >
                                    {cleanedCode}
                                  </SyntaxHighlighter>
                                </div>
                              );
                            }
                            
                            return (
                              <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono border" {...props}>
 { String(children)
  .trim()
  .replace(/^```[\w-]*\n?/, '')  
  .replace(/```$/, '')           
  .replace(/^`/, '')             
  .replace(/`$/, '')  }
                                        </code>
                            );
                          },
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-purple-400 pl-4 py-2 my-4 bg-purple-50 italic text-purple-800">
                              {children}
                            </blockquote>
                          ),
                          table: ({ children }) => (
                            <div className="overflow-x-auto my-4">
                              <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                                {children}
                              </table>
                            </div>
                          ),
                          thead: ({ children }) => (
                            <thead className="bg-gray-50">
                              {children}
                            </thead>
                          ),
                          th: ({ children }) => (
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                              {children}
                            </th>
                          ),
                          td: ({ children }) => (
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">
                              {children}
                            </td>
                          ),
                        }}
                      >
                        {processMessageContent(
                          message.parts?.map((part, partIndex) =>
                            part.type === 'text' ? part.text : ''
                          ).join('') || ''
                        )}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
              {isAssistant && (
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Lightbulb size={12} />
                    <span>AI-powered response</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>•</span>
                    <span>Generated in ~2s</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {status === 'streaming' && (
        <div className="flex gap-4 w-full">
          <div className="flex-1 max-w-[85%]">
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl rounded-bl-sm">
              <div className="px-4 py-2 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-gray-700">Codelet AI </span>
                  <div className="flex items-center gap-2">

                    <span className="text-xs text-gray-500">Thinking...</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-200 border-t-purple-600"></div>
                  <span className="text-gray-600 text-sm">Analyzing your codebase and generating response...</span>
                </div>
              </div>
            </div>
        </div>
        </div>
      )}
      
      {status === 'error' && (
        <div className="flex justify-center w-full">
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl max-w-md">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-red-600" />
              <div>
                <div className="font-semibold text-sm">Something went wrong</div>
                <div className="text-sm mt-1">Please try again or check your connection.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;