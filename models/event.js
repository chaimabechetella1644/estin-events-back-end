const mongoose = require('mongoose');

const OrganizerSchema = new mongoose.Schema({
  name: String,
  role: String,
  email: String,
  phone: String,
  avatar: String
});

const ReviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  comment: String,
  date: Date,
  avatar: String
});

const FormFieldSchema = new mongoose.Schema({
  title: String,
  type: String,
  required: Boolean,
  options: [String]
});

const ParticipantSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  answers: Object,
  status: { type: String, enum: ['pending','accepted','rejected'], default: 'pending' }
});

const EventSchema = new mongoose.Schema({
  club_id: mongoose.Schema.Types.ObjectId,
  title: String,
  coverImage: String,
  bannerImage: String,
  start_date: Date,
  end_date: Date,
  start_time: String,
  end_time: String,
  status: { type: String, enum: ['upcoming','ongoing','done'], default: 'upcoming' },
  category: String,
  location: String,
  description: String,
  attendees: Number,
  capacity: Number,
  highlights: [String],
  organizers: [OrganizerSchema],
  gallery: [String],
  reviews: [ReviewSchema],
  form: [FormFieldSchema],
  participants: [ParticipantSchema]
});

module.exports = mongoose.model('Event', EventSchema);
