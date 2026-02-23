-- Update admin2@amashop.com with correct hash
UPDATE users 
SET is_admin = true, 
    password = '$2b$10$4ENoSYeUqaktmGaJIaG7H.4QIJ0JLZd26fjPzmM/fdRamUAj7kqO.' 
WHERE email = 'admin2@amashop.com';
