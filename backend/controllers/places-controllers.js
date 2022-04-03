const { create } = require("tar");
const HttpError = require("../models/http-error");

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    throw new HttpError("Could not find a place for the provided id.", 404);
    //throw error; //trigger the error handling middleware
  }

  res.json({ place: place });
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  if (!place) {
    // const error = new Error('Could not find a place for the provided id.')
    // error.code = 404;
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    ); //forward to next middleware, here the error handling middleware
  }
  res.json({ place: place });
};

// const createPlace = (req, res, next) => {

// };

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
//exports.createPlace = createPlace;