"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import CreateLabelDialog from "@/components/create-label-dialog"
import { Edit, Plus, Save, Trash } from "lucide-react"
import { Label as LabelType } from "@/types/annotation"

interface RelationshipType {
  id: string
  name: string
  description: string
}

// Mock data - in a real app this would come from a database or API
const mockLabels: LabelType[] = [
  { id: "label1", name: "Person", color: "#FF5733", description: "Human individuals" },
  { id: "label2", name: "Organization", color: "#33A8FF", description: "Companies, agencies, institutions" },
  { id: "label3", name: "Location", color: "#33FF57", description: "Physical locations" },
  { id: "label4", name: "Date", color: "#A033FF", description: "Calendar dates" },
  { id: "label5", name: "Product", color: "#FF33A8", description: "Commercial products" },
]

const mockRelationshipTypes: RelationshipType[] = [
  { id: "rel1", name: "is-a", description: "Indicates that one entity is a type of another" },
  { id: "rel2", name: "part-of", description: "Indicates that one entity is a component of another" },
  { id: "rel3", name: "located-in", description: "Indicates that one entity is physically located within another" },
  { id: "rel4", name: "works-for", description: "Indicates that a person works for an organization" },
  { id: "rel5", name: "created-by", description: "Indicates that an entity was created by another entity" },
]

export function LabelManagement() {
  const [labels, setLabels] = useState<LabelType[]>(mockLabels)
  const [relationshipTypes, setRelationshipTypes] = useState<RelationshipType[]>(mockRelationshipTypes)
  const [isCreateLabelDialogOpen, setIsCreateLabelDialogOpen] = useState(false)
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null)
  const [editingRelationshipId, setEditingRelationshipId] = useState<string | null>(null)
  const [newRelationshipName, setNewRelationshipName] = useState("")
  const [newRelationshipDescription, setNewRelationshipDescription] = useState("")
  const { toast } = useToast()

  const handleAddLabel = (newLabel: LabelType) => {
    setLabels([...labels, { ...newLabel, id: `label-${Date.now()}` }])
    setIsCreateLabelDialogOpen(false)

    toast({
      title: "Label created",
      description: `Created new label "${newLabel.name}"`,
    })
  }

  const handleUpdateLabel = (id: string, updatedData: Partial<LabelType>) => {
    setLabels(labels.map((label) => (label.id === id ? { ...label, ...updatedData } : label)))
    setEditingLabelId(null)

    toast({
      title: "Label updated",
      description: `Updated label "${updatedData.name}"`,
    })
  }

  const handleDeleteLabel = (id: string) => {
    setLabels(labels.filter((label) => label.id !== id))

    toast({
      title: "Label deleted",
      description: "The label has been removed",
    })
  }

  const handleAddRelationship = () => {
    if (!newRelationshipName.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a relationship name",
        variant: "destructive",
      })
      return
    }

    const newRelationship: RelationshipType = {
      id: `rel-${Date.now()}`,
      name: newRelationshipName,
      description: newRelationshipDescription,
    }

    setRelationshipTypes([...relationshipTypes, newRelationship])
    setNewRelationshipName("")
    setNewRelationshipDescription("")

    toast({
      title: "Relationship type created",
      description: `Created new relationship type "${newRelationshipName}"`,
    })
  }

  const handleUpdateRelationship = (id: string, updatedData: Partial<RelationshipType>) => {
    setRelationshipTypes(relationshipTypes.map((rel) => (rel.id === id ? { ...rel, ...updatedData } : rel)))
    setEditingRelationshipId(null)

    toast({
      title: "Relationship type updated",
      description: `Updated relationship type "${updatedData.name}"`,
    })
  }

  const handleDeleteRelationship = (id: string) => {
    setRelationshipTypes(relationshipTypes.filter((rel) => rel.id !== id))

    toast({
      title: "Relationship type deleted",
      description: "The relationship type has been removed",
    })
  }

  return (
    <Tabs defaultValue="labels">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="labels">Entity Labels</TabsTrigger>
        <TabsTrigger value="relationships">Relationship Types</TabsTrigger>
      </TabsList>

      <TabsContent value="labels">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Entity Labels</h2>
          <Button onClick={() => setIsCreateLabelDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Label
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {labels.map((label) => (
            <Card key={label.id}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: label.color }} />
                  <CardTitle className="text-lg">{label.name}</CardTitle>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => setEditingLabelId(label.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteLabel(label.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {editingLabelId === label.id ? (
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor={`edit-name-${label.id}`}>Name</Label>
                      <Input id={`edit-name-${label.id}`} defaultValue={label.name} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor={`edit-color-${label.id}`}>Color</Label>
                      <div className="flex space-x-2 mt-1">
                        <Input
                          id={`edit-color-${label.id}`}
                          type="color"
                          defaultValue={label.color}
                          className="w-12 h-8 p-1"
                        />
                        <Input
                          defaultValue={label.color}
                          className="flex-1"
                          pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`edit-desc-${label.id}`}>Description</Label>
                      <Textarea id={`edit-desc-${label.id}`} defaultValue={label.description} className="mt-1" />
                    </div>
                    <div className="flex justify-end space-x-2 mt-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingLabelId(null)}>
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          const nameInput = document.getElementById(`edit-name-${label.id}`) as HTMLInputElement
                          const colorInput = document.getElementById(`edit-color-${label.id}`) as HTMLInputElement
                          const descInput = document.getElementById(`edit-desc-${label.id}`) as HTMLTextAreaElement

                          if (nameInput && colorInput && descInput) {
                            handleUpdateLabel(label.id, {
                              name: nameInput.value,
                              color: colorInput.value,
                              description: descInput.value,
                            })
                          }
                        }}
                      >
                        <Save className="mr-2 h-3 w-3" /> Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{label.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <CreateLabelDialog
          open={isCreateLabelDialogOpen}
          onOpenChange={setIsCreateLabelDialogOpen}
          onCreateLabel={handleAddLabel}
        />
      </TabsContent>

      <TabsContent value="relationships">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Relationship Types</h2>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Relationship Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <Label htmlFor="new-relationship-name">Name</Label>
                <Input
                  id="new-relationship-name"
                  placeholder="e.g., contains, causes"
                  value={newRelationshipName}
                  onChange={(e) => setNewRelationshipName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="new-relationship-description">Description</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    id="new-relationship-description"
                    placeholder="What does this relationship represent?"
                    value={newRelationshipDescription}
                    onChange={(e) => setNewRelationshipDescription(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddRelationship}>
                    <Plus className="mr-2 h-4 w-4" /> Add
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {relationshipTypes.map((rel) => (
            <Card key={rel.id}>
              <CardContent className="p-4">
                {editingRelationshipId === rel.id ? (
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor={`edit-rel-name-${rel.id}`}>Name</Label>
                      <Input id={`edit-rel-name-${rel.id}`} defaultValue={rel.name} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor={`edit-rel-desc-${rel.id}`}>Description</Label>
                      <Textarea id={`edit-rel-desc-${rel.id}`} defaultValue={rel.description} className="mt-1" />
                    </div>
                    <div className="flex justify-end space-x-2 mt-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingRelationshipId(null)}>
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          const nameInput = document.getElementById(`edit-rel-name-${rel.id}`)
                          const descInput = document.getElementById(`edit-rel-desc-${rel.id}`)

                          handleUpdateRelationship(rel.id, {
                            name: nameInput.value,
                            description: descInput.value,
                          })
                        }}
                      >
                        <Save className="mr-2 h-3 w-3" /> Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{rel.name}</h3>
                      <p className="text-sm text-muted-foreground">{rel.description}</p>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => setEditingRelationshipId(rel.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteRelationship(rel.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}

