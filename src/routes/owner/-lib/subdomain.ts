import { z } from "zod";

const RESERVED_SUBDOMAINS = new Set([
    "www",
    "app",
    "api",
    "admin",
    "owner",
    "dashboard",
    "auth",
    "login",
    "signup",
    "mail",
    "smtp",
    "ftp",
    "static",
    "assets",
    "cdn",
    "help",
    "support",
    "status",
    "blog",
    "docs",
]);

export const subdomainSchema = z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Use at least 3 characters.")
    .max(30, "Use at most 30 characters.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens only.")
    .refine((value) => !RESERVED_SUBDOMAINS.has(value), "That subdomain is reserved.");

export const siteNameSchema = z
    .string()
    .trim()
    .min(2, "Use at least 2 characters.")
    .max(60, "Use at most 60 characters.");
