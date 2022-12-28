const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  getUserLoggedData,
  createUser,
  updateUser,
  changeUserPassword,
  updateUserLoggedPassword,
  updateUserLoggedData,
  deleteUser,
  deactivateUser,
  deactivateUserLoggedData,
  uploadUserImage,
  resizeUserImage,
} = require("../services/userServices");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  updateUserPasswordValidator,
  updateUserLoggedPasswordValidation,
  deleteUserValidator,
} = require("../validator/userVal");

const { protect, allowedTo } = require("../services/authServices");

router.route("/users/me").get(protect, getUserLoggedData, getUser);
router
  .route("/users/me/updatepassword")
  .put(protect, updateUserLoggedPasswordValidation, updateUserLoggedPassword);

router.route("/users/me/update").put(protect, updateUserLoggedData);

router.route("/users/me/deactivate").get(protect, deactivateUserLoggedData);

router
  .route("/users/:id/deactivate")
  .get(protect, allowedTo("admin"), deactivateUser);

router
  .route("/users")
  .all(protect, allowedTo("admin"))
  .get(getAllUsers)
  .post(uploadUserImage, resizeUserImage, createUserValidator, createUser);

router
  .route("/users/:id")
  .all(protect, allowedTo("admin"))
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeUserImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

router
  .route("/users/resetpassword/:id")
  .put(
    protect,
    allowedTo("admin"),
    updateUserPasswordValidator,
    changeUserPassword
  );

module.exports = router;
