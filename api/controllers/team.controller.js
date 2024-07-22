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
    const { name, title, description } = req.body;

    // Handle profile image upload
    const profileImageUrl = req.files["Images"] && req.files["Images"].length > 0
      ? `/uploads/team/${req.files["Images"][0].filename}`
      : "";
    const stackImagesUrls = req.files["stackImages"] && req.files["stackImages"].length > 0
      ? req.files["stackImages"].map((file) => ({
          src: `/uploads/team/${file.filename}`,
          alt: file.originalname,
        }))
      : [];

    
    console.log('Profile Image:', profileImageUrl);
    console.log('Stack Images:', stackImagesUrls);

    
    const newTeamMember = new TeamProfile({
      name,
      Images: profileImageUrl,
      title,
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
    const { id } = req.params;
    const { name, title, description } = req.body;

    const profileImageUrl = req.file
      ? `../public/uploads/team/${req.file.filename}`
      : undefined;
    const stackImagesUrls = req.files
      ? req.files.map((file) => ({
          src: `../public/uploads/team/${file.filename}`,
          alt: file.originalname,
        }))
      : undefined;

    const updatedData = {
      name,
      title,
      description,
      ...(profileImageUrl && { Images: profileImageUrl }),
      ...(stackImagesUrls && { stackImages: stackImagesUrls }),
    };

    const updatedProfile = await TeamProfile.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    res.status(200).json(updatedProfile);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating team member", error: error.message });
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
    // Tangani kesalahan
    console.error('Error deleting profile:', error);
    res.status(500).json({ message: "Error deleting profile", error: error.message });
  }
};
