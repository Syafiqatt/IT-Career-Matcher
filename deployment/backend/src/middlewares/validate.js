import Joi from "joi";

export const recommendationSchema = Joi.object({
  skills: Joi.array().items(Joi.string()).min(1).required().messages({
    "array.min": "Pilih minimal satu skill.",
    "any.required": "Field 'skills' wajib diisi.",
  }),
  tools: Joi.array().items(Joi.string()).default([]),
  databases: Joi.array().items(Joi.string()).default([]),
  years_code: Joi.number().min(0).max(60).default(5),
  education_level: Joi.number().integer().valid(0, 1, 2, 3, 6).default(2),
  top_n: Joi.number().integer().min(1).max(10).default(3),
});

/** Middleware factory: validasi req.body terhadap schema Joi. */
export function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: "Validasi gagal.",
        errors: error.details.map((d) => d.message),
      });
    }
    req.validated = value;
    next();
  };
}
