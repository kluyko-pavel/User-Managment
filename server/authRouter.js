const Router = require("express");
const router = new Router();
const controller = require("./authController");
const authMiddleware = require("./authMiddleware");
const { check } = require("express-validator");

router.post(
  "/registration",
  [check("username", "Имя пользователя не может быть пустым").notEmpty()],
  controller.registration
);
router.post("/login", controller.login);
router.get("/users", authMiddleware, controller.getUsers);
router.delete("/users/delete", authMiddleware, controller.delete);
router.put("/users/block", authMiddleware, controller.block);
router.put("/users/unblock", authMiddleware, controller.unblock);

module.exports = router;
