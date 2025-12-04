import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  name: { type: String, required: true, default: "" },
  query: { type: String, required: true },
  isActive: { type: Boolean, default: false },
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
