import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  node_id: { type: String, required: false },
  project_url: { type: String, required: false },
  content_type: { type: String, required: false },
  created_at: { type: String, required: false },
  updated_at: { type: String, required: false },
  archived_at: { type: String, required: false },
  item_url: { type: String, required: false },
  votes: { type: Array },
  show_votes: { type: Boolean, default: false },
});

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;
