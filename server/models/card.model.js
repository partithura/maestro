import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  value: { type:{}, required: true, unique: true },
  minimumValue: { type: Number, default: 0 },
  maximumValue: { type: Number, default: 0 },
  tooltip: { type: String, required: true },
  color: { type: String, default: "#FFFFFF" },
});

const Card = mongoose.model("Card", cardSchema);

export default Card;
