const mongoose = require('mongoose');
const { Schema } = mongoose;

const inquirySchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: { type: String, required: true },
    travel_date: { type: Date, required: true },
    traveller_count: { type: Number, required: true },
    message: { type: String, default: '' },

    // Optional: If you want to link to a Tour document, store the ID here:
    tour_id: { type: Schema.Types.ObjectId, ref: 'Tour', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
