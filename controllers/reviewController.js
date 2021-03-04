const Review = require('../models/reviewModel.js');
const factory = require('./handlerFactory');

exports.setTourUserId = (req, res, next) => {
  //Allow user to create review directly on tour without passing input in req.body
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
//Create review upon tour route or create review by sending tourId
exports.createReview = factory.createOne(Review);
//Delete, update and get review by Id
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.getReview = factory.getOne(Review);
