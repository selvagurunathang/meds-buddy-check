

---

# MediCare Companion

A modern medication management app for patients and caretakers, built with **React**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

---

## ✨ Features Implemented

- **User Authentication:**  
  - Sign up, login, and password reset using Supabase Auth (email/password)
  - Session management and auto-logout for security

- **Medication Management (CRUD):**  
  - Add new medications (name, dosage, frequency, time, description)
  - View a personalized medication list
  - Edit and delete medications
  - Mark medications as taken for today (with optional photo proof)
  - Real-time updates for medication and taken status

- **Adherence Tracking:**  
  - Simple adherence percentage display
  - Calendar visualization of medication history

- **Role-based Dashboards:**  
  - Separate dashboards for patients and caretakers
  - Runtime role switching

- **Form Validation:**  
  - All forms validated with Zod and React Hook Form
  - User-friendly error messages

- **UI/UX:**  
  - Responsive, accessible UI with reusable components
  - Loading and error states handled throughout
  - Notification and toast system for feedback

---

## 🛠️ Supabase Integration

### 1. **Authentication**
- Uses [Supabase Auth](https://supabase.com/docs/guides/auth) for secure user sign up, login, and password reset.
- Session state is managed in the app, with auto-logout after inactivity.

### 2. **Database (CRUD Operations)**
- Medications and medication logs are stored in Supabase Postgres tables.
- All CRUD operations (Create, Read, Update, Delete) for medications are performed using the Supabase client.
- Real-time updates are enabled using Supabase’s real-time subscriptions, so changes are reflected instantly in the UI.

**Example Supabase usage:**
```ts
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 🚀 Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/meds-buddy-check.git
   cd meds-buddy-check
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables:**
   Create a `.env` file:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
   (Do not commit this file!)

4. **Run the app:**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

---

## 🏗️ Project Structure

```
src/
  components/         # Feature and UI components
  hooks/              # Custom React hooks
  lib/                # Supabase client, utilities, validation schemas
  pages/              # Main app pages (routing targets)
  App.tsx             # App root
  main.tsx            # Entry point
public/               # Static assets
```

---

## 📝 Notes

- All authentication and database operations are handled via Supabase.
- No secrets are committed; all keys are loaded from environment variables.
- The app is ready for deployment on Netlify or Vercel—just set your environment variables in the deployment dashboard.

---

## 📚 Learn More

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

