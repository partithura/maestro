import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: false },
    body: { type: String, required: false },
    repository: { type: String, required: false },
    dificulty: { type: String, required: false },
    number: { type: String, required: false },
    project_url: { type: String, required: false },
    content_type: { type: String, required: false },
    created_at: { type: String, required: false },
    updated_at: { type: String, required: false },
    archived_at: { type: String, required: false },
    item_url: { type: String, required: false },
    votes: { type: Array, default: [] },
    show_votes: { type: Boolean, default: false },
    done: { type: Boolean, default: false },
});

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;
