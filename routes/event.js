const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');


router.get('/admin/events/:clubId', eventController.getClubEvents);
router.get('/admin/events/:id', eventController.getEventDetails);
router.post("/api/admin/addEvent/:clubId", eventController.addEvent);

// GET full event details (single response)
router.get('/api/admin/events/:clubId/:eventId', eventController.getEventDetails);

router.post("/admin/logout", (req, res) => {
  return res.json({ message: "Logged out" });
});


module.exports = router;
