const express = require('express');
const router = express.Router();
// Cart is managed client-side in localStorage/Context
// This route is optional for server-side cart sync
router.get('/', (req, res) => res.json({ message: 'Cart is managed client-side' }));
module.exports = router;
