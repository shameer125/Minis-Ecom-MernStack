const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

// POST /api/contact
router.post('/', asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ message: 'Name, email and message are required' });

  // In production, integrate with nodemailer or similar service here
  console.log('📧 Contact form submission:', { name, email, subject, message });

  res.json({ message: 'Message received! We will get back to you soon.' });
}));

module.exports = router;
