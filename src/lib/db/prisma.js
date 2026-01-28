"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = __importDefault(require("pg"));
let prisma;
if (process.env.NODE_ENV === 'production') {
    if (process.env.DATABASE_URL) {
        const connectionString = process.env.DATABASE_URL;
        const pool = new pg_1.default.Pool({ connectionString });
        const adapter = new adapter_pg_1.PrismaPg(pool);
        prisma = new client_1.PrismaClient({ adapter });
    }
    else {
        prisma = new client_1.PrismaClient({});
    }
}
else {
    if (!global.prisma) {
        if (process.env.DATABASE_URL) {
            const connectionString = process.env.DATABASE_URL;
            const pool = new pg_1.default.Pool({ connectionString });
            const adapter = new adapter_pg_1.PrismaPg(pool);
            global.prisma = new client_1.PrismaClient({ adapter });
        }
        else {
            global.prisma = new client_1.PrismaClient({});
        }
    }
    prisma = global.prisma;
}
exports.default = prisma;
//# sourceMappingURL=prisma.js.map