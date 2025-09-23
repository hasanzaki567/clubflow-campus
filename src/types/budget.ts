export interface Budget {
  id: string;
  title: string;
  description?: string;
  category: 'events' | 'clubs' | 'infrastructure' | 'academic' | 'sports' | 'cultural' | 'other';
  type: 'allocated' | 'requested' | 'approved' | 'spent' | 'projected';
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  fiscal_year: string;
  fiscal_period: string;
  allocated_by?: number;
  approved_by?: number;
  requested_by?: number;
  department?: string;
  club_id?: number;
  event_id?: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  spent_amount: number;
  remaining_amount: number;
  notes?: string;
  tags: string[];
  attachments?: string[];
  allocated_by_name?: string;
  approved_by_name?: string;
  requested_by_name?: string;
  club_name?: string;
  event_title?: string;
}

export interface BudgetTransaction {
  id: string;
  budget_id: string;
  transaction_type: 'allocation' | 'expense' | 'transfer' | 'refund' | 'adjustment';
  amount: number;
  description?: string;
  category?: string;
  vendor?: string;
  invoice_number?: string;
  receipt_url?: string;
  transaction_date: string;
  processed_by?: number;
  approved_by?: number;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  created_at: string;
  processed_at?: string;
  approved_at?: string;
  notes?: string;
  processed_by_name?: string;
  approved_by_name?: string;
  budget_title?: string;
}

export interface BudgetStats {
  total_budgets: number;
  approved_budgets: number;
  pending_budgets: number;
  total_allocated: number;
  total_spent: number;
  total_remaining: number;
}

export interface CreateBudgetRequest {
  title: string;
  description?: string;
  category: string;
  type: string;
  amount: number;
  currency?: string;
  status?: string;
  priority?: string;
  fiscal_year: string;
  fiscal_period: string;
  department?: string;
  club_id?: string;
  event_id?: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateBudgetRequest {
  title?: string;
  description?: string;
  category?: string;
  type?: string;
  amount?: number;
  currency?: string;
  status?: string;
  priority?: string;
  fiscal_year?: string;
  fiscal_period?: string;
  department?: string;
  club_id?: string;
  event_id?: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
  tags?: string[];
}

export interface CreateBudgetTransactionRequest {
  budget_id: string;
  transaction_type: string;
  amount: number;
  description?: string;
  category?: string;
  vendor?: string;
  invoice_number?: string;
  receipt_url?: string;
  transaction_date: string;
  notes?: string;
}
