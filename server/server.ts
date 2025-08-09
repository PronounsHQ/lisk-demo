import express, { type Request, type Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const { PORT, DB_URL } = process.env;

const port = PORT || 3000;

const server = express();
server.use(cors({ origin: ["http://localhost:5173", "https://pronouns-lisk-demo.vercel.app"] }));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

mongoose.connect(DB_URL!)
  .then(() => {
    console.log("DB connected")
  });

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

const liskTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  tokenName: {
    type: String,
    required: true
  },
  creator: {
    type: String,
    required: true
  }
});

const user = mongoose.model("users", userSchema);
const token = mongoose.model("tokens", liskTokenSchema);


server.get("/", async (req: Request, res: Response) => {
  try {
    const tokens = await token.find();

    res.status(200).json({ message: "tokens fetched", tokens })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" })
  }
});

server.post("/save-token", async (req: Request, res: Response) => {
  try {
    const { name, tokenName, tokenAddress }: { name: string, tokenName: string, tokenAddress: string } = req.body;

    const userExists = await user.findOne({ name });
    if (!userExists) {
      await user.create({ name });
      await token.create({ creator: name, tokenName, token: tokenAddress });

      res.status(201).json({ message: "user and token created in server", name });
      return;
    }

    await token.create({ creator: name, tokenName, token: tokenAddress });

    res.status(201).json({ message: "token created in server" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" })
  }
});
