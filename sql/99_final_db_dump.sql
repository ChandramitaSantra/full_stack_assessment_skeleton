CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    UNIQUE (username),
    UNIQUE (email)
);

-- Step 2: Create the 'home' table to store home-related attributes
CREATE TABLE home (
    home_id INT AUTO_INCREMENT PRIMARY KEY,
    street_address VARCHAR(255) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip VARCHAR(10) NOT NULL,
    sqft FLOAT DEFAULT NULL,
    beds INT DEFAULT NULL,
    baths INT DEFAULT NULL,
    list_price FLOAT DEFAULT NULL,
    UNIQUE (street_address, state, zip)
);

-- Step 3: Create the 'user_home_relations' table to represent the many-to-many relationship between users and homes
CREATE TABLE user_home_relations (
    user_id INT,
    home_id INT,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (home_id) REFERENCES home(home_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, home_id)
);

-- Step 4: Insert existing data into the 'user' table
INSERT INTO user (username, email)
SELECT DISTINCT username, email
FROM user_home
WHERE username IS NOT NULL AND email IS NOT NULL;

INSERT INTO home (street_address, state, zip, sqft, beds, baths, list_price)
SELECT DISTINCT street_address, state, zip, sqft, beds, baths, list_price
FROM user_home
WHERE street_address IS NOT NULL AND state IS NOT NULL AND zip IS NOT NULL;

-- Step 6: Populate the 'user_home_relations' table to establish the relationships
INSERT INTO user_home_relations (user_id, home_id)
SELECT u.user_id, h.home_id
FROM user_home uh
JOIN user u ON uh.username = u.username
JOIN home h ON uh.street_address = h.street_address
    AND uh.state = h.state
    AND uh.zip = h.zip;