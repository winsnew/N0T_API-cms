import mongoose from "mongoose";

const teamScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    Images: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true,
    },
    stackImages: [
      {
        src: String,
        alt: String,
      },
    ],
  },
  { timestamps: true }
);

const TeamProfile = mongoose.model("TeamProfile", teamScheme);

export default TeamProfile;
