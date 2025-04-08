"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import LabelSelector from "@/components/label-selector"
import TextDocument from "@/components/text-document"
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
  X,
  File,
  Eye,
  SkipForward
} from "lucide-react"
import { Annotation, Label as LabelType } from '../types/annotation'
import { cn } from "@/lib/utils"
import { sampleMedicalRecords } from '../data/sample-medical-records'

interface Document {
  id: string
  title: string
  content: string
  expectedTimeMinutes: number
}

interface CompletedDocument {
  documentId: string
  annotations: Annotation[]
  timeSpent: number
}

// Mock data - in a real app this would come from a database or API
const mockProjects = [
  { 
    id: "proj1", 
    name: "Medical Records", 
    documents: sampleMedicalRecords.map(record => ({
      id: record.id,
      title: record.title,
      content: record.content,
      expectedTimeMinutes: 10
    }))
  },
  { id: "proj2", name: "Legal Documents", documents: [
    { id: "doc4", title: "Contract #5678", content: "This agreement is made between...", expectedTimeMinutes: 7 },
    { id: "doc5", title: "Legal Brief #9012", content: "The plaintiff alleges that...", expectedTimeMinutes: 8 },
  ]},
  { id: "proj3", name: "Research Papers", documents: [
    { id: "doc6", title: "Research Paper #3456", content: "The methodology used in this study...", expectedTimeMinutes: 10 },
    { id: "doc7", title: "Research Paper #7890", content: "The results indicate that...", expectedTimeMinutes: 9 },
  ]},
]

export function AnnotatorWorkspace() {
  const [currentDocIndex, setCurrentDocIndex] = useState(0)
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [selectedText, setSelectedText] = useState<{ text: string; start: number; end: number } | null>(null)
  const [isReviewMode, setIsReviewMode] = useState(false)
  const [annotationHistory, setAnnotationHistory] = useState<Annotation[][]>([])
  const [lastSavedState, setLastSavedState] = useState<Annotation[] | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(true)
  const [completedDocuments, setCompletedDocuments] = useState<CompletedDocument[]>([])
  const [isLabelsPanelOpen, setIsLabelsPanelOpen] = useState(true)
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  // Get the current project and its documents
  const currentProject = selectedProjectId 
    ? mockProjects.find(p => p.id === selectedProjectId) 
    : mockProjects[0]
  
  const currentDocuments = currentProject?.documents || []
  const currentDocument = currentDocuments[currentDocIndex] || currentDocuments[0]

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

    if (currentDocIndex < currentDocuments.length - 1) {
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

  const handleTextSelection = (text: string, range: { start: number; end: number }, tokenStart: number, tokenEnd: number) => {
    if (!isReviewMode) {
      setSelectedText({ text, start: range.start, end: range.end })
    }
  }

  const handleLabelSelect = (label: LabelType) => {
    if (selectedText) {
      const newAnnotation: Annotation = {
        id: `annotation-${Date.now()}`,
        text: selectedText.text,
        range: { start: selectedText.start, end: selectedText.end },
        tokenStart: selectedText.start,
        tokenEnd: selectedText.end,
        labelId: label.id,
        labelName: label.name,
        color: label.color
      }

      setAnnotationHistory([...annotationHistory, [...annotations]])
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
    <div className="flex flex-col h-full">
      {/* Document Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Text Annotation</h1>
          <div className="flex items-center space-x-3">
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
              <span className="text-sm text-gray-600">Document {currentDocIndex + 1} of {currentDocuments.length}</span>
              <Button variant="ghost" size="sm" onClick={handleNextDocument} disabled={currentDocIndex === currentDocuments.length - 1} className="h-8 px-2">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleUndo}
                className="rounded-full hover:bg-primary/10 hover:text-primary h-8 px-3"
              >
                <Undo className="h-4 w-4 mr-1" />
                Undo
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full hover:bg-blue-500/10 hover:text-blue-500 h-8 px-3"
              >
                <Eye className="h-4 w-4 mr-1" />
                Review
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full hover:bg-green-500/10 hover:text-green-500 h-8 px-3"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full hover:bg-orange-500/10 hover:text-orange-500 h-8 px-3"
              >
                <SkipForward className="h-4 w-4 mr-1" />
                Skip
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
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
        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-white">
          <div className="max-w-4xl mx-auto py-6 px-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{currentDocument?.title}</h2>
            </div>
            <div className="prose prose-sm max-w-none">
              <TextDocument
                content={currentDocument?.content || ""}
                annotations={annotations}
                onTextSelect={handleTextSelection}
                isReviewMode={isReviewMode}
                onRemoveAnnotation={handleRemoveAnnotation}
                className="min-h-[600px] text-base leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Right Labels Panel */}
        <div className={cn(
          "border-l border-gray-200 bg-white relative transition-all duration-300",
          isLabelsPanelOpen ? "w-80" : "w-12"
        )}>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -left-3 top-4 z-10 h-6 w-6 rounded-full border bg-background"
            onClick={() => setIsLabelsPanelOpen(!isLabelsPanelOpen)}
          >
            {isLabelsPanelOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          
          <div className="p-4">
            {isLabelsPanelOpen && (
              <div className="space-y-4">
                <LabelSelector
                  onLabelSelect={handleLabelSelect}
                  isReviewMode={isReviewMode}
                  selectedText={selectedText?.text || null}
                  selectedLabelId={null}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

