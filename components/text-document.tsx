"use client"

import { useRef } from "react"
import { cn } from "@/lib/utils"
import { Annotation } from "@/types/annotation"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from "lucide-react"

interface TextRange {
  start: number
  end: number
}

interface TextDocumentProps {
  content: string
  annotations: Annotation[]
  isReviewMode: boolean
  onTextSelect?: (text: string, range: TextRange, tokenStart: number, tokenEnd: number) => void
  onRemoveAnnotation: (annotationId: string) => void
  className?: string
}

const TextDocument = ({
  content,
  annotations,
  isReviewMode,
  onTextSelect,
  onRemoveAnnotation,
  className
}: TextDocumentProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTextSelection = () => {
    if (!isReviewMode && onTextSelect) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const container = containerRef.current
        
        if (container && container.contains(range.commonAncestorContainer)) {
          const text = range.toString().trim()
          
          if (text) {
            // Get the text content before the selection to calculate the character offset
            const preSelectionRange = range.cloneRange()
            preSelectionRange.selectNodeContents(container)
            preSelectionRange.setEnd(range.startContainer, range.startOffset)
            const start = preSelectionRange.toString().length
            
            // Calculate token positions based on word boundaries
            const preText = content.substring(0, start)
            const tokenStart = preText.split(/\s+/).filter(Boolean).length
            const tokenEnd = tokenStart + text.split(/\s+/).filter(Boolean).length - 1
            
            // Calculate the exact range in the original text
            const exactStart = content.indexOf(text, Math.max(0, start - text.length))
            const exactEnd = exactStart + text.length
            
            onTextSelect(text, { start: exactStart, end: exactEnd }, tokenStart, tokenEnd)
          }
        }
      }
    }
  }

  const renderAnnotatedText = () => {
    let lastIndex = 0
    const textParts = []
    
    // Sort annotations by start position
    const sortedAnnotations = [...annotations].sort((a, b) => 
      (a.range.start || 0) - (b.range.start || 0)
    )

    sortedAnnotations.forEach((annotation, index) => {
      const start = annotation.range.start || 0
      const end = annotation.range.end || start + annotation.text.length

      // Add text before annotation
      if (start > lastIndex) {
        textParts.push(
          <span key={`text-${index}`}>
            {content.substring(lastIndex, start)}
          </span>
        )
      }

      // Add annotated text
      textParts.push(
        <mark
          key={`annotation-${annotation.id}`}
          className="relative group cursor-pointer rounded px-0.5"
          style={{
            backgroundColor: `${annotation.color}25`,
            borderBottom: `2px solid ${annotation.color}`
          }}
          onClick={() => !isReviewMode && onRemoveAnnotation(annotation.id)}
        >
          {content.substring(start, end)}
          {!isReviewMode && (
            <span
              className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-background border rounded text-xs whitespace-nowrap z-10"
              style={{ borderColor: annotation.color }}
            >
              {annotation.labelName} (Click to remove)
            </span>
          )}
        </mark>
      )

      lastIndex = end
    })

    // Add remaining text
    if (lastIndex < content.length) {
      textParts.push(
        <span key="text-end">
          {content.substring(lastIndex)}
        </span>
      )
    }

    return textParts
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-muted/50 p-3 rounded-t-md border-b flex items-center justify-between">
        <div className="text-sm font-medium">Document Annotation</div>
        {!isReviewMode && (
          <div className="text-sm font-medium text-primary">
            Select text to annotate
          </div>
        )}
      </div>
      
      <div
        ref={containerRef}
        onMouseUp={handleTextSelection}
        className={cn(
          "flex-1 p-4",
          "prose prose-sm max-w-none",
          "overflow-y-auto",
          "selection:bg-gray-200 selection:text-foreground",
          className
        )}
      >
        {renderAnnotatedText()}
      </div>

      {/* Annotations Summary Card */}
      <Card className="mt-4 border rounded-lg">
        <div className="p-3 border-b bg-muted/50">
          <h3 className="font-medium text-sm">Annotations Summary</h3>
        </div>
        <ScrollArea className="h-[200px]">
          <div className="p-3">
            {annotations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-2">
                No annotations yet. Start by selecting text and choosing a label.
              </p>
            ) : (
              <div className="space-y-2">
                {annotations.map((annotation) => (
                  <div 
                    key={annotation.id}
                    className="flex items-start gap-3 p-2 rounded-md border bg-muted/30 group relative"
                  >
                    <div 
                      className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                      style={{ backgroundColor: annotation.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium mb-0.5">{annotation.labelName}</div>
                      <div className="text-sm text-muted-foreground">
                        "{annotation.text}"
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Tokens: {annotation.tokenStart}-{annotation.tokenEnd}
                      </div>
                    </div>
                    {!isReviewMode && (
                      <button
                        onClick={() => onRemoveAnnotation(annotation.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                      >
                        <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}

export default TextDocument

