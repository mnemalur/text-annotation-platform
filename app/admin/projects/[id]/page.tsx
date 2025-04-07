'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Users, FileText, CheckCircle, AlertCircle } from 'lucide-react'

interface AnnotatorProgress {
  id: string
  name: string
  assignedCount: number
  completedCount: number
  accuracy?: number
}

interface ProjectStats {
  totalDocuments: number
  annotatedDocuments: number
  pendingDocuments: number
  totalAnnotators: number
  averageAccuracy: number
}

export default function ProjectDashboard({ params }: { params: { id: string } }) {
  // Mock data - replace with actual API calls
  const [stats] = useState<ProjectStats>({
    totalDocuments: 1000,
    annotatedDocuments: 450,
    pendingDocuments: 550,
    totalAnnotators: 8,
    averageAccuracy: 92.5
  })

  const [annotators] = useState<AnnotatorProgress[]>([
    {
      id: '1',
      name: 'John Doe',
      assignedCount: 200,
      completedCount: 150,
      accuracy: 94.2
    },
    {
      id: '2',
      name: 'Jane Smith',
      assignedCount: 200,
      completedCount: 180,
      accuracy: 91.8
    },
    // Add more annotators...
  ])

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        {/* Project Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Medical Research Annotations</CardTitle>
                <CardDescription>Project progress and statistics</CardDescription>
              </div>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">{stats.totalDocuments}</div>
                  <p className="text-sm text-gray-500">Total Documents</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.annotatedDocuments}
                  </div>
                  <p className="text-sm text-gray-500">Annotated</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.pendingDocuments}
                  </div>
                  <p className="text-sm text-gray-500">Pending</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.averageAccuracy}%
                  </div>
                  <p className="text-sm text-gray-500">Average Accuracy</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Overall Progress</div>
                <div className="text-sm text-gray-500">
                  {Math.round((stats.annotatedDocuments / stats.totalDocuments) * 100)}%
                </div>
              </div>
              <Progress
                value={(stats.annotatedDocuments / stats.totalDocuments) * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Annotators Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Annotators Progress</CardTitle>
            <CardDescription>
              Individual annotator performance and progress tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {annotators.map((annotator) => (
                <div key={annotator.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{annotator.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="text-green-600">
                        {annotator.accuracy}% Accuracy
                      </Badge>
                      <div className="text-sm text-gray-500">
                        {annotator.completedCount} / {annotator.assignedCount} Documents
                      </div>
                    </div>
                  </div>
                  <Progress
                    value={(annotator.completedCount / annotator.assignedCount) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Document Status */}
        <Card>
          <CardHeader>
            <CardTitle>Document Status</CardTitle>
            <CardDescription>
              Detailed view of document annotation status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Documents</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <div className="space-y-4">
                  {/* Document list items */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="font-medium">Document-001.txt</div>
                        <div className="text-sm text-gray-500">Assigned to: John Doe, Jane Smith</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Completed
                      </Badge>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="font-medium">Document-002.txt</div>
                        <div className="text-sm text-gray-500">Assigned to: Alice Johnson</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="text-orange-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        In Progress
                      </Badge>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 