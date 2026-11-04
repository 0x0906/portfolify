import { Router } from "express"
import {
  getUserPortfolios,
  getMyPortfolio,
  createPortfolio,
  updatePortfolioMeta,
  checkUsername,
  updateUsername,
  publishPortfolio,
  unpublishPortfolio,
  deletePortfolio,
} from "../controllers/portfolioController.js"
import { savePortfolioContent } from "../controllers/portfolioContentController.js"
import { requireAuth, requireVerifiedUser } from "../middleware/auth.js"

const router = Router()

router.get("/me", requireAuth, getMyPortfolio)
router.get("/list", requireAuth, getUserPortfolios)
router.post("/", requireVerifiedUser, createPortfolio)
router.patch("/me", requireVerifiedUser, updatePortfolioMeta)
router.put("/me/content", requireVerifiedUser, savePortfolioContent)
router.delete("/me", requireVerifiedUser, deletePortfolio)

router.get("/username/check", checkUsername)
router.patch("/username", requireVerifiedUser, updateUsername)

router.post("/publish", requireVerifiedUser, publishPortfolio)
router.post("/unpublish", requireVerifiedUser, unpublishPortfolio)

router.get("/:id", requireAuth, getMyPortfolio)
router.patch("/:id", requireVerifiedUser, updatePortfolioMeta)
router.put("/:id/content", requireVerifiedUser, savePortfolioContent)
router.delete("/:id", requireVerifiedUser, deletePortfolio)
router.post("/:id/publish", requireVerifiedUser, publishPortfolio)
router.post("/:id/unpublish", requireVerifiedUser, unpublishPortfolio)
router.patch("/:id/username", requireVerifiedUser, updateUsername)

export default router
