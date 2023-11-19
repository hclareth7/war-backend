import mongoose from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const inventorySchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      default: function () {
        const _t = this as any;
        return _t.amount || 0;
      },
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    winerie:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Winerie",
    },
  },
  { timestamps: true }
);
inventorySchema.plugin(mongoosePaginate);
inventorySchema.plugin(aggregatePaginate);
const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;
