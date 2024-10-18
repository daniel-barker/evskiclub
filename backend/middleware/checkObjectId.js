import { isValidObjectId } from "mongoose";

function checkObjectId(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    return res.status(404).send(`ObjectID invalid: ${req.params.id}`);
  }
  next();
}

export default checkObjectId;
