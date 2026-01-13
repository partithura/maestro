import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
    name: { type: String },
    id: { type: String },
});

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
