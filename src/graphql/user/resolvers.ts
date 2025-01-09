import UserService, { createUserPayload } from "../../services/user.js";

const queries = {
  getUserToken: async (_, payload: { email: string; password: string }) => {
    const token = await UserService.getUserToken({
      email: payload.email,
      password: payload.password,
    });

    return token;
  },
  getCurrentLoggedInUser: async (_: any, parameters: any, context: any) => {
    if (context && context.user) {
      const id = context.user.id;
      const user = await UserService.getUserById(id);
      return user;
    }
    throw new Error("I dont know who are you");
  },
};

const mutations = {
  createUser: async (_, payload: createUserPayload) => {
    const user = await UserService.createUser(payload);

    return user.id;
  },
};

export const resolvers = { queries, mutations };
