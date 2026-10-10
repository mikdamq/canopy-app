import { z } from "zod";
import { LOCALES } from "@/i18n/config";

/**
 * Pilot request: shared by the form (client-side checks) and the API route.
 * Options are stored as stable ids; labels come from the dictionaries.
 */
export const ROLES = ["owner", "grow", "ops", "investor", "other"] as const;
export const FARM_TYPES = ["tower", "container", "indoor", "greenhouse", "lab", "other"] as const;
export const CROPS = ["leafy", "herbs", "microgreens", "strawberries", "tomatoes", "mushrooms"] as const;
export const MONITORING = ["software", "sheets", "paper", "none"] as const;
export const GOALS = ["remote", "loss", "energy", "planning", "investors"] as const;

const text = (max: number) => z.string().trim().max(max);

/**
 * The short form: only what we need to reply. Everything else is optional and
 * sent afterwards with `detailsSchema` (it only reaches the team).
 */
export const requestSchema = z.object({
  locale: z.enum(LOCALES),
  source: text(40).default("landing"),
  farmName: text(80).min(1),
  farmType: z.enum(FARM_TYPES),
  name: text(100).min(2),
  email: z.email().max(200),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s\-().]{7,22}$/),
  country: text(60).min(2),
  consent: z.literal(true),
});

export type PilotRequest = z.infer<typeof requestSchema>;
/** A request as stored and emailed (consent is implied by having sent it). */
export type RequestBasics = Omit<PilotRequest, "consent">;

/** The short form's fields, in the order they're shown (and checked). */
export const FORM_FIELDS = ["farmName", "farmType", "name", "email", "phone", "country", "consent"] as const satisfies readonly (keyof PilotRequest)[];

export type FieldName = (typeof FORM_FIELDS)[number];

/** Blank number boxes count as "not given"; anything else must be a real number. */
const optionalNumber = (schema: z.ZodNumber) =>
  z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : v), z.coerce.number().pipe(schema).optional());

/** "Tell us more": every answer is optional. */
export const detailsSchema = z.object({
  role: z.enum(ROLES).optional(),
  areaM2: optionalNumber(z.number().positive().max(1_000_000)),
  levels: optionalNumber(z.number().int().min(1).max(500)),
  crops: z.array(z.enum(CROPS)).max(CROPS.length).default([]),
  cropsOther: text(200).default(""),
  monitoring: z.enum(MONITORING).optional(),
  sensorBrand: text(120).default(""),
  goals: z.array(z.enum(GOALS)).max(GOALS.length).default([]),
  message: text(2000).default(""),
});

export type PilotDetails = z.infer<typeof detailsSchema>;
export type DetailName = keyof PilotDetails;

/** True when at least one optional answer was given. */
export const hasDetails = (d: PilotDetails) =>
  Boolean(d.role || d.areaM2 || d.levels || d.crops.length || d.cropsOther || d.monitoring || d.sensorBrand || d.goals.length || d.message);
