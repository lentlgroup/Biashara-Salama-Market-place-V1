// Biashara Salama Marketplace - Comprehensive Types & Data Model (BRD v1.0)

export type UserRole =
  | 'merchant_owner'
  | 'merchant_staff'
  | 'adviser'
  | 'implementation_specialist'
  | 'vendor_admin'
  | 'support_agent'
  | 'finance_analyst'
  | 'compliance_approver'
  | 'product_admin'
  | 'executive'
  | 'referrer';

export type Language = 'sw' | 'en';

export type MerchantLifecycleStage =
  | 'lead'
  | 'qualified'
  | 'assessment_in_progress'
  | 'assessment_complete'
  | 'recommendation_review'
  | 'recommendation_issued'
  | 'accepted'
  | 'revision_requested'
  | 'declined'
  | 'vendor_handoff'
  | 'implementation'
  | 'go_live'
  | 'active'
  | 'renewal_due'
  | 'renewed'
  | 'migrating'
  | 'inactive';

export type VendorStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'suspended'
  | 'expired'
  | 'delisted';

export type ProductApprovalStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'suspended'
  | 'expired'
  | 'delisted';

export type SupportTicketStatus =
  | 'new'
  | 'triaged'
  | 'assigned'
  | 'in_progress'
  | 'waiting_vendor'
  | 'waiting_merchant'
  | 'waiting_third_party'
  | 'resolved'
  | 'merchant_accepted'
  | 'closed'
  | 'reopened';

export type SupportResponsibility =
  | 'biashara_salama'
  | 'vendor'
  | 'merchant'
  | 'third_party';

export type TicketSeverity = 'low' | 'medium' | 'high' | 'critical';

export type SectorType =
  | 'retail_supermarket'
  | 'wholesale_distribution'
  | 'pharmacy_health'
  | 'hardware_construction'
  | 'hospitality_restaurant'
  | 'services_spares'
  | 'general_trade';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  vendorId?: string;
  merchantId?: string;
  avatarUrl?: string;
  status: 'active' | 'suspended' | 'invited';
  mfaEnabled: boolean;
  createdAt: string;
  lastLogin: string;
}

export interface ConsentRecord {
  id: string;
  merchantId: string;
  version: string;
  purpose: string;
  channel: 'web' | 'whatsapp' | 'phone' | 'field' | 'referral';
  grantedAt: string;
  withdrawnAt?: string;
  ipAddress?: string;
  userAgent?: string;
  scopeOfDataSharing: string[];
}

export interface MerchantContact {
  id: string;
  name: string;
  roleTitle: string;
  phone: string;
  email: string;
  isDecisionMaker: boolean;
}

export interface MerchantBranch {
  id: string;
  name: string;
  region: string;
  district: string;
  address: string;
  staffCount: number;
  isMainBranch: boolean;
  currentSystem: string;
}

export interface Merchant {
  id: string;
  leadId: string;
  businessName: string;
  registrationNumber?: string;
  taxIdentificationNumber?: string;
  sector: SectorType;
  primaryLocation: string;
  region: string;
  city: string;
  branches: MerchantBranch[];
  contacts: MerchantContact[];
  currentSystems: string[];
  stage: MerchantLifecycleStage;
  assignedAdviserId: string;
  assignedAdviserName: string;
  source: 'web' | 'whatsapp' | 'phone' | 'field' | 'referral';
  referrerName?: string;
  currentVendorId?: string;
  currentProductId?: string;
  currentPlanName?: string;
  historicalVendorIds: string[];
  notes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentResponse {
  sectorWorkflow: SectorType;
  businessSize: 'micro' | 'small' | 'medium';
  branchCount: number;
  userCount: number;
  salesStockNeeds: string[];
  accountingRequirements: string[];
  connectivity: 'reliable_internet' | 'intermittent_internet' | 'offline_first_required';
  hardwareNeeds: string[];
  requiredIntegrations: string[]; // e.g., M-Pesa, TigoPesa, AirtelMoney, TRA VFD, Banks
  monthlyBudgetTZS: number;
  upfrontBudgetTZS: number;
  dataMigrationNeeded: boolean;
  supportExpectations: 'business_hours' | '24_7' | 'on_site_preferred' | 'phone_whatsapp';
  implementationTiming: 'immediate_1_week' | 'within_1_month' | 'planning_1_3_months';
  existingPainPoints: string;
  merchantProvidedFacts: string;
  adviserObservations: string;
}

export interface Assessment {
  id: string;
  merchantId: string;
  version: number;
  templateVersion: string;
  isComplete: boolean;
  responses: AssessmentResponse;
  inferredNeeds: string[];
  adviserNotes: string;
  adviserId: string;
  completedAt?: string;
  updatedAt: string;
}

export interface BusinessAssessment {
  id: string;
  merchantId: string;
  branchCount: number;
  staffCount: number;
  powerReliability: 'stable' | 'intermittent_daily_cuts' | 'generator_solar_only';
  powerBackupType: 'ups_generator' | 'inverter_solar' | 'none';
  internetPrimary: 'mobile_4g_modem' | 'fiber_broadband' | 'phone_hotspot' | 'no_reliable_internet';
  internetBackup: string;
  hardwareInventory: string[];
  requiredModules: string[];
  traVfdRequired: boolean;
  existingTaxMachineType: 'vfd_virtual' | 'physical_efd' | 'manual_receipts' | 'none';
  currentRecordMethod: 'notebook_and_excel' | 'legacy_desktop_pos' | 'pure_manual_paper';
  dataMigrationNeeded: boolean;
  staffTechLiteracy: 'basic_smartphone' | 'competent_pc' | 'low_literacy';
  languagePreference: 'swahili' | 'english' | 'bilingual';
  deploymentPreference: 'hybrid_offline_sync' | 'cloud_pure' | 'on_premise_local';
  monthlyBudgetTZS: number;
  hardwareBudgetTZS: number;
  targetGoLiveDays: number;
  hasInhouseIT: boolean;
  offlineToleranceHours: number;
  notes: string;
  createdAt: string;
  completenessScore: number;
}

export interface VendorClaim {
  id: string;
  claimType: 'tra_vfd' | 'offline_mode' | 'payment_integration' | 'uptime_sla' | 'local_support' | 'data_export';
  statement: string;
  source: string;
  effectiveDate: string;
  verificationStatus: 'verified' | 'pending' | 'expired' | 'unverified';
  lastVerifiedDate: string;
  verifiedBy: string;
  evidenceUrl?: string;
}

export interface ProductPricingPlan {
  id: string;
  planName: string;
  monthlyFeeTZS: number;
  annualFeeTZS: number;
  billingCycle: 'monthly' | 'annual' | 'one_off';
  includedUsers: number;
  includedBranches: number;
  additionalUserCostTZS: number;
  additionalBranchCostTZS: number;
  setupFeeTZS: number;
  features: string[];
}

export interface Product {
  id: string;
  vendorId: string;
  vendorName: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  category: 'POS' | 'Inventory' | 'Accounting' | 'ERP' | 'Integrated_Suite';
  supportedSectors: SectorType[];
  approvalStatus: ProductApprovalStatus;
  approvalExpiryDate: string;
  isSponsored: boolean;
  sponsorshipLabel?: string;
  plans: ProductPricingPlan[];
  claims: VendorClaim[];
  features: string[];
  offlineCapabilities: 'full_offline_sync' | 'hybrid' | 'cloud_only';
  hardwareRequirements: string[];
  supportedIntegrations: string[];
  supportSLA: string;
  localSupportInTanzania: boolean;
  dataExportFormats: string[];
  traVfdStatus: 'certified_integrated' | 'compatible_external' | 'not_supported';
  traCertificateNumber?: string;
  traCertExpiry?: string;
  implementationEffortDays: number;
  trainingDaysIncluded: number;
  warrantyPeriodMonths: number;
  overallRating: number;
  satisfactionScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  legalName: string;
  brandName: string;
  registrationNumber: string;
  tinNumber: string;
  headquarters: string;
  country: string;
  website: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  status: VendorStatus;
  statusExpiryDate: string;
  dueDiligencePassed: boolean;
  dueDiligenceExpiry: string;
  marketplaceAgreementSigned: boolean;
  agentOfRecordAgreementSigned: boolean;
  commissionRatePercent: number;
  leadResponseSLAHours: number;
  scorecard: {
    leadResponseHours: number;
    quoteTimeHours: number;
    activationRatePercent: number;
    supportSLAAdherencePercent: number;
    complaintCount: number;
    renewalRatePercent: number;
    merchantSatisfaction: number;
  };
  products: Product[];
  createdAt: string;
}

export interface RecommendationItem {
  productId: string;
  productName: string;
  vendorName: string;
  isPrimaryRecommendation: boolean;
  matchScore: number; // 0 - 100
  matchedRequirements: string[];
  identifiedGaps: string[];
  limitations: string[];
  assumptions: string[];
  totalCostEstimateTZS: {
    softwareYear1: number;
    hardware: number;
    setupAndMigration: number;
    training: number;
    estimatedAnnualRecurring: number;
  };
  implementationNotes: string;
  dataExportConsiderations: string;
}

export interface Recommendation {
  id: string;
  merchantId: string;
  assessmentId: string;
  version: number;
  status: 'draft' | 'under_second_review' | 'approved_issued' | 'accepted' | 'revision_requested' | 'declined';
  adviserRationale: string;
  namedAdviserId: string;
  namedAdviserName: string;
  secondReviewerId?: string;
  secondReviewerName?: string;
  commercialRelationshipDisclosure: string;
  recommendations: RecommendationItem[];
  merchantDecision?: {
    action: 'accept' | 'request_revision' | 'decline';
    selectedProductId?: string;
    comments: string;
    decidedByUserId: string;
    decidedByUserName: string;
    timestamp: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface VendorHandoff {
  id: string;
  merchantId: string;
  opportunityId: string;
  vendorId: string;
  productId: string;
  adviserId: string;
  consentScope: string[];
  agentOfRecordConfirmed: boolean;
  agentOfRecordReference: string;
  status: 'sent' | 'accepted' | 'declined' | 'clarification_requested' | 'escalated';
  sentAt: string;
  slaDeadline: string;
  vendorRespondedAt?: string;
  vendorResponseNotes?: string;
  handoffEvidenceDocId: string;
}

export interface QuotationLineItem {
  id: string;
  category: 'vendor_software' | 'hardware' | 'biashara_salama_implementation' | 'configuration' | 'data_migration' | 'training' | 'support_add_on';
  description: string;
  provider: 'vendor' | 'biashara_salama' | 'third_party';
  unitCostTZS: number;
  quantity: number;
  totalCostTZS: number;
  isRecurring: boolean;
  recurringFrequency?: 'monthly' | 'annual';
}

export interface Quotation {
  id: string;
  merchantId: string;
  recommendationId: string;
  version: number;
  status: 'draft' | 'issued' | 'approved_by_merchant' | 'rejected' | 'expired';
  lineItems: QuotationLineItem[];
  subtotalVendorTZS: number;
  subtotalBiasharaSalamaTZS: number;
  taxAmountTZS: number;
  grandTotalTZS: number;
  assumptions: string[];
  validUntil: string;
  createdAt: string;
  approvedAt?: string;
}

export interface ImplementationTask {
  id: string;
  title: string;
  category: 'hardware' | 'data_migration' | 'product_config' | 'user_setup' | 'training' | 'go_live_checks';
  assignedTo: string;
  assignedRole: 'implementation_specialist' | 'vendor' | 'merchant_owner';
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  isCriticalGoLiveBlocker: boolean;
  evidenceNotes?: string;
  evidenceFileUrl?: string;
  completedAt?: string;
}

export interface ImplementationPlan {
  id: string;
  merchantId: string;
  quotationId: string;
  vendorId: string;
  productId: string;
  specialistId: string;
  specialistName: string;
  tasks: ImplementationTask[];
  hardwareInventory: {
    itemName: string;
    serialNumber: string;
    warrantyExpiry: string;
    supplier: string;
  }[];
  trainingRecords: {
    id: string;
    topic: string;
    date: string;
    trainerName: string;
    attendees: { name: string; role: string; acknowledged: boolean }[];
    materialsUrl?: string;
  }[];
  goLiveChecklistPassed: boolean;
  merchantAcceptance?: {
    isAccepted: boolean;
    goLiveDate: string;
    acceptedScope: string;
    outstandingMinorIssues: string[];
    signatoryName: string;
    signatoryRole: string;
    timestamp: string;
    acceptanceDocumentUrl: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicketMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  message: string;
  isInternalNote: boolean;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  merchantId: string;
  merchantName: string;
  vendorId: string;
  vendorName: string;
  productId: string;
  productName: string;
  category: 'defect' | 'data_issue' | 'hardware_fault' | 'training_gap' | 'billing_inquiry' | 'complaint';
  severity: TicketSeverity;
  title: string;
  description: string;
  preferredChannel: 'whatsapp' | 'phone' | 'portal';
  responsibility: SupportResponsibility;
  accountableNextActionOwner: string;
  accountableOwnerRole: string;
  status: SupportTicketStatus;
  slaTargetHours: number;
  slaBreachDeadline: string;
  isEscalated: boolean;
  messages: SupportTicketMessage[];
  resolutionSummary?: string;
  merchantAcceptedResolution?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionRecord {
  id: string;
  merchantId: string;
  merchantName: string;
  vendorId: string;
  vendorName: string;
  productId: string;
  productName: string;
  planName: string;
  status: 'active' | 'renewal_due' | 'renewed' | 'upgraded' | 'downgraded' | 'migrating' | 'cancelled';
  activeUsers: number;
  activeBranches: number;
  subscriptionStartDate: string;
  currentPeriodEnd: string;
  renewalNoticeDate: string;
  monthlySoftwareFeeTZS: number;
  agentOfRecordReference: string;
  commissionEligible: boolean;
  historyEvents: {
    date: string;
    event: string;
    details: string;
  }[];
}

export interface CommissionRule {
  id: string;
  vendorId: string;
  basis: 'percentage_recurring' | 'fixed_per_seat' | 'one_time_bounty';
  ratePercentage?: number;
  fixedAmountTZS?: number;
  eligibilityPeriodMonths: number;
  effectiveFrom: string;
  effectiveTo: string;
  termsSummary: string;
}

export interface CommissionLedgerEntry {
  id: string;
  vendorId: string;
  vendorName: string;
  merchantId: string;
  merchantName: string;
  period: string; // e.g. "2026-08"
  subscriptionAmountTZS: number;
  expectedCommissionTZS: number;
  reportedByVendorTZS?: number;
  actualAmountReceivedTZS?: number;
  varianceTZS: number;
  status: 'expected' | 'matched' | 'variance_disputed' | 'settled' | 'adjusted';
  agentOfRecordRef: string;
  disputeNotes?: string;
  resolutionEvidence?: string;
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  priorValue?: string;
  newValue?: string;
  ipAddress: string;
  timestamp: string;
}

export interface DataRightsRequest {
  id: string;
  merchantId: string;
  merchantName: string;
  requestType: 'access' | 'correction' | 'export' | 'restriction' | 'deletion';
  status: 'received' | 'under_review' | 'approved' | 'rejected' | 'completed';
  details: string;
  requestedBy: string;
  assignedOfficer: string;
  deadline: string;
  legalHoldApplied: boolean;
  resolutionNotes?: string;
  completedAt?: string;
  createdAt: string;
}
