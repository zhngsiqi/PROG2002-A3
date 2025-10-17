CREATE TABLE organisations (
    organisation_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    website VARCHAR(150)
);

CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    organisation_id INT,
    category_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(150) NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    ticket_price DECIMAL(10,2) DEFAULT 0.00,
    goal_amount DECIMAL(12,2) DEFAULT 0.00,
    raised_amount DECIMAL(12,2) DEFAULT 0.00,
    status ENUM('upcoming', 'past', 'suspended') DEFAULT 'upcoming',
    FOREIGN KEY (organisation_id) REFERENCES organisations(organisation_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

INSERT INTO categories (name, description) VALUES
('Gala Dinner', 'Formal fundraising dinner'),
('Fun Run', 'Charity marathon or run'),
('Auction', 'Silent or live auction'),
('Concert', 'Fundraising concert');

INSERT INTO organisations (name, description, contact_email, contact_phone, website) VALUES
('Hope Foundation', 'Supports children education programs', 'info@hope.org', '123-456-7890', 'https://hope.org'),
('Green Earth', 'Environmental conservation projects', 'contact@greenearth.org', '987-654-3210', 'https://greenearth.org');

INSERT INTO events (organisation_id, category_id, name, description, location, start_date, end_date, ticket_price, goal_amount, raised_amount, status) VALUES
(1, 1, 'Annual Charity Gala', 'A black-tie dinner to support children education', 'City Hall', '2025-10-10 18:00:00', '2025-10-10 22:00:00', 100.00, 50000.00, 12000.00, 'upcoming'),
(1, 2, 'Run for Education', '5km fun run to raise awareness and funds', 'Central Park', '2025-11-05 07:00:00', '2025-11-05 12:00:00', 20.00, 10000.00, 2000.00, 'upcoming'),
(2, 3, 'Art Auction', 'Auction of donated artworks to support conservation', 'Art Museum', '2025-09-01 15:00:00', '2025-09-01 18:00:00', 0.00, 15000.00, 15000.00, 'past'),
(2, 4, 'Charity Concert', 'Live music event featuring local artists', 'Open Air Theatre', '2025-12-20 19:00:00', '2025-12-20 22:00:00', 50.00, 20000.00, 5000.00, 'upcoming'),
(1, 2, 'Spring Fun Run', 'Family-friendly fun run event', 'River Park', '2025-03-10 08:00:00', '2025-03-10 12:00:00', 15.00, 8000.00, 8200.00, 'past'),
(2, 1, 'Green Gala Night', 'Dinner to support reforestation projects', 'Grand Hotel Ballroom', '2025-05-15 18:00:00', '2025-05-15 23:00:00', 120.00, 40000.00, 15000.00, 'past'),
(1, 3, 'Book Auction', 'Auction of rare books to support literacy programs', 'Library Hall', '2025-08-20 14:00:00', '2025-08-20 17:00:00', 0.00, 10000.00, 7500.00, 'past'),
(2, 4, 'Summer Concert', 'Music festival for environmental awareness', 'Beachside Stage', '2025-07-30 16:00:00', '2025-07-30 22:00:00', 30.00, 25000.00, 24000.00, 'past');

