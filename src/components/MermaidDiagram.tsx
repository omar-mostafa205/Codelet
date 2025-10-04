import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram = ({ chart }: MermaidDiagramProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const renderDiagram = async () => {
      if (!ref.current || !chart.trim()) return;

      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default', // or 'dark', 'forest', 'neutral'
          securityLevel: 'loose',
          fontFamily: 'Arial, sans-serif',
          flowchart: {
            htmlLabels: true,
            curve: 'basis',
            padding: 20,
          },
          sequence: {
            diagramMarginX: 50,
            diagramMarginY: 10,
            actorMargin: 50,
            width: 150,
            height: 65,
            boxMargin: 10,
            boxTextMargin: 5,
            noteMargin: 10,
            messageMargin: 35,
          },
          gantt: {
            titleTopMargin: 25,
            barHeight: 20,
            axisFormat: '%m/%d/%Y',
          }
        });

        // Clear previous content
        ref.current.innerHTML = '';
        
        // Generate unique ID
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Create a temporary element for rendering
        const element = document.createElement('div');
        element.id = id;
        ref.current.appendChild(element);

        // Render the diagram
        const { svg } = await mermaid.render(id, chart);
        
        // Insert the SVG
        ref.current.innerHTML = svg;
        setError('');

      } catch (err) {
        console.error('Mermaid render error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
        
        // Show error with the chart code
        if (ref.current) {
          ref.current.innerHTML = `
            <div class="mermaid-error" style="
              border: 2px solid #ef4444;
              background: #fef2f2;
              padding: 16px;
              border-radius: 8px;
              margin: 16px 0;
            ">
              <p style="color: #dc2626; font-weight: 600; margin: 0 0 8px 0;">
                ⚠️ Mermaid Rendering Error
              </p>
              <p style="color: #991b1b; font-size: 14px; margin: 0 0 12px 0;">
                ${err instanceof Error ? err.message : 'Unknown error'}
              </p>
              <details style="font-size: 12px;">
                <summary style="cursor: pointer; color: #dc2626;">Show diagram code</summary>
                <pre style="
                  background: white;
                  padding: 8px;
                  margin-top: 8px;
                  border: 1px solid #d1d5db;
                  border-radius: 4px;
                  overflow-x: auto;
                  white-space: pre-wrap;
                ">${chart}</pre>
              </details>
            </div>
          `;
        }
      }
    };

    renderDiagram();
  }, [chart]);

  return (
    <div className="mermaid-wrapper my-6">
      <div 
        ref={ref}
        className="mermaid-container flex justify-center"
        style={{
          minHeight: '100px',
          maxWidth: '100%',
          overflow: 'auto'
        }}
      />
    </div>
  );
};

export default MermaidDiagram;