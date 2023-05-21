const db = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { sequelize } = require("../models");
const jwt = require("jsonwebtoken");
const secret_key = process.env.secret_key;
const opencage = require("opencage-api-client");
const apiKey = process.env.OPENCAGE_API_KEY;

const Admins = db.admin;
const Branch = db.branch;
const Category = db.category;
const Product = db.product;
const Stock = db.stock;
const Voucher_type = db.voucher_type;
const Voucher = db.voucher;

const adminController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await Admins.findOne({
        where: {
          email: {
            [Op.eq]: sequelize.literal(`BINARY '${email}'`),
          },
        },
        raw: true,
      });

      if (!result) {
        return res.status(400).json({
          message: "User not found",
        });
      }
      const isValid = await bcrypt.compare(password, result.password);
      if (!isValid) {
        throw new Error("Incorrect Email / Password");
      }
      let payload = { id: result.id, isSuperAdmin: result.isSuperAdmin };
      const token = jwt.sign(payload, secret_key);
      return res.status(200).json({
        token,
        result: result,
        message: "logged in",
      });
    } catch (error) {
      console.log(error.message);
      return res.status(error.statusCode || 500).send(error.message);
    }
  },

  createAdmin: async (req, res) => {
    const data = req.body;

    const t = await sequelize.transaction();
    try {
      const password = bcrypt.hashSync(data.password, 10);

      const dataAdmin = {
        username: data.username,
        email: data.email,
        password: password,
        isSuperAdmin: false,
        BranchId: data.branches,
      };

      const admin = await Admins.create({ ...dataAdmin }, { transaction: t });
      if (!admin) {
        throw new Error("Failed to create");
      }
      await t.commit();
      res.status(201).send("Create user success");
    } catch (err) {
      console.log(err);
      await t.rollback();
      return res.status(400).send(err);
    }
  },

  getAdmin: async (req, res) => {
    try {
      const result = await Admins.findAll({
        attributes: ["id", "username", "email", "isSuperAdmin", "BranchId"],
        include: {
          model: Branch,
          attributes: ["city", "name"],
        },
      });
      return res.status(200).json({
        message: "admin data fetched",
        result: result,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  },

  getCountAdmin: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await Admins.count({
        where: {
          BranchId: id,
        },
      });
      return res.status(200).json({
        message: "admin data fetched",
        result: result,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  },

  deleteAdmin: async (req, res) => {
    try {
      const { id } = req.params;

      const admin = await Admins.findByPk(id);
      if (!admin) {
        return res.status(404).json({
          message: "Admin not found",
        });
      }

      if (admin.isSuperAdmin) {
        return res.status(400).json({
          message: "Cannot delete super admin",
        });
      }

      await admin.destroy();
      return res.status(200).json({
        message: "Admin deleted successfully",
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  },

  createBranches: async (req, res) => {
    const data = req.body;

    const t = await sequelize.transaction();
    try {
      const dataBranch = {
        name: data.name,
        district: data.district,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
        idCity: data.idCity,
      };
      console.log({ ...dataBranch });
      const branch = await Branch.create({ ...dataBranch }, { transaction: t });
      if (!branch) {
        throw new Error("Failed to create");
      }

      await t.commit();
      res.status(201).send("Create branches success");
    } catch (err) {
      console.log(err);
      await t.rollback();
      return res.status(400).send(err);
    }
  },

  getBranches: async (req, res) => {
    try {
      const result = await Branch.findAll({
        attributes: [
          "id",
          "name",
          "district",
          "city",
          "province",
          "postalCode",
        ],
      });
      return res.status(200).json({
        message: "branch data fetched",
        result: result,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  },

  deleteBranches: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const { id } = req.params;

      const branch = await Branch.findByPk(id, { transaction });
      if (!branch) {
        await transaction.rollback();
        return res.status(404).json({
          message: "Branch not found",
        });
      }

      await branch.destroy({ transaction });

      await transaction.commit();

      return res.status(200).json({
        message: "Branch deleted successfully",
      });
    } catch (err) {
      await transaction.rollback();

      return res.status(400).json({
        message: err.message,
      });
    }
  },

  createCategory: async (req, res) => {
    const data = req.body;
    const t = await sequelize.transaction();

    try {
      const category = await Category.create(
        { name: data.name },
        { transaction: t }
      );
      if (!category) {
        throw new Error("Failed to create");
      }
      await t.commit();
      res.status(201).send("Category created successfully");
    } catch (err) {
      await t.rollback();
      return res.status(400).send(err);
    }
  },

  getCategory: async (req, res) => {
    try {
      const result = await Category.findAll({
        attributes: ["id", "name"],
      });
      return res.status(200).json({
        message: "category data fetched",
        result: result,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  },

  updateCategory: async (req, res) => {
    const data = req.body;
    const { id } = req.params;

    const t = await sequelize.transaction();
    try {
      const category = await Category.findOne({ where: { id: id } });
      if (!category) {
        throw new Error("Category not found");
      }
      const updatedCategory = await category.update(
        { name: data.name },
        { transaction: t }
      );
      if (!updatedCategory) {
        throw new Error("Failed to update");
      }
      await t.commit();
      res.status(200).send("Update category success");
    } catch (err) {
      console.log(err);
      await t.rollback();
      return res.status(400).send(err.message);
    }
  },

  deleteCategory: async (req, res) => {
    const { id } = req.params;

    const t = await sequelize.transaction();
    try {
      const category = await Category.findOne({ where: { id: id } });
      if (!category) {
        throw new Error("Category not found");
      }
      await category.destroy({ transaction: t });
      await t.commit();
      res.status(200).send("Delete category success");
    } catch (err) {
      console.log(err);
      await t.rollback();
      return res.status(400).send(err.message);
    }
  },

  updateStock: async (req, res) => {
    const data = req.body;
    const { id } = req.params;

    const t = await sequelize.transaction();
    try {
      const stock = await Stock.findOne({ where: { id: id } });
      if (!stock) {
        throw new Error("Stock not found");
      }
      const updatedStock = await stock.update(
        { qty: data.qty },
        { transaction: t }
      );
      if (!updatedStock) {
        throw new Error("update stock failed");
      }
      await t.commit();
      res.status(200).send("Update stock success");
    } catch (err) {
      await t.rollback();
      return res.status(400).send(err.message);
    }
  },

  getBranchById: async (req, res) => {
    try {
      const branch = await Branch.findOne({
        where: { id: req.params.id },
        attributes: [
          "id",
          "name",
          "district",
          "city",
          "province",
          "postalCode",
        ],
      });
      if (!branch) {
        return res.status(404).json({
          message: "Branch not found",
        });
      }
      return res.status(200).json({
        message: "Branch data fetched",
        result: branch,
      });
    } catch (err) {
      return res.status(400).json({
        message: err,
      });
    }
  },

  getBranchesLatLng: async (req, res) => {
    try {
      const branches = await Branch.findAll({
        attributes: [
          "id",
          "name",
          "district",
          "city",
          "province",
          "postalCode",
        ],
      });

      const promises = branches.map(async (branch) => {
        const { city, province } = branch;
        const query = `${city}, ${province}`;
        console.log("Query:", query);
        const response = await opencage.geocode({ q: query });
        console.log("Response:", response);
        const { geometry } = response.results[0];
        const { lat, lng } = geometry;
        const coordinate = [lat, lng]; // modified here to be an array
        return { ...branch.dataValues, coordinate };
      });

      const result = await Promise.all(promises);

      return res.status(200).json({
        message: "Branch data fetched",
        result,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  },
};

module.exports = adminController;
