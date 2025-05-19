CREATE DATABASE dbtemanbulu;

CREATE TABLE role (
    id SERIAL PRIMARY KEY, -- 1: Admin, 2: Seller, 3: Buyer
    name VARCHAR(255) NOT NULL
);

CREATE TABLE animal (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE skill (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    animal_id INT REFERENCES animal(id),
    birth VARCHAR(255),
    phone_number VARCHAR(20),
    address TEXT,
    profile TEXT,
    cv TEXT,
    certificate TEXT,
    role_id INT NOT NULL REFERENCES role(id),
    status BOOLEAN DEFAULT FALSE,
    description TEXT,
    verified BOOLEAN DEFAULT FALSE,
    amount FLOAT DEFAULT 0
);

CREATE TABLE "order" (
    id SERIAL PRIMARY KEY,
    service_id INT NOT NULL REFERENCES service(id),
    buyer_id INT NOT NULL REFERENCES "user"(id),
    status INT DEFAULT 0 NOT NULL, -- 0: Akan berlangsung, 1: Berlangsung, 2: Selesai
    rating FLOAT,
    start_dt INT NOT NULL,
    end_dt INT NOT NULL
);

CREATE TABLE service (
    id SERIAL PRIMARY KEY,
    skill_id INT REFERENCES skill(id),
    animal_id INT REFERENCES animal(id),
    seller_id INT REFERENCES "user"(id),
    price INT
);