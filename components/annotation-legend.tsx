"use client"

export function AnnotationLegend({ annotations }) {
  // Get unique labels from annotations
  const uniqueLabels = annotations.reduce((acc, annotation) => {
    if (!acc.some((label) => label.id === annotation.labelId)) {
      acc.push({
        id: annotation.labelId,
        name: annotation.labelName,
        color: annotation.color,
      })
    }
    return acc
  }, [])

  if (uniqueLabels.length === 0) {
    return null
  }

  return (
    <div className="mt-4 p-3 border rounded-md bg-muted/30">
      <h3 className="text-sm font-medium mb-2">Annotation Legend:</h3>
      <div className="flex flex-wrap gap-2">
        {uniqueLabels.map((label) => (
          <div key={label.id} className="flex items-center">
            <div className="w-3 h-3 mr-1 rounded-full" style={{ backgroundColor: label.color }} />
            <span className="text-sm">{label.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

