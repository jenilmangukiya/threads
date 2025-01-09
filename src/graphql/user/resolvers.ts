import { prismaClient } from "../../lib/db.js";

const queries = {};
const mutations = {
  createUser: async (
    _,
    { firstName, lastName, email, password }: { [key: string]: string }
  ) => {
    // const user = await prismaClient.user.create({
    //   data: { email, firstName, lastName, password, salt: "salt" },
    // });

    return "user.id";
  },
};

export const resolvers = { queries, mutations };
