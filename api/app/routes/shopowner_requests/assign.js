const express = require('express');
const router = express.Router();
const assignToDriver = require('../../controllers/shopowner_requests/assignToDriver');
const authenticate = require('../../librairies/auth');

router.patch('/:id/assign', authenticate, assignToDriver);

module.exports = router;
