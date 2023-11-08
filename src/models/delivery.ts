import mongoose from "mongoose";
const mongoosePaginate = require("mongoose-paginate-v2");

const deliverySchema = new mongoose.Schema(
  {
    beneficiary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Beneficiary",
    },
    representant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Representant",
    },
    type: {
      type: String,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    itemsList: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
        },
        amount: {
          type: Number,
        },
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

deliverySchema.plugin(mongoosePaginate);
const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;
