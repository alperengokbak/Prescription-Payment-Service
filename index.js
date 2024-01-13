import express from "express";
import cors from "cors";
import consumeFromRabbitMQ from "./schedulingService.js";
import cron from "node-cron";

const app = express();
const PORT = 3001;

var corsOptions = {
  origin: ["https://prescription-service-kttk.onrender.com", "https://prescription-api-gateway.onrender.com"],
  methods: "GET",
};

app.use(cors(corsOptions));

app.get("/trigger-task", async (req, res) => {
  try {
    await consumeFromRabbitMQ();
    res.send("Task triggered successfully!");
  } catch (error) {
    console.error("Error triggering task:", error);
    res.status(500).send("Internal Server Error");
  }
});

cron.schedule(
  "0 1 * * *",
  async () => {
    try {
      await consumeFromRabbitMQ();
    } catch (error) {
      console.error("Error in scheduled task:", error);
    }
  },
  {
    timezone: "Europe/Istanbul",
  }
);

app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});
