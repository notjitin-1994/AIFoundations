# End-to-End Auth Flow Test

## Prerequisites
- Dev server running: `npm run dev`
- Supabase project configured with email confirmation OFF

## Test Steps

### 1. Unauthenticated redirect
- [ ] Visit `http://localhost:3000`
- [ ] Verify redirect to `/login`

### 2. Signup flow
- [ ] Click "Create one" link on login page
- [ ] Fill: First name = "Test", Last name = "User", Email = "test@example.com", Password = "TestPass123!"
- [ ] Password strength meter shows "Strong" (4 green bars)
- [ ] Click "Create account"
- [ ] Verify redirect to `/` (Module 0)
- [ ] Verify header shows "Test" (first name)
- [ ] Verify profile row exists in Supabase dashboard (Table Editor → profiles)

### 3. Slide tracking
- [ ] Navigate through Module 0 slides
- [ ] Verify `experienced` xAPI statements appear in Supabase dashboard (Table Editor → xapi_statements)

### 4. Logout flow
- [ ] Click "Log out" in header
- [ ] Verify redirect to `/login`

### 5. Login flow
- [ ] Enter email and password
- [ ] Click "Sign in"
- [ ] Verify redirect to `/`
- [ ] Verify header shows name

### 6. Invalid login
- [ ] Enter wrong password
- [ ] Verify error message: "Invalid email or password"
- [ ] Verify email field retains value
- [ ] Verify password field is cleared

### 7. Admin access
- [ ] Manually set a user's app_role to 'admin' in profiles table
- [ ] Visit `/admin`
- [ ] Verify dashboard renders with learner data

### 8. Non-admin blocked
- [ ] As a non-admin user, visit `/admin`
- [ ] Verify redirect to `/`
