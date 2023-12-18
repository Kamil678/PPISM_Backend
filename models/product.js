const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    numberFromAssemblyDraw: {
      type: Number,
      required: true,
    },
    imageProduct: {
      type: String,
      required: false,
    },
    seriesSize: {
      type: Number,
      required: true,
    },
    yearlyProductionProgram: {
      type: Number,
      required: true,
    },
    DpT: {
      type: Number,
      required: true,
    },
    IZ: {
      type: Number,
      required: true,
    },
    TnZ: {
      type: Number,
      required: true,
    },
    TnP: {
      type: Number,
      required: true,
    },
    DpR: {
      type: Number,
      required: true,
    },
    Fd: {
      type: Number,
      required: true,
    },
    Fe: {
      type: Number,
      required: true,
    },
    p: {
      type: Number,
      required: true,
    },
    TTh: {
      type: Number,
      required: true,
    },
    TTm: {
      type: Number,
      required: true,
    },
    TTs: {
      type: Number,
      required: true,
    },
    Pdz: {
      type: Number,
      required: true,
    },
    Pzm: {
      type: Number,
      required: true,
    },
    parts: {
      type: Array,
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    // owner: {
    //   type: Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
  },
  {
    timestamps: {},
  }
);

module.exports = mongoose.model("Product", productSchema);
