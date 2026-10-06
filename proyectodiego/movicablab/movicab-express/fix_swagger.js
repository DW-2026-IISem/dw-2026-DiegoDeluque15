const fs = require("fs");
let swagger = fs.readFileSync("src/swagger/index.ts", "utf8");

let target = `    servers: [
      {
        url: http://localhost:,
        description: "Local",
      },
    ],`;

let replacement = `    servers: [
      {
        url: \`http://localhost:\${process.env.PORT || 4000}\`,
        description: "Local",
      },
    ],`;

swagger = swagger.replace(target, replacement);
fs.writeFileSync("src/swagger/index.ts", swagger);
console.log("Fixed swagger");
