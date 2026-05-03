import {
  UnifiedAssessment,
  UnifiedAssessmentSchema,
  ViolationType,
  ViolationTypeSchema,
  ScoreCategory,
  ScoreCategorySchema,
  ScoreSubCategory,
  ScoreSubCategorySchema,
} from "@/schemas/assessment.schema"

const API_URL = process.env.API_BASE_URL || "http://localhost:3010"
const API_KEY = process.env.API_KEY

export const assessmentService = {
  async getUnifiedAssessment(
    eventId: string,
    levelId: string,
    token: string
  ): Promise<UnifiedAssessment> {
    const res = await fetch(
      `${API_URL}/api/v1/eo/events/${eventId}/assessment/unified?level_id=${levelId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    )
    if (!res.ok) {
      throw new Error("Failed to fetch assessment data")
    }
    const data = await res.json()
    return UnifiedAssessmentSchema.parse(data.data)
  },

  // Violations
  async createViolation(eventId: string, data: any, token: string) {
    const res = await fetch(
      `${API_URL}/api/v1/eo/events/${eventId}/assessment/violation-types`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    )
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to create violation")
    }
    return res.json()
  },

  async updateViolation(eventId: string, id: string, data: any, token: string) {
    const res = await fetch(
      `${API_URL}/api/v1/eo/events/${eventId}/assessment/violation-types/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    )
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to update violation")
    }
    return res.json()
  },

  async deleteViolation(eventId: string, id: string, token: string) {
    const res = await fetch(
      `${API_URL}/api/v1/eo/events/${eventId}/assessment/violation-types/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to delete violation")
    }
    return res.json()
  },

  // Categories
  async createCategory(eventId: string, data: any, token: string) {
    const res = await fetch(
      `${API_URL}/api/v1/eo/events/${eventId}/assessment/score-categories`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    )
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to create category")
    }
    return res.json()
  },

  async updateCategory(eventId: string, id: string, data: any, token: string) {
    const res = await fetch(
      `${API_URL}/api/v1/eo/events/${eventId}/assessment/score-categories/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    )
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to update category")
    }
    return res.json()
  },

  async deleteCategory(eventId: string, id: string, token: string) {
    const res = await fetch(
      `${API_URL}/api/v1/eo/events/${eventId}/assessment/score-categories/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to delete category")
    }
    return res.json()
  },

  // Sub-Categories
  async createSubCategory(eventId: string, data: any, token: string) {
    const res = await fetch(
      `${API_URL}/api/v1/eo/events/${eventId}/assessment/score-sub-categories`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    )
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to create sub-category")
    }
    return res.json()
  },

  async updateSubCategory(
    eventId: string,
    id: string,
    data: any,
    token: string
  ) {
    const res = await fetch(
      `${API_URL}/api/v1/eo/events/${eventId}/assessment/score-sub-categories/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    )
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to update sub-category")
    }
    return res.json()
  },

  async deleteSubCategory(eventId: string, id: string, token: string) {
    const res = await fetch(
      `${API_URL}/api/v1/eo/events/${eventId}/assessment/score-sub-categories/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Failed to delete sub-category")
    }
    return res.json()
  },
}
