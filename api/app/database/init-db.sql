DROP DATABASE IF EXISTS ecodeli;
CREATE DATABASE ecodeli CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecodeli;

CREATE TABLE users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       firstname VARCHAR(100) NOT NULL,
                       lastname VARCHAR(100) NOT NULL,
                       username VARCHAR(100) UNIQUE NOT NULL,
                       mail VARCHAR(255) UNIQUE NOT NULL,
                       password TEXT NOT NULL,
                       sexe ENUM('H', 'F', 'Autre') DEFAULT NULL,
                       profilpicture VARCHAR(255) DEFAULT 'default.jpg',
                       birthday DATE DEFAULT NULL,
                       token TEXT DEFAULT NULL,
                       dateInscription DATETIME DEFAULT CURRENT_TIMESTAMP
);
