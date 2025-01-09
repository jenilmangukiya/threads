import { emit } from "node:process";
import { prismaClient } from "../lib/db.js";
import { createHmac, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";

// Should come form env var
const JWT_SECRET = "THIS_IS_THE_SECRET";

export interface createUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

class UserService {
  private static generateHashedPssword(salt, password) {
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    return hashedPassword;
  }

  public static async createUser(payload: createUserPayload) {
    const { email, firstName, password, lastName } = payload;
    const salt = randomBytes(32).toString("hex");
    const hashedPassword = UserService.generateHashedPssword(salt, password);

    return await prismaClient.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        salt: salt,
      },
    });
  }

  private static async getUserByEmail(email) {
    return await prismaClient.user.findUnique({ where: { email } });
  }

  public static async getUserToken(payload: {
    email: string;
    password: string;
  }) {
    const user = await UserService.getUserByEmail(payload.email);
    if (!user) throw new Error("User does not exist");

    const userSalt = user.salt;
    const hashedPassword = UserService.generateHashedPssword(
      userSalt,
      payload.password
    );
    // console.log("payload.password", payload.password);
    // console.log("hashedPassword", hashedPassword);
    if (user.password !== hashedPassword) throw new Error("Password incorrect");

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

    return token;
  }
}

export default UserService;
