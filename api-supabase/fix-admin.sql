-- Update admin2@amashop.com to be admin with password: admin123
UPDATE users 
SET is_admin = true, 
    password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.aS5z3h6lKx8q0kQMvy' 
WHERE email = 'admin2@amashop.com';
