// models/Inquiry.js

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
    tour: { type: String, default: null },
    final_price: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    selected_nights_key: { type: Number, default: 0 }, // e.g., 4
    selected_nights_option: { type: String, default: '' }, // e.g., "3 Nights in Beach Villa & 1 Night ..."
    selected_food_category: { type: String, default: '' }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
