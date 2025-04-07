"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function CreateLabelDialog({ open, onOpenChange, onAddLabel }) {
  const [labelName, setLabelName] = useState("")
  const [labelColor, setLabelColor] = useState("#3B82F6")
  const [labelDescription, setLabelDescription] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddLabel({
      name: labelName,
      color: labelColor,
      description: labelDescription,
    })

    // Reset form
    setLabelName("")
    setLabelColor("#3B82F6")
    setLabelDescription("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new label</DialogTitle>
          <DialogDescription>
            Add a new label for annotating text. Labels can be used to mark entities, concepts, or other elements in
            text.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={labelName}
                onChange={(e) => setLabelName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                Color
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="color"
                  type="color"
                  value={labelColor}
                  onChange={(e) => setLabelColor(e.target.value)}
                  className="w-12 h-8 p-1"
                />
                <Input
                  value={labelColor}
                  onChange={(e) => setLabelColor(e.target.value)}
                  className="flex-1"
                  pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  placeholder="#HEX"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={labelDescription}
                onChange={(e) => setLabelDescription(e.target.value)}
                className="col-span-3"
                placeholder="What kind of text should be labeled with this?"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create label</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

