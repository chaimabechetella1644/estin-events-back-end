const Event = require('../models/Event');

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single event
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create event
// exports.createEvent = async (req, res) => {
//   try {
//     const newEvent = new Event(req.body);
//     await newEvent.save();
//     res.status(201).json(newEvent);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };



// Create event with organizers, form fields, images
exports.createEvent = async (req, res) => {
  try {
    const {
      club_id,
      title,
      coverImage,
      bannerImage,
      start_date,
      end_date,
      start_time,
      end_time,
      category,
      location,
      description,
      capacity,
      highlights,
      organizers,
      form
    } = req.body;

    const newEvent = new Event({
      club_id,
      title,
      coverImage,
      bannerImage,
      start_date,
      end_date,
      start_time,
      end_time,
      category,
      location,
      description,
      capacity,
      highlights,
      organizers,
      form
    });

    await newEvent.save();

    res.status(201).json({
      message: "Event created successfully!",
      event: newEvent
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};




// Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
