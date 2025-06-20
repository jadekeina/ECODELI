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

CREATE TABLE addresses (
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           full_address VARCHAR(255) NOT NULL,
                           created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
                                 user_id INT NOT NULL,
                                 zone_address_id INT,           -- zone de déplacement
                                 home_address_id INT,           -- adresse perso s’il y en a
                                 FOREIGN KEY (user_id) REFERENCES users(id),
                                 FOREIGN KEY (zone_address_id) REFERENCES addresses(id),
                                 FOREIGN KEY (home_address_id) REFERENCES addresses(id)
);

-- Prestataires
CREATE TABLE provider (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          user_id INT NOT NULL,
                          zone_address_id INT,
                          FOREIGN KEY (user_id) REFERENCES users(id),
                          FOREIGN KEY (zone_address_id) REFERENCES addresses(id)
);


-- Commerçants
CREATE TABLE shop_owner (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            user_id INT NOT NULL,
                            business_address_id INT,
                            FOREIGN KEY (user_id) REFERENCES users(id),
                            FOREIGN KEY (business_address_id) REFERENCES addresses(id)
);

