const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const assemblyStructureSchema = new Schema(
  {
    assemblyUnits: {
      type: Array,
      required: true,
    },
    JM1: {
      type: Array,
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  {
    timestamps: {},
  }
);

module.exports = mongoose.model("AssemblyStructure", assemblyStructureSchema);
