import mongoose from "mongoose";

const effortValue = new mongoose.Schema({
  value: { type: Number, required: true},
  text: {type: String}
});

const effortModule = new mongoose.Schema({
  text: { type: String, required: true },
  value: { type: String, required: true, unique:true },
  tooltip: { type: String },
  points: [effortValue],
});

const EffortModule = mongoose.model("EffortModule", effortModule);

export default EffortModule;

