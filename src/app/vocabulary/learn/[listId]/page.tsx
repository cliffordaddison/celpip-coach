'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Check, X, Volume2, RotateCcw, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

// Comprehensive vocabulary data with many more words
const vocabularyData = {
  'quick-250': [
    { word: 'accomplish', definition: 'to succeed in doing something', example: 'She accomplished her goal of learning English.' },
    { word: 'beneficial', definition: 'helpful or advantageous', example: 'Exercise is beneficial for your health.' },
    { word: 'comprehensive', definition: 'complete and thorough', example: 'This is a comprehensive guide to CELPIP.' },
    { word: 'determine', definition: 'to find out or decide', example: 'We need to determine the cause of the problem.' },
    { word: 'essential', definition: 'absolutely necessary', example: 'Vocabulary is essential for language learning.' },
    { word: 'facilitate', definition: 'to make easier or help', example: 'Technology facilitates communication.' },
    { word: 'generate', definition: 'to produce or create', example: 'The meeting generated many new ideas.' },
    { word: 'implement', definition: 'to put into effect', example: 'We will implement the new policy next month.' },
    { word: 'justify', definition: 'to show to be right or reasonable', example: 'Can you justify your decision?' },
    { word: 'maintain', definition: 'to keep in good condition', example: 'It\'s important to maintain good relationships.' },
    { word: 'negotiate', definition: 'to discuss to reach agreement', example: 'They negotiated the terms of the contract.' },
    { word: 'obtain', definition: 'to get or acquire', example: 'You must obtain permission before proceeding.' },
    { word: 'participate', definition: 'to take part in', example: 'Everyone is encouraged to participate.' },
    { word: 'qualify', definition: 'to meet requirements', example: 'You must qualify for this position.' },
    { word: 'recognize', definition: 'to identify or acknowledge', example: 'I recognize the importance of this issue.' },
    { word: 'significant', definition: 'important or meaningful', example: 'This represents a significant change.' },
    { word: 'transform', definition: 'to change completely', example: 'Technology has transformed our lives.' },
    { word: 'undertake', definition: 'to take on or begin', example: 'We will undertake this project together.' },
    { word: 'validate', definition: 'to confirm or prove', example: 'Research validates our approach.' },
    { word: 'witness', definition: 'to see or observe', example: 'I witnessed the accident yesterday.' },
    { word: 'yield', definition: 'to produce or give way', example: 'This investment yields good returns.' },
    { word: 'zealous', definition: 'enthusiastic and devoted', example: 'She is zealous about her work.' },
    { word: 'abundant', definition: 'plentiful or rich', example: 'The region has abundant natural resources.' },
    { word: 'brilliant', definition: 'exceptionally intelligent or bright', example: 'She has a brilliant mind.' },
    { word: 'confident', definition: 'self-assured or certain', example: 'He is confident about his abilities.' },
    { word: 'diligent', definition: 'hardworking and careful', example: 'She is a diligent student.' },
    { word: 'efficient', definition: 'productive with minimum waste', example: 'This is an efficient method.' }
  ],
  'phrasal-200': [
    { word: 'look up', definition: 'to search for information', example: 'I need to look up that word in the dictionary.' },
    { word: 'give up', definition: 'to stop trying', example: 'Don\'t give up on your dreams.' },
    { word: 'put off', definition: 'to postpone', example: 'I had to put off the meeting until next week.' },
    { word: 'get along', definition: 'to have a good relationship', example: 'I get along well with my colleagues.' },
    { word: 'come up with', definition: 'to think of an idea', example: 'She came up with a great solution.' },
    { word: 'run out of', definition: 'to have no more of something', example: 'We ran out of time to finish.' },
    { word: 'catch up with', definition: 'to reach the same level', example: 'I need to catch up with my studies.' },
    { word: 'look after', definition: 'to take care of', example: 'Can you look after my dog while I\'m away?' },
    { word: 'get over', definition: 'to recover from', example: 'It took time to get over the loss.' },
    { word: 'put up with', definition: 'to tolerate', example: 'I can\'t put up with this noise anymore.' },
    { word: 'break down', definition: 'to stop working', example: 'My car broke down on the highway.' },
    { word: 'call off', definition: 'to cancel', example: 'They had to call off the event due to weather.' },
    { word: 'find out', definition: 'to discover', example: 'I need to find out what happened.' },
    { word: 'hand in', definition: 'to submit', example: 'Please hand in your assignments by Friday.' },
    { word: 'keep up with', definition: 'to stay current', example: 'It\'s hard to keep up with technology.' },
    { word: 'make up for', definition: 'to compensate for', example: 'I\'ll make up for the lost time.' },
    { word: 'point out', definition: 'to indicate or mention', example: 'Let me point out the key issues.' },
    { word: 'set up', definition: 'to establish or arrange', example: 'We need to set up a meeting.' },
    { word: 'take over', definition: 'to assume control', example: 'She will take over the project.' },
    { word: 'turn down', definition: 'to reject or refuse', example: 'I had to turn down the job offer.' },
    { word: 'work out', definition: 'to exercise or solve', example: 'I work out at the gym regularly.' },
    { word: 'bring up', definition: 'to raise a topic', example: 'Don\'t bring up that subject again.' },
    { word: 'check out', definition: 'to examine or leave', example: 'Check out this new restaurant.' },
    { word: 'drop off', definition: 'to deliver or decrease', example: 'I\'ll drop off the package.' },
    { word: 'figure out', definition: 'to understand or solve', example: 'I need to figure out this problem.' },
    { word: 'go through', definition: 'to experience or examine', example: 'We went through difficult times.' }
  ],
  'core-200': [
    { word: 'analysis', definition: 'detailed examination of something', example: 'The analysis shows clear improvement.' },
    { word: 'approach', definition: 'a way of dealing with something', example: 'This approach is more effective.' },
    { word: 'available', definition: 'able to be used or obtained', example: 'The book is available in the library.' },
    { word: 'community', definition: 'a group of people living together', example: 'Our community is very diverse.' },
    { word: 'development', definition: 'the process of growing or improving', example: 'Personal development is important.' },
    { word: 'education', definition: 'the process of teaching and learning', example: 'Education is the key to success.' },
    { word: 'experience', definition: 'knowledge or skill from doing something', example: 'Work experience is valuable.' },
    { word: 'government', definition: 'the system that controls a country', example: 'The government announced new policies.' },
    { word: 'important', definition: 'having great significance', example: 'This is an important decision.' },
    { word: 'knowledge', definition: 'facts and information', example: 'Knowledge is power.' },
    { word: 'language', definition: 'a system of communication', example: 'English is a global language.' },
    { word: 'learning', definition: 'the acquisition of knowledge', example: 'Lifelong learning is essential.' },
    { word: 'management', definition: 'the process of controlling', example: 'Good management leads to success.' },
    { word: 'necessary', definition: 'required or essential', example: 'It\'s necessary to plan ahead.' },
    { word: 'opportunity', definition: 'a favorable chance', example: 'This is a great opportunity.' },
    { word: 'population', definition: 'the number of people in an area', example: 'The population is growing rapidly.' },
    { word: 'quality', definition: 'the standard of excellence', example: 'We focus on quality over quantity.' },
    { word: 'research', definition: 'systematic investigation', example: 'Research supports this theory.' },
    { word: 'society', definition: 'a community of people', example: 'Society is constantly changing.' },
    { word: 'technology', definition: 'scientific knowledge for practical use', example: 'Technology advances quickly.' },
    { word: 'understanding', definition: 'comprehension or knowledge', example: 'Understanding leads to empathy.' },
    { word: 'value', definition: 'worth or importance', example: 'Family values are important.' },
    { word: 'welfare', definition: 'well-being or support', example: 'Social welfare programs help people.' },
    { word: 'achievement', definition: 'something accomplished', example: 'Graduation is a great achievement.' },
    { word: 'background', definition: 'past experience or context', example: 'Her background is in science.' },
    { word: 'challenge', definition: 'a difficult task', example: 'This presents a new challenge.' }
  ],
  'bonus-400': [
    { word: 'accomplishment', definition: 'something that has been achieved', example: 'Graduating was a great accomplishment.' },
    { word: 'beneficiary', definition: 'a person who receives benefits', example: 'Students are the main beneficiaries of education.' },
    { word: 'comprehensive', definition: 'including all or nearly all elements', example: 'This is a comprehensive study.' },
    { word: 'determination', definition: 'firmness of purpose', example: 'Her determination led to success.' },
    { word: 'essential', definition: 'absolutely necessary', example: 'Vocabulary is essential for success.' },
    { word: 'facilitation', definition: 'the act of making easier', example: 'Facilitation of learning is our goal.' },
    { word: 'generation', definition: 'all people born at the same time', example: 'The younger generation is tech-savvy.' },
    { word: 'implementation', definition: 'the act of putting into effect', example: 'Implementation takes time and planning.' },
    { word: 'justification', definition: 'a reason or explanation', example: 'What is the justification for this decision?' },
    { word: 'maintenance', definition: 'the act of keeping in good condition', example: 'Regular maintenance prevents problems.' },
    { word: 'negotiation', definition: 'discussion to reach agreement', example: 'Negotiation skills are important in business.' },
    { word: 'obligation', definition: 'a duty or responsibility', example: 'I have an obligation to help.' },
    { word: 'participation', definition: 'the act of taking part', example: 'Active participation is encouraged.' },
    { word: 'qualification', definition: 'a skill or requirement', example: 'What qualifications do you need?' },
    { word: 'recognition', definition: 'acknowledgment or identification', example: 'Recognition of hard work is important.' },
    { word: 'significance', definition: 'importance or meaning', example: 'The significance of this event is clear.' },
    { word: 'transformation', definition: 'a complete change', example: 'Digital transformation is happening everywhere.' },
    { word: 'undertaking', definition: 'a task or project', example: 'This is a major undertaking.' },
    { word: 'validation', definition: 'confirmation or proof', example: 'Validation of results is necessary.' },
    { word: 'witness', definition: 'a person who sees an event', example: 'She was a witness to the accident.' },
    { word: 'yielding', definition: 'producing or giving way', example: 'The soil is yielding good crops.' },
    { word: 'zeal', definition: 'enthusiasm and energy', example: 'He approaches his work with zeal.' },
    { word: 'abundance', definition: 'a large quantity', example: 'There is an abundance of opportunities.' },
    { word: 'brilliance', definition: 'exceptional intelligence', example: 'Her brilliance is evident in her work.' },
    { word: 'confidence', definition: 'self-assurance', example: 'Confidence is key to success.' },
    { word: 'diligence', definition: 'careful and persistent work', example: 'Diligence leads to achievement.' },
    { word: 'efficiency', definition: 'productivity with minimum waste', example: 'Efficiency improves productivity.' }
  ]
}

export default function VocabularyLearningPage() {
  const params = useParams()
  const router = useRouter()
  const listId = params.listId as string
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [showDefinition, setShowDefinition] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const words = vocabularyData[listId as keyof typeof vocabularyData] || []
  const currentWord = words[currentWordIndex]

  const handleShowDefinition = () => {
    setShowDefinition(true)
  }

  const handleNextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
      setShowDefinition(false)
    } else {
      setIsCompleted(true)
    }
  }

  const handleMarkAsKnown = () => {
    setCorrectAnswers(correctAnswers + 1)
    setTotalAnswered(totalAnswered + 1)
    handleNextWord()
  }

  const handleMarkAsUnknown = () => {
    setTotalAnswered(totalAnswered + 1)
    handleNextWord()
  }

  const handleRestart = () => {
    setCurrentWordIndex(0)
    setShowDefinition(false)
    setCorrectAnswers(0)
    setTotalAnswered(0)
    setIsCompleted(false)
  }

  const getListTitle = (id: string) => {
    const titles = {
      'quick-250': 'Quick Vocab Guide - 250 Best Words',
      'phrasal-200': '200 Phrasal Verbs',
      'core-200': '200 Core Vocabulary Words',
      'bonus-400': 'Bonus 400 CELPIP Words'
    }
    return titles[id as keyof typeof titles] || 'Vocabulary List'
  }

  if (isCompleted) {
    const accuracy = Math.round((correctAnswers / totalAnswered) * 100)
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Session Complete!</h1>
          <p className="text-gray-600">Great job completing this vocabulary session</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Results</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{correctAnswers}</div>
                <div className="text-sm text-blue-700">Words Known</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
                <div className="text-sm text-green-700">Accuracy</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              You completed {totalAnswered} words with {accuracy}% accuracy
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleRestart}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Practice Again
          </button>
          <button
            onClick={() => router.push('/vocabulary')}
            className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Back to Vocabulary Lists
          </button>
        </div>
      </div>
    )
  }

  if (!currentWord) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">List Not Found</h1>
          <p className="text-gray-600 mb-6">The vocabulary list you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/vocabulary')}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Vocabulary Lists
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/vocabulary')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Lists</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-1">{getListTitle(listId)}</h1>
          <p className="text-sm text-gray-600">
            Word {currentWordIndex + 1} of {words.length}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(((currentWordIndex + 1) / words.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentWordIndex + 1) / words.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current Word */}
      <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{currentWord.word}</h2>
          
          {!showDefinition ? (
            <button
              onClick={handleShowDefinition}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              <span>Show Definition</span>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Definition:</h3>
                <p className="text-gray-700 mb-3">{currentWord.definition}</p>
                
                <h3 className="font-semibold text-gray-900 mb-2">Example:</h3>
                <p className="text-gray-700 italic">"{currentWord.example}"</p>
              </div>
            </div>
          )}
        </div>

        {showDefinition && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 text-center mb-4">
              Did you know this word?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleMarkAsKnown}
                className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Yes, I knew it</span>
              </button>
              <button
                onClick={handleMarkAsUnknown}
                className="flex items-center justify-center space-x-2 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>No, I didn't</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Session Stats */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Session Progress</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{correctAnswers}</div>
            <div className="text-sm text-gray-600">Words Known</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{totalAnswered}</div>
            <div className="text-sm text-gray-600">Words Reviewed</div>
          </div>
        </div>
      </div>

      {/* Study Tips */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Study Tip</h3>
        <p className="text-sm text-blue-800">
          Take your time to understand each word. Try to use it in a sentence to reinforce your learning.
        </p>
      </div>
    </div>
  )
}
