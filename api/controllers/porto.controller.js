import PortoModel from "../models/porto.model";

export const getAllPorto = async (req, res) => {
  try {
    const portfolio = await PortoModel.find();
    res.status(200).json(portfolio);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


export const createPortfolio = async (req, res) => {
  try {
    const { name, technology, description } = req.body;
    const portofolioImageUrl = req.files["Images"]
      ? `/uploads/${req.files["Images"][0].filename}`
      : "";
    const newPortfolio = new PortoModel({
        name,
        Images: portofolioImageUrl,
        technology,
        description
    })
    const savePortfolio = newPortfolio.save();
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

export const updatePortfolio = async(req,res) => {
    try {
        const {id} = req.params;
        const {name, technology, description} = req.body;
    } catch (error) {
        res.status(500).json({ message: "Error updating team member", error: error.message });
    }
}
