# DataLens AI – Global Data Chat & Insights

DataLens AI is an innovative platform that enables natural conversations with global datasets through AI-powered chat and visualization.

## Features

- Natural language queries for complex datasets
- Rich visualizations and data insights
- Voice input support
- Real-time data processing
- Multi-turn conversations
- Semantic search capabilities

## Tech Stack

### Frontend
- React.js with TypeScript
- Tailwind CSS for styling
- Vite for build tooling

### Backend
- Node.js with Express.js
- MongoDB Atlas with vector search
- OpenAI GPT-4 integration
- LangChain for prompt management
- Google Cloud services (Cloud Run, Vertex AI, Storage)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Google Cloud account
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/datalens-ai.git
cd datalens-ai
```

2. Install dependencies
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables
```bash
# Frontend (.env)
VITE_API_URL=http://localhost:3000
VITE_OPENAI_API_KEY=your_openai_api_key

# Backend (.env)
MONGODB_URI=your_mongodb_uri
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLOUD_PROJECT=your_project_id
```

4. Start the development servers
```bash
# Start backend
cd backend
npm run dev

# Start frontend (in a new terminal)
cd frontend
npm run dev
```

## Project Structure

```
datalens-ai/
├── frontend/           # React frontend application
├── backend/           # Node.js backend server
├── docs/             # Documentation
└── scripts/          # Utility scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for GPT-4
- MongoDB for Atlas and vector search capabilities
- Google Cloud for infrastructure and AI services 