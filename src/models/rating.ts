import mongoose from "mongoose";
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const ratingSchema = new mongoose.Schema(
  {
    rating_type: {
      type: String,
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

ratingSchema.plugin(mongoosePaginate);
ratingSchema.plugin(aggregatePaginate);
const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;
