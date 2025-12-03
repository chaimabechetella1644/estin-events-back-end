const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// Get upcoming events
exports.getUpcomingEvents = (req, res) => {
  const db = getDB();
  db.collection('clubs').aggregate([
    { $unwind: "$events" },
    { $match: { "events.status": "upcoming" } },
    { $project: { 
        eventId: "$events.eventId", // <--- use eventId instead of _id
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
        eventId: "$events.eventId",     // <--- added event id
        name: "$events.title",
        coverImage: "$events.coverImage",
        startDate: "$events.startDate",
        location: "$events.location",
        attendees: "$events.attendees",
        clubName: "$name"
    }},
    { $sort: { attendees: -1 } },
    { $limit: 5 }
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
        eventId: "$events.eventId", // <--- use eventId
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

  db.collection('clubs').aggregate([
    { $match: { _id: new ObjectId(clubId) } },
    { $project: {
        name: 1,
        avatar: 1,
        bannerImage: 1,
        description: 1,
        foundationDate: 1,
        phone: 1,
        email: 1,
        upcomingEvents: {
          $filter: {
            input: "$events",
            as: "e",
            cond: { $eq: ["$$e.status", "upcoming"] }
          }
        },
        pastEvents: {
          $filter: {
            input: "$events",
            as: "e",
            cond: { $eq: ["$$e.status", "done"] }
          }
        }
    }},
    // Only return minimal fields for events
    { $project: {
        name: 1,
        avatar: 1,
        bannerImage: 1,
        description: 1,
        foundationDate: 1,
        phone: 1,
        email: 1,
        upcomingEvents: { 
          eventId: "$upcomingEvents.eventId",
          name: "$upcomingEvents.title", 
          bannerImage: "$upcomingEvents.bannerImage", 
          startDate: "$upcomingEvents.startDate", 
          status: "$upcomingEvents.status" 
        },
        pastEvents: { 
          eventId: "$pastEvents.eventId",
          name: "$pastEvents.title", 
          bannerImage: "$pastEvents.bannerImage", 
          startDate: "$pastEvents.startDate", 
          status: "$pastEvents.status" 
        }
    }}
  ]).toArray()
    .then(result => {
      if(result.length === 0) return res.status(404).json({ msg: "Club not found" });
      res.json(result[0]);
    })
    .catch(err => res.status(500).json({ error: err.message }));
};


// Event details
exports.getEventDetails = (req, res) => {
  const db = getDB();
  const eventId = req.params.id;

  db.collection('clubs').aggregate([
    { $unwind: "$events" },
    { $match: { "events.eventId": eventId } }, // <-- match on your slug/id
    { $project: { 
        _id: 0, // don't return the original ObjectId
        eventId: "$events.eventId",
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
        reviews: "$events.reviews", // if it doesn't exist disable button in front
        // registrationForm: "$events.registrationForm",
        gallery: "$events.gallery", // if it doesn't exist disable button in front
        // attendees: "$events.attendees",
        capacity: "$events.capacity",
        club: { name: "$name", email: "$email", phone: "$phone", avatar: "$avatar", description:"$description" }
    }}
  ]).toArray()
    .then(events => {
      if(events.length === 0)  {
        console.log(req.params.id)
        console.log(events)
        return res.status(404).json({ msg: "Event not found" })};
      res.json(events[0]);
    })
    .catch(err => res.status(500).json({ error: err.message }));
};

// Registration Form
exports.getRegistrationForm = async (req, res) => {
  try {
    const db = getDB();
    const { eventId } = req.params;

    const result = await db.collection("clubs").aggregate([
      { $unwind: "$events" },
      { $match: { "events.eventId": eventId, "events.status": "upcoming" } },
      { $project: { _id: 0, registrationForm: "$events.registrationForm" } }
    ]).toArray();

    if (!result.length) {
      return res.status(404).json({ msg: "Event not upcoming or not found" });
    }

    res.json(result[0].registrationForm || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Register
exports.registerToEvent = async (req, res) => {
  try {
    const db = getDB();
    const { eventId } = req.params;
    const answers = req.body; // form answers

    const result = await db.collection("clubs").updateOne(
      { "events.eventId": eventId },
      {
        $push: {
          "events.$.participants": {
            answers,
            status: "pending",
          }
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ msg: "Event not found" });
    }

    res.json({ msg: "Registration submitted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
