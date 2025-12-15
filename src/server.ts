import express, { Request, Response } from "express";
import { AppDataSource } from "./db/data-source";
import { User } from "./entities/User";


const app = express();
const PORT = 4242

app.get('/', async (req: Request, res: Response) => {
    const users = await getAllUsersRepo()
    res.json({
        success: true,
        message: "Hello from Express + TypeScript + Nodemon 🚀",
        users
    });
})

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database initialized properly!");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("DB init failed", err);
    process.exit(1);
  }
};

startServer();




const createUser = async () => {
    const user = new User();
    user.username = "vikas"
    user.password = "kumar"

    const userRepo = AppDataSource.getRepository(User);
    await userRepo.save(user)

    console.log("User saved:", user);
}

const getAllUsersRepo = async (): Promise<User[]> => {
    const userRepo = AppDataSource.getRepository(User);
    const users = userRepo.find();

    return users;
} 
