const { OAuth2Client } = require('google-auth-library');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../../../config/db");
const userModel = require("../../models/users");
const crypto = require("crypto");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    return ticket.getPayload();
  } catch (error) {
    throw new Error('Token Google invalide');
  }
}

async function googleAuth(accessToken) {
  return new Promise(async (resolve, reject) => {
    try {
      // Récupérer les informations utilisateur avec l'access token
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!userInfoResponse.ok) {
        throw new Error('Impossible de récupérer les informations utilisateur Google');
      }

      const userInfo = await userInfoResponse.json();
      const { email, given_name, family_name, picture } = userInfo;
      
      // Vérifier si l'utilisateur existe déjà
      userModel.getUserByEmail(email, async (err, result) => {
        if (err) return reject(new Error("Erreur serveur"));
        
        let user;
        
        if (result.length > 0) {
          // Utilisateur existe déjà
          user = result[0];
          
          // Mettre à jour les informations si nécessaire
          const updateSql = `
            UPDATE users 
            SET firstname = ?, lastname = ?, profilpicture = ?, updated_at = NOW()
            WHERE id = ?
          `;
          
          db.query(updateSql, [given_name, family_name, picture, user.id], (updateErr) => {
            if (updateErr) {
              console.error("Erreur mise à jour utilisateur:", updateErr);
            }
          });
          
          // Générer le token pour l'utilisateur existant
          generateToken();
          
        } else {
          // Créer un nouvel utilisateur
          const hashedPassword = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
          const username = `${given_name.toLowerCase()}_${family_name.toLowerCase()}_${Date.now()}`;
          
          const insertSql = `
            INSERT INTO users 
            (firstname, lastname, username, mail, password, profilpicture, email_verified, role)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `;
          
          const insertValues = [
            given_name,
            family_name,
            username,
            email,
            hashedPassword,
            picture,
            true, // Email vérifié automatiquement avec Google
            'client'
          ];
          
          db.query(insertSql, insertValues, (insertErr, insertResult) => {
            if (insertErr) return reject(new Error("Erreur création utilisateur"));
            
            user = {
              id: insertResult.insertId,
              firstname: given_name,
              lastname: family_name,
              username: username,
              mail: email,
              profilpicture: picture,
              email_verified: true,
              role: 'client'
            };
            
            // Générer le token pour le nouvel utilisateur
            generateToken();
          });
        }
        
        // Fonction pour générer le token
        function generateToken() {
          // Générer le token JWT
          const token = jwt.sign(
            {
              userId: user.id,
              mail: user.mail,
              role: user.role,
              status: user.status,
              timestamp: Date.now(),
            },
            process.env.SECRET_KEY,
            { expiresIn: "30d" }
          );
          
          // Sauvegarder le token en base
          userModel.setUserToken(user.id, token, (tokenErr) => {
            if (tokenErr) {
              console.error("Erreur sauvegarde token:", tokenErr);
            }
            
            // Logger la connexion
            userModel.logUserLogin(user.id, (logErr) => {
              if (logErr) {
                console.error("Erreur log connexion:", logErr);
              }
            });
            
            delete user.password;
            resolve({
              token,
              ...user,
            });
          });
        }
      });
      
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = googleAuth; 