"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import LabelSelector from "@/components/label-selector"
import TextDocument from "@/components/text-document"
import { RelationshipCreator } from "@/components/relationship-creator"
import { SaveAnnotationButton } from "@/components/save-annotation-button"
import { LoadAnnotationsDialog } from "@/components/load-annotations-dialog"
import { useToast } from "@/components/ui/use-toast"
import { ChevronLeft, ChevronRight, Save, Upload, Undo, Eye, Edit, RotateCcw, CheckCircle, EyeOff, SkipForward, Timer } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Annotation, Relationship, Session } from "@/types/annotation"
import { Label as LabelType } from "@/types/annotation"
import { Progress } from "@/components/ui/progress"
import { v4 as uuidv4 } from "uuid"

// Mock data - in a real app this would come from a database or API
const mockDocuments = [
  {
    id: "doc1",
    title: "Medical Research Abstract",
    content:
      "A study conducted by Dr. Sarah Johnson at Mayo Clinic examined the effects of Metformin on patients with Type 2 Diabetes. The research, published in the New England Journal of Medicine on June 15, 2022, followed 250 patients over a period of 24 months. Results showed a significant reduction in HbA1c levels and improved insulin sensitivity in the treatment group compared to the control group receiving placebo. Side effects were minimal, with only 5% of participants reporting gastrointestinal discomfort.",
  },
  {
    id: "doc2",
    title: "News Article Excerpt",
    content:
      "SEATTLE, WA - Microsoft announced yesterday the release of their new Surface Pro 9 laptop, featuring the latest Intel Core i7 processor and improved battery life of up to 15 hours. CEO Satya Nadella presented the device during a virtual event streamed from the company's headquarters. The new laptop will be available starting November 8, 2022, with a retail price of $1,299 for the base model. Analysts from Goldman Sachs predict strong sales during the upcoming holiday season, potentially boosting Microsoft's Q4 revenue by 8%.",
  },
  {
    id: "doc3",
    title: "Legal Contract Clause",
    content:
      'This Agreement is entered into as of October 1, 2023 (the "Effective Date") by and between ABC Corporation, a Delaware corporation with offices at 123 Main Street, New York, NY 10001 ("Company"), and XYZ Consulting LLC, a California limited liability company with offices at 456 Market Street, San Francisco, CA 94105 ("Consultant"). The parties agree that Consultant shall provide strategic advisory services to Company for a period of twelve (12) months, with compensation of $15,000 per month payable on the 15th day of each month.',
  },
]

// Mock saved annotation sessions - in a real app this would be stored in a database
const mockSavedSessions = [
  {
    id: "session1",
    name: "Medical Terms - First Pass",
    date: "2023-10-15T14:30:00Z",
    documentId: "doc1",
    annotations: [
      {
        id: "anno1",
        text: "Dr. Sarah Johnson",
        range: { start: 20, end: 36 },
        tokenStart: 4,
        tokenEnd: 6,
        labelId: "label1",
        labelName: "Person",
        color: "#FF5733",
      },
      {
        id: "anno2",
        text: "Mayo Clinic",
        range: { start: 40, end: 51 },
        tokenStart: 8,
        tokenEnd: 9,
        labelId: "label2",
        labelName: "Organization",
        color: "#33A8FF",
      },
      {
        id: "anno3",
        text: "Metformin",
        range: { start: 69, end: 78 },
        tokenStart: 13,
        tokenEnd: 13,
        labelId: "label5",
        labelName: "Product",
        color: "#FF33A8",
      },
    ],
    relationships: [],
  },
  {
    id: "session2",
    name: "Tech Companies",
    date: "2023-10-16T09:15:00Z",
    documentId: "doc2",
    annotations: [
      {
        id: "anno4",
        text: "Microsoft",
        range: { start: 12, end: 21 },
        tokenStart: 2,
        tokenEnd: 2,
        labelId: "label2",
        labelName: "Organization",
        color: "#33A8FF",
      },
      {
        id: "anno5",
        text: "Surface Pro 9",
        range: { start: 52, end: 65 },
        tokenStart: 10,
        tokenEnd: 12,
        labelId: "label5",
        labelName: "Product",
        color: "#FF33A8",
      },
    ],
    relationships: [],
  },
]

interface TextRange {
  start: number
  end: number
}

export default function AnnotationWorkspace() {
  const [currentDocIndex, setCurrentDocIndex] = useState(0)
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [relationships, setRelationships] = useState<Relationship[]>([])
  const [selectedTab, setSelectedTab] = useState("document")
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [selectedRange, setSelectedRange] = useState<TextRange | null>(null)
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null)
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false)
  const [savedSessions, setSavedSessions] = useState<Session[]>(mockSavedSessions)
  const [isReviewMode, setIsReviewMode] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes in seconds
  const [isTimerPaused, setIsTimerPaused] = useState(false)

  // For undo functionality
  const [annotationHistory, setAnnotationHistory] = useState<Annotation[][]>([])
  const [relationshipHistory, setRelationshipHistory] = useState<Relationship[][]>([])
  const [lastSavedState, setLastSavedState] = useState<{
    annotations: Annotation[]
    relationships: Relationship[]
  } | null>(null)

  const { toast } = useToast()

  const currentDocument = mockDocuments[currentDocIndex]

  // Initialize or reset the annotation history when changing documents
  useEffect(() => {
    setAnnotationHistory([])
    setRelationshipHistory([])
    setLastSavedState(null)
  }, [currentDocIndex])

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !isTimerPaused) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)

      return () => clearInterval(timer)
    } else if (timeRemaining === 0) {
      toast({
        title: "Time's up!",
        description: "Please save or skip this document.",
        variant: "destructive",
      })
    }
  }, [timeRemaining, isTimerPaused])

  const handlePrevDocument = () => {
    if (currentDocIndex > 0) {
      setCurrentDocIndex(currentDocIndex - 1)
      // Reset annotations and relationships when changing documents
      setAnnotations([])
      setRelationships([])
      setSelectedText(null)
      setSelectedRange(null)
      setSelectedLabelId(null)
    }
  }

  const handleNextDocument = () => {
    if (currentDocIndex < mockDocuments.length - 1) {
      setCurrentDocIndex(currentDocIndex + 1)
      // Reset annotations and relationships when changing documents
      setAnnotations([])
      setRelationships([])
      setSelectedText(null)
      setSelectedRange(null)
      setSelectedLabelId(null)
    }
  }

  // Memoize handlers
  const handleTextSelection = (text: string, range: TextRange, tokenStart: number, tokenEnd: number) => {
    setSelectedText(text)
    setSelectedRange(range)
    setSelectedLabelId(null) // Reset selected label when new text is selected
  }

  const handleLabelSelect = (label: LabelType) => {
    if (selectedText && selectedRange) {
      const annotation: Annotation = {
        id: Math.random().toString(36).substring(2, 15),
        text: selectedText,
        range: selectedRange,
        labelId: label.id,
        labelName: label.name,
        color: label.color,
        tokenStart: selectedRange.start,
        tokenEnd: selectedRange.end
      }
      setAnnotations([...annotations, annotation])
      setSelectedText(null)
      setSelectedRange(null)
      setSelectedLabelId(label.id)

      // Show success message
      toast({
        title: "Text annotated",
        description: `"${selectedText}" labeled as "${label.name}"`,
      })
    }
  }

  // Memoize filtered relationships
  const filteredRelationships = useMemo(() => {
    return relationships.filter(rel => 
      annotations.some(a => a.id === rel.sourceId) && 
      annotations.some(a => a.id === rel.targetId)
    )
  }, [relationships, annotations])

  const handleAddRelationship = useCallback((relationship: Relationship) => {
    setRelationshipHistory(prev => [...prev, [...relationships]])
    setRelationships(prev => [...prev, relationship])
  }, [relationships])

  const handleSaveAnnotations = (sessionName: string) => {
    const newSession: Session = {
      id: `session-${Date.now()}`,
      name: sessionName,
      date: new Date().toISOString(),
      documentId: currentDocument.id,
      annotations: [...annotations],
      relationships: [...relationships],
    }

    setSavedSessions([...savedSessions, newSession])
    setLastSavedState({
      annotations: [...annotations],
      relationships: [...relationships],
    })

    toast({
      title: "Annotations saved",
      description: `Saved ${annotations.length} annotations and ${relationships.length} relationships as "${sessionName}"`,
    })

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(newSession))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `${sessionName.replace(/\s+/g, "_")}.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const handleLoadSession = (sessionId: string) => {
    const session = savedSessions.find((s) => s.id === sessionId)
    if (session) {
      setAnnotations(session.annotations)
      setRelationships(session.relationships)
      setIsLoadDialogOpen(false)
      toast({
        title: "Annotations loaded",
        description: `Loaded ${session.annotations.length} annotations and ${session.relationships.length} relationships`,
      })
    }
  }

  const handleExportAnnotations = () => {
    // Create an export object with all the necessary data
    const exportData = {
      document: {
        id: currentDocument.id,
        title: currentDocument.title,
        content: currentDocument.content,
      },
      annotations: annotations,
      relationships: relationships,
      metadata: {
        exportDate: new Date().toISOString(),
        annotator: "Current User", // In a real app, this would be the actual user
      },
    }

    // Convert to JSON and create a download link
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `annotations_${currentDocument.id}_${Date.now()}.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()

    toast({
      title: "Annotations exported",
      description: "Annotations have been exported as JSON file",
    })
  }

  // Undo the last annotation
  const handleUndo = () => {
    if (annotationHistory.length > 0) {
      // Get the last state from history
      const lastState = annotationHistory[annotationHistory.length - 1]

      // Update annotations to the previous state
      setAnnotations(lastState)

      // Remove the last state from history
      setAnnotationHistory(annotationHistory.slice(0, -1))

      toast({
        title: "Undo successful",
        description: "Reverted to previous annotation state",
      })
    } else {
      toast({
        title: "Nothing to undo",
        description: "No previous annotation states available",
        variant: "destructive",
      })
    }
  }

  // Revert to last saved state
  const handleRevert = () => {
    if (lastSavedState) {
      // Save current state to history before reverting
      setAnnotationHistory([...annotationHistory, [...annotations]])

      setAnnotations(lastSavedState.annotations)
      setRelationships(lastSavedState.relationships)

      toast({
        title: "Reverted to saved state",
        description: "All changes since last save have been discarded",
      })
    } else {
      toast({
        title: "No saved state",
        description: "There is no saved state to revert to",
        variant: "destructive",
      })
    }
  }

  // Quick save current state
  const handleQuickSave = () => {
    // Save the current state as the last saved state
    setLastSavedState({
      annotations: [...annotations],
      relationships: [...relationships],
    })

    toast({
      title: "State saved",
      description: "Current annotations have been saved as a checkpoint",
    })
  }

  // Remove a specific annotation
  const handleRemoveAnnotation = (annotationId: string) => {
    if (isReviewMode) {
      toast({
        title: "Review mode active",
        description: "Switch to edit mode to remove annotations",
        variant: "destructive",
      })
      return
    }

    // Save current state to history before making changes
    setAnnotationHistory([...annotationHistory, [...annotations]])

    // Filter out the annotation to remove
    const updatedAnnotations = annotations.filter((anno) => anno.id !== annotationId)
    setAnnotations(updatedAnnotations)

    toast({
      title: "Annotation removed",
      description: "The selected annotation has been removed",
    })
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}'`
  }

  const handleSkipDocument = () => {
    handleNextDocument()
    setTimeRemaining(300) // Reset timer
    toast({
      title: "Document skipped",
      description: "Moving to next document",
    })
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel defaultSize={70} minSize={50}>
        <Card className="h-full p-4">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevDocument}
                  disabled={currentDocIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  Document {currentDocIndex + 1} of {mockDocuments.length}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextDocument}
                  disabled={currentDocIndex === mockDocuments.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  <span className="text-sm font-medium">{formatTime(timeRemaining)}</span>
                  <Progress value={(timeRemaining / 300) * 100} className="w-24" />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTimerPaused(!isTimerPaused)}
                >
                  {isTimerPaused ? "Resume" : "Pause"}
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUndo}
                  disabled={annotationHistory.length === 0}
                >
                  <Undo className="h-4 w-4 mr-1" />
                  Undo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsReviewMode(!isReviewMode)}
                >
                  {isReviewMode ? (
                    <>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </>
                  )}
                </Button>
                <SaveAnnotationButton onClick={handleSaveAnnotations} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSkipDocument}
                >
                  <SkipForward className="h-4 w-4 mr-1" />
                  Skip
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <TextDocument
                content={currentDocument.content}
                annotations={annotations}
                onTextSelect={handleTextSelection}
                isReviewMode={isReviewMode}
                onRemoveAnnotation={handleRemoveAnnotation}
                className="min-h-[600px] text-base leading-relaxed"
              />
            </div>
          </div>
        </Card>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={30} minSize={25}>
        <div className="h-full flex flex-col">
          <Tabs defaultValue="labels" className="flex-1">
            <TabsList className="w-full">
              <TabsTrigger value="labels" className="flex-1">Labels</TabsTrigger>
              <TabsTrigger value="relationships" className="flex-1">Relationships</TabsTrigger>
            </TabsList>
            <TabsContent value="labels" className="flex-1">
              <LabelSelector
                onLabelSelect={handleLabelSelect}
                isReviewMode={isReviewMode}
                selectedText={selectedText}
                selectedLabelId={selectedLabelId}
              />
            </TabsContent>
            <TabsContent value="relationships" className="flex-1">
              <RelationshipCreator
                annotations={annotations}
                relationships={relationships}
                onAddRelationship={handleAddRelationship}
                isReviewMode={isReviewMode}
              />
            </TabsContent>
          </Tabs>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

