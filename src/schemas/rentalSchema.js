import joi from "joi";

const rentalSchema = joi.object({
  name: joi.string().required(),
  customerId: joi.number().required(),
  gameId: joi.number().required(),
  rentDate: joi.date().required(),
  daysRented: joi.number().required(),
  returnDate: joi.date(),
  originalPrice: joi.number().required(),
  delayFee: joi.number(),
});

export default rentalSchema;
