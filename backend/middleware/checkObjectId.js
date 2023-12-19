import { isValidObjectId } from "mongoose";

function checkObjectId(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    return res.status(404);
    throw new Error(`ObjectID invalid: ${req.params.id}`);
  }
  next();
}

export default checkObjectId;
