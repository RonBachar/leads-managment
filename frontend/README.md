# Lead Management System

A modern Angular 17+ application for managing leads with full CRUD operations.

## Features

- **Lead Management**: Full CRUD operations for leads
- **Modern UI**: Clean, responsive design with statistics dashboard
- **Reactive Forms**: Form validation and user-friendly input handling
- **Angular Signals**: State management using Angular's latest signals
- **Standalone Components**: Modern Angular architecture without NgModules
- **TypeScript**: Strict TypeScript configuration for type safety

## Lead Fields

Each lead includes the following fields:

- `firstName`: string (required)
- `lastName`: string (required)
- `email`: string (required, validated)
- `source`: string (required) - Website, Email, Referral, WhatsApp, Phone, Social Media, Other
- `notes`: string (optional) - Free text for additional information
- `status`: enum (required) - New, In Progress, Closed

## Project Structure

```
src/app/
├── core/
│   └── services/
│       └── leads.service.ts          # Lead CRUD operations with signals
├── features/
│   └── leads/
│       ├── leads.component.ts        # Main leads table view
│       └── lead-form/
│           └── lead-form.component.ts # Add/Edit lead form
├── shared/
│   └── models/
│       └── lead.model.ts            # Lead interfaces and enums
└── app.component.ts                  # Main app layout
```

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:4200`

## Available Scripts

- `npm start` - Start the development server
- `npm run build` - Build the application for production
- `npm run watch` - Build the application and watch for changes
- `npm test` - Run unit tests

## Architecture

### Clean Architecture Principles

- **Separation of Concerns**: Clear separation between features, shared, and core modules
- **Dependency Injection**: Services are properly injected and testable
- **Type Safety**: Strict TypeScript configuration throughout
- **Reactive Programming**: Using Angular signals for state management

### Key Technologies

- **Angular 17+**: Latest Angular with standalone components
- **TypeScript**: Strict type checking
- **Reactive Forms**: Form handling and validation
- **Angular Signals**: Modern state management
- **CSS Grid/Flexbox**: Modern layout techniques

## Future Enhancements

- Backend integration with Node.js + Express + MongoDB
- Authentication and authorization
- Advanced filtering and search
- Export functionality
- Email integration
- Activity logging
- Dashboard with charts and analytics

## Development Notes

- The application currently uses in-memory data storage
- All CRUD operations are simulated using Angular signals
- The service layer is designed to easily integrate with a real backend API
- Form validation includes both client-side and visual feedback
- Responsive design works on desktop and mobile devices
