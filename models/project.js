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
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: false,
    },
    assemblyStructure: {
      type: Schema.Types.ObjectId,
      ref: "AssemblyStructure",
      required: false,
    },
    graphicAssemblyPlan: {
      type: Schema.Types.ObjectId,
      ref: "GraphicAssemblyPlan",
      required: false,
    },
    technologicalDocumentations: {
      type: Schema.Types.ObjectId,
      ref: "TechnologicalDocumentations",
      required: false,
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
