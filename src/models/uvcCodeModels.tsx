import mongoose from "mongoose";

const uvcCodeSchema = new mongoose.Schema({
  uvcCode: {
    type: String,
    unique: true,
  },
});

const UVCCode =
  mongoose.models.uvcCode || mongoose.model("uvcCode", uvcCodeSchema);

export default UVCCode;
