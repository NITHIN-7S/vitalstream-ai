# HealthPulse - IoT-Based Smart Healthcare Monitoring System

A comprehensive hospital management system with real-time patient monitoring, Google Fit integration for doctor health tracking, and multi-role dashboards.

## 🏗️ Project Architecture Overview

```
HealthPulse/
├── src/
│   ├── main.tsx                 # Application entry point
│   ├── App.tsx                  # Root component with routing
│   ├── index.css                # Global styles & design tokens
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # shadcn/ui base components
│   │   ├── cards/               # Patient & vital display cards
│   │   ├── dashboard/           # Dashboard-specific components
│   │   ├── layout/              # Navigation & footer
│   │   ├── animations/          # Visual effects
│   │   ├── auth/                # Authentication components
│   │   └── chatbot/             # AI assistant
│   ├── pages/                   # Route pages
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility functions
│   └── integrations/supabase/   # Backend client & types
├── supabase/
│   ├── functions/               # Edge functions (serverless)
│   └── migrations/              # Database schema
└── public/                      # Static assets
```

---

## 📁 Detailed File Documentation

### 🚀 Core Application Files

#### `src/main.tsx`
**Purpose**: Application entry point  
**What it does**: 
- Renders the root `<App />` component into the DOM
- Imports global CSS styles

**Imports**: 
- `App.tsx` - The main application component
- `index.css` - Global styles

---

#### `src/App.tsx`
**Purpose**: Root application component with routing configuration  
**What it does**:
- Sets up React Router with all page routes
- Configures global providers (Theme, Query Client, Tooltip)
- Includes toast notification systems (Toaster, Sonner)
- Renders the Healthcare Chatbot on all pages

**Key Routes**:
| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Index` | Landing page |
| `/auth/:role` | `AuthPage` | Login/signup for doctor/patient/receptionist |
| `/dashboard/doctor` | `DoctorDashboard` | Doctor's patient monitoring |
| `/dashboard/patient` | `PatientDashboard` | Patient's health view |
| `/dashboard/reception` | `ReceptionDashboard` | Patient registration |

**Why imported in other files**: This is the root - no file imports it except `main.tsx`

---

#### `src/index.css`
**Purpose**: Global styles and design system tokens  
**What it does**:
- Defines CSS custom properties (colors, spacing, etc.)
- Sets up light/dark theme variables
- Contains utility classes and animations

**Used by**: Every component that uses Tailwind classes

---

### 📄 Pages (Route Components)

#### `src/pages/Index.tsx`
**Purpose**: Landing/home page  
**What it does**:
- Displays hero section with animated heartbeat icon
- Shows role selection cards (Doctor, Reception, Patient portals)
- Displays stats (Real-Time Monitoring, Cloud Connected, etc.)
- Shows security/HIPAA compliance banner

**Imports & Why**:
- `Navbar` - Top navigation bar
- `Footer` - Page footer with contact info
- `ECGWave` - Animated heart monitor line effect
- `FloatingParticles` - Background particle animation
- `HeartbeatIcon` - Animated heart icon

---

#### `src/pages/AuthPage.tsx`
**Purpose**: Authentication page for all user roles  
**What it does**:
- Handles login and signup for doctors, patients, receptionists
- Detects role from URL parameter (`/auth/doctor`, `/auth/patient`, etc.)
- Creates user profiles in database on signup
- Validates credentials and redirects to appropriate dashboard

**Imports & Why**:
- `supabase` - For authentication API calls
- `ECGWave`, `FloatingParticles` - Background animations
- `ForgotPasswordDialog` - Password reset modal

**Connected to**:
- `doctor_profiles` table - Creates doctor profile on signup
- `user_roles` table - Stores user role for access control

---

#### `src/pages/DoctorDashboard.tsx`
**Purpose**: Main dashboard for doctors to monitor patients  
**What it does**:
- Displays ICU patient list with real-time status
- Shows doctor's own health data (Google Fit integration)
- Displays live vital charts for critical patients
- Handles patient selection and detail viewing
- Shows emergency alerts for critical conditions

**Imports & Why**:
- `VitalCard` - Displays individual vital metrics (heart rate, SpO2, etc.)
- `PatientCard` - Displays patient summary with status
- `LiveChart` - Real-time updating charts
- `EmergencyAlert` - Popup alert for critical patients
- `PatientDetailModal` - Full patient information modal
- `AlertsPanel` - List of active alerts
- `DoctorHealthPanel` - Doctor's own health from Google Fit

**Database Tables Used**:
- `patients` - Fetches patient list
- `patient_vitals` - Fetches vital signs data
- `doctor_profiles` - Fetches doctor's name

---

#### `src/pages/PatientDashboard.tsx`
**Purpose**: Dashboard for patients to view their health data  
**What it does**:
- Displays patient's personal information
- Shows current vital signs
- Allows viewing/uploading medical reports
- Shows nearby hospitals map
- Allows password change

**Imports & Why**:
- `VitalCard` - Displays vital metrics
- `LiveChart` - Real-time vital charts
- `ContactForm` - Form to contact doctor
- `NearbyHospitalsMap` - Map of nearby hospitals

---

#### `src/pages/ReceptionDashboard.tsx`
**Purpose**: Dashboard for receptionists to register patients  
**What it does**:
- Patient registration form
- Lists all registered patients
- Shows patient credentials for new registrations
- Allows assigning doctors to patients

**Database Tables Used**:
- `patients` - Creates and lists patients
- `doctor_profiles` - Lists available doctors

---

#### `src/pages/DoctorSettings.tsx`
**Purpose**: Settings page for doctors  
**What it does**: Profile management and preferences for doctors

---

#### `src/pages/ResetPasswordPage.tsx`
**Purpose**: Password reset page  
**What it does**: Handles password reset flow from email link

---

#### `src/pages/AboutPage.tsx`, `TermsPage.tsx`, `PrivacyPage.tsx`, `HIPAAPage.tsx`
**Purpose**: Static information pages  
**What they do**: Display about, terms, privacy, and HIPAA compliance information

---

#### `src/pages/NotFound.tsx`
**Purpose**: 404 error page  
**What it does**: Displays when user navigates to non-existent route

---

### 🎴 Cards Components

#### `src/components/cards/PatientCard.tsx`
**Purpose**: Displays patient summary card  
**What it does**:
- Shows patient name, age, room number
- Displays status badge (Normal/Warning/Critical)
- Shows quick vitals (Heart Rate, Temperature, SpO2)
- Pulses/glows when patient is critical

**Props**:
- `patient` - Patient data object
- `onClick` - Handler when card is clicked

**Used by**: `DoctorDashboard.tsx` to display patient list

---

#### `src/components/cards/VitalCard.tsx`
**Purpose**: Displays individual vital sign metric  
**What it does**:
- Shows vital value with icon
- Displays status (Normal/Warning/Critical)
- Optional ECG wave background animation
- Shows trend indicator (up/down/stable)

**Props**:
- `icon` - Lucide icon component
- `label` - Vital name (e.g., "Heart Rate")
- `value` - Current value
- `unit` - Unit of measurement
- `status` - Current status level
- `showECG` - Whether to show ECG animation
- `trend` - Value trend direction

**Used by**: `DoctorDashboard.tsx`, `PatientDashboard.tsx`

---

### 📊 Dashboard Components

#### `src/components/dashboard/DoctorHealthPanel.tsx`
**Purpose**: Displays doctor's own health data from Google Fit  
**What it does**:
- Shows connection status for Google Fit
- Displays Heart Rate, SpO2, Steps from wearable
- Shows health status (NORMAL/CRITICAL)
- Explains data flow with toggle-able section
- Handles Google Fit OAuth connection

**Used by**: `DoctorDashboard.tsx`

**Calls Edge Functions**:
- `google-fit-auth` - For OAuth flow
- `google-fit-data` - To fetch health data

---

#### `src/components/dashboard/LiveChart.tsx`
**Purpose**: Real-time updating chart  
**What it does**:
- Displays area/line chart that updates every second
- Shows simulated vital data trends
- Customizable colors, thresholds, and ranges

**Used by**: `DoctorDashboard.tsx`, `PatientDashboard.tsx`

**Uses**: `recharts` library for chart rendering

---

#### `src/components/dashboard/EmergencyAlert.tsx`
**Purpose**: Critical patient emergency alert popup  
**What it does**:
- Full-screen modal for critical alerts
- Animated pulsing effect
- Shows patient info and alert type
- Actions to dismiss or contact doctor

**Used by**: `DoctorDashboard.tsx`

---

#### `src/components/dashboard/AlertsPanel.tsx`
**Purpose**: List of active patient alerts  
**What it does**:
- Subscribes to real-time alert updates
- Plays alarm sound for critical alerts
- Allows acknowledging alerts
- Color-coded by priority level

**Used by**: `DoctorDashboard.tsx`

**Database**: Subscribes to `patient_alerts` table

---

#### `src/components/dashboard/PatientDetailModal.tsx`
**Purpose**: Full patient detail view modal  
**What it does**: Shows complete patient information and vitals

**Used by**: `DoctorDashboard.tsx`

---

#### `src/components/dashboard/ContactForm.tsx`
**Purpose**: Form to contact doctor  
**Used by**: `PatientDashboard.tsx`

---

#### `src/components/dashboard/NearbyHospitalsMap.tsx`
**Purpose**: Map showing nearby hospitals  
**Used by**: `PatientDashboard.tsx`

---

### 🎨 Animation Components

#### `src/components/animations/ECGWave.tsx`
**Purpose**: Animated ECG/heart monitor line  
**What it does**:
- SVG path that animates horizontally
- Customizable color and speed
- Creates medical monitoring aesthetic

**Used by**: `Index.tsx`, `AuthPage.tsx`, `VitalCard.tsx`

---

#### `src/components/animations/FloatingParticles.tsx`
**Purpose**: Floating particle background effect  
**What it does**:
- Creates floating circular particles
- Randomized positions and animation timing
- Adds depth to backgrounds

**Used by**: `Index.tsx`, `AuthPage.tsx`

---

#### `src/components/animations/HeartbeatIcon.tsx`
**Purpose**: Animated heartbeat icon  
**Used by**: `Index.tsx`

---

#### `src/components/animations/AnimatedCounter.tsx`
**Purpose**: Number animation effect  
**What it does**: Animates numbers counting up

---

### 🧭 Layout Components

#### `src/components/layout/Navbar.tsx`
**Purpose**: Top navigation bar  
**What it does**:
- Logo and home link
- Navigation links (Home, About)
- Auth buttons (Doctor, Reception, Patient)
- Theme toggle (light/dark mode)
- Mobile responsive hamburger menu

**Used by**: `Index.tsx`, other public pages

---

#### `src/components/layout/Footer.tsx`
**Purpose**: Page footer  
**What it does**:
- Brand information
- Quick links
- Emergency contact information
- Social media links (WhatsApp, Instagram)
- Legal links (Privacy, Terms, HIPAA)

**Used by**: `Index.tsx`

---

### 🤖 Chatbot

#### `src/components/chatbot/HealthcareChatbot.tsx`
**Purpose**: AI-powered healthcare assistant  
**What it does**:
- Floating chat button on all pages
- Streams responses from AI backend
- Answers healthcare questions
- Provides information about services

**Used by**: `App.tsx` (rendered globally)

**Calls Edge Function**: `healthcare-chat`

---

### 🔐 Auth Components

#### `src/components/auth/ForgotPasswordDialog.tsx`
**Purpose**: Password reset request dialog  
**What it does**: Sends password reset email

**Used by**: `AuthPage.tsx`

---

### 🎛️ UI Components (`src/components/ui/`)

These are **shadcn/ui** components - pre-built, customizable UI primitives:

| Component | Purpose |
|-----------|---------|
| `button.tsx` | Styled button with variants (hero, destructive, etc.) |
| `input.tsx` | Text input field |
| `card.tsx` | Card container with header/content/footer |
| `dialog.tsx` | Modal dialog |
| `tabs.tsx` | Tab navigation |
| `select.tsx` | Dropdown select |
| `toast.tsx` | Toast notifications |
| `theme-toggle.tsx` | Light/dark mode switch |
| ... and more | Various UI primitives |

**Why they exist**: Provides consistent, accessible UI components across the app

---

### 🔧 Hooks

#### `src/hooks/use-toast.ts`
**Purpose**: Toast notification hook  
**What it does**: Provides `toast()` function for notifications

#### `src/hooks/use-mobile.tsx`
**Purpose**: Mobile detection hook  
**What it does**: Returns whether current viewport is mobile

---

### 📚 Library Files

#### `src/lib/utils.ts`
**Purpose**: Utility functions  
**What it does**: Contains `cn()` function for merging Tailwind classes

---

### 🔌 Backend Integration

#### `src/integrations/supabase/client.ts`
**Purpose**: Supabase client instance  
**What it does**: 
- Creates authenticated Supabase client
- Configures session persistence
- Auto-refreshes tokens

**Used by**: Every file that needs database/auth access

**⚠️ DO NOT EDIT**: Auto-generated file

---

#### `src/integrations/supabase/types.ts`
**Purpose**: TypeScript types for database  
**What it does**: Contains type definitions for all database tables

**⚠️ DO NOT EDIT**: Auto-generated from database schema

---

### ☁️ Edge Functions (Backend)

#### `supabase/functions/google-fit-auth/index.ts`
**Purpose**: Google Fit OAuth handler  
**What it does**:
- Generates Google OAuth authorization URL
- Handles OAuth callback
- Stores access/refresh tokens
- Checks connection status

**Actions**:
- `get-auth-url` - Returns Google OAuth URL
- `callback` - Handles OAuth redirect
- `check-status` - Returns connection status

---

#### `supabase/functions/google-fit-data/index.ts`
**Purpose**: Fetches health data from Google Fit  
**What it does**:
- Fetches heart rate, SpO2, steps from Google Fit API
- Auto-refreshes expired tokens
- Stores health data in database
- Returns demo data if real data unavailable

---

#### `supabase/functions/healthcare-chat/index.ts`
**Purpose**: AI chatbot backend  
**What it does**: Handles chat messages and returns AI responses

---

#### `supabase/functions/register-patient/index.ts`
**Purpose**: Patient registration edge function  
**What it does**: Creates patient accounts with secure credentials

---

### ⚙️ Configuration Files

#### `supabase/config.toml`
**Purpose**: Supabase project configuration  
**What it does**: Configures edge functions and project settings

#### `tailwind.config.ts`
**Purpose**: Tailwind CSS configuration  
**What it does**: Defines custom colors, fonts, animations

#### `vite.config.ts`
**Purpose**: Vite build configuration  
**What it does**: Configures development server and build process

---

## 🔗 File Relationship Diagram

```
main.tsx
    └── App.tsx
            ├── ThemeProvider (from next-themes)
            ├── QueryClientProvider (from @tanstack/react-query)
            ├── Routes
            │     ├── Index.tsx
            │     │     ├── Navbar.tsx
            │     │     ├── Footer.tsx
            │     │     ├── ECGWave.tsx
            │     │     ├── FloatingParticles.tsx
            │     │     └── HeartbeatIcon.tsx
            │     │
            │     ├── AuthPage.tsx
            │     │     ├── ECGWave.tsx
            │     │     ├── FloatingParticles.tsx
            │     │     ├── ForgotPasswordDialog.tsx
            │     │     └── supabase/client.ts
            │     │
            │     ├── DoctorDashboard.tsx
            │     │     ├── VitalCard.tsx
            │     │     │     └── ECGWave.tsx
            │     │     ├── PatientCard.tsx
            │     │     ├── LiveChart.tsx
            │     │     ├── EmergencyAlert.tsx
            │     │     ├── PatientDetailModal.tsx
            │     │     ├── AlertsPanel.tsx
            │     │     ├── DoctorHealthPanel.tsx
            │     │     └── supabase/client.ts
            │     │
            │     ├── PatientDashboard.tsx
            │     │     ├── VitalCard.tsx
            │     │     ├── LiveChart.tsx
            │     │     ├── ECGWave.tsx
            │     │     ├── ContactForm.tsx
            │     │     ├── NearbyHospitalsMap.tsx
            │     │     └── supabase/client.ts
            │     │
            │     └── ReceptionDashboard.tsx
            │           └── supabase/client.ts
            │
            └── HealthcareChatbot.tsx
                  └── supabase/client.ts → healthcare-chat function
```

---

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| `patients` | Patient records with room, diagnosis, status |
| `patient_vitals` | Vital sign readings (heart rate, SpO2, temp) |
| `patient_alerts` | Alert notifications for abnormal vitals |
| `doctor_profiles` | Doctor information and specialization |
| `receptionist_profiles` | Receptionist information |
| `user_roles` | Maps users to their role (doctor/patient/receptionist) |
| `doctor_google_fit` | Stores Google Fit OAuth tokens |
| `doctor_health_data` | Doctor's health readings from wearables |

---

## 🔄 Data Flow Examples

### Patient Monitoring Flow
```
Patient Wearable → patient_vitals table → Real-time subscription →
DoctorDashboard → VitalCard/LiveChart display

If vital is critical → patient_alerts table → Real-time subscription →
AlertsPanel → EmergencyAlert popup + Audio alarm
```

### Doctor Health Data Flow
```
Smartwatch → Noisefit App → Google Fit → 
google-fit-data edge function → doctor_health_data table →
DoctorHealthPanel display
```

### Authentication Flow
```
User enters credentials → AuthPage → supabase.auth → 
Creates user_roles entry → Creates profile (doctor/patient) →
Redirects to appropriate dashboard
```

---

## 🛠️ Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Backend**: Supabase (Lovable Cloud)
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **Edge Functions**: Deno (serverless)
- **External APIs**: Google Fit API

---

## 📞 Support

For issues or questions, contact:
- Email: emergencypulsemonitoring@gmail.com
- WhatsApp: +91 7893254003
