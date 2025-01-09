import { prismaClient } from "../lib/db.js";
import { createHmac, randomBytes } from "node:crypto";

export interface createUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

class UserService {
  public static async createUser(payload: createUserPayload) {
    const { email, firstName, password, lastName } = payload;
    const salt = randomBytes(32).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

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
}

export default UserService;
