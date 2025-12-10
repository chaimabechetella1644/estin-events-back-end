const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');


router.get('/admin/events/:clubId', eventController.getClubEvents);
router.get('/admin/events/:id', eventController.getEventDetails);
router.post("/api/admin/addEvent/:clubId", eventController.addEvent);

// GET full event details (single response)
router.get('/api/admin/events/:clubId/:eventId', eventController.getEventDetails);

// delete event
router.delete('/api/admin/events/:clubId/:eventId/delete', eventController.deleteEvent);

// edit event
router.post('/api/admin/events/:clubId/:eventId/delete', eventController.deleteEvent);

router.post('/api/admin/events/:clubId/:eventId/edit', eventController.updateEvent)

router.post("/admin/logout", (req, res) => {
  return res.json({ message: "Logged out" });
});


module.exports = router;
