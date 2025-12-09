const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// Home pages
router.get('/events/upcoming', publicController.getUpcomingEvents);
router.get('/events/popular', publicController.getPopularEvents);
router.get('/events/done', publicController.getDoneEvents);

// Clubs list for navbar
router.get('/clubs', publicController.getClubsList);

// Club profile page
router.get('/clubs/:id', publicController.getClubProfile);

// Single event page
router.get('/events/:id', publicController.getEventDetails);

// admin login
router.post('/admin/login', publicController.login);


// Registration Form
router.get('/events/:eventId/registration-form', publicController.getRegistrationForm);

// Register
router.post('/events/:eventId/register', publicController.registerToEvent);

// add review
router.post('/events/:eventId/addReview', publicController.addReview);

module.exports = router;
