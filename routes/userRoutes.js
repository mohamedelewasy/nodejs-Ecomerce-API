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

router.use(protect, allowedTo("admin"));

router.route("/users/:id/deactivate").get(deactivateUser);

router
  .route("/users")
  .get(getAllUsers)
  .post(uploadUserImage, resizeUserImage, createUserValidator, createUser);

router
  .route("/users/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeUserImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

router
  .route("/users/resetpassword/:id")
  .put(updateUserPasswordValidator, changeUserPassword);

module.exports = router;
