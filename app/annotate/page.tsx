import { AnnotationWorkspace } from "@/components/annotation-workspace"
import { ImportDataButton } from "@/components/import-data-button"
import { ProjectSelector } from "@/components/project-selector"

export default function AnnotatePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Text Annotation</h1>
          <div className="flex items-center space-x-4">
            <ProjectSelector />
            <ImportDataButton />
          </div>
        </div>
        <AnnotationWorkspace />
      </div>
    </div>
  )
}

