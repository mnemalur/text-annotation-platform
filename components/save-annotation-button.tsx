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
import { Save } from "lucide-react"

export function SaveAnnotationButton({ onClick, disabled = false }) {
  const [open, setOpen] = useState(false)
  const [annotationName, setAnnotationName] = useState("")
  const [error, setError] = useState("")

  const handleSave = () => {
    if (!annotationName.trim()) {
      setError("Please enter a name for your annotations")
      return
    }

    onClick(annotationName)
    setOpen(false)
    setAnnotationName("")
    setError("")
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} disabled={disabled}>
        <Save className="mr-2 h-4 w-4" /> Save
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Annotations</DialogTitle>
            <DialogDescription>Save your current annotations to continue later or submit for review.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="annotation-name" className="text-right">
                Name
              </Label>
              <Input
                id="annotation-name"
                placeholder="My annotations"
                value={annotationName}
                onChange={(e) => setAnnotationName(e.target.value)}
                className="col-span-3"
              />
              {error && <p className="text-sm text-red-500 col-span-4 text-right">{error}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

