const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");

let DUMMY_PLACES = [
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

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place.",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided id.",
      404
    );
    return next(error);
    //throw error; //trigger the error handling middleware
  }

  res.json({ place: place.toObject( {getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places
  try {
    places = Place.find({ creator: userId });
  } catch(err) {
    const error = new HttpError(
      'Fetching places failed, please try again later',
      500
    );
    return next(error);
  }
  

  if (!places || places.length === 0) {
    // const error = new Error('Could not find a place for the provided id.')
    // error.code = 404;
    return next(
      new HttpError("Could not find places for the provided id.", 404)
    ); //forward to next middleware, here the error handling middleware
  }
  res.json({ places: places.map(place => place.toObject({ getters: true })) }); //using map since find returns an array
};

const createPlace = async (req, res, next) => {
  //const title = req.body.title

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //console.log(errors);
    next(new HttpError("Invalid inputs passed, please check your data", 422));
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    adress,
    location: coordinates,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/375px-Empire_State_Building_%28aerial_view%29.jpg",
    creator,
  });

  //  DUMMY_PLACES.push(createdPlace);
  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError(
      "Creating palce failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data", 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;

  try{
    place = await Place.findById(placeId)
  } catch (err) {
    const error = new HttpError(
      'Something went wronog, could not updated place',
      500
    );
    return next(error)
  }

  // const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) }; //making a copy
  // const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch(err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  // DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  // if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
  //   throw new HttpError("Could not find a place for that id");
  // }
  // DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

  let place;
   try {
     place = await Place.findById(placeId);
   } catch (err) {
     const error = new HttpError(
       'Something went wrong, could not delete place.',
       500
     );
     return next(error);
   }

   try {
     await place.remove();
   } catch (err) {
     const error = new HttpError(
       'Something went wrong, could not delete place.',
       500
     );
     return next(error);
   }

  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
