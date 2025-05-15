CREATE DATABASE dbtemanbulu;

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
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
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    skill_id INT REFERENCES skill(id),
    animal_id INT REFERENCES animal(id),
    birth_place VARCHAR(255),
    birth_date DATE,
    phone_number VARCHAR(20),
    address TEXT,
    profile TEXT,
    cv TEXT,
    certificate TEXT,
    role_id INT REFERENCES role(id),
    status INT DEFAULT 0,
    description TEXT,
    verified BOOLEAN DEFAULT FALSE,
    amount FLOAT DEFAULT 0
);

CREATE TABLE "order" (
    id SERIAL PRIMARY KEY,
    skill_id INT REFERENCES skill(id),
    buyer_id INT REFERENCES "user"(id),
    seller_id INT REFERENCES "user"(id),
    animal_id INT REFERENCES animal(id),
    status INT
);
