const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const Ride = require("../../models/ride");
const db = require("../../../config/db");

const generateInvoice = ({ type, id }, callback) => {
    const doc = new PDFDocument();
    let outputPath;

    const writeAndReturn = () => {
        const writeStream = fs.createWriteStream(outputPath);
        doc.pipe(writeStream);
        writeStream.on("finish", () => callback(null, outputPath));
        doc.end();
    };

    if (type === "ride") {
        Ride.findRideById(id)
            .then((ride) => {
                if (!ride) return callback(new Error("Course introuvable"));

                outputPath = path.join(__dirname, "../../storage/invoices", `ride-${id}.pdf`);
                doc.fontSize(20).text("FACTURE COURSE ECO-DELI", { align: "center" });
                doc.moveDown();
                doc.fontSize(12).text(`Adresse de départ : ${ride.depart_address}`);
                doc.text(`Adresse d’arrivée : ${ride.arrivee_address}`);
                doc.text(`Distance : ${ride.distance_km} km`);
                doc.text(`Durée : ${ride.duree || "N/A"} minutes`);
                doc.text(`Note : ${ride.note || "Aucune"}`);
                doc.moveDown();
                doc.text(`Prix HT : ${ride.base_price || "0"} €`);
                doc.text(`Commission : ${ride.commission} €`);
                doc.text(`TVA : ${ride.tva} €`);
                doc.text(`Total TTC : ${ride.total_price || "0"} €`);
                doc.moveDown();
                doc.text(`Date prévue : ${ride.scheduled_date ? new Date(ride.scheduled_date).toLocaleString() : "Non précisée"}`);
                writeAndReturn();
            })
            .catch(callback);

    } else if (type === "shopowner_request") {
        db.query(
            `SELECT s.depart_address, s.arrivee_address, s.price, d.montant, d.created_at
             FROM shopowner_requests s
                      JOIN delivery_driver_payments d ON s.id = d.shopowner_request_id
             WHERE s.id = ?`,
            [id],
            (err, results) => {
                if (err) return callback(err);
                const row = results[0];
                if (!row) return callback(new Error("Livraison commerçant introuvable"));

                outputPath = path.join(__dirname, "../../storage/invoices", `delivery-${id}.pdf`);
                doc.fontSize(20).text("FACTURE LIVRAISON COMMERÇANT", { align: "center" });
                doc.moveDown();
                doc.fontSize(12).text(`Adresse de départ : ${row.depart_address}`);
                doc.text(`Adresse d’arrivée : ${row.arrivee_address}`);
                doc.text(`Montant versé au livreur : ${row.montant} €`);
                doc.text(`Prix payé par le commerçant : ${row.price} €`);
                doc.text(`Date de paiement : ${new Date(row.created_at).toLocaleDateString()}`);
                writeAndReturn();
            }
        );

    } else if (type === "service_request") {
        db.query(
            `SELECT s.type AS prestation_type, sr.date, sr.heure, sr.lieu, sr.commentaire, sr.created_at,
                    CONCAT(c.firstname, ' ', c.lastname) AS client_nom, c.mail AS client_email,
                    CONCAT(p.firstname, ' ', p.lastname) AS prestataire_nom,
                    sp.amount AS montant
             FROM service_requests sr
                      JOIN services s ON sr.service_id = s.id
                      JOIN users c ON sr.client_id = c.id
                      LEFT JOIN users p ON sr.provider_id = p.id
                      LEFT JOIN service_payments sp ON sr.id = sp.request_id
             WHERE sr.id = ?
            `,
            [id],
            (err, results) => {
                if (err) return callback(err);
                const row = results[0];
                if (!row) return callback(new Error("Demande de prestation introuvable"));

                outputPath = path.join(__dirname, "../../storage/invoices", `service-${id}.pdf`);
                doc.fontSize(20).text("FACTURE PRESTATION ECO-DELI", { align: "center" });
                doc.moveDown();
                doc.fontSize(12).text(`Client : ${row.client_nom} (${row.client_email})`);
                doc.text(`Prestataire : ${row.prestataire_nom || "Non attribué"}`);
                doc.text(`Prestation : ${row.prestation_type}`);
                doc.text(`Lieu : ${row.lieu}`);
                doc.text(`Date : ${row.date} à ${row.heure}`);
                doc.text(`Commentaire : ${row.commentaire || "Aucun"}`);
                doc.moveDown();
                doc.text(`Montant facturé : ${row.montant ? `${row.montant} €` : "Non précisé"}`);
                doc.text(`Date de création : ${new Date(row.created_at).toLocaleDateString()}`);
                writeAndReturn();
            }
        );

    } else {
        return callback(new Error("Type de facture non supporté."));
    }
};

module.exports = generateInvoice;
