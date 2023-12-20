const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    role: {
      type: Object,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    assemblyStructures: [
      {
        type: Schema.Types.ObjectId,
        ref: "AssemblyStructure",
      },
    ],
    graphicAssemblyPlans: [
      {
        type: Schema.Types.ObjectId,
        ref: "GraphicAssemblyPlan",
      },
    ],
    technologicalDocumentations: [
      {
        type: Schema.Types.ObjectId,
        ref: "TechnologicalDocumentations",
      },
    ],
  },
  {
    timestamps: {},
  }
);

module.exports = mongoose.model("User", userSchema);
