import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    rating_type: {
      type: String,
      enum: ["Fisioterapia", "Optometría", "Psicología"],
      required: true,
    },
    observations: {
      type: String,
    },
    diagnostic: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    attendee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Beneficiary",
    },
    suggested_items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
  },
  { timestamps: true }
);
const mongoosePaginate = require("mongoose-paginate-v2");
ratingSchema.plugin(mongoosePaginate);
const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;
