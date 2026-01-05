import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    value: { type: {}, required: true, unique: true },
    tooltip: { type: String },
    color: { type: String, default: "#FFFFFF" },
});

const Card = mongoose.model("Card", cardSchema);

export default Card;
