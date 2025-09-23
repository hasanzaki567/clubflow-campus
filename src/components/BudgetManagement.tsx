import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  Calendar,
  Building,
  Users,
  Target,
  PieChart,
  BarChart3,
  Download,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
  Wallet,
  Receipt,
  FileText,
  Calculator,
  Banknote,
  CreditCard,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Settings
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import type { Budget, BudgetTransaction } from '@/types/budget';

interface BudgetManagementProps {
  className?: string;
}

const BudgetManagement: React.FC<BudgetManagementProps> = ({ className = '' }) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<BudgetTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateBudget, setShowCreateBudget] = useState(false);
  const [showCreateTransaction, setShowCreateTransaction] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  // Form states
  const [budgetForm, setBudgetForm] = useState({
    title: '',
    description: '',
    category: 'events',
    type: 'allocated',
    amount: '',
    currency: 'USD',
    status: 'pending',
    priority: 'medium',
    fiscal_year: new Date().getFullYear().toString(),
    fiscal_period: 'Q1',
    department: '',
    club_id: '',
    event_id: '',
    start_date: '',
    end_date: '',
    notes: '',
    tags: []
  });

  const [transactionForm, setTransactionForm] = useState({
    budget_id: '',
    transaction_type: 'expense',
    amount: '',
    description: '',
    category: '',
    vendor: '',
    invoice_number: '',
    receipt_url: '',
    transaction_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    loadBudgets();
    loadTransactions();
  }, []);

  const loadBudgets = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getBudgets();
      setBudgets(response);
    } catch (error) {
      console.error('Failed to load budgets:', error);
      toast.error('Failed to load budgets');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      // This would be implemented when we have the transactions endpoint
      setTransactions([]);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  const handleCreateBudget = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.createBudget(budgetForm);
      toast.success('Budget created successfully');
      setShowCreateBudget(false);
      setBudgetForm({
        title: '',
        description: '',
        category: 'events',
        type: 'allocated',
        amount: '',
        currency: 'USD',
        status: 'pending',
        priority: 'medium',
        fiscal_year: new Date().getFullYear().toString(),
        fiscal_period: 'Q1',
        department: '',
        club_id: '',
        event_id: '',
        start_date: '',
        end_date: '',
        notes: '',
        tags: []
      });
      loadBudgets();
    } catch (error) {
      console.error('Failed to create budget:', error);
      toast.error('Failed to create budget');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveBudget = async (budgetId: string) => {
    try {
      await apiClient.approveBudget(budgetId);
      toast.success('Budget approved successfully');
      loadBudgets();
    } catch (error) {
      console.error('Failed to approve budget:', error);
      toast.error('Failed to approve budget');
    }
  };

  const handleDeleteBudget = async (budgetId: string) => {
    try {
      await apiClient.deleteBudget(budgetId);
      toast.success('Budget deleted successfully');
      loadBudgets();
    } catch (error) {
      console.error('Failed to delete budget:', error);
      toast.error('Failed to delete budget');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'events': return <Calendar className="h-4 w-4" />;
      case 'clubs': return <Users className="h-4 w-4" />;
      case 'infrastructure': return <Building className="h-4 w-4" />;
      case 'academic': return <Target className="h-4 w-4" />;
      case 'sports': return <Activity className="h-4 w-4" />;
      case 'cultural': return <PieChart className="h-4 w-4" />;
      default: return <Wallet className="h-4 w-4" />;
    }
  };

  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         budget.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || budget.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || budget.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const budgetStats = {
    total: budgets.length,
    approved: budgets.filter(b => b.status === 'approved').length,
    pending: budgets.filter(b => b.status === 'pending').length,
    totalAmount: budgets.reduce((sum, b) => sum + (b.status === 'approved' ? b.amount : 0), 0),
    spentAmount: budgets.reduce((sum, b) => sum + b.spent_amount, 0),
    remainingAmount: budgets.reduce((sum, b) => sum + b.remaining_amount, 0)
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            Budget Management
          </h2>
          <p className="text-muted-foreground mt-1">Professional financial planning and budget tracking</p>
        </div>

        <div className="flex gap-3">
          <Dialog open={showCreateBudget} onOpenChange={setShowCreateBudget}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Budget</DialogTitle>
                <DialogDescription>
                  Set up a new budget allocation with detailed specifications
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Budget Title *</Label>
                    <Input
                      id="title"
                      value={budgetForm.title}
                      onChange={(e) => setBudgetForm({...budgetForm, title: e.target.value})}
                      placeholder="Enter budget title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={budgetForm.category} onValueChange={(value) => setBudgetForm({...budgetForm, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="events">Events</SelectItem>
                        <SelectItem value="clubs">Clubs</SelectItem>
                        <SelectItem value="infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="cultural">Cultural</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="type">Budget Type *</Label>
                    <Select value={budgetForm.type} onValueChange={(value) => setBudgetForm({...budgetForm, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="allocated">Allocated</SelectItem>
                        <SelectItem value="requested">Requested</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="spent">Spent</SelectItem>
                        <SelectItem value="projected">Projected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={budgetForm.amount}
                      onChange={(e) => setBudgetForm({...budgetForm, amount: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={budgetForm.priority} onValueChange={(value) => setBudgetForm({...budgetForm, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="fiscal_year">Fiscal Year *</Label>
                    <Input
                      id="fiscal_year"
                      value={budgetForm.fiscal_year}
                      onChange={(e) => setBudgetForm({...budgetForm, fiscal_year: e.target.value})}
                      placeholder="2024"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={budgetForm.description}
                      onChange={(e) => setBudgetForm({...budgetForm, description: e.target.value})}
                      placeholder="Budget description and purpose"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={budgetForm.department}
                      onChange={(e) => setBudgetForm({...budgetForm, department: e.target.value})}
                      placeholder="Department name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={budgetForm.start_date}
                      onChange={(e) => setBudgetForm({...budgetForm, start_date: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={budgetForm.end_date}
                      onChange={(e) => setBudgetForm({...budgetForm, end_date: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={budgetForm.notes}
                      onChange={(e) => setBudgetForm({...budgetForm, notes: e.target.value})}
                      placeholder="Additional notes"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowCreateBudget(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateBudget}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {isLoading ? 'Creating...' : 'Create Budget'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Budgets</p>
                <p className="text-2xl font-bold text-blue-900">{budgetStats.total}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <Wallet className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Approved</p>
                <p className="text-2xl font-bold text-green-900">{budgetStats.approved}</p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">{budgetStats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-500 rounded-full">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Allocated</p>
                <p className="text-2xl font-bold text-purple-900">${budgetStats.totalAmount.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <PiggyBank className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="budgets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="budgets" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Budgets
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="budgets" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search budgets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="clubs">Clubs</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Budgets Table */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>Manage and track all budget allocations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Budget</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBudgets.map((budget) => {
                    const spentPercentage = budget.amount > 0 ? (budget.spent_amount / budget.amount) * 100 : 0;

                    return (
                      <TableRow key={budget.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{budget.title}</p>
                            <p className="text-sm text-muted-foreground">{budget.fiscal_year} - {budget.fiscal_period}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(budget.category)}
                            <span className="capitalize">{budget.category}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">${budget.amount.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{budget.currency}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>${budget.spent_amount.toLocaleString()}</span>
                              <span>${budget.remaining_amount.toLocaleString()}</span>
                            </div>
                            <Progress value={spentPercentage} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(budget.status)}>
                            {budget.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(budget.priority)}>
                            {budget.priority.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {budget.status === 'pending' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApproveBudget(budget.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Budget</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{budget.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteBudget(budget.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete Budget
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget Transactions</CardTitle>
              <CardDescription>Track all financial transactions and expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Transaction management coming soon...</p>
                <p className="text-sm">This feature will allow you to track all budget expenses and transfers.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Distribution</CardTitle>
                <CardDescription>Budget allocation by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['events', 'clubs', 'infrastructure', 'academic', 'sports', 'cultural'].map((category) => {
                    const categoryBudgets = budgets.filter(b => b.category === category && b.status === 'approved');
                    const total = categoryBudgets.reduce((sum, b) => sum + b.amount, 0);

                    if (total === 0) return null;

                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(category)}
                          <span className="capitalize font-medium">{category}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${total.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {categoryBudgets.length} budget{categoryBudgets.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>Overall budget performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <ArrowUpRight className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">Total Allocated</p>
                        <p className="text-sm text-green-700">Approved budgets</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-green-900">${budgetStats.totalAmount.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <ArrowDownRight className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">Total Spent</p>
                        <p className="text-sm text-blue-700">Actual expenses</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">${budgetStats.spentAmount.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3">
                      <PiggyBank className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-purple-900">Remaining</p>
                        <p className="text-sm text-purple-700">Available funds</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-purple-900">${budgetStats.remainingAmount.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetManagement;
