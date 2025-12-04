import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  login: { type: String, required: true },
  name: { type: String },
  prefs: {
    items_per_page_option: { type: Number },
    only_filtered_items: { type: Boolean },
  },
});

const User = mongoose.model("User", userSchema);

export default User;
