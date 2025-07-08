// Fichier : app/controllers/invoices/generateInvoice.js

const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const Ride = require("../../models/ride");

const generateInvoice = async (type, id) => {
    if (type !== "ride") {
        throw new Error("Type de facture non supporté.");
    }

    const ride = await Ride.findRideById(id);

    if (!ride) {
        throw new Error("Course introuvable");
    }

    const doc = new PDFDocument();
    const outputPath = path.join(__dirname, "../../storage/invoices", `ride-${id}.pdf`);
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

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
    doc.end();

    // Retourner le chemin pour vérification éventuelle
    return outputPath;
};

module.exports = generateInvoice;
