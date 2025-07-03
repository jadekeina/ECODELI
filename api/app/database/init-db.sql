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


-- Annonce
CREATE TABLE requests (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          user_id INT NOT NULL,
                          type ENUM(
                              'colis_total',
                              'colis_partiel',
                              'livraison_domicile',
                              'transport_personne',
                              'courses',
                              'achat_etranger',
                              'service_domicile',
                              'box_stockage'
                              ) NOT NULL,
                          titre VARCHAR(255) NOT NULL,
                          description TEXT,
                          photo VARCHAR(255) DEFAULT NULL,
                          longueur FLOAT DEFAULT NULL,
                          largeur FLOAT DEFAULT NULL,
                          poids FLOAT DEFAULT NULL,
                          prix FLOAT DEFAULT NULL,
                          prix_suggere FLOAT DEFAULT NULL,
                          heure_depart TIME DEFAULT NULL,
                          heure_arrivee TIME DEFAULT NULL,
                          budget FLOAT DEFAULT NULL,
                          tarif_prestataire FLOAT DEFAULT NULL,
                          taille_box VARCHAR(50) DEFAULT NULL,
                          duree VARCHAR(50) DEFAULT NULL,
                          adresse_depart VARCHAR(255) DEFAULT NULL,
                          adresse_arrivee VARCHAR(255) DEFAULT NULL,
                          date_demande DATE DEFAULT NULL,
                          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (user_id) REFERENCES users(id)
);


-- --------------------------------------------------------- Données

-- 🔐 Utilisateurs (mot de passe = 'root')
INSERT INTO users (firstname, lastname, username, mail, password, sexe, role)
VALUES
    ('Alice', 'Dupont', 'alice_d', 'alice@example.com', 'root', 'F', 'client'),
    ('Jean', 'Morel', 'jeanmorel', 'jean@example.com', 'root', 'H', 'provider'),
    ('Lina', 'Benz', 'linabenz', 'lina@example.com', 'root', 'F', 'delivery-driver'),
    ('Tom', 'Martinez', 'tomdeluxe', 'tom@example.com', 'root', 'H', 'shop-owner'),
    ('Sarah', 'Nguyen', 'sarahn', 'sarah@example.com', 'root', 'F', 'client'),
    ('Admin', 'Ecodeli', 'admin', 'admin@ecodeli.com', 'root', 'Autre', 'admin');


INSERT INTO addresses (full_address)
VALUES
    ('12 rue des Lilas, Paris'),
    ('24 avenue Jean Jaurès, Lyon'),
    ('108 boulevard Haussmann, Paris'),
    ('75 rue Nationale, Lille');


INSERT INTO shop_owner (user_id, nom_entreprise, siret, business_address_id, statut_validation)
VALUES (4, 'Tom Épicerie Bio', '12345678901234', 1, 'valide');


INSERT INTO provider (user_id, type_prestation, zone_deplacement, statut_validation)
VALUES (2, 'Massage à domicile', 'Paris & banlieue', 'valide');

INSERT INTO requests (user_id, type, titre, description, prix, adresse_depart, adresse_arrivee, date_demande)
VALUES
    (1, 'colis_total', 'Envoyer un colis urgent', 'Colis de 2 kg à envoyer rapidement.', 25, 'Paris 15e', 'Marseille', CURDATE()),
    (2, 'service_domicile', 'Massage 1h', 'Massage bien-être à domicile dans Paris.', 60, NULL, NULL, CURDATE()),
    (3, 'livraison_domicile', 'Livraison express documents', 'Documents importants à livrer à Neuilly.', 35, 'Paris 2e', 'Neuilly-sur-Seine', CURDATE()),
    (4, 'achat_etranger', 'Achat produit Italie', 'Besoin d’acheter un vin spécifique à Rome.', 80, NULL, NULL, CURDATE()),
    (5, 'transport_personne', 'Transport aéroport CDG', 'Trajet pour une cliente avec valises.', 50, 'Paris 11e', 'CDG Terminal 2E', CURDATE());


