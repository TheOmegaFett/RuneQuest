# RuneQuest: Norse Rune Application - Frontend

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React Version](https://img.shields.io/badge/React-18.x-blue)
![Vite Version](https://img.shields.io/badge/Vite-4.x-purple)

ᚱᚢᚾᛖ ᛩᚢᛖᛊᛏ (Rune Quest) frontend provides an immersive, interactive user interface for exploring Norse runes through a modern React application.

## 📋 Table of Contents

- [Technologies](#Technologies)
- [Features](#Features)
- [Component Architecture](#Component-Architecture)
- [State Management](#State-Management)
- [Installation](#Installation)
- [Usage](#Usage)
- [Testing](#Testing)
- [Contributing](#Contributing)
- [License](#License)

## Technologies

### Frontend Technology Stack

| Technology            | Version | Purpose                                            | Alternatives                   | License |
| --------------------- | ------- | -------------------------------------------------- | ------------------------------ | ------- |
| React                 | 18.x    | UI library for building component-based interfaces | Vue, Angular, Svelte           | MIT     |
| Vite                  | 4.x     | Build tool and development server                  | Webpack, Parcel                | MIT     |
| React Router          | 6.x     | Client-side routing for single-page application    | Reach Router, TanStack Router  | MIT     |
| Vitest                | 0.34.x  | Testing framework optimized for Vite               | Jest, Mocha                    | MIT     |
| React Testing Library | 14.x    | Testing utilities for React components             | Enzyme                         | MIT     |
| Axios                 | 1.4.x   | Promise-based HTTP client for API requests         | Fetch API, SWR                 | MIT     |
| Plain CSS             | -       | Direct styling without additional abstractions     | CSS Modules, Styled-components | -       |
| PropTypes             | 15.8.x  | Runtime type checking for React props              | TypeScript                     | MIT     |
| ESLint                | 8.x     | Static code analysis for identifying problems      | JSHint, TSLint                 | MIT     |
| Prettier              | 3.x     | Code formatter for consistent style                | -                              | MIT     |

### Industry Relevance of Chosen Technologies

#### React

React dominates the frontend landscape with over 40% market share among JavaScript frameworks according to the 2023 State of JS survey. Its component-based architecture has become the industry standard for building modern web applications. Companies like Facebook, Instagram, Netflix, and Airbnb rely on React for their production systems due to its performance, flexibility, and vast ecosystem.

#### Vite

Vite has rapidly gained adoption as a next-generation frontend build tool, offering significantly faster development experience than traditional bundlers. Its native ES modules approach provides near-instantaneous hot module replacement and optimized production builds. Companies like Shopify and Netlify have embraced Vite for its superior developer experience and build performance.

#### React Router

React Router is the de facto routing solution for React applications with over 2 million weekly downloads on npm. Its declarative routing approach aligns perfectly with React's component model, enabling complex navigation patterns while maintaining clean, readable code.

#### Vitest

Vitest has emerged as the preferred testing framework for Vite-based projects due to its seamless integration and superior performance. It provides Jest-compatible APIs while leveraging Vite's native ESM support for significantly faster test execution. Its adoption is growing rapidly in the React ecosystem.

#### React Testing Library

React Testing Library has become the standard for testing React components, endorsed by the React team itself. Its "testing the way users use your app" philosophy encourages writing more maintainable tests focused on behavior rather than implementation details.

#### Axios

Axios remains one of the most popular HTTP clients in the JavaScript ecosystem with over 10 million weekly downloads. Its consistent API across browsers, automatic JSON transformation, and request/response interception capabilities make it ideal for complex API interactions.

#### CSS Modules

CSS Modules solve the global namespace problem of traditional CSS by automatically scoping styles to components. This approach prevents style conflicts while maintaining the performance benefits of standard CSS, making it ideal for large-scale applications.

### Detailed Comparison to Alternative Technologies

#### React vs. Alternatives

- **Vue**: While Vue offers a gentler learning curve and more intuitive template syntax, React's larger ecosystem, stronger TypeScript integration, and more mature state management solutions make it better suited for our complex application.
- **Angular**: Angular provides a more comprehensive framework with built-in solutions for routing, forms, and HTTP requests, but its steeper learning curve, larger bundle size, and more opinionated structure make React a more flexible choice for our team.
- **Svelte**: Svelte's compile-time approach results in smaller bundle sizes and potentially better runtime performance, but its smaller ecosystem and fewer advanced patterns for complex state management make React more appropriate for our feature-rich application.

#### Vite vs. Alternatives

- **Webpack**: While Webpack offers more extensive configuration options and plugin ecosystem, Vite provides dramatically faster development server startup and hot module replacement, significantly improving developer productivity.
- **Parcel**: Parcel offers similar zero-config benefits to Vite, but Vite's architecture is specifically optimized for modern JavaScript frameworks like React, resulting in better performance and integration.
- **Create React App**: CRA provides a simplified setup experience but lacks the performance benefits of Vite and has fallen behind in adopting modern web standards.

#### React Router vs. Alternatives

- **Reach Router**: While Reach Router pioneered accessible routing in React, it has been merged into React Router v6, making React Router the more future-proof choice.
- **TanStack Router**: Offers more type-safe routing with automatic route type generation, but its newer status in the ecosystem means fewer resources and less community support compared to React Router.

#### Vitest vs. Alternatives

- **Jest**: While Jest has broader adoption, Vitest offers superior performance for Vite-based projects while maintaining Jest-compatible APIs, allowing for easier migration and faster test execution.
- **Mocha**: Provides more flexibility in choosing assertion libraries and test reporters, but lacks the integrated snapshot testing, mocking, and coverage reporting that Vitest offers out of the box.

#### React Testing Library vs. Alternatives

- **Enzyme**: Enzyme enables testing implementation details like component state and methods, but this approach often leads to brittle tests that break during refactoring. React Testing Library's focus on testing behavior from a user perspective results in more maintainable tests.

#### Axios vs. Alternatives

- **Fetch API**: While built into modern browsers, Fetch lacks request timeout handling, has less intuitive error handling, and requires more boilerplate for common operations like JSON parsing.
- **SWR/React Query**: These libraries offer advanced data fetching with caching and revalidation, but introduce additional complexity that isn't necessary for all parts of our application. We use Axios as our base HTTP client and add these libraries only where needed.

#### CSS Modules vs. Alternatives

- **Styled-components**: Offers more dynamic styling capabilities through JavaScript integration, but introduces runtime overhead and larger bundle sizes compared to CSS Modules.
- **Emotion**: Similar to styled-components but with a smaller footprint, though still not as performant as the static extraction approach of CSS Modules.
- **Tailwind CSS**: Provides rapid UI development through utility classes, but can lead to verbose markup and doesn't provide the same component encapsulation as CSS Modules.

### Comprehensive Purpose of Chosen Technologies

Our frontend technology stack forms a cohesive ecosystem specifically designed for building performant, maintainable, and user-friendly web applications:

#### UI Layer

**React** was selected for its component-based architecture, which perfectly aligns with our modular design approach. The virtual DOM and efficient reconciliation algorithm ensure optimal rendering performance, crucial for our interactive rune visualizations and animations. React's unidirectional data flow simplifies state management and debugging, while its extensive ecosystem provides battle-tested solutions for common challenges.

**React Router** enables declarative navigation that maintains UI state between route transitions, essential for preserving user context during the learning journey. Its nested routing capabilities support our hierarchical content structure, allowing for intuitive navigation between rune categories, individual runes, and related exercises.

#### Build System

**Vite** dramatically improves developer experience through near-instantaneous hot module replacement and intelligent dependency pre-bundling. Its optimized production build process results in smaller bundle sizes through efficient code splitting and tree shaking, ensuring fast initial load times for users.

#### Testing Infrastructure

**Vitest** and **React Testing Library** form the foundation of our testing strategy, enabling comprehensive test coverage across component rendering, user interactions, and custom hooks. Vitest's watch mode provides immediate feedback during development, while React Testing Library's user-centric testing approach ensures we're validating actual user experiences rather than implementation details.

#### Styling Approach

**CSS Modules** provide component-scoped styling that prevents global namespace conflicts while maintaining the performance benefits of standard CSS. This approach supports our design system implementation, ensuring consistent styling across the application while allowing for component-specific customizations.

#### API Communication

**Axios** handles all communication with our backend services, providing a consistent interface for API requests with automatic error handling and response transformation. Its interceptor system enables centralized authentication token management and request/response logging.

### Security Implementation Details

The RuneQuest frontend implements several security best practices:

#### Authentication System

- **Secure Token Storage**: JWT tokens stored in memory with limited persistence
- **Automatic Token Refresh**: Background refresh of access tokens before expiration
- **Secure Routing**: Protected routes requiring authentication
- **Session Timeout**: Automatic logout after period of inactivity

#### Data Protection

- **Input Sanitization**: All user inputs are validated and sanitized
- **Content Security Policy**: Restrictions on script execution and resource loading
- **HTTPS Enforcement**: All API communications require secure connections
- **Sensitive Data Handling**: No sensitive data stored in local storage or cookies

### Testing Infrastructure

RuneQuest frontend employs a comprehensive testing strategy:

- **Component Tests**: Verify rendering and user interactions
- **Hook Tests**: Validate custom hook behavior and state management
- **Integration Tests**: Ensure components work together correctly
- **Mock Service Worker**: Intercept and mock API requests during testing
- **Accessibility Tests**: Verify ARIA compliance and keyboard navigation

### Licensing Considerations

Our technology choices reflect careful consideration of licensing implications:

- **MIT License** (React, Vite, React Router, Vitest, etc.): The permissive MIT license allows unrestricted use, modification, and distribution, making it ideal for both commercial and open-source applications. This licensing model ensures we can freely incorporate these technologies without complex legal requirements.

Our careful selection of MIT-licensed components minimizes licensing compliance overhead while ensuring legal protection for both developers and users of the RuneQuest application.

### Hardware Requirements

The RuneQuest frontend has been designed with accessibility and performance in mind:

#### Development Environment

- **Processor**: Any modern multi-core CPU (Intel Core i5/AMD Ryzen 5 or better recommended)
- **Memory**: Minimum 8GB RAM for comfortable development experience
- **Storage**: 1GB free space for application code and dependencies
- **Operating System**: Platform-independent (Windows 10+, macOS 10.15+, or Linux)
- **Development Tools**: Modern code editor (VS Code, WebStorm, etc.) and Git for version control

#### Client Requirements

- **Modern web browser**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Screen resolution**: Minimum 1280x720 (responsive design supports mobile devices)
- **Internet connection**: 1Mbps+ for optimal experience
- **JavaScript**: Enabled (application requires JavaScript to function)
- **Cookies**: Enabled for authentication persistence (optional)

### Coding Style Guide

The RuneQuest frontend follows a comprehensive style guide detailed in our [frontend-style-guide.md](../frontend-style-guide.md) file. This guide covers:

- Naming conventions for components, hooks, functions, and variables
- Component structure and organization
- State management patterns
- Styling approaches and CSS methodology
- Testing standards and practices
- Performance optimization techniques
- Accessibility requirements
- Error handling strategies

All contributors should review this style guide before submitting code to ensure consistency across the codebase.

## Features

- **Interactive Rune Explorer**: Visual catalog of Norse runes with detailed information
- **Rune Casting Tool**: Virtual rune readings with interpretations
- **Learning Modules**: Structured lessons on rune meanings and history
- **Quiz System**: Test knowledge with adaptive difficulty levels
- **Progress Tracking**: Visual representation of learning journey
- **Achievement System**: Gamified rewards for completing activities
- **User Profiles**: Personalized experience with saved readings and progress
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## Component Architecture

RuneQuest follows a hierarchical component architecture organized by feature domains:

### Core Components

- **Layout Components**: Page templates, navigation, headers, footers
- **UI Components**: Buttons, cards, modals, form elements
- **Authentication Components**: Login, registration,
- **Authentication Components**: Login, registration, profile management
- **Feedback Components**: Alerts, notifications, progress indicators

### Feature Components

- **Rune Explorer**: Interactive catalog of Norse runes

  - `RuneList`: Displays filterable grid of rune cards
  - `RuneDetail`: Shows comprehensive information about a selected rune
  - `RuneFilter`: Controls for filtering runes by category or attributes
  - `RuneSearch`: Search functionality for finding specific runes

- **Rune Casting**: Virtual divination system

  - `SpreadSelector`: Interface for choosing different rune layouts
  - `RuneCastingBoard`: Visual representation of cast runes
  - `RuneInterpretation`: Generated meanings based on rune positions
  - `SavedReadings`: Management of past readings

- **Learning System**: Educational content delivery
  - `LessonViewer`: Displays structured educational content
  - `QuizComponent`: Interactive knowledge testing
  - `ProgressTracker`: Visual representation of learning journey
  - `AchievementDisplay`: Shows unlocked achievements and progress

### Component Hierarchy

```
App
├── AuthProvider
│   ├── LoginPage
│   └── RegisterPage
├── Layout
│   ├── Header
│   │   ├── Navigation
│   │   └── UserMenu
│   ├── Main
│   └── Footer
├── Routes
│   ├── HomePage
│   ├── RuneExplorerPage
│   │   ├── RuneList
│   │   └── RuneDetail
│   ├── RuneCastingPage
│   │   ├── SpreadSelector
│   │   └── RuneCastingBoard
│   ├── LearningPage
│   │   ├── LessonList
│   │   └── LessonViewer
│   ├── QuizPage
│   │   ├── QuizSelector
│   │   └── QuizComponent
│   └── ProfilePage
│       ├── UserStats
│       ├── AchievementList
│       └── SavedReadings
└── SharedComponents
    ├── ErrorBoundary
    ├── LoadingSpinner
    └── Notifications
```

## State Management

RuneQuest implements a layered state management approach:

### Local Component State

- **useState**: For simple component-specific state
- **useReducer**: For more complex state logic within components
- **Component Composition**: Lifting state up when needed for sharing between related components

### Application State

- **Context API**: For global state that needs to be accessed by multiple components
  - `AuthContext`: User authentication state
  - `ThemeContext`: UI theme preferences
  - `NotificationContext`: System-wide notifications

### Custom Hooks

RuneQuest leverages custom hooks to encapsulate and reuse stateful logic:

- **useUserJwt**: Manages authentication tokens and user session
- **useRuneCasting**: Handles rune selection, casting, and interpretation
- **useQuiz**: Manages quiz state, question progression, and scoring
- **useAchievements**: Tracks user achievements and progress

### Data Fetching

- **API Service Layer**: Centralized services for backend communication
- **Request State Management**: Loading, error, and success states for API calls
- **Caching Strategy**: Local caching of frequently accessed data

## Styling Methodology

RuneQuest employs a clean, straightforward styling approach:

### Plain CSS

- Organized CSS files imported directly into components
- Clear class naming conventions for maintainability
- Separation of concerns between structure and presentation
- Direct control over specificity and cascade

### Design System

- Consistent color palette based on Norse aesthetics
- Typography system with responsive scaling
- Reusable UI components with standardized styling
- Responsive layout utilities

### Accessibility

- High contrast mode support
- Keyboard navigation
- Screen reader compatibility
- WCAG 2.1 AA compliance

## Installation

1. Clone the repository:

```bash
git clone https://github.com/TheOmegaFett/RuneQuest.git
cd RuneQuest/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Start the development server:

```bash
npm run dev
```

## Usage

### Development Mode

```bash
npm run dev
```

This starts the development server with hot module replacement enabled. The application will be available at `http://localhost:5173` by default.

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing before deployment.

## Testing

RuneQuest includes comprehensive test coverage using Vitest and React Testing Library:

### Running Tests

```bash
# Ensure correct directory
cd RuneQuest/frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

### Test Structure

- **Unit Tests**: Test individual components and hooks in isolation
- **Integration Tests**: Verify interactions between related components
- **Mock Services**: Simulate API responses for consistent testing

### Testing Conventions

- Tests are co-located with their implementation files
- Test files use the naming pattern `*.test.jsx` or `*.spec.jsx`
- Each component or hook has its own test file

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Note: Contributions will only be accepted once the project is marked by our team as "ready for contributions". This is to ensure our project may be submitted to our Training Institute for review without any issues.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Norse mythology resources
- Open-source libraries and frameworks
- Team contributors

---

_ᚱᚢᚾᛂ ᛩᚢ męᛊᛏ - Explore the ancient wisdom of the runes_
