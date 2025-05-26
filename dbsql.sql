CREATE DATABASE dbtemanbulu;
USE dbtemanbulu;

CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY, -- 1: Admin, 2: Seller, 3: Buyer
    name VARCHAR(255) NOT NULL
);

CREATE TABLE animal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE skill (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE `user` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name TEXT NOT NULL,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    animal_id INT,
    birth VARCHAR(255),
    phone_number VARCHAR(20),
    address TEXT,
    profile TEXT,
    cv TEXT,
    certificate TEXT,
    role_id INT NOT NULL,
    status BOOLEAN DEFAULT FALSE,
    description TEXT,
    verified BOOLEAN DEFAULT FALSE,
    amount FLOAT DEFAULT 0,
    FOREIGN KEY (animal_id) REFERENCES animal(id),
    FOREIGN KEY (role_id) REFERENCES role(id)
);

CREATE TABLE service (
    id INT AUTO_INCREMENT PRIMARY KEY,
    skill_id INT,
    animal_id INT,
    seller_id INT,
    price INT,
    FOREIGN KEY (skill_id) REFERENCES skill(id),
    FOREIGN KEY (animal_id) REFERENCES animal(id),
    FOREIGN KEY (seller_id) REFERENCES `user`(id)
);

CREATE TABLE `order` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT NOT NULL,
    buyer_id INT NOT NULL,
    status INT DEFAULT 0 NOT NULL, -- 0: Akan berlangsung, 1: Berlangsung, 2: Selesai
    rating FLOAT,
    start_dt INT NOT NULL,
    end_dt INT NOT NULL,
    FOREIGN KEY (service_id) REFERENCES service(id),
    FOREIGN KEY (buyer_id) REFERENCES `user`(id)
);
