export interface Label {
  id: string
  name: string
  color: string
  description?: string
}

export interface Annotation {
  id: string
  text: string
  range: {
    start: number
    end: number
  }
  tokenStart: number
  tokenEnd: number
  labelId: string
  labelName: string
  color: string
}

export interface Relationship {
  id: string
  sourceId: string
  targetId: string
  type: string
}

export interface Session {
  id: string
  name: string
  date: string
  documentId: string
  annotations: Annotation[]
  relationships: Relationship[]
} 