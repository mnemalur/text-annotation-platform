"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { LabelSelector } from "@/components/label-selector"
import { TextDocument } from "@/components/text-document"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { 
  ChevronRight, 
  Undo, 
  RotateCcw, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ChevronLeft, 
  Sun, 
  Maximize2, 
  Plus, 
  Download, 
  FileText,
  ChevronDown,
  Search,
  Upload,
  Save,
  Home,
  Tags,
  Settings,
  Menu,
  X
} from "lucide-react"

interface Document {
  id: string
  title: string
  content: string
  expectedTimeMinutes: number
}

interface Label {
  id: string
  name: string
  color: string
  description: string
}

interface Annotation {
  id: string
  text: string
  range: Range
  labelId: string
  labelName: string
  color: string
}

interface CompletedDocument {
  documentId: string
  annotations: Annotation[]
  timeSpent: number
}

// Mock data - in a real app this would come from a database or API
const mockAssignedDocuments: Document[] = [
  {
    id: "doc1",
    title: "Medical Research Abstract",
    content:
      "A study conducted by Dr. Sarah Johnson at Mayo Clinic examined the effects of Metformin on patients with Type 2 Diabetes. The research, published in the New England Journal of Medicine on June 15, 2022, followed 250 patients over a period of 24 months. Results showed a significant reduction in HbA1c levels and improved insulin sensitivity in the treatment group compared to the control group receiving placebo. Side effects were minimal, with only 5% of participants reporting gastrointestinal discomfort.",
    expectedTimeMinutes: 5,
  },
  {
    id: "doc2",
    title: "News Article Excerpt",
    content:
      "SEATTLE, WA - Microsoft announced yesterday the release of their new Surface Pro 9 laptop, featuring the latest Intel Core i7 processor and improved battery life of up to 15 hours. CEO Satya Nadella presented the device during a virtual event streamed from the company's headquarters. The new laptop will be available starting November 8, 2022, with a retail price of $1,299 for the base model. Analysts from Goldman Sachs predict strong sales during the upcoming holiday season, potentially boosting Microsoft's Q4 revenue by 8%.",
    expectedTimeMinutes: 4,
  },
  {
    id: "doc3",
    title: "Legal Contract Clause",
    content:
      'This Agreement is entered into as of October 1, 2023 (the "Effective Date") by and between ABC Corporation, a Delaware corporation with offices at 123 Main Street, New York, NY 10001 ("Company"), and XYZ Consulting LLC, a California limited liability company with offices at 456 Market Street, San Francisco, CA 94105 ("Consultant"). The parties agree that Consultant shall provide strategic advisory services to Company for a period of twelve (12) months, with compensation of $15,000 per month payable on the 15th day of each month.',
    expectedTimeMinutes: 6,
  },
]

// Mock labels - in a real app this would come from a database or API
const mockLabels: Label[] = [
  { id: "label1", name: "Person", color: "#FF5733", description: "Human individuals" },
  { id: "label2", name: "Organization", color: "#33A8FF", description: "Companies, agencies, institutions" },
  { id: "label3", name: "Location", color: "#33FF57", description: "Physical locations" },
  { id: "label4", name: "Date", color: "#A033FF", description: "Calendar dates" },
  { id: "label5", name: "Product", color: "#FF33A8", description: "Commercial products" },
]

export function AnnotatorWorkspace() {
  const [currentDocIndex, setCurrentDocIndex] = useState(0)
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [selectedText, setSelectedText] = useState<{ text: string; range: Range } | null>(null)
  const [isReviewMode, setIsReviewMode] = useState(false)
  const [annotationHistory, setAnnotationHistory] = useState<Annotation[][]>([])
  const [lastSavedState, setLastSavedState] = useState<Annotation[] | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(true)
  const [completedDocuments, setCompletedDocuments] = useState<CompletedDocument[]>([])
  const [isLabelsPanelOpen, setIsLabelsPanelOpen] = useState(true)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const currentDocument = mockAssignedDocuments[currentDocIndex]
  const expectedTimeMs = currentDocument.expectedTimeMinutes * 60 * 1000
  const timeWarningThreshold = expectedTimeMs * 0.8 // 80% of expected time

  // Start timer when component mounts or document changes
  useEffect(() => {
    setElapsedTime(0)
    setIsTimerRunning(true)

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1000)
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [currentDocIndex])

  // Check if time exceeds threshold and show warning
  useEffect(() => {
    if (elapsedTime > timeWarningThreshold && elapsedTime < expectedTimeMs) {
      toast({
        title: "Time warning",
        description: `You're approaching the expected annotation time for this document`,
        variant: "destructive",
      })
    } else if (elapsedTime >= expectedTimeMs) {
      toast({
        title: "Time exceeded",
        description: `You've exceeded the expected annotation time for this document`,
        variant: "destructive",
      })
    }
  }, [elapsedTime, timeWarningThreshold, expectedTimeMs, toast])

  const formatTime = (ms: number): string => {
    const seconds = Math.floor((ms / 1000) % 60)
    const minutes = Math.floor((ms / (1000 * 60)) % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const getTimeProgressPercent = (): number => {
    return Math.min((elapsedTime / expectedTimeMs) * 100, 100)
  }

  const getTimeStatusColor = (): string => {
    if (elapsedTime < timeWarningThreshold) return "text-green-600"
    if (elapsedTime < expectedTimeMs) return "text-yellow-600"
    return "text-red-600"
  }

  const handleNextDocument = () => {
    if (annotations.length === 0) {
      toast({
        title: "No annotations",
        description: "Please add at least one annotation before proceeding",
        variant: "destructive",
      })
      return
    }

    setCompletedDocuments([
      ...completedDocuments,
      {
        documentId: currentDocument.id,
        annotations: [...annotations],
        timeSpent: elapsedTime,
      },
    ])

    if (currentDocIndex < mockAssignedDocuments.length - 1) {
      setCurrentDocIndex(currentDocIndex + 1)
      setAnnotations([])
      setAnnotationHistory([])
      setLastSavedState(null)
      setSelectedText(null)
    } else {
      toast({
        title: "All documents completed",
        description: "You have completed all assigned documents",
        variant: "destructive",
      })
    }
  }

  const handleTextSelection = (text: string, range: Range) => {
    if (!isReviewMode) {
      setSelectedText({ text, range })
    }
  }

  const handleLabelSelect = (label: Label) => {
    if (selectedText && !isReviewMode) {
      setAnnotationHistory([...annotationHistory, [...annotations]])

      const newAnnotation: Annotation = {
        id: `annotation-${Date.now()}`,
        text: selectedText.text,
        range: selectedText.range,
        labelId: label.id,
        labelName: label.name,
        color: label.color,
      }

      setAnnotations([...annotations, newAnnotation])

      toast({
        title: "Text annotated",
        description: `"${selectedText.text}" labeled as "${label.name}"`,
      })

      setSelectedText(null)
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
      }
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

  const handleUndo = () => {
    if (annotationHistory.length > 0) {
      const lastState = annotationHistory[annotationHistory.length - 1]
      setAnnotations(lastState)
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

  const handleQuickSave = () => {
    setLastSavedState([...annotations])
    toast({
      title: "State saved",
      description: "Current annotations have been saved as a checkpoint",
    })
  }

  const handleRevert = () => {
    if (lastSavedState) {
      setAnnotationHistory([...annotationHistory, [...annotations]])
      setAnnotations(lastSavedState)
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

  const handleToggleReviewMode = () => {
    setIsReviewMode(!isReviewMode)
    setSelectedText(null)
    toast({
      title: isReviewMode ? "Edit mode activated" : "Review mode activated",
      description: isReviewMode 
        ? "You can now make changes to annotations"
        : "You can now review all annotations without making changes",
    })
  }

  const handleRemoveAnnotation = (annotationId: string) => {
    if (isReviewMode) {
      toast({
        title: "Review mode active",
        description: "Switch to edit mode to remove annotations",
        variant: "destructive",
      })
      return
    }

    setAnnotationHistory([...annotationHistory, [...annotations]])
    const updatedAnnotations = annotations.filter((anno) => anno.id !== annotationId)
    setAnnotations(updatedAnnotations)
    toast({
      title: "Annotation removed",
      description: "The selected annotation has been removed",
    })
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-6 py-2 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-semibold text-cyan-500">Anuktha</h1>
          <nav className="flex">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button variant="ghost" size="sm" className="bg-zinc-900 text-white rounded-none">
              <FileText className="h-4 w-4 mr-2" />
              Annotate
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <Tags className="h-4 w-4 mr-2" />
              Labels
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </Button>
          </nav>
        </div>
      </div>

      {/* Document Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Text Annotation</h1>
          <div className="flex items-center space-x-3">
            <select className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-gray-200">
              <option>Medical Records</option>
            </select>
            <Button className="bg-zinc-900 text-white hover:bg-zinc-800">
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
          </div>
        </div>
      </div>

      {/* Document Controls */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex">
            <button className="px-4 py-2 text-sm font-medium text-gray-900 border-b-2 border-gray-900">
              Document
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
              Relationships
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between px-6 py-2 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setCurrentDocIndex(Math.max(0, currentDocIndex - 1))} disabled={currentDocIndex === 0} className="h-8 px-2">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600">Document {currentDocIndex + 1} of {mockAssignedDocuments.length}</span>
              <Button variant="ghost" size="sm" onClick={handleNextDocument} disabled={currentDocIndex === mockAssignedDocuments.length - 1} className="h-8 px-2">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleUndo} className="text-gray-700 hover:bg-gray-100 h-8 px-3">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRevert} className="text-gray-700 hover:bg-gray-100 h-8 px-3">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <div className="h-4 w-px bg-gray-200" />
            <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-gray-100 h-8 px-3">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-gray-100 h-8 px-3">
              <FileText className="h-4 w-4" />
            </Button>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center space-x-2">
              <Switch
                checked={isReviewMode}
                onCheckedChange={handleToggleReviewMode}
                className="data-[state=checked]:bg-zinc-900"
              />
              <span className="text-sm text-gray-600">Edit Mode</span>
            </div>
          </div>
        </div>
      </div>

      {/* Document Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto bg-white">
          <div className="max-w-4xl mx-auto py-6 px-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{currentDocument.title}</h2>
            </div>
            <div className="prose prose-sm max-w-none">
              <TextDocument
                content={currentDocument.content}
                annotations={annotations}
                onTextSelect={handleTextSelection}
                isReviewMode={isReviewMode}
                onRemoveAnnotation={handleRemoveAnnotation}
                selectedText={selectedText}
              />
            </div>
          </div>
        </div>

        {/* Right Labels Panel */}
        <div className="w-80 border-l border-gray-200 bg-white">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-base font-semibold text-gray-900">Labels</h2>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search labels..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Select text in the document first, then click a label to annotate.
            </p>
            <div className="space-y-1">
              {mockLabels.map((label) => (
                <button
                  key={label.id}
                  onClick={() => handleLabelSelect(label)}
                  className="w-full flex items-center px-3 py-2 rounded-md hover:bg-gray-50 transition-colors text-left"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: label.color }}
                  />
                  <span className="ml-2.5 text-sm font-medium text-gray-700">
                    {label.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

