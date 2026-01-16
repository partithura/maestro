import mongoose from "mongoose";
import bcrypt from "bcrypt";
const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    login: { type: String, required: true },
    name: { type: String },
    token: { type: String, required: true },
    telegramId: { type: Number },
    avatar_url: { type: String },
    isManagement: { type: Boolean, default: false },
    prefs: {
        items_per_page_option: { type: Number },
        only_filtered_items: { type: Boolean },
        hidden_organizations: [],
        hidden_projects: [],
    },
});

userSchema.pre("save", function (next) {
    const user = this;

    // Only hash the token if it has been modified or is new
    if (!user.isModified("token")) return next();

    // Generate a salt and hash the token
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.token, salt, function (err, hash) {
            if (err) return next(err);
            user.token = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.token, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const User = mongoose.model("User", userSchema);

export default User;
