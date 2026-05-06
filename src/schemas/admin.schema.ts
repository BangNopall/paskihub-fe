import { z } from "zod";

// Base Event Level
const EventLevelSchema = z.object({
  name: z.string(),
  regis_fee: z.string(),
  dp_fee: z.string(),
});

// EO Data
const AdminEventResSchema = z.object({
  id: z.string().uuid().optional(), 
  event_name: z.string(),
  compe_date: z.string(),
  location: z.string(),
  status: z.string(),
  event_levels: z.array(EventLevelSchema).optional().default([]),
});

const AdminStaffResSchema = z.object({
  name: z.string(),
  role: z.string(),
});

const AdminUserEODetailSchema = z.object({
  panitia: z.array(AdminStaffResSchema).optional().default([]),
  events: z.array(AdminEventResSchema).optional().default([]),
});

// Peserta Data
const AdminTeamMemberResSchema = z.object({
  name: z.string(),
  role: z.string(),
});

const AdminTeamResSchema = z.object({
  team_name: z.string(),
  coach: z.string(),
  members_count: z.number(),
  members: z.array(AdminTeamMemberResSchema).optional().default([]),
});

const AdminEventRegistrationResSchema = z.object({
  event_name: z.string(),
  event_level_name: z.string(),
  payment_status: z.string(),
  assessment_status: z.string(),
});

const AdminUserPesertaDetailSchema = z.object({
  teams: z.array(AdminTeamResSchema).optional().default([]),
  event_history: z.array(AdminEventRegistrationResSchema).optional().default([]),
});

// User Response (for list)
export const UserResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  email_is_verified: z.boolean(),
  is_banned: z.boolean().optional().default(false),
  created_at: z.string().optional(),
  role: z.string().optional().default("PESERTA"),
  name: z.string().optional().default("-"), 
  status: z.enum(["Active", "Pending", "Banned"]).optional().default("Active"),
  joined: z.string().optional().default("-"),
});

export const AdminUserListSchema = z.array(UserResponseSchema);

// User Detail Response (Full)
export const AdminUserDetailSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  role: z.string(),
  status: z.string(),
  joined_at: z.string(),
  school_name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  eo_data: AdminUserEODetailSchema.optional(),
  peserta_data: AdminUserPesertaDetailSchema.optional(),
});

export const AdminCreateSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export type UserResponse = z.infer<typeof UserResponseSchema>;
export type AdminUserDetail = z.infer<typeof AdminUserDetailSchema>;
export type AdminCreateInput = z.infer<typeof AdminCreateSchema>;
