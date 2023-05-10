const { Op } = require("sequelize");
const { sequelize } = require("../models");
const db = require("../models");
const Cart = db.cart;
const Product = db.product;
const Branch = db.branch;

const cartController = {
  getCartData: async (req, res) => {
    const page = parseInt(req.query.page) || 1; // default to page 1 if not provided
    const pageSize = 5;
    const { userId } = req.params; // assuming that the userId is passed as a parameter in the request

    try {
      const totalCount = await Cart.count({ where: { UserId: userId } });
      const totalPages = Math.ceil(totalCount / pageSize);

      // Adjust the page number to the last page if it is greater than the total number of pages
      if (page > totalPages) {
        page = totalPages;
      }

      const result = await Cart.findAll({
        where: { UserId: userId },
        attributes: ["id", "qty", "ProductId", "UserId"],
        include: [
          {
            model: Product,
            attributes: ["name", "price", "imgProduct"],
          },
        ],
      });

      const totalPrice = result.reduce((acc, item) => {
        return acc + item.Product.price * item.qty;
      }, 0);

      return res.status(200).json({
        message: "Cart data successfully fetched",
        result: result.slice((page - 1) * pageSize, page * pageSize), // Only send the data for the requested page
        page: page,
        pageSize: pageSize,
        totalCount: totalCount,
        totalPages: totalPages,
        totalPrice: totalPrice,
      });
    } catch (err) {
      return res.status(400).json({
        message: err,
      });
    }
  },

  deleteCartData: async (req, res) => {
    const { id } = req.params;

    try {
      const cartItem = await Cart.findOne({ where: { id } });

      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      await cartItem.destroy();

      return res.status(200).json({
        message: "Cart item deleted successfully",
      });
    } catch (err) {
      return res.status(400).json({
        message: err,
      });
    }
  },

  createCartData: async (req, res) => {
    const { qty, ProductId, UserId } = req.body;

    try {
      const checkProduct = await Product.findByPk(ProductId);
      if (!checkProduct) {
        return res.status(401).json({
          message: `Product id ${ProductId} does not exist`,
        });
      }

      const [cartItem, created] = await Cart.findOrCreate({
        where: {
          ProductId: ProductId,
          UserId: UserId,
        },
        defaults: {
          qty: qty,
        },
      });

      if (!created) {
        cartItem.qty = qty;
        await cartItem.save();
      }

      return res.status(200).json({
        message: "Cart item created/updated",
        result: cartItem,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  },

  getCartByUserId: async (req, res) => {
    try {
      const id = req.params.id;
      const filterCart = await Cart.findAll({
        include: [
          {
            model: Product,
            attributes: ["name", "price", "imgProduct", "weight", "BranchId"],
            include: {
              model: Branch,
              attributes: ["name", "idCity"],
            },
          },
        ],
        where: {
          UserId: id,
        },
      });
      const totalPrice = filterCart.reduce((acc, item) => {
        return acc + item.Product.price * item.qty;
      }, 0);
      res.status(200).json({
        message: "filter chart berdasarkan id",
        result: { filterCart, totalPrice },
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  },

  getCartByWeight: async (req, res) => {
    try {
      const id = req.params.id;

      const filterCartW = await Cart.findAll({
        include: [
          {
            model: Product,
            attributes: ["weight"],
          },
        ],
        where: {
          UserId: id,
        },
      });
      const totalWeight = filterCartW.reduce((acc, item) => {
        return acc + item.Product.weight;
      }, 0);
      res.status(200).json({
        message: "filter chart berdasarkan weight",
        result: { filterCartW, totalWeight },
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  },

  patchCartData: async (req, res) => {
    const { id } = req.params;
    const { qty } = req.body;

    try {
      const cartItem = await Cart.findOne({ where: { id } });

      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      const checkProduct = await Product.findByPk(cartItem.ProductId);

      if (!checkProduct) {
        return res.status(401).json({
          message: `Product id ${cartItem.ProductId} does not exist`,
        });
      }

      const availableStock = checkProduct.stock - qty;
      if (availableStock < 0) {
        return res.status(401).json({
          message: `Stock is not enough. Available stock is ${checkProduct.stock}.`,
        });
      }

      await cartItem.update({ qty });

      return res.status(200).json({
        message: "Cart item updated successfully",
        cartItem,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        message: err,
      });
    }
  },

  addCart: async (req, res) => {
    const { qty, ProductId, UserId } = req.body;
    if (!UserId) {
      return res.status(400).json({
        message: "Please Login first",
      });
    }

    try {
      const checkProduct = await Product.findByPk(ProductId);
      if (!checkProduct) {
        return res.status(401).json({
          message: `Product id ${ProductId} does not exist`,
        });
      }

      const branchId = checkProduct.BranchId; // get branch id of the product

      const cartItems = await Cart.findAll({
        where: {
          UserId: UserId,
        },
        include: {
          model: Product,
          attributes: ["BranchId", "stock"],
        },
      }); // get all cart items of the user

      if (cartItems.length > 0) {
        const firstCartItemBranchId = cartItems[0].Product.BranchId;
        if (branchId !== firstCartItemBranchId) {
          return res.status(401).json({
            message:
              "You cannot add products from different branch. Please remove all items in your cart before changing location.",
          });
        }
      }

      const availableStock = checkProduct.stock - qty;
      if (availableStock < 0) {
        return res.status(401).json({
          message: `Stock is not enough. Available stock is ${checkProduct.stock}.`,
        });
      }

      if (availableStock === 0) {
        return res.status(401).json({
          message: `The product is out of stock.`,
        });
      }

      const [cartItem, created] = await Cart.findOrCreate({
        where: {
          ProductId: ProductId,
          UserId: UserId,
        },
        defaults: {
          qty: qty,
        },
      });

      if (!created) {
        cartItem.qty = qty;
        await cartItem.save();
      }

      return res.status(200).json({
        message: "Cart item created/updated",
        result: cartItem,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  },
};

module.exports = cartController;
