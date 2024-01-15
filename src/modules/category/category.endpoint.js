import { roles } from "../../middleware/auth.js"

export const endPoint={
    create:[roles.Admin],
    update:[roles.Admin],
    spesific:[roles.Admin,roles.User],
    getAll:[roles.Admin],
    delete:[roles.Admin]
}