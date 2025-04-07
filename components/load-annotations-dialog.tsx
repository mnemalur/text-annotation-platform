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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search, Clock, FileText } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export function LoadAnnotationsDialog({ open, onOpenChange, savedSessions, onLoadSession, currentDocumentId }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("current")

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Filter sessions based on search query and active tab
  const filteredSessions = savedSessions.filter((session) => {
    const matchesSearch = session.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === "all" || (activeTab === "current" && session.documentId === currentDocumentId)
    return matchesSearch && matchesTab
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Load Saved Annotations</DialogTitle>
          <DialogDescription>Select a previously saved annotation session to continue your work.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search saved sessions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="current" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Current Document</TabsTrigger>
              <TabsTrigger value="all">All Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="mt-2">
              <ScrollArea className="h-[300px]">
                {filteredSessions.length > 0 ? (
                  <div className="space-y-2">
                    {filteredSessions.map((session) => (
                      <div
                        key={session.id}
                        className="p-3 border rounded-md hover:bg-muted cursor-pointer"
                        onClick={() => onLoadSession(session.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{session.name}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Clock className="mr-1 h-3 w-3" />
                              <span>{formatDate(session.date)}</span>
                            </div>
                          </div>
                          <Badge>{session.annotations.length} annotations</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No saved sessions found for this document</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="all" className="mt-2">
              <ScrollArea className="h-[300px]">
                {filteredSessions.length > 0 ? (
                  <div className="space-y-2">
                    {filteredSessions.map((session) => (
                      <div
                        key={session.id}
                        className="p-3 border rounded-md hover:bg-muted cursor-pointer"
                        onClick={() => onLoadSession(session.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{session.name}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Clock className="mr-1 h-3 w-3" />
                              <span>{formatDate(session.date)}</span>
                            </div>
                          </div>
                          <Badge>{session.annotations.length} annotations</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No saved sessions found</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

