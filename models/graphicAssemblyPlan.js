const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const graphicAssemblyPlanSchema = new Schema(
  {
    assemblyUnits: {
      type: Array,
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  {
    timestamps: {},
  }
);

module.exports = mongoose.model("GraphicAssemblyPlan", graphicAssemblyPlanSchema);
