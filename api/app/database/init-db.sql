DROP DATABASE IF EXISTS ecodeli;
CREATE DATABASE ecodeli CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecodeli;

-- 👤 Utilisateurs
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
                       role ENUM('client', 'provider', 'delivery-driver', 'shop-owner', 'admin') DEFAULT 'client',
                       dateInscription DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 📍 Adresses
CREATE TABLE addresses (
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           full_address VARCHAR(255) NOT NULL,
                           created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 📄 Documents justificatifs
CREATE TABLE documents_justificatifs (
                                         id INT AUTO_INCREMENT PRIMARY KEY,
                                         user_id INT NOT NULL,
                                         type_document ENUM(
                                             'permis',
                                             'piece_identite',
                                             'avis_sirene',
                                             'attestation_urssaf',
                                             'rc_pro',
                                             'diplome',
                                             'siret',
                                             'attestation_autoentrepreneur'
                                             ) NOT NULL,
                                         chemin_fichier VARCHAR(255) NOT NULL,
                                         statut ENUM('en_attente', 'valide', 'refuse') DEFAULT 'en_attente',
                                         date_upload DATETIME DEFAULT CURRENT_TIMESTAMP,
                                         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 🚚 Livreurs
CREATE TABLE delivery_driver (
                                 id INT AUTO_INCREMENT PRIMARY KEY,
                                 user_id INT NOT NULL,
                                 zone_deplacement VARCHAR(255),
                                 statut_validation ENUM('en_attente', 'valide', 'refuse') DEFAULT 'en_attente',
                                 FOREIGN KEY (user_id) REFERENCES users(id)
);


-- 💆‍♀️ Prestataires
CREATE TABLE provider (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          user_id INT NOT NULL,
                          type_prestation VARCHAR(255),
                          zone_deplacement VARCHAR(255),
                          statut_validation ENUM('en_attente', 'valide', 'refuse') DEFAULT 'en_attente',
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (user_id) REFERENCES users(id)
);


-- 🏪 Commerçants
CREATE TABLE shop_owner (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            user_id INT NOT NULL,
                            nom_entreprise VARCHAR(150),
                            siret VARCHAR(14),
                            business_address_id INT,
                            statut_validation ENUM('en_attente', 'valide', 'refuse') DEFAULT 'en_attente',
                            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                            FOREIGN KEY (business_address_id) REFERENCES addresses(id) ON DELETE SET NULL
);
