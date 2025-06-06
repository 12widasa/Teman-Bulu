DROP DATABASE IF EXISTS dbtemanbulu;
CREATE DATABASE dbtemanbulu;
USE dbtemanbulu;

DROP TABLE IF EXISTS `order`;
DROP TABLE IF EXISTS service;
DROP TABLE IF EXISTS user_animals;
DROP TABLE IF EXISTS animal;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS skill;
DROP TABLE IF EXISTS role;

CREATE TABLE role (
    id SERIAL PRIMARY KEY, -- 1: Admin, 2: Seller, 3: Buyer
    name VARCHAR(255) NOT NULL
);

CREATE TABLE skill (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description JSON,
    status INT DEFAULT 0 NOT NULL -- 0: di rumah, 1: penitipan
);

CREATE TABLE `user` (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    birth VARCHAR(255),
    phone_number VARCHAR(20),
    address TEXT,
    profile LONGTEXT,
    cv LONGTEXT,
    certificate LONGTEXT,
    role_id INT NOT NULL REFERENCES role(id),
    status BOOLEAN DEFAULT FALSE,
    description TEXT,
    verified BOOLEAN DEFAULT FALSE,
    amount FLOAT DEFAULT 0
);

CREATE TABLE animal (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE user_animals (
    user_id INT REFERENCES `user`(id) ON DELETE CASCADE,
    animal_id INT REFERENCES animal(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, animal_id)
);

CREATE TABLE service (
    id SERIAL PRIMARY KEY,
    skill_id INT REFERENCES skill(id),
    animal_id INT REFERENCES animal(id),
    seller_id INT REFERENCES `user`(id),
    price INT
);

CREATE TABLE `order` (
    id SERIAL PRIMARY KEY,
    service_id INT NOT NULL REFERENCES service(id),
    buyer_id INT NOT NULL REFERENCES `user`(id),
    status INT DEFAULT 0 NOT NULL, -- 0: Akan berlangsung, 1: Berlangsung, 2: Selesai
    rating FLOAT,
    start_dt INT NOT NULL,
    end_dt INT,
    address TEXT,
    total_price INT NOT NULL
);

-- Insert roles
INSERT INTO role (name) VALUES 
('Admin'), ('Seller'), ('Buyer');

-- Insert skills
INSERT INTO skill (name, description, status) VALUES
('Paket A - Grooming di Rumah', '["Mandi","Potong kuku","Pembersihan telinga","Pembersihan kandang","Dog walking (khusus anjing) selama 30 menit"]', 0),
('Paket B - Penitipan', '["Kandang nyaman","Makanan & minuman","Pembersihan kandang","Waktu bermain & aktivitas ringan"]', 1),
('Paket C - Grooming di Tempat', '["Mandi","Potong kuku","Pembersihan telinga"]', 1),
('Paket D - Grooming & Penitipan', '["Kombinasi lengkap layanan Paket B + Paket C","Cocok untuk Anda yang ingin menitipkan sekaligus merawat hewan kesayangan dengan layanan terbaik"]', 1);

-- Insert animals
INSERT INTO animal (name) VALUES
('Kucing'), ('Anjing'), ('Kelinci'), ('Hamster');

-- Insert users
INSERT INTO `user` (
    full_name, username, email, password, birth, phone_number,
    address, profile, cv, certificate, role_id, description
) VALUES
('Alice Seller', 'alice', 'alice@example.com', 'password123', '2000-01-01', '08123456701', 'Jakarta', '', '', '', 2, 'Experienced pet groomer'),
('Bob Buyer', 'bob', 'bob@example.com', 'password123', '1998-02-01', '08123456702', 'Bandung', '', '', '', 3, 'Loves dogs'),
('Charlie Seller', 'charlie', 'charlie@example.com', 'password123', '1990-03-01', '08123456703', 'Surabaya', '', '', '', 2, 'Certified pet sitter'),
('Dina Buyer', 'dina', 'dina@example.com', 'password123', '2002-04-01', '08123456704', 'Medan', '', '', '', 3, 'Pet enthusiast'),
('Evan Seller', 'evan', 'evan@example.com', 'password123', '1985-05-01', '08123456705', 'Bali', '', '', '', 2, 'Specializes in reptiles'),
('Fiona Buyer', 'fiona', 'fiona@example.com', 'password123', '1993-06-01', '08123456706', 'Depok', '', '', '', 3, 'Bird keeper'),
('George Seller', 'george', 'george@example.com', 'password123', '1988-07-01', '08123456707', 'Bekasi', '', '', '', 2, 'Offers dog training'),
('Hannah Buyer', 'hannah', 'hannah@example.com', 'password123', '2001-08-01', '08123456708', 'Bogor', '', '', '', 3, 'Fish hobbyist'),
('Ivan Seller', 'ivan', 'ivan@example.com', 'password123', '1992-09-01', '08123456709', 'Yogyakarta', '', '', '', 2, 'Vet assistant'),
('Jill Buyer', 'jill', 'jill@example.com', 'password123', '1995-10-01', '08123456710', 'Semarang', '', '', '', 3, 'Owns 3 cats');

-- Link users to animals (user_animals)
INSERT INTO user_animals (user_id, animal_id) VALUES
(1, 1), (1, 2), (3, 1), (3, 3), (5, 10),
(7, 1), (7, 4), (9, 1), (9, 5), (9, 6);


-- Insert orders
INSERT INTO `order` (service_id, buyer_id, status, rating, start_dt, end_dt) VALUES
(1, 2, 2, 4.5, 1746086400, 1746093600),
(2, 4, 2, 5.0, 1746172800, 1746180000),
(3, 6, 2, 3.5, 1746259200, 1746266400),
(4, 8, 2, 4.0, 1746345600, 1746352800),
(5, 10, 2, 4.8, 1746432000, 1746439200),
(6, 2, 2, 4.2, 1746518400, 1746525600),
(7, 4, 2, 5.0, 1746604800, 1746612000),
(8, 6, 2, 4.3, 1746691200, 1746698400),
(9, 8, 2, 3.9, 1746777600, 1746784800),
(10, 10, 2, 4.6, 1746864000, 1746871200),
(1, 2, 2, 3.6, 1746086400, 1746093600),
(2, 4, 2, 3.1, 1746172800, 1746180000),
(3, 6, 2, 4.5, 1746259200, 1746266400),
(4, 8, 2, 4.2, 1746345600, 1746352800),
(5, 10, 2, 4.1, 1746432000, 1746439200),
(6, 2, 2, 4.9, 1746518400, 1746525600),
(7, 4, 2, 4.0, 1746604800, 1746612000),
(8, 6, 2, 3.3, 1746691200, 1746698400),
(9, 8, 2, 2.9, 1746777600, 1746784800),
(10, 10, 2, 3.6, 1746864000, 1746871200);