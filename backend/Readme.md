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

| Technology            | Version  | Purpose                                          | Alternatives         | License |
| --------------------- | -------- | ------------------------------------------------ | -------------------- | ------- |
| Node.js               | 16.x+    | JavaScript runtime for server-side execution     | Deno, Bun            | MIT     |
| Express.js            | 4.x      | Web framework for building RESTful APIs          | Koa, Fastify, NestJS | MIT     |
| MongoDB               | 5.0+     | NoSQL database for flexible data storage         | PostgreSQL, MySQL    | SSPL    |
| Mongoose              | 6.x      | MongoDB object modeling and schema validation    | Prisma, TypeORM      | MIT     |
| Jest                  | 29.x     | Testing framework for unit and integration tests | Mocha, Jasmine       | MIT     |
| Crypto                | Built-in | Password encryption and security                 | bcrypt, Argon2       | MIT     |
| JWT                   | 9.x      | Stateless authentication with secure tokens      | Passport, OAuth2     | MIT     |
| MongoDB Memory Server | 8.x      | In-memory MongoDB for isolated testing           | -                    | MIT     |
| Express Middleware    | 4.x      | Custom request processing and authorization      | Connect, Koa         | MIT     |

### Industry Relevance of Chosen Technologies

#### Node.js

Node.js dominates the modern web development landscape with over 50% of developers using it for server-side applications according to the 2023 Stack Overflow Developer Survey. Its event-driven, non-blocking I/O model has revolutionized backend development, enabling highly scalable applications. Companies like Netflix, LinkedIn, and Uber rely on Node.js for their production systems due to its performance characteristics and extensive ecosystem.

#### Express.js

Express.js remains the most widely adopted Node.js framework with 23+ million weekly downloads on npm. Its minimalist approach provides the flexibility that enterprises need while maintaining robust functionality. Major companies including IBM, Accenture, and Uber have built production systems using Express, demonstrating its industry acceptance and reliability.

#### MongoDB

MongoDB ranks as the most popular NoSQL database according to DB-Engines, with widespread adoption across industries from financial services (Capital One) to retail (eBay) and gaming (Epic Games). Its document-oriented structure aligns perfectly with modern JavaScript applications, eliminating the object-relational impedance mismatch that plagues traditional SQL databases when working with JSON data.

#### Mongoose

Mongoose has become the de facto standard for MongoDB object modeling in Node.js applications with 4+ million weekly downloads. Its schema validation, middleware, and query building capabilities significantly improve developer productivity when working with MongoDB.

#### Jest

Jest has emerged as the leading JavaScript testing framework with adoption by Facebook, Twitter, and Airbnb. Its zero-configuration approach and built-in code coverage reporting make it particularly valuable for maintaining high-quality codebases.

#### Crypto (Node.js built-in)

The native Crypto module provides industry-standard cryptographic functions that follow NIST guidelines for secure password hashing and encryption, essential for applications handling user credentials.

#### JWT (JSON Web Tokens)

JWT has become the industry standard for stateless authentication in web applications, with over 9 million weekly downloads on npm. Its compact, self-contained format allows for secure transmission of user identity information without requiring server-side session storage.

#### MongoDB Memory Server

This specialized testing utility creates ephemeral MongoDB instances in memory, enabling isolated and reproducible tests without external dependencies. It's widely used in professional Node.js applications for reliable test suites.

#### Express Middleware

The middleware pattern is central to Express.js architecture, allowing for modular request processing pipelines. RuneQuest leverages custom middleware for authentication, authorization, and request validation.

### Detailed Comparison to Alternative Technologies

#### Node.js vs. Alternatives

- **Deno**: While Deno offers improved security with its permissions system and TypeScript support out-of-the-box, it lacks Node.js's mature ecosystem (1M+ npm packages). Deno's adoption remains limited to experimental projects rather than production systems.
- **Bun**: Bun promises significantly faster performance than Node.js through its use of the JavaScriptCore engine, but its recency (released 2022) means limited production testing and ecosystem integration.
- **Python (Django/Flask)**: While powerful for data science applications, Python frameworks typically demonstrate lower request throughput than Node.js for I/O-bound web applications, making them less suitable for our high-concurrency requirements.

#### Express.js vs. Alternatives

- **Koa**: Created by the Express team, Koa offers a more modern middleware architecture using async/await, but has a smaller ecosystem and community compared to Express.
- **Fastify**: Provides better performance metrics than Express (up to 2x faster in benchmarks) but requires more configuration and has a steeper learning curve.
- **NestJS**: Offers superior TypeScript integration and Angular-inspired architecture, but introduces additional complexity and abstraction layers that aren't necessary for our specific application needs.
- **Hapi.js**: Focuses on configuration over code, which can reduce bugs but increases boilerplate compared to Express's minimalist approach.

#### MongoDB vs. Alternatives

- **PostgreSQL**: Provides ACID compliance and relational data integrity that MongoDB has only recently addressed with multi-document transactions. However, PostgreSQL requires predefined schemas that reduce flexibility for our evolving data models.
- **MySQL**: Offers better query performance for complex joins but lacks MongoDB's horizontal scaling capabilities and flexible document structure.
- **Firebase**: Provides excellent real-time capabilities but introduces vendor lock-in and potential scaling costs that MongoDB Atlas avoids.
- **DynamoDB**: AWS's NoSQL solution offers excellent scalability but with complex pricing models and less intuitive query capabilities compared to MongoDB.

#### Mongoose vs. Alternatives

- **Prisma**: Offers superior type safety and auto-completion through its generated TypeScript client, but is primarily designed for SQL databases with MongoDB support being relatively recent.
- **TypeORM**: Provides excellent TypeScript integration but focuses more on SQL databases, with less comprehensive MongoDB support than Mongoose.
- **Native MongoDB Driver**: Offers better performance than Mongoose but lacks schema validation and middleware capabilities that improve code organization and data integrity.

#### Jest vs. Alternatives

- **Mocha**: Requires additional configuration and separate libraries for assertions and mocking, unlike Jest's all-in-one approach.
- **Jasmine**: Provides a similar all-in-one testing experience but lacks Jest's snapshot testing and interactive watch mode.
- **Vitest**: Offers faster performance through Vite's bundling but is primarily designed for component testing rather than backend API testing.

#### Crypto vs. Alternatives

- **bcrypt**: Provides specialized password hashing but introduces an additional dependency with native bindings that can complicate deployment.
- **Argon2**: Offers stronger security as the winner of the Password Hashing Competition but has less widespread adoption and support than the Node.js built-in crypto module.
- **Auth0/Passport**: Provides comprehensive authentication frameworks but introduces unnecessary complexity for our specific authentication requirements.

### Comprehensive Purpose of Chosen Technologies

Our technology stack forms a cohesive ecosystem specifically designed for building secure, scalable, and maintainable web applications:

#### Data Layer

**MongoDB** was selected specifically for its document-oriented structure, which perfectly models our diverse data entities (runes, readings, user profiles, achievements) without requiring complex joins or rigid schemas. The flexible schema design accommodates our evolving requirements without migration headaches. **Mongoose** adds a crucial layer of schema validation and middleware capabilities that enforce data integrity while simplifying database operations through its intuitive API.

#### Quality Assurance

**Jest** forms the cornerstone of our testing strategy, enabling comprehensive test coverage across unit, integration, and functional tests. Its snapshot testing capabilities are particularly valuable for ensuring API response consistency, while its mocking features allow isolated testing of components with external dependencies.

#### Security Infrastructure

The **Crypto** module provides industry-standard encryption for sensitive user data, especially password hashing using the PBKDF2 algorithm with appropriate key stretching parameters. This approach follows OWASP recommendations for secure credential storage while maintaining high performance.

### Security Implementation Details

The RuneQuest application implements a robust security architecture:

#### Authentication System

- **Custom Password Encryption**: Implements PBKDF2 algorithm through Node's Crypto module with appropriate iteration counts and key lengths
- **Salt Generation**: Each user password is secured with a unique cryptographically strong salt
- **JWT Authentication**: Stateless authentication using signed JSON Web Tokens with configurable expiration
- **Protected Routes**: API endpoints requiring authentication are protected by custom middleware

#### Authorization Framework

- **Role-based Access Control**: Different permission levels for regular users vs administrators
- **Resource Ownership Verification**: Users can only access their own data unless they have admin privileges
- **Admin-only Operations**: System-wide operations like user management restricted to admin accounts

### Testing Infrastructure

RuneQuest employs a comprehensive testing strategy:

- **Isolated Database Testing**: Using mongodb-memory-server to create ephemeral MongoDB instances for each test run
- **Model Validation Tests**: Verifies data integrity constraints and schema validation
- **Controller Tests**: Ensures API endpoints handle requests and responses correctly
- **Authentication Tests**: Validates security middleware and access controls
- **Achievement System Tests**: Verifies achievement unlocking logic and progression tracking

### Licensing Considerations

Our technology choices reflect careful consideration of licensing implications:

- **MIT License** (Node.js, Express.js, Mongoose, Jest): The permissive MIT license allows unrestricted use, modification, and distribution, making it ideal for both commercial and open-source applications. This licensing model ensures we can freely incorporate these technologies without complex legal requirements.

- **Server Side Public License (SSPL)** (MongoDB): While more restrictive than MIT, MongoDB's SSPL license doesn't impact our application since we're not offering MongoDB as a service. This license requires that anyone making the functionality of MongoDB available as a service must release the entire service code under the same license. For our use case as an application using MongoDB, there are no restrictions.

- **Built-in Node.js modules** (Crypto): As part of the Node.js core, these modules inherit Node's MIT license, eliminating any additional licensing concerns.

Our careful selection of primarily MIT-licensed components minimizes licensing compliance overhead while ensuring legal protection for both developers and users of the RuneQuest application.

### Hardware Requirements

The RuneQuest application has been designed with scalability and accessibility in mind, with the following hardware considerations:

#### Development Environment

- **Processor**: Any modern multi-core CPU (Intel Core i5/AMD Ryzen 5 or better recommended)
- **Memory**: Minimum 8GB RAM for comfortable development experience
- **Storage**: 1GB free space for application code, dependencies, and local database
- **Operating System**: Platform-independent (Windows 10+, macOS 10.15+, or Linux)
- **Development Tools**: Modern code editor (VS Code, WebStorm, etc.) and Git for version control

#### Production Server Requirements

- **Minimum Viable Configuration**:

  - CPU: 1 vCPU (2+ GHz)
  - RAM: 1GB dedicated memory
  - Storage: 10GB SSD storage for application, logs, and database
  - Network: 1Gbps connection with reasonable monthly transfer allowance

- **Recommended Configuration** (supporting 5000+ daily active users):
  - CPU: 2+ vCPUs (2.5+ GHz)
  - RAM: 4GB dedicated memory
  - Storage: 25GB SSD storage with backup capabilities
  - Network: 1Gbps connection with unlimited transfer
  - Monitoring: Server health and performance tracking

#### Database Hosting Options

- **Self-hosted**: Requires additional server resources beyond application hosting
- **MongoDB Atlas**: Cloud-hosted solution with flexible scaling (free tier available for development)

#### Client Requirements

- **Modern web browser**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Screen resolution**: Minimum 1280x720 (responsive design supports mobile devices)
- **Internet connection**: 1Mbps+ for optimal experience

### Coding Style Guide

The RuneQuest project follows a comprehensive style guide detailed in our [backend-style-guide.md](./backend-style-guide.md) file. This guide covers:

- Naming conventions for variables, functions, classes, and constants
- Indentation and spacing standards
- Documentation requirements using JSDoc
- Data structure and validation approaches
- API design patterns and response formats
- Database interaction best practices
- Security implementations
- Logging and monitoring standards
- Development workflow procedures

All contributors should review this style guide before submitting code to ensure consistency across the codebase.

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

### Achievement System Architecture

The achievement system uses a specialized architecture:

- **Event-Driven Design**: Achievements are checked and awarded based on user activity events
- **Requirement Evaluation Engine**: Flexible system for defining and checking various achievement criteria
- **Progressive Unlocking**: Achievements build upon each other in difficulty and complexity
- **Point-Based Rewards**: Users earn points for unlocking achievements, contributing to their overall score
- **Category Organization**: Achievements are organized into logical categories (quiz, puzzle, reading, general)

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
