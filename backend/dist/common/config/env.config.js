"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envValidationSchema = void 0;
const zod_1 = require("zod");
exports.envValidationSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.coerce.number().default(3001),
    DATABASE_URL: zod_1.z.string().url(),
    REDIS_HOST: zod_1.z.string().default('localhost'),
    REDIS_PORT: zod_1.z.coerce.number().default(6379),
    JWT_SECRET: zod_1.z.string(),
    JWT_EXPIRES_IN: zod_1.z.string(),
    JWT_REFRESH_SECRET: zod_1.z.string(),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string(),
    FRONTEND_URL: zod_1.z.string().url(),
});
//# sourceMappingURL=env.config.js.map