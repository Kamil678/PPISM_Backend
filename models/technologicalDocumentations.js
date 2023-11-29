const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const actionSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  generalOperationNumber: {
    type: Number,
    required: false,
  },
  action: {
    type: Number,
    required: true,
  },
  actionType: {
    type: String,
    required: true,
  },
  actionContent: {
    type: String,
    required: true,
  },
  assemblyTool: {
    type: String,
    required: false,
  },
  parameters: {
    type: String,
    required: false,
  },
  tg: {
    type: Number,
    required: true,
  },
  tp: {
    type: Number,
    required: true,
  },
});

const procedureSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  generalNumber: {
    type: Number,
    required: false,
  },
  number: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  actions: {
    type: [actionSchema],
    required: false,
  },
});

const operationSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  operationNumber: {
    type: Number,
    required: true,
  },
  operationContent: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  positionSymbol: {
    type: String,
    required: true,
  },
  tpz: {
    type: Number,
    required: true,
  },
  tj: {
    type: Number,
    required: true,
  },
  Nt: {
    type: Number,
    required: true,
  },
  procedures: {
    type: [procedureSchema],
    required: false,
  },
});

const technologicalDocumentationsSchema = new Schema(
  {
    operations: {
      type: [operationSchema],
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

module.exports = mongoose.model("TechnologicalDocumentations", technologicalDocumentationsSchema);
