import "./telemetry";
import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(express.json());

app.get("/api", (_req, res) => {
  res.json({ service: "vnext-api", version: "1.0.0" });
});

app.get("/api/items", async (_req, res) => {
  const items = await prisma.item.findMany();
  res.json(items);
});

app.post("/api/items", async (req, res) => {
  const { name } = req.body;
  const item = await prisma.item.create({ data: { name } });
  res.status(201).json(item);
});

app.delete("/api/items/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await prisma.item.delete({ where: { id } });
  res.sendStatus(204);
});

app.get("/health", (_req, res) => {
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
