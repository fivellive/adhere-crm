<<<<<<< HEAD
# adhere-crm
=======
# Adhere CRM Web App (Firebase + React/Vite)

A minimal, production-ready starter for your client portal + admin CRM with Firebase Hosting, Firestore, Storage, and Auth.

## Features
- Email/password Auth for admins (two seeded emails).
- Admin Dashboard: create clients, projects, upload multiple files (proofs/finals), threaded comments.
- Client Portal (public read-only by tokenized link): view files, download, see comments from admins.
- Pricing calculators (Design @ $65/hr, Install by sqft, Print by linear footage).
- Adhere branding palette and clean UI.
- Secure rules: only admin emails can write; public read only for projects explicitly marked `public: true`.
- GitHub Actions workflow for Firebase Hosting deploys.

---

## Quick Deploy (no coding)
1. **Create Firebase project** at https://console.firebase.google.com
2. Enable **Authentication** (email/password), **Firestore**, **Storage**, **Hosting**.
3. In Firestore, set rules from `firestore.rules`; in Storage set rules from `storage.rules`.
4. In Hosting, set a site (default).

### Local setup
5. Download this zip and unzip. In the `web/` folder, copy `.env.example` to `.env` and fill your Firebase config.
6. Install deps:
   ```bash
   cd web
   npm i
   npm run dev  # local preview
   ```
7. Build & deploy (after installing Firebase CLI and logging in):
   ```bash
   npm run build
   cd ..
   firebase login
   firebase use <your-project-id>
   firebase deploy
   ```

### Seed admin users
- You cannot pre-bundle passwords in client code. Run `node scripts/seed-users.mjs` once with a Firebase **Service Account** to create:
  - fivecoat@adherestudio.com  (password you choose)
  - young@adherestudio.com     (password you choose)
- See `scripts/README.md` for 2-step instructions.

### GitHub + Firebase Hosting workflow (optional)
- Add repo secrets to GitHub: `FIREBASE_SERVICE_ACCOUNT` (JSON), `FIREBASE_PROJECT_ID`.
- Push this repo; workflow in `.github/workflows/firebase-hosting.yml` will build and deploy on pushes to `main`.

---

## Structure
```
/web               # React (Vite) app
/scripts           # Admin seeding (create users) – run locally
firebase.json
firestore.rules
storage.rules
.github/workflows/firebase-hosting.yml
```

---

## Branding
- Typography and UI sized for simple, bold layouts.
- Colors use Adhere style: dark charcoal, off-white, accent yellow.
  Update in `web/src/theme.ts` as needed.

---

## Notes
- Client portal reads are public **only** when `project.public === true`. Admins can toggle this.
- Writes (create/edit projects, comments, uploads) are restricted to the two admin emails in Firestore/Storage rules.
- You can add more admin emails later by updating rules.
>>>>>>> e97a09e (Initial commit)
