DROP DATABASE IF EXISTS ecodeli;
CREATE DATABASE ecodeli CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecodeli;

-- 👤 Utilisateurs
CREATE TABLE users (
                       id                    INT AUTO_INCREMENT PRIMARY KEY,
                       firstname             VARCHAR(100)        NOT NULL,
                       lastname              VARCHAR(100)        NOT NULL,
                       username              VARCHAR(100) UNIQUE NULL,
                       mail                  VARCHAR(255) UNIQUE NOT NULL,
                       password              TEXT                NOT NULL,
                       sexe                  ENUM('H', 'F', 'Autre') DEFAULT NULL,
                       profilpicture         VARCHAR(255) DEFAULT 'default.jpg',
                       birthday              DATE DEFAULT NULL,
                       token                 TEXT DEFAULT NULL,
                       role                  ENUM('client', 'provider', 'delivery-driver', 'shop-owner', 'admin') DEFAULT 'client',
                       dateInscription       DATETIME DEFAULT CURRENT_TIMESTAMP,
                       last_login            DATETIME DEFAULT NULL,
                       updated_at            DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Champs ajoutés pour gestion e-mail
                       email_token           VARCHAR(255) DEFAULT NULL,
                       email_token_expires   DATETIME DEFAULT NULL,
                       email_verified        BOOLEAN DEFAULT FALSE,
                       reset_token           VARCHAR(255) DEFAULT NULL,
                       reset_token_expires   DATETIME DEFAULT NULL,

    -- Champs d'adresse et informations supplémentaires
                       country               VARCHAR(100) DEFAULT NULL,
                       city                  VARCHAR(100) DEFAULT NULL,
                       address               VARCHAR(255) DEFAULT NULL,
                       phone                 VARCHAR(30) DEFAULT NULL,
                       organization          VARCHAR(255) DEFAULT NULL,
                       department            VARCHAR(100) DEFAULT NULL,
                       zipcode               VARCHAR(20) DEFAULT NULL
);



-- 📍 Adresses
CREATE TABLE addresses
(
    id           INT AUTO_INCREMENT PRIMARY KEY,
    full_address VARCHAR(255) NOT NULL,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 📄 Documents justificatifs
CREATE TABLE documents_justificatifs
(
    id             INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT          NOT NULL,
    type_document  ENUM (
        'permis',
        'piece_identite',
        'avis_sirene',
        'attestation_urssaf',
        'rc_pro',
        'diplome',
        'siret',
        'attestation_autoentrepreneur'
        )                       NOT NULL,
    chemin_fichier VARCHAR(255) NOT NULL,
    statut         ENUM ('en_attente', 'valide', 'refuse') DEFAULT 'en_attente',
    date_upload    DATETIME                                DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- 🚚 Livreurs
CREATE TABLE delivery_driver
(
    id                INT AUTO_INCREMENT PRIMARY KEY,
    user_id           INT NOT NULL,
    zone_deplacement  VARCHAR(255),
    statut_validation ENUM ('en_attente', 'valide', 'refuse') DEFAULT 'en_attente',
    FOREIGN KEY (user_id) REFERENCES users (id)
);


-- 💆‍♀️ Prestataires
CREATE TABLE provider
(
    id                INT AUTO_INCREMENT PRIMARY KEY,
    user_id           INT NOT NULL,
    type_prestation   VARCHAR(255),
    zone_deplacement  VARCHAR(255),
    statut_validation ENUM ('en_attente', 'valide', 'refuse') DEFAULT 'en_attente',
    created_at        TIMESTAMP                               DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);


-- 🏪 Commerçants
CREATE TABLE shop_owner
(
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    user_id             INT NOT NULL,
    nom_entreprise      VARCHAR(150),
    siret               VARCHAR(14),
    business_address_id INT,
    statut_validation   ENUM ('en_attente', 'valide', 'refuse') DEFAULT 'en_attente',
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (business_address_id) REFERENCES addresses (id) ON DELETE SET NULL
);


-- Annonce
CREATE TABLE requests
(
    id                INT AUTO_INCREMENT PRIMARY KEY,
    user_id           INT          NOT NULL,
    type              ENUM (
        'colis_total',
        'colis_partiel',
        'livraison_domicile',
        'transport_personne',
        'courses',
        'achat_etranger',
        'service_domicile',
        'box_stockage'
        )                          NOT NULL,
    titre             VARCHAR(255) NOT NULL,
    description       TEXT,
    photo             VARCHAR(255) DEFAULT NULL,
    longueur          FLOAT        DEFAULT NULL,
    largeur           FLOAT        DEFAULT NULL,
    poids             FLOAT        DEFAULT NULL,
    prix              FLOAT        DEFAULT NULL,
    prix_suggere      FLOAT        DEFAULT NULL,
    heure_depart      TIME         DEFAULT NULL,
    heure_arrivee     TIME         DEFAULT NULL,
    budget            FLOAT        DEFAULT NULL,
    tarif_prestataire FLOAT        DEFAULT NULL,
    taille_box        VARCHAR(50)  DEFAULT NULL,
    duree             VARCHAR(50)  DEFAULT NULL,
    adresse_depart    VARCHAR(255) DEFAULT NULL,
    adresse_arrivee   VARCHAR(255) DEFAULT NULL,
    date_demande      DATE         DEFAULT NULL,
    created_at        DATETIME     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);


CREATE TABLE warehouse (
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           title VARCHAR(100) NOT NULL,
                           size_m2 FLOAT DEFAULT NULL,
                           phone VARCHAR(20),
                           address TEXT NOT NULL,
                           photo VARCHAR(255) DEFAULT '/storage/default-images/warehouse.webp',
                           created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE warehouse_schedule (
                                    id INT AUTO_INCREMENT PRIMARY KEY,
                                    warehouse_id INT NOT NULL,
                                    date DATE NOT NULL,
                                    time TIME NOT NULL,
                                    status ENUM('disponible', 'indisponible') DEFAULT 'disponible',
                                    FOREIGN KEY (warehouse_id) REFERENCES warehouse(id) ON DELETE CASCADE
);


CREATE TABLE warehouse (
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           titre VARCHAR(100) NOT NULL,
                           taille_m2 FLOAT DEFAULT NULL,
                           telephone VARCHAR(20),
                           adresse TEXT NOT NULL,
                           description TEXT DEFAULT NULL,
                           photo VARCHAR(255) DEFAULT NULL,
                           created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE box (
                     id INT AUTO_INCREMENT PRIMARY KEY,
                     entrepot_id INT,
                     titre VARCHAR(100),
                     taillem2 FLOAT,
                     numero VARCHAR(10),
                     etat ENUM('libre', 'occupee') DEFAULT 'libre',
                     dateHeureEntree DATETIME,
                     dateHeureSortie DATETIME,
                     FOREIGN KEY (entrepot_id) REFERENCES warehouse(id)
);

-- Trajet
CREATE TABLE rides (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       user_id INT NOT NULL,
                       depart_address VARCHAR(255),
                       arrivee_address VARCHAR(255),
                       distance_km DECIMAL(10, 2),
                       duree TEXT,
                       base_price DECIMAL(10, 2),
                       commission DECIMAL(10, 2),
                       tva DECIMAL(10, 2),
                       total_price DECIMAL(10, 2),
                       status ENUM('en_attente', 'acceptee', 'refusee', 'en_cours', 'terminee', 'annulee') DEFAULT 'en_attente',
                       note TEXT,
                       scheduled_date DATETIME,
                       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                       updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



-- Payments

CREATE TABLE payments (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          ride_id INT NOT NULL,
                          stripe_payment_id VARCHAR(255),
                          amount DECIMAL(10, 2),
                          status ENUM('succeeded', 'failed', 'pending', 'processing') DEFAULT 'pending',
                          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          FOREIGN KEY (ride_id) REFERENCES rides(id)
);



-- --------------------------------------------------------- Données



