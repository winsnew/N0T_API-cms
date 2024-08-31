import mongoose from "mongoose";

const portoScheme = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        technology: {
            type: String,
            required: true
        },
        Images: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const PortoModel = mongoose.model("PortoModel", portoScheme);

export default PortoModel;
