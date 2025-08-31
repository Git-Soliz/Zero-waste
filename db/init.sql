-- Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    owner_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trades
CREATE TABLE IF NOT EXISTS trades (
    id SERIAL PRIMARY KEY,
    item_offered INT REFERENCES items(id) ON DELETE CASCADE,
    item_requested INT REFERENCES items(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- Testiniai duomenys
-- ======================

-- User
INSERT INTO users (username, password, email)
VALUES ('testuser', 'password123', 'test@example.com')
ON CONFLICT DO NOTHING;

-- Items (priklauso testuser -> id=1)
INSERT INTO items (name, description, owner_id)
VALUES 
('Test Item A', 'Pirmas testinis item', 1),
('Test Item B', 'Antras testinis item', 1)
ON CONFLICT DO NOTHING;

-- Trade tarp item A (id=1) ir item B (id=2)
INSERT INTO trades (item_offered, item_requested, status)
VALUES (1, 2, 'pending')
ON CONFLICT DO NOTHING;
