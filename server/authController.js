const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("./config");

const generateAccessToken = (id, username) => {
  const payload = {
    id,
    username,
  };
  return jwt.sign(payload, secret, { expiresIn: "10h" });
};

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Fields should not be empty", errors });
      }
      const { username, email, password } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "A user with this name already exists" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = new User({ username, email, password: hashPassword });
      await user.save();
      return res.json({ message: "User created", status: 200 });
    } catch (e) {
      res.status(400).json({ message: "Registration error" });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Fields should not be empty", errors });
      }
      const user = await User.findOne({ username });
      if (user.status === "blocked") {
        return res.status(400).json({ message: "User is blocked" });
      }

      if (!user) {
        return res.status(400).json({ message: `User ${username} not found` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Invalid password entered" });
      }
      user.lastLogin = new Date();
      await user.save();
      const token = generateAccessToken(user._id, user.username);
      return res.json({ message: "Login completed", token, user, status: 200 });
    } catch (e) {
      res.status(400).json({ message: "Login error" });
    }
  }

  async delete(req, res) {
    try {
      const userIds = req.body.userIds;
      const currentUserId = req.body.currentUser._id;
      const currentUser = await User.findById(currentUserId);
      const deletedUsers = [];

      if (!currentUser.status === "active") {
        return res.status(403).send({
          message: `User with ID ${currentUserId} was blocked or deleted`,
        });
      }

      for (let i = 0; i < userIds.length; i++) {
        const user = await User.findById(userIds[i]);
        if (!user) {
          return res
            .status(404)
            .send({ message: `User with ID ${userIds[i]} not found` });
        }
        await user.deleteOne();
        deletedUsers.push(user);
      }
      return res.send({ message: "Users have been deleted", deletedUsers });
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async block(req, res) {
    try {
      const userIds = req.body.userIds;
      const currentUserId = req.body.currentUser._id;
      const currentUser = await User.findById(currentUserId);
      const blockedUsers = [];

      if (!currentUser.status === "active") {
        return res.status(403).send({
          message: `User with ID ${currentUserId} was blocked or deleted`,
        });
      }

      for (let i = 0; i < userIds.length; i++) {
        const user = await User.findById(userIds[i]);
        console.log(user.token);
        if (!user) {
          return res
            .status(404)
            .send({ message: `User with ID ${userIds[i]} not found` });
        }
        user.status = "blocked";
        await user.save();
        blockedUsers.push(user);
      }
      return res.send({ message: "Users are blocked", blockedUsers });
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async unblock(req, res) {
    try {
      const userIds = req.body.userIds;
      const currentUserId = req.body.currentUser._id;
      const currentUser = await User.findById(currentUserId);
      const unblockedUsers = [];

      if (!currentUser.status === "active") {
        return res.status(403).send({
          message: `User with ID ${currentUserId} was blocked or deleted`,
        });
      }

      for (let i = 0; i < userIds.length; i++) {
        const user = await User.findById(userIds[i]);
        if (!user) {
          return res
            .status(404)
            .send({ message: `User with ID ${userIds[i]} not found` });
        }

        user.status = "active";
        await user.save();
        unblockedUsers.push(user);
      }

      return res.send({ message: "Users are unblocked", unblockedUsers });
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new AuthController();
