-- Home Service Booking Platform Seed Data
-- Default password for all demo accounts: password123
-- Hash: $2b$12$vY4FGZdwmHDP/GkXjMvgQOy4JrzhweCfhseXXzajWrsUdKnzBucv2

-- 1. Users
INSERT INTO users (id, name, email, password, phone, role) VALUES
(1, 'John Customer', 'customer@test.com', '$2b$12$vY4FGZdwmHDP/GkXjMvgQOy4JrzhweCfhseXXzajWrsUdKnzBucv2', '9876543210', 'CUSTOMER'),
(2, 'Kumar', 'provider@test.com', '$2b$12$vY4FGZdwmHDP/GkXjMvgQOy4JrzhweCfhseXXzajWrsUdKnzBucv2', '9876543211', 'PROVIDER'),
(3, 'Admin User', 'admin@test.com', '$2b$12$vY4FGZdwmHDP/GkXjMvgQOy4JrzhweCfhseXXzajWrsUdKnzBucv2', '9876543212', 'ADMIN'),
(4, 'Ravi', 'ravi@test.com', '$2b$12$vY4FGZdwmHDP/GkXjMvgQOy4JrzhweCfhseXXzajWrsUdKnzBucv2', '9876543213', 'PROVIDER'),
(5, 'Arjun', 'arjun@test.com', '$2b$12$vY4FGZdwmHDP/GkXjMvgQOy4JrzhweCfhseXXzajWrsUdKnzBucv2', '9876543214', 'PROVIDER'),
(6, 'Suresh', 'suresh@test.com', '$2b$12$vY4FGZdwmHDP/GkXjMvgQOy4JrzhweCfhseXXzajWrsUdKnzBucv2', '9876543215', 'PROVIDER'),
(7, 'Priya', 'priya@test.com', '$2b$12$vY4FGZdwmHDP/GkXjMvgQOy4JrzhweCfhseXXzajWrsUdKnzBucv2', '9876543216', 'PROVIDER');

-- 2. Providers
INSERT INTO providers (id, user_id, experience, bio) VALUES
(1, 2, '5 years', 'Certified plumber with 5+ years of experience in residential fittings and tap repairs.'),
(2, 4, '4 years', 'Licensed electrician skilled in house wiring, switch installations, and fan repair.'),
(3, 5, '6 years', 'Passionate home chef specializing in authentic North and South Indian home-style cooking.'),
(4, 6, '8 years', 'Senior plumbing technician specialized in bathroom renovation and major pipe leak fixes.'),
(5, 7, '5 years', 'Professional culinary chef specialized in party dishes and balanced healthy meal preparation.');

-- 3. Categories
INSERT INTO categories (id, name, description) VALUES
(1, 'Plumbing', 'Plumbing services including tap repairs, pipe leakages, and bathroom fixtures.'),
(2, 'Electrical', 'Electrical maintenance including fan installation, switches, and wiring issues.'),
(3, 'Home Chef', 'Personal cooking and culinary services for daily meals and special occasions.');

-- 4. Services
INSERT INTO services (id, name, description, price, category_id) VALUES
(1, 'Tap Repair', 'Fix leaking, dripping, or damaged taps and faucets in bathroom and kitchen.', 299.00, 1),
(2, 'Pipe Repair', 'Locate and fix leaking or burst pipes, drainage issues, and joints.', 499.00, 1),
(3, 'Bathroom Repair', 'Comprehensive bathroom plumbing inspection, flush tank repair, and fixture fixes.', 799.00, 1),
(4, 'Fan Installation', 'Installation, uninstallation, or speed regulation repair for ceiling and exhaust fans.', 349.00, 2),
(5, 'Switch Repair', 'Repair or replacement of burnt, sparking, or loose electrical switches and sockets.', 199.00, 2),
(6, 'Wiring Repair', 'Diagnosis and resolution of circuit trips, short circuits, and damaged wiring lines.', 599.00, 2),
(7, 'Daily Cooking', 'Freshly prepared nutritious breakfast, lunch, or dinner for your entire family.', 699.00, 3),
(8, 'Party Cooking', 'Custom multi-course food preparation for parties, family gatherings, and events.', 1499.00, 3),
(9, 'Meal Preparation', 'Scheduled weekly or daily fitness-oriented healthy meal prep with portion control.', 499.00, 3);

-- 5. Provider-Service Many-to-Many
INSERT INTO provider_services (provider_id, service_id) VALUES
-- Kumar (Plumbing)
(1, 1),
(1, 2),
(1, 3),
-- Ravi (Electrical)
(2, 4),
(2, 5),
(2, 6),
-- Arjun (Home Chef)
(3, 7),
(3, 8),
(3, 9),
-- Suresh (Plumbing)
(4, 1),
(4, 2),
(4, 3),
-- Priya (Home Chef)
(5, 7),
(5, 8),
(5, 9);

-- Reset serial sequences to avoid ID collisions on new inserts
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('providers_id_seq', (SELECT MAX(id) FROM providers));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('services_id_seq', (SELECT MAX(id) FROM services));
