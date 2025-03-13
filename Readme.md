# RuneQuest: Norse Rune Application

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Node.js Version](https://img.shields.io/badge/Node.js-16.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0-green)

ᚱᚢᚾᛂ ᛩᚢᛂᛊᛏ (Rune Quest) is a comprehensive web application for exploring, learning, and practicing Norse runes through interactive modules.

## 📋 Table of Contents

- [Technologies](#technologies)
- [Features](#features)
- [Achievement System](#achievement-system)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## 🔧 Technologies

### Backend Technology Stack

| Technology | Version  | Purpose                                          | Alternatives         | License |
| ---------- | -------- | ------------------------------------------------ | -------------------- | ------- |
| Node.js    | 16.x+    | JavaScript runtime for server-side execution     | Deno, Bun            | MIT     |
| Express.js | 4.x      | Web framework for building RESTful APIs          | Koa, Fastify, NestJS | MIT     |
| MongoDB    | 5.0+     | NoSQL database for flexible data storage         | PostgreSQL, MySQL    | SSPL    |
| Mongoose   | 6.x      | MongoDB object modeling and schema validation    | Prisma, TypeORM      | MIT     |
| Jest       | 29.x     | Testing framework for unit and integration tests | Mocha, Jasmine       | MIT     |
| Crypto     | Built-in | Password encryption and security                 | bcrypt, Argon2       | MIT     |

### Why These Technologies?

- **Node.js & Express**: Chosen for their robust ecosystem, excellent documentation, and performance characteristics. The non-blocking I/O model is ideal for handling multiple concurrent requests in our application.

- **MongoDB & Mongoose**: Selected for flexible schema design that accommodates our diverse data models (runes, readings, users) and evolving requirements. MongoDB's document-based structure aligns perfectly with JSON-like data exchange.

- **Jest**: Provides a zero-configuration testing experience with built-in mocking capabilities, making it ideal for testing both synchronous and asynchronous code.

- **Crypto (Node.js built-in)**: Used for password encryption instead of external libraries to reduce dependencies while maintaining strong security practices.

### Hardware Requirements

- **Server**: Any system capable of running Node.js (minimum 1GB RAM, 1 CPU core)
- **Database**: MongoDB instance (local or cloud-based like MongoDB Atlas)
- **Development**: Modern web browser and code editor
- **Client**: Device with modern web browser support

## ✨ Features

- **Learning Module**: Interactive education on Norse runes
- **Puzzle Module**: Engaging rune-based puzzles and challenges
- **Divination Module**: Virtual rune readings with interpretations
- **User Dashboard**: Progress tracking and personalization
- **Authentication**: Secure user account management
- **Achievement System**: Gamified progression with unlockable achievements

## 🏆 Achievement System

The RuneQuest achievement system provides users with goals to strive for while learning about Norse runes, enhancing engagement and motivation through gamification principles.

### How Achievements Work

Each achievement has specific requirements that users must meet to unlock it. When a user completes an action that fulfills these requirements, the achievement is automatically awarded. Achievements award points that contribute to the user's overall score and profile level.

### Achievement Categories

RuneQuest achievements are organized into the following categories:

- **Quiz Achievements**: Awarded for completing quizzes with various difficulty levels
- **Reading Achievements**: Unlocked by reading and completing educational articles
- **Puzzle Achievements**: Earned by solving Norse rune puzzles
- **Collection Achievements**: Granted for learning complete sets of runes
- **Streak Achievements**: Rewarded for consistent daily activity

### Available Achievements

| Achievement                 | Description                                  | Requirement                             | Points |
| --------------------------- | -------------------------------------------- | --------------------------------------- | ------ |
| **Quiz Achievements**       |
| Rune Novice                 | Complete your first quiz                     | Complete 1 quiz                         | 10     |
| Rune Apprentice             | Complete 10 quizzes of any difficulty        | Complete 10 quizzes                     | 25     |
| Rune Scholar                | Complete 5 hard quizzes with perfect scores  | Complete 5 hard quizzes with 100% score | 50     |
| **Reading Achievements**    |
| Curious Mind                | Read your first article                      | Complete 1 reading                      | 10     |
| Rune Historian              | Complete 10 readings                         | Complete 10 readings                    | 30     |
| **Puzzle Achievements**     |
| Puzzle Solver               | Complete your first puzzle                   | Complete 1 puzzle                       | 15     |
| Puzzle Master               | Complete 10 puzzles                          | Complete 10 puzzles                     | 35     |
| **Streak Achievements**     |
| Dedicated Student           | Achieve a 7-day streak                       | Log in for 7 consecutive days           | 20     |
| Rune Devotee                | Achieve a 30-day streak                      | Log in for 30 consecutive days          | 100    |
| **Collection Achievements** |
| Elder Futhark Collector     | Learn all runes from the Elder Futhark set   | Learn all 24 Elder Futhark runes        | 75     |
| Younger Futhark Collector   | Learn all runes from the Younger Futhark set | Learn all 16 Younger Futhark runes      | 75     |
| Anglo-Saxon Collector       | Learn all runes from the Anglo-Saxon set     | Learn all 33 Anglo-Saxon runes          | 75     |

### Technical Implementation

Achievements are automatically checked and awarded through the progression system. When a user completes an action (quiz, reading, etc.), the system:

1. Records the action in the user's progression record
2. Checks if any achievement requirements are newly met
3. Awards and displays new achievements to the user
4. Updates the user's total points

The achievement system is extensible, allowing new achievements to be added as the application evolves.

## 🚀 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/TheOmegaFett/RuneQuest.git
   cd RuneQuest
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server:
   ```bash
   cd backend
   npm run dev
   ```

## 🔍 API Documentation

The API follows RESTful principles with standardized response formats:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "metadata": {
    "timestamp": "",
    "version": "1.0"
  }
}
```

### Endpoints

#### User Management

- `/api/users`
  - `POST /register` - Create new user account
    - Request: `{ "username": "string", "email": "string", "password": "string" }`
  - `POST /login` - Authenticate user
    - Request: `{ "email": "string", "password": "string" }`
    - Response: `{ "token": "JWT", "user": {} }`
  - `GET /profile` - Get current user profile (requires authentication)
  - `PUT /profile` - Update user profile (requires authentication)
  - `GET /progress` - Retrieve user learning progress (requires authentication)

#### Runes Information

- `/api/runes`
  - `GET /` - List all runes (supports pagination with `?page=n&limit=m`)
  - `GET /:id` - Get detailed information about specific rune
  - `GET /category/:categoryName` - Filter runes by category
  - `GET /search?name=term` - Search runes by name

#### Learning Assessments

- `/api/quizzes`
  - `GET /easy` - Retrieves questions with 2 options (1 correct, 1 incorrect)
  - `GET /medium` - Retrieves questions with 3 options (1 correct, 2 incorrect)
  - `GET /hard` - Retrieves questions with 4 options (1 correct, 3 incorrect)
  - `POST /check` - Verifies if selected answer is correct
    - Request: `{ "questionId": "id", "selectedAnswer": "answer" }`
    - Response: `{ "isCorrect": boolean, "correctAnswer": "string", "additionalInfo": "string" }`
  - Supports optional query parameter `?count=n` to specify number of questions (default: 10)

#### Divination Readings

- `/api/readings`
  - `POST /` - Create new reading
    - Request: `{ "layout": "string", "question": "string" }`
    - Response: Array of runes with positions and interpretations
  - `GET /` - List user's past readings (requires authentication)
  - `GET /:id` - Retrieve specific reading details
  - `DELETE /:id` - Remove saved reading (requires authentication)

#### Interactive Challenges

- `/api/puzzles`
  - `GET /` - List available puzzles (supports pagination)
  - `GET /:id` - Get specific puzzle
  - `GET /category/:categoryName` - Filter puzzles by category
  - `GET /difficulty/:level` - Filter puzzles by difficulty (easy, medium, hard)
  - `POST /:id/solve` - Submit puzzle solution
    - Request: `{ "solution": "string" }`
    - Response: `{ "correct": boolean, "hints": [], "points": number }`

#### Audio Resources

- `/api/audio`
  - `GET /pronunciations/:runeName` - Get audio file for rune pronunciation
  - `GET /meditations/:runeName` - Get meditation audio associated with specific rune

#### Rune Categories

- `/api/categories`
  - `GET /` - List all available rune categories (Elder Futhark, Younger Futhark, etc.)
  - `GET /:id` - Get detailed information about a specific category
  - `GET /:id/runes` - List all runes belonging to a specific category

#### Divination Layouts

- `/api/divination`
  - `GET /layouts` - List available divination layouts
  - `GET /layouts/:name` - Get detailed information about a specific layout
  - `GET /interpretations/:runeId` - Get divination interpretations for specific rune

#### Achievement System

- `/api/achievements`
  - `GET /` - List all available achievements
    - Supports optional filter with `?category=quiz|reading|puzzle|general`
  - `GET /:id` - Get detailed information about specific achievement
  - `GET /user` - Get current user's earned achievements (requires authentication)
  - `GET /unearned` - Get achievements user hasn't earned yet (requires authentication)
  - `GET /recent` - Get user's most recently earned achievements (requires authentication)
    - Supports limiting results with `?limit=n` (default: 5)

#### User Progression

- `/api/progression`
  - `GET /:userId` - Get user's progress data (achievements, quizzes, readings)
  - `POST /quiz` - Update quiz progress
    - Request: `{ "userId": "id", "quizId": "id", "score": number, "correctAnswers": number, "totalQuestions": number, "difficulty": "string" }`
  - `POST /reading` - Update reading progress
    - Request: `{ "userId": "id", "readingId": "id", "isCompleted": boolean }`
  - `GET /stats/:userId` - Get user's achievement statistics
    - Response: `{ "totalAchievements": number, "totalPoints": number, "categoryBreakdown": {}, "completionPercentage": number }`

## 🧪 Testing

RuneQuest includes comprehensive test coverage using Jest. Follow these steps to run the test suite:

### Running Tests

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Run the test suite:
   ```bash
   npm test
   ```

This executes all tests in the `src/testing` directory and displays detailed results in the console, including test successes, failures, and execution time.

### Test Structure

The testing framework covers:

- **Unit Tests**: Tests individual components in isolation
- **Integration Tests**: Verifies interaction between components
- **Controller Tests**: Validates API endpoint behavior
- **Model Tests**: Ensures data validation and relationships work correctly
- **Middleware Tests**: Confirms request processing functions properly
- **Achievement Tests**: Validates achievement unlocking and user progression tracking

Each component has its own test file following the pattern `componentName.test.js`, making it easy to locate specific tests.

#### Achievement-Specific Tests

The achievement testing suite (`achievement.test.js`) verifies:

- Achievement model validation
- Achievement API endpoints
- Achievement retrieval by ID and category
- Creation of new achievements

The user progression testing suite (`progression.test.js`) validates:

- Recording of user activities
- Proper tracking of progress toward achievements
- Automatic achievement unlocking when requirements are met
- Correct user statistics calculations

### Test Coverage

For a detailed analysis of test coverage:

```bash
npm run test:coverage
```

This generates a report showing which parts of the codebase are well-tested and which might need additional coverage.

### Adding New Tests

When extending the application with new features, follow these testing principles:

1. Write tests before implementing features (TDD approach)
2. Ensure every endpoint has corresponding test cases
3. Test both success and error scenarios
4. Mock external dependencies

The existing tests serve as excellent examples for creating new tests that follow the project's conventions.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Note: Contributions will only be accepted once the project is marked by our team as "ready for contributions". This is to ensure our project may be submitted to our Training Intitute for review witout any issues.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Norse mythology resources
- Open-source libraries and frameworks
- Team contributors

---

_ᚱᚢᚾᛂ ᛩᚢᛂᛊᛏ - Explore the ancient wisdom of the runes_
