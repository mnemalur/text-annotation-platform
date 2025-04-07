import { LabelManagement } from "@/components/label-management"

export default function LabelsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Label Management</h1>
        </div>
        <LabelManagement />
      </div>
    </div>
  )
}

