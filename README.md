# 🎓 Academic Management Dashboard

> A comprehensive, full-stack academic management system built with Next.js 16, featuring real-time analytics, student/faculty management, and advanced data visualization.

**🔗 Live Demo:** [https://academic-management-dashboard.vercel.app/](https://academic-management-dashboard.vercel.app/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture & Design Patterns](#-architecture--design-patterns)
- [Reusable Functions & Utilities](#-reusable-functions--utilities)
- [API Routes & Backend](#-api-routes--backend)
- [UI Components Library](#-ui-components-library)
- [Data Management](#-data-management)
- [Advanced Features](#-advanced-features)
- [Setup & Installation](#-setup--installation)
- [Development Workflow](#-development-workflow)
- [Deployment](#-deployment)

---

## 🌟 Overview

This Academic Management Dashboard is a sophisticated web application designed to streamline the management of students, courses, and faculty members in an educational institution. Built with modern web technologies, it provides a seamless user experience with real-time data visualization, comprehensive CRUD operations, and advanced analytics capabilities.

### What Makes This Project Stand Out

- **🎨 Custom Design System**: Fully customized theme with light/dark mode support using CSS custom properties
- **📊 Advanced Analytics**: Real-time data visualization with multiple chart types (bar, pie, area charts)
- **🔄 Optimistic Updates**: Instant UI feedback using TanStack Query's optimistic update patterns
- **♿ Accessibility First**: Built with Radix UI primitives ensuring WCAG compliance
- **📱 Fully Responsive**: Mobile-first design approach with adaptive layouts
- **⚡ Performance Optimized**: Server-side rendering, code splitting, and optimized bundle size
- **🎯 Type Safety**: 100% TypeScript with comprehensive type definitions
- **🧩 Component-Driven**: 56+ reusable UI components built with shadcn/ui

---

## ✨ Key Features

### 📊 Dashboard & Analytics
- **Real-time Statistics**: Live overview of total students, courses, and faculty members
- **Top Students Leaderboard**: Dynamic ranking system based on GPA and course performance
- **Course Enrollment Trends**: Visual representation of enrollment patterns over time
- **GPA Distribution Analysis**: Statistical breakdown of student performance across grade ranges
- **Department-wise Course Distribution**: Pie chart showing course allocation by department
- **Popular Courses Tracking**: Identification of most enrolled courses with enrollment counts
- **Exportable Analytics**: CSV export functionality for enrollment trends and top students data

### 👨‍🎓 Student Management
- **Comprehensive Student Profiles**: Detailed view with enrollment history, GPA, and course list
- **Advanced Filtering**: Multi-criteria search by name, email, year, and enrollment date
- **Bulk Operations**: CSV export of student data with customizable fields
- **Year Classification**: Automatic categorization (Freshman, Sophomore, Junior, Senior)
- **Enrollment Tracking**: Complete history with date-stamped enrollment records
- **Course Assignment**: Intuitive dialog-based course enrollment system with real-time validation

### 📚 Course Management
- **Course Catalog**: Complete listing with code, name, credits, and enrollment statistics
- **Faculty Assignment**: Multi-faculty assignment capability for team-taught courses
- **Enrollment Monitoring**: Real-time tracking of student enrollment per course
- **Department Organization**: Structured categorization by academic departments
- **Credit System**: Flexible credit hour assignment (1-4 credits)
- **CSV Export**: Bulk export of course data for reporting purposes

### 👨‍🏫 Faculty Management
- **Faculty Profiles**: Detailed information including department and assigned courses
- **Course Load Tracking**: Visual representation of teaching assignments
- **Department Affiliation**: Organized by academic departments
- **Multi-course Assignment**: Support for faculty teaching multiple courses
- **Email Integration**: Contact information management for communication
- **Bulk Export**: CSV export functionality for faculty records

### 📝 Grade Management
- **Automated Grade Calculation**: Score-to-letter-grade conversion with GPA calculation
- **Grade Scale System**: Comprehensive grading scale (A+ to F) with GPA equivalents
- **Auto-suggestion**: Intelligent grade suggestion based on numerical scores
- **Pass/Fail Indicators**: Automatic determination of passing status
- **Bulk Grade Entry**: Efficient grading interface for multiple students
- **Grade Analytics**: Integration with dashboard for performance tracking

### 🎨 UI/UX Features
- **Dark Mode Support**: Seamless theme switching with persistent preferences
- **Custom Font Integration**: Be Vietnam Pro font for enhanced readability
- **Responsive Sidebar**: Collapsible navigation with mobile optimization
- **Toast Notifications**: Real-time feedback for all user actions
- **Loading States**: Skeleton loaders and spinners for better UX
- **Error Handling**: Graceful error messages with actionable feedback
- **Form Validation**: Real-time validation with Zod schema validation
- **Keyboard Navigation**: Full keyboard accessibility support

---

## 🛠 Technology Stack

### Frontend Framework
- **Next.js 16.0.7** - React framework with App Router for server-side rendering and routing
- **React 19.2.1** - Latest React with concurrent features and improved performance
- **TypeScript 5** - Full type safety across the entire application

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework with custom configuration
- **shadcn/ui** - High-quality, accessible component library built on Radix UI
- **Radix UI** - Unstyled, accessible component primitives (20+ packages)
- **next-themes** - Theme management with system preference detection
- **Lucide React** - Beautiful, consistent icon library (555 icons)
- **class-variance-authority** - Type-safe variant management for components
- **tailwind-merge** - Intelligent Tailwind class merging utility
- **clsx** - Conditional className construction

### Data Visualization
- **Recharts 2.15.4** - Composable charting library for React
- **ApexCharts** - Modern charting library with interactive features
- **react-apexcharts** - React wrapper for ApexCharts

### State Management & Data Fetching
- **TanStack Query 5.90.12** - Powerful async state management with caching, optimistic updates
- **Axios 1.13.2** - Promise-based HTTP client with interceptors
- **React Hook Form 7.67.0** - Performant form state management
- **Zod 4.1.13** - TypeScript-first schema validation

### UI Components (56 Components)
- **Forms**: Input, Textarea, Select, Checkbox, Radio, Switch, Slider, Calendar, Date Picker
- **Feedback**: Alert, Toast (Sonner), Dialog, Alert Dialog, Drawer, Popover, Tooltip, Hover Card
- **Navigation**: Sidebar, Navigation Menu, Menubar, Breadcrumb, Tabs, Pagination
- **Data Display**: Table, Card, Badge, Avatar, Separator, Accordion, Collapsible
- **Overlays**: Dialog, Sheet, Drawer, Popover, Context Menu, Dropdown Menu
- **Advanced**: Command Palette (cmdk), Combobox, Multiselect, Carousel, Resizable Panels
- **Utilities**: Skeleton, Spinner, Progress, Scroll Area, Aspect Ratio

### Development Tools
- **json-server** - Mock REST API for development and testing
- **env-cmd** - Environment-specific configuration management
- **ESLint 9** - Code quality and consistency enforcement
- **PostCSS** - CSS processing and optimization

### Date & Time
- **date-fns 4.1.0** - Modern date utility library
- **dayjs 1.11.19** - Lightweight date manipulation
- **react-day-picker 9.11.3** - Flexible date picker component

### Additional Libraries
- **sift 17.1.3** - MongoDB-like query language for filtering arrays
- **embla-carousel-react** - Lightweight carousel component
- **input-otp** - OTP input component with auto-focus
- **vaul** - Drawer component for mobile interfaces
- **tw-animate-css** - Animation utilities for Tailwind

---

## 🏗 Architecture & Design Patterns

### Project Structure
```
academic-management-dashboard/
├── app/                          # Next.js App Router
│   ├── api/                      # API route handlers
│   │   ├── analytics/            # Analytics endpoints
│   │   │   ├── enrollments/      # Enrollment trends
│   │   │   └── top-students/     # Top performers
│   │   ├── courses/              # Course CRUD operations
│   │   │   └── assign/           # Faculty assignment
│   │   ├── dashboard/            # Dashboard data aggregation
│   │   ├── faculty/              # Faculty management
│   │   ├── grades/               # Grade management
│   │   └── students/             # Student CRUD operations
│   ├── analytics/                # Analytics page
│   ├── courses/                  # Courses page
│   ├── faculty-members/          # Faculty listing page
│   ├── faculty-panel/            # Faculty management panel
│   ├── students/                 # Student pages
│   │   ├── [id]/                 # Dynamic student profile
│   │   └── add/                  # Add student form
│   ├── globals.css               # Global styles & theme
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Dashboard home page
├── components/                   # React components
│   ├── dashboard/                # Dashboard-specific components
│   ├── faculty/                  # Faculty management components
│   ├── student/                  # Student management components
│   ├── global/                   # Shared global components
│   ├── shared/                   # Reusable components
│   └── ui/                       # shadcn/ui components (56 files)
├── hooks/                        # Custom React hooks
│   ├── use-mobile.ts             # Responsive breakpoint detection
│   └── useDebounce.ts            # Debounce hook for search
├── interface/                    # TypeScript type definitions
│   └── index.ts                  # All interfaces and types
├── lib/                          # Utility functions
│   ├── api-utils.ts              # API error handling utilities
│   ├── axios.ts                  # Axios instance configuration
│   └── utils.ts                  # General utility functions
├── providers/                    # React context providers
│   └── QueryProvider.tsx         # TanStack Query provider
└── public/                       # Static assets
```

### Design Patterns Implemented

#### 1. **Server-Side Rendering (SSR)**
- Dashboard data fetched on the server for optimal performance
- Automatic static optimization for pages without dynamic data
- Streaming SSR for progressive page rendering

#### 2. **API Route Handlers**
- RESTful API design with proper HTTP methods (GET, POST, PUT, DELETE)
- Centralized error handling with custom `ApiErrorHandler` class
- Consistent response format across all endpoints
- Query parameter validation

#### 3. **Component Composition**
- Atomic design methodology (atoms → molecules → organisms)
- Compound component pattern for complex UI elements
- Render props and children composition for flexibility

#### 4. **State Management Strategy**
- Server state managed by TanStack Query with automatic caching
- Local UI state with React hooks (useState, useReducer)
- Form state isolated with React Hook Form
- Theme state managed by next-themes context

#### 5. **Type Safety**
- Comprehensive TypeScript interfaces for all data models
- Generic utility types for reusable patterns
- Strict type checking enabled in tsconfig.json
- Type-safe API responses and error handling

#### 6. **Custom Hooks Pattern**
- `useDebounce`: Debounces search input to reduce API calls
- `use-mobile`: Responsive breakpoint detection for adaptive UI
- Encapsulation of complex logic for reusability

#### 7. **Error Boundary & Handling**
- Custom `ApiErrorHandler` class with specific error types
- Axios error interceptor for global error handling
- User-friendly error messages with toast notifications
- Graceful degradation for failed data fetches

#### 8. **Optimistic Updates**
- Immediate UI feedback before server confirmation
- Automatic rollback on failure
- Implemented in student/course/faculty mutations

---

## 🔧 Reusable Functions & Utilities

### Grade Calculation System (`lib/utils.ts`)

#### `scoreToGrade(score: number): GradeResult`
Converts numerical scores (0-100) to letter grades with GPA calculation.

**Features:**
- Comprehensive grading scale (A+ to F)
- GPA calculation (0.0 to 4.0 scale)
- Pass/fail determination
- Input validation

**Grading Scale:**
```
90-100: A+ (4.0)    80-84:  B+ (3.3)    60-71:  C+ (2.3)    50-51:  D+ (1.3)
85-89:  A  (4.0)    77-79:  B  (3.0)    57-59:  C  (2.0)    47-49:  D  (1.0)
83-84:  A- (3.7)    72-76:  B- (2.7)    52-56:  C- (1.7)    42-46:  D- (0.7)
0-41:   F  (0.0)
```

#### `autoSuggestGrade(scoreStr: string | number): string`
Automatically suggests letter grade based on numerical input.

**Use Case:** Real-time grade suggestion in grade entry forms

### CSV Export Functions

#### `exportStudentsToCsv(students: Student[])`
Exports student data to CSV format with proper escaping.

**Exported Fields:**
- Student ID
- Name (with quote escaping)
- Email
- Academic Year
- Enrolled Courses Count
- Enrollment Date (formatted)

**Features:**
- Automatic filename with timestamp
- Quote escaping for special characters
- Date formatting with dayjs

#### `exportCoursesToCsv(courses: Course[])`
Exports course catalog to CSV.

**Exported Fields:**
- Course Code
- Course Name
- Credits
- Enrolled Students Count
- Assigned Faculty (comma-separated)

#### `exportFacultyToCsv(faculties: Faculty[])`
Exports faculty directory to CSV.

**Exported Fields:**
- Faculty Name
- Email
- Department
- Assigned Courses

#### `exportEnrollmentTrends(trends: EnrollmentTrend[])`
Exports enrollment analytics data.

#### `exportTopStudents(topStudents: TopStudent[], course: string)`
Exports top-performing students with rankings.

### Utility Functions

#### `cn(...inputs: ClassValue[])`
Intelligent className merger combining clsx and tailwind-merge.

**Use Case:** Conditional styling with Tailwind classes
```typescript
cn("base-class", condition && "conditional-class", className)
```

#### `delay(ms: number): Promise<void>`
Promise-based delay utility for async operations.

#### `errorHandler(error: unknown, message: string)`
Centralized error handling with toast notifications.

**Features:**
- Axios error detection
- Custom error message extraction
- Fallback error messages

### API Utilities (`lib/api-utils.ts`)

#### `ApiErrorHandler` Class
Standardized API error responses with proper HTTP status codes.

**Methods:**
- `badRequest(message, details)` - 400 errors
- `notFound(message)` - 404 errors
- `unauthorized(message)` - 401 errors
- `forbidden(message)` - 403 errors
- `internalError(message)` - 500 errors
- `methodNotAllowed()` - 405 errors

**Response Format:**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {} // Optional
  }
}
```

#### `validateQueryParams(params, required)`
Validates required query parameters in API routes.

---

## 🌐 API Routes & Backend

### Dashboard API (`/api/dashboard`)
**Method:** GET  
**Purpose:** Aggregates all dashboard statistics and analytics

**Response Data:**
- Total students count
- Total courses count
- Total faculty count
- Top 5 students by GPA
- 5 most popular courses
- Course enrollment data for charts
- GPA distribution bins
- Department-wise course distribution

**Data Processing:**
- GPA calculation from grades
- Enrollment aggregation
- Statistical binning for distributions

### Students API (`/api/students`)

#### GET - List All Students
**Query Parameters:**
- `search` - Filter by name or email
- `year` - Filter by academic year
- `sortBy` - Sort field (name, gpa, enrollmentDate)
- `order` - Sort order (asc, desc)

**Features:**
- Advanced filtering with sift query language
- Multi-field search
- Pagination support
- Sorted results

#### POST - Create Student
**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "year": "Freshman|Sophomore|Junior|Senior",
  "enrollmentYear": number,
  "enrolledCourses": ["courseId1", "courseId2"]
}
```

**Validation:**
- Email uniqueness check
- Required field validation
- Automatic ID generation
- Enrollment date stamping

#### GET - Student Profile (`/api/students/[id]`)
**Response:**
- Student details
- Enrolled courses with full information
- Grades for each course
- Calculated GPA

**Data Enrichment:**
- Course details lookup
- Faculty name resolution
- Grade aggregation

### Courses API (`/api/courses`)

#### GET - List All Courses
**Features:**
- Complete course catalog
- Enrollment counts
- Faculty assignments

#### POST - Create Course
**Request Body:**
```json
{
  "name": "string",
  "code": "string",
  "credits": number,
  "faculty": ["facultyId1", "facultyId2"]
}
```

**Validation:**
- Unique course code
- Credit range validation (1-4)
- Faculty existence verification

#### POST - Assign Faculty (`/api/courses/assign`)
**Purpose:** Assign or reassign faculty to courses

**Request Body:**
```json
{
  "courseId": "string",
  "facultyIds": ["id1", "id2"]
}
```

**Features:**
- Bidirectional relationship update
- Automatic course list update in faculty records

### Faculty API (`/api/faculty`)

#### GET - List All Faculty
**Response:**
- Faculty directory
- Department information
- Course assignments

#### POST - Create Faculty
**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "department": "string",
  "courses": ["courseId1"]
}
```

### Grades API (`/api/grades`)

#### POST - Submit Grade
**Request Body:**
```json
{
  "studentId": "string",
  "courseId": "string",
  "score": number,
  "grade": "string"
}
```

**Features:**
- Automatic grade calculation if only score provided
- Validation of student enrollment
- Grade update or creation

### Analytics API

#### GET - Enrollment Trends (`/api/analytics/enrollments`)
**Query Parameters:**
- `courseId` - Filter by specific course

**Response:**
- Monthly enrollment data
- Trend analysis

#### GET - Top Students (`/api/analytics/top-students`)
**Query Parameters:**
- `courseId` - Filter by course
- `limit` - Number of results (default: 10)

**Response:**
- Ranked student list
- Course-specific performance
- Score and grade information

---

## 🎨 UI Components Library

### Custom Components (56 Total)

#### Form Components
1. **Input** - Text input with variants
2. **Textarea** - Multi-line text input
3. **Select** - Dropdown selection
4. **Checkbox** - Boolean selection
5. **Radio Group** - Single choice from multiple options
6. **Switch** - Toggle switch
7. **Slider** - Range input
8. **Calendar** - Date selection
9. **Date Picker** - Date input with calendar
10. **Year Picker** - Year selection component
11. **Input OTP** - One-time password input
12. **Combobox** - Searchable select
13. **Multiselect** - Multiple selection dropdown
14. **Field** - Form field wrapper with label and error

#### Feedback Components
15. **Alert** - Static notification
16. **Toast (Sonner)** - Temporary notification
17. **Dialog** - Modal dialog
18. **Alert Dialog** - Confirmation dialog
19. **Drawer** - Slide-in panel
20. **Popover** - Floating content
21. **Tooltip** - Hover information
22. **Hover Card** - Rich hover content
23. **Progress** - Progress indicator
24. **Spinner** - Loading indicator
25. **Skeleton** - Content placeholder

#### Navigation Components
26. **Sidebar** - Collapsible navigation
27. **Navigation Menu** - Horizontal navigation
28. **Menubar** - Application menu
29. **Breadcrumb** - Hierarchical navigation
30. **Tabs** - Tabbed interface
31. **Pagination** - Page navigation

#### Data Display
32. **Table** - Data table
33. **Card** - Content container
34. **Badge** - Status indicator
35. **Avatar** - User image
36. **Separator** - Visual divider
37. **Accordion** - Collapsible content
38. **Collapsible** - Show/hide content
39. **Chart** - Chart wrapper component
40. **Empty** - Empty state component
41. **Item** - List item component
42. **Kbd** - Keyboard shortcut display

#### Overlay Components
43. **Sheet** - Side panel
44. **Context Menu** - Right-click menu
45. **Dropdown Menu** - Action menu

#### Layout Components
46. **Scroll Area** - Custom scrollbar
47. **Resizable** - Resizable panels
48. **Aspect Ratio** - Maintain aspect ratio
49. **Carousel** - Image/content carousel

#### Button Components
50. **Button** - Primary action button
51. **Button Group** - Grouped buttons
52. **Toggle** - Toggle button
53. **Toggle Group** - Grouped toggles

#### Utility Components
54. **Label** - Form label
55. **Command** - Command palette (cmdk)
56. **Input Group** - Input with addons

### Component Features
- **Accessibility**: ARIA attributes, keyboard navigation, screen reader support
- **Variants**: Multiple size, color, and style variants using CVA
- **Theming**: Full dark mode support with CSS variables
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design with breakpoint-specific behavior

---

## 💾 Data Management

### Data Models

#### Student Interface
```typescript
interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentYear: number;
  enrollmentDate: string;
  year: "Freshman" | "Sophomore" | "Junior" | "Senior";
  gpa: number;
  enrolledCourses: string[];
}
```

#### Course Interface
```typescript
interface Course {
  id: string;
  name: string;
  code: string;
  faculty: string[];
  enrollment: number;
  credits: number;
}
```

#### Faculty Interface
```typescript
interface Faculty {
  id: string;
  name: string;
  email: string;
  courses: string[];
  department: string;
}
```

#### Grade Interface
```typescript
interface Grade {
  studentId: string;
  courseId: string;
  grade: string;
  score: number;
}
```

### TanStack Query Implementation

#### Query Keys
- `['students']` - All students
- `['students', id]` - Single student
- `['courses']` - All courses
- `['faculty']` - All faculty
- `['dashboard']` - Dashboard data
- `['analytics', 'enrollments']` - Enrollment trends
- `['analytics', 'top-students']` - Top performers

#### Mutation Patterns
- **Optimistic Updates**: Immediate UI feedback
- **Automatic Refetching**: Related queries invalidated on mutation
- **Error Handling**: Rollback on failure with user notification

#### Caching Strategy
- **Stale Time**: 5 minutes for dashboard data
- **Cache Time**: 10 minutes for student/course lists
- **Refetch on Window Focus**: Enabled for real-time data
- **Retry Logic**: 3 retries with exponential backoff

---

## 🚀 Advanced Features

### 1. **Theme System**
- **Custom CSS Variables**: 40+ theme variables for colors, shadows, spacing
- **Dark Mode**: Complete dark theme with optimized contrast
- **System Preference Detection**: Automatic theme based on OS settings
- **Persistent Preferences**: Theme choice saved in localStorage
- **Smooth Transitions**: Animated theme switching

### 2. **Responsive Design**
- **Mobile-First Approach**: Optimized for mobile devices
- **Breakpoint System**: sm, md, lg, xl, 2xl breakpoints
- **Adaptive Layouts**: Grid layouts that adapt to screen size
- **Touch-Friendly**: Larger touch targets on mobile
- **Collapsible Sidebar**: Automatic collapse on mobile

### 3. **Performance Optimizations**
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Google Fonts with display swap
- **Bundle Analysis**: Optimized bundle size
- **Lazy Loading**: Components loaded on demand

### 4. **Form Validation**
- **Zod Schema Validation**: Type-safe validation
- **Real-time Feedback**: Instant validation on blur
- **Custom Error Messages**: User-friendly error text
- **Field-level Validation**: Individual field validation
- **Form State Management**: Efficient state handling with React Hook Form

### 5. **Search & Filtering**
- **Debounced Search**: Reduced API calls with useDebounce
- **Multi-field Search**: Search across multiple fields
- **Advanced Filtering**: MongoDB-like query syntax with sift
- **Sort Functionality**: Multi-column sorting
- **Filter Persistence**: Filters maintained in URL params

### 6. **Data Visualization**
- **Interactive Charts**: Hover effects and tooltips
- **Responsive Charts**: Adapt to container size
- **Multiple Chart Types**: Bar, pie, area, line charts
- **Color Coding**: Consistent color scheme across charts
- **Export Functionality**: Download chart data as CSV

### 7. **Accessibility Features**
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: ARIA labels and descriptions
- **Focus Management**: Proper focus trapping in modals
- **Color Contrast**: WCAG AA compliant contrast ratios
- **Semantic HTML**: Proper heading hierarchy and landmarks

### 8. **Developer Experience**
- **TypeScript**: Full type safety
- **ESLint**: Code quality enforcement
- **Path Aliases**: Clean imports with @/ prefix
- **Hot Module Replacement**: Fast development refresh
- **Environment Variables**: Separate dev/prod configs

---

## 📦 Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/MHkhan994/academic-management-dashboard.git
cd academic-management-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000/api
```

For production, create `.env.prod`:
```env
NEXT_PUBLIC_BASE_URL=https://your-production-url.com/api
```

4. **Start the development server**
```bash
# Start Next.js dev server
npm run dev

# In a separate terminal, start the mock API server
npm run json
```

The application will be available at `http://localhost:3000`  
The mock API will run on `http://localhost:4000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run dev:prod` - Start dev server with production environment
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run json` - Start json-server mock API

---

## 🔄 Development Workflow

### Adding a New Feature

1. **Create TypeScript Interface** (`interface/index.ts`)
2. **Build API Route** (`app/api/[feature]/route.ts`)
3. **Create UI Components** (`components/[feature]/`)
4. **Add Page Route** (`app/[feature]/page.tsx`)
5. **Implement TanStack Query Hooks**
6. **Add Form Validation with Zod**
7. **Test and Validate**

### Component Development Pattern

1. **Create Base Component** in `components/ui/`
2. **Add Variants** using class-variance-authority
3. **Implement Accessibility** features
4. **Add TypeScript Types**
5. **Document Props** with JSDoc comments
6. **Export from Index** for clean imports

### API Development Pattern

1. **Define Route Handler** with proper HTTP methods
2. **Add Input Validation** using validateQueryParams
3. **Implement Business Logic**
4. **Use ApiErrorHandler** for errors
5. **Return Consistent Response Format**
6. **Update Mock Data** in db.json

---

## 🌍 Deployment

### Vercel Deployment (Recommended)

This project is optimized for Vercel deployment:

1. **Push to GitHub**
```bash
git push origin main
```

2. **Import to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Configure environment variables
- Deploy

3. **Environment Variables**
Set in Vercel dashboard:
```
NEXT_PUBLIC_BASE_URL=https://your-api-url.com/api
```

### Alternative Deployment Options

#### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Build for Production
```bash
npm run build
npm run start
```

---

## 🎯 Key Technical Highlights for Recruiters

### 1. **Modern React Patterns**
- Server Components for optimal performance
- Client Components with "use client" directive
- Concurrent rendering features
- Suspense boundaries for loading states

### 2. **Advanced TypeScript Usage**
- Generic utility types
- Discriminated unions for type safety
- Type guards and narrowing
- Strict mode enabled

### 3. **Performance Best Practices**
- Server-side rendering for SEO
- Automatic code splitting
- Optimized images and fonts
- Efficient state management

### 4. **Scalable Architecture**
- Modular component structure
- Separation of concerns
- Reusable utility functions
- Centralized error handling

### 5. **Production-Ready Features**
- Comprehensive error handling
- Loading and empty states
- Responsive design
- Accessibility compliance
- SEO optimization

### 6. **Data Management Excellence**
- Optimistic updates for better UX
- Intelligent caching strategies
- Automatic background refetching
- Error recovery mechanisms

### 7. **UI/UX Polish**
- Smooth animations and transitions
- Consistent design system
- Intuitive user flows
- Comprehensive feedback mechanisms

---

## 📝 License

This project is created as a demonstration of full-stack development capabilities.

---

## 👨‍💻 Developer

**Mahmud Hasan Khan**

Built with ❤️ using Next.js, TypeScript, and modern web technologies.

---

## 🙏 Acknowledgments

- **shadcn/ui** - For the excellent component library
- **Radix UI** - For accessible component primitives
- **TanStack Query** - For powerful data synchronization
- **Vercel** - For seamless deployment platform
