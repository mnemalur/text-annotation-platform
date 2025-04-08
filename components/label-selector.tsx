"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Eye } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import CreateLabelDialog from "@/components/create-label-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { Label as LabelType } from "@/types/annotation"

interface LabelSelectorProps {
  onLabelSelect: (label: LabelType) => void
  isReviewMode?: boolean
  selectedText?: string | null
  selectedLabelId?: string | null
}

export default function LabelSelector({ 
  onLabelSelect, 
  isReviewMode = false,
  selectedText = null,
  selectedLabelId = null
}: LabelSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [labels, setLabels] = useState<LabelType[]>([
    { id: "1", name: "Person", color: "#FF3333" },
    { id: "2", name: "Location", color: "#00CC00" },
    { id: "3", name: "Organization", color: "#0066FF" },
    { id: "4", name: "Date", color: "#8833FF" },
    { id: "5", name: "Product", color: "#FF33CC" },
  ])

  const handleCreateLabel = (newLabel: LabelType) => {
    setLabels([...labels, newLabel])
    setIsCreateDialogOpen(false)
  }

  const allLabels = [...labels]
  const filteredLabels = allLabels.filter((label) =>
    label.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Labels</CardTitle>
          {!isReviewMode && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
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
        ) : !selectedText ? (
          <Alert>
            <AlertDescription className="text-sm">
              Select text in the document to start annotating
            </AlertDescription>
          </Alert>
        ) : null}

        <ScrollArea className="h-[calc(100vh-22rem)]">
          <div className="space-y-2 mt-4">
            {filteredLabels.map((label) => {
              const isSelected = selectedLabelId === label.id
              return (
                <Button
                  key={label.id}
                  className={cn(
                    "w-full justify-start text-left font-normal h-auto py-3 transition-all",
                    isReviewMode && "opacity-50 cursor-not-allowed",
                    !selectedText && "opacity-50 cursor-not-allowed",
                    "hover:scale-[1.02] active:scale-[0.98]",
                    "relative overflow-visible",
                    isSelected && "ring-2 ring-primary ring-offset-2"
                  )}
                  style={{
                    backgroundColor: `${label.color}25`,
                    borderLeft: `4px solid ${label.color}`,
                    color: isSelected ? label.color : undefined
                  }}
                  disabled={isReviewMode || !selectedText}
                  onClick={() => onLabelSelect(label)}
                >
                  <div className="flex items-center w-full">
                    <div 
                      className="w-4 h-4 rounded-full mr-3 flex-shrink-0 border border-white/20"
                      style={{ backgroundColor: label.color }}
                    />
                    <span className={cn(
                      "text-sm font-medium",
                      isSelected ? "text-foreground" : "text-foreground/90"
                    )}>
                      {label.name}
                    </span>
                    {selectedText && !isSelected && (
                      <span className="ml-auto text-xs text-primary/80 font-medium">
                        Click to assign
                      </span>
                    )}
                  </div>
                </Button>
              )
            })}
            {filteredLabels.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                {searchQuery ? "No matching labels found." : "No labels available. Create a new one!"}
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CreateLabelDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateLabel={handleCreateLabel}
      />
    </Card>
  )
}

