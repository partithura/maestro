import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    number: { type: Number, required: true },
    name: { type: String, required: true, default: "" },
    query: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    config: {
        cardDeck: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
        modules: [
            { type: mongoose.Schema.Types.ObjectId, ref: "EffortModule" },
        ],
        areas: [{ type: mongoose.Schema.Types.ObjectId, ref: "EffortArea" }],
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
