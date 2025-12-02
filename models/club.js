const mongoose = require('mongoose');

// Participant
const participantSchema = new mongoose.Schema({
  answers: Object,
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
});

// Organizer
const organizerSchema = new mongoose.Schema({
  name: String,
  role: String,
  avatar: String
});

// Review
const reviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  comment: String,
  date: { type: Date, default: Date.now }
});

// Registration form field
const formFieldSchema = new mongoose.Schema({
  title: String,
  type: { type: String, enum: ['text','radio','checkbox'] },
  required: { type: Boolean, default: false },
  options: [String] // only for radio/checkbox
});

// Event
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
  startTime: String,
  endTime: String,
  status: { type: String, enum: ['upcoming','ongoing','done'], default: 'upcoming' },
  category: String,
  location: String,
  capacity: Number,
  attendees: { type: Number, default: 0 },
  coverImage: String,
  bannerImage: String,
  organizers: [organizerSchema],
  gallery: [String],
  reviews: [reviewSchema],
  registrationForm: [formFieldSchema],
  participants: [participantSchema],
  stats: {
    totalRegistrations: { type: Number, default: 0 },
    attended: { type: Number, default: 0 },
    feedbackSubmitted: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Club
const clubSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  avatar: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  events: [eventSchema]
});

module.exports = mongoose.model('Club', clubSchema);
