import express from  "express";
import { Login, logout, Me } from "../controllers/Auth.js";

const router = express.Router();

router.get('/me', Me);
router.post('/login', Login);
router.delete('/logout', logout);

export default router;