'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Play, Square, Clock, Save, CheckCircle, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

// This will be populated with real data from database
const speakingPrompts: any[] = []

export default function SpeakPage() {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)
  const [isPreparing, setIsPreparing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [prepTimeRemaining, setPrepTimeRemaining] = useState(0)
  const [speakingTimeRemaining, setSpeakingTimeRemaining] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [showRubric, setShowRubric] = useState(false)
  const [selfAssessment, setSelfAssessment] = useState<Record<string, number>>({})
  const [transcript, setTranscript] = useState('')
  const [speakingPrompts, setSpeakingPrompts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const currentPrompt = speakingPrompts.find(prompt => prompt.id === selectedPrompt)

  useEffect(() => {
    async function fetchSpeakingData() {
      try {
        setLoading(true)
        const response = await fetch('/api/speaking/templates')
        if (response.ok) {
          const data = await response.json()
          setSpeakingPrompts(data.templates || [])
        } else {
          throw new Error('Failed to fetch speaking data')
        }
      } catch (error) {
        console.error('Error fetching speaking data:', error)
        setError('Failed to load speaking templates')
      } finally {
        setLoading(false)
      }
    }
    
    fetchSpeakingData()
  }, [])

  useEffect(() => {
    if (isPreparing && prepTimeRemaining > 0) {
      const timer = setInterval(() => {
        setPrepTimeRemaining(prev => {
          if (prev <= 1) {
            setIsPreparing(false)
            setIsSpeaking(true)
            setSpeakingTimeRemaining(currentPrompt?.speakingTime || 0)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isPreparing, prepTimeRemaining, currentPrompt])

  useEffect(() => {
    if (isSpeaking && speakingTimeRemaining > 0) {
      const timer = setInterval(() => {
        setSpeakingTimeRemaining(prev => {
          if (prev <= 1) {
            setIsSpeaking(false)
            stopRecording()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isSpeaking, speakingTimeRemaining])

  const startPreparation = async () => {
    if (!currentPrompt) return
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
      }
      
      setIsPreparing(true)
      setPrepTimeRemaining(currentPrompt.prepTime)
      setSelfAssessment({})
      setTranscript('')
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Please allow microphone access to record your speaking practice.')
    }
  }

  const startRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      mediaRecorderRef.current.start()
      setIsRecording(true)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  const handleSelfAssessment = (criterion: string, score: number) => {
    setSelfAssessment(prev => ({ ...prev, [criterion]: score }))
  }

  const saveAttempt = () => {
    // Save attempt logic here
    console.log('Saving speaking attempt:', { 
      promptId: currentPrompt?.id, 
      audioBlob, 
      transcript, 
      selfAssessment,
      timeSpent: (currentPrompt?.prepTime || 0) + (currentPrompt?.speakingTime || 0) - prepTimeRemaining - speakingTimeRemaining
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-600 border-2 border-orange-600 border-t-transparent rounded-full"></div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Loading Speaking Templates...</h1>
          <p className="text-gray-600">Fetching your real CELPIP speaking content from the database</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Error Loading Speaking</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!selectedPrompt) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Speaking Practice</h1>
          <p className="text-gray-600">
            Choose a speaking prompt to practice your CELPIP speaking skills with {speakingPrompts.length} real templates
          </p>
        </div>

        <div className="space-y-4">
          {speakingPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="bg-white rounded-lg p-4 shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedPrompt(prompt.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{prompt.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{prompt.description}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Prep: {prompt.prepTime}s</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mic className="w-3 h-3" />
                      <span>Speak: {prompt.speakingTime}s</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!isPreparing && !isSpeaking) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="mb-6">
          <button
            onClick={() => setSelectedPrompt(null)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <Mic className="w-4 h-4" />
            <span>← Back to Prompts</span>
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentPrompt?.title}</h1>
          <p className="text-gray-600 mb-4">{currentPrompt?.description}</p>
          
          <div className="bg-orange-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-orange-900 mb-2">Speaking Task</h3>
            <div className="space-y-2 text-sm text-orange-800">
              <div className="flex justify-between">
                <span>Preparation Time:</span>
                <span className="font-medium">{currentPrompt?.prepTime} seconds</span>
              </div>
              <div className="flex justify-between">
                <span>Speaking Time:</span>
                <span className="font-medium">{currentPrompt?.speakingTime} seconds</span>
              </div>
            </div>
          </div>

          <button
            onClick={startPreparation}
            className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            Start Preparation
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      {/* Header with Timer */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-4">{currentPrompt?.title}</h1>
        
        <div className={cn(
          'border rounded-lg p-4 mb-4',
          isPreparing ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className={cn(
                "w-5 h-5",
                isPreparing ? 'text-blue-500' : 'text-red-500'
              )} />
              <span className={cn(
                'font-medium',
                isPreparing ? 'text-blue-700' : 'text-red-700'
              )}>
                {isPreparing ? 'Preparation Time' : 'Speaking Time'}
              </span>
            </div>
            <div className={cn(
              'text-2xl font-bold',
              isPreparing ? 'text-blue-600' : 'text-red-600'
            )}>
              {formatTime(isPreparing ? prepTimeRemaining : speakingTimeRemaining)}
            </div>
          </div>
        </div>
      </div>

      {/* Recording Controls */}
      {isSpeaking && (
        <div className="bg-white rounded-lg p-4 mb-6 border">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              {isRecording ? 'Recording... Speak now!' : 'Click record when ready to speak'}
            </p>
            
            <div className="flex justify-center space-x-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <Mic className="w-8 h-8 text-white" />
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                >
                  <Square className="w-6 h-6 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Template */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-green-900 mb-2">📝 Speaking Template</h3>
        <pre className="text-sm text-green-800 whitespace-pre-wrap font-sans">
          {currentPrompt?.template}
        </pre>
      </div>

      {/* Audio Playback */}
      {audioUrl && (
        <div className="bg-white rounded-lg p-4 mb-6 border">
          <h3 className="font-semibold text-gray-900 mb-3">🎵 Your Recording</h3>
          <audio controls className="w-full mb-3">
            <source src={audioUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setTranscript('')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}

      {/* Self-Assessment */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-3">📊 Self-Assessment</h3>
        <div className="space-y-3">
          {currentPrompt?.rubric && Object.entries(currentPrompt.rubric).map(([criterion, description]) => (
            <div key={criterion} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-800 capitalize">
                  {criterion.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-xs text-blue-600">
                  {selfAssessment[criterion] || 0}/5
                </span>
              </div>
              <p className="text-xs text-blue-700">{String(description)}</p>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    onClick={() => handleSelfAssessment(criterion, score)}
                    className={cn(
                      'w-8 h-8 rounded text-xs font-medium transition-colors',
                      selfAssessment[criterion] === score
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50'
                    )}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={() => {
            setSelectedPrompt(null)
            setIsPreparing(false)
            setIsSpeaking(false)
          }}
          className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          Back to Prompts
        </button>
        {audioUrl && (
          <button
            onClick={saveAttempt}
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Save Attempt
          </button>
        )}
      </div>
    </div>
  )
}
