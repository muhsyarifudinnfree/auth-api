import express from "express";
import ClientError from "../../Commons/exceptions/ClientError.js";
import DomainErrorTranslator from "../../Commons/exceptions/DomainErrorTranslator.js";
import users from "../../Interfaces/http/api/users/index.js";
import authentications from "../../Interfaces/http/api/authentications/index.js";

const createServer = async (container) => {
  const app = express();

  app.use(express.json());

  // 1. Definisikan semua Route terlebih dahulu
  app.use("/users", users(container));
  app.get("/", (req, res) => {
    res.status(200).json({ data: "Hello world!" });
  });
  app.use("/authentications", authentications(container));

  // 2. Handler 404 diletakkan SETELAH semua route
  app.use((req, res) => {
    res.status(404).json({
      status: "fail",
      message: "resource not found",
    });
  });

  // 3. Error Handler diletakkan paling akhir
  app.use((err, req, res, next) => {
    const translatedError = DomainErrorTranslator.translate(err);

    if (translatedError instanceof ClientError) {
      return res.status(translatedError.statusCode).json({
        status: "fail",
        message: translatedError.message,
      });
    }

    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "terjadi kegagalan pada server kami",
    });
  });

  return app;
};

  return app;
};

export default createServer;
