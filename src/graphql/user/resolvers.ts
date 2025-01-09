import UserService, { createUserPayload } from "../../services/user.js";

const queries = {
  getUserToken: async (_, payload: { email: string; password: string }) => {
    const token = await UserService.getUserToken({
      email: payload.email,
      password: payload.password,
    });

    return token;
  },
};
const mutations = {
  createUser: async (_, payload: createUserPayload) => {
    const user = await UserService.createUser(payload);

    return user.id;
  },
};

export const resolvers = { queries, mutations };
