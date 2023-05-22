const { Op } = require("sequelize");
const { sequelize } = require("../models");
const db = require("../models");
const Voucher = db.voucher;
const Voucher_type = db.voucher_type;
const Product = db.product;
const Branch = db.branch;

const voucherDiscountController = {
  createVoucherType: async (req, res) => {
    const data = req.body;
    const t = await sequelize.transaction();

    try {
      const voucherData = {
        name: data.name,
      };
      const voucherType = await Voucher_type.create(
        { ...voucherData },
        { transaction: t }
      );
      if (!voucherType) {
        throw new Error("Failed to create");
      }

      await t.commit();
      res.status(201).send("Voucher type created successfully");
    } catch (err) {
      await t.rollback();
      return res.status(400).send(err);
    }
  },

  getVoucherType: async (req, res) => {
    try {
      const data = await Voucher_type.findAll({
        attributes: ["id", "name"],
      });
      return res.status(200).json({
        message: "Voucher Category Data Successfully Fetched",
        result: data,
      });
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  },

  deleteVoucherType: async (req, res) => {
    try {
      const { id } = req.params;

      const voucherType = await Voucher_type.findByPk(id);
      if (!voucherType) {
        return res.status(404).json({
          message: "Voucher type not found",
        });
      }

      await voucherType.destroy();
      return res.status(200).json({
        message: "Voucher Type deleted successfully",
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  },

  createVoucher: async (req, res) => {
    const data = req.body;
    const t = await sequelize.transaction();

    try {
      const voucherType = await Voucher_type.findOne({
        where: {
          id: data.VoucherTypeId,
          deletedAt: null,
        },
      });

      if (!voucherType) {
        throw new Error("Invalid VoucherTypeId");
      }

      const existingVoucher = await Voucher.findOne({
        where: { code: data.code },
      });

      if (existingVoucher) {
        throw new Error("Voucher code already exists");
      }

      const existingVoucherName = await Voucher.findOne({
        where: { name: data.name },
      });

      if (existingVoucherName) {
        throw new Error("Voucher name already exists");
      }

      // Check if both nominal and presentase are provided
      if (data.nominal && data.presentase) {
        throw new Error("Cannot provide both nominal and presentase");
      }

      const voucherData = {
        name: data.name,
        code: data.code,
        expiredDate: data.expiredDate,
        VoucherTypeId: data.VoucherTypeId,
        BranchId: data.BranchId,
      };

      if (data.ProductId) {
        const product = await Product.findOne({
          where: {
            id: data.ProductId,
            deletedAt: null,
          },
        });

        if (!product) {
          throw new Error("Invalid ProductId");
        }

        voucherData.ProductId = data.ProductId;
      }

      if (data.nominal) {
        voucherData.nominal = data.nominal;
      }

      if (data.presentase) {
        voucherData.presentase = data.presentase;
      }

      const voucher = await Voucher.create(
        { ...voucherData },
        { transaction: t }
      );

      if (!voucher) {
        throw new Error("Failed to create");
      }

      await t.commit();

      const voucherTypeText = data.nominal ? "Nominal" : "Percent";
      const productIdText = data.ProductId ? " with ProductId" : "";

      res
        .status(201)
        .send(
          `${voucherTypeText} voucher${productIdText} created successfully`
        );
    } catch (err) {
      await t.rollback();
      return res.status(400).send(err.message);
    }
  },

  getAllVoucher: async (req, res) => {
    const page = parseInt(req.query.page) || 1; // default to page 1 if not provided
    const pageSize = 10;
    const branchId = req.query.BranchId;

    try {
      let whereClause = {
        deletedAt: null, // check if voucher is not deleted
      };

      if (branchId) {
        whereClause.BranchId = branchId; // Filter by BranchId
      }

      const totalCount = await Voucher.count({
        where: whereClause,
      });
      const totalPages = Math.ceil(totalCount / pageSize);

      // Adjust the page number to the last page if it is greater than the total number of pages
      if (page > totalPages) {
        page = totalPages;
      }

      const result = await Voucher.findAll({
        attributes: [
          "id",
          "name",
          "code",
          "expiredDate",
          "nominal",
          "presentase",
          "ProductId",
        ],
        where: whereClause,
        include: [
          {
            model: Voucher_type,
            attributes: ["name"],
            paranoid: false,
          },
          {
            model: Product,
            attributes: ["name"],
            paranoid: false,
          },
        ],
      });

      return res.status(200).json({
        message: "Voucher data successfully fetched",
        result: result.slice((page - 1) * pageSize, page * pageSize), // Only send the data for the requested page
        page: page,
        pageSize: pageSize,
        totalCount: totalCount,
        totalPages: totalPages,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  },

  getVoucher: async (req, res) => {
    const page = parseInt(req.query.page) || 1; // default to page 1 if not provided
    const pageSize = 10;
    const branchId = req.query.BranchId;

    try {
      const totalCount = await Voucher.count({
        where: {
          BranchId: branchId, // Filter by BranchId
          deletedAt: null, // check if voucher is not deleted
        },
      });
      const totalPages = Math.ceil(totalCount / pageSize);

      // Adjust the page number to the last page if it is greater than the total number of pages
      if (page > totalPages) {
        page = totalPages;
      }

      const result = await Voucher.findAll({
        attributes: [
          "id",
          "name",
          "code",
          "expiredDate",
          "nominal",
          "presentase",
          "ProductId",
        ],
        where: {
          BranchId: branchId, // Filter by BranchId
          deletedAt: null, // check if voucher is not deleted
        },
        include: [
          {
            model: Voucher_type,
            attributes: ["name"],
            paranoid: false,
          },
          {
            model: Product,
            attributes: ["name"],
            paranoid: false,
          },
        ],
      });

      return res.status(200).json({
        message: "Voucher data successfully fetched",
        result: result.slice((page - 1) * pageSize, page * pageSize), // Only send the data for the requested page
        page: page,
        pageSize: pageSize,
        totalCount: totalCount,
        totalPages: totalPages,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  },
  getVoucherTransaction: async (req, res) => {
    const branchId = req.query.BranchId;

    try {
      const today = new Date();
      const result = await Voucher.findAll({
        attributes: [
          "id",
          "name",
          "code",
          "expiredDate",
          "nominal",
          "presentase",
          "ProductId",
        ],
        where: {
          [Op.and]: [
            {
              BranchId: branchId,
            }, // Filter by BranchId
            {
              expiredDate: { [Op.gte]: today }, // check if voucher is not deleted
            },
          ],
        },
        include: [
          {
            model: Voucher_type,
            attributes: ["name"],
          },
          {
            model: Product,
            attributes: ["name"],
          },
        ],
      });

      return res.status(200).json({
        message: "Voucher data successfully fetched",
        result: result,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  },
  deleteVoucher: async (req, res) => {
    try {
      const { id } = req.params;

      const voucher = await Voucher.findByPk(id);
      if (!voucher) {
        return res.status(404).json({
          message: "Voucher not found",
        });
      }

      await voucher.destroy();
      return res.status(200).json({
        message: "Voucher deleted successfully",
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  },
  listVoucher: async (req, res) => {
    try {
      const result = await Voucher.findAll();

      res.status(200).json({
        message: "data fetched",
        result: result,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  },
};

module.exports = voucherDiscountController;
