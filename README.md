# CELPIP Coach

A mobile-first, offline-capable Progressive Web App (PWA) designed to help students master the CELPIP exam through spaced repetition, targeted practice, and comprehensive study tools.

## 🎯 Features

### Core Learning Tools
- **Vocabulary SRS (Spaced Repetition System)** - SM-2 algorithm for optimal retention
- **Listening Practice** - Exam-style questions with audio playback
- **Reading Practice** - Comprehension exercises with various question types
- **Writing Practice** - Task 1 (Email) and Task 2 (Survey Response) with templates
- **Speaking Practice** - Recording, timing, and self-assessment rubrics

### Study Management
- **Progress Dashboard** - Track performance across all skills
- **Study Planner** - Personalized daily study recommendations
- **Goal Setting** - Target CELPIP 10+ with progress tracking
- **Offline Support** - Practice anywhere, anytime

### Mobile-First Design
- **Responsive UI** - Optimized for phone and tablet use
- **PWA Features** - Installable app with offline capabilities
- **Touch-Friendly** - Large buttons and intuitive navigation
- **Accessibility** - WCAG 2.1 AA compliant

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- CELPIP study materials (PDFs/DOCX files)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd celpip-coach
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   DATABASE_URL="file:./dev.db"
   PATH_TO_MATERIALS_ROOT="/path/to/your/celpip/materials"
   NEXT_PUBLIC_APP_NAME="CELPIP Coach"
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Ingestion Pipeline

The app includes tools to import your CELPIP study materials:

### List Available Files
```bash
npm run ingest:list
```
Scans your materials directory and categorizes files by type.

### Import Vocabulary
```bash
npm run ingest:vocab
```
Extracts vocabulary, idioms, and phrasal verbs from your materials.

### Import Questions & Answers
```bash
npm run ingest:qa
```
Parses reading and listening questions with answer keys.

### Import Templates
```bash
npm run ingest:templates
```
Extracts writing and speaking templates for practice.

## 🗄️ Database Schema

The app uses Prisma with SQLite for local-first storage:

- **User & Profile** - User management and goal setting
- **Vocab & SRS** - Vocabulary items and spaced repetition cards
- **Passages & Questions** - Practice content and assessments
- **Writing & Speaking** - Practice attempts and self-assessments
- **Progress Tracking** - Performance metrics and achievements

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:studio` - Open Prisma Studio
- `npm run db:push` - Push schema changes to database

### Project Structure
```
celpip-coach/
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # React components
│   ├── lib/          # Utilities and configurations
│   └── styles/       # Global styles
├── prisma/           # Database schema and migrations
├── scripts/          # Ingestion and utility scripts
├── public/           # Static assets and PWA files
└── package.json
```

### Key Technologies
- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Prisma ORM, SQLite
- **State Management**: React Query (TanStack Query)
- **PWA**: Service Worker, Web App Manifest
- **Audio**: Web Audio API, MediaRecorder

## 📱 PWA Features

### Installation
- Install as a native app on your phone/tablet
- Works offline for core features
- Automatic updates when online

### Offline Capabilities
- Vocabulary reviews
- Practice questions
- Writing drafts
- Progress tracking
- Audio recordings (local storage)

## 🎨 Customization

### Themes
- Light and dark mode support
- Customizable color schemes
- Responsive design breakpoints

### Study Settings
- Adjustable SRS parameters
- Custom practice timing
- Personalized difficulty levels
- Goal setting and tracking

## 🔒 Privacy & Security

- **Local-First**: All data stored locally by default
- **No Uploads**: Study materials never leave your device
- **Optional Sync**: Cloud sync only if explicitly enabled
- **Data Export**: Full control over your progress data

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel with automatic CI/CD
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables
```bash
# Required
DATABASE_URL="file:./dev.db"

# Optional
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-supabase-key"
OPENAI_API_KEY="your-openai-key"
NEXT_PUBLIC_APP_NAME="CELPIP Coach"
```

## 📊 Performance

- **Lighthouse Score**: 90+ on mobile
- **Core Web Vitals**: Optimized for mobile experience
- **Bundle Size**: Minimal JavaScript footprint
- **Loading Speed**: Fast initial load and navigation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for personal study use only. Please respect copyright and do not distribute proprietary content.

## 🆘 Support

### Common Issues
- **Database errors**: Run `npm run db:push` to sync schema
- **Audio recording**: Ensure microphone permissions are granted
- **Offline mode**: Check service worker registration in browser dev tools

### Getting Help
- Check the [Issues](../../issues) page for known problems
- Review the [Discussions](../../discussions) for community help
- Ensure your environment variables are correctly set

## 🎯 Roadmap

### Upcoming Features
- **FSRS Algorithm** - Advanced spaced repetition
- **AI Feedback** - Writing and speaking assessment
- **Grammar Checker** - Real-time writing assistance
- **Study Groups** - Collaborative learning features
- **Advanced Analytics** - Detailed performance insights

### Long-term Goals
- **Multi-language Support** - Additional language versions
- **Cloud Sync** - Cross-device progress synchronization
- **Mobile Apps** - Native iOS and Android applications
- **Integration APIs** - Connect with other study tools

---

**Happy studying! 🎓📚**

*CELPIP Coach - Your path to CELPIP 10+ starts here.*
