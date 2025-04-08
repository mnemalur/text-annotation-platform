"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label as LabelType } from "@/types/annotation"

interface CreateLabelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateLabel: (label: LabelType) => void
}

export default function CreateLabelDialog({ open, onOpenChange, onCreateLabel }: CreateLabelDialogProps) {
  const [name, setName] = useState("")
  const [color, setColor] = useState("#FF0000")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onCreateLabel({
        id: `label-${Date.now()}`,
        name: name.trim(),
        color,
      })
      setName("")
      setColor("#FF0000")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Label</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Label Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter label name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Create Label
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

