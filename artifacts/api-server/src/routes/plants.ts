import { Router } from "express";
import { db, plantsTable, categoriesTable } from "@workspace/db";
import { eq, like, and, type SQL } from "drizzle-orm";
import {
  CreatePlantBody,
  UpdatePlantBody,
  GetPlantParams,
  UpdatePlantParams,
  DeletePlantParams,
  ListPlantsQueryParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth";
import { logActivity } from "../lib/activity";

const router = Router();

function serializePlant(plant: any, categoryName?: string | null) {
  return {
    ...plant,
    categoryName: categoryName ?? null,
    createdAt: plant.createdAt instanceof Date ? plant.createdAt.toISOString() : plant.createdAt,
  };
}

router.get("/plants", async (req, res) => {
  const parsed = ListPlantsQueryParams.safeParse({
    categoryId: req.query.categoryId ? Number(req.query.categoryId) : undefined,
    featured: req.query.featured !== undefined ? req.query.featured === "true" : undefined,
    search: req.query.search,
  });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const conditions: SQL[] = [];
  if (parsed.data.categoryId !== undefined) conditions.push(eq(plantsTable.categoryId, parsed.data.categoryId));
  if (parsed.data.featured !== undefined) conditions.push(eq(plantsTable.featured, parsed.data.featured));
  if (parsed.data.search) conditions.push(like(plantsTable.name, `%${parsed.data.search}%`));

  const plants = conditions.length > 0
    ? await db.select().from(plantsTable).where(and(...conditions)).orderBy(plantsTable.name)
    : await db.select().from(plantsTable).orderBy(plantsTable.name);

  const categories = await db.select().from(categoriesTable);
  const catMap = new Map(categories.map((c) => [c.id, c.name]));

  res.json(plants.map((p) => serializePlant(p, p.categoryId ? catMap.get(p.categoryId) : null)));
});

router.get("/plants/featured", async (_req, res) => {
  const plants = await db.select().from(plantsTable).where(eq(plantsTable.featured, true)).limit(8);
  const categories = await db.select().from(categoriesTable);
  const catMap = new Map(categories.map((c) => [c.id, c.name]));
  res.json(plants.map((p) => serializePlant(p, p.categoryId ? catMap.get(p.categoryId) : null)));
});

router.post("/plants", requireAdmin, async (req, res) => {
  const parsed = CreatePlantBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const [row] = await db.insert(plantsTable).values({ ...parsed.data, featured: parsed.data.featured ?? false }).returning();
  const categories = await db.select().from(categoriesTable);
  const catMap = new Map(categories.map((c) => [c.id, c.name]));
  await logActivity("plant", `Added plant: ${row.name}`);
  res.status(201).json(serializePlant(row, row.categoryId ? catMap.get(row.categoryId) : null));
});

router.get("/plants/:id", async (req, res) => {
  const parsed = GetPlantParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [plant] = await db.select().from(plantsTable).where(eq(plantsTable.id, parsed.data.id));
  if (!plant) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const [cat] = plant.categoryId
    ? await db.select().from(categoriesTable).where(eq(categoriesTable.id, plant.categoryId))
    : [];
  res.json(serializePlant(plant, cat?.name ?? null));
});

router.patch("/plants/:id", requireAdmin, async (req, res) => {
  const paramParsed = UpdatePlantParams.safeParse({ id: Number(req.params.id) });
  if (!paramParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const bodyParsed = UpdatePlantBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const [row] = await db.update(plantsTable).set(bodyParsed.data).where(eq(plantsTable.id, paramParsed.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const categories = await db.select().from(categoriesTable);
  const catMap = new Map(categories.map((c) => [c.id, c.name]));
  await logActivity("plant", `Updated plant: ${row.name}`);
  res.json(serializePlant(row, row.categoryId ? catMap.get(row.categoryId) : null));
});

router.delete("/plants/:id", requireAdmin, async (req, res) => {
  const parsed = DeletePlantParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [row] = await db.delete(plantsTable).where(eq(plantsTable.id, parsed.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  await logActivity("plant", `Deleted plant: ${row.name}`);
  res.json({ message: "Deleted" });
});

export default router;
