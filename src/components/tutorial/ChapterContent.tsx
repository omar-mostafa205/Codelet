"use client";
import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import mermaid from 'mermaid';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import { github } from 'react-syntax-highlighter/dist/cjs/styles/prism';


interface CodeSnippet {
  id: string;
  fileRef: string;
  sourceCode: string;
  language: string | null; 
  createdAt: Date;
  updatedAt: Date;
  subChapterId: string;
}

interface SubChapter {
  id: string;
  subChapterTitle: string;
  explanation: string;
  diagram: string | null;
  codeSnippets: CodeSnippet[];
  createdAt: Date;
  updatedAt: Date;
  chapterId: string;
}

interface ChapterContentProps {
  subChapters?: SubChapter[] | null;
}

export function ChapterContent({ subChapters }: ChapterContentProps) {
  const [mermaidInitialized, setMermaidInitialized] = useState(false);

  useEffect(() => {
    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'inherit',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true
        }
      });
      setMermaidInitialized(true);
    }
  }, [mermaidInitialized]);

  useEffect(() => {
    if (mermaidInitialized) {
      const timer = setTimeout(() => {
        mermaid.run();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [subChapters, mermaidInitialized]);

  const renderMermaidDiagram = (diagramCode: string, index: number) => {
    if (!diagramCode || diagramCode.trim() === '') {
      return <div>no Diagram found </div>
    }
  
    let mermaidCode = diagramCode.trim();
    
    try {
      if (mermaidCode.startsWith('```mermaid')) {
        const mermaidMatch = mermaidCode.match(/```mermaid\n([\s\S]*?)\n```/);
        if (mermaidMatch) {
          mermaidCode = mermaidMatch[1].trim();
        }
      } else if (mermaidCode.startsWith('mermaid\n') || mermaidCode.startsWith('mermaid ')) {
         mermaidCode = mermaidCode.replace(/^mermaid\s*\n?/, '').trim();
      }
  
      if (!mermaidCode || mermaidCode === '') {
        return null;
      }
  
      const validMermaidTypes = ['flowchart', 'sequenceDiagram', 'graph', 'gantt', 'pie', 'gitgraph', 'erDiagram', 'journey', 'quadrantChart', 'requirementDiagram', 'classDiagram', 'stateDiagram'];
      const hasValidType = validMermaidTypes.some(type => mermaidCode.includes(type));
      
      if (!hasValidType) {
        console.warn('Invalid mermaid diagram type detected, skipping render');
        return null;
      }
  
      mermaidCode = mermaidCode
      .replace(/\[([^\]]*\([^)]*\)[^\]]*)\]/g, '["$1"]')
      .replace(/\(([^()]*\([^()]*\)[^()]*)\)/g, '("$1")')
      .replace(/\{([^{}]*\([^{}]*\)[^{}]*)\}/g, '{"$1"}');
        mermaidCode = mermaidCode.replace(/\s+-->\s+/g, ' --> ');
  
      const diagramId = `mermaid-${index}-${Date.now()}`;

      return (
        <div 
          key={diagramId}
          className="mermaid-container my-6"
          style={{ textAlign: 'center' }}
        >
          <div
            id={diagramId}
            className="mermaid"
            style={{
              minHeight: '200px',
              maxWidth: '100%',
              overflowX: 'auto',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: '#ffffff'
            }}
          >
            {mermaidCode}
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error processing mermaid diagram:', error);
      return null;
    }
  };

  const renderCodeSnippet = (snippet: CodeSnippet, index: number) => {
    const language = snippet.language ?? 'javascript';
    const cleanFileRef = snippet.fileRef.trim().replace(/^`+/, '').replace(/`+$/, '');
    
    return (
      <div key={snippet.id} className="code-snippet my-4">
        <div className="bg-gray-100 px-4 py-2 text-sm text-gray-600 border-t border-l border-r border-gray-200 rounded-t-lg font-mono w-fit">
           {cleanFileRef}
        </div>
        
        <SyntaxHighlighter
          language={language}
          style={github}
          customStyle={{
            borderRadius: '0 0 8px 8px',
            border: '1px solid #e5e7eb',
            borderTop: 'none',
            fontSize: '14px',
            lineHeight: '1.5',
            background : '#fafafa',
            margin: 0
          }}
          showLineNumbers={true}
        >
          {snippet.sourceCode}
        </SyntaxHighlighter>
      </div>
    );
  };

  return (
    <div data-color-mode="light" className="chapter-content">
      {!subChapters ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading chapter content...</div>
        </div>
      ) : subChapters.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No content available for this chapter.
        </div>
      ) : (
        subChapters.map((subChapter, subIndex) => (
          <div key={subChapter.id} className="sub-chapter mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              {subChapter.subChapterTitle}
            </h3>

            <div className="explanation max-w-none mb-6" data-color-mode="light">
              <MDEditor.Markdown 
                source={subChapter.explanation}
                style={{
                  backgroundColor: 'transparent',
                  color: '#383a42',
                  lineHeight : '1.6'
                }}
              />
            </div>

            {subChapter.codeSnippets && subChapter.codeSnippets.length > 0 && (
              <div className="code-snippets mb-6">
                <h4 className="text-lg font-medium text-gray-700 mb-3">Code</h4>
                {subChapter.codeSnippets.map((snippet, index) => 
                  renderCodeSnippet(snippet, index)
                )}
              </div>
            )}

            {subChapter.diagram && (
              <div className="diagram mb-6">
                {renderMermaidDiagram(subChapter.diagram, subIndex)}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}