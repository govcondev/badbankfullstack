var express = require('express');
var cors = require('cors');
var path = require('path');
var { body, validationResult } = require('express-validator');
var dal = require('./dal.js');
var app = express();

// Use middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

// Middleware function to handle validation errors
function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }

// Create a new route to store Firebase user in MongoDB
app.post('/account/storeUser',
    // Validation checks
    body('name').isString().notEmpty().withMessage('Name is required and should be a string'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('uid').isString().notEmpty().withMessage('UID is required'),
    handleValidationErrors, // Middleware to handle validation errors
    async (req, res) => {
      const { name, email, uid } = req.body;
  
      try {
        // Call the create function in dal.js to store the user in MongoDB
        const user = await dal.create(name, email, '', uid);  // Password not needed, use uid
        res.json({ success: true, user });
      } catch (err) {
        console.error('Error storing user:', err);
        res.status(500).json({ success: false, message: 'Error storing user.' });
      }
    }
  );

// Create user account
app.post('/account/create',
    // Validation checks
    body('name').isString().notEmpty().withMessage('Name is required and should be a string'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    handleValidationErrors, // Middleware to handle validation errors
    async (req, res) => {
      const { name, email, password } = req.body;
  
      try {
        const user = await dal.create(name, email, password);
        res.json({ success: true, user });
      } catch (err) {
        console.error('Error creating account:', err);
        res.status(500).json({ success: false, message: 'Error creating account.' });
      }
    }
  );

// Get all accounts
app.get('/account/all', async (req, res) => {
    try {
        const users = await dal.all();
        res.json({ success: true, users });
    } catch (err) {
        console.error('Error retrieving accounts:', err);
        res.status(500).json({ success: false, message: 'Error retrieving accounts.' });
    }
});

// Get account balance
app.get('/account/balance/:email', async (req, res) => {
    const email = req.params.email;

    // Ensure email is being logged and correctly passed
    console.log("Received request to fetch balance for email:", email);

    try {
        const user = await dal.findUserByEmail(email);
        if (user) {
            res.json({ success: true, balance: user.balance });
        } else {
            res.status(404).json({ success: false, message: 'User not found.' });
        }
    } catch (err) {
        console.error('Error retrieving balance:', err);
        res.status(500).json({ success: false, message: 'Error retrieving balance.' });
    }
});

// Update user account balance
app.put('/account/updateBalance',
    // Validation checks
    body('email').isEmail().withMessage('Valid email is required'),
    body('newBalance').isNumeric().withMessage('New balance must be a number'),
    handleValidationErrors, // Middleware to handle validation errors
    async (req, res) => {
      const { email, newBalance } = req.body;
  
      try {
        const result = await dal.updateBalance(email, newBalance);
        if (result) {
          res.json({ success: true, message: 'Balance updated successfully.' });
        } else {
          res.status(404).json({ success: false, message: 'User not found.' });
        }
      } catch (err) {
        console.error('Error updating balance:', err);
        res.status(500).json({ success: false, message: 'Error updating balance.' });
      }
    }
  );

// Serve the main HTML file for any other route
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
  });

// Start the server
var port = 3000;
app.listen(port);
console.log('Server is running on port: ' + port);
