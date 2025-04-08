"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Annotation {
  id: string
  text: string
  range: {
    start: number
    end: number
  }
  tokenStart: number
  tokenEnd: number
  labelId: string
  labelName: string
  color: string
}

interface Relationship {
  id: string
  sourceId: string
  targetId: string
  type: string
}

interface RelationshipCreatorProps {
  annotations: Annotation[]
  relationships: Relationship[]
  onAddRelationship: (relationship: Relationship) => void
  isReviewMode: boolean
}

// Mock relationship types - in a real app these would come from your database
const relationshipTypes = [
  "is employed by",
  "is located in",
  "is part of",
  "owns",
  "reports to",
  "works with",
]

export function RelationshipCreator({
  annotations,
  relationships,
  onAddRelationship,
  isReviewMode,
}: RelationshipCreatorProps) {
  const [sourceId, setSourceId] = useState<string>("")
  const [targetId, setTargetId] = useState<string>("")
  const [relationType, setRelationType] = useState<string>("")

  const handleCreateRelationship = () => {
    if (sourceId && targetId && relationType) {
      onAddRelationship({
        id: `rel-${Date.now()}`,
        sourceId,
        targetId,
        type: relationType,
      })
      setSourceId("")
      setTargetId("")
      setRelationType("")
    }
  }

  return (
    <div className="space-y-4">
      {isReviewMode && (
        <Alert>
          <AlertDescription>
            Review mode is active. You cannot add new relationships.
          </AlertDescription>
        </Alert>
      )}

      {annotations.length < 2 && !isReviewMode && (
        <Alert>
          <AlertDescription>
            You need at least two annotations to create relationships.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Select
            value={sourceId}
            onValueChange={setSourceId}
            disabled={isReviewMode || annotations.length < 2}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select source annotation" />
            </SelectTrigger>
            <SelectContent>
              {annotations.map((annotation) => (
                <SelectItem key={annotation.id} value={annotation.id}>
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: annotation.color }}
                    />
                    <span>
                      {annotation.text} ({annotation.labelName})
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Select
            value={relationType}
            onValueChange={setRelationType}
            disabled={isReviewMode || !sourceId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select relationship type" />
            </SelectTrigger>
            <SelectContent>
              {relationshipTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Select
            value={targetId}
            onValueChange={setTargetId}
            disabled={isReviewMode || !sourceId || !relationType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select target annotation" />
            </SelectTrigger>
            <SelectContent>
              {annotations
                .filter((a) => a.id !== sourceId)
                .map((annotation) => (
                  <SelectItem key={annotation.id} value={annotation.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: annotation.color }}
                      />
                      <span>
                        {annotation.text} ({annotation.labelName})
                      </span>
                    </span>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-full"
          disabled={isReviewMode || !sourceId || !targetId || !relationType}
          onClick={handleCreateRelationship}
        >
          Create Relationship
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-25rem)]">
        <div className="space-y-2">
          {relationships.map((rel) => {
            const source = annotations.find((a) => a.id === rel.sourceId)
            const target = annotations.find((a) => a.id === rel.targetId)
            if (!source || !target) return null

            return (
              <div
                key={rel.id}
                className="rounded-lg border bg-card p-3 text-card-foreground shadow-sm"
              >
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: source.color }}
                  />
                  <span className="font-medium">{source.text}</span>
                  <span className="text-muted-foreground">{rel.type}</span>
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: target.color }}
                  />
                  <span className="font-medium">{target.text}</span>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

