"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Eye, Check, X as XIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import CreateLabelDialog from "@/components/create-label-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { Label as LabelType } from "@/types/annotation"

interface LabelSelectorProps {
  onLabelSelect: (label: LabelType) => void
  isReviewMode?: boolean
  selectedText?: string | null
}

export default function LabelSelector({ 
  onLabelSelect, 
  isReviewMode = false,
  selectedText
}: LabelSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState<LabelType | null>(null)
  const [labels, setLabels] = useState<LabelType[]>([
    { id: "1", name: "Person", color: "#FF5555" },
    { id: "2", name: "Location", color: "#33CC33" },
    { id: "3", name: "Organization", color: "#3399FF" },
    { id: "4", name: "Date", color: "#9966CC" },
    { id: "5", name: "Product", color: "#FF66CC" },
  ])

  const handleCreateLabel = (newLabel: LabelType) => {
    setLabels([...labels, newLabel])
    setIsCreateDialogOpen(false)
  }

  const handleLabelClick = (label: LabelType) => {
    setSelectedLabel(label)
  }

  const handleConfirm = () => {
    if (selectedLabel) {
      onLabelSelect(selectedLabel)
      setSelectedLabel(null)
    }
  }

  const handleCancel = () => {
    setSelectedLabel(null)
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
        ) : (
          <div className="space-y-4">
            {selectedText ? (
              <Alert className="bg-primary/10 border-primary/20">
                <AlertDescription className="text-sm">
                  <div className="font-medium mb-1">Ready to annotate:</div>
                  <div className="text-muted-foreground">"{selectedText}"</div>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <AlertDescription className="text-sm">
                  Select text in the document to start annotating
                </AlertDescription>
              </Alert>
            )}

            {selectedLabel && selectedText && (
              <div className="p-3 rounded-lg border"
                style={{ backgroundColor: `${selectedLabel.color}10` }}
              >
                <div className="text-sm space-y-2">
                  <div className="font-medium">Confirm Label Assignment</div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium"
                      style={{ backgroundColor: `${selectedLabel.color}20` }}
                    >
                      <div 
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: selectedLabel.color }}
                      />
                      {selectedLabel.name}
                    </div>
                    <span>will be assigned to</span>
                    <span className="font-medium">"{selectedText}"</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Button 
                      size="sm" 
                      onClick={handleConfirm}
                      style={{ 
                        backgroundColor: selectedLabel.color,
                        color: '#fff'
                      }}
                      className="hover:opacity-90"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Confirm
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancel}>
                      Choose different label
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <ScrollArea className="h-[calc(100vh-22rem)]">
          <div className="space-y-2 mt-4">
            {filteredLabels.map((label) => (
              <Button
                key={label.id}
                className={cn(
                  "w-full justify-start text-left font-normal h-auto py-2 transition-all",
                  isReviewMode && "opacity-50 cursor-not-allowed",
                  selectedLabel?.id === label.id && "ring-2 ring-primary shadow-sm",
                  !selectedText && "opacity-50 cursor-not-allowed",
                  "hover:scale-[1.02] active:scale-[0.98]"
                )}
                style={{
                  backgroundColor: `${label.color}15`,
                  borderLeft: `4px solid ${label.color}`,
                }}
                disabled={isReviewMode || !selectedText}
                onClick={() => handleLabelClick(label)}
              >
                <div className="flex items-center w-full">
                  <div 
                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                    style={{ backgroundColor: label.color }}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {label.name}
                  </span>
                  {selectedText && !selectedLabel && (
                    <span className="ml-auto text-xs text-primary font-medium">
                      Click to assign
                    </span>
                  )}
                  {selectedLabel?.id === label.id && (
                    <span className="ml-auto text-xs text-primary font-medium">
                      Selected
                    </span>
                  )}
                </div>
              </Button>
            ))}
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

