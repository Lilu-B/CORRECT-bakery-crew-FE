# 🧁 Bakery Crew Hub — Frontend

This project is fully deployed and available for testing online:
👉 [Live Demo](https://bakeryhub.app.freepixel.dev)

A mobile-friendly web app for a bakery team.  
Team members can view their shift, apply for overtime, contribute to donations, send messages, and see upcoming events.

---

## 🚀 Tech Stack

- Vite + React + TypeScript
- Clean CSS (no Tailwind, Bootstrap, or other frameworks)
- React Router
- Axios (with interceptors)
- camelcase-keys (via Axios interceptor)
- Date-fns (for date formatting)

---

## 📦 Installed Dependencies

```bash
npm install axios react-router-dom classnames
npm install --save-dev @types/react-router-dom
npm install react-calendar
npm install camelcase-keys
```

---

## 📁 Project Structure

```
src/
├── api/              # API requests to backend (events, donations, etc.)
├── components/       # Reusable UI components (BottomNav, ProfileMenu)
├── context/          # Global user state (UserContext)
├── pages/            # Application views (Login, Register, Home, Events, EventDetails, etc.)
├── routes/           # Route protection logic
├── styles/           # Global and component-level CSS (including calendar)
├── types/            # Shared TypeScript interfaces (Event, User, Donation)
├── App.tsx           # App entry with route config
├── main.tsx          # Vite mount point
```

---

## 👤 Test Accounts

You can use the following pre-approved accounts to explore the app:

```plaintext
Admin:
Email:    admin@bakery.local
Password: password123

Manager 1:
Email:    manager1@bakery.local
Password: user123

Manager 2:
Email:    manager2@bakery.local
Password: user123

User 1:
Email:    user1@bakery.local
Password: user123

User 2:
Email:    user2@bakery.local
Password: user123
```

---

✅ You can also register a new test user through the app.  
Managers or the admin can approve them via their account panel.

---

## ✅ Features Implemented

### 🔐 Authentication
- JWT stored in `sessionStorage`
- Token auto-attached via Axios interceptor (configured in `api/axios.ts`)
- Auto-login attempt on refresh
- Role & shift handling
- Global auth state via `UserContext`
- Token validation via `/api/protected`
- camelCase normalization using `camelcase-keys`
- Protected routes via `ProtectedRoute.tsx`
- Errors handled visually with `AxiosError` alert
- Logout via ProfileMenu
- User profile patch & delete available

### 👤 User Flow
- Register with shift → auto-assigned manager
- Login with persistent session
- Protected routes via `ProtectedRoute.tsx`
- User context persists session info
- Alerts shown on login/register failure
- Token persisted & auto-applied for all requests
- Assigned manager is auto-set based on shift
- Edit profile page with update & delete options

### 🏠 Home Page
- Shows user role & shift
- Dynamic event and donation previews
- Safe rendering with `Array.isArray()` checks
- Events filtered by role:
  - Users: see only events of their shift
  - Managers: see only events of their shift
  - Developers (admins): see all events
- Placeholder calendar section
- Fully styled mobile-friendly layout
- Dynamic bottom navigation bar

### 📱 Navigation
- BottomNav component with four routes:
  - `/` — Home
  - `/events` — Overtime event list (in progress)
  - `/donations` — Active donations (in progress)
  - `/messages` — Messaging (in progress)

### 🔗 Google Calendar Export

- After applying to an event, users can click **"Add to Google Calendar"**
- Opens Google Calendar pre-filled with:
  - Title
  - Date (single-day range)
  - Optional description
- Implemented via dynamic link with `window.open(...)`
- Only shown if the user has successfully applied to the event
- Reusable `<AddToGoogleCalendar />` component placed:
  - Inside `EventDetails.tsx`
  - Under calendar event list (optional)

### 📅 Calendar Integration

- React Calendar (`react-calendar`) shows user's upcoming applied events
- Visual dots mark dates with relevant events
- Calendar auto-filters:
  - Users: see only events they've applied to
  - Managers: see all events for their shift
  - Developers: see all events
- Weekends styled in red, today and selected date are highlighted
- Points displayed using `.dot` indicator and `tileContent`
- Navigation buttons and month label styled manually for accessibility
- Upcoming event list appears under selected date

### 🗕 Events Feature
- `/events` displays only **active** events
- `/events/:eventId` shows full event info
- Role-based logic:
  - Users can apply if event is from their shift
  - Managers can delete events from their shift or if they created them
  - Admins can delete any event
- `/events/create`:
  - Admins can create events for any shift
  - Managers can only create events for their own shift
  - Title is user-defined
  - Date picker with ISO validation
  - Description field (optional)
- User-submitted applications are shown per event
- `applied` status shown for current user
- Dynamic event styling:
  - Gray if user applied
  - Red if not applied

### 🎁 Donations Feature

- `/donations` — displays all **active** donation campaigns
- `/donations/:donationId` — shows full donation details:
  - Title, deadline, description, total collected, donor count
  - This info is visible to **all** roles (users, managers, developers)
- Donation status `hasDonated` is respected:
  - Users **cannot donate twice**
  - After donation, a thank-you message is shown ✅
- Users (`user`) can enter an amount and confirm their donation
- Managers and developers can delete donations they created (or any if admin)
- `/donations/create`:
  - Available to managers and developers
  - Inputs: title, deadline, optional description
- Users can donate **only once per donation**
- All data is processed through `camelcase-keys` interceptor and Axios

### 🎫 User Management Feature

- Unapproved users are now handled by managers and developers
- Backend route: `GET /api/admin/users/pending` returns all unapproved users
- Managers see only pending users from their own shift
- Developers see all pending users
- Each pending user card displays:
  - Name, Email, Shift, Role, Phone
  - “Approve” (✅ PATCH `/api/admin/users/:id/approve`)
  - “Delete” (🗑 DELETE `/api/users/:id`)
- Styled red border to highlight pending users (`.card.pending`)

### 🧑‍🦯 Accessibility (A11y) Improvements

The project now supports better accessibility for users with screen readers or other assistive technologies.

**What was implemented:**

- Replaced `alert()` messages with visually rendered text using `<p aria-live="...">` to provide non-intrusive, accessible feedback for success and error messages.
- Ensured that all interactive elements (like buttons) include `aria-label`s to describe their action clearly.
- Marked error and success messages with `aria-live="assertive"` or `aria-live="polite"` to ensure they are read by screen readers appropriately.

**Example changes:**
- Registration form now displays error and success messages inside the DOM instead of using `alert()`, which improves accessibility and user experience.

---

## 🔁 Data Normalization

### ✅ Now handled globally via Axios interceptor:

```ts
// api/axios.ts
api.interceptors.response.use((response) => {
  response.data = camelcaseKeys(response.data, { deep: true });
  return response;
});
```

- Installed [`camelcase-keys`](https://github.com/sindresorhus/camelcase-keys) to convert backend responses into frontend-friendly `camelCase` format.
- Used in:
  - `UserContext.tsx` during auto-login (`is_approved` → `isApproved`)
  - `Login.tsx` after manual login before saving to context

```bash
npm install camelcase-keys
```

- Ensures compatibility with TypeScript interfaces (e.g., `User`) and improves code consistency.

---

## 🧪 How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/Lilu-B/bch-FE.git
cd bch-FE

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

App runs at:  
📱 http://localhost:5173

---

## 🔐 Authentication

- ✅ JWT token is saved to `sessionStorage` on login
- 🔐 Axios interceptor (in `api/axios.ts`) automatically attaches the token
- 🔁 `UserContext.tsx` attempts auto-auth on refresh using `/api/protected`
- 🧠 Normalized user profile is saved to context
- 🔁 On page refresh, auto-login is attempted if token exists
- 🔒 Errors (e.g. expired session) are caught with `AxiosError` and shown via `alert`
- 🔐 Manual logout clears token and resets context
- User profile updated via PATCH `/api/users/me`

---

## 🔗 Backend Integration

Connected to:  
🔗 https://github.com/Lilu-B/CORRECT-bakery-crew-BE

- Axios uses `/api` with proxy to `localhost:3001`
- Tested endpoints:
  - `POST /api/login`
  - `POST /api/register`
  - `GET /api/protected`
  - `PATCH /api/users/me`
  - `DELETE /api/users/:id`
  - `GET /api/events`
  - `POST /api/events`
  - `GET /api/events/:eventId`
  - `POST /api/events/:eventId/apply`
  - `GET /api/events/:eventId/applicants`
  - `DELETE /api/events/:eventId`
  - `GET /api/donations/active`
  - `POST /api/donations`
  - `GET /api/donations/:donationId`
  - `POST /api/donations/:donationId/confirm-payment`
  - `DELETE /api/donations/:donationId`
  - `GET /api/admin/users/pending`
  - `PATCH /api/admin/users/:id/approve`

---

## 🛠️ Work Done So Far

- ✅ Project initialized with `Vite + React + TypeScript`
- 📁 Clean, modular folder structure established
- 🔐 Full JWT authentication:
  - `axios.ts` configured with interceptor for token + camelCase normalization
  - Token persisted in `sessionStorage` and auto-attached via Axios
  - Auto-login on refresh via `/api/protected` in `UserContext.tsx`
  - Logout resets auth context
- ⚙️ `vite.config.ts` set with proxy for `/api` to `localhost:3001`
- 🔤 `camelcase-keys` installed for response normalization from backend
- 🧠 `UserContext.tsx` handles auth state globally
- 🔒 `ProtectedRoute.tsx` used for route guarding
- 👥 Login, Register, and Profile pages fully functional with:
  - Error handling via `AxiosError`
  - Shift-based registration
  - Auto-assignment of manager during signup
  - Profile edit & delete support
- 🏠 Home page:
  - Displays role, shift, upcoming events and donations
  - Role-based event filtering (manager sees own shift only)
  - Placeholder for Google Calendar sync
- 📅 Events feature fully implemented:
  - `/events` page shows all **active** events
  - Events filtered based on role (user/manager/developer)
  - `EventDetails` page:
    - Users can apply or skip
    - Shows applied status and applicants
    - Managers/Developers can delete
  - Create event form (`EventCreate.tsx`):
    - Inputs: title, date picker, shift, optional description
    - Validates fields before submission
    - Manager can create only for their shift (enforced front & back)
    - Developer can create for any shift
- 💰 Active donations:
  - `/donations` page integrated (view only for now)
  - Styled consistently with events
- 🧪 Robust error handling and fallback UI:
  - Try/catch in all fetchers
  - Alerts shown on failure
  - Empty array fallback for lists
- 🧼 Cleaned up interfaces and types:
  - Centralized in `src/types/`
  - Events, Users, Donations typed strictly
- 🛠️ GitHub commits structured by feature for clarity
- 📆 CalendarView component implemented with:
  - Role-based filtering (applied-only for users)
  - Dot markers for events
  - Date selection state and event list per day
- 📤 Google Calendar export button added post-application (event details only)
- 🖌️ Styled weekends, current day, selected day, and header for readability
- ♿ Improved accessibility: visible date text, proper hover/focus states
- 📄 README maintained and expanded at each stage

---

## 🛠️ Recent Improvements

- Axios interceptor now includes both token and camelCase handling
- Response types are centralized in `src/types/` (`Event`, `User`, `Donation`)
- Consistent camelCase handling across project
- `fetchEvents()` returns applied state for users only
- `/events/:eventId` implemented with role-based rendering:
  - users can apply
  - managers/admins can delete
- Reorganized `api/events.ts` to separate logic & interface
- Implemented strict TypeScript imports: `import type { Event } from ...`
- Clean and maintainable file structure

---

## 📌 Upcoming Features

- Messages inbox & replies (feature UI hidden for now, planned soon)
- Donation confirmation & payment flow - Stripe integration for real donation
- Role-based admin dashboard

