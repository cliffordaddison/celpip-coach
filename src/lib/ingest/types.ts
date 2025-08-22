export interface IngestedFile {
  path: string
  name: string
  type: 'pdf' | 'docx' | 'unknown'
  size: number
  category?: 'vocab' | 'qa' | 'template' | 'unknown'
  content?: string
}

export interface VocabItem {
  term: string
  partOfSpeech?: string
  definition: string
  synonyms?: string
  antonyms?: string
  collocations?: string
  example?: string
  tags: string[]
  source?: string
  difficulty: 'E' | 'M' | 'H'
  imageHint?: string
}

export interface QuestionItem {
  text: string
  type: 'MCQ' | 'multiple-select' | 'fill-in' | 'matching' | 'note-taking'
  choices?: string[]
  correctAnswer: string | string[]
  explanation?: string
  passage?: string
}

export interface TemplateItem {
  title: string
  content: string
  type: 'writing' | 'speaking'
  category?: string
}
