// Biashara Salama Marketplace - Core App State & Business Logic Engine
import React, { createContext, useContext, useState, useEffect, useMemo, useRef, ReactNode } from 'react';
import {
  User,
  UserRole,
  Language,
  Merchant,
  Vendor,
  Product,
  Assessment,
  Recommendation,
  VendorHandoff,
  Quotation,
  ImplementationPlan,
  SupportTicket,
  SubscriptionRecord,
  CommissionRule,
  CommissionLedgerEntry,
  AuditEvent,
  DataRightsRequest,
  ConsentRecord,
  MerchantLifecycleStage,
  SectorType,
  BusinessAssessment,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_VENDORS,
  INITIAL_PRODUCTS,
  INITIAL_MERCHANTS,
  INITIAL_ASSESSMENTS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_HANDOFFS,
  INITIAL_QUOTATIONS,
  INITIAL_IMPLEMENTATIONS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_COMMISSION_RULES,
  INITIAL_COMMISSION_LEDGER,
  INITIAL_AUDIT_LOGS,
  INITIAL_DATA_RIGHTS_REQUESTS,
} from '../data/seedData';
import { translations } from '../translations';
import { getMarketplaceState, saveMarketplaceState } from '../api';

const MARKETPLACE_SCHEMA_VERSION = 1;
const STORAGE_KEY = 'biashara_salama_store_v1';
const LEGACY_STORAGE_SUFFIXES = [
  'merchants',
  'vendors',
  'products',
  'assessments',
  'recommendations',
  'handoffs',
  'quotations',
  'implementations',
  'supportTickets',
  'subscriptions',
  'commissionLedger',
  'auditLogs',
  'dataRightsRequests',
];

type DatabaseStatus = 'connecting' | 'saving' | 'synced' | 'offline' | 'error';

interface MarketplaceStateData {
  users: User[];
  merchants: Merchant[];
  vendors: Vendor[];
  products: Product[];
  assessments: Assessment[];
  recommendations: Recommendation[];
  handoffs: VendorHandoff[];
  quotations: Quotation[];
  implementations: ImplementationPlan[];
  supportTickets: SupportTicket[];
  subscriptions: SubscriptionRecord[];
  commissionRules: CommissionRule[];
  commissionLedger: CommissionLedgerEntry[];
  auditLogs: AuditEvent[];
  dataRightsRequests: DataRightsRequest[];
  consentRecords: ConsentRecord[];
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.sw;
  
  currentUser: User;
  setCurrentUser: (user: User) => void;
  allUsers: User[];
  switchUserRole: (role: UserRole) => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Comparison Tray
  comparedProductIds: string[];
  addToComparison: (productId: string) => void;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;

  // Selected entities for drilldown
  selectedMerchantId: string;
  setSelectedMerchantId: (id: string) => void;
  selectedVendorId: string;
  setSelectedVendorId: (id: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;

  // Entity Lists
  merchants: Merchant[];
  vendors: Vendor[];
  products: Product[];
  assessments: Assessment[];
  recommendations: Recommendation[];
  handoffs: VendorHandoff[];
  quotations: Quotation[];
  implementations: ImplementationPlan[];
  supportTickets: SupportTicket[];
  subscriptions: SubscriptionRecord[];
  commissionRules: CommissionRule[];
  commissionLedger: CommissionLedgerEntry[];
  auditLogs: AuditEvent[];
  dataRightsRequests: DataRightsRequest[];
  consentRecords: ConsentRecord[];

  databaseStatus: DatabaseStatus;
  databaseError: string | null;

  // Action Methods
  createLead: (data: {
    businessName: string;
    sector: SectorType;
    contactName: string;
    phone: string;
    email: string;
    region: string;
    city: string;
    channel: 'web' | 'whatsapp' | 'phone' | 'field' | 'referral';
    referrerName?: string;
  }) => string;

  saveAssessment: (assessment: Partial<Assessment> & { merchantId: string }) => void;
  completeAssessment: (assessment: string | BusinessAssessment) => void;
  
  issueRecommendation: (rec: Partial<Recommendation> & { merchantId: string; assessmentId: string }) => void;
  respondToRecommendation: (recId: string, decision: 'accept' | 'request_revision' | 'decline', comments: string) => void;
  
  respondToVendorHandoff: (handoffId: string, action: 'accepted' | 'declined' | 'clarification_requested', notes: string) => void;
  
  createSupportTicket: (ticket: Partial<SupportTicket> & { merchantId: string; title: string; description: string; category: SupportTicket['category']; severity: SupportTicket['severity'] }) => void;
  addTicketMessage: (ticketId: string, message: string, isInternal: boolean) => void;
  resolveTicket: (ticketId: string, summary: string) => void;
  acceptTicketResolution: (ticketId: string) => void;
  
  updateImplementationTask: (impId: string, taskId: string, status: 'completed' | 'in_progress' | 'blocked', notes?: string) => void;
  signMerchantAcceptance: (impId: string, signatoryName: string, signatoryRole: string, scope: string) => void;

  switchVendorMigration: (merchantId: string, targetProductId: string, reason: string) => void;
  selectProduct: (merchantId: string, productId: string, recommendationId: string) => void;
  
  reconcileCommissionEntry: (entryId: string, status: 'matched' | 'variance_disputed' | 'settled', notes?: string) => void;
  
  approveVendor: (vendorId: string) => void;
  approveProduct: (productId: string) => void;
  
  recordConsent: (consent: Omit<ConsentRecord, 'id' | 'grantedAt'>) => void;
  submitDataRightsRequest: (req: Omit<DataRightsRequest, 'id' | 'createdAt' | 'status' | 'legalHoldApplied'>) => void;
  
  resetToSampleData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('sw');
  
  // Load state from localStorage or initialize with seed data
  const [merchants, setMerchants] = useState<Merchant[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_merchants`);
    return saved ? JSON.parse(saved) : INITIAL_MERCHANTS;
  });

  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_vendors`);
    return saved ? JSON.parse(saved) : INITIAL_VENDORS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_products`);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [assessments, setAssessments] = useState<Assessment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_assessments`);
    return saved ? JSON.parse(saved) : INITIAL_ASSESSMENTS;
  });

  const [recommendations, setRecommendations] = useState<Recommendation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_recommendations`);
    return saved ? JSON.parse(saved) : INITIAL_RECOMMENDATIONS;
  });

  const [handoffs, setHandoffs] = useState<VendorHandoff[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_handoffs`);
    return saved ? JSON.parse(saved) : INITIAL_HANDOFFS;
  });

  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_quotations`);
    return saved ? JSON.parse(saved) : INITIAL_QUOTATIONS;
  });

  const [implementations, setImplementations] = useState<ImplementationPlan[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_implementations`);
    return saved ? JSON.parse(saved) : INITIAL_IMPLEMENTATIONS;
  });

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_supportTickets`);
    return saved ? JSON.parse(saved) : INITIAL_SUPPORT_TICKETS;
  });

  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_subscriptions`);
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });

  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>(INITIAL_COMMISSION_RULES);

  const [commissionLedger, setCommissionLedger] = useState<CommissionLedgerEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_commissionLedger`);
    return saved ? JSON.parse(saved) : INITIAL_COMMISSION_LEDGER;
  });

  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_auditLogs`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [dataRightsRequests, setDataRightsRequests] = useState<DataRightsRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_dataRightsRequests`);
    return saved ? JSON.parse(saved) : INITIAL_DATA_RIGHTS_REQUESTS;
  });

  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // default adviser
  const [activeTab, setActiveTab] = useState<string>('home');
  const [comparedProductIds, setComparedProductIds] = useState<string[]>(['prd_simba_retail', 'prd_kwanza_erp']);
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('mrc_001');
  const [selectedVendorId, setSelectedVendorId] = useState<string>('ven_simbapos');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [databaseStatus, setDatabaseStatus] = useState<DatabaseStatus>('connecting');
  const [databaseError, setDatabaseError] = useState<string | null>(null);
  const [isDatabaseHydrated, setIsDatabaseHydrated] = useState(false);
  const databaseRevisionRef = useRef(0);
  const lastSavedSnapshotRef = useRef('');
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());
  const hydrationStartedRef = useRef(false);

  const marketplaceState = useMemo<MarketplaceStateData>(() => ({
    users: allUsers,
    merchants,
    vendors,
    products,
    assessments,
    recommendations,
    handoffs,
    quotations,
    implementations,
    supportTickets,
    subscriptions,
    commissionRules,
    commissionLedger,
    auditLogs,
    dataRightsRequests,
    consentRecords,
  }), [
    allUsers,
    merchants,
    vendors,
    products,
    assessments,
    recommendations,
    handoffs,
    quotations,
    implementations,
    supportTickets,
    subscriptions,
    commissionRules,
    commissionLedger,
    auditLogs,
    dataRightsRequests,
    consentRecords,
  ]);

  // On the first successful connection, import existing browser data into MySQL.
  useEffect(() => {
    if (hydrationStartedRef.current) return;
    hydrationStartedRef.current = true;

    const hydrate = async () => {
      setDatabaseStatus('connecting');
      setDatabaseError(null);

      try {
        const response = await getMarketplaceState<MarketplaceStateData>();

        databaseRevisionRef.current = response.revision;

        if (response.initialized && response.data) {
          const data = response.data;
          setAllUsers(data.users);
          setMerchants(data.merchants);
          setVendors(data.vendors);
          setProducts(data.products);
          setAssessments(data.assessments);
          setRecommendations(data.recommendations);
          setHandoffs(data.handoffs);
          setQuotations(data.quotations);
          setImplementations(data.implementations);
          setSupportTickets(data.supportTickets);
          setSubscriptions(data.subscriptions);
          setCommissionRules(data.commissionRules);
          setCommissionLedger(data.commissionLedger);
          setAuditLogs(data.auditLogs);
          setDataRightsRequests(data.dataRightsRequests);
          setConsentRecords(data.consentRecords);
          lastSavedSnapshotRef.current = JSON.stringify(data);
        } else {
          const hasLegacyLocalData = LEGACY_STORAGE_SUFFIXES.some(
            (suffix) => localStorage.getItem(`${STORAGE_KEY}_${suffix}`) !== null,
          );
          const saved = await saveMarketplaceState({
            schemaVersion: MARKETPLACE_SCHEMA_VERSION,
            revision: 0,
            migratedFromLocalStorage: hasLegacyLocalData,
            data: marketplaceState,
          });

          databaseRevisionRef.current = saved.revision;
          lastSavedSnapshotRef.current = JSON.stringify(marketplaceState);
          LEGACY_STORAGE_SUFFIXES.forEach((suffix) => {
            localStorage.removeItem(`${STORAGE_KEY}_${suffix}`);
          });
        }

        setDatabaseStatus('synced');
      } catch (error) {
        setDatabaseStatus('offline');
        setDatabaseError(error instanceof Error ? error.message : 'Unable to connect to the database API.');
      } finally {
        setIsDatabaseHydrated(true);
      }
    };

    void hydrate();
  }, [marketplaceState]);

  // Debounce changes and serialize writes so optimistic revisions remain ordered.
  useEffect(() => {
    if (!isDatabaseHydrated) return;

    const serializedSnapshot = JSON.stringify(marketplaceState);
    if (serializedSnapshot === lastSavedSnapshotRef.current) return;

    const timeoutId = window.setTimeout(() => {
      setDatabaseStatus('saving');
      setDatabaseError(null);

      saveQueueRef.current = saveQueueRef.current
        .catch(() => undefined)
        .then(async () => {
          const saved = await saveMarketplaceState({
            schemaVersion: MARKETPLACE_SCHEMA_VERSION,
            revision: databaseRevisionRef.current,
            data: marketplaceState,
          });
          databaseRevisionRef.current = saved.revision;
          lastSavedSnapshotRef.current = serializedSnapshot;
          setDatabaseStatus('synced');
        })
        .catch((error: unknown) => {
          setDatabaseStatus('error');
          setDatabaseError(error instanceof Error ? error.message : 'Unable to save marketplace data.');
        });
    }, 750);

    return () => window.clearTimeout(timeoutId);
  }, [isDatabaseHydrated, marketplaceState]);

  const logAction = (action: string, entityType: string, entityId: string, details: string) => {
    const newLog: AuditEvent = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action,
      entityType,
      entityId,
      details,
      ipAddress: '197.250.14.82',
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const switchUserRole = (role: UserRole) => {
    const matching = allUsers.find((u) => u.role === role);
    if (matching) {
      setCurrentUser(matching);
      if (matching.merchantId) {
        setSelectedMerchantId(matching.merchantId);
      }
      if (matching.vendorId) {
        setSelectedVendorId(matching.vendorId);
      }
    } else {
      // Create ad-hoc user for this role
      const tempUser: User = {
        id: `usr_${role}_01`,
        name: `Demo ${role.replace('_', ' ').toUpperCase()}`,
        email: `${role}@biasharasalama.co.tz`,
        phone: '+255 754 000 999',
        role,
        status: 'active',
        mfaEnabled: ['admin', 'finance_analyst', 'compliance_approver'].includes(role),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      setCurrentUser(tempUser);
    }
  };

  const addToComparison = (productId: string) => {
    if (!comparedProductIds.includes(productId)) {
      if (comparedProductIds.length >= 4) {
        // limit to 4
        setComparedProductIds([...comparedProductIds.slice(1), productId]);
      } else {
        setComparedProductIds([...comparedProductIds, productId]);
      }
    }
  };

  const removeFromComparison = (productId: string) => {
    setComparedProductIds(comparedProductIds.filter((id) => id !== productId));
  };

  const clearComparison = () => {
    setComparedProductIds([]);
  };

  const createLead = (data: {
    businessName: string;
    sector: SectorType;
    contactName: string;
    phone: string;
    email: string;
    region: string;
    city: string;
    channel: 'web' | 'whatsapp' | 'phone' | 'field' | 'referral';
    referrerName?: string;
  }): string => {
    const id = `mrc_${Date.now().toString().slice(-4)}`;
    const leadId = `lead_${new Date().getFullYear()}_${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newMerchant: Merchant = {
      id,
      leadId,
      businessName: data.businessName,
      sector: data.sector,
      primaryLocation: `${data.city}, ${data.region}`,
      region: data.region,
      city: data.city,
      branches: [
        {
          id: `br_${id}_01`,
          name: 'Main Location',
          region: data.region,
          district: data.city,
          address: `${data.city}, ${data.region}`,
          staffCount: 3,
          isMainBranch: true,
          currentSystem: 'Manual paper or excel',
        },
      ],
      contacts: [
        {
          id: `cnt_${id}_01`,
          name: data.contactName,
          roleTitle: 'Owner / Decision Maker',
          phone: data.phone,
          email: data.email,
          isDecisionMaker: true,
        },
      ],
      currentSystems: ['Manual records'],
      stage: 'lead',
      assignedAdviserId: 'usr_adv_01',
      assignedAdviserName: 'Juma Mwambene',
      source: data.channel,
      referrerName: data.referrerName,
      historicalVendorIds: [],
      notes: `Lead captured via ${data.channel}.`,
      tags: ['New Lead', data.sector],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMerchants((prev) => [newMerchant, ...prev]);
    setSelectedMerchantId(id);
    logAction('LEAD_CAPTURED', 'Merchant', id, `Captured new lead: ${data.businessName} via ${data.channel}`);
    return id;
  };

  const saveAssessment = (assessmentData: Partial<Assessment> & { merchantId: string }) => {
    setAssessments((prev) => {
      const idx = prev.findIndex((a) => a.merchantId === assessmentData.merchantId);
      if (idx >= 0) {
        const updated = {
          ...prev[idx],
          ...assessmentData,
          updatedAt: new Date().toISOString(),
        };
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      } else {
        const newAsm: Assessment = {
          id: `asm_${Date.now()}`,
          merchantId: assessmentData.merchantId,
          version: 1,
          templateVersion: 'v1.0-standard',
          isComplete: false,
          responses: assessmentData.responses || {
            sectorWorkflow: 'retail_supermarket',
            businessSize: 'small',
            branchCount: 1,
            userCount: 3,
            salesStockNeeds: [],
            accountingRequirements: [],
            connectivity: 'intermittent_internet',
            hardwareNeeds: [],
            requiredIntegrations: ['TRA VFD Web API'],
            monthlyBudgetTZS: 100000,
            upfrontBudgetTZS: 1000000,
            dataMigrationNeeded: false,
            supportExpectations: 'phone_whatsapp',
            implementationTiming: 'within_1_month',
            existingPainPoints: '',
            merchantProvidedFacts: '',
            adviserObservations: '',
          },
          inferredNeeds: assessmentData.inferredNeeds || [],
          adviserNotes: assessmentData.adviserNotes || '',
          adviserId: currentUser.id,
          updatedAt: new Date().toISOString(),
        };
        return [newAsm, ...prev];
      }
    });

    // update merchant status to assessment_in_progress
    setMerchants((prev) =>
      prev.map((m) =>
        m.id === assessmentData.merchantId && m.stage === 'lead'
          ? { ...m, stage: 'assessment_in_progress', updatedAt: new Date().toISOString() }
          : m
      )
    );

    logAction('ASSESSMENT_DRAFT_SAVED', 'Assessment', assessmentData.merchantId, 'Draft assessment updated.');
  };

  const completeAssessment = (assessment: string | BusinessAssessment) => {
    const merchantId = typeof assessment === 'string' ? assessment : assessment.merchantId;
    const completedAt = new Date().toISOString();

    setAssessments((prev) => {
      if (typeof assessment === 'string') {
        return prev.map((item) =>
          item.merchantId === merchantId
            ? { ...item, isComplete: true, completedAt, updatedAt: completedAt }
            : item
        );
      }

      const merchant = merchants.find((item) => item.id === merchantId);
      const normalizedAssessment: Assessment = {
        id: assessment.id,
        merchantId,
        version: 1,
        templateVersion: 'v1.0-diagnostic',
        isComplete: true,
        responses: {
          sectorWorkflow: merchant?.sector || 'general_trade',
          businessSize: assessment.staffCount <= 5 ? 'micro' : assessment.staffCount <= 20 ? 'small' : 'medium',
          branchCount: assessment.branchCount,
          userCount: assessment.staffCount,
          salesStockNeeds: assessment.requiredModules,
          accountingRequirements: assessment.traVfdRequired ? ['TRA VFD compliant receipting'] : [],
          connectivity:
            assessment.internetPrimary === 'fiber_broadband'
              ? 'reliable_internet'
              : assessment.internetPrimary === 'no_reliable_internet'
                ? 'offline_first_required'
                : 'intermittent_internet',
          hardwareNeeds: assessment.hardwareInventory,
          requiredIntegrations: assessment.traVfdRequired ? ['TRA VFD Web API'] : [],
          monthlyBudgetTZS: assessment.monthlyBudgetTZS,
          upfrontBudgetTZS: assessment.hardwareBudgetTZS,
          dataMigrationNeeded: assessment.dataMigrationNeeded,
          supportExpectations: 'phone_whatsapp',
          implementationTiming: assessment.targetGoLiveDays <= 7 ? 'immediate_1_week' : 'within_1_month',
          existingPainPoints: assessment.notes,
          merchantProvidedFacts: `${assessment.branchCount} branches and ${assessment.staffCount} staff members.`,
          adviserObservations: `Deployment preference: ${assessment.deploymentPreference}; offline tolerance: ${assessment.offlineToleranceHours} hours.`,
        },
        inferredNeeds: [
          ...assessment.requiredModules,
          assessment.traVfdRequired ? 'TRA VFD compliance' : 'Standard receipting',
        ],
        adviserNotes: assessment.notes,
        adviserId: currentUser.id,
        completedAt,
        updatedAt: completedAt,
      };

      const existingIndex = prev.findIndex((item) => item.merchantId === merchantId);
      if (existingIndex < 0) return [normalizedAssessment, ...prev];

      const next = [...prev];
      next[existingIndex] = normalizedAssessment;
      return next;
    });

    setMerchants((prev) =>
      prev.map((m) =>
        m.id === merchantId
          ? { ...m, stage: 'assessment_complete', updatedAt: new Date().toISOString() }
          : m
      )
    );

    logAction('ASSESSMENT_COMPLETED', 'Assessment', merchantId, 'Assessment completed and verified.');
  };

  const issueRecommendation = (recData: Partial<Recommendation> & { merchantId: string; assessmentId: string }) => {
    const newRec: Recommendation = {
      id: `rec_${Date.now()}`,
      merchantId: recData.merchantId,
      assessmentId: recData.assessmentId,
      version: 1,
      status: 'approved_issued',
      adviserRationale: recData.adviserRationale || 'Evidence-based recommendation following assessment.',
      namedAdviserId: currentUser.id,
      namedAdviserName: currentUser.name,
      secondReviewerId: 'usr_comp_01',
      secondReviewerName: 'Dr. Zuhura Mussa',
      commercialRelationshipDisclosure:
        recData.commercialRelationshipDisclosure ||
        'Biashara Salama is an independent brokerage partner. Commercial relationship disclosed in full before merchant commitment.',
      recommendations: recData.recommendations || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRecommendations((prev) => [newRec, ...prev]);

    setMerchants((prev) =>
      prev.map((m) =>
        m.id === recData.merchantId
          ? { ...m, stage: 'recommendation_issued', updatedAt: new Date().toISOString() }
          : m
      )
    );

    logAction('RECOMMENDATION_ISSUED', 'Recommendation', newRec.id, `Issued recommendation for merchant ${recData.merchantId}`);
  };

  const respondToRecommendation = (
    recId: string,
    decision: 'accept' | 'request_revision' | 'decline',
    comments: string
  ) => {
    setRecommendations((prev) =>
      prev.map((r) => {
        if (r.id === recId) {
          const updated: Recommendation = {
            ...r,
            status: decision === 'accept' ? 'accepted' : decision === 'request_revision' ? 'revision_requested' : 'declined',
            merchantDecision: {
              action: decision,
              selectedProductId: r.recommendations[0]?.productId,
              comments,
              decidedByUserId: currentUser.id,
              decidedByUserName: currentUser.name,
              timestamp: new Date().toISOString(),
            },
            updatedAt: new Date().toISOString(),
          };
          return updated;
        }
        return r;
      })
    );

    const rec = recommendations.find((r) => r.id === recId);
    if (rec) {
      const nextStage: MerchantLifecycleStage =
        decision === 'accept' ? 'vendor_handoff' : decision === 'request_revision' ? 'revision_requested' : 'declined';
      
      setMerchants((prev) =>
        prev.map((m) =>
          m.id === rec.merchantId
            ? {
                ...m,
                stage: nextStage,
                currentProductId: decision === 'accept' ? rec.recommendations[0]?.productId : m.currentProductId,
                updatedAt: new Date().toISOString(),
              }
            : m
        )
      );

      // If accepted, auto-create Vendor Handoff
      if (decision === 'accept') {
        const prod = products.find((p) => p.id === rec.recommendations[0]?.productId);
        if (prod) {
          const newHandoff: VendorHandoff = {
            id: `hnd_${Date.now()}`,
            merchantId: rec.merchantId,
            opportunityId: `opp_${Date.now()}`,
            vendorId: prod.vendorId,
            productId: prod.id,
            adviserId: currentUser.id,
            consentScope: [
              'Share merchant profile and branch capacity with vendor',
              'Register Biashara Salama as Agent of Record',
            ],
            agentOfRecordConfirmed: true,
            agentOfRecordReference: `AOR-${prod.vendorName.substring(0, 4).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            status: 'sent',
            sentAt: new Date().toISOString(),
            slaDeadline: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
            handoffEvidenceDocId: `DOC-HND-${Date.now()}`,
          };
          setHandoffs((prev) => [newHandoff, ...prev]);
        }
      }
    }

    logAction('RECOMMENDATION_DECISION', 'Recommendation', recId, `Merchant ${decision}ed recommendation.`);
  };

  const respondToVendorHandoff = (
    handoffId: string,
    action: 'accepted' | 'declined' | 'clarification_requested',
    notes: string
  ) => {
    setHandoffs((prev) =>
      prev.map((h) =>
        h.id === handoffId
          ? {
              ...h,
              status: action,
              vendorRespondedAt: new Date().toISOString(),
              vendorResponseNotes: notes,
            }
          : h
      )
    );

    const hnd = handoffs.find((h) => h.id === handoffId);
    if (hnd && action === 'accepted') {
      setMerchants((prev) =>
        prev.map((m) =>
          m.id === hnd.merchantId
            ? { ...m, stage: 'implementation', currentVendorId: hnd.vendorId, updatedAt: new Date().toISOString() }
            : m
        )
      );
    }

    logAction('VENDOR_HANDOFF_RESPONSE', 'VendorHandoff', handoffId, `Vendor responded: ${action}`);
  };

  const createSupportTicket = (
    ticketData: Partial<SupportTicket> & {
      merchantId: string;
      title: string;
      description: string;
      category: SupportTicket['category'];
      severity: SupportTicket['severity'];
    }
  ) => {
    const merch = merchants.find((m) => m.id === ticketData.merchantId);
    const prod = products.find((p) => p.id === merch?.currentProductId);
    const newTicket: SupportTicket = {
      id: `tkt_${Date.now().toString().slice(-4)}`,
      merchantId: ticketData.merchantId,
      merchantName: merch?.businessName || 'Merchant',
      vendorId: merch?.currentVendorId || 'ven_simbapos',
      vendorName: prod?.vendorName || 'SimbaPOS Tanzania',
      productId: merch?.currentProductId || 'prd_simba_retail',
      productName: prod?.name || 'POS System',
      category: ticketData.category,
      severity: ticketData.severity,
      title: ticketData.title,
      description: ticketData.description,
      preferredChannel: ticketData.preferredChannel || 'whatsapp',
      responsibility: ticketData.responsibility || 'biashara_salama',
      accountableNextActionOwner: currentUser.name,
      accountableOwnerRole: currentUser.role,
      status: 'new',
      slaTargetHours: ticketData.severity === 'critical' ? 2 : ticketData.severity === 'high' ? 6 : 12,
      slaBreachDeadline: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
      isEscalated: false,
      messages: [
        {
          id: `msg_${Date.now()}`,
          authorId: currentUser.id,
          authorName: currentUser.name,
          authorRole: currentUser.role,
          message: ticketData.description,
          isInternalNote: false,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSupportTickets((prev) => [newTicket, ...prev]);
    logAction('TICKET_CREATED', 'SupportTicket', newTicket.id, `Ticket created: ${newTicket.title}`);
  };

  const addTicketMessage = (ticketId: string, message: string, isInternal: boolean) => {
    setSupportTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const newMsg = {
            id: `msg_${Date.now()}`,
            authorId: currentUser.id,
            authorName: currentUser.name,
            authorRole: currentUser.role,
            message,
            isInternalNote: isInternal,
            timestamp: new Date().toISOString(),
          };
          return {
            ...t,
            messages: [...t.messages, newMsg],
            status: t.status === 'new' ? 'in_progress' : t.status,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
  };

  const resolveTicket = (ticketId: string, summary: string) => {
    setSupportTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'resolved',
              resolutionSummary: summary,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
    logAction('TICKET_RESOLVED', 'SupportTicket', ticketId, `Ticket marked resolved: ${summary}`);
  };

  const acceptTicketResolution = (ticketId: string) => {
    setSupportTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'closed',
              merchantAcceptedResolution: true,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
    logAction('TICKET_ACCEPTED_CLOSED', 'SupportTicket', ticketId, 'Merchant accepted resolution and closed ticket.');
  };

  const updateImplementationTask = (
    impId: string,
    taskId: string,
    status: 'completed' | 'in_progress' | 'blocked',
    notes?: string
  ) => {
    setImplementations((prev) =>
      prev.map((imp) => {
        if (imp.id === impId) {
          const updatedTasks = imp.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status,
                  evidenceNotes: notes || t.evidenceNotes,
                  completedAt: status === 'completed' ? new Date().toISOString() : undefined,
                }
              : t
          );
          const allPassed = updatedTasks.every((t) => !t.isCriticalGoLiveBlocker || t.status === 'completed');
          return {
            ...imp,
            tasks: updatedTasks,
            goLiveChecklistPassed: allPassed,
            updatedAt: new Date().toISOString(),
          };
        }
        return imp;
      })
    );
  };

  const signMerchantAcceptance = (
    impId: string,
    signatoryName: string,
    signatoryRole: string,
    scope: string
  ) => {
    setImplementations((prev) =>
      prev.map((imp) => {
        if (imp.id === impId) {
          return {
            ...imp,
            merchantAcceptance: {
              isAccepted: true,
              goLiveDate: new Date().toISOString().split('T')[0],
              acceptedScope: scope,
              outstandingMinorIssues: [],
              signatoryName,
              signatoryRole,
              timestamp: new Date().toISOString(),
              acceptanceDocumentUrl: `DOC-ACC-${Date.now()}`,
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return imp;
      })
    );

    const imp = implementations.find((i) => i.id === impId);
    if (imp) {
      setMerchants((prev) =>
        prev.map((m) =>
          m.id === imp.merchantId
            ? { ...m, stage: 'active', updatedAt: new Date().toISOString() }
            : m
        )
      );
    }

    logAction('GO_LIVE_ACCEPTED', 'ImplementationPlan', impId, `Merchant signed go-live acceptance: ${signatoryName}`);
  };

  const selectProduct = (merchantId: string, productId: string, recommendationId: string) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    const selectedAt = new Date().toISOString();
    setMerchants((prev) =>
      prev.map((merchant) =>
        merchant.id === merchantId
          ? {
              ...merchant,
              stage: 'implementation',
              currentVendorId: product.vendorId,
              currentProductId: product.id,
              currentPlanName: product.plans[0]?.planName,
              updatedAt: selectedAt,
            }
          : merchant
      )
    );

    setRecommendations((prev) =>
      prev.map((recommendation) =>
        recommendation.id === recommendationId
          ? {
              ...recommendation,
              status: 'accepted',
              merchantDecision: {
                action: 'accept',
                selectedProductId: productId,
                comments: 'Product selected from the merchant portal.',
                decidedByUserId: currentUser.id,
                decidedByUserName: currentUser.name,
                timestamp: selectedAt,
              },
              updatedAt: selectedAt,
            }
          : recommendation
      )
    );

    setImplementations((prev) => {
      if (prev.some((implementation) => implementation.merchantId === merchantId)) return prev;

      const dueDate = (daysFromNow: number) =>
        new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const implementation: ImplementationPlan = {
        id: `imp_${Date.now()}`,
        merchantId,
        quotationId: `pending_${recommendationId}`,
        vendorId: product.vendorId,
        productId,
        specialistId: 'usr_impl_01',
        specialistName: 'Neema Lyimo',
        tasks: [
          {
            id: `tsk_${Date.now()}_setup`,
            title: 'Confirm implementation scope and configure product',
            category: 'product_config',
            assignedTo: product.vendorName,
            assignedRole: 'vendor',
            dueDate: dueDate(2),
            status: 'pending',
            isCriticalGoLiveBlocker: true,
          },
          {
            id: `tsk_${Date.now()}_migration`,
            title: 'Prepare and migrate merchant data',
            category: 'data_migration',
            assignedTo: 'Neema Lyimo',
            assignedRole: 'implementation_specialist',
            dueDate: dueDate(Math.max(3, product.implementationEffortDays - 2)),
            status: 'pending',
            isCriticalGoLiveBlocker: true,
          },
          {
            id: `tsk_${Date.now()}_training`,
            title: 'Train merchant users and verify competency',
            category: 'training',
            assignedTo: 'Neema Lyimo',
            assignedRole: 'implementation_specialist',
            dueDate: dueDate(Math.max(4, product.implementationEffortDays - 1)),
            status: 'pending',
            isCriticalGoLiveBlocker: true,
          },
          {
            id: `tsk_${Date.now()}_go_live`,
            title: 'Complete go-live checks and merchant acceptance',
            category: 'go_live_checks',
            assignedTo: 'Neema Lyimo',
            assignedRole: 'implementation_specialist',
            dueDate: dueDate(product.implementationEffortDays),
            status: 'pending',
            isCriticalGoLiveBlocker: true,
          },
        ],
        hardwareInventory: [],
        trainingRecords: [],
        goLiveChecklistPassed: false,
        createdAt: selectedAt,
        updatedAt: selectedAt,
      };

      return [implementation, ...prev];
    });

    logAction('PRODUCT_SELECTED', 'Product', productId, `Merchant ${merchantId} selected ${product.name}.`);
  };

  const switchVendorMigration = (merchantId: string, targetProductId: string, reason: string) => {
    const merch = merchants.find((m) => m.id === merchantId);
    const targetProd = products.find((p) => p.id === targetProductId);
    if (!merch || !targetProd) return;

    // Preserve historical vendor ids
    const previousVendorId = merch.currentVendorId;
    const updatedHistory = previousVendorId
      ? Array.from(new Set([...merch.historicalVendorIds, previousVendorId]))
      : merch.historicalVendorIds;

    setMerchants((prev) =>
      prev.map((m) =>
        m.id === merchantId
          ? {
              ...m,
              stage: 'migrating',
              currentVendorId: targetProd.vendorId,
              currentProductId: targetProd.id,
              historicalVendorIds: updatedHistory,
              notes: `${m.notes} | [Vendor Switch Initiated: ${reason}]`,
              updatedAt: new Date().toISOString(),
            }
          : m
      )
    );

    logAction('VENDOR_MIGRATION_INITIATED', 'Merchant', merchantId, `Migrated to ${targetProd.name}. Reason: ${reason}`);
  };

  const reconcileCommissionEntry = (
    entryId: string,
    status: 'matched' | 'variance_disputed' | 'settled',
    notes?: string
  ) => {
    setCommissionLedger((prev) =>
      prev.map((e) =>
        e.id === entryId
          ? {
              ...e,
              status,
              disputeNotes: notes || e.disputeNotes,
            }
          : e
      )
    );
    logAction('COMMISSION_RECONCILED', 'CommissionLedgerEntry', entryId, `Commission updated to ${status}`);
  };

  const approveVendor = (vendorId: string) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId ? { ...v, status: 'approved', statusExpiryDate: '2027-12-31T00:00:00Z' } : v
      )
    );
    logAction('VENDOR_APPROVED', 'Vendor', vendorId, 'Vendor status set to Approved.');
  };

  const approveProduct = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, approvalStatus: 'approved', approvalExpiryDate: '2027-12-31T00:00:00Z' }
          : p
      )
    );
    logAction('PRODUCT_APPROVED', 'Product', productId, 'Product claims verified and approved for publishing.');
  };

  const recordConsent = (consentData: Omit<ConsentRecord, 'id' | 'grantedAt'>) => {
    const consent: ConsentRecord = {
      ...consentData,
      id: `cons_${Date.now()}`,
      grantedAt: new Date().toISOString(),
    };
    setConsentRecords((prev) => [consent, ...prev]);
    logAction(
      'CONSENT_RECORDED',
      'ConsentRecord',
      consent.id,
      `Consent granted for version ${consentData.version} via ${consentData.channel}`
    );
  };

  const submitDataRightsRequest = (req: Omit<DataRightsRequest, 'id' | 'createdAt' | 'status' | 'legalHoldApplied'>) => {
    const newReq: DataRightsRequest = {
      ...req,
      id: `dr_${Date.now()}`,
      status: 'received',
      legalHoldApplied: false,
      createdAt: new Date().toISOString(),
    };
    setDataRightsRequests((prev) => [newReq, ...prev]);
    logAction('DATA_RIGHTS_REQUEST', 'DataRightsRequest', newReq.id, `Type: ${req.requestType} from ${req.merchantName}`);
  };

  const resetToSampleData = () => {
    LEGACY_STORAGE_SUFFIXES.forEach((suffix) => {
      localStorage.removeItem(`${STORAGE_KEY}_${suffix}`);
    });
    setAllUsers(INITIAL_USERS);
    setMerchants(INITIAL_MERCHANTS);
    setVendors(INITIAL_VENDORS);
    setProducts(INITIAL_PRODUCTS);
    setAssessments(INITIAL_ASSESSMENTS);
    setRecommendations(INITIAL_RECOMMENDATIONS);
    setHandoffs(INITIAL_HANDOFFS);
    setQuotations(INITIAL_QUOTATIONS);
    setImplementations(INITIAL_IMPLEMENTATIONS);
    setSupportTickets(INITIAL_SUPPORT_TICKETS);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setCommissionRules(INITIAL_COMMISSION_RULES);
    setCommissionLedger(INITIAL_COMMISSION_LEDGER);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setDataRightsRequests(INITIAL_DATA_RIGHTS_REQUESTS);
    setConsentRecords([]);
    setCurrentUser(INITIAL_USERS[0]);
    setSelectedMerchantId('mrc_001');
    logAction('RESET_SAMPLE_DATA', 'System', 'all', 'Reset application state to default demonstration dataset.');
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentUser,
        setCurrentUser,
        allUsers,
        switchUserRole,
        activeTab,
        setActiveTab,
        comparedProductIds,
        addToComparison,
        removeFromComparison,
        clearComparison,
        selectedMerchantId,
        setSelectedMerchantId,
        selectedVendorId,
        setSelectedVendorId,
        selectedProductId,
        setSelectedProductId,
        merchants,
        vendors,
        products,
        assessments,
        recommendations,
        handoffs,
        quotations,
        implementations,
        supportTickets,
        subscriptions,
        commissionRules,
        commissionLedger,
        auditLogs,
        dataRightsRequests,
        consentRecords,
        databaseStatus,
        databaseError,
        createLead,
        saveAssessment,
        completeAssessment,
        issueRecommendation,
        respondToRecommendation,
        respondToVendorHandoff,
        createSupportTicket,
        addTicketMessage,
        resolveTicket,
        acceptTicketResolution,
        updateImplementationTask,
        signMerchantAcceptance,
        selectProduct,
        switchVendorMigration,
        reconcileCommissionEntry,
        approveVendor,
        approveProduct,
        recordConsent,
        submitDataRightsRequest,
        resetToSampleData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
