import mongoose from "mongoose";

const effortArea = new mongoose.Schema({
  text: { type: String, required: true },
  value: { type: String, required: true, unique:true },
});

const EffortArea = mongoose.model("EffortArea", effortArea);

export default EffortArea;

