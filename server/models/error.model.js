import mongoose from "mongoose";

const ErrorLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  apiEndpoint: { type: String, required: true },
  gitEndpoint: { type: String, required: true },
  method: { type: String, required: true },
  username: { type: String },
  requestBody: { type: Object },
  responseStatus: { type: Number },
  errorMessage: { type: String, required: true },
  errorDetails: { type: Object },
});

const ErrorLog = mongoose.model("ErrorLog", ErrorLogSchema);
export default ErrorLog
