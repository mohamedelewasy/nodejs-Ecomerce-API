const multer = require("multer");
const ApiError = require("../errors/apiError");

const multerOptions = () => {
  const storage = multer.memoryStorage();
  const fileFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) cb(null, true);
    else cb(new ApiError("only image allowed", 400));
  };
  const upload = multer({ storage, fileFilter });
  return upload;
};

exports.uploadSingleImage = (fileName = "image") =>
  multerOptions().single(fileName);
exports.uploadMultipleImages = (fieldNames) =>
  multerOptions().fields(fieldNames);
