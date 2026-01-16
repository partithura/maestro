import mongoose from "mongoose";
import bcrypt from "bcrypt";
const SALT_WORK_FACTOR = 10;

const organizationSchema = new mongoose.Schema({
    name: { type: String },
    login: { type: String, unique: true },
    id: { type: String },
    avatarUrl: { type: String },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    organizationToken: { type: String },
});

organizationSchema.pre("find", function () {
    this.populate("projects", { __v: 0 });
});

organizationSchema.pre("findOne", function () {
    this.populate("projects", { __v: 0 });
});

organizationSchema.pre("save", function (next) {
    const organization = this;

    // Only hash the organizationToken if it has been modified or is new
    if (!organization.isModified("organizationToken")) return next();

    // Generate a salt and hash the organizationToken
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(organization.organizationToken, salt, function (err, hash) {
            if (err) return next(err);
            organization.organizationToken = hash;
            next();
        });
    });
});

organizationSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(
        candidatePassword,
        this.organizationToken,
        function (err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
        }
    );
};

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
