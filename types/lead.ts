import { Lead, LeadStatus } from '@prisma/client'

export type { Lead, LeadStatus }

export interface LeadFormData {
  name: string
  email: string
  phone?: string
  company?: string
  status: LeadStatus
  source?: string
  notes?: string
}

