const ProviderPayment = require("../../models/providerPayment");

const getProviderPayments = async (providerId) => {
    const payments = await ProviderPayment.getByProviderId(providerId);
    return payments;
};

module.exports = getProviderPayments;
