# Fix 404 Errors on /api/user (AppContext & ProfileUpdate)

## Plan Overview

Fix frontend API mismatch: updateUser calls PUT /api/user but backend expects /api/user/profile.

## Steps

- [x] Step 1: Edit src/config/api.js - Change userAPI.updateUser from `
- [ ] Step 2: Save and test in browser (check Network tab for no 404 on PUT /api/user/profile; test profile update and lastSeen interval)
- [ ] Step 3: If backend not running: cd backend && npm start
- [ ] Step 4: Complete - Remove this TODO.md

**Next Action**: Proceed to Step 1.
