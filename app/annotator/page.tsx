"use client"

import { AnnotatorWorkspace } from "@/components/annotator-workspace"

export default function AnnotatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-white">
      <div className="container mx-auto py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                Document Annotation
              </span>
            </h1>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <AnnotatorWorkspace />
          </div>
        </div>
      </div>
    </div>
  )
}

