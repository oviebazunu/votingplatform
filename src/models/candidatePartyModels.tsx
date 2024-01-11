import mongoose from "mongoose";

const candidatePartySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  party: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    required: true,
  },
  constituency: {
    type: String,
    required: [true, "Please enter one of the constituencies "],
  },
});

const Candidate =
  mongoose.models.Candidate ||
  mongoose.model("Candidate", candidatePartySchema);
export default Candidate;
