"use client"

import { useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { AnnotationLegend } from "@/components/annotation-legend"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function TextDocument({
  content,
  annotations,
  onTextSelect,
  selectedText,
  isReviewMode = false,
  onRemoveAnnotation,
}) {
  const textRef = useRef(null)

  // Helper function to find word boundaries
  const findWordBoundaries = (text, start, end) => {
    // Find the start of the word
    let wordStart = start
    while (wordStart > 0 && /\w/.test(text[wordStart - 1])) {
      wordStart--
    }

    // Find the end of the word
    let wordEnd = end
    while (wordEnd < text.length && /\w/.test(text[wordEnd])) {
      wordEnd++
    }

    return { start: wordStart, end: wordEnd }
  }

  const handleTextSelection = () => {
    if (isReviewMode) return // Disable selection in review mode

    const selection = window.getSelection()
    if (selection.toString().trim().length > 0 && textRef.current.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0)

      // Calculate the start and end positions within the entire text
      const preSelectionRange = range.cloneRange()
      preSelectionRange.selectNodeContents(textRef.current)
      preSelectionRange.setEnd(range.startContainer, range.startOffset)
      const start = preSelectionRange.toString().length

      const selectedTextContent = selection.toString()
      const end = start + selectedTextContent.length

      // Expand selection to word boundaries if it's a partial word
      const expandedBoundaries = findWordBoundaries(content, start, end)

      // Get the expanded text
      const expandedText = content.substring(expandedBoundaries.start, expandedBoundaries.end)

      // Calculate token positions (for ML model comparison)
      // This is a simple implementation - in a real app, you might use a more sophisticated tokenizer
      const tokens = content.substring(0, expandedBoundaries.start).split(/\s+/).length
      const tokenEnd = tokens + expandedText.split(/\s+/).length - 1

      onTextSelect(expandedText, {
        start: expandedBoundaries.start,
        end: expandedBoundaries.end,
        tokenStart: tokens,
        tokenEnd: tokenEnd,
      })

      // Update the visual selection to match the expanded word boundaries
      if (expandedBoundaries.start !== start || expandedBoundaries.end !== end) {
        // Only modify the selection if it changed
        const newRange = document.createRange()

        // Find the text node and position for the start
        let currentPos = 0
        let startNode = null
        let startOffset = 0

        // Find the text node and position for the end
        let endNode = null
        let endOffset = 0

        // Helper function to traverse nodes and find positions
        const findPositionInNodes = (node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const nodeLength = node.nodeValue.length

            // Check if start position is in this node
            if (startNode === null && currentPos + nodeLength >= expandedBoundaries.start) {
              startNode = node
              startOffset = expandedBoundaries.start - currentPos
            }

            // Check if end position is in this node
            if (currentPos + nodeLength >= expandedBoundaries.end) {
              endNode = node
              endOffset = expandedBoundaries.end - currentPos
              return true // Found both positions
            }

            currentPos += nodeLength
          } else {
            // Traverse child nodes
            for (let i = 0; i < node.childNodes.length; i++) {
              if (findPositionInNodes(node.childNodes[i])) {
                return true
              }
            }
          }
          return false
        }

        findPositionInNodes(textRef.current)

        // If we found both positions, update the selection
        if (startNode && endNode) {
          newRange.setStart(startNode, startOffset)
          newRange.setEnd(endNode, endOffset)

          selection.removeAllRanges()
          selection.addRange(newRange)
        }
      }
    }
  }

  // Render the content with highlighted annotations
  const renderContent = () => {
    if (!content) {
      return ""
    }

    // If there are no annotations and no selection, just return the content
    if (annotations.length === 0 && !selectedText) {
      return content
    }

    // Combine annotations with current selection for rendering
    const allHighlights = [...annotations]

    // Add the current selection as a temporary highlight if it exists and not in review mode
    if (selectedText && !isReviewMode) {
      allHighlights.push({
        id: "current-selection",
        range: selectedText.range,
        color: "#FFD700", // Highlight color for current selection
        labelName: "Current Selection",
      })
    }

    // Sort highlights by start position (to handle overlapping)
    const sortedHighlights = [...allHighlights].sort((a, b) => a.range.start - b.range.start)

    const result = []
    let lastIndex = 0

    sortedHighlights.forEach((highlight) => {
      const { start, end } = highlight.range

      // Add text before this highlight
      if (start > lastIndex) {
        result.push(content.substring(lastIndex, start))
      }

      // Add the highlighted text
      const isCurrentSelection = highlight.id === "current-selection"

      result.push(
        <span
          key={highlight.id}
          style={{
            backgroundColor: isCurrentSelection ? "#FFD70080" : `${highlight.color}30`, // 30/80 is for opacity
            borderBottom: isCurrentSelection ? "2px dashed #FFD700" : `2px solid ${highlight.color}`,
            padding: "0 1px",
            borderRadius: "2px",
            cursor: isCurrentSelection ? "default" : "help",
            position: "relative",
          }}
          title={isCurrentSelection ? "Click a label to annotate this text" : `${highlight.labelName}`}
          className="group"
          data-token-start={highlight.tokenStart}
          data-token-end={highlight.tokenEnd}
          data-annotation-id={highlight.id}
        >
          {content.substring(start, end)}
          {!isCurrentSelection && (
            <span
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10"
              style={{ marginBottom: "5px" }}
            >
              {highlight.labelName}{" "}
              {highlight.tokenStart !== undefined && `(Tokens: ${highlight.tokenStart}-${highlight.tokenEnd})`}
              {isReviewMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-4 w-4 bg-red-500 hover:bg-red-600 rounded-full inline-flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveAnnotation(highlight.id)
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </span>
          )}

          {/* Add a remove button for review mode */}
          {isReviewMode && !isCurrentSelection && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation()
                onRemoveAnnotation(highlight.id)
              }}
            >
              <X className="h-3 w-3 text-white" />
            </Button>
          )}
        </span>,
      )

      lastIndex = end
    })

    // Add any remaining text
    if (lastIndex < content.length) {
      result.push(content.substring(lastIndex))
    }

    return result
  }

  return (
    <div className="space-y-4">
      {isReviewMode && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md mb-4">
          <p className="text-sm font-medium">Review Mode Active</p>
          <p className="text-xs text-muted-foreground">
            You can hover over annotations to see details and click the X to remove them.
          </p>
        </div>
      )}

      <div
        ref={textRef}
        className={`text-document p-4 border rounded-md min-h-[300px] whitespace-pre-wrap ${isReviewMode ? "bg-muted/20" : ""}`}
        onMouseUp={handleTextSelection}
      >
        {renderContent()}
      </div>

      {selectedText && !isReviewMode && (
        <div className="bg-muted p-3 rounded-md border-l-4 border-yellow-400">
          <p className="text-sm font-medium">
            Selected text: <span className="font-bold">{selectedText.text}</span>
          </p>
          {selectedText.tokenStart !== undefined && (
            <p className="text-xs text-muted-foreground">
              Token positions: {selectedText.tokenStart} to {selectedText.tokenEnd}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">Click a label from the sidebar to annotate this text</p>
        </div>
      )}

      {annotations.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Annotations:</h3>
          <div className="flex flex-wrap gap-2">
            {annotations.map((annotation) => (
              <Badge
                key={annotation.id}
                style={{ backgroundColor: annotation.color }}
                className="text-white group relative"
              >
                {annotation.text}: {annotation.labelName}
                {annotation.tokenStart !== undefined && ` (${annotation.tokenStart}-${annotation.tokenEnd})`}
                {isReviewMode && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-4 w-4 bg-red-500 hover:bg-red-600 rounded-full inline-flex items-center justify-center"
                    onClick={() => onRemoveAnnotation(annotation.id)}
                  >
                    <X className="h-3 w-3 text-white" />
                  </Button>
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {annotations.length > 0 && <AnnotationLegend annotations={annotations} />}
    </div>
  )
}

