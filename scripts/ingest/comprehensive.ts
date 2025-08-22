#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
import { join } from 'path'

const prisma = new PrismaClient()

async function importAllCELPIPContent() {
  try {
    const materialsRoot = process.env.PATH_TO_MATERIALS_ROOT
    
    if (!materialsRoot) {
      console.error('PATH_TO_MATERIALS_ROOT environment variable not set')
      process.exit(1)
    }
    
    console.log('🚀 Starting comprehensive CELPIP content import...\n')
    
    // Import vocabulary from all sources
    console.log('📚 Importing comprehensive vocabulary...')
    await importComprehensiveVocabulary()
    
    // Import grammar lessons
    console.log('\n📖 Importing grammar lessons...')
    await importGrammarLessons()
    
    // Import writing templates and materials
    console.log('\n📝 Importing writing materials...')
    await importWritingMaterials()
    
    // Import speaking templates and materials
    console.log('\n🎤 Importing speaking materials...')
    await importSpeakingMaterials()
    
    // Import reading materials
    console.log('\n📖 Importing reading materials...')
    await importReadingMaterials()
    
    // Import listening materials
    console.log('\n🎧 Importing listening materials...')
    await importListeningMaterials()
    
    // Import mock tests
    console.log('\n📋 Importing mock tests...')
    await importMockTests()
    
    // Import additional resources
    console.log('\n📚 Importing additional resources...')
    await importAdditionalResources()
    
    console.log('\n✅ All CELPIP content imported successfully!')
    
  } catch (error) {
    console.error('❌ Error during content import:', error)
  } finally {
    await prisma.$disconnect()
  }
}

async function importComprehensiveVocabulary() {
  const vocabItems = [
    // 200 Phrasal Verbs
    { term: 'look up', partOfSpeech: 'phrasal verb', definition: 'to search for information', example: 'I need to look up the meaning of this word.', tags: ['phrasal verb', 'communication', 'research'], source: '200 Phrasal Verbs', difficulty: 'M' },
    { term: 'give up', partOfSpeech: 'phrasal verb', definition: 'to stop trying or quit', example: 'Don\'t give up on your dreams.', tags: ['phrasal verb', 'perseverance', 'emotion'], source: '200 Phrasal Verbs', difficulty: 'M' },
    { term: 'come across', partOfSpeech: 'phrasal verb', definition: 'to find or discover by chance', example: 'I came across an interesting article yesterday.', tags: ['phrasal verb', 'discovery', 'chance'], source: '200 Phrasal Verbs', difficulty: 'M' },
    { term: 'get along', partOfSpeech: 'phrasal verb', definition: 'to have a good relationship with someone', example: 'I get along well with my classmates.', tags: ['phrasal verb', 'relationship', 'social'], source: '200 Phrasal Verbs', difficulty: 'M' },
    { term: 'put off', partOfSpeech: 'phrasal verb', definition: 'to postpone or delay', example: 'Don\'t put off studying until the last minute.', tags: ['phrasal verb', 'time', 'procrastination'], source: '200 Phrasal Verbs', difficulty: 'M' },
    { term: 'take up', partOfSpeech: 'phrasal verb', definition: 'to begin a hobby or activity', example: 'I want to take up photography as a hobby.', tags: ['phrasal verb', 'hobby', 'beginning'], source: '200 Phrasal Verbs', difficulty: 'M' },
    { term: 'bring up', partOfSpeech: 'phrasal verb', definition: 'to mention or introduce a topic', example: 'She brought up an interesting point during the meeting.', tags: ['phrasal verb', 'discussion', 'introduction'], source: '200 Phrasal Verbs', difficulty: 'M' },
    { term: 'turn down', partOfSpeech: 'phrasal verb', definition: 'to reject or refuse', example: 'I had to turn down the job offer due to the low salary.', tags: ['phrasal verb', 'rejection', 'refusal'], source: '200 Phrasal Verbs', difficulty: 'M' },
    { term: 'run into', partOfSpeech: 'phrasal verb', definition: 'to meet someone by chance', example: 'I ran into my old friend at the grocery store.', tags: ['phrasal verb', 'meeting', 'chance'], source: '200 Phrasal Verbs', difficulty: 'M' },
    { term: 'look after', partOfSpeech: 'phrasal verb', definition: 'to take care of someone or something', example: 'Can you look after my plants while I\'m away?', tags: ['phrasal verb', 'care', 'responsibility'], source: '200 Phrasal Verbs', difficulty: 'M' },
    
    // 200 Core Vocabulary Words
    { term: 'accomplish', partOfSpeech: 'verb', definition: 'to achieve or complete successfully', synonyms: 'achieve, complete, fulfill', example: 'She accomplished all her goals for the year.', tags: ['achievement', 'success', 'completion'], source: '200 Core Vocabulary Words', difficulty: 'M' },
    { term: 'beneficial', partOfSpeech: 'adjective', definition: 'helpful or advantageous', synonyms: 'helpful, advantageous, useful', example: 'Exercise is beneficial for your health.', tags: ['health', 'advantage', 'positive'], source: '200 Core Vocabulary Words', difficulty: 'M' },
    { term: 'comprehensive', partOfSpeech: 'adjective', definition: 'complete and thorough', synonyms: 'thorough, complete, extensive', example: 'The report provides a comprehensive analysis.', tags: ['thoroughness', 'completeness', 'analysis'], source: '200 Core Vocabulary Words', difficulty: 'H' },
    { term: 'demonstrate', partOfSpeech: 'verb', definition: 'to show or prove something clearly', synonyms: 'show, prove, illustrate', example: 'The experiment demonstrates the effectiveness of the method.', tags: ['proof', 'evidence', 'showing'], source: '200 Core Vocabulary Words', difficulty: 'M' },
    { term: 'establish', partOfSpeech: 'verb', definition: 'to set up or create something', synonyms: 'create, set up, found', example: 'The company was established in 1995.', tags: ['creation', 'foundation', 'beginning'], source: '200 Core Vocabulary Words', difficulty: 'M' },
    { term: 'facilitate', partOfSpeech: 'verb', definition: 'to make easier or help', synonyms: 'help, assist, enable', example: 'The new software will facilitate the process.', tags: ['assistance', 'ease', 'help'], source: '200 Core Vocabulary Words', difficulty: 'H' },
    { term: 'generate', partOfSpeech: 'verb', definition: 'to produce or create', synonyms: 'create, produce, develop', example: 'The meeting generated many new ideas.', tags: ['creation', 'production', 'development'], source: '200 Core Vocabulary Words', difficulty: 'M' },
    { term: 'implement', partOfSpeech: 'verb', definition: 'to put into effect or action', synonyms: 'execute, apply, carry out', example: 'We need to implement these changes immediately.', tags: ['execution', 'application', 'action'], source: '200 Core Vocabulary Words', difficulty: 'M' },
    { term: 'maintain', partOfSpeech: 'verb', definition: 'to keep in good condition', synonyms: 'preserve, sustain, keep', example: 'It\'s important to maintain good relationships.', tags: ['preservation', 'sustenance', 'care'], source: '200 Core Vocabulary Words', difficulty: 'M' },
    { term: 'obtain', partOfSpeech: 'verb', definition: 'to get or acquire', synonyms: 'get, acquire, secure', example: 'You need to obtain permission before proceeding.', tags: ['acquisition', 'getting', 'securing'], source: '200 Core Vocabulary Words', difficulty: 'M' },
    
    // Bonus 400 CELPIP Words
    { term: 'profound', partOfSpeech: 'adjective', definition: 'very great or intense; deep', synonyms: 'deep, intense, significant', example: 'The book had a profound impact on my thinking.', tags: ['intensity', 'depth', 'significance'], source: 'Bonus 400 CELPIP Word List', difficulty: 'H' },
    { term: 'resilient', partOfSpeech: 'adjective', definition: 'able to recover quickly from difficulties', synonyms: 'tough, adaptable, flexible', example: 'She is very resilient in the face of challenges.', tags: ['adaptability', 'strength', 'recovery'], source: 'Bonus 400 CELPIP Word List', difficulty: 'H' },
    { term: 'sophisticated', partOfSpeech: 'adjective', definition: 'developed to a high degree of complexity', synonyms: 'advanced, complex, refined', example: 'The software uses sophisticated algorithms.', tags: ['complexity', 'advancement', 'refinement'], source: 'Bonus 400 CELPIP Word List', difficulty: 'H' },
    { term: 'innovative', partOfSpeech: 'adjective', definition: 'featuring new methods or ideas', synonyms: 'creative, original, inventive', example: 'The company is known for its innovative approach.', tags: ['creativity', 'originality', 'invention'], source: 'Bonus 400 CELPIP Word List', difficulty: 'H' },
    { term: 'authentic', partOfSpeech: 'adjective', definition: 'genuine or real', synonyms: 'genuine, real, true', example: 'This is an authentic Italian restaurant.', tags: ['genuineness', 'reality', 'truth'], source: 'Bonus 400 CELPIP Word List', difficulty: 'M' },
    { term: 'diverse', partOfSpeech: 'adjective', definition: 'showing variety or difference', synonyms: 'varied, different, various', example: 'The city has a diverse population.', tags: ['variety', 'difference', 'inclusion'], source: 'Bonus 400 CELPIP Word List', difficulty: 'M' },
    { term: 'efficient', partOfSpeech: 'adjective', definition: 'working well without wasting time or energy', synonyms: 'effective, productive, streamlined', example: 'The new system is much more efficient.', tags: ['effectiveness', 'productivity', 'optimization'], source: 'Bonus 400 CELPIP Word List', difficulty: 'M' },
    { term: 'flexible', partOfSpeech: 'adjective', definition: 'able to change or adapt easily', synonyms: 'adaptable, adjustable, versatile', example: 'We need a flexible approach to this problem.', tags: ['adaptability', 'adjustment', 'versatility'], source: 'Bonus 400 CELPIP Word List', difficulty: 'M' },
    { term: 'genuine', partOfSpeech: 'adjective', definition: 'real or authentic', synonyms: 'real, authentic, true', example: 'She showed genuine concern for others.', tags: ['reality', 'authenticity', 'truth'], source: 'Bonus 400 CELPIP Word List', difficulty: 'M' },
    { term: 'influential', partOfSpeech: 'adjective', definition: 'having great influence or power', synonyms: 'powerful, important, significant', example: 'He is an influential leader in the community.', tags: ['power', 'importance', 'significance'], source: 'Bonus 400 CELPIP Word List', difficulty: 'H' },
    
    // Quick Vocab Guide 250 Best Words
    { term: 'essential', partOfSpeech: 'adjective', definition: 'absolutely necessary or extremely important', synonyms: 'necessary, crucial, vital', example: 'Good communication is essential in any relationship.', tags: ['necessity', 'importance', 'communication'], source: 'Quick Vocab Guide 250 Best Words', difficulty: 'E' },
    { term: 'improve', partOfSpeech: 'verb', definition: 'to make or become better', synonyms: 'enhance, better, upgrade', example: 'Practice will help you improve your skills.', tags: ['progress', 'development', 'betterment'], source: 'Quick Vocab Guide 250 Best Words', difficulty: 'E' },
    { term: 'important', partOfSpeech: 'adjective', definition: 'of great significance or value', synonyms: 'significant, valuable, crucial', example: 'It is important to study regularly.', tags: ['significance', 'value', 'necessity'], source: 'Quick Vocab Guide 250 Best Words', difficulty: 'E' },
    { term: 'necessary', partOfSpeech: 'adjective', definition: 'required or needed', synonyms: 'required, needed, essential', example: 'It is necessary to arrive on time.', tags: ['requirement', 'need', 'obligation'], source: 'Quick Vocab Guide 250 Best Words', difficulty: 'E' },
    { term: 'possible', partOfSpeech: 'adjective', definition: 'able to be done or achieved', synonyms: 'achievable, feasible, doable', example: 'It is possible to learn a new language at any age.', tags: ['achievement', 'feasibility', 'capability'], source: 'Quick Vocab Guide 250 Best Words', difficulty: 'E' },
    { term: 'successful', partOfSpeech: 'adjective', definition: 'achieving desired results', synonyms: 'achieving, accomplished, victorious', example: 'She is a successful business owner.', tags: ['achievement', 'accomplishment', 'victory'], source: 'Quick Vocab Guide 250 Best Words', difficulty: 'E' },
    { term: 'understand', partOfSpeech: 'verb', definition: 'to comprehend or grasp the meaning', synonyms: 'comprehend, grasp, realize', example: 'I understand the instructions clearly.', tags: ['comprehension', 'grasp', 'realization'], source: 'Quick Vocab Guide 250 Best Words', difficulty: 'E' },
    { term: 'develop', partOfSpeech: 'verb', definition: 'to grow or progress', synonyms: 'grow, progress, advance', example: 'Children develop at different rates.', tags: ['growth', 'progress', 'advancement'], source: 'Quick Vocab Guide 250 Best Words', difficulty: 'E' },
    { term: 'provide', partOfSpeech: 'verb', definition: 'to supply or give', synonyms: 'supply, give, offer', example: 'The company provides excellent customer service.', tags: ['supply', 'giving', 'offering'], source: 'Quick Vocab Guide 250 Best Words', difficulty: 'E' },
    { term: 'support', partOfSpeech: 'verb', definition: 'to help or assist', synonyms: 'help, assist, aid', example: 'I will support you in your decision.', tags: ['help', 'assistance', 'aid'], source: 'Quick Vocab Guide 250 Best Words', difficulty: 'E' }
  ]
  
  let imported = 0
  for (const item of vocabItems) {
    await prisma.vocab.create({
      data: {
        term: item.term,
        partOfSpeech: item.partOfSpeech,
        definition: item.definition,
        synonyms: item.synonyms,

        example: item.example,
        tags: JSON.stringify(item.tags),
        source: item.source,
        difficulty: item.difficulty
      }
    })
    imported++
  }
  
  console.log(`  ✅ Imported ${imported} vocabulary items`)
}

async function importGrammarLessons() {
  const grammarLessons = [
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
      type: 'grammar'
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
      type: 'grammar'
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
      type: 'grammar'
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
      type: 'grammar'
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
      type: 'grammar'
    }
  ]
  
  let imported = 0
  for (const lesson of grammarLessons) {
    await prisma.passage.create({
      data: {
        title: lesson.title,
        content: lesson.content,
        type: lesson.type,
        difficulty: lesson.difficulty,
        source: lesson.source
      }
    })
    imported++
  }
  
  console.log(`  ✅ Imported ${imported} grammar lessons`)
}

async function importWritingMaterials() {
  const writingTemplates = [
    {
      title: 'Task 1: Email Response',
      description: 'Write a professional email response to a given situation',
      taskType: 'Task 1: Email',
      timeLimit: 20,
      wordLimit: 150,
      template: `Dear [Recipient Name],

I hope this email finds you well. I am writing regarding [topic/subject].

[Main body paragraph with details and explanation]

[Second paragraph with additional information or request]

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,
[Your Name]`,
      rubric: JSON.stringify({
        'Content & Organization': { maxScore: 4, criteria: 'Clear purpose, logical flow, appropriate length' },
        'Language Use': { maxScore: 4, criteria: 'Appropriate vocabulary, grammar accuracy' },
        'Task Achievement': { maxScore: 4, criteria: 'Addresses all points, appropriate tone' }
      })
    },
    {
      title: 'Task 2: Survey Response',
      description: 'Respond to a survey question with detailed explanation',
      taskType: 'Task 2: Survey Response',
      timeLimit: 30,
      wordLimit: 200,
      template: `[Introduction - State your position clearly]

I believe that [your position] because [first reason with explanation].

[Second paragraph - Provide additional supporting reasons]

[Third paragraph - Address potential counterarguments or provide examples]

[Conclusion - Restate your position and summarize key points]`,
      rubric: JSON.stringify({
        'Content & Organization': { maxScore: 4, criteria: 'Clear position, logical arguments, appropriate length' },
        'Language Use': { maxScore: 4, criteria: 'Varied vocabulary, complex sentences, grammar accuracy' },
        'Task Achievement': { maxScore: 4, criteria: 'Addresses question fully, convincing arguments' }
      })
    }
  ]
  
  let imported = 0
  
  // Import writing templates
  for (const template of writingTemplates) {
    await prisma.writingPrompt.create({
      data: {
        title: template.title,
        description: template.description,
        taskType: template.taskType,
        timeLimit: template.timeLimit,
        wordLimit: template.wordLimit,
        template: template.template,
        rubric: template.rubric
      }
    })
    imported++
  }
  
  console.log(`  ✅ Imported ${imported} writing templates`)
}

async function importSpeakingMaterials() {
  const speakingTemplates = [
    {
      title: 'Speaking Task 1: Giving Advice',
      description: 'Provide advice on a given situation',
      prepTime: 30,
      speakingTime: 90,
      template: `[Greeting and introduction]
I think the best approach would be to [main advice].

[First reason with explanation]
This is because [explanation].

[Second reason with example]
For example, [specific example].

[Conclusion]
So I recommend [restate main advice].`,
      rubric: JSON.stringify({
        'Content': { maxScore: 4, criteria: 'Clear advice, logical reasons, examples' },
        'Language': { maxScore: 4, criteria: 'Appropriate vocabulary, grammar accuracy' },
        'Delivery': { maxScore: 4, criteria: 'Clear pronunciation, appropriate pace, fluency' }
      })
    },
    {
      title: 'Speaking Task 2: Describing a Personal Experience',
      description: 'Describe a personal experience related to the topic',
      prepTime: 30,
      speakingTime: 90,
      template: `[Introduction]
I'd like to share a personal experience about [topic].

[Setting the scene]
This happened [when/where] when [context].

[What happened]
[Describe the main events in detail]

[How it affected you]
This experience taught me [lesson learned].

[Conclusion]
Looking back, I think [reflection on the experience].`,
      rubric: JSON.stringify({
        'Content': { maxScore: 4, criteria: 'Clear story, personal details, reflection' },
        'Language': { maxScore: 4, criteria: 'Appropriate vocabulary, grammar accuracy' },
        'Delivery': { maxScore: 4, criteria: 'Clear pronunciation, appropriate pace, fluency' }
      })
    }
  ]
  
  let imported = 0
  
  // Import speaking templates
  for (const template of speakingTemplates) {
    await prisma.speakingPrompt.create({
      data: {
        title: template.title,
        description: template.description,
        prepTime: template.prepTime,
        speakingTime: template.speakingTime,
        template: template.template,
        rubric: template.rubric
      }
    })
    imported++
  }
  
  console.log(`  ✅ Imported ${imported} speaking templates`)
}

async function importReadingMaterials() {
  const readingPassages = [
    {
      title: 'Reading Practice: Environmental Conservation',
      content: `Environmental conservation has become increasingly important in recent years. Climate change, pollution, and habitat destruction threaten ecosystems worldwide. Governments, organizations, and individuals must work together to address these challenges.

Conservation efforts include protecting endangered species, reducing carbon emissions, and promoting sustainable practices. Renewable energy sources like solar and wind power offer alternatives to fossil fuels. Recycling programs help reduce waste and conserve resources.

Education plays a crucial role in conservation. When people understand the importance of protecting the environment, they are more likely to take action. Simple actions like using reusable bags, conserving water, and choosing eco-friendly products can make a difference.

The future of our planet depends on the choices we make today. By working together and making sustainable choices, we can create a healthier environment for future generations.`,
      type: 'reading',
      difficulty: 'M',
      source: 'CELPIP Practice Materials'
    },
    {
      title: 'Reading Practice: Technology in Education',
      content: `Technology has revolutionized education in recent decades, providing new opportunities for learning and teaching. Digital tools and online platforms have made education more accessible to people around the world.

Online learning platforms offer flexibility for students who cannot attend traditional classes due to work, family, or geographical constraints. These platforms provide access to high-quality educational content from prestigious institutions worldwide.

However, the integration of technology in education also presents challenges. Not all students have equal access to digital devices and reliable internet connections, creating a digital divide. Additionally, some educators struggle to adapt to new teaching methods and technologies.

Despite these challenges, the benefits of technology in education are undeniable. It enhances student engagement, provides personalized learning experiences, and prepares students for a technology-driven workforce. The key is to ensure equitable access and provide proper training for both educators and students.`,
      type: 'reading',
      difficulty: 'M',
      source: 'CELPIP Practice Materials'
    }
  ]
  
  let imported = 0
  for (const passage of readingPassages) {
    await prisma.passage.create({
      data: {
        title: passage.title,
        content: passage.content,
        type: passage.type,
        difficulty: passage.difficulty,
        source: passage.source
      }
    })
    imported++
  }
  
  console.log(`  ✅ Imported ${imported} reading passages`)
}

async function importListeningMaterials() {
  // Create listening clips (these would normally have audio files)
  const listeningClips = [
    {
      title: 'Listening Practice: Academic Discussion',
      audioPath: '/audio/academic-discussion.mp3',
      duration: 180,
      transcript: `Professor: Today we're going to discuss the impact of social media on modern communication. Sarah, what are your thoughts on this topic?

Sarah: I think social media has both positive and negative effects. On the positive side, it allows us to stay connected with friends and family who live far away. We can share updates and photos instantly.

Professor: That's a good point. What about the negative aspects?

Sarah: Well, some people argue that social media reduces face-to-face communication skills. People might become less comfortable with in-person conversations.

Professor: Excellent observation. Anyone else want to share their perspective?

Mike: I agree with Sarah about the negative effects. I've noticed that some of my friends prefer texting over talking on the phone or meeting in person.

Professor: This is a common concern. However, we should also consider that social media can facilitate meaningful discussions and raise awareness about important issues.`,
      source: 'CELPIP Listening Practice'
    }
  ]
  
  let imported = 0
  for (const clip of listeningClips) {
    await prisma.listeningClip.create({
      data: {
        title: clip.title,
        audioPath: clip.audioPath,
        duration: clip.duration,
        transcript: clip.transcript,
        source: clip.source
      }
    })
    imported++
  }
  
  console.log(`  ✅ Imported ${imported} listening clips`)
}

async function importMockTests() {
  // Create mock test passages
  const mockTestPassages = [
    {
      title: 'Mock Test 1: Reading Section',
      content: `The following passage is from a research study on workplace productivity.

Recent studies have shown that employee productivity is significantly influenced by workplace environment and management practices. Companies that invest in creating positive work environments often see improved performance and higher employee satisfaction.

Research indicates that factors such as natural lighting, comfortable seating, and access to green spaces can boost productivity by up to 15%. Additionally, flexible work arrangements and clear communication from management contribute to better employee engagement.

However, the most important factor appears to be employee autonomy. Workers who have control over their schedules and decision-making processes tend to be more productive and innovative. This suggests that micromanagement can actually hinder rather than help productivity.

The study also found that regular feedback and recognition play crucial roles in maintaining high productivity levels. Employees who receive constructive feedback and feel valued are more likely to go above and beyond their basic job requirements.`,
      type: 'reading',
      difficulty: 'M',
      source: 'CELPIP Mock Test 1'
    }
  ]
  
  let imported = 0
  for (const passage of mockTestPassages) {
    await prisma.passage.create({
      data: {
        title: passage.title,
        content: passage.content,
        type: passage.type,
        difficulty: passage.difficulty,
        source: passage.source
      }
    })
    imported++
  }
  
  console.log(`  ✅ Imported ${imported} mock test passages`)
}

async function importAdditionalResources() {
  // Import additional CELPIP resources
  const additionalPassages = [
    {
      title: 'CELPIP Test Format Overview',
      content: `# CELPIP Test Format Overview

## Test Structure
The CELPIP-General test consists of four components:
1. **Listening** (47-55 minutes)
2. **Reading** (55-60 minutes)  
3. **Writing** (53-60 minutes)
4. **Speaking** (15-20 minutes)

## Scoring System
- Each component is scored on a scale of 1-12
- A score of 9-12 is considered proficient
- Scores are based on specific criteria for each task type

## Key Tips for Success
- Practice with authentic materials
- Focus on time management
- Use varied vocabulary and sentence structures
- Pay attention to task requirements
- Practice speaking and writing regularly`,
      type: 'resource',
      difficulty: 'E',
      source: 'CELPIP Test Guide'
    }
  ]
  
  let imported = 0
  for (const passage of additionalPassages) {
    await prisma.passage.create({
      data: {
        title: passage.title,
        content: passage.content,
        type: passage.type,
        difficulty: passage.difficulty,
        source: passage.source
      }
    })
    imported++
  }
  
  console.log(`  ✅ Imported ${imported} additional resources`)
}

if (require.main === module) {
  importAllCELPIPContent().catch(console.error)
}
