import { z } from 'zod';
export declare const envValidationSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    PORT: z.ZodDefault<z.ZodNumber>;
    DATABASE_URL: z.ZodString;
    REDIS_HOST: z.ZodDefault<z.ZodString>;
    REDIS_PORT: z.ZodDefault<z.ZodNumber>;
    JWT_SECRET: z.ZodString;
    JWT_EXPIRES_IN: z.ZodString;
    JWT_REFRESH_SECRET: z.ZodString;
    JWT_REFRESH_EXPIRES_IN: z.ZodString;
    FRONTEND_URL: z.ZodString;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    DATABASE_URL: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES_IN: string;
    FRONTEND_URL: string;
}, {
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES_IN: string;
    FRONTEND_URL: string;
    NODE_ENV?: "development" | "production" | "test" | undefined;
    PORT?: number | undefined;
    REDIS_HOST?: string | undefined;
    REDIS_PORT?: number | undefined;
}>;
export type EnvConfig = z.infer<typeof envValidationSchema>;
