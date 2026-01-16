import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    number: { type: Number, required: true },
    title: { type: String, required: true },
    id: { type: String },
    organization: { type: String },
    query: { type: String, default: "" },
    color: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    config: {
        cardDeck: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
        modules: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "EffortModule",
            },
        ],
        areas: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "EffortArea",
            },
        ],
        dificultyFieldId: { type: String },
    },
});

projectSchema.pre("find", function () {
    this.populate("config.cardDeck", { __v: 0 })
        .populate("config.areas", { __v: 0 })
        .populate("config.modules", { __v: 0 });
});

projectSchema.pre("findOne", function () {
    this.populate("config.cardDeck", { __v: 0 })
        .populate("config.areas", { __v: 0 })
        .populate("config.modules", { __v: 0 });
});
const Project = mongoose.model("Project", projectSchema);

export default Project;
