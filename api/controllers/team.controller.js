import TeamProfile from "../models/team.model.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllTeam = async (req, res) => {
  try {
    const profiles = await TeamProfile.find();
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfileById = async (req, res) => {
  try {
    const profile = await TeamProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: "Profile Not Found" });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProfile = async (req, res) => {
  try {
    const { name, title, detail, description } = req.body;
    const profileImageUrl = req.files["Images"] && req.files["Images"].length > 0
      ? `/uploads/team/${req.files["Images"][0].filename}`
      : "";
    const stackImagesUrls = req.files["stackImages"] && req.files["stackImages"].length > 0
      ? req.files["stackImages"].map((file) => ({
        src: `/uploads/team/${file.filename}`,
        alt: file.originalname,
      }))
      : [];

    const newTeamMember = new TeamProfile({
      name,
      Images: profileImageUrl,
      title,
      detail,
      description,
      stackImages: stackImagesUrls,
    });


    const savedTeamMember = await newTeamMember.save();


    res.status(201).json({
      message: "Team member created successfully",
      data: savedTeamMember,
    });
  } catch (error) {

    console.error('Error creating team member:', error);
    res.status(500).json({
      message: "Error creating team member",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, title, detail, description } = req.body;
    const {id} = req.params;

    const existProfile = await TeamProfile.findById(id);
    if (!existProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (existProfile.Images && req.files["Images"] && req.files["Images"].length > 0) {
      const oldProfileImagePath = path.resolve(__dirname, '../public/uploads/team', existProfile.Images.split('/uploads/team/')[1]);
      if (fs.existsSync(oldProfileImagePath)) {
        fs.unlinkSync(oldProfileImagePath);
      }
    }

    if (existProfile.stackImages && req.files["stackImages"] && req.files["stackImages"].length > 0) {
      existProfile.stackImages.forEach((stackImage) => {
        const oldStackImagePath = path.resolve(__dirname, '../public/uploads/team', stackImage.src.split('/uploads/team/')[1]);
        if (fs.existsSync(oldStackImagePath)) {
          fs.unlinkSync(oldStackImagePath);
        }
      });
    }

    const profileImageUrl = req.files["Images"] && req.files["Images"].length > 0
      ? `/uploads/team/${req.files["Images"][0].filename}`
      : existProfile.Images;

    const stackImagesUrls = req.files["stackImages"] && req.files["stackImages"].length > 0
      ? req.files["stackImages"].map((file) => ({
        src: `/uploads/team/${file.filename}`,
        alt: file.originalname,
      }))
      : existProfile.stackImages;

    const updatedProfileData = {
      name: name || existProfile.name,
      Images: profileImageUrl,
      title: title || existProfile.title,
      detail: detail || existProfile.detail,
      description: description || existProfile.description,
      stackImages: stackImagesUrls,
    };

    const updatedProfile = await TeamProfile.findByIdAndUpdate(id, updatedProfileData, { new: true });

    res.status(200).json({
      message: "Team member updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({
      message: "Error updating team member",
      error: error.message,
    });
  }
};

export const deleteProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const profile = await TeamProfile.findById(id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.Images) {
      const profileImagePath = path.resolve(__dirname, '../public/uploads/team', profile.Images.split('/uploads/team/')[1]);
      if (fs.existsSync(profileImagePath)) {
        fs.unlink(profileImagePath, (err) => {
          if (err) console.error('Failed to delete profile image:', err);
        });
      } else {
        console.warn('Profile image not found:', profileImagePath);
      }
    }

    if (profile.stackImages && profile.stackImages.length > 0) {
      profile.stackImages.forEach((stackImage) => {
        const stackImagePath = path.resolve(__dirname, '../public/uploads/team', stackImage.src.split('/uploads/team/')[1]);
        if (fs.existsSync(stackImagePath)) {
          fs.unlink(stackImagePath, (err) => {
            if (err) console.error('Failed to delete stack image:', err);
          });
        } else {
          console.warn('Stack image not found:', stackImagePath);
        }
      });
    }

    await TeamProfile.findByIdAndDelete(id);
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ message: "Error deleting profile", error: error.message });
  }
};
