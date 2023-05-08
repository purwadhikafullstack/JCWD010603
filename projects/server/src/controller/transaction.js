const { Op } = require("sequelize");
const { sequelize } = require("../models");
const db = require("../models");
const Transaction_header = db.transaction_header;
const Transaction_item = db.transaction_item;
const Transaction_status = db.transaction_status;
const Branch = db.branch;
const User = db.user;
const User_detail = db.user_detail;
const Address = db.address;
const moment = require("moment");
const transaction_status = require("../models/transaction_status");
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
          TransactionStatusId: 1
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
        await Record_stock.create(
          {
            stockBefore: product.dataValues.stock,
            stockAfter: product.dataValues.stock - val.qty,
            desc: "pengurangan stock transaction",
            TypeStockId: 1,
            ProductId: val.ProductId,
          },
          { transaction: t }
        );
        if (product.stock < val.qty) {
          throw new Error("stocknya kurang");
        }
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
  getAllTransaction : async (req,res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const search = parseInt(req.query.search) || "" 
    const offset = limit * (page - 1)
    const sortBy = req.query.sortBy || "createdAt"
    const order = req.query.order || "DESC"

    const t = await sequelize.transaction();

    try{
    const totalRows = await Transaction_header.count({
        where : {
            [Op.or] : [
                {
                    BranchId : {[Op.like]: `%${search}%`}
                },
                {
                    TransactionStatusId : {[Op.like]: `%${search}%`}
                }
            ]
        }
    },{transaction : t})
    if(totalRows == 0) {
        throw new Error('Fetching data failed')
    }

    const totalPage = Math.ceil(totalRows / limit)
        const result = await Transaction_header.findAll({
            where : {
                [Op.or] : [
                    {
                        BranchId : {[Op.like]: `%${search}%`}
                    },
                    // {
                    //     TransactionStatusId : {[Op.like]: `%${search}%`}
                    // }
                ]
            },
            include: [ {
              model: Transaction_status,
              attributes: ["name"],
            }, {
              model: Branch,
              attributes: ["name"],
            }, {
              model: User,
              attributes: ["email"],
            }],
            offset: offset,
            limit: limit,
            order: [
                [sortBy, order]
            ]
        }, {transaction: t})

        if(!result){
            throw new Error('Fetching all transaction failed')
        }

        res.status(201).json({
            result : result,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPage,
            order : order
        })
        await t.commit();
} catch (err) {
      return res.status(401).json({message : err.message})  
    }
  },
  getTransactionItem: async (req,res) => {
    const {id} = req.params

    try {

      const data = await Transaction_item.findAll({where: {TransactionHeaderId : id}, include: {model: Product, attributes: ["name", "weight", "price"]} })
      
      if(!data) throw new Error('Failed fetch transaction items')

      res.status(201).json({
        result : data
      })

    } catch (err) {
      return res.status(401).json({message: err.message})
    }
  },
  getTransactionByBranch : async (req,res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const search = parseInt(req.query.search) || "" 
    const offset = limit * (page - 1)
    const sortBy = req.query.sortBy || "createdAt"
    const order = req.query.order || "DESC"
    const id = req.params.id
    const t = await sequelize.transaction();

    try{
    const totalRows = await Transaction_header.count({
        where : {
            [Op.and] : [
              {
                BranchId : id
              },
                {
                    TransactionStatusId : {[Op.like]: `%${search}%`}
                },
            ]
        }
    },{transaction : t})
    if(totalRows == 0) {
        throw new Error('Fetching data failed')
    }

    const totalPage = Math.ceil(totalRows / limit)
        const result = await Transaction_header.findAll({
            where : {
                [Op.and] : [
                  {
                    BranchId : id
                  },
                    {
                        TransactionStatusId : {[Op.like]: `%${search}%`}
                    },
                ]
            },
            include: [ {
              model: Transaction_status,
              attributes: ["name"],
            }, {
              model: Branch,
              attributes: ["name"],
            }, {
              model: User,
              attributes: ["email"],
            }],
            offset: offset,
            limit: limit,
            order: [
                [sortBy, order]
            ]
        }, {transaction: t})

        if(!result){
            throw new Error('Fetching all transaction failed')
        }

        res.status(201).json({
            result : result,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPage,
            order : order
        })
        await t.commit();
} catch (err) {
      return res.status(401).json({message : err.message})  
    }
  },
  getTransactionStatus : async (req,res) => {

    try{
      const result = await Transaction_status.findAll()

      if(!result) throw new Error('Failed fetching Transaction Status')

      res.status(201).json({result : result})
    } catch (err) {
      return res.status(401).json({message : err.message})
    }

  }
};


module.exports = transactionController;
