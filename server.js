const express = require("express");
const { sequelize } = require("./models");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const { PORT } = require("./utils/util");
const { rootRouter } = require("./routers");
const { createServer } = require("http");
const { io } = require("./utils/socket");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();

const httpServer = createServer(app);
io.attach(httpServer);
// {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// }

// Thiết lập các tùy chọn cho swagger-jsdoc
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Express API with Swagger",
    },
  },
  apis: ["./routers/*.js"], // Đường dẫn đến các file chứa định nghĩa API
};

// Khởi tạo swagger-jsdoc
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Tích hợp swagger-ui-express
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors());
app.use(express.json());
// setup static file
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/api/v1", rootRouter);
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send(`HELLO ${PORT}`);
});

httpServer.listen(PORT, async () => {
  console.log(`http://localhost:${PORT}`);
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
