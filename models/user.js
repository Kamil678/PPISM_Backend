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
    assemblyStructures: [
      {
        type: Schema.Types.ObjectId,
        ref: "AssemblyStructure",
      },
    ],
  },
  {
    timestamps: {},
  }
);

module.exports = mongoose.model("User", userSchema);
