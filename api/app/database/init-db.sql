DROP DATABASE IF EXISTS ecodeli;
CREATE DATABASE ecodeli CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecodeli;

-- Utilisateurs
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
                       role ENUM('client', 'livreur', 'prestataire', 'commercant', 'admin') DEFAULT 'client',
                       dateInscription DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Adresses
CREATE TABLE adresses (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          user_id INT,
                          ligne1 VARCHAR(255),
                          ville VARCHAR(100),
                          code_postal VARCHAR(20),
                          pays VARCHAR(100),
                          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Documents justificatifs
CREATE TABLE documents_justificatifs (
                                         id INT AUTO_INCREMENT PRIMARY KEY,
                                         user_id INT,
                                         type_document ENUM('permis', 'siret', 'attestation_autoentrepreneur', 'diplome', 'justificatif_domicile') NOT NULL,
                                         chemin_fichier VARCHAR(255) NOT NULL,
                                         statut ENUM('en_attente', 'valide', 'refuse') DEFAULT 'en_attente',
                                         date_upload DATETIME DEFAULT CURRENT_TIMESTAMP,
                                         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Livreurs
CREATE TABLE delivery_driver (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          user_id INT,
                          zone_deplacement VARCHAR(255),
                          statut_validation ENUM('en_attente', 'valide', 'refuse') DEFAULT 'en_attente',
                          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Prestataires
CREATE TABLE provider (
                              id INT AUTO_INCREMENT PRIMARY KEY,
                              user_id INT,
                              type_prestation VARCHAR(255),
                              diplome VARCHAR(255),
                              zone_deplacement VARCHAR(255),
                              statut_validation ENUM('en_attente', 'valide', 'refuse') DEFAULT 'en_attente',
                              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Commerçants
CREATE TABLE shop_owner (
                             id INT AUTO_INCREMENT PRIMARY KEY,
                             user_id INT,
                             nom_entreprise VARCHAR(255),
                             siret VARCHAR(14),
                             statut_validation ENUM('en_attente', 'valide', 'refuse') DEFAULT 'en_attente',
                             FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
