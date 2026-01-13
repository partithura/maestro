import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
    name: { type: String },
    id: { type: String },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
});

organizationSchema.pre("find", function () {
    this.populate("projects", { __v: 0 });
});

organizationSchema.pre("findOne", function () {
    this.populate("projects", { __v: 0 });
});

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
