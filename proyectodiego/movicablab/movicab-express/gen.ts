
import "dotenv/config";
import { signAccessToken } from "./src/shared/auth/jwt";
console.log("ADMIN=" + signAccessToken({id:4, username:"admin"}).token);
console.log("SELLER=" + signAccessToken({id:5, username:"seller"}).token);
