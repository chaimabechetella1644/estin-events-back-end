const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// Get upcoming events
exports.getUpcomingEvents = (req, res) => {
  const db = getDB();
  db.collection('clubs').aggregate([
    { $unwind: "$events" },
    { $match: { "events.status": "upcoming" } },
    { $project: { 
        _id: "$events._id",
        name: "$events.title",
        coverImage: "$events.coverImage",
        startDate: "$events.startDate",
        location: "$events.location",
        clubName: "$name"
    }},
    { $sort: { startDate: 1 } }
  ]).toArray()
  .then(events => res.json(events))
  .catch(err => res.status(500).json({ error: err.message }));
};

// Popular events (by attendees)
exports.getPopularEvents = (req, res) => {
  const db = getDB();
  db.collection('clubs').aggregate([
    { $unwind: "$events" },
    { $project: { 
        _id: "$events._id",
        name: "$events.title",
        coverImage: "$events.coverImage",
        startDate: "$events.startDate",
        location: "$events.location",
        attendees: "$events.attendees",
        clubName: "$name"
    }},
    { $sort: { attendees: -1 } },
    { $limit: 10 }
  ]).toArray()
  .then(events => res.json(events))
  .catch(err => res.status(500).json({ error: err.message }));
};

// Done events recent
exports.getDoneEvents = (req, res) => {
  const db = getDB();
  db.collection('clubs').aggregate([
    { $unwind: "$events" },
    { $match: { "events.status": "done" } },
    { $project: { 
        _id: "$events._id",
        name: "$events.title",
        coverImage: "$events.coverImage",
        startDate: "$events.startDate",
        location: "$events.location",
        clubName: "$name"
    }},
    { $sort: { "events.endDate": -1 } }
  ]).toArray()
  .then(events => res.json(events))
  .catch(err => res.status(500).json({ error: err.message }));
};

// Navbar clubs list
exports.getClubsList = (req, res) => {
  const db = getDB();
  db.collection('clubs').find({}, { projection: { name: 1 } }).toArray()
    .then(clubs => res.json(clubs))
    .catch(err => res.status(500).json({ error: err.message }));
};

// Club profile
exports.getClubProfile = (req, res) => {
  const db = getDB();
  const clubId = req.params.id;
  db.collection('clubs').findOne({ _id: new ObjectId(clubId) })
    .then(club => {
      if(!club) return res.status(404).json({ msg: "Club not found" });

      // Separate upcoming and past events
      const now = new Date();
      const upcomingEvents = club.events.filter(e => e.status === "upcoming");
      const pastEvents = club.events.filter(e => e.status === "done");

      res.json({
        name: club.name,
        avatar: club.avatar,
        bannerImage: club.bannerImage || null,
        description: club.description,
        foundationDate: club.foundationDate,
        phone: club.phone,
        email: club.email,
        upcomingEvents,
        pastEvents
      });
    })
    .catch(err => res.status(500).json({ error: err.message }));
};

// Event details
exports.getEventDetails = (req, res) => {
  const db = getDB();
  const eventId = req.params.id;

  db.collection('clubs').aggregate([
    { $unwind: "$events" },
    { $match: { "events._id": new ObjectId(eventId) } },
    { $project: { 
        _id: "$events._id",
        title: "$events.title",
        description: "$events.description",
        startDate: "$events.startDate",
        endDate: "$events.endDate",
        startTime: "$events.startTime",
        endTime: "$events.endTime",
        location: "$events.location",
        status: "$events.status",
        coverImage: "$events.coverImage",
        bannerImage: "$events.bannerImage",
        organizers: "$events.organizers",
        reviews: "$events.reviews",
        registrationForm: "$events.registrationForm",
        gallery: "$events.gallery",
        attendees: "$events.attendees",
        capacity: "$events.capacity",
        club: { name: "$name", email: "$email", phone: "$phone", avatar: "$avatar" }
    }}
  ]).toArray()
    .then(events => {
      if(events.length === 0) return res.status(404).json({ msg: "Event not found" });
      res.json(events[0]);
    })
    .catch(err => res.status(500).json({ error: err.message }));
};

// All events
exports.getAllEvents = (req, res) => {
  const db = getDB();
  db.collection('clubs').aggregate([
    { $unwind: "$events" },
    { $project: { 
        _id: "$events._id",
        name: "$events.title",
        coverImage: "$events.coverImage",
        startDate: "$events.startDate",
        location: "$events.location",
        clubName: "$name"
    }},
    { $sort: { startDate: 1 } }
  ]).toArray()
  .then(events => res.json(events))
  .catch(err => res.status(500).json({ error: err.message }));
};
