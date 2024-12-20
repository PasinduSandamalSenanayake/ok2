const express = require("express");
const User = require("../models/User");

const router = express.Router();

// User Registration
router.post("/", async (req, res) => {
  const { username, seatCount, price1, price2, price3 } = req.body;

  if (!username) {
    return res.status(400).send("Username is required and must be unique.");
  }

  try {
    const seatArray = Array.from({ length: seatCount }, (_, i) => ({
      [i + 1]: "available",
    }));

    const newUser = new User({
      username,
      seatCount,
      seatArray,
      price1,
      price2,
      price3,
    });
    await newUser.save();
    res.status(201).send(newUser);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .send("Username already exists. Please choose a different one.");
    }
    res.status(400).send(err.message);
  }
});

// update user
router.put("/:id", async (req, res) => {
  try {
    const { username, seatCount, seatArray, price1, price2, price3 } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, seatCount, seatArray, price1, price2, price3 },
      { new: true }
    );
    res.send(updatedUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update Seat Availability
// Update Seat Availability with Validation for Already Booked Seats
router.put("/:userId/bookedSeats", async (req, res) => {
  const { bookedSeatNumber } = req.body;
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Find seats that are already booked
    const alreadyBookedSeats = [];
    bookedSeatNumber.forEach((seatNum) => {
      const seatStatus = user.seatArray[seatNum - 1];
      if (seatStatus && seatStatus[seatNum] === "booked") {
        alreadyBookedSeats.push(seatNum);
      }
    });

    // If there are any already booked seats, return an error
    if (alreadyBookedSeats.length > 0) {
      return res
        .status(400)
        .send(`Seats ${alreadyBookedSeats.join(", ")} are already booked.`);
    }

    // Otherwise, update seat status to 'booked'
    bookedSeatNumber.forEach((seatNum) => {
      user.seatArray[seatNum - 1] = { [seatNum]: "booked" };
    });

    await user.save();
    res.status(200).send("Seat status updated successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get All Users (Admin only)
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get User by ID (Admin only)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
