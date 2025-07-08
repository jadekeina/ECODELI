const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const Ride = require("../../models/ride");

const generateInvoice = async (rideId) => {
    const ride = await Ride.findById(rideId);
    if (!ride) throw new Error("Course introuvable");

    const doc = new PDFDocument();
    const invoicePath = path.join(__dirname, "../../storage/invoices", `ride-${ride.id}.pdf`);
    const stream = fs.createWriteStream(invoicePath);
    doc.pipe(stream);

    // En-tête
    doc.fontSize(20).text("Facture EcoDeli", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Facture pour la course #${ride.id}`);
    doc.text(`Client ID : ${ride.user_id}`);
    doc.text(`Adresse départ : ${ride.depart_address}`);
    doc.text(`Adresse arrivée : ${ride.arrivee_address}`);
    doc.text(`Distance : ${ride.distance_km} km`);
    doc.text(`Durée : ${ride.duree || "N/A"} min`);
    doc.text(`Prix HT : ${ride.base_price} €`);
    doc.text(`Commission : ${ride.commission} €`);
    doc.text(`TVA : ${ride.tva} €`);
    doc.text(`Total TTC : ${ride.total_price} €`);
    doc.text(`Date : ${new Date(ride.scheduled_date).toLocaleString()}`);

    doc.end();

    return `/storage/invoices/ride-${ride.id}.pdf`;
};

module.exports = generateInvoice;
