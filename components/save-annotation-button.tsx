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

interface SaveAnnotationButtonProps {
  onClick: (sessionName: string) => void
  disabled?: boolean
}

export function SaveAnnotationButton({ onClick, disabled }: SaveAnnotationButtonProps) {
  const [open, setOpen] = useState(false)
  const [sessionName, setSessionName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onClick(sessionName)
    setSessionName("")
    setOpen(false)
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} disabled={disabled}>
        <Save className="mr-2 h-4 w-4" />
        Save As...
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Annotations</DialogTitle>
            <DialogDescription>
              Enter a name for this annotation session. You can load it later to continue working.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Session Name</Label>
                <Input
                  id="name"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="Enter session name"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Session</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

