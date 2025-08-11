# Scripts

## Seed admin users (run once)
1. In Firebase console, create a **Service Account** key (Project Settings → Service Accounts → Generate new private key). Save JSON as `serviceAccount.json` in this `scripts/` folder (DO NOT COMMIT).
2. Run:
```bash
cd scripts
npm i
node seed-users.mjs
```
3. You'll be prompted for passwords to create:
- fivecoat@adherestudio.com
- young@adherestudio.com
