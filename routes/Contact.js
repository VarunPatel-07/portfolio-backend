const express = require("express");
const routes = express.Router();
const { body, validationResult } = require("express-validator");
const ContactForm = require("../models/ContactFormModal");
const MailTransport = require("../helper/SendMail");
const { ThankingMail, NewConnectionMail } = require("../helper/MailBody");
let success = false;
routes.post(
  "/",
  [
    body("FirstName", "The FirstName Is Required").exists(),
    body("LastName", "The LastName Is Required").exists(),
    body("Email", "The Email Is Required").isEmail(),
    body("Number", "The Number Is Required").exists(),
    body("Country_Name", "The Country_Name Is Required").exists(),
    body("Country_Number_Code", "The Country_Number_Code Is Required").exists(),
    body("Message", "The Message Is Required").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        FirstName,
        LastName,
        Email,
        Number,
        Country_Name,
        Country_Number_Code,
        Message,
      } = req.body;

      await ContactForm.create({
        FirstName,
        LastName,
        Email,
        Number,
        Country_Name,
        Country_Number_Code,
        Message,
      });
      const Name = FirstName + LastName;
      try {
        MailTransport.sendMail({
          from: {
            name: Name,
            address: process.env.EMAIL_ADDRESS_OF_USER,
          },
          to: Email,
          subject: "Thanks for connecting with me",
          html: ThankingMail(Name),
        });
      } catch (error) {
        console.log(
          error,
          "the error occurred while sending the mail to the person who submitted the co"
        );
      }
      try {
        MailTransport.sendMail({
          from: {
            name: Name,
            address: process.env.EMAIL_ADDRESS_OF_USER,
          },
          to: "varunspatelo7@gmail.com",
          subject: "New Connections Occurred",
          html: NewConnectionMail(
            "varun patel",
            Name,
            Email,
            Country_Name,
            Country_Number_Code,
            Number,
            Message
          ),
        });
      } catch (error) {
        console.log(error, "the error occurred while sending the mail");
      }
      success = true;
      return res.status(200).json({
        Name,
        success,
        message: "Your Response is Successfully Sent!",
      });
    } catch (error) {
      success = false;
      console.error(
        error,
        success,
        "the error occurred while saving the viewer`s contact information"
      );
    }
  }
);

module.exports = routes;
