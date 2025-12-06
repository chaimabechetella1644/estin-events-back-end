const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');


router.get('/admin/events/:clubId', eventController.getClubEvents);
router.get('/admin/events/:id', eventController.getEventDetails);

router.post("/admin/logout", (req, res) => {
  return res.json({ message: "Logged out" });
});


module.exports = router;
