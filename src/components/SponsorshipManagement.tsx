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
  Handshake,
  Users,
  Building,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  Calendar,
  Target,
  DollarSign,
  TrendingUp,
  Award,
  Star,
  Globe,
  Mail,
  Phone,
  MapPin,
  FileText,
  Link,
  CheckCircle2,
  Clock,
  AlertCircle,
  Heart,
  Gift,
  Briefcase,
  GraduationCap,
  Trophy,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Settings,
  ExternalLink,
  Download,
  Upload
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import type { Sponsorship, SponsorshipBenefit, SponsorshipDeliverable } from '@/types/sponsorship';

interface SponsorshipManagementProps {
  className?: string;
}

const SponsorshipManagement: React.FC<SponsorshipManagementProps> = ({ className = '' }) => {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateSponsorship, setShowCreateSponsorship] = useState(false);
  const [selectedSponsorship, setSelectedSponsorship] = useState<Sponsorship | null>(null);

  // Form states
  const [sponsorshipForm, setSponsorshipForm] = useState({
    title: '',
    description: '',
    sponsor_name: '',
    sponsor_type: 'corporate',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    website: '',
    address: '',
    category: 'events',
    sponsorship_type: 'monetary',
    amount: '',
    currency: 'USD',
    status: 'prospecting',
    priority: 'medium',
    fiscal_year: new Date().getFullYear().toString(),
    start_date: '',
    end_date: '',
    duration_months: '',
    renewal_status: 'not_applicable',
    benefits: [] as string[],
    deliverables: [] as string[],
    contract_url: '',
    assigned_to: '',
    notes: '',
    tags: [] as string[]
  });

  useEffect(() => {
    loadSponsorships();
  }, []);

  const loadSponsorships = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getSponsorships();
      setSponsorships(response);
    } catch (error) {
      console.error('Failed to load sponsorships:', error);
      toast.error('Failed to load sponsorships');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSponsorship = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.createSponsorship(sponsorshipForm);
      toast.success('Sponsorship created successfully');
      setShowCreateSponsorship(false);
      setSponsorshipForm({
        title: '',
        description: '',
        sponsor_name: '',
        sponsor_type: 'corporate',
        contact_person: '',
        contact_email: '',
        contact_phone: '',
        website: '',
        address: '',
        category: 'events',
        sponsorship_type: 'monetary',
        amount: '',
        currency: 'USD',
        status: 'prospecting',
        priority: 'medium',
        fiscal_year: new Date().getFullYear().toString(),
        start_date: '',
        end_date: '',
        duration_months: '',
        renewal_status: 'not_applicable',
        benefits: [],
        deliverables: [],
        contract_url: '',
        assigned_to: '',
        notes: '',
        tags: []
      });
      loadSponsorships();
    } catch (error) {
      console.error('Failed to create sponsorship:', error);
      toast.error('Failed to create sponsorship');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveSponsorship = async (sponsorshipId: string) => {
    try {
      await apiClient.approveSponsorship(sponsorshipId);
      toast.success('Sponsorship approved successfully');
      loadSponsorships();
    } catch (error) {
      console.error('Failed to approve sponsorship:', error);
      toast.error('Failed to approve sponsorship');
    }
  };

  const handleActivateSponsorship = async (sponsorshipId: string) => {
    try {
      await apiClient.activateSponsorship(sponsorshipId);
      toast.success('Sponsorship activated successfully');
      loadSponsorships();
    } catch (error) {
      console.error('Failed to activate sponsorship:', error);
      toast.error('Failed to activate sponsorship');
    }
  };

  const handleDeleteSponsorship = async (sponsorshipId: string) => {
    try {
      await apiClient.deleteSponsorship(sponsorshipId);
      toast.success('Sponsorship deleted successfully');
      loadSponsorships();
    } catch (error) {
      console.error('Failed to delete sponsorship:', error);
      toast.error('Failed to delete sponsorship');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'approved': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'prospecting': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'negotiating': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'completed': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
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

  const getSponsorTypeIcon = (type: string) => {
    switch (type) {
      case 'corporate': return <Building className="h-4 w-4" />;
      case 'individual': return <Users className="h-4 w-4" />;
      case 'alumni': return <GraduationCap className="h-4 w-4" />;
      case 'government': return <Award className="h-4 w-4" />;
      case 'foundation': return <Heart className="h-4 w-4" />;
      default: return <Handshake className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'events': return <Calendar className="h-4 w-4" />;
      case 'clubs': return <Users className="h-4 w-4" />;
      case 'infrastructure': return <Building className="h-4 w-4" />;
      case 'academic': return <Target className="h-4 w-4" />;
      case 'sports': return <Trophy className="h-4 w-4" />;
      case 'cultural': return <Star className="h-4 w-4" />;
      case 'scholarships': return <Award className="h-4 w-4" />;
      default: return <Gift className="h-4 w-4" />;
    }
  };

  const filteredSponsorships = sponsorships.filter(sponsorship => {
    const matchesSearch = sponsorship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sponsorship.sponsor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sponsorship.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || sponsorship.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || sponsorship.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sponsorshipStats = {
    total: sponsorships.length,
    active: sponsorships.filter(s => s.status === 'active').length,
    prospecting: sponsorships.filter(s => s.status === 'prospecting').length,
    totalValue: sponsorships
      .filter(s => s.status === 'active' && s.sponsorship_type === 'monetary')
      .reduce((sum, s) => sum + (s.amount || 0), 0),
    upcomingRenewals: sponsorships.filter(s => s.renewal_status === 'upcoming').length
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg shadow-lg">
              <Handshake className="h-6 w-6 text-white" />
            </div>
            Sponsorship Management
          </h2>
          <p className="text-muted-foreground mt-1">Professional partnership and sponsorship tracking</p>
        </div>

        <div className="flex gap-3">
          <Dialog open={showCreateSponsorship} onOpenChange={setShowCreateSponsorship}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Sponsorship
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Sponsorship</DialogTitle>
                <DialogDescription>
                  Set up a new sponsorship partnership with detailed information
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Sponsorship Title *</Label>
                    <Input
                      id="title"
                      value={sponsorshipForm.title}
                      onChange={(e) => setSponsorshipForm({...sponsorshipForm, title: e.target.value})}
                      placeholder="Enter sponsorship title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sponsor_name">Sponsor Name *</Label>
                    <Input
                      id="sponsor_name"
                      value={sponsorshipForm.sponsor_name}
                      onChange={(e) => setSponsorshipForm({...sponsorshipForm, sponsor_name: e.target.value})}
                      placeholder="Enter sponsor company/individual name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sponsor_type">Sponsor Type *</Label>
                    <Select value={sponsorshipForm.sponsor_type} onValueChange={(value) => setSponsorshipForm({...sponsorshipForm, sponsor_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="alumni">Alumni</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="foundation">Foundation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={sponsorshipForm.category} onValueChange={(value) => setSponsorshipForm({...sponsorshipForm, category: value})}>
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
                        <SelectItem value="scholarships">Scholarships</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sponsorship_type">Sponsorship Type *</Label>
                    <Select value={sponsorshipForm.sponsorship_type} onValueChange={(value) => setSponsorshipForm({...sponsorshipForm, sponsorship_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monetary">Monetary</SelectItem>
                        <SelectItem value="in_kind">In-Kind</SelectItem>
                        <SelectItem value="services">Services</SelectItem>
                        <SelectItem value="venue">Venue</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {sponsorshipForm.sponsorship_type === 'monetary' && (
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={sponsorshipForm.amount}
                        onChange={(e) => setSponsorshipForm({...sponsorshipForm, amount: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={sponsorshipForm.priority} onValueChange={(value) => setSponsorshipForm({...sponsorshipForm, priority: value})}>
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
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={sponsorshipForm.description}
                      onChange={(e) => setSponsorshipForm({...sponsorshipForm, description: e.target.value})}
                      placeholder="Sponsorship description and objectives"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact_person">Contact Person</Label>
                    <Input
                      id="contact_person"
                      value={sponsorshipForm.contact_person}
                      onChange={(e) => setSponsorshipForm({...sponsorshipForm, contact_person: e.target.value})}
                      placeholder="Primary contact person"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={sponsorshipForm.contact_email}
                      onChange={(e) => setSponsorshipForm({...sponsorshipForm, contact_email: e.target.value})}
                      placeholder="contact@sponsor.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact_phone">Contact Phone</Label>
                    <Input
                      id="contact_phone"
                      value={sponsorshipForm.contact_phone}
                      onChange={(e) => setSponsorshipForm({...sponsorshipForm, contact_phone: e.target.value})}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={sponsorshipForm.website}
                      onChange={(e) => setSponsorshipForm({...sponsorshipForm, website: e.target.value})}
                      placeholder="https://sponsor.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={sponsorshipForm.start_date}
                      onChange={(e) => setSponsorshipForm({...sponsorshipForm, start_date: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={sponsorshipForm.end_date}
                      onChange={(e) => setSponsorshipForm({...sponsorshipForm, end_date: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={sponsorshipForm.notes}
                      onChange={(e) => setSponsorshipForm({...sponsorshipForm, notes: e.target.value})}
                      placeholder="Additional notes and comments"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowCreateSponsorship(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateSponsorship}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  {isLoading ? 'Creating...' : 'Create Sponsorship'}
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
                <p className="text-sm font-medium text-blue-600">Total Sponsorships</p>
                <p className="text-2xl font-bold text-blue-900">{sponsorshipStats.total}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <Handshake className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active</p>
                <p className="text-2xl font-bold text-green-900">{sponsorshipStats.active}</p>
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
                <p className="text-sm font-medium text-yellow-600">Prospecting</p>
                <p className="text-2xl font-bold text-yellow-900">{sponsorshipStats.prospecting}</p>
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
                <p className="text-sm font-medium text-purple-600">Total Value</p>
                <p className="text-2xl font-bold text-purple-900">${sponsorshipStats.totalValue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="sponsorships" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sponsorships" className="flex items-center gap-2">
            <Handshake className="h-4 w-4" />
            Sponsorships
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Pipeline
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sponsorships" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sponsorships..."
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
                    <SelectItem value="scholarships">Scholarships</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="prospecting">Prospecting</SelectItem>
                    <SelectItem value="negotiating">Negotiating</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Sponsorships Table */}
          <Card>
            <CardHeader>
              <CardTitle>Sponsorship Overview</CardTitle>
              <CardDescription>Manage and track all sponsorship partnerships</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sponsor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSponsorships.map((sponsorship) => (
                    <TableRow key={sponsorship.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sponsorship.sponsor_name}</p>
                          <p className="text-sm text-muted-foreground">{sponsorship.title}</p>
                          {sponsorship.contact_person && (
                            <p className="text-xs text-muted-foreground">{sponsorship.contact_person}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(sponsorship.category)}
                          <span className="capitalize">{sponsorship.category}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getSponsorTypeIcon(sponsorship.sponsor_type)}
                          <span className="capitalize">{sponsorship.sponsorship_type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {sponsorship.amount ? (
                            <>
                              <p className="font-medium">${sponsorship.amount.toLocaleString()}</p>
                              <p className="text-sm text-muted-foreground">{sponsorship.currency}</p>
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground">In-Kind</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(sponsorship.status)}>
                          {sponsorship.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(sponsorship.priority)}>
                          {sponsorship.priority.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {sponsorship.status === 'approved' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleActivateSponsorship(sponsorship.id)}
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
                                <AlertDialogTitle>Delete Sponsorship</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the sponsorship with "{sponsorship.sponsor_name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteSponsorship(sponsorship.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Delete Sponsorship
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Pipeline</CardTitle>
                <CardDescription>Track sponsorship opportunities through the sales process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['prospecting', 'negotiating', 'approved', 'active', 'completed'].map((status) => {
                    const statusSponsorships = sponsorships.filter(s => s.status === status);
                    const count = statusSponsorships.length;
                    const totalValue = statusSponsorships
                      .filter(s => s.sponsorship_type === 'monetary')
                      .reduce((sum, s) => sum + (s.amount || 0), 0);

                    if (count === 0) return null;

                    return (
                      <div key={status} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(status).includes('green') ? 'bg-green-500' : getStatusColor(status).includes('blue') ? 'bg-blue-500' : getStatusColor(status).includes('yellow') ? 'bg-yellow-500' : getStatusColor(status).includes('orange') ? 'bg-orange-500' : 'bg-gray-500'}`}></div>
                          <div>
                            <p className="font-medium capitalize">{status.replace('_', ' ')}</p>
                            <p className="text-sm text-muted-foreground">{count} sponsorship{count !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${totalValue.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Total Value</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators for sponsorship management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <ArrowUpRight className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">Conversion Rate</p>
                        <p className="text-sm text-green-700">Prospecting to Active</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-green-900">68%</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">Avg. Sales Cycle</p>
                        <p className="text-sm text-blue-700">Days to close</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">45</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-purple-900">Renewal Rate</p>
                        <p className="text-sm text-purple-700">Partnership renewals</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-purple-900">84%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sponsorship Distribution</CardTitle>
                <CardDescription>Sponsorship breakdown by category and type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['events', 'clubs', 'infrastructure', 'academic', 'sports', 'cultural', 'scholarships'].map((category) => {
                    const categorySponsorships = sponsorships.filter(s => s.category === category && s.status === 'active');
                    const total = categorySponsorships
                      .filter(s => s.sponsorship_type === 'monetary')
                      .reduce((sum, s) => sum + (s.amount || 0), 0);

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
                            {categorySponsorships.length} sponsor{categorySponsorships.length !== 1 ? 's' : ''}
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
                <CardTitle>Partnership Overview</CardTitle>
                <CardDescription>Comprehensive sponsorship performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <ArrowUpRight className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">Total Portfolio Value</p>
                        <p className="text-sm text-green-700">Active sponsorships</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-green-900">${sponsorshipStats.totalValue.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">Active Partners</p>
                        <p className="text-sm text-blue-700">Current sponsorships</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{sponsorshipStats.active}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium text-orange-900">Upcoming Renewals</p>
                        <p className="text-sm text-orange-700">Due for renewal</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-orange-900">{sponsorshipStats.upcomingRenewals}</p>
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

export default SponsorshipManagement;
