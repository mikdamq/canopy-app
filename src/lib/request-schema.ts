import { z } from "zod";
import { LOCALES } from "@/i18n/config";

/**
 * Pilot request: shared by the form (client-side checks) and the API route.
 * Options are stored as stable ids; labels come from the dictionaries.
 */
export const ROLES = ["owner", "grow", "ops", "investor", "other"] as const;
export const FARM_TYPES = ["tower", "container", "indoor", "greenhouse", "other"] as const;
export const CROPS = ["leafy", "herbs", "microgreens", "strawberries", "tomatoes", "mushrooms"] as const;
export const MONITORING = ["software", "sheets", "paper", "none"] as const;
export const GOALS = ["remote", "loss", "energy", "planning", "investors"] as const;

const text = (max: number) => z.string().trim().max(max);

export const requestSchema = z.object({
  locale: z.enum(LOCALES),
  source: text(40).default("landing"),
  // About you
  name: text(100).min(2),
  email: z.email().max(200),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s\-().]{7,22}$/),
  role: z.enum(ROLES),
  country: text(60).min(2),
  // Your farm
  farmName: text(80).min(1),
  farmType: z.enum(FARM_TYPES),
  areaM2: z.coerce.number().positive().max(1_000_000),
  levels: z.coerce.number().int().min(1).max(500),
  crops: z.array(z.enum(CROPS)).max(CROPS.length),
  cropsOther: text(200).default(""),
  monitoring: z.enum(MONITORING),
  sensorBrand: text(120).default(""),
  // Your goals
  goals: z.array(z.enum(GOALS)).min(1).max(GOALS.length),
  message: text(2000).default(""),
  consent: z.literal(true),
});

export type PilotRequest = z.infer<typeof requestSchema>;

/** Which fields each form step owns, for step-by-step validation. */
export const STEP_FIELDS = [
  ["name", "email", "phone", "role", "country"],
  ["farmName", "farmType", "areaM2", "levels", "crops", "cropsOther", "monitoring", "sensorBrand"],
  ["goals", "message", "consent"],
] as const satisfies readonly (readonly (keyof PilotRequest)[])[];

export type FieldName = (typeof STEP_FIELDS)[number][number];
