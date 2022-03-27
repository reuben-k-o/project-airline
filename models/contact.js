const { Schema, model } = require("mongoose");

const contactSchema = new Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
});

module.exports = model("Contact", contactSchema);
