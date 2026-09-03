import localStorageClient from "../storage/localStorageClient";

const COLLECTION = "users";
const ID_PREFIX = "GLT-U";

localStorageClient.seedIfEmpty(COLLECTION, [
  {
    id: "GLT-U-000001",
    name: "Admin User",
    email: "admin@glthealthcare.com",
    role: "ADMIN",
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);

export const userService = {
  getUsers: () => localStorageClient.getAll(COLLECTION),
  getUserById: (id) => localStorageClient.getById(COLLECTION, id),
  createUser: (payload) =>
    localStorageClient.create(COLLECTION, payload, { idPrefix: ID_PREFIX }),
  updateUser: (id, payload) => localStorageClient.update(COLLECTION, id, payload),
  deleteUser: (id) => localStorageClient.remove(COLLECTION, id),
};

export default userService;
