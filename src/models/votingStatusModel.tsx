import mongoose from "mongoose";

const VotingStatusSchema = new mongoose.Schema({
  votingEnabled: { type: Boolean, default: true },
});

const VotingStatus =
  mongoose.models.votingstatus ||
  mongoose.model("votingstatus", VotingStatusSchema);

export default VotingStatus;
