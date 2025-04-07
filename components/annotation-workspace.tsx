"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { LabelSelector } from "@/components/label-selector"
import { TextDocument } from "@/components/text-document"
import { RelationshipCreator } from "@/components/relationship-creator"
import { SaveAnnotationButton } from "@/components/save-annotation-button"
import { LoadAnnotationsDialog } from "@/components/load-annotations-dialog"
import { useToast } from "@/components/ui/use-toast"
import { ChevronLeft, ChevronRight, Save, Upload, Undo, Eye, Edit, RotateCcw, CheckCircle } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

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

export function AnnotationWorkspace() {
  const [currentDocIndex, setCurrentDocIndex] = useState(0)
  const [annotations, setAnnotations] = useState([])
  const [relationships, setRelationships] = useState([])
  const [selectedTab, setSelectedTab] = useState("document")
  const [selectedText, setSelectedText] = useState(null)
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false)
  const [savedSessions, setSavedSessions] = useState(mockSavedSessions)
  const [isReviewMode, setIsReviewMode] = useState(false)

  // For undo functionality
  const [annotationHistory, setAnnotationHistory] = useState([])
  const [lastSavedState, setLastSavedState] = useState(null)

  const { toast } = useToast()

  const currentDocument = mockDocuments[currentDocIndex]

  // Initialize or reset the annotation history when changing documents
  useEffect(() => {
    setAnnotationHistory([])
    setLastSavedState(null)
  }, [currentDocIndex])

  const handlePrevDocument = () => {
    if (currentDocIndex > 0) {
      setCurrentDocIndex(currentDocIndex - 1)
      // Reset annotations and relationships when changing documents
      setAnnotations([])
      setRelationships([])
      setSelectedText(null)
    }
  }

  const handleNextDocument = () => {
    if (currentDocIndex < mockDocuments.length - 1) {
      setCurrentDocIndex(currentDocIndex + 1)
      // Reset annotations and relationships when changing documents
      setAnnotations([])
      setRelationships([])
      setSelectedText(null)
    }
  }

  const handleTextSelection = (text, range) => {
    if (!isReviewMode) {
      setSelectedText({ text, range })
    }
  }

  const handleLabelSelect = (label) => {
    if (selectedText && !isReviewMode) {
      // Save current state to history before making changes
      setAnnotationHistory([...annotationHistory, [...annotations]])

      const newAnnotation = {
        id: `annotation-${Date.now()}`,
        text: selectedText.text,
        range: selectedText.range,
        tokenStart: selectedText.tokenStart,
        tokenEnd: selectedText.tokenEnd,
        labelId: label.id,
        labelName: label.name,
        color: label.color,
      }

      setAnnotations([...annotations, newAnnotation])

      toast({
        title: "Text annotated",
        description: `"${selectedText.text}" labeled as "${label.name}"`,
      })

      // Clear the selection
      setSelectedText(null)
      window.getSelection().removeAllRanges()
    } else if (isReviewMode) {
      toast({
        title: "Review mode active",
        description: "Switch to edit mode to add new annotations",
        variant: "destructive",
      })
    } else {
      toast({
        title: "No text selected",
        description: "Please select some text before choosing a label",
        variant: "destructive",
      })
    }
  }

  const handleAddRelationship = (relationship) => {
    // Save current state to history before making changes
    setAnnotationHistory([...annotationHistory, [...relationships]])
    setRelationships([...relationships, relationship])
  }

  const handleSaveAnnotations = (sessionName) => {
    // Create a new session object
    const newSession = {
      id: `session-${Date.now()}`,
      name: sessionName,
      date: new Date().toISOString(),
      documentId: currentDocument.id,
      annotations: [...annotations],
      relationships: [...relationships],
    }

    // In a real app, this would save to a database or API
    // For now, we'll just add it to our mock saved sessions
    setSavedSessions([...savedSessions, newSession])

    // Save the current state as the last saved state
    setLastSavedState({
      annotations: [...annotations],
      relationships: [...relationships],
    })

    toast({
      title: "Annotations saved",
      description: `Saved ${annotations.length} annotations and ${relationships.length} relationships as "${sessionName}"`,
    })

    // In a real app, you might want to download the annotations as JSON
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(newSession))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `${sessionName.replace(/\s+/g, "_")}.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const handleLoadAnnotations = (sessionId) => {
    const session = savedSessions.find((s) => s.id === sessionId)
    if (session) {
      // Find the document index
      const docIndex = mockDocuments.findIndex((d) => d.id === session.documentId)
      if (docIndex !== -1) {
        // Save current state to history before loading
        setAnnotationHistory([...annotationHistory, [...annotations]])

        setCurrentDocIndex(docIndex)
        setAnnotations(session.annotations)
        setRelationships(session.relationships)

        // Set this as the last saved state
        setLastSavedState({
          annotations: [...session.annotations],
          relationships: [...session.relationships],
        })

        toast({
          title: "Annotations loaded",
          description: `Loaded ${session.annotations.length} annotations and ${session.relationships.length} relationships from "${session.name}"`,
        })

        setIsLoadDialogOpen(false)
      }
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

  // Toggle between edit and review modes
  const handleToggleReviewMode = () => {
    setIsReviewMode(!isReviewMode)
    setSelectedText(null)

    if (!isReviewMode) {
      toast({
        title: "Review mode activated",
        description: "You can now review all annotations without making changes",
      })
    } else {
      toast({
        title: "Edit mode activated",
        description: "You can now make changes to annotations",
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
  const handleRemoveAnnotation = (annotationId) => {
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

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePrevDocument} disabled={currentDocIndex === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
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
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch id="review-mode" checked={isReviewMode} onCheckedChange={handleToggleReviewMode} />
            <Label htmlFor="review-mode" className="text-sm">
              {isReviewMode ? (
                <span className="flex items-center">
                  <Eye className="mr-1 h-4 w-4" /> Review Mode
                </span>
              ) : (
                <span className="flex items-center">
                  <Edit className="mr-1 h-4 w-4" /> Edit Mode
                </span>
              )}
            </Label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleUndo} disabled={annotationHistory.length === 0}>
            <Undo className="mr-2 h-4 w-4" /> Undo
          </Button>
          <Button variant="outline" onClick={handleRevert} disabled={!lastSavedState}>
            <RotateCcw className="mr-2 h-4 w-4" /> Revert
          </Button>
          <Button variant="outline" onClick={handleQuickSave} disabled={annotations.length === 0}>
            <CheckCircle className="mr-2 h-4 w-4" /> Save State
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsLoadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" /> Load
          </Button>
          <Button variant="outline" onClick={handleExportAnnotations} disabled={annotations.length === 0}>
            <Save className="mr-2 h-4 w-4" /> Export
          </Button>
          <SaveAnnotationButton onClick={handleSaveAnnotations} disabled={annotations.length === 0} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="document">Document</TabsTrigger>
              <TabsTrigger value="relationships">Relationships</TabsTrigger>
            </TabsList>
            <TabsContent value="document" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{currentDocument.title}</h2>
                  <Separator className="my-2" />
                  <TextDocument
                    content={currentDocument.content}
                    annotations={annotations}
                    onTextSelect={handleTextSelection}
                    selectedText={selectedText}
                    isReviewMode={isReviewMode}
                    onRemoveAnnotation={handleRemoveAnnotation}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="relationships" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <RelationshipCreator
                    annotations={annotations}
                    relationships={relationships}
                    onAddRelationship={handleAddRelationship}
                    isReviewMode={isReviewMode}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <LabelSelector
            onSelectLabel={handleLabelSelect}
            isTextSelected={!!selectedText}
            isReviewMode={isReviewMode}
          />
        </div>
      </div>

      <LoadAnnotationsDialog
        open={isLoadDialogOpen}
        onOpenChange={setIsLoadDialogOpen}
        savedSessions={savedSessions}
        onLoadSession={handleLoadAnnotations}
        currentDocumentId={currentDocument.id}
      />
    </div>
  )
}

