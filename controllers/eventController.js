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


// add event
exports.addEvent = async (req, res) => {
  try {
    const db = getDB();
    const {
      title, category, description, capacity,
      startDate, endDate, startTime, endTime,
      location, bannerImage, coverImage,
      organizers, registrationForm
    } = req.body;

    const clubId = req.params.clubId;

    const event = {
      eventId: title.toLowerCase().replace(/ /g, "-"),
      title,
      category,
      description,
      capacity,
      startDate,
      endDate,
      startTime,
      endTime,
      location,
      bannerImage,
      coverImage,
      organizers,
      registrationForm,
      reviews: [],
      participants: [],
      status: new Date(startDate) > new Date() ? "upcoming" : "done",
      stats: {
        totalRegistrations: 0,
        attended: 0,
        feedbackSubmitted: 0,
        averageRating: 0
      }
    };

    const result = await db.collection("clubs").updateOne(
      { _id: new ObjectId(clubId) },
      { $push: { events: event } }
    );

    if (result.modifiedCount === 0) return res.status(404).json({ msg: "Club not found" });

    res.json({ msg: "Event added!", event, clubId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getEventDetails = async (req, res) => {
  try {
    const db = getDB();
    const { clubId, eventId } = req.params;

    const club = await db.collection('clubs').findOne(
      { _id: new ObjectId(clubId), 'events.eventId': eventId },
      { projection: { 'events.$': 1 } } // only return the matched event
    );

    if (!club || !club.events || club.events.length === 0)
      return res.status(404).json({ msg: 'Event not found' });

    const event = club.events[0];

    // Compute some stats dynamically if needed
    const attendeesCount = (event.participants || []).length;
    const feedbackCount = (event.reviews || []).length;
    const averageRating =
      event.reviews && event.reviews.length
        ? event.reviews.reduce((sum, r) => sum + r.rating, 0) / event.reviews.length
        : 0;

    const response = {
      ...event,
      stats: {
        totalRegistrations: attendeesCount,
        attended: event.attended || attendeesCount, // fallback if you track attended separately
        feedbackSubmitted: feedbackCount,
        averageRating: averageRating.toFixed(1),
      },
      attendeesList: event.participants || [],
      organizers: event.organizers || [],
      gallery: event.gallery || [],
      reviews: event.reviews || [],
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// delete event
// DELETE EVENT
exports.deleteEvent = async (req, res) => {
  try {
    const db = getDB();
    const { clubId, eventId } = req.params;

    // First, find the club to ensure it exists
    const club = await db.collection("clubs").findOne({ _id: new ObjectId(clubId) });
    if (!club) return res.status(404).json({ msg: "Club not found" });

    // Then, check if the event exists
    const eventExists = club.events?.some(e => e.eventId === eventId);
    if (!eventExists) return res.status(404).json({ msg: "Event not found" });

    // Delete the event
    const result = await db.collection("clubs").updateOne(
      { _id: new ObjectId(clubId) },
      { $pull: { events: { eventId } } }
    );

    res.json({ msg: "Event deleted successfully", eventId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.updateEvent = async (req, res) => {
  try {
    const db = getDB();
    const { clubId, eventId } = req.params;
    const updatedData = req.body;
    console.log(eventId)
    const result = await db.collection('clubs').updateOne(
      { _id: new ObjectId(clubId), "events.eventId": eventId },
      { $set: Object.fromEntries(Object.entries(updatedData).map(([k,v])=>[`events.$.${k}`,v])) }
    );

    if(result.matchedCount===0) return res.status(404).json({ msg: "Event not found" });

    res.json({ msg: "Event updated!" });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};