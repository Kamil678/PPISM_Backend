const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const graphicAssemblyPlanSchema = new Schema(
  {
    teams: {
      type: Array,
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assemblyStructureId: {
      type: Schema.Types.ObjectId,
      ref: "AssemblyStructure",
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: {},
  }
);

module.exports = mongoose.model("GraphicAssemblyPlan", graphicAssemblyPlanSchema);
