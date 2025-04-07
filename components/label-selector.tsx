"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Eye } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CreateLabelDialog } from "@/components/create-label-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Default mock labels if none are provided
const defaultLabels = [
  { id: "label1", name: "Person", color: "#FF5733", description: "Human individuals" },
  { id: "label2", name: "Organization", color: "#33A8FF", description: "Companies, agencies, institutions" },
  { id: "label3", name: "Location", color: "#33FF57", description: "Physical locations" },
  { id: "label4", name: "Date", color: "#A033FF", description: "Calendar dates" },
  { id: "label5", name: "Product", color: "#FF33A8", description: "Commercial products" },
]

export function LabelSelector({ onSelectLabel, isTextSelected, isReviewMode = false, labels = defaultLabels }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [currentLabels, setCurrentLabels] = useState(labels)

  const filteredLabels = currentLabels.filter((label) => label.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleAddLabel = (newLabel) => {
    setCurrentLabels([...currentLabels, { ...newLabel, id: `label-${Date.now()}` }])
    setIsCreateDialogOpen(false)
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Labels</CardTitle>
          <Button variant="outline" size="icon" onClick={() => setIsCreateDialogOpen(true)} disabled={isReviewMode}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search labels..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isReviewMode ? (
          <Alert className="mb-4 bg-yellow-50 border-yellow-200">
            <AlertDescription className="text-sm flex items-center">
              <Eye className="mr-2 h-4 w-4" />
              Review mode active. Switch to edit mode to add annotations.
            </AlertDescription>
          </Alert>
        ) : isTextSelected ? (
          <Alert className="mb-4 bg-yellow-50 border-yellow-200">
            <AlertDescription className="text-sm">Text selected! Click a label below to annotate it.</AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-4">
            <AlertDescription className="text-sm">
              Select text in the document first, then click a label to annotate.
            </AlertDescription>
          </Alert>
        )}

        <ScrollArea className="h-[450px] pr-4">
          <div className="space-y-2">
            {filteredLabels.map((label) => (
              <Button
                key={label.id}
                variant="outline"
                className="w-full justify-start relative overflow-hidden"
                onClick={() => onSelectLabel(label)}
                disabled={!isTextSelected || isReviewMode}
              >
                {isTextSelected && !isReviewMode && (
                  <div
                    className="absolute inset-0 bg-opacity-10 animate-pulse"
                    style={{ backgroundColor: label.color }}
                  />
                )}
                <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: label.color }} />
                <span>{label.name}</span>
              </Button>
            ))}
            {filteredLabels.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No labels found. Create a new one!</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CreateLabelDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onAddLabel={handleAddLabel} />
    </Card>
  )
}

