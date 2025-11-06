# Buy-01 E-commerce Frontend

A modern e-commerce frontend built with Angular, featuring a responsive product catalog, shopping cart, checkout process, and user authentication. This project demonstrates Angular fundamentals including components, services, routing, form validation, state management, and responsive design.

## Project Overview

This project implements an interactive CAPTCHA system with three distinct challenge types:
- Image selection from a grid
- Mathematical problem solving
- Text input verification

The application features persistent state management, route protection, and a responsive design optimized for both desktop and mobile devices.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (optional but recommended)

## Installation & Setup

### Initial Angular Project Setup
```bash
# Create new Angular project
ng new buy-01 --routing --style=scss
cd buy-01

# Generate required components
ng generate component components/home
ng generate component components/captcha
ng generate component components/result

# Generate services
ng generate service services/state
ng generate service services/challenge
```

### Development Setup
1. **Clone or download the project**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm start
   # or
   ng serve
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:4200
   ```

## Features

### Core Functionality
- **Home Page**: Welcome screen with challenge overview and start button
- **Multi-Stage Challenges**:
  - Image Selection: Select specific images from a 3x3 grid
  - Math Problems: Solve arithmetic equations with various operations
  - Text Input: Type displayed text with case-sensitive validation
- **State Management**: Progress tracking with localStorage persistence
- **Form Validation**: Prevents progression without completing current challenge
- **Route Protection**: Guards prevent unauthorized access to results page
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Results Page**: Performance metrics and completion status

### Technical Implementation
- **Components**: Modular architecture with Home, Captcha, and Result components
- **Services**: StateService for progress tracking, ChallengeService for challenge logic
- **Models**: TypeScript interfaces for type safety and data structure
- **Routing**: Angular Router with functional guards for access control

## Project Structure

```
src/app/
├── components/
│   ├── home/                 # Landing page component
│   │   ├── home.ts
│   │   ├── home.html
│   │   ├── home.scss
│   │   └── home.spec.ts
│   ├── captcha/              # Main challenge component
│   │   ├── captcha.ts
│   │   ├── captcha.html
│   │   ├── captcha.scss
│   │   └── captcha.spec.ts
│   └── result/               # Results/completion page
│       ├── result.ts
│       ├── result.html
│       ├── result.scss
│       └── result.spec.ts
├── services/
│   ├── state.ts              # Progress tracking & localStorage
│   ├── state.spec.ts
│   ├── challenge.ts          # Challenge generation & validation
│   └── challenge.spec.ts
├── models/
│   └── challenge.model.ts    # TypeScript interfaces
├── constants/
│   ├── storage.constants.ts  # Storage key constants
│   └── image.constants.ts    # Image category constants
├── app.routes.ts             # Routing configuration with guards
├── app.config.ts             # Application configuration
├── app.ts                    # Root component
└── app.html                  # Router outlet
```

## How It Works

1. **Start**: User clicks "Start Challenge" on the home page
2. **Challenge Progression**: Complete 3 different challenge types in sequence:
   - **Image Selection**: Select all images matching specified criteria from a grid
   - **Math Problems**: Solve randomly generated arithmetic problems
   - **Text Input**: Type displayed text exactly as shown (case-sensitive)
3. **Navigation**: Use Previous/Next buttons to navigate between challenges
4. **Validation**: Each challenge must be completed correctly before progression
5. **Completion**: View detailed results with performance metrics
6. **Restart**: Option to start a new challenge set or return to home

## Security and Validation

- **Route Guards**: Functional guards prevent unauthorized access to results page
- **Form Validation**: Real-time validation ensures challenge completion before progression
- **State Persistence**: Progress survives page refreshes using localStorage
- **Random Generation**: Unique challenge sets generated for each session
- **Input Sanitization**: Proper validation for all user inputs

## State Management

The application implements comprehensive state management using Angular services and browser storage:

- **Progress Tracking**: Current challenge index, completed challenges, and user score
- **localStorage Integration**: Automatic save and restore of progress across sessions
- **Results Management**: Challenge completion time, accuracy, and attempt tracking
- **Session Handling**: Unique session identifiers and challenge set persistence
- **Reset Functionality**: Clean slate initialization for new challenge sessions

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Development Server
```bash
npm start
```

## Technical Requirements Met

This implementation fulfills all project requirements:

### Core Requirements
- Angular application with modern standalone components architecture
- Separate components for each application section (Home, Captcha, Result)
- Multiple challenge types with different user interaction patterns
- Comprehensive form validation preventing invalid progression
- Persistent state management surviving page refreshes
- Protected results page with proper access control
- Responsive design optimized for all device types

### Advanced Features
- Dynamic challenge generation with randomization
- Smooth animations and transitions between states
- Professional UI/UX with modern design patterns
- Comprehensive unit testing framework
- TypeScript type safety throughout the application
- Service-based architecture with dependency injection

## Key Implementation Files

- `src/app/app.routes.ts` - Routing configuration with functional guards
- `src/app/services/state.ts` - State management and localStorage integration
- `src/app/services/challenge.ts` - Challenge generation and validation logic
- `src/app/models/challenge.model.ts` - TypeScript interface definitions
- `src/app/components/captcha/captcha.ts` - Main challenge component logic
- `src/app/constants/` - Application constants following DRY principles

## Learning Objectives Achieved

- **Angular Fundamentals**: Components, services, routing, and directives
- **Multi-stage Workflows**: Dynamic component interaction and state transitions
- **Form Validation**: Comprehensive user input control and validation
- **State Management**: Persistent progress tracking across sessions
- **Conditional Navigation**: Access control and route protection
- **Responsive Design**: Cross-device compatibility and optimization
- **Modular Components**: Reusable and maintainable component architecture
- **Unit Testing**: Testing framework setup and basic test coverage
