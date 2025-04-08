"use client"

import { useState } from "react"
import { AnnotatorWorkspace } from "@/components/annotator-workspace"

export default function AnnotatePage() {
  return (
    <div className="flex h-screen">
      {/* Main Annotation Area */}
      <div className="flex-1 flex flex-col">
        {/* Annotation Workspace */}
        <div className="flex-1">
          <AnnotatorWorkspace />
        </div>
      </div>
    </div>
  )
}

