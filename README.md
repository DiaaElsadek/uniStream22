<div align="center">

  <img src="public/icons/icon-192x192.png" alt="UniStream22 Logo" width="96" height="96" style="border-radius: 22px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" />

  # UniStream22

  <p><strong>A Modern Academic Portal & Streamlined Lecture Platform</strong></p>
  <p>Tailored for 4th-Year Computer Science Students at the Higher Technological Institute (HTI) • Class of 2026 / Batch 22</p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Radix_UI-Shadcn-161616?style=for-the-badge&logo=radix-ui" alt="Radix UI" />
    <img src="https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA" />
  </div>

  <br />

  <p>
    <a href="https://unistream22.vercel.app"><strong>Explore the Live Platform »</strong></a>
  </p>

</div>

---

## 📖 Overview

**UniStream22** is an academic management web application and Progressive Web App (PWA) built specifically for senior computer science students at the Higher Technological Institute. It eliminates fragmentation and communication noise by centralizing departmental news, weekly lecture schedules, lab section group assignments, and personal notes into a single, distraction-free environment.

Designed around a **calm, mature, and focused design system**, UniStream22 prioritizes speed, high-density academic usability, bilingual accessibility (Arabic & English), and offline reliability.

---

## 💡 The Product Idea

### 🧩 1. The Core Problem
In a typical university department, academic communication suffers from chronic fragmentation:
- **The "Chat Noise" Problem**: Critical announcements—such as sudden lecture venue changes, revised assignment deadlines, or graduation project guidelines—are scattered across dozens of informal WhatsApp groups, Telegram channels, and Facebook posts. Students spend valuable time asking peers or scrolling through hundreds of chat messages just to find one piece of information.
- **The "Schedule Complexity" Problem**: Senior year students take multiple specialized courses (e.g., *Digital Image Processing*, *Cloud Computing*, *Data Mining*, *Data Communications*, and *Graduation Project 1*). Because each student belongs to different practical lab groups (Groups 1 through 6), reading a massive 200-row departmental spreadsheet to determine which class to attend next is slow and error-prone.
- **The "Campus Connectivity" Problem**: Lecture halls, computer labs, and auditorium basements often have weak or non-existent mobile coverage, making online-only student portals inaccessible right when students need them most.

---

### 🎯 2. The Solution & Vision: "UniStream"
The name **UniStream22** reflects its central philosophy:

$$\text{\textbf{Uni}} \text{ (University \& Unity)} \;+\; \text{\textbf{Stream}} \text{ (Real-Time Information Flow)} \;+\; \text{\textbf{22}} \text{ (Batch 22 / Senior Class)}$$

Instead of treating the student portal as a bureaucratic database, **UniStream22 treats academic life as a streamlined, personal feed**:
1. **One Source of Truth**: All official updates, assignments, and scheduling details are curated and published in one structured hub.
2. **Dynamic Schedule Adaptation**: Students select their specific lab groups once (`/selectschedule`). From that point onward, the timetable view (`/schedule`) filters out all extraneous classes and renders *only their personalized weekly agenda* with room numbers and live today indicators.
3. **The 2-Second Test**: The entire user experience is engineered around a single benchmark: *A student walking into the faculty building should be able to open the app and within two seconds know their next lecture, the hall number, and any urgent notices.*

---

### 🏛️ 3. Product Pillars

| Pillar | Principle | Real-World Implementation |
|---|---|---|
| **Zero-Distraction UI** | Calm, mature, and content-first. | No advertisements, no social vanity metrics, no decorative animations that slow down navigation. Clean cards, high contrast, and clear typography. |
| **Personalized Context** | Tailored to each student's exact schedule. | Group selection engine that dynamically personalizes weekly timetables across all five major senior courses. |
| **Offline-First Resilience** | Access anytime, anywhere. | PWA architecture with service-worker caching so timetables, notes, and recent announcements remain readable with zero network signal. |
| **Bilingual Excellence** | Arabic as a first-class citizen. | Fully direction-aware layouts (`RTL` & `LTR`) with native academic Arabic typography (**IBM Plex Sans Arabic**) paired with modern Latin geometry (**Plus Jakarta Sans**). |

---

## ✨ Key Features

### 📢 1. Centralized Academic News & Announcements (`/home`)
- **Real-Time Stream**: Official faculty notices, project deadlines, and course instructions grouped chronologically by academic week.
- **Priority Categorization**: Color-coded badges for **Urgent & High Priority**, **Medium**, and **General Notices** with live pulse indicators.
- **Instant Search & Filters**: Search across course titles, section groups, and descriptions with quick tabs (`All`, `Urgent`, `Regular`).
- **Shimmer Skeletons**: Smooth skeleton loading placeholders instead of jarring layout shifts.

### 🗓️ 2. Personalized Weekly Schedule (`/schedule`)
- **Group-Aware Timetable**: Automatically tailors lectures and practical lab timings according to each student's enrolled section groups.
- **Day-by-Day Views**: Seamless tabbed navigation between weekdays (`Saturday` through `Friday`) with a live pulsing indicator highlighting **Today**.
- **Contextual Chips**: Clean badges for lecture start/end timings (`09:00 - 10:40`), campus room numbers, and instructor details.

### ⚙️ 3. Interactive Group Selection (`/selectschedule`)
- **Visual Group Selector**: Interactive pill selectors (`Group 1` to `Group 6` or `None`) replacing cumbersome select dropdowns.
- **Confirmation Dialog**: Accessible modal dialog to review schedule adjustments before submitting to the backend.

### 📝 4. Student Sticky Notes (`/notes`)
- **Personalized Workspace**: Quick in-browser scratchpad for course notes, lecture reminders, and study tasks.
- **Visual Organization**: Multi-color palettes (Amber, Sky, Emerald, Purple, Rose), pin-to-top functionality, live character counters, and filter tabs (`All` / `Pinned`).
- **Cloud Sync & Local Backup**: Instant persistence via local storage with background sync to Supabase.

### 🌐 5. Native Bilingual Support (Arabic & English)
- **Automatic Layout Flipping**: Complete bidirectional UI support (`dir="rtl"` and `dir="ltr"`).
- **Curated Academic Typography**:
  - **Arabic**: [IBM Plex Sans Arabic](https://fonts.google.com/specimen/IBM+Plex+Sans+Arabic) — engineered for technical legibility and unbroken cursive ligatures.
  - **English / Latin**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) — geometric neo-grotesque numerals and headings.

### 📱 6. Progressive Web App (PWA)
- **Installable Native Feel**: Add to home screen on iOS, Android, macOS, and Windows.
- **Offline Caching**: Built with Workbox and custom Service Worker caching strategies for reliable access even with spotty campus Wi-Fi.

### 🛡️ 7. Role-Based Administration (`/dashboard/addnews`)
- **Academic ID Authentication**: Secure student token sessions with role verification.
- **Publisher Portal**: Administrative interface to draft, categorize, and broadcast new course announcements.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | [Next.js 16.1](https://nextjs.org/) (App Router, Webpack builder) |
| **UI Library** | [React 19.2](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & CSS Custom Properties |
| **Component Architecture** | [Radix UI Primitives](https://www.radix-ui.com/) (Shadcn UI model: Tabs, Dialog, Badge, Avatar, DropdownMenu, Tooltip, Skeleton, Separator) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Typography** | `next/font/google` (`IBM_Plex_Sans_Arabic`, `Plus_Jakarta_Sans`, `Cairo`) |
| **Backend / DB** | Next.js Route Handlers (`/api/*`) connected to [Supabase](https://supabase.com/) REST APIs |
| **PWA & Offline** | `next-pwa`, Google Workbox, Web App Manifest |
| **Theming** | `next-themes` (Dark, Light, and System modes) |

---

## 📁 Project Structure

```text
uniStream22/
├── public/                     # Static assets, PWA icons, manifest, service worker
│   ├── icons/                  # High-res PWA icons (192x192, 512x512, apple-touch)
│   ├── favicon.ico             # Multi-layer favicon
│   ├── manifest.json           # Web App Manifest
│   └── sw.js                   # Workbox service worker
├── src/
│   ├── app/                    # Next.js App Router routes
│   │   ├── (auth)/             # Login & Signup pages
│   │   ├── api/                # Backend API route handlers (Supabase integration)
│   │   ├── dashboard/          # Admin announcements publisher
│   │   ├── home/               # Student announcements stream
│   │   ├── new/[id]/           # Individual announcement article view
│   │   ├── notes/              # Sticky notes scratchpad
│   │   ├── schedule/           # Weekly schedule viewer
│   │   ├── selectschedule/     # Course group selector
│   │   ├── layout.tsx          # Root layout with font variable bindings & providers
│   │   ├── page.tsx            # Product landing page & feature showcase
│   │   └── globals.css         # Tailwind v4 theme tokens & direction-aware typography
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Shadcn UI primitives (Tabs, Badge, Dialog, Avatar, ...)
│   │   ├── home/               # Announcement cards, search bar, week navigation
│   │   ├── Navbar.tsx          # Main navigation with student account menu
│   │   ├── UniStreamLogo.tsx   # Official vector brand logo
│   │   ├── ThemeToggle.tsx     # Light/Dark mode switcher
│   │   └── LanguageToggle.tsx  # Arabic/English switcher
│   ├── context/                # React Contexts (LanguageContext, ThemeProvider)
│   ├── locales/                # JSON translation dictionaries (ar.json, en.json)
│   ├── lib/                    # Shared utility functions (cn, clsx, tailwind-merge)
│   └── middleware.ts           # Route protection & session validation
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version `18.18.0` or later recommended)
- `npm`, `pnpm`, or `yarn`

### 1. Clone the Repository
```bash
git clone https://github.com/DiaaElsadek/uniStream22.git
cd uniStream22
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 5. Production Build
To create an optimized production build:
```bash
npm run build
npm run start
```

---

## 👥 Contributors & Acknowledgements

- **Lead Developer**: [Diaa Elsadek](https://linkedin.com/in/diaaelsadek)
- **Institution**: Higher Technological Institute (HTI) — Computer Science Department
- **Target Audience**: 4th-Year Computer Science Students (Class of 2026 / Batch 22)

---

## 📄 License

This project is maintained for educational purposes by and for the students of the Higher Technological Institute.