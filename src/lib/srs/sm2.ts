export interface SrsCard {
  id: string
  vocabId: string
  userId: string
  algorithm: 'SM2' | 'FSRS'
  repetitions: number
  intervalDays: number
  easeFactor: number
  dueAt: Date
  lastReviewedAt?: Date
  lapses: number
  qualityHistory: number[]
  suspended: boolean
}

export interface ReviewResult {
  newInterval: number
  newEaseFactor: number
  newRepetitions: number
  nextReview: Date
}

export class SM2Algorithm {
  private static readonly MIN_EASE_FACTOR = 1.3
  private static readonly DEFAULT_EASE_FACTOR = 2.5
  private static readonly LEARNING_STEPS = [10 / (24 * 60), 1] // 10 minutes, 1 day

  static calculateNextReview(card: SrsCard, quality: number): ReviewResult {
    const { repetitions, intervalDays, easeFactor, lapses } = card

    let newInterval: number
    let newEaseFactor: number
    let newRepetitions: number

    if (quality < 3) {
      // Failed - reset to learning
      newInterval = this.LEARNING_STEPS[0]
      newEaseFactor = Math.max(this.MIN_EASE_FACTOR, easeFactor - 0.2)
      newRepetitions = 0
    } else {
      // Passed
      if (repetitions === 0) {
        // First review - move to next learning step
        newInterval = this.LEARNING_STEPS[Math.min(repetitions + 1, this.LEARNING_STEPS.length - 1)]
        newRepetitions = repetitions + 1
      } else if (repetitions === 1) {
        // Second review - move to next learning step or graduate
        if (repetitions + 1 < this.LEARNING_STEPS.length) {
          newInterval = this.LEARNING_STEPS[repetitions + 1]
        } else {
          newInterval = 1 // Graduate to 1 day
        }
        newRepetitions = repetitions + 1
      } else {
        // Graduated - use interval
        newInterval = Math.round(intervalDays * easeFactor)
        newRepetitions = repetitions + 1
      }

      // Update ease factor
      newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
      newEaseFactor = Math.max(this.MIN_EASE_FACTOR, newEaseFactor)
    }

    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + newInterval)

    return {
      newInterval,
      newEaseFactor,
      newRepetitions,
      nextReview
    }
  }

  static isDue(card: SrsCard): boolean {
    return new Date() >= card.dueAt
  }

  static getDueCards(cards: SrsCard[]): SrsCard[] {
    return cards.filter(card => this.isDue(card))
  }

  static getNewCards(cards: SrsCard[], maxNew: number = 20): SrsCard[] {
    const newCards = cards.filter(card => card.repetitions === 0 && !card.suspended)
    return newCards.slice(0, maxNew)
  }

  static getLearningCards(cards: SrsCard[]): SrsCard[] {
    return cards.filter(card => 
      card.repetitions > 0 && 
      card.repetitions < 3 && 
      !card.suspended
    )
  }

  static getReviewCards(cards: SrsCard[]): SrsCard[] {
    return cards.filter(card => 
      card.repetitions >= 3 && 
      !card.suspended
    )
  }
}
