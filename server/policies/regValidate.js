const Joi = require("joi")

module.exports = {
    register(req, res, next) {
        const schema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).required()
        })

        Joi.validate(req.body, schema, (error, value) => {
            if (error) {
                switch (error.details[0].context.key) {
                    case "email":
                        res.status(400).send({
                            error: "You must provide a valide email adress"
                        })
                        break
                    case "password":
                        res.status(400).send({
                            error: `The password must to pass the followig rules:
                                    <br>
                                    at least one upper case English letter,
                                    <br>
                                    at least one lower case English letter,
                                    <br>
                                    At least one digit,
                                    <br>
                                    Minimum eight character`
                        })
                        break
                    case "default":
                        res.status(400).send({
                            error: "invalid credentials"
                        })
                }
            } else {
                next()
            }
        })
    }
}