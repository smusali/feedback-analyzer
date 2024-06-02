const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const OpenAI = require("openai");
const winston = require("winston");

const app = express();
const port = 3000;

require("dotenv").config();

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

const openai = new OpenAI({
  apiKey: "sk-proj-ElYkymL28xT4mmoVyntpT3BlbkFJB0o6BKJSuW5U7jUKxuLB", // process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(bodyParser.json());

const categories = ["feature request", "bug report", "feature evaluation"];

app.get("/api/categories", (req, res) => {
  logger.info("GET /api/categories");
  res.json(categories);
});

app.post("/api/analyze", async (req, res) => {
  logger.info("POST /api/analyze");
  const { feedback } = req.body;

  const messages = [
    {
      role: "user",
      content: `
        Analyze the following user feedback, categorize it into one of the following categories: ${categories.join(
          ", "
        )}, and perform sentiment analysis.
        Feedback: ${feedback}
        Provide the output in the following JSON schema:
        {
          "category": "",
          "sentiment": ""
        }
      `,
    },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 150,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    logger.info("OpenAI API response: ", JSON.stringify(response, null, 2));

    const resultText = response.choices[0].message.content.trim();
    logger.info("Trimmed result text: ", resultText);

    const result = JSON.parse(resultText);
    logger.info("Parsed result: ", result);

    res.json(result);
  } catch (error) {
    logger.error("Error in analysis: ", JSON.stringify(error, null, 2));
    res.status(500).send(JSON.stringify(error, null, 2));
  }
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
