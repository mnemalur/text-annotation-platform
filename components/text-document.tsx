"use client"

import { useRef, memo, useMemo, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { AnnotationLegend } from "@/components/annotation-legend"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Annotation {
  id: string
  text: string
  range: {
    start: number
    end: number
  }
  tokenStart: number
  tokenEnd: number
  labelId: string
  labelName: string
  color: string
}

interface TextSelection {
  text: string
  range: {
    start: number
    end: number
  }
  tokenStart: number
  tokenEnd: number
}

interface TextDocumentProps {
  content: string
  annotations: Annotation[]
  selectedText: TextSelection | null
  isReviewMode: boolean
  onTextSelect: (text: string, range: { start: number; end: number }, tokenStart: number, tokenEnd: number) => void
  onRemoveAnnotation: (id: string) => void
  className?: string
}

export function TextDocument({
  content,
  annotations,
  selectedText,
  isReviewMode,
  onTextSelect,
  onRemoveAnnotation,
  className
}: TextDocumentProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const container = containerRef.current

    if (!container || !range) return
    if (!container.contains(range.commonAncestorContainer)) return

    // Get the text content before the selection to calculate the character offset
    const preSelectionRange = range.cloneRange()
    preSelectionRange.selectNodeContents(container)
    preSelectionRange.setEnd(range.startContainer, range.startOffset)
    const start = preSelectionRange.toString().length

    const text = selection.toString().trim()
    if (!text) return

    // Adjust selection to word boundaries for more precise selection
    const words = text.split(/\s+/)
    const firstWord = words[0]
    const lastWord = words[words.length - 1]
    
    // Find exact word boundaries in the original content
    const contentBeforeSelection = content.substring(0, start)
    const wordStart = contentBeforeSelection.lastIndexOf(' ') + 1
    const selectionContext = content.substring(start - 20, start + text.length + 20)
    const exactText = selectionContext.match(new RegExp(`\\b${firstWord}\\b.*\\b${lastWord}\\b`))

    if (exactText) {
      const adjustedStart = wordStart
      const adjustedText = exactText[0].trim()
      const adjustedEnd = adjustedStart + adjustedText.length

      // Calculate token positions based on word boundaries
      const preText = content.substring(0, adjustedStart)
      const tokenStart = preText.split(/\s+/).length
      const tokenEnd = tokenStart + adjustedText.split(/\s+/).length - 1

      onTextSelect(adjustedText, { start: adjustedStart, end: adjustedEnd }, tokenStart, tokenEnd)
    }
  }, [content, onTextSelect])

  // Render annotated text with markup
  const renderAnnotatedText = () => {
    let lastIndex = 0
    const result = []
    const sortedAnnotations = [...annotations].sort((a, b) => a.range.start - b.range.start)

    for (const annotation of sortedAnnotations) {
      // Add text before annotation
      if (annotation.range.start > lastIndex) {
        result.push(
          <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
            {content.slice(lastIndex, annotation.range.start)}
          </span>
        )
      }

      // Add annotated text with improved styling
      result.push(
        <span
          key={annotation.id}
          className="relative group inline-block rounded px-1 py-0.5 transition-colors duration-200"
          style={{ 
            backgroundColor: `${annotation.color}30`,
            borderBottom: `2px solid ${annotation.color}`,
          }}
        >
          {content.slice(annotation.range.start, annotation.range.end)}
          {!isReviewMode && (
            <button
              onClick={() => onRemoveAnnotation(annotation.id)}
              className="absolute hidden group-hover:flex items-center justify-center h-5 w-5 rounded-full bg-destructive text-destructive-foreground -top-2 -right-2 shadow-sm"
              title="Remove annotation"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          <span 
            className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg whitespace-nowrap z-50 mb-1"
            style={{ borderLeft: `3px solid ${annotation.color}` }}
          >
            {annotation.labelName}
          </span>
        </span>
      )

      lastIndex = annotation.range.end
    }

    // Add remaining text
    if (lastIndex < content.length) {
      result.push(
        <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
          {content.slice(lastIndex)}
        </span>
      )
    }

    return result
  }

  return (
    <div className="relative flex flex-col gap-4">
      {/* Document Section */}
      <div className="flex flex-col h-full">
        <div className="bg-muted/50 p-3 rounded-t-md border-b flex items-center justify-between">
          <div className="text-sm font-medium">Document Annotation</div>
          {!isReviewMode && selectedText && (
            <div className="text-sm font-medium text-primary">
              Text selected - Choose a label →
            </div>
          )}
        </div>
        <div 
          ref={containerRef}
          onMouseUp={!isReviewMode ? handleTextSelection : undefined}
          className={cn(
            "flex-1 p-4 rounded-b-md border-x border-b bg-card text-card-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "overflow-y-auto selection:bg-primary/30 selection:text-foreground",
            selectedText && "cursor-pointer",
            className
          )}
          style={{ 
            minHeight: "500px",
            maxHeight: "calc(100vh - 20rem)",
          }}
        >
          {renderAnnotatedText()}
        </div>
      </div>

      {/* Annotations Summary Card */}
      <div className="border rounded-lg bg-card">
        <div className="p-3 border-b bg-muted/50">
          <h3 className="font-medium text-sm">Annotations Summary</h3>
        </div>
        <div className="p-4">
          {annotations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">
              No annotations yet. Start by selecting text and choosing a label.
            </p>
          ) : (
            <div className="space-y-2">
              {annotations.map((annotation) => (
                <div 
                  key={annotation.id}
                  className="flex items-start gap-3 p-2 rounded-md border bg-muted/30"
                >
                  <div 
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: annotation.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium mb-1">{annotation.labelName}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      "{annotation.text}"
                    </div>
                  </div>
                  {!isReviewMode && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemoveAnnotation(annotation.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selection Indicator */}
      {selectedText && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-background p-4 rounded-lg shadow-lg border text-sm animate-in fade-in slide-in-from-bottom-4 z-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Selected text:</span>
              <span className="px-2 py-1 rounded bg-primary/10 border">
                "{selectedText.text}"
              </span>
            </div>
            <div className="h-4 border-r border-muted" />
            <div className="text-primary font-medium">
              Choose a label →
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

