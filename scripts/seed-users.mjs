import fs from 'fs';
import admin from 'firebase-admin';
import promptSync from 'prompt-sync';
const prompt = promptSync({sigint: true});

const svcPath = './serviceAccount.json';
if (!fs.existsSync(svcPath)) {
  console.error('Missing serviceAccount.json. See README.');
  process.exit(1);
}
const serviceAccount = JSON.parse(fs.readFileSync(svcPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

async function ensureUser(email) {
  let user = null;
  try {
    user = await auth.getUserByEmail(email);
    console.log(`User exists: ${email}`);
  } catch (e) {
    // create
    const password = prompt(`Set password for ${email}: `, {echo: '*'});
    user = await auth.createUser({ email, password, emailVerified: true, disabled: false });
    console.log(`Created user: ${email}`);
  }
  return user;
}

(async () => {
  await ensureUser('fivecoat@adherestudio.com');
  await ensureUser('young@adherestudio.com');
  console.log('Done.');
  process.exit(0);
})();
