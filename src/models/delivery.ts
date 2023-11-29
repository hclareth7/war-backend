import mongoose from "mongoose";
import { getTunnedDocument, getTunnedDocument2 } from "../helpers/modelUtilities";
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

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
    itemList: [
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
    status: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

deliverySchema.plugin(mongoosePaginate);
deliverySchema.plugin(aggregatePaginate);
const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;
