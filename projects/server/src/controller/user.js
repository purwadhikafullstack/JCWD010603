const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { sequelize } = require("../models");
const secret_key = process.env.secret_key;
const urlServer = process.env.SERVER_URL;
const mailer = require("../library/mailer");
const { nanoid } = require("nanoid");
const db = require("../models");
const category = require("../models/category");
const User = db.user;
const User_detail = db.user_detail;
const Address = db.address;
const Branch = db.branch;
const Category = db.category;
const Product = db.product;
const Voucher_type = db.voucher_type;
const Voucher = db.voucher;

const userController = {
  register: async (req, res) => {
    const data = req.body;
    console.log(req.body);

    const t = await sequelize.transaction();
    try {
      // check password

      const password = bcrypt.hashSync(data.password, 10);

      const dataUser = {
        email: data.email,
        username: data.username,
        password: password,
        isVerify: false,
      };

      const user = await User.create({ ...dataUser }, { transaction: t });
      if (!user) {
        throw new Error("Create user failed");
      }

      const dataUserDetail = {
        UserId: user.dataValues.id,
        birthDate: data.birthDate,
        gender: data.gender,
        firstName: data.firstName,
        lastName: data.lastName,
      };

      const userDetail = await User_detail.create(
        { ...dataUserDetail },
        { transaction: t }
      );
      if (!userDetail) {
        throw new Error("Create user detail failed");
      }

      const dataAddress = {
        UserId: user.dataValues.id,
        address: data.address,
        province: data.province,
        city: data.city,
        district: data.district,
        postalCode: data.postalCode,
        idCity: data.idCity,
        idProv: data.idProv,
        isPrimary: true,
      };

      const address = await Address.create(
        { ...dataAddress },
        { transaction: t }
      );
      if (!address) {
        throw new Error("Create user detail failed");
      }

      const token = await jwt.sign({ ...user.dataValues }, secret_key, {
        expiresIn: "1d",
      });
      const href = `https://jcwd010603.purwadhikabootcamp.com/verify-email?token=${token}`;
      // verify via email
      const mail = await mailer(
        {
          to: data.email,
          subject: "Verify Your Account!",
          html: `<!DOCTYPE html>
        <html>
        <head>
        
          <meta charset="utf-8">
          <meta http-equiv="x-ua-compatible" content="ie=edge">
          <title>Email Confirmation</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style type="text/css">
          /**
           * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
           */
          @media screen {
            @font-face {
              font-family: 'Source Sans Pro';
              font-style: normal;
              font-weight: 400;
              src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
            }
            @font-face {
              font-family: 'Source Sans Pro';
              font-style: normal;
              font-weight: 700;
              src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
            }
          }
          /**
           * Avoid browser level font resizing.
           * 1. Windows Mobile
           * 2. iOS / OSX
           */
          body,
          table,
          td,
          a {
            -ms-text-size-adjust: 100%; /* 1 */
            -webkit-text-size-adjust: 100%; /* 2 */
          }
          /**
           * Remove extra space added to tables and cells in Outlook.
           */
          table,
          td {
            mso-table-rspace: 0pt;
            mso-table-lspace: 0pt;
          }
          /**
           * Better fluid images in Internet Explorer.
           */
          img {
            -ms-interpolation-mode: bicubic;
          }
          /**
           * Remove blue links for iOS devices.
           */
          a[x-apple-data-detectors] {
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            color: inherit !important;
            text-decoration: none !important;
          }
          /**
           * Fix centering issues in Android 4.4.
           */
          div[style*="margin: 16px 0;"] {
            margin: 0 !important;
          }
          body {
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          /**
           * Collapse table borders to avoid space between cells.
           */
          table {
            border-collapse: collapse !important;
          }
          a {
            color: #1a82e2;
          }
          img {
            height: auto;
            line-height: 100%;
            text-decoration: none;
            border: 0;
            outline: none;
          }
          </style>
        
        </head>
        <body style="background-color: #e9ecef;">
          <!-- start body -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
        
            <!-- start hero -->
            <tr>
              <td align="center" bgcolor="#2C3639">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                      <center><h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Email </h1>
                      </center>
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <!-- end hero -->
        
            <!-- start copy block -->
            <tr>
              <td align="center" bgcolor="#2C3639">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

                  <!-- start copy -->
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                      <center><p style="margin: 0;">Welcome to KOPIO, please tap the button below to confirm your email address.</p></center>    
                    </td>
                  </tr>
                  <!-- end copy -->
        
                  <!-- start button -->
                  <tr>
                    <td align="left" bgcolor="#ffffff">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                            <table border="0" cellpadding="0" cellspacing="0">
                              <tr>
                                <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                                  <a href="${href}" target="_blank" style="display: inline-block; padding: 10px 20px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Verify!</a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <!-- end button -->
        
                  <!-- start copy -->
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                      <p style="margin: 0;">Cheers,<br> Admin</p>
                    </td>
                  </tr>
                  <!-- end copy -->
        
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <!-- end copy block -->
        
            <!-- start footer -->
            <tr>
              <td align="center" bgcolor="#2C3639" style="padding: 24px;">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
        
                  <!-- start permission -->
                  <tr>
                    <td align="center" bgcolor="#2C3639" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #DCD7C9;">
                      <p style="margin: 0;">You received this email because we received a request for verification email for your account. If you didn't request verification email you can safely delete this email.</p>
                      <p style="margin: 0;">This email will expired in 30 days</p>
                    </td>
                  </tr>
                  <!-- end permission -->
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <!-- end footer -->
        
          </table>
          <!-- end body -->
        
        </body>
        </html>`,
        },
        { transaction: t }
      );
      console.log(mail);

      await t.commit();
      res.status(201).send("Create user success");
    } catch (err) {
      await t.rollback();
      return res.status(400).json({ message: err.message });
    }
  },

  verify: async (req, res) => {
    token = req.params.token;

    const t = await sequelize.transaction();
    try {
      if (!token) {
        throw new Error("Token is undefined");
      }

      const verifyUser = await jwt.verify(token, secret_key, {
        ignoreExpiration: true,
      });

      console.log(verifyUser);

      if (Date.now() >= verifyUser.exp * 1000) {
        throw new Error("Token has Been expired");
      }

      const user = await User.findByPk(verifyUser.id, { transaction: t });
      if (!user) {
        throw new Error("Verify email failed, user not found");
      }

      if (user.dataValues.isVerify === true) {
        throw new Error("Email has been verified");
      }

      await User.update(
        {
          isVerify: true,
        },
        {
          where: {
            id: user.id,
          },
        },
        { transaction: t }
      );

      res.status(201).json({ message: "Verify User Success!" });
      await t.commit();
    } catch (err) {
      await t.rollback();
      return res.status(401).json({ message: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: {
          email: email,
        },
      });
      console.log(req.body);
      if (!user) {
        return res.status(400).json({
          message: "user tidak ditemukan",
        });
      }

      const checkPass = await bcrypt.compareSync(password, user.password);

      if (checkPass) {
        const token = await jwt.sign({ id: user.dataValues.id }, secret_key, {
          expiresIn: "1d",
        });
        delete user.dataValues.password;

        return res.status(200).json({
          message: "anda berhasil login",
          result: { token, user },
        });
      }

      return res.status(400).json({
        message: "password anda salah",
      });
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
      console.log(err);
    }
  },

  updateFoto: async (req, res) => {
    try {
      const UserId = req.params.UserId;

      const data = {};

      if (req.file) {
        console.log(req.file);
        data.imgUser = process.env.render_avatar + req.file.filename;
      }

      await User_detail.update(
        {
          ...data,
        },
        {
          where: {
            UserId: UserId,
          },
        }
      );

      const result = await User_detail.findByPk(UserId);

      return res.status(200).json({
        message: "user edited",
        result: result,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.toString(),
      });
    }
  },

  renderAvatar: async (req, res) => {
    try {
      // const id = req.params.id; //27
      var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
      const avatar = await User_detail.findOne({
        where: {
          imgUser: fullUrl,
        },
      });
      console.log(avatar.id);

      res.set("Content-type", "image/**");
    } catch (err) {
      res.send(err);
      return res.status(400).json({
        message: err.message,
      });
    }
  },

  editProfile: async (req, res) => {
    const t = await sequelize.transaction();
    id = req.params.id;
    try {
      const { User_id, firstName, lastName, birthDate, email, gender } =
        req.body;
      const data = { User_id, firstName, lastName, birthDate, email, gender };

      const dataUser = {
        email: data.email,
      };
      const user = await User.update(
        {
          ...dataUser,
        },
        {
          where: {
            id: id,
          },
        },
        { transaction: t }
      );
      if (!user) {
        throw new Error("Update user failed");
      }

      const dataUserDetail = {
        birthDate: data.birthDate,
        gender: data.gender,
        firstName: data.firstName,
        lastName: data.lastName,
      };
      const userDetail = await User_detail.update(
        { ...dataUserDetail },
        {
          where: {
            UserId: id,
          },
        },
        { transaction: t }
      );
      if (!userDetail) {
        throw new Error("Update user detail failed");
      }

      await t.commit();
      res.status(201).send("update user success");
    } catch (err) {
      await t.rollback();
      return res.status(400).send(err.message);
    }
  },

  editPassword: async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    console.log(req.user);
    const hashpassword = bcrypt.hashSync(newPassword, 10);
    await User.update(
      {
        newPassword: hashpassword,
      },
      {
        where: {
          email: req.user.email,
        },
      }
    );
  },

  resetRequest: async (req, res) => {
    const email = req.body.email;

    const t = await sequelize.transaction();
    try {
      const check = await User.findOne(
        { where: { email: email } },
        { transaction: t }
      );

      if (!check) {
        throw new Error("Your email is not registered");
      }
      console.log(check.dataValues.isVerify);

      if (check.dataValues.isVerify == 0 || false) {
        throw new Error(
          `Can't request reset password because your email still not verified`
        );
      }

      const token = jwt.sign({ id: check.dataValues.id }, secret_key, {
        expiresIn: "1h",
      });

      const href = `https://jcwd010603.purwadhikabootcamp.com/setup-password?token=${token}`;
      // verify via email
      const mail = await mailer({
        to: email,
        subject: "Reset Password!",
        html: `<!DOCTYPE html>
        <html>
        <head>
        
          <meta charset="utf-8">
          <meta http-equiv="x-ua-compatible" content="ie=edge">
          <title>Email Confirmation</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style type="text/css">
          /**
           * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
           */
          @media screen {
            @font-face {
              font-family: 'Source Sans Pro';
              font-style: normal;
              font-weight: 400;
              src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
            }
            @font-face {
              font-family: 'Source Sans Pro';
              font-style: normal;
              font-weight: 700;
              src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
            }
          }
          /**
           * Avoid browser level font resizing.
           * 1. Windows Mobile
           * 2. iOS / OSX
           */
          body,
          table,
          td,
          a {
            -ms-text-size-adjust: 100%; /* 1 */
            -webkit-text-size-adjust: 100%; /* 2 */
          }
          /**
           * Remove extra space added to tables and cells in Outlook.
           */
          table,
          td {
            mso-table-rspace: 0pt;
            mso-table-lspace: 0pt;
          }
          /**
           * Better fluid images in Internet Explorer.
           */
          img {
            -ms-interpolation-mode: bicubic;
          }
          /**
           * Remove blue links for iOS devices.
           */
          a[x-apple-data-detectors] {
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            color: inherit !important;
            text-decoration: none !important;
          }
          /**
           * Fix centering issues in Android 4.4.
           */
          div[style*="margin: 16px 0;"] {
            margin: 0 !important;
          }
          body {
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          /**
           * Collapse table borders to avoid space between cells.
           */
          table {
            border-collapse: collapse !important;
          }
          a {
            color: #1a82e2;
          }
          img {
            height: auto;
            line-height: 100%;
            text-decoration: none;
            border: 0;
            outline: none;
          }
          </style>
        
        </head>
        <body style="background-color: #e9ecef;">
          <!-- start body -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
        
            <!-- start hero -->
            <tr>
              <td align="center" bgcolor="#2C3639">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                      <center><h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Email </h1>
                      </center>
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <!-- end hero -->
        
            <!-- start copy block -->
            <tr>
              <td align="center" bgcolor="#2C3639">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

                  <!-- start copy -->
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                      <center><p style="margin: 0;">Welcome to KOPIO, please tap the button below to reset your password.</p></center>    
                    </td>
                  </tr>
                  <!-- end copy -->
        
                  <!-- start button -->
                  <tr>
                    <td align="left" bgcolor="#ffffff">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                            <table border="0" cellpadding="0" cellspacing="0">
                              <tr>
                                <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                                  <a href="${href}" target="_blank" style="display: inline-block; padding: 10px 20px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Reset Password!</a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <!-- end button -->
        
                  <!-- start copy -->
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                      <p style="margin: 0;">Cheers,<br> Admin</p>
                    </td>
                  </tr>
                  <!-- end copy -->
        
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <!-- end copy block -->
        
            <!-- start footer -->
            <tr>
              <td align="center" bgcolor="#2C3639" style="padding: 24px;">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
        
                  <!-- start permission -->
                  <tr>
                    <td align="center" bgcolor="#2C3639" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #DCD7C9;">
                      <p style="margin: 0;">You received this email because we received a request for reset password for your account. If you didn't request reset email, you can safely delete this email.</p>
                      <p style="margin: 0;">This email will expired in 30 days</p>
                    </td>
                  </tr>
                  <!-- end permission -->
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <!-- end footer -->
        
          </table>
          <!-- end body -->
        
        </body>
        </html>`,
      });

      await t.commit();
      res.status(201).send("Success send request for reset password");
    } catch (err) {
      await t.rollback();
      return res.status(401).json({ errors: err.message });
    }
  },

  resetPassword: async (req, res) => {
    // console.log(req.params.token)
    const token = req.params.token;
    const { password, passwordConfirm } = req.body;
    try {
      if (!token) {
        throw new Error("Token is undefined");
      }

      if (!password.match(/^[ A-Za-z0-9_@-]*$/)) {
        throw new Error(`Only "_", "@","-" characters are allowed`);
      }

      const passwordHash = bcrypt.hashSync(password, 10);
      const verifyUser = await jwt.verify(token, secret_key, {
        ignoreExpiration: true,
      });

      if (Date.now() >= verifyUser.exp * 1000) {
        throw new Error("Token has been expired");
      }

      const reset = await User.update(
        { password: passwordHash },
        {
          where: {
            id: verifyUser.id,
          },
        }
      );
      console.log(reset);
      if (!reset) {
        throw new Error("Reset password failed");
      }

      res.status(200).json({ message: "Reset password success" });
    } catch (err) {
      console.log(err);
      return res.status(401).json({ message: err.message });
    }
  },
  changePassword: async (req, res) => {
    // console.log(req.params.token)
    const token = req.params.token;
    const { password, newPassword } = req.body;
    try {
      if (!token) {
        throw new Error("Token is undefined");
      }

      const passwordHash = bcrypt.hashSync(password, 10);
      const verifyUser = await jwt.verify(token, secret_key, {
        ignoreExpiration: true,
      });

      const change = await User.update(
        { password: passwordHash },
        {
          where: {
            id: verifyUser.id,
          },
        }
      );
      console.log(change);
      if (!change) {
        throw new Error("Change password failed");
      }

      res.status(200).json({ message: "Change password success" });
    } catch (err) {
      console.log(err);
      return res.status(401).json({ message: err.message });
    }
  },

  getCountUserByBranch: async (req, res) => {
    try {
      const id = req.params.id;
      const filterBranch = await User.count({
        // attributes: [sequelize.fn("COUNT", sequelize.col("BranchId"))],
        where: {
          BranchId: id,
        },
      });

      res.status(200).json({
        message: "count user berdasarkan branch",
        result: filterBranch,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        message: err.message,
      });
    }
  },
  getUserDetail: async (req, res) => {
    try {
      const getUserDetail = await User_detail.findAll();
      res.status(200).json({
        message: "get user detail",
        result: getUserDetail,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        message: err.message,
      });
    }
  },
  getUserbyUserId: async (req, res) => {
    try {
      const UserId = req.params.UserId;
      const result = await User.findOne({
        attributes: ["id", "username", "email", "isVerify"],
        include: {
          model: User_detail,
          attributes: [
            "birthDate",
            "lastname",
            "firstname",
            "imgUser",
            "gender",
          ],
        },
        where: {
          id: UserId,
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
  changePassword: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const id = parseInt(req.params.id);
      const { oldPassword, newPassword } = req.body;
      const results = await User.findOne(
        {
          where: {
            id: id,
          },
        },
        { transaction: t }
      );

      const password = results.password;

      const isPasswordCorrect = await bcrypt.compare(oldPassword, password);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          message: "Old password is incorrect",
        });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const result = await User.update(
        {
          password: hashedPassword,
        },
        {
          where: {
            id: id,
          },
        },
        { transaction: t }
      );
      await t.commit();
      return res.status(200).json({
        message: "Password updated successfully",
        result: result,
      });
    } catch (err) {
      await t.rollback();
      return res.status(400).json({
        message: err.message,
      });
    }
  },
};

module.exports = userController;
