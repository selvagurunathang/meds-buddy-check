# MediCare - Medication Management App

A comprehensive medication management application built with React, TypeScript, and Supabase. Features dual user roles (patients/caretakers), real-time updates, and advanced adherence tracking.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure signup/signin with Supabase Auth
- **Dual User Roles**: Patients can track their own medications, caretakers can manage multiple patients
- **Medication Management**: Full CRUD operations for medications with custom dosages, frequencies, and instructions
- **Daily Tracking**: Mark medications as taken with optional photo proof and notes
- **Real-time Updates**: Live synchronization between caretakers and patients
- **Adherence Analytics**: Track streaks, completion rates, and historical data

### User Experience
- **Interactive Calendar**: Visual medication tracking with monthly view
- **Smart Dashboard**: Role-based statistics and quick actions
- **Optimistic Updates**: Immediate UI feedback with React Query
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Animations**: Smooth transitions with Framer Motion
- **Toast Notifications**: Real-time feedback for all actions

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **React Query**: Advanced data fetching with caching and optimistic updates
- **Form Validation**: Comprehensive validation with React Hook Form
- **Error Handling**: Graceful error states and user feedback
- **Testing**: Unit and integration tests with Vitest and Testing Library
- **Performance**: Optimized renders and efficient state management

1. **Clone the repository**

 https://github.com/shyamwl/meds-buddy-check.git

   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: React Query, React Context
- **Backend**: Supabase (Auth, Database, Real-time)
- **Testing**: Vitest, Testing Library
- **Forms**: React Hook Form
- **Icons**: Lucide React

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard-specific components
│   ├── layout/         # Layout components
│   └── ui/             # Base UI components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── lib/                # Utilities and configurations
├── __tests__/       # Test files
└── test/               # Test setup
```

### Database Schema
- **profiles**: User profiles with roles (patient/caretaker)
- **medications**: Medication information and settings
- **medication_logs**: Daily medication tracking records
- **caretaker_patients**: Relationships between caretakers and patients

## 🔐 Security Features

- **Authentication**: Secure user management with Supabase Auth
- **Input Validation**: Client and server-side validation
- **Type Safety**: Full TypeScript coverage

## 📱 User Roles

### Patient
- Manage personal medications
- Track daily adherence
- View personal statistics and calendar

### Caretaker
- Manage multiple patients
- View aggregated statistics
- Monitor patient adherence
- Receive real-time updates


1. **Build the project**
   ```bash
   npm run build
   ```

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com) for the styling system
- [Lucide](https://lucide.dev) for the beautiful icons
- [Framer Motion](https://framer.com/motion) for smooth animations