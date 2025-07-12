# מערכת ניהול לידים (Lead Management System)

[![Angular](https://img.shields.io/badge/Angular-19.2.0-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, comprehensive Lead Management System built with Angular 19.2.0, featuring Hebrew language support, RTL layout, and full CRUD operations for both leads and clients.

## 🌟 Features

### 📊 Lead Management

- **Complete CRUD Operations**: Create, read, update, and delete leads
- **Status Tracking**: Monitor lead status (חדש, בטיפול, במעקב, לא מעוניין)
- **Source Attribution**: Track lead sources (Website, Email, Referral, WhatsApp, Phone, Social Media, Other)
- **Notes System**: Add detailed notes for each lead
- **Phone & Email**: Contact information with validation
- **Dashboard Statistics**: Real-time lead statistics and analytics

### 👥 Client Management

- **Client Profiles**: Comprehensive client information management
- **Package Management**: Track hosting, Elementor Pro, and combined packages
- **Contract Management**: File upload for contracts and documents
- **Revenue Tracking**: Monthly revenue calculations and package pricing
- **Renewal Tracking**: Automatic renewal date management

### 🎨 User Experience

- **Hebrew Language**: Full Hebrew localization
- **RTL Layout**: Right-to-left layout support
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Modern UI**: Clean, professional interface
- **Form Validation**: Comprehensive client-side validation
- **Loading States**: Smooth user experience with loading indicators

### 🏗️ Technical Excellence

- **Angular 19.2.0**: Latest Angular with standalone components
- **TypeScript**: Strict type safety throughout
- **Angular Signals**: Modern reactive state management
- **Reactive Forms**: Advanced form handling with validation
- **Mock Data**: Ready-to-use mock data for development

## 📋 Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd leads-managment/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm start
```

### 4. Open Your Browser

Navigate to `http://localhost:4200`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   └── services/
│   │   │       ├── leads.service.ts      # Lead CRUD operations
│   │   │       └── clients.service.ts    # Client CRUD operations
│   │   ├── features/
│   │   │   ├── leads/
│   │   │   │   ├── leads.component.ts    # Leads list view
│   │   │   │   ├── leads.component.html  # Leads template
│   │   │   │   ├── leads.component.css   # Leads styles
│   │   │   │   └── lead-form/
│   │   │   │       ├── lead-form.component.ts
│   │   │   │       ├── lead-form.component.html
│   │   │   │       └── lead-form.component.css
│   │   │   └── clients/
│   │   │       ├── clients.component.ts  # Clients list view
│   │   │       ├── clients.component.html
│   │   │       ├── clients.component.css
│   │   │       └── client-form/
│   │   │           ├── client-form.component.ts
│   │   │           ├── client-form.component.html
│   │   │           └── client-form.component.css
│   │   ├── shared/
│   │   │   └── models/
│   │   │       ├── lead.model.ts         # Lead interfaces
│   │   │       └── client.model.ts       # Client interfaces
│   │   ├── app.component.ts              # Main app component
│   │   ├── app.component.html            # App template
│   │   ├── app.component.css             # App styles
│   │   ├── app.routes.ts                 # Routing configuration
│   │   └── app.config.ts                 # App configuration
│   ├── assets/                           # Static assets
│   ├── styles.css                        # Global styles
│   └── main.ts                           # Application entry point
├── package.json                          # Dependencies and scripts
├── angular.json                          # Angular CLI configuration
└── tsconfig.json                         # TypeScript configuration
```

## 🛠️ Available Scripts

| Command         | Description                 |
| --------------- | --------------------------- |
| `npm start`     | Start development server    |
| `npm run build` | Build for production        |
| `npm run watch` | Build and watch for changes |
| `npm test`      | Run unit tests              |
| `npm run lint`  | Run linting                 |

## 📊 Data Models

### Lead Model

```typescript
interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email?: string; // Optional
  phone: string; // Required
  source: string;
  status: LeadStatus;
  notes?: string; // Optional
  createdAt: Date;
  updatedAt: Date;
}
```

### Client Model

```typescript
interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  domain: string;
  packageType: PackageType;
  packagePrice: number;
  renewalDate: Date;
  contractFile: File | null;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🎯 Lead Statuses

| Status           | Hebrew     | Color  |
| ---------------- | ---------- | ------ |
| `NEW`            | חדש        | Green  |
| `IN_PROGRESS`    | בטיפול     | Blue   |
| `FOLLOW_UP`      | במעקב      | Orange |
| `NOT_INTERESTED` | לא מעוניין | Red    |

## 📦 Package Types

| Package                 | Hebrew                | Description           |
| ----------------------- | --------------------- | --------------------- |
| `HOSTING`               | אחסון                 | Web hosting only      |
| `ELEMENTOR_PRO`         | Elementor Pro         | Elementor Pro license |
| `HOSTING_ELEMENTOR_PRO` | אחסון + Elementor Pro | Combined package      |

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# Application Settings
NODE_ENV=development
APP_NAME=מערכת ניהול לידים
APP_VERSION=1.0.0

# API Configuration
API_BASE_URL=http://localhost:3000/api
API_TIMEOUT=30000

# Development Settings
NG_SERVE_HOST=localhost
NG_SERVE_PORT=4200

# Localization Settings
DEFAULT_LOCALE=he
DEFAULT_DIRECTION=rtl
SUPPORTED_LOCALES=he,en

# File Upload Settings
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,jpeg,png
```

## 🏗️ Architecture

### Clean Architecture Principles

- **Separation of Concerns**: Clear module boundaries
- **Dependency Injection**: Proper service injection
- **Type Safety**: Strict TypeScript throughout
- **Reactive Programming**: Angular signals for state management

### Key Technologies

- **Angular 19.2.0**: Latest Angular with standalone components
- **TypeScript 5.7.2**: Strict type checking
- **Angular Signals**: Modern state management
- **Reactive Forms**: Advanced form handling
- **CSS Grid/Flexbox**: Modern layout techniques

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Build Output

The build artifacts will be stored in the `dist/` directory.

## 🔮 Future Enhancements

### Planned Features

- [ ] Backend API integration (Node.js + Express + MongoDB)
- [ ] User authentication and authorization
- [ ] Advanced filtering and search capabilities
- [ ] Export functionality (PDF, Excel)
- [ ] Email notifications and reminders
- [ ] Activity logging and audit trails
- [ ] Advanced dashboard with charts and analytics
- [ ] Multi-language support (English, Arabic)
- [ ] Mobile app (React Native/Ionic)
- [ ] API documentation (Swagger)

### Technical Improvements

- [ ] Unit and integration tests
- [ ] E2E testing with Cypress
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Performance optimization
- [ ] Accessibility improvements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Notes

### Current State

- ✅ Mock data implementation
- ✅ Full CRUD operations for leads and clients
- ✅ Hebrew language support
- ✅ RTL layout implementation
- ✅ Responsive design
- ✅ Form validation
- ✅ File upload functionality
- ✅ Dashboard statistics

### Mock Data

The application currently uses in-memory data storage with mock data for:

- 6 sample leads with various statuses
- 3 sample clients with different package types
- Realistic Hebrew names and contact information

### Service Layer

The service layer is designed to easily integrate with a real backend API. Simply replace the mock data methods with HTTP calls to your backend.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using Angular 19.2.0**
