import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("blacklistTokens", blacklistTokenSchema);