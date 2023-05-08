const { Op, Sequelize } = require("sequelize");
const { sequelize } = require("../models");
const db = require("../models");
const Transaction_header = db.transaction_header;
const Transaction_item = db.transaction_item;
const Branch = db.branch;
const User = db.user;
const User_detail = db.user_detail;
const Address = db.address;
const moment = require("moment");
const Category = db.category;
const Product = db.product;
const Cart = db.cart;
const Record_stock = db.record_stock;

const transactionController = {
  getCountTransactionByBranch: async (req, res) => {
    try {
      const id = req.params.id;
      const filterTransaction = await Transaction_header.count({
        where: {
          BranchId: id,
        },
      });

      res.status(200).json({
        message: "count transaction berdasarkan branch",
        result: filterTransaction,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  },
  getCountTransaction: async (req, res) => {
    try {
      const id = req.params.id;
      const filterTransaction = await Transaction_header.count();

      res.status(200).json({
        message: "count transaction",
        result: filterTransaction,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  },
  getIncomeTransactionByBranch: async (req, res) => {
    try {
      const id = req.params.id;
      const filterTransaction = await Transaction_header.findAll({
        attributes: [
          [sequelize.fn("sum", sequelize.col("grandPrice")), "income"],
        ],
        where: {
          BranchId: id,
        },
      });

      res.status(200).json({
        message: "sum transaction berdasarkan branch",
        result: filterTransaction,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  },
  getData: async (req, res) => {
    try {
      const dataTransaction = await Transaction_header.findAll();

      res.status(200).json({
        message: "datafetch",
        result: dataTransaction,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  },
  getTransactionDetail: async (req, res) => {
    try {
      const id = req.params.id;
      const dataTransaction = await Transaction_header.findAll({
        attributes: [
          "noTrans",
          "createdAt",
          // [
          //   (sequelize.fn(
          //     "DATE_FORMAT",
          //     sequelize.col("createdAt"),
          //     "%d-%m-%Y %H:%i:%s"
          //   ),
          //   "DATE"),
          // ],
          [sequelize.fn("sum", sequelize.col("grandPrice")), "income"],
        ],
        include: [
          {
            model: Branch,
            attributes: ["name"],
          },
        ],
        where: {
          BranchId: id,
        },
        group: ["createdAt"],
      });

      res.status(200).json({
        message: "datafetch",
        result: dataTransaction,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  },
  addTranscation: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      // const tgl = moment().format("YYYYMMDD");
      // const countHeader = await Transaction_header.count();
      // const noTrans = `TRS-${tgl}000${countHeader + 1}`;
      const { grandPrice, BranchId, totalWeight, noTrans } = req.body;
      const UserId = req.params.id;

      const addHeader = await Transaction_header.create(
        {
          noTrans: noTrans,
          grandPrice: grandPrice,
          BranchId: BranchId,
          UserId: UserId,
          totalWeight: totalWeight,
        },
        { transaction: t }
      );
      const noTransl = JSON.stringify(noTrans);
      const id = addHeader.dataValues.id;
      // const filterCart = await Cart.findAll({
      //   where: {
      //     UserId: UserId,
      //   },
      // });
      const orderlist = JSON.parse(req.body.orderList);
      const arrItem = [];
      orderlist.map(async (val) => {
        let obj = {
          qty: val.qty,
          ProductId: val.ProductId,
          TransactionHeaderId: id,
        };
        console.log(obj);
        arrItem.push(obj);
        const product = await Product.findByPk(val.ProductId, {
          transaction: t,
        });
        // await Record_stock.create(
        //   {
        //     stockBefore: product.dataValues.stock,
        //     stockAfter: product.dataValues.stock - val.qty,
        //     desc: "pengurangan stock transaction",
        //     TypeStockId: 1,
        //     ProductId: val.ProductId,
        //   },
        //   { transaction: t }
        // );
        // if (product.stock < val.qty) {
        //   throw new Error("stocknya kurang");
        // }
        await Product.update(
          { stock: product.dataValues.stock - val.qty },
          {
            where: {
              id: product.dataValues.id,
            },
          },
          { transaction: t }
        );
      });

      console.log(arrItem);

      await Transaction_item.bulkCreate(
        arrItem,

        { transaction: t }
      );

      const deletecart = await Cart.destroy(
        { where: { UserId: UserId } },
        { transaction: t }
      );
      if (!deletecart) {
        throw new Error("Delete cart failed");
      }

      await t.commit();

      res.status(200).json({
        message: "transaction successfull",
      });
    } catch (error) {
      console.log(error);
      await t.rollback();

      res.status(400).json({
        message: error,
      });
    }
  },
  uploadFoto: async (req, res) => {
    try {
      const noTrans = req.params.noTrans;

      const data = {};

      if (req.file) {
        console.log(req.file);
        data.imgUpload = process.env.upload + req.file.filename;
      }
      console.log(data);

      const result = await Transaction_header.update(
        {
          ...data,
        },
        {
          where: {
            noTrans: noTrans,
          },
        }
      );

      return res.status(200).json({
        message: "upload foto success",
        result: result,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.toString(),
      });
    }
  },
  getSuperAdminDataByProduct: async (req, res) => {
    try {
      const startDate = req.query.startDate;
      const endDate = req.query.endDate;
      const sortOrder = req.query.sortOrder;
      const sortSales = req.query.sortSales;

      let order = [];
      if (sortOrder && sortSales) {
        throw new Error("Can't use both sortOrder and sortSales at the same time");
      } else if (sortOrder) {
        order = [['createdAt', sortOrder]];
      } else if (sortSales) {
        order = [[Sequelize.literal('totalSales'), sortSales.toUpperCase()]];
      }

      const data = await Transaction_item.findAll({
        attributes: [
          'ProductId',
          'createdAt',
          [Sequelize.literal('SUM(qty)'), 'totalQty'],
          [Sequelize.literal('Product.price * SUM(qty)'), 'totalSales']
        ],
        include: [
          {
            model: Product,
            attributes: ['name', 'imgProduct', 'price'],
            include: [
              {
                model: Branch,
                attributes: ['city']
              }
            ]
          },
          {
            model: Transaction_header,
            attributes: [],
            where: {
              createdAt: {
                [Op.between]: [startDate, endDate]
              }
            }
          }
        ],
        group: ['ProductId', 'createdAt'],
        order: order
      });

      res.status(200).json({
        message: "Sales data by product",
        result: data,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  },
  getBranchAdminDataByProduct: async (req, res) => {
    try {
      const startDate = req.query.startDate;
      const endDate = req.query.endDate;
      const sortOrder = req.query.sortOrder;
      const sortSales = req.query.sortSales;
      const branchId = req.query.branchId;

      let order = [];
      if (sortOrder && sortSales) {
        throw new Error("Can't use both sortOrder and sortSales at the same time");
      } else if (sortOrder) {
        order = [['createdAt', sortOrder]];
      } else if (sortSales) {
        order = [[Sequelize.literal('totalSales'), sortSales.toUpperCase()]];
      }

      const data = await Transaction_item.findAll({
        attributes: [
          'ProductId',
          'createdAt',
          [Sequelize.literal('SUM(qty)'), 'totalQty'],
          [Sequelize.literal('Product.price * SUM(qty)'), 'totalSales']
        ],
        include: [
          {
            model: Product,
            attributes: ['name', 'imgProduct', 'price'],
            include: [
              {
                model: Branch,
                attributes: ['city'],
              }
            ]
          },
          {
            model: Transaction_header,
            attributes: [],
            where: {
              BranchId: branchId,
              createdAt: {
                [Op.between]: [startDate, endDate]
              }
            }
          }
        ],
        group: ['ProductId', 'createdAt'],
        order: order
      });

      res.status(200).json({
        message: "Sales data by product for branch " + branchId,
        result: data,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  },
  getSuperAdminDataByTransaction: async (req, res) => {
    try {
      const startDate = req.query.startDate;
      const endDate = req.query.endDate;
      const sortOrder = req.query.sortOrder;
      const sortSales = req.query.sortSales;

      let order = [];
      if (sortOrder && sortSales) {
        throw new Error("Can't use both sortOrder and sortSales at the same time");
      } else if (sortOrder) {
        order = [['createdAt', sortOrder]];
      } else if (sortSales) {
        order = [['grandPrice', sortSales.toUpperCase()]];
      }

      const data = await Transaction_header.findAll({
        attributes: [
          'noTrans',
          'grandPrice',
          'createdAt',
          'imgUpload',
          [Sequelize.literal('Branch.name'), 'branchName'],
          [Sequelize.literal('User.username'), 'userName']
        ],
        include: [
          {
            model: Branch,
            attributes: []
          },
          {
            model: User,
            attributes: []
          }
        ],
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        },
        order: order
      });

      res.status(200).json({
        message: "Transaction data",
        result: data,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  },
  getBranchAdminDataByTransaction: async (req, res) => {
    try {
      const startDate = req.query.startDate;
      const endDate = req.query.endDate;
      const sortOrder = req.query.sortOrder;
      const sortSales = req.query.sortSales;
      const branchId = req.query.branchId;

      let order = [];
      if (sortOrder && sortSales) {
        throw new Error("Can't use both sortOrder and sortSales at the same time");
      } else if (sortOrder) {
        order = [['createdAt', sortOrder]];
      } else if (sortSales) {
        order = [['grandPrice', sortSales.toUpperCase()]];
      }

      const data = await Transaction_header.findAll({
        attributes: [
          'noTrans',
          'grandPrice',
          'createdAt',
          'imgUpload',
          [Sequelize.literal('Branch.name'), 'branchName'],
          [Sequelize.literal('User.username'), 'userName']
        ],
        include: [
          {
            model: Branch,
            attributes: [],
            where: {
              id: branchId
            }
          },
          {
            model: User,
            attributes: []
          }
        ],
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        },
        order: order
      });

      res.status(200).json({
        message: "Transaction data",
        result: data,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  },
  getAllUserTransactionData: async (req, res) => {
    try {
      const grandTotal = req.query.grandTotal;

      const data = await Transaction_header.findAll({
        attributes: [
          [Sequelize.literal('User.username'), 'userName'],
          [Sequelize.fn('SUM', Sequelize.col('grandPrice')), 'totalGrandPrice'],
          [Sequelize.literal('Branch.name'), 'branchName']
        ],
        include: [
          {
            model: User,
            attributes: []
          },
          {
            model: Branch,
            attributes: []
          }
        ],
        group: ['userName', 'branchName'],
        order: [['totalGrandPrice', grandTotal]]
      });

      res.status(200).json({
        message: "Total Grand Price data for each user",
        result: data,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  },
  getBranchUserTransactionData: async (req, res) => {
    try {
      const branchId = req.query.branchId;
      const grandTotal = req.query.grandTotal;

      const data = await Transaction_header.findAll({
        attributes: [
          [Sequelize.literal('User.username'), 'userName'],
          [Sequelize.fn('SUM', Sequelize.col('grandPrice')), 'totalGrandPrice'],
          [Sequelize.literal('Branch.name'), 'branchName']
        ],
        include: [
          {
            model: User,
            attributes: []
          },
          {
            model: Branch,
            attributes: []
          }
        ],
        where: {
          branchId: branchId
        },
        group: ['userName', 'branchName'],
        order: [['totalGrandPrice', grandTotal]]
      });

      res.status(200).json({
        message: "Total Grand Price data for each user in a branch",
        result: data,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  },
  adminCancelTransaction: async (req, res) => {
    try {
      const transactionHeaderId = req.params.id;

      const transactionItems = await Transaction_item.findAll({
        where: {
          TransactionHeaderId: transactionHeaderId,
        },
        include: {
          model: Product,
        },
      });

      await Promise.all(
        transactionItems.map(async (item) => {
          const product = item.Product;
          const qtyToAdd = item.qty;

          await Product.update(
            { stock: product.stock + qtyToAdd },
            { where: { id: product.id } }
          );
        })
      );

      const updatedTransactionHeader = await Transaction_header.update(
        {
          TransactionStatusId: 5,
        },
        {
          where: {
            id: transactionHeaderId,
          },
        }
      );

      res.status(200).json({
        message: "Transaction canceled successfully.",
        result: updatedTransactionHeader,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  },
  adminSendTransaction: async (req, res) => {
    try {
      const transactionHeaderId = req.params.id;
      const updatedTransactionHeader = await Transaction_header.update(
        {
          TransactionStatusId: 3,
        },
        {
          where: {
            id: transactionHeaderId,
          },
        }
      );

      res.status(200).json({
        message: "Transaction Delivered.",
        result: updatedTransactionHeader,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  }


};

module.exports = transactionController;
