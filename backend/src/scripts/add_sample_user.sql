-- Add a sub admin user
INSERT INTO users (name, email, password, role)
VALUES (
    'Sub Admin',
    'subadmin@example.com',
    '$2a$10$X7z3b9y8z4c5v6b7n8m9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0j',
    'subAdmin'
);

-- Add a teachers admin user
INSERT INTO users (name, email, password, role)
VALUES (
    'Teachers Admin',
    'teachersadmin@example.com',
    '$2a$10$X7z3b9y8z4c5v6b7n8m9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0j',
    'teachersAdmin'
);

-- Add a teacher user
INSERT INTO users (name, email, password, role)
VALUES (
    'Test Teacher',
    'teacher@example.com',
    '$2a$10$X7z3b9y8z4c5v6b7n8m9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0j',
    'teacher'
);

-- Add a student user
INSERT INTO users (name, email, password, role)
VALUES (
    'Test Student',
    'student@example.com',
    '$2a$10$X7z3b9y8z4c5v6b7n8m9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0j',
    'student'
); 