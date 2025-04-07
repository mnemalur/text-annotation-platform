'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, ArrowUpDown } from 'lucide-react'

interface Label {
  id: string
  name: string
  description: string
  hotkey: string
  color: string
}

export default function NewProject() {
  const router = useRouter()
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [labels, setLabels] = useState<Label[]>([])
  const [isDoubleAnnotation, setIsDoubleAnnotation] = useState(false)

  const addLabel = () => {
    const newLabel: Label = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      description: '',
      hotkey: '',
      color: generateRandomColor(),
    }
    setLabels([...labels, newLabel])
  }

  const removeLabel = (id: string) => {
    setLabels(labels.filter(label => label.id !== id))
  }

  const updateLabel = (id: string, field: keyof Label, value: string) => {
    setLabels(labels.map(label => 
      label.id === id ? { ...label, [field]: value } : label
    ))
  }

  const moveLabelUp = (index: number) => {
    if (index === 0) return
    const newLabels = [...labels]
    ;[newLabels[index], newLabels[index - 1]] = [newLabels[index - 1], newLabels[index]]
    setLabels(newLabels)
  }

  const moveLabelDown = (index: number) => {
    if (index === labels.length - 1) return
    const newLabels = [...labels]
    ;[newLabels[index], newLabels[index + 1]] = [newLabels[index + 1], newLabels[index]]
    setLabels(newLabels)
  }

  const generateRandomColor = () => {
    const hue = Math.floor(Math.random() * 360)
    return `hsl(${hue}, 70%, 50%)`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement project creation API call
    console.log({
      projectName,
      description,
      labels,
      isDoubleAnnotation
    })
  }

  return (
    <div className="container mx-auto py-8">
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Create New Annotation Project</CardTitle>
              <CardDescription>
                Set up your project details, define labels, and configure annotation settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Details */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your annotation project"
                    rows={4}
                  />
                </div>
              </div>

              {/* Labels Configuration */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Labels</Label>
                  <Button type="button" onClick={addLabel} size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Label
                  </Button>
                </div>
                <div className="space-y-4">
                  {labels.map((label, index) => (
                    <Card key={label.id}>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-4">
                            <Label>Label Name</Label>
                            <Input
                              value={label.name}
                              onChange={(e) => updateLabel(label.id, 'name', e.target.value)}
                              placeholder="Label name"
                            />
                          </div>
                          <div className="col-span-4">
                            <Label>Description</Label>
                            <Input
                              value={label.description}
                              onChange={(e) => updateLabel(label.id, 'description', e.target.value)}
                              placeholder="Label description"
                            />
                          </div>
                          <div className="col-span-1">
                            <Label>Hotkey</Label>
                            <Input
                              value={label.hotkey}
                              onChange={(e) => updateLabel(label.id, 'hotkey', e.target.value)}
                              placeholder="1-9"
                              maxLength={1}
                            />
                          </div>
                          <div className="col-span-2">
                            <Label>Color</Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                type="color"
                                value={label.color}
                                onChange={(e) => updateLabel(label.id, 'color', e.target.value)}
                                className="w-16 h-8"
                              />
                              <Badge style={{ backgroundColor: label.color }}>
                                Preview
                              </Badge>
                            </div>
                          </div>
                          <div className="col-span-1 flex items-end space-x-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => moveLabelUp(index)}
                              disabled={index === 0}
                            >
                              <ArrowUpDown className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeLabel(label.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Annotation Settings */}
              <div>
                <Label>Annotation Type</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Switch
                    checked={isDoubleAnnotation}
                    onCheckedChange={setIsDoubleAnnotation}
                  />
                  <span className="text-sm">
                    {isDoubleAnnotation ? 'Double Annotation' : 'Single Annotation'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {isDoubleAnnotation 
                    ? 'Each document will be annotated by two different annotators for quality control.'
                    : 'Each document will be annotated by a single annotator.'}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-end space-x-4">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Project
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
} 