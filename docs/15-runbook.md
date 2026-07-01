# Parking Yetu - Operational Runbook

## Health Checks
curl https://parking-yetu.web.app

## Common Issues
| Issue | Fix |
|-------|-----|
| Firestore Rules Error | npx firebase deploy --only firestore:rules |
| Build Fails | rm -rf node_modules dist && npm install && npm run build |

---

*Parking Yetu - Operational Runbook - Version 3.1.0*
