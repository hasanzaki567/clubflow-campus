export interface Sponsorship {
  id: string;
  title: string;
  description?: string;
  sponsor_name: string;
  sponsor_type: 'corporate' | 'individual' | 'alumni' | 'government' | 'foundation' | 'other';
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  address?: string;
  category: 'events' | 'clubs' | 'infrastructure' | 'academic' | 'sports' | 'cultural' | 'scholarships' | 'other';
  sponsorship_type: 'monetary' | 'in_kind' | 'services' | 'venue' | 'equipment' | 'other';
  amount?: number;
  currency: string;
  status: 'prospecting' | 'proposal_sent' | 'negotiating' | 'approved' | 'active' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  fiscal_year: string;
  start_date?: string;
  end_date?: string;
  duration_months?: number;
  renewal_status: 'not_applicable' | 'upcoming' | 'renewed' | 'expired';
  benefits: string[];
  deliverables: string[];
  contract_url?: string;
  assigned_to?: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  activated_at?: string;
  completed_at?: string;
  notes?: string;
  tags: string[];
  assigned_to_name?: string;
  created_by_name?: string;
}

export interface SponsorshipBenefit {
  id: string;
  sponsorship_id: string;
  benefit_type: 'branding' | 'naming_rights' | 'advertising' | 'product_placement' | 'hospitality' | 'networking' | 'other';
  description: string;
  value?: number;
  currency: string;
  is_delivered: boolean;
  delivery_date?: string;
  notes?: string;
}

export interface SponsorshipDeliverable {
  id: string;
  sponsorship_id: string;
  deliverable_type: 'logo_placement' | 'banner_ads' | 'social_media' | 'email_blast' | 'event_tickets' | 'naming_rights' | 'other';
  description: string;
  due_date?: string;
  is_completed: boolean;
  completed_date?: string;
  completion_notes?: string;
}

export interface SponsorshipStats {
  total_sponsorships: number;
  active_sponsorships: number;
  prospecting_sponsorships: number;
  total_sponsored_amount: number;
  upcoming_renewals: number;
}

export interface CreateSponsorshipRequest {
  title: string;
  description?: string;
  sponsor_name: string;
  sponsor_type: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  address?: string;
  category: string;
  sponsorship_type: string;
  amount?: number;
  currency?: string;
  status?: string;
  priority?: string;
  fiscal_year: string;
  start_date?: string;
  end_date?: string;
  duration_months?: number;
  renewal_status?: string;
  benefits?: string[];
  deliverables?: string[];
  contract_url?: string;
  assigned_to?: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateSponsorshipRequest {
  title?: string;
  description?: string;
  sponsor_name?: string;
  sponsor_type?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  address?: string;
  category?: string;
  sponsorship_type?: string;
  amount?: number;
  currency?: string;
  status?: string;
  priority?: string;
  fiscal_year?: string;
  start_date?: string;
  end_date?: string;
  duration_months?: number;
  renewal_status?: string;
  benefits?: string[];
  deliverables?: string[];
  contract_url?: string;
  assigned_to?: string;
  notes?: string;
  tags?: string[];
}

export interface CreateSponsorshipBenefitRequest {
  sponsorship_id: string;
  benefit_type: string;
  description: string;
  value?: number;
  currency?: string;
  is_delivered?: boolean;
  delivery_date?: string;
  notes?: string;
}

export interface CreateSponsorshipDeliverableRequest {
  sponsorship_id: string;
  deliverable_type: string;
  description: string;
  due_date?: string;
  is_completed?: boolean;
  completed_date?: string;
  completion_notes?: string;
}
