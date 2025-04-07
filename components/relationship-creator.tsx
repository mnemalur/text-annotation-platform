"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ArrowRight, Plus, Trash, Eye } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock relationship types - in a real app this would come from a database or API
const relationshipTypes = [
  { id: "rel1", name: "is-a" },
  { id: "rel2", name: "part-of" },
  { id: "rel3", name: "located-in" },
  { id: "rel4", name: "works-for" },
  { id: "rel5", name: "created-by" },
]

export function RelationshipCreator({ annotations, relationships, onAddRelationship, isReviewMode = false }) {
  const [sourceAnnotation, setSourceAnnotation] = useState("")
  const [targetAnnotation, setTargetAnnotation] = useState("")
  const [relationType, setRelationType] = useState("")
  const { toast } = useToast()

  const handleCreateRelationship = () => {
    if (isReviewMode) {
      toast({
        title: "Review mode active",
        description: "Switch to edit mode to add relationships",
        variant: "destructive",
      })
      return
    }

    if (!sourceAnnotation || !targetAnnotation || !relationType) {
      toast({
        title: "Missing information",
        description: "Please select source, target, and relationship type",
        variant: "destructive",
      })
      return
    }

    const source = annotations.find((a) => a.id === sourceAnnotation)
    const target = annotations.find((a) => a.id === targetAnnotation)
    const type = relationshipTypes.find((r) => r.id === relationType)

    if (source && target && type) {
      const newRelationship = {
        id: `rel-${Date.now()}`,
        sourceId: source.id,
        sourceName: source.text,
        sourceLabel: source.labelName,
        targetId: target.id,
        targetName: target.text,
        targetLabel: target.labelName,
        typeId: type.id,
        typeName: type.name,
      }

      onAddRelationship(newRelationship)

      toast({
        title: "Relationship created",
        description: `Created "${type.name}" relationship between "${source.text}" and "${target.text}"`,
      })

      // Reset form
      setSourceAnnotation("")
      setTargetAnnotation("")
      setRelationType("")
    }
  }

  const handleDeleteRelationship = (relationshipId) => {
    if (isReviewMode) {
      toast({
        title: "Review mode active",
        description: "Switch to edit mode to delete relationships",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would update the state or call an API
    toast({
      title: "Relationship deleted",
      description: "The relationship has been removed",
    })
  }

  return (
    <div className="space-y-6">
      {isReviewMode && (
        <Alert className="mb-4 bg-yellow-50 border-yellow-200">
          <AlertDescription className="text-sm flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            Review mode active. Switch to edit mode to modify relationships.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Create Relationship</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="source">Source</Label>
            <Select value={sourceAnnotation} onValueChange={setSourceAnnotation} disabled={isReviewMode}>
              <SelectTrigger id="source">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                {annotations.map((annotation) => (
                  <SelectItem key={annotation.id} value={annotation.id}>
                    {annotation.text} ({annotation.labelName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship</Label>
            <Select value={relationType} onValueChange={setRelationType} disabled={isReviewMode}>
              <SelectTrigger id="relationship">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {relationshipTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="target">Target</Label>
            <Select value={targetAnnotation} onValueChange={setTargetAnnotation} disabled={isReviewMode}>
              <SelectTrigger id="target">
                <SelectValue placeholder="Select target" />
              </SelectTrigger>
              <SelectContent>
                {annotations.map((annotation) => (
                  <SelectItem key={annotation.id} value={annotation.id}>
                    {annotation.text} ({annotation.labelName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleCreateRelationship} disabled={isReviewMode}>
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Existing Relationships</h3>
        {relationships.length > 0 ? (
          <div className="space-y-2">
            {relationships.map((rel) => (
              <Card key={rel.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="font-medium">{rel.sourceName}</div>
                    <div className="text-xs text-muted-foreground mx-1">({rel.sourceLabel})</div>
                    <ArrowRight className="mx-2 h-4 w-4" />
                    <div className="text-sm font-medium">{rel.typeName}</div>
                    <ArrowRight className="mx-2 h-4 w-4" />
                    <div className="font-medium">{rel.targetName}</div>
                    <div className="text-xs text-muted-foreground mx-1">({rel.targetLabel})</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteRelationship(rel.id)}
                    disabled={isReviewMode}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No relationships created yet. Create one using the form above.
          </p>
        )}
      </div>
    </div>
  )
}

