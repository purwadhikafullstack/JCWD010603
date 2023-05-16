const { Op } = require("sequelize");
const { sequelize, product } = require("../models");
const db = require("../models");

const Product = db.product;
const Record_stock = db.record_stock;
const Type_stock = db.type_stock;

const stockController = {
    getType : async (req,res) => {  
        
        try {
            const result = await Type_stock.findAll({where : {
                id : {
                    [Op.and] : [{[Op.ne] : 1}, {[Op.ne] : 2}, {[Op.ne] : 6}, {[Op.ne] : 7}]
                }
            }})

            if(!result) {
                throw new Error('Failed fetching list of type stock')
            }

            res.status(201).json({result : result})
        } catch (err) {
            return res.status(401).json({message : err.message})
        }
        
    },
    fetchRecordById : async (req,res) => {
        const {id} = req.params
        const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 5;
const offset = limit * (page - 1);
const sortBy = req.query.sortBy || "createdAt";
const order = req.query.order || "DESC";
const t = await sequelize.transaction();
try {
    const totalRows = await Record_stock.count(
      {
          where : {
              BranchId : id
          },
          include : [{
              model : product,
              paranoid : false,
              attributes : ['name'],
              where : {
                  name : {
                      [Op.ne] : 'undefined' || null
                  },
              }  
          }]
      },
      { transaction: t }
    );
    if (totalRows == 0) {
      throw new Error("Fetching data failed");
    }
  
    const totalPage = Math.ceil(totalRows / limit);
    const result = await Record_stock.findAll(
      {
          where : {
              BranchId : id
          },
          include : [{
              model : product,
              paranoid : false,
              attributes : ['name'],
              where : {
                  name : {
                      [Op.ne] : 'undefined' || null
                  },
              }  
          }],
        offset: offset,
        limit: limit,
        order: [[sortBy, order]],
      },
      { transaction: t }
    );
  
    if (!result) {
      throw new Error("Fetching all transaction failed");
    }
    
    await t.commit();
    res.status(201).json({
      result: result,
      page: page,
      limit: limit,
      totalRows: totalRows,
      totalPage: totalPage,
      order: order,
    });
  } catch (err) {
    await t.rollback();
    return res.status(401).json({ message: err.message });
  }
},
repairStock : async (req,res) => {
    const {id} = req.params
    const {stock, desc} = req.body
    const t = await sequelize.transaction();
    try {
        const checkStock = await Product.findOne(
                { where: { id: id } },
                { transaction: t }
                );                
                if (!checkStock) {throw new Error("Product is not found")}

        const recordData = {
              stockBefore: checkStock.dataValues.stock,
              stockAfter: stock,
              desc: desc || `Repair the stock product ${checkStock.dataValues.name} to ${stock} pcs`,
              TypeStockId: 5,
              ProductId: id,
              BranchId: checkStock.dataValues.BranchId
        };

        console.log(recordData);

        const data = await Product.update({stock : stock}, {where: {
            id : id
        }}, { transaction: t })
        if (!data) {throw new Error('Failed repair stock')}
        
        const record = await Record_stock.create({...recordData}, {transaction: t})
        if (!record) {throw new Error('Failed create record stock')}
        

        await t.commit();
        res.status(201).json({ message: "Success repair stock product" });
        } catch(err){
            await t.rollback();
            return res.status(401).json({ message: err.message });
        }
    }
}
module.exports = stockController


