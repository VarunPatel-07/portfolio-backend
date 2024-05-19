const mongoose = require("mongoose");
const { Schema } = mongoose;
const ContactFormModal = new Schema({
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Number: {
    type: Number,
    required: true,
  },
  Country_Name: {
    type: String,
    required: true,
  },
  Country_Number_Code: {
    type: String,
    required: true,
  },
  Message: {
    type: String,
    required: true,
  },
});

const ContactForm = mongoose.model("ContactForm", ContactFormModal);
module.exports = ContactForm;
