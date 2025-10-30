import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    destination: { type: String, required: true },
    country: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
