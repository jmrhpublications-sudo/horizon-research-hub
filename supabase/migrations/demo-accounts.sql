-- Demo Accounts Setup for JMRH Publications
-- Run this SQL to create default demo accounts

-- Note: These accounts need to be created through Supabase Auth
-- You can create them manually in Supabase Dashboard > Authentication > Users
-- Or use the Admin Dashboard to create users

-- Default Demo Accounts:
-- | Role      | Email                  | Password    |
-- |-----------|------------------------|-------------|
-- | ADMIN     | admin@jmrh.com         | admin123    |
-- | PROFESSOR | professor@jmrh.com     | professor123|
-- | USER      | user@jmrh.com          | user123     |

-- After creating auth users, update their roles:

-- Update Admin role
-- INSERT INTO user_roles (user_id, role) 
-- SELECT id, 'ADMIN' 
-- FROM auth.users 
-- WHERE email = 'admin@jmrh.com';

-- Update Professor role  
-- INSERT INTO user_roles (user_id, role)
-- SELECT id, 'PROFESSOR'
-- FROM auth.users
-- WHERE email = 'professor@jmrh.com';

-- Update User role
-- INSERT INTO user_roles (user_id, role)
-- SELECT id, 'USER'
-- FROM auth.users
-- WHERE email = 'user@jmrh.com';

-- Profile setup for demo accounts (run after auth users are created)

-- Admin Profile
-- UPDATE profiles 
-- SET name = 'Admin', affiliation = 'JMRH Publications'
-- WHERE email = 'admin@jmrh.com';

-- Professor Profile
-- UPDATE profiles
-- SET name = 'Dr. Professor', affiliation = 'University', department = 'Research'
-- WHERE email = 'professor@jmrh.com';

-- User Profile
-- UPDATE profiles
-- SET name = 'Demo User', affiliation = 'Institution'
-- WHERE email = 'user@jmrh.com';
