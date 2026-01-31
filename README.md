# Language Buddy 🇩🇪

A mobile-first language learning application that uses an AI chatbot to create personalized exercises based on your conversations. Currently focused on German language learning.

## Features

### 🤖 Interactive Chat

- Natural conversation with an AI language tutor
- Contextual responses based on your learning level
- Automatic exercise generation from chat interactions
- Real-time feedback and encouragement

### 👤 User Profile

- Customizable learning level
- Target and native language settings
- Personal learning goals
- Progress history

### 🤖 AI Integration

- **OpenAI-powered conversations** - Dynamic, contextual responses tailored to your learning level
- **Conversation memory** - Maintains context across the conversation for better learning

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key (optional, for enhanced AI responses)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd language-buddy
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (optional for OpenAI integration):

```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

4. Start the development server:

```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Mobile Testing

For the best experience, open the developer tools and switch to mobile view, or access the app from your mobile device using your local network IP.

## Usage

1. **Start Chatting**: Begin a conversation with the AI tutor in the Chat tab
2. **Practice**: Try asking questions like:
   - "How do I say 'hello' in German?"
   - "I want to practice verb conjugations"
   - "What are German articles?"
3. **Exercise Generation**: The bot will automatically create exercises based on your conversations
4. **Practice Exercises**: Switch to the Exercises tab to practice
5. **Track Progress**: Monitor your learning in the Progress tab
6. **Customize Profile**: Update your settings in the Profile tab

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icons
- **Mobile-first responsive design**

## Project Structure

```
src/
├── components/           # React components
│   ├── ChatInterface.tsx    # Main chat interface
│   ├── ProfileView.tsx      # User profile management
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   └── chatbot.ts          # AI chatbot logic
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## Features in Development

- [ ] Voice interaction
- [ ] Offline mode
- [ ] Multiple language support
- [ ] Social features (friend progress)
- [ ] Advanced grammar lessons
- [ ] Spaced repetition system

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- German language content and grammar rules
- Mobile-first design principles
- Accessibility best practices
  import reactDom from 'eslint-plugin-react-dom'
