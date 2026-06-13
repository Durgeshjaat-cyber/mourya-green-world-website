import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import dashboardRouter from "./dashboard";
import categoriesRouter from "./categories";
import plantsRouter from "./plants";
import galleryRouter from "./gallery";
import inquiriesRouter from "./inquiries";
import siteSettingsRouter from "./siteSettings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(dashboardRouter);
router.use(categoriesRouter);
router.use(plantsRouter);
router.use(galleryRouter);
router.use(inquiriesRouter);
router.use(siteSettingsRouter);

export default router;
