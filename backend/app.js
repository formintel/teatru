import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user-routes.js";
import adminRouter from "./routes/admin-routes.js";
import movieRouter from "./routes/movie-routes.js";
import bookingRouter from "./routes/booking-routes.js";
import notificationRouter from "./routes/notification-routes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security headers with custom configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "http://localhost:5000"],
      "media-src": ["'self'", "data:", "http://localhost:5000"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: "http://localhost:3000", // URL-ul frontend-ului
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// middlewares
app.use(express.json());

// Logging middleware - logare selectivă
app.use((req, res, next) => {
  // Ignorăm logarea pentru fișiere statice și alte rute frecvente
  if (req.url.startsWith('/uploads/') || 
      (req.method === 'GET' && req.url === '/movie') ||
      req.url === '/favicon.ico') {
    return next();
  }

  // Logăm doar operațiile importante
  const importantOperations = [
    'POST /booking',
    'POST /admin/login',
    'POST /user/login',
    'POST /user/signup',
    'POST /movie',
    'PUT /movie',
    'DELETE /movie',
    'POST /admin/statistics'
  ];

  const currentOperation = `${req.method} ${req.url}`;
  if (importantOperations.some(op => currentOperation.startsWith(op))) {
    console.log(`\n[${new Date().toLocaleString()}] ${currentOperation}`);
    // Logăm doar datele nesensibile pentru operațiile importante
    const safeBody = { ...req.body };
    if (safeBody.password) {
      safeBody.password = "******";
    }
    console.log("Request data:", safeBody);
  }

  next();
});

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingRouter);
app.use("/notification", notificationRouter);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    directConnection: true
  })
  .then(() =>
    app.listen(5000, () =>
      console.log("Connected To Database And Server is running")
    )
  )
  .catch((e) => console.log(e));
