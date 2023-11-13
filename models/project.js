const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    parts: {
      type: Array,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: Object,
      default: { id: 1, name: "NEW" },
      required: true,
    },
  },
  {
    timestamps: {},
  }
);

module.exports = mongoose.model("Project", projectSchema);
