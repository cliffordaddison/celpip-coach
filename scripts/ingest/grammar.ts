#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
import { join } from 'path'

const prisma = new PrismaClient()

interface GrammarLesson {
  title: string
  content: string
  difficulty: 'E' | 'M' | 'H'
  source: string
  order: number
}

async function importGrammar() {
  try {
    const materialsRoot = process.env.PATH_TO_MATERIALS_ROOT
    
    if (!materialsRoot) {
      console.error('PATH_TO_MATERIALS_ROOT environment variable not set')
      process.exit(1)
    }
    
    console.log('Starting grammar import...')
    
    // Grammar lessons based on CELPIP materials
    const grammarLessons: GrammarLesson[] = [
      {
        title: 'Sentence Structure and Types',
        content: `# Sentence Structure and Types

## Simple Sentences
A simple sentence contains one independent clause with a subject and predicate.
- Example: "The student studies diligently."

## Compound Sentences
A compound sentence contains two or more independent clauses joined by coordinating conjunctions (and, but, or, so, yet).
- Example: "The student studies diligently, and she practices regularly."

## Complex Sentences
A complex sentence contains one independent clause and at least one dependent clause.
- Example: "Although the student studies diligently, she still needs more practice."

## Compound-Complex Sentences
A compound-complex sentence contains multiple independent clauses and at least one dependent clause.
- Example: "The student studies diligently, and she practices regularly, but she still needs more practice because the exam is challenging."

## Key Points for CELPIP
1. Use varied sentence structures to demonstrate language proficiency
2. Ensure proper punctuation and conjunctions
3. Maintain clarity and logical flow
4. Practice combining simple sentences into more complex structures`,
        difficulty: 'M',
        source: 'Class 5 Grammar Lesson',
        order: 1
      },
      {
        title: 'Verb Tenses and Forms',
        content: `# Verb Tenses and Forms

## Present Tenses
- **Simple Present**: Used for facts, habits, and general truths
  - Example: "I study English every day."
- **Present Continuous**: Used for actions happening now or future plans
  - Example: "I am studying for the CELPIP exam."

## Past Tenses
- **Simple Past**: Used for completed actions in the past
  - Example: "I studied English yesterday."
- **Past Continuous**: Used for ongoing actions in the past
  - Example: "I was studying when you called."

## Future Tenses
- **Will**: Used for predictions and spontaneous decisions
  - Example: "I will study harder next week."
- **Going to**: Used for planned future actions
  - Example: "I am going to take the CELPIP exam next month."

## Perfect Tenses
- **Present Perfect**: Used for actions that started in the past and continue to the present
  - Example: "I have studied English for three years."
- **Past Perfect**: Used for actions completed before another past action
  - Example: "I had studied English before I moved to Canada."

## Key Points for CELPIP
1. Use appropriate tenses to express time relationships
2. Maintain consistency in tense usage within paragraphs
3. Practice forming questions and negative statements
4. Pay attention to irregular verb forms`,
        difficulty: 'M',
        source: 'Class 5 Grammar Lesson',
        order: 2
      },
      {
        title: 'Articles and Determiners',
        content: `# Articles and Determiners

## Articles
- **A/An**: Used before singular countable nouns (a = consonant sound, an = vowel sound)
  - Example: "a university, an hour"
- **The**: Used before specific or previously mentioned nouns
  - Example: "the book I mentioned yesterday"

## Determiners
- **This/That**: Used for singular nouns (this = near, that = far)
  - Example: "This book is interesting. That one is boring."
- **These/Those**: Used for plural nouns (these = near, those = far)
  - Example: "These students are studying hard. Those students are playing."

## Quantifiers
- **Some/Any**: Used with uncountable nouns and plural countable nouns
  - Example: "I have some time. Do you have any questions?"
- **Much/Many**: Used with uncountable and countable nouns respectively
  - Example: "How much time do you have? How many questions are there?"

## Key Points for CELPIP
1. Use articles correctly to show specificity
2. Choose appropriate determiners for context
3. Understand countable vs. uncountable nouns
4. Practice using quantifiers in different contexts`,
        difficulty: 'E',
        source: 'Class 5 Grammar Lesson',
        order: 3
      },
      {
        title: 'Prepositions and Phrasal Verbs',
        content: `# Prepositions and Phrasal Verbs

## Common Prepositions
- **Time**: at, on, in, during, for, since
  - Example: "at 3 PM, on Monday, in 2024, during the exam, for two hours, since last year"
- **Place**: at, on, in, above, below, between, among
  - Example: "at the library, on the table, in the room, above the door, below the window"
- **Movement**: to, from, into, out of, through, across
  - Example: "go to school, come from work, walk through the park"

## Phrasal Verbs
- **Look up**: to search for information
  - Example: "I need to look up the meaning of this word."
- **Give up**: to stop trying
  - Example: "Don't give up on your dreams."
- **Come across**: to find by chance
  - Example: "I came across an interesting article yesterday."
- **Get along**: to have a good relationship
  - Example: "I get along well with my classmates."

## Key Points for CELPIP
1. Learn common prepositions and their usage
2. Practice phrasal verbs in context
3. Pay attention to preposition placement
4. Use prepositions to show relationships clearly`,
        difficulty: 'M',
        source: 'Class 5 Grammar Lesson',
        order: 4
      },
      {
        title: 'Conditionals and Modals',
        content: `# Conditionals and Modals

## Conditional Sentences
- **Zero Conditional**: Used for general truths
  - Example: "If you study hard, you improve your skills."
- **First Conditional**: Used for possible future situations
  - Example: "If you study hard, you will pass the exam."
- **Second Conditional**: Used for hypothetical situations
  - Example: "If I had more time, I would study harder."

## Modal Verbs
- **Can/Could**: Ability and possibility
  - Example: "I can speak English. I could speak better with practice."
- **May/Might**: Permission and possibility
  - Example: "May I ask a question? It might rain tomorrow."
- **Must/Should**: Necessity and obligation
  - Example: "You must study hard. You should practice regularly."
- **Will/Would**: Future and hypothetical situations
  - Example: "I will help you. I would help if I could."

## Key Points for CELPIP
1. Use conditionals to express different types of relationships
2. Choose appropriate modals for the intended meaning
3. Practice forming questions and negative statements
4. Pay attention to modal verb forms and usage`,
        difficulty: 'H',
        source: 'Class 5 Grammar Lesson',
        order: 5
      }
    ]
    
    let totalImported = 0
    
    // Import grammar lessons as passages
    for (const lesson of grammarLessons) {
      await prisma.passage.create({
        data: {
          title: lesson.title,
          content: lesson.content,
          type: 'grammar',
          difficulty: lesson.difficulty,
          source: lesson.source
        }
      })
      totalImported++
    }
    
    console.log(`\nGrammar import complete! Total lessons imported: ${totalImported}`)
    
  } catch (error) {
    console.error('Error during grammar import:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  importGrammar().catch(console.error)
}
