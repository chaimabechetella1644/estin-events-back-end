const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');


exports.getClubEvents = async (req, res) => {
  const db = getDB();
  const clubId = req.params.clubId;

  try {
    const events = await db.collection('clubs').aggregate([
      { $match: { _id: new ObjectId(clubId) }},  
      { $unwind: "$events" },
      { $project: {
          eventId: "$events.eventId",
          title: "$events.title",
          coverImage: "$events.coverImage",
          startDate: "$events.startDate",
          endDate: "$events.endDate",
          location: "$events.location",
          status: "$events.status",
          clubName: "$name"
      }},
      { $sort: { endDate: -1 }}
    ]).toArray();
    console.log(events)
    res.json(events);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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