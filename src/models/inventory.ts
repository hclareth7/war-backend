import mongoose from "mongoose";

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
const mongoosePaginate = require("mongoose-paginate-v2");
inventorySchema.plugin(mongoosePaginate);
const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;
