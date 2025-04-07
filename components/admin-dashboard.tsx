"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { BarChart, CheckCircle, Download, FileText, Users } from "lucide-react"

// Mock data - in a real app this would come from a database or API
const mockProjects = [
  { id: "proj1", name: "Medical Records", description: "Annotating medical records for symptoms and diagnoses" },
  { id: "proj2", name: "News Articles", description: "Identifying entities and events in news articles" },
]

const mockAnnotators = [
  { id: "user1", name: "John Doe", email: "john@example.com", completedTasks: 24, totalTasks: 30 },
  { id: "user2", name: "Jane Smith", email: "jane@example.com", completedTasks: 18, totalTasks: 30 },
  { id: "user3", name: "Bob Johnson", email: "bob@example.com", completedTasks: 30, totalTasks: 30 },
]

const mockDocuments = [
  {
    id: "doc1",
    title: "Medical Research Abstract",
    annotators: ["user1", "user2", "user3"],
    agreementScore: 0.85,
    status: "completed",
  },
  {
    id: "doc2",
    title: "News Article Excerpt",
    annotators: ["user1", "user2"],
    agreementScore: 0.72,
    status: "in-progress",
  },
  {
    id: "doc3",
    title: "Legal Contract Clause",
    annotators: ["user2", "user3"],
    agreementScore: 0.91,
    status: "completed",
  },
]

// Mock annotation data for comparison
const mockAnnotationSets = {
  doc1: {
    user1: [
      {
        id: "a1",
        text: "Dr. Sarah Johnson",
        range: { start: 20, end: 36 },
        tokenStart: 4,
        tokenEnd: 6,
        labelId: "label1",
        labelName: "Person",
        color: "#FF5733",
      },
      {
        id: "a2",
        text: "Mayo Clinic",
        range: { start: 40, end: 51 },
        tokenStart: 8,
        tokenEnd: 9,
        labelId: "label2",
        labelName: "Organization",
        color: "#33A8FF",
      },
      {
        id: "a3",
        text: "Metformin",
        range: { start: 69, end: 78 },
        tokenStart: 13,
        tokenEnd: 13,
        labelId: "label5",
        labelName: "Product",
        color: "#FF33A8",
      },
    ],
    user2: [
      {
        id: "a4",
        text: "Dr. Sarah Johnson",
        range: { start: 20, end: 36 },
        tokenStart: 4,
        tokenEnd: 6,
        labelId: "label1",
        labelName: "Person",
        color: "#FF5733",
      },
      {
        id: "a5",
        text: "Mayo Clinic",
        range: { start: 40, end: 51 },
        tokenStart: 8,
        tokenEnd: 9,
        labelId: "label2",
        labelName: "Organization",
        color: "#33A8FF",
      },
      {
        id: "a6",
        text: "Type 2 Diabetes",
        range: { start: 82, end: 97 },
        tokenStart: 15,
        tokenEnd: 17,
        labelId: "label6",
        labelName: "Condition",
        color: "#33FFEC",
      },
    ],
    user3: [
      {
        id: "a7",
        text: "Dr. Sarah Johnson",
        range: { start: 20, end: 36 },
        tokenStart: 4,
        tokenEnd: 6,
        labelId: "label1",
        labelName: "Person",
        color: "#FF5733",
      },
      {
        id: "a8",
        text: "Mayo Clinic",
        range: { start: 40, end: 51 },
        tokenStart: 8,
        tokenEnd: 9,
        labelId: "label2",
        labelName: "Organization",
        color: "#33A8FF",
      },
      {
        id: "a9",
        text: "Metformin",
        range: { start: 69, end: 78 },
        tokenStart: 13,
        tokenEnd: 13,
        labelId: "label5",
        labelName: "Product",
        color: "#FF33A8",
      },
      {
        id: "a10",
        text: "Type 2 Diabetes",
        range: { start: 82, end: 97 },
        tokenStart: 15,
        tokenEnd: 17,
        labelId: "label6",
        labelName: "Condition",
        color: "#33FFEC",
      },
    ],
  },
}

export function AdminDashboard() {
  const [selectedProject, setSelectedProject] = useState(mockProjects[0].id)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [groundTruth, setGroundTruth] = useState(null)
  const { toast } = useToast()

  const handleExportData = () => {
    toast({
      title: "Data exported",
      description: "The annotated data has been exported successfully",
    })

    // Create a download link for the export
    const exportData = {
      project: mockProjects.find((p) => p.id === selectedProject),
      documents: mockDocuments,
      annotations: mockAnnotationSets,
      groundTruth: groundTruth,
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `project_export_${selectedProject}_${Date.now()}.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const handleGenerateGroundTruth = () => {
    // In a real app, this would use a more sophisticated algorithm
    // Here we'll use a simple majority voting approach

    // Get all documents with completed annotations
    const completedDocs = mockDocuments.filter((doc) => doc.status === "completed")

    const generatedGroundTruth = {}

    completedDocs.forEach((doc) => {
      if (mockAnnotationSets[doc.id]) {
        const annotators = doc.annotators
        const allAnnotations = []

        // Collect all annotations from all annotators
        annotators.forEach((annotatorId) => {
          const annotatorSet = mockAnnotationSets[doc.id][annotatorId] || []
          allAnnotations.push(...annotatorSet)
        })

        // Group annotations by token positions
        const groupedByPosition = {}

        allAnnotations.forEach((annotation) => {
          const key = `${annotation.tokenStart}-${annotation.tokenEnd}`
          if (!groupedByPosition[key]) {
            groupedByPosition[key] = []
          }
          groupedByPosition[key].push(annotation)
        })

        // For each position, select the most common label
        const consensusAnnotations = []

        Object.keys(groupedByPosition).forEach((posKey) => {
          const annotations = groupedByPosition[posKey]

          // Count label occurrences
          const labelCounts = {}
          annotations.forEach((anno) => {
            if (!labelCounts[anno.labelId]) {
              labelCounts[anno.labelId] = 0
            }
            labelCounts[anno.labelId]++
          })

          // Find the most common label
          let maxCount = 0
          let maxLabelId = null

          Object.keys(labelCounts).forEach((labelId) => {
            if (labelCounts[labelId] > maxCount) {
              maxCount = labelCounts[labelId]
              maxLabelId = labelId
            }
          })

          // If there's a majority (more than half of annotators agree)
          if (maxCount > annotators.length / 2) {
            // Use the first annotation with this label as the template
            const template = annotations.find((a) => a.labelId === maxLabelId)

            consensusAnnotations.push({
              ...template,
              id: `gt-${template.id}`,
              confidence: maxCount / annotators.length,
            })
          }
        })

        generatedGroundTruth[doc.id] = consensusAnnotations
      }
    })

    setGroundTruth(generatedGroundTruth)

    toast({
      title: "Ground truth generated",
      description: `Generated ground truth for ${Object.keys(generatedGroundTruth).length} documents based on annotator consensus`,
    })
  }

  const handleViewComparison = (docId) => {
    setSelectedDocument(docId)
  }

  return (
    <Tabs defaultValue="overview">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="annotators">Annotators</TabsTrigger>
        <TabsTrigger value="comparison">Comparison</TabsTrigger>
      </TabsList>

      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium">Project:</label>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {mockProjects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="ml-auto space-x-2">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" /> Export Data
            </Button>
            <Button onClick={handleGenerateGroundTruth}>
              <CheckCircle className="mr-2 h-4 w-4" /> Generate Ground Truth
            </Button>
          </div>
        </div>
      </div>

      <TabsContent value="overview">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockDocuments.length}</div>
              <p className="text-xs text-muted-foreground">
                {mockDocuments.filter((d) => d.status === "completed").length} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Annotators</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnnotators.length}</div>
              <p className="text-xs text-muted-foreground">
                {mockAnnotators.filter((a) => a.completedTasks === a.totalTasks).length} completed all tasks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Agreement</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(mockDocuments.reduce((acc, doc) => acc + doc.agreementScore, 0) / mockDocuments.length).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Inter-annotator agreement score</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Document Status</CardTitle>
            <CardDescription>Annotation progress across all documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDocuments.map((doc) => (
                <div key={doc.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{doc.title}</span>
                    </div>
                    <Badge variant={doc.status === "completed" ? "default" : "outline"}>
                      {doc.status === "completed" ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">Annotators: </span>
                      {doc.annotators.length} / {mockAnnotators.length}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Agreement: </span>
                      {doc.agreementScore.toFixed(2)}
                    </div>
                  </div>
                  <Progress value={doc.status === "completed" ? 100 : 75} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="annotators">
        <Card>
          <CardHeader>
            <CardTitle>Annotator Performance</CardTitle>
            <CardDescription>Progress and statistics for each annotator</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockAnnotators.map((annotator) => (
                <div key={annotator.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{annotator.name}</h3>
                      <p className="text-sm text-muted-foreground">{annotator.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {annotator.completedTasks} / {annotator.totalTasks} tasks
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {Math.round((annotator.completedTasks / annotator.totalTasks) * 100)}% complete
                      </p>
                    </div>
                  </div>
                  <Progress value={(annotator.completedTasks / annotator.totalTasks) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="comparison">
        <Card>
          <CardHeader>
            <CardTitle>Annotation Comparison</CardTitle>
            <CardDescription>Compare annotations across different annotators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockDocuments.map((doc) => (
                <div key={doc.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{doc.title}</h3>
                    <Badge variant={doc.agreementScore > 0.8 ? "default" : "outline"}>
                      {doc.agreementScore > 0.8 ? "High Agreement" : "Needs Review"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Agreement Score:</span>
                      <span className="font-medium">{doc.agreementScore.toFixed(2)}</span>
                    </div>
                    <Progress value={doc.agreementScore * 100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Annotators</h4>
                    <div className="flex flex-wrap gap-2">
                      {doc.annotators.map((annotatorId) => {
                        const annotator = mockAnnotators.find((a) => a.id === annotatorId)
                        return (
                          <Badge key={annotatorId} variant="outline">
                            {annotator?.name}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>

                  {selectedDocument === doc.id ? (
                    <div className="mt-4 p-4 border rounded-md bg-muted/30">
                      <h4 className="font-medium mb-3">Annotation Comparison</h4>

                      <div className="space-y-4">
                        {doc.annotators.map((annotatorId) => {
                          const annotator = mockAnnotators.find((a) => a.id === annotatorId)
                          const annotations = mockAnnotationSets[doc.id]?.[annotatorId] || []

                          return (
                            <div key={annotatorId} className="space-y-2">
                              <h5 className="text-sm font-medium">{annotator?.name}</h5>
                              <div className="flex flex-wrap gap-2">
                                {annotations.map((anno) => (
                                  <Badge key={anno.id} style={{ backgroundColor: anno.color }} className="text-white">
                                    {anno.text}: {anno.labelName} ({anno.tokenStart}-{anno.tokenEnd})
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )
                        })}

                        {groundTruth && groundTruth[doc.id] && (
                          <div className="mt-4 pt-4 border-t">
                            <h5 className="text-sm font-medium">Generated Ground Truth</h5>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {groundTruth[doc.id].map((anno) => (
                                <Badge key={anno.id} style={{ backgroundColor: anno.color }} className="text-white">
                                  {anno.text}: {anno.labelName} ({anno.tokenStart}-{anno.tokenEnd})
                                  <span className="ml-1 text-xs">({Math.round(anno.confidence * 100)}%)</span>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm" onClick={() => setSelectedDocument(null)}>
                          Close
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" onClick={() => handleViewComparison(doc.id)}>
                        View Comparison
                      </Button>
                    </div>
                  )}

                  <Separator />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

