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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { FileUp, Upload } from "lucide-react"

export function ImportDataButton() {
  const [open, setOpen] = useState(false)
  const [importTab, setImportTab] = useState("paste")
  const [pastedText, setPastedText] = useState("")
  const [file, setFile] = useState(null)
  const { toast } = useToast()

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.type === "text/plain" || selectedFile.type === "application/json") {
        setFile(selectedFile)
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a .txt or .json file",
          variant: "destructive",
        })
      }
    }
  }

  const handleImport = async () => {
    try {
      let textData = ""

      if (importTab === "paste") {
        if (!pastedText.trim()) {
          toast({
            title: "No text provided",
            description: "Please paste some text to import",
            variant: "destructive",
          })
          return
        }
        textData = pastedText
      } else {
        if (!file) {
          toast({
            title: "No file selected",
            description: "Please select a file to import",
            variant: "destructive",
          })
          return
        }

        // Read file content
        const reader = new FileReader()
        textData = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target.result)
          reader.readAsText(file)
        })
      }

      // In a real app, this would process the data and save it to a database or state
      toast({
        title: "Data imported successfully",
        description: `Imported ${textData.length} characters of text data`,
      })

      setOpen(false)
      setPastedText("")
      setFile(null)
    } catch (error) {
      toast({
        title: "Import failed",
        description: "There was an error importing your data",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Upload className="mr-2 h-4 w-4" /> Import Data
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Import Text Data</DialogTitle>
            <DialogDescription>Import text data for annotation by pasting text or uploading a file.</DialogDescription>
          </DialogHeader>

          <Tabs value={importTab} onValueChange={setImportTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="paste">Paste Text</TabsTrigger>
              <TabsTrigger value="upload">Upload File</TabsTrigger>
            </TabsList>

            <TabsContent value="paste" className="mt-4">
              <div className="space-y-2">
                <Label htmlFor="text-input">Paste your text below</Label>
                <Textarea
                  id="text-input"
                  placeholder="Paste text here..."
                  className="min-h-[200px]"
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="upload" className="mt-4">
              <div className="space-y-4">
                <Label htmlFor="file-upload">Upload a text file (.txt or .json)</Label>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                  <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop or click to upload</p>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".txt,.json"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button variant="outline" onClick={() => document.getElementById("file-upload").click()}>
                    Select File
                  </Button>
                  {file && (
                    <p className="text-sm mt-2">
                      Selected: <span className="font-medium">{file.name}</span>
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

