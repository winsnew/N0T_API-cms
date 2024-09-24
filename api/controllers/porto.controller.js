import PortoModel from "../models/porto.model.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllPorto = async (req, res) => {
  try {
    const portfolio = await PortoModel.find();
    res.status(200).json(portfolio);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPortoById = async (req, res) => {
  try {
    const porto = await PortoModel.findById(req.params.id);
    if (!porto) {
      return res.status(404).json({ message: "Portfolio Not Found" });
    }
    res.status(200).json(porto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createPortfolio = async (req, res) => {
  try {
    const { name, category, technology, description } = req.body;
    const portfolioImageUrl = req.files["Images"] && req.files["Images"].length > 0
    ? `/uploads/porto/${req.files["Images"][0].filename}` 
    : "";
    const newPortfolio = new PortoModel({
        name,
        category,
        technology,
        Images: portfolioImageUrl,
        description
    })
    const savePortfolio = await newPortfolio.save();
    res.status(201).json({
        message: "Portfolio Has Added",
        data: savePortfolio,
    })
  } catch (error) {
    res.status(500).json({
      message: "Error creating team member",
      error: error.message,
    });
  }
};

export const updatePortfolio = async (req,res) => {
    try {
        const {id} = req.params;
        const {name, category, technology, description} = req.body;

        const existPorto = await PortoModel.findById(id)
        if(!existPorto) {
          return res.status(404).json({ message: "Porto not found" });
        }

        if(existPorto.Images && req.files["Images"] && req.files["Images"].length > 0) {
          const oldPortoFile = path.resolve(__dirname, '../public/uploads/porto', existPorto.Images.split('/uploads/porto/')[1]);
          if(fs.existsSync(oldPortoFile)){
            fs.unlinkSync(oldPortoFile);
          }
        }

        const portoImageUrl = req.files["Images"] && req.files["Images"].length > 0
        ? `/uploads/porto/${req.files["Images"][0].filename}`
        : existPorto.Images;

        const updatedPortoData = {
          name: name || existPorto.name,
          Images: portoImageUrl,
          category: category || existPorto.category,
          technology: technology || existPorto.technology,
          description: description || existPorto.description,
        }

        const updatedPorto = await PortoModel.findByIdAndUpdate(id, updatedPortoData, {new: true});

        res.status(200).json({
          message: "Porto updated successfully",
          data: updatedPorto
        })
    } catch (error) {
        res.status(500).json({ message: "Error updating team member", error: error.message });
    }
}


export const deletePorto = async (req, res) => {
  const { id } = req.params;

  try {
    const porto = await PortoModel.findById(id);

    if (!porto) {
      return res.status(404).json({ message: "porto not found" });
    }

    if (porto.Images) {
      const portoImagePath = path.resolve(__dirname, '../public/uploads/porto', porto.Images.split('/uploads/porto/')[1]);
      if (fs.existsSync(portoImagePath)) {
        fs.unlink(portoImagePath, (err) => {
          if (err) console.error('Failed to delete profile image:', err);
        });
      } else {
        console.warn('Profile image not found:', portoImagePath);
      }
    }

    await PortoModel.findByIdAndDelete(id);
    res.status(200).json({ message: "porto deleted successfully" });
  } catch (error) {
    console.error('Error deleting porto:', error);
    res.status(500).json({ message: "Error deleting porto", error: error.message });
  }
};