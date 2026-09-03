# GLT Healthcare — Admin Panel

React + Vite + Tailwind CSS admin panel scaffold, built from the GLT Healthcare
Admin Panel spec. Currently runs **entirely on localStorage** (no backend
needed) so you can run and demo it right away, with a clean path to swap in
a real REST API later.

## Run it

```bash
npm install
npm run dev
```

Login page accepts any email/password (demo mode). Use an email containing
`doctor` (e.g. `doctor@glthealthcare.com`) to preview the DOCTOR role.

## What's included (MVP scaffold, not everything from the spec)

- Auth: Login page, AuthContext, ProtectedRoute, role field on user
- Layout: collapsible/responsive Sidebar, Header with profile menu, AdminLayout
- Dashboard: stat cards + today's appointments + recent patients
- **Patients module (full example)**: list + search, create, edit, detail
  page with tabs (Overview / Vitals / Consultations / Prescriptions), add
  vitals, delete with confirm dialog
- **Doctors module**: list + search, create, activate/deactivate
- Appointments: list + create (modal) + cancel
- Consultations: same data as Appointments, grouped by status tabs
- Medical Records: patient list linking into patient history tab
- Prescriptions: list (download button is a placeholder for later PDF export)
- Users/Staff: list + create + activate/deactivate
- Settings: clinic profile / account / password tabs
- Reusable UI kit in `src/components/ui`: Button, Input, Select, Textarea,
  StatusBadge, Card, Modal, ConfirmDialog, DataTable, Pagination,
  SearchInput, Tabs, EmptyState, Loader, Skeleton

This is a **starter, not a finished product** — the two most fleshed-out
modules (Patients, Doctors) are meant as the pattern to copy when you build
out the rest (richer Consultation workflow, real Prescription builder with
multiple medicines, calendar view for Appointments, PDF export, etc).

## Data layer — localStorage now, API later

All data currently lives in the browser's `localStorage` under one key, via
**`src/services/storage/localStorageClient.js`**. It exposes the same shape
a real API client would: `getAll`, `getById`, `create`, `update`, `remove`
(all `async`, with a tiny artificial delay so it already *feels* like network
calls).

Every feature has its own service file that is the **only** place allowed to
touch storage — pages/components never import storage directly:

```
services/
├── storage/localStorageClient.js   ← current data layer (temporary)
├── api/apiClient.js                ← future real REST client (not wired up yet)
├── patients/patientService.js
├── doctors/doctorService.js
├── appointments/appointmentService.js
├── prescriptions/prescriptionService.js
├── users/userService.js
├── settings/settingsService.js
├── dashboard/dashboardService.js
└── auth/authService.js
```

### Switching to the real backend later

1. Set `VITE_API_BASE_URL` in a `.env` file (see `.env.example`).
2. Finish `src/services/api/apiClient.js` — it already has the same method
   names as `localStorageClient` (`getAll`, `getById`, `create`, `update`,
   `remove`), just backed by `fetch` instead of `localStorage`.
3. In each `services/<feature>/<feature>Service.js`, change:
   ```js
   import localStorageClient from "../storage/localStorageClient";
   ```
   to:
   ```js
   import apiClient from "../api/apiClient";
   ```
   and rename the calls (`localStorageClient.getAll(...)` →
   `apiClient.getAll(...)`) — the collection name argument becomes your API's
   endpoint path (e.g. `"patients"` → `GET /patients`).
4. Delete the `seedIfEmpty(...)` demo-data blocks at the top of each service
   file — real data will come from the backend instead.
5. Nothing in `pages/` or `components/` needs to change, since they only ever
   call the *Service functions, never storage/API directly.

## Folder structure

```
src/
├── components/
│   ├── ui/            reusable design-system components
│   ├── layout/         Sidebar, Header, AdminLayout
│   ├── dashboard/       feature-specific components
│   ├── patients/
│   └── doctors/
├── pages/               one folder per route/module
├── services/             one folder per feature + storage/api layer
├── context/              AuthContext
├── hooks/                 useAuth, useDebounce, useModal
├── routes/                 AppRoutes, ProtectedRoute, routeConfig
├── utils/                   constants.js, helpers.js
└── config/                   env.js
```

## Notes

- Colors/typography are centralized in `tailwind.config.js` — don't hardcode
  hex colors in components.
- `ConfirmDialog` / `Modal` / `DataTable` / `StatusBadge` are the shared
  components — reuse them instead of writing page-specific versions.
- PDF export (prescriptions) and Google Calendar/Meet auto-integration are
  intentionally left as placeholders per the MVP scope in the spec.
