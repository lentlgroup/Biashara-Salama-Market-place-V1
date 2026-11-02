import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Store,
  CheckCircle2,
  Clock,
  FileText,
  Headphones,
  ShieldCheck,
  Download,
  AlertCircle,
  Plus,
  ArrowRight,
  ClipboardList,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
  WifiOff,
  UserCheck,
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { AssessmentEngine } from './AssessmentEngine';
import type { ImplementationPlan, SupportTicket } from '../../types';

const getImplementationStatus = (implementation: ImplementationPlan) => {
  if (implementation.tasks.every((task) => task.status === 'completed')) return 'completed';
  if (implementation.tasks.some((task) => task.status === 'in_progress')) return 'in_progress';
  if (implementation.tasks.some((task) => task.status === 'blocked')) return 'blocked';

  return 'pending';
};

export const MerchantPortal: React.FC = () => {
  const {
    merchants,
    currentUser,
    recommendations,
    assessments,
    implementations,
    supportTickets,
    products,
    selectProduct,
    createSupportTicket,
    t,
  } = useApp();

  // Find active merchant associated with current merchant user, or default to the first
  const activeMerchant =
    merchants.find((m) => m.id === currentUser.merchantId) || merchants[0];

  const [activeTab, setActiveTab] = useState<
    'overview' | 'assessment' | 'recommendations' | 'implementation' | 'support' | 'documents'
  >('overview');

  const [isTakingAssessment, setIsTakingAssessment] = useState(false);

  // New Ticket State
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketCategory, setTicketCategory] = useState<SupportTicket['category']>('data_issue');
  const [ticketPriority, setTicketPriority] = useState<SupportTicket['severity']>('high');

  if (!activeMerchant) {
    return <div className="p-8 text-center text-xs">No merchant record found.</div>;
  }

  const merchantRecommendations = recommendations.filter((r) => r.merchantId === activeMerchant.id);
  const latestRecommendation = merchantRecommendations[merchantRecommendations.length - 1];
  const merchantAssessment = assessments.find((a) => a.merchantId === activeMerchant.id);
  const activeImplementation = implementations.find((imp) => imp.merchantId === activeMerchant.id);
  const activeImplementationStatus = activeImplementation ? getImplementationStatus(activeImplementation) : null;
  const targetGoLiveDate = activeImplementation?.tasks[activeImplementation.tasks.length - 1]?.dueDate;
  const merchantTickets = supportTickets.filter((t) => t.merchantId === activeMerchant.id);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDescription) return;

    createSupportTicket({
      merchantId: activeMerchant.id,
      vendorId: activeMerchant.currentVendorId,
      productId: activeMerchant.currentProductId,
      title: ticketSubject,
      description: ticketDescription,
      category: ticketCategory,
      severity: ticketPriority,
    });

    setTicketSubject('');
    setTicketDescription('');
    setShowNewTicketModal(false);
  };

  const getLifecycleStageLabel = (stage: string) => {
    switch (stage) {
      case 'lead':
        return '1. Lead & Mahitaji ya Awali';
      case 'assessment_in_progress':
        return '2. Tathmini ya Biashara Inafanyika';
      case 'assessment_complete':
        return '3. Tathmini Imekamilika';
      case 'recommendation_issued':
        return '4. Ushauri Umetolewa (Chagua Mfumo)';
      case 'accepted':
        return '5. Uteuzi Umeidhinishwa';
      case 'implementation':
        return '6. Utekelezaji & Mafunzo (Onboarding)';
      case 'active':
        return '7. Mfumo Upo Kazini (Active Live)';
      default:
        return stage;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Merchant Top Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-[#D4AF37] bg-[#0B2F66] px-2.5 py-0.5 rounded-md shadow-2xs">
              Merchant ID: {activeMerchant.id}
            </span>
            <Badge variant="primary" size="sm">
              {getLifecycleStageLabel(activeMerchant.stage)}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2F66]">
            Karibu, {activeMerchant.businessName}
          </h1>
          <p className="text-xs text-gray-500">
            Miliki ya Biashara: <strong className="text-gray-800">{activeMerchant.contacts[0]?.name}</strong> ({activeMerchant.contacts[0]?.phone}) | Eneo: {activeMerchant.city}, {activeMerchant.region}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Verification Status matching theme */}
          <div className="px-4 py-2 bg-[#F9FAFB] border border-gray-200 rounded-xl text-center shadow-2xs">
            <p className="text-[10px] uppercase text-gray-400 font-bold tracking-tight">Verification Status</p>
            <p className="text-xs font-bold text-green-600 flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Verified Merchant
            </p>
          </div>

          {activeMerchant.stage === 'lead' || !merchantAssessment ? (
            <button
              onClick={() => setIsTakingAssessment(true)}
              className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#c5a02e] text-[#0B2F66] rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-tight"
            >
              <ClipboardList className="w-4 h-4 text-[#0B2F66]" />
              <span>Anza Tathmini</span>
            </button>
          ) : (
            <button
              onClick={() => setIsTakingAssessment(true)}
              className="px-3.5 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Sasisha Tathmini
            </button>
          )}
        </div>
      </div>

      {/* 4-Stage Progress Cards (Theme Pattern) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Step 1: Tathmini */}
        <div
          className={`relative flex flex-col p-4 rounded-xl shadow-xs transition-all ${
            merchantAssessment
              ? 'bg-[#0B2F66] text-white shadow-md'
              : 'bg-white border-2 border-[#0B2F66]'
          }`}
        >
          <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${merchantAssessment ? 'text-[#D4AF37]' : 'text-[#0B2F66]'}`}>
            HATUA YA 1
          </span>
          <span className={`font-bold text-sm ${merchantAssessment ? 'text-white' : 'text-[#0B2F66]'}`}>
            Tathmini ya Mahitaji
          </span>
          <div className="mt-2.5 h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
            <div className={`h-full bg-[#D4AF37] ${merchantAssessment ? 'w-full' : 'w-1/3'}`}></div>
          </div>
          <span className={`text-[10px] mt-2 font-medium ${merchantAssessment ? 'text-blue-100 italic' : 'text-[#0B2F66]'}`}>
            {merchantAssessment ? '✓ Imekamilika' : 'Inahitajika'}
          </span>
        </div>

        {/* Step 2: Linganisha */}
        <div
          className={`relative flex flex-col p-4 rounded-xl shadow-xs transition-all ${
            merchantAssessment && !latestRecommendation
              ? 'bg-[#0B2F66] text-white shadow-md'
              : latestRecommendation
              ? 'bg-white border border-gray-200'
              : 'bg-white border border-gray-200 opacity-60'
          }`}
        >
          <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${merchantAssessment && !latestRecommendation ? 'text-[#D4AF37]' : 'text-gray-500'}`}>
            HATUA YA 2
          </span>
          <span className={`font-bold text-sm ${merchantAssessment && !latestRecommendation ? 'text-white' : 'text-gray-800'}`}>
            Linganisha Mifumo
          </span>
          <div className="mt-2.5 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full bg-[#0B2F66] ${latestRecommendation ? 'w-full' : merchantAssessment ? 'w-2/3' : 'w-0'}`}></div>
          </div>
          <span className="text-[10px] mt-2 font-medium text-gray-500">
            {latestRecommendation ? '✓ Imefanywa' : 'Uchambuzi'}
          </span>
        </div>

        {/* Step 3: Ushauri wa Mtaalam */}
        <div
          className={`relative flex flex-col p-4 rounded-xl shadow-xs transition-all ${
            latestRecommendation && !activeMerchant.currentProductId
              ? 'bg-[#0B2F66] text-white shadow-md'
              : activeMerchant.currentProductId
              ? 'bg-white border border-gray-200'
              : 'bg-white border border-gray-200 opacity-60'
          }`}
        >
          <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${latestRecommendation && !activeMerchant.currentProductId ? 'text-[#D4AF37]' : 'text-gray-500'}`}>
            HATUA YA 3
          </span>
          <span className={`font-bold text-sm ${latestRecommendation && !activeMerchant.currentProductId ? 'text-white' : 'text-gray-800'}`}>
            Ushauri wa Mtaalam
          </span>
          <div className="mt-2.5 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full bg-[#D4AF37] ${activeMerchant.currentProductId ? 'w-full' : latestRecommendation ? 'w-2/3' : 'w-0'}`}></div>
          </div>
          <span className="text-[10px] mt-2 font-medium text-gray-500">
            {activeMerchant.currentProductId ? '✓ Uteuzi Umekamilika' : latestRecommendation ? 'Dossier Ipo Tayari' : 'Inasubiriwa'}
          </span>
        </div>

        {/* Step 4: Rollout */}
        <div
          className={`relative flex flex-col p-4 rounded-xl shadow-xs transition-all ${
            activeMerchant.currentProductId
              ? 'bg-[#0B2F66] text-white shadow-md'
              : 'bg-white border border-gray-200 opacity-60'
          }`}
        >
          <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${activeMerchant.currentProductId ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
            HATUA YA 4
          </span>
          <span className={`font-bold text-sm ${activeMerchant.currentProductId ? 'text-white' : 'text-gray-400'}`}>
            Rollout & Go-Live
          </span>
          <div className="mt-2.5 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full bg-emerald-400 ${activeImplementationStatus === 'completed' ? 'w-full' : activeMerchant.currentProductId ? 'w-1/2' : 'w-0'}`}></div>
          </div>
          <span className="text-[10px] mt-2 font-medium text-gray-500">
            {activeImplementationStatus === 'completed' ? '✓ Mfumo Kazini' : 'Utekelezaji'}
          </span>
        </div>
      </div>

      {/* If Taking Assessment Modal / Wizard is open */}
      {isTakingAssessment && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-[#0B2F66]">Fomu ya Tathmini ya Mahitaji ya Biashara</h2>
            <button
              onClick={() => setIsTakingAssessment(false)}
              className="text-xs text-slate-500 hover:text-slate-900 font-semibold"
            >
              Funga & Rudi kwenye Dashibodi
            </button>
          </div>
          <AssessmentEngine
            merchantId={activeMerchant.id}
            onAssessmentCompleted={() => {
              setIsTakingAssessment(false);
              setActiveTab('recommendations');
            }}
          />
        </div>
      )}

      {/* Merchant Nav Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 bg-white p-2 rounded-xl shadow-2xs overflow-x-auto text-xs">
        {[
          { id: 'overview', label: 'Muhtasari wa Akaunti (Overview)', icon: Store },
          {
            id: 'recommendations',
            label: 'Ushauri wa Mifumo (Recommendations)',
            icon: Award,
            badge: latestRecommendation ? 1 : 0,
          },
          {
            id: 'implementation',
            label: 'Utekelezaji & Mafunzo (Rollout Tracker)',
            icon: CheckCircle2,
          },
          {
            id: 'support',
            label: 'Msaada & Tiketi (Support Console)',
            icon: Headphones,
            badge: merchantTickets.length,
          },
          { id: 'documents', label: 'Mikataba & Hati (Compliance Vault)', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#0B2F66] text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                    isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Status Pipeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Box 1: Assessment Status */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Hatua ya 1: Tathmini
                </span>
                <Badge variant={merchantAssessment ? 'success' : 'warning'} size="sm">
                  {merchantAssessment ? '100% Imekamilika' : 'Inasubiriwa'}
                </Badge>
              </div>
              <h3 className="font-bold text-[#0B2F66] text-sm">
                {merchantAssessment ? 'Mahitaji Yamechambuliwa' : 'Anza Tathmini ya Biashara'}
              </h3>
              <p className="text-xs text-gray-500">
                {merchantAssessment
                  ? `Matawi: ${merchantAssessment.responses.branchCount} | Watumiaji: ${merchantAssessment.responses.userCount} | TRA VFD: Ndiyo`
                  : 'Mshauri wetu anahitaji taarifa za matawi yako na vifaa ulivyonavyo.'}
              </p>
            </div>

            {/* Box 2: Recommendation Status */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Hatua ya 2: Ushauri
                </span>
                <Badge variant={latestRecommendation ? 'gold' : 'neutral'} size="sm">
                  {latestRecommendation ? 'Imesainiwa na Mshauri' : 'Inatayarishwa'}
                </Badge>
              </div>
              <h3 className="font-bold text-[#0B2F66] text-sm">
                {latestRecommendation ? 'Dossier ya Ushauri Ipo Tayari' : 'Inasubiri Mapitio'}
              </h3>
              <p className="text-xs text-gray-500">
                {latestRecommendation
                  ? `Mshauri ${latestRecommendation.namedAdviserName} amependekeza mifumo ${latestRecommendation.recommendations.length}.`
                  : 'Baada ya tathmini, mshauri ataandaa orodha ya mifumo inayokufaa.'}
              </p>
            </div>

            {/* Box 3: Live System Status */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Hatua ya 3: Utekelezaji
                </span>
                <Badge
                  variant={activeImplementationStatus === 'completed' ? 'success' : 'primary'}
                  size="sm"
                >
                  {activeImplementationStatus || 'Inasubiri Uteuzi'}
                </Badge>
              </div>
              <h3 className="font-bold text-[#0B2F66] text-sm">
                {activeMerchant.currentProductId
                  ? `Mfumo Uliochaguliwa: ${activeMerchant.currentProductId}`
                  : 'Bado Hujachagua Mfumo'}
              </h3>
              <p className="text-xs text-gray-500">
                {activeImplementation
                  ? `Mtaalamu: ${activeImplementation.specialistName} (Hatua za Go-Live)`
                  : 'Ukichagua mfumo, mtaalamu wetu atakusaidia kufanya usanidi na mafunzo.'}
              </p>
            </div>
          </div>

          {/* Prompt banner if recommendation is waiting for selection */}
          {latestRecommendation && !activeMerchant.currentProductId && (
            <div className="bg-[#0B2F66] text-white rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md border border-blue-900">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    Ushauri wa Mshauri {latestRecommendation.namedAdviserName} Umekamilika!
                  </h4>
                  <p className="text-xs text-blue-200 mt-0.5">
                    Mshauri wako amependekeza mifumo {latestRecommendation.recommendations.length} inayokidhi vigezo vyako vya TRA, uwezo wa kufanya kazi bila mtandao na bajeti.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('recommendations')}
                className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#c5a02e] text-[#0B2F66] rounded-xl font-bold text-xs shrink-0 cursor-pointer shadow-sm uppercase tracking-tight"
              >
                Pitia & Chagua Mfumo
              </button>
            </div>
          )}

          {/* 2-Column Split matching Professional Polish design */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Recommended Systems */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div>
                  <h2 className="text-base font-bold text-[#0B2F66]">Mifumo Iliyopendekezwa Awali</h2>
                  <p className="text-xs text-gray-500">Mifumo iliyohakikiwa inayolingana na sekta ya biashara yako</p>
                </div>
                <button
                  onClick={() => setActiveTab('recommendations')}
                  className="text-xs text-[#0B2F66] font-bold hover:underline cursor-pointer"
                >
                  Angalia Zote &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {/* Product 1: SimbaPOS / SmartPOS */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 bg-[#F9FAFB]/50 rounded-xl hover:shadow-md transition-shadow gap-3">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-14 h-14 bg-blue-50 border border-blue-200/60 rounded-xl flex items-center justify-center font-black text-[#0B2F66] text-xl shrink-0">
                      SP
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">SimbaPOS Retail & Supermarket (VFD Ready)</h3>
                      <p className="text-[11px] text-gray-500 mb-1.5 italic">Imehakikiwa na Mshauri wa Biashara Salama</p>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded uppercase border border-green-200/60">
                          TRA Approved
                        </span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase border border-blue-200/60">
                          Full Offline 14 Days
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">TZS 85,000</p>
                    <p className="text-[10px] text-gray-400">kwa mwezi</p>
                    <button
                      onClick={() => setActiveTab('recommendations')}
                      className="mt-1.5 px-3.5 py-1.5 bg-[#D4AF37] hover:bg-[#c5a02e] text-[#0B2F66] text-[10px] font-bold rounded-lg uppercase shadow-2xs cursor-pointer tracking-tight"
                    >
                      Linganisha
                    </button>
                  </div>
                </div>

                {/* Product 2: Twiga */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 bg-[#F9FAFB]/50 rounded-xl hover:shadow-md transition-shadow gap-3">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-14 h-14 bg-amber-50 border border-amber-200/60 rounded-xl flex items-center justify-center font-black text-amber-800 text-xl shrink-0">
                      TW
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">Twiga Inventory & Distribution Pro</h3>
                      <p className="text-[11px] text-gray-500 mb-1.5 italic">Imehakikiwa kwa ajili ya usambazaji na maduka ya jumla</p>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded uppercase border border-purple-200/60">
                          Multi-Branch
                        </span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase border border-blue-200/60">
                          Stock Distribution
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">TZS 120,000</p>
                    <p className="text-[10px] text-gray-400">kwa mwezi</p>
                    <button
                      onClick={() => setActiveTab('recommendations')}
                      className="mt-1.5 px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold rounded-lg uppercase cursor-pointer tracking-tight"
                    >
                      Linganisha
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Ushauri wa Siku & Assigned Adviser Card */}
            <div className="space-y-4">
              {/* Daily Advice Card in Theme Navy */}
              <div className="bg-[#0B2F66] text-white rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-md">
                <div>
                  <h2 className="text-base font-bold text-white mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    Ushauri wa Siku
                  </h2>
                  <p className="text-xs text-blue-100 leading-relaxed italic">
                    "Hakuna cha kupotea tunapofanya tathmini makini. Mfumo sahihi ni uwekezaji unaookoa muda, siyo gharama."
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-white/10 rounded-xl border border-white/15">
                    <p className="text-[10px] font-bold uppercase text-[#D4AF37] mb-0.5">Mkutano Ujao (Adviser Review)</p>
                    <p className="text-sm font-bold text-white">Ijumaa, 14:00 EAT</p>
                    <p className="text-xs text-blue-200">Kupitia Mapendekezo ya Mfumo</p>
                  </div>
                  <button
                    onClick={() => setIsTakingAssessment(true)}
                    className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#c5a02e] text-[#0B2F66] font-bold rounded-xl shadow-md uppercase text-xs cursor-pointer tracking-tight"
                  >
                    Anza Tathmini Upya
                  </button>
                </div>
              </div>

              {/* Assigned Adviser Widget */}
              <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-xs space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Adviser Wako Aliyepangiwa</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#0B2F66] text-[#D4AF37] flex items-center justify-center text-xs font-black shadow-2xs">
                    FJ
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Fatuma Juma</p>
                    <p className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Online Sasa
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('support')}
                  className="w-full py-2 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-100 uppercase tracking-tight cursor-pointer"
                >
                  Zungumza na Mshauri
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Recommendations Dossier */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          {!latestRecommendation ? (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200 shadow-xs space-y-3">
              <ClipboardList className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">
                Bado Hakuna Ushauri Uliotolewa kwa Biashara Hii
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Kamilisha tathmini ya mahitaji kwanza ili mshauri wetu aliyesajiliwa apitie na kutoa ripoti rasmi.
              </p>
              <button
                onClick={() => setIsTakingAssessment(true)}
                className="px-4 py-2 bg-[#0B2F66] text-white rounded-md text-xs font-bold"
              >
                Anza Tathmini Sasa
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-6 p-6">
              {/* Dossier Header */}
              <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                    Dossier Rasmi ya Ushauri wa Kitaalamu (Advisory Recommendation Report)
                  </span>
                  <h2 className="text-xl font-bold text-[#0B2F66] mt-0.5">
                    Ripoti ya Ushauri: {latestRecommendation.id}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Iliandaliwa na: <strong className="text-slate-800">{latestRecommendation.namedAdviserName}</strong> (Certified Technology Adviser) | Tarehe: {latestRecommendation.createdAt.split('T')[0]}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3 h-3" />}>
                    Mshauri Aliyesajiliwa Ameidhinisha
                  </Badge>
                </div>
              </div>

              {/* Adviser Rationale Narrative */}
              <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 space-y-2 text-xs text-blue-950">
                <div className="font-bold text-xs text-[#0B2F66] flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#0B2F66]" />
                  Maoni na Sababu za Kitaalamu za Mshauri (Adviser Rationale):
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{latestRecommendation.adviserRationale}"
                </p>
              </div>

              {/* Recommended Options Selection Grid */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">
                  Chaguo Zilizopendekezwa na Sababu zake (Tathmini ya Chaguo):
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {latestRecommendation.recommendations.map((item) => {
                    const isCurrentlySelected = activeMerchant.currentProductId === item.productId;
                    const recommendedProduct = products.find((product) => product.id === item.productId);

                    return (
                      <div
                        key={item.productId}
                        className={`rounded-xl border p-5 flex flex-col justify-between space-y-4 transition-all ${
                          isCurrentlySelected
                            ? 'bg-blue-50/50 border-[#0B2F66] ring-2 ring-[#0B2F66]'
                            : item.isPrimaryRecommendation
                            ? 'bg-amber-50/30 border-amber-300'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge
                              variant={item.isPrimaryRecommendation ? 'gold' : 'neutral'}
                              size="sm"
                            >
                              {item.isPrimaryRecommendation ? 'Chaguo Kuu (Primary Recommendation)' : 'Mbadala (Alternative Option)'}
                            </Badge>
                            <span className="text-xs font-bold text-[#0B2F66]">
                              {item.matchScore}% Fit Score
                            </span>
                          </div>

                          <div>
                            <h4 className="font-bold text-slate-900 text-base">{item.productName}</h4>
                            <span className="text-xs text-slate-500 font-medium">
                              Mtoa Huduma: {item.vendorName}
                            </span>
                          </div>

                          <div className="bg-white/80 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                            <span className="font-bold text-slate-800 block">Kwa nini mfumo huu?</span>
                            <p className="text-[11px] text-slate-600">{item.implementationNotes}</p>
                          </div>

                          <div className="text-xs space-y-1 pt-1">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Ada ya Mwezi:</span>
                              <strong>TZS {Math.round(item.totalCostEstimateTZS.estimatedAnnualRecurring / 12).toLocaleString()}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Gharama ya Usanidi (Setup):</span>
                              <strong>TZS {(item.totalCostEstimateTZS.hardware + item.totalCostEstimateTZS.setupAndMigration + item.totalCostEstimateTZS.training).toLocaleString()}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Muda wa Kuanza:</span>
                              <strong>{recommendedProduct?.implementationEffortDays || '—'} Siku</strong>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-200">
                          {isCurrentlySelected ? (
                            <div className="py-2 px-3 bg-emerald-100 text-emerald-900 rounded-md text-xs font-bold text-center flex items-center justify-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                              <span>Mfumo Uliochaguliwa (Selected System)</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                selectProduct(
                                  activeMerchant.id,
                                  item.productId,
                                  latestRecommendation.id
                                );
                                setActiveTab('implementation');
                              }}
                              className="w-full py-2.5 px-4 bg-[#0B2F66] hover:bg-[#071f45] text-white rounded-md text-xs font-bold text-center flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                            >
                              <span>Chagua Mfumo Huu & Anza Rollout</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Explicit Brokerage Disclosure Box */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0B2F66] shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Mwongozo wa Malipo:</strong> Malipo ya programu hulipwa moja kwa moja kwa mtoa huduma ({latestRecommendation.recommendations[0]?.vendorName}). Biashara Salama inatoa ufuatiliaji, mkataba wa huduma na usimamizi wa uhakiki bila kutoza tozo za siri.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Implementation & Training Tracker */}
      {activeTab === 'implementation' && (
        <div className="space-y-6">
          {!activeImplementation ? (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200 shadow-xs space-y-3">
              <CheckCircle2 className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">
                Mpango wa Utekelezaji Utatengenezwa Ukichagua Mfumo
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Pitia ripoti ya ushauri wa mshauri na uchague mfumo unaotaka ili mpango wa siku 14 wa mafunzo uanze mara moja.
              </p>
              <button
                onClick={() => setActiveTab('recommendations')}
                className="px-4 py-2 bg-[#0B2F66] text-white rounded-md text-xs font-bold"
              >
                Pitia Ushauri wa Mifumo
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                    Mpango wa Utekelezaji & Mafunzo (Onboarding Milestones)
                  </span>
                  <h2 className="text-xl font-bold text-[#0B2F66] mt-0.5">
                    Mradi wa Go-Live: {activeImplementation.id}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Mtaalamu wa Usanidi: <strong className="text-slate-800">{activeImplementation.specialistName}</strong> | Tarehe ya Kukamilika: {targetGoLiveDate || 'Haijapangwa'}
                  </p>
                </div>

                <Badge
                  variant={activeImplementationStatus === 'completed' ? 'success' : 'primary'}
                  size="md"
                >
                  Hali: {activeImplementationStatus}
                </Badge>
              </div>

              {/* Milestones List */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">Hatua za Utekelezaji (Milestones):</h3>
                <div className="space-y-3">
                  {activeImplementation.tasks.map((ms, idx) => (
                    <div
                      key={ms.id}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                        ms.status === 'completed'
                          ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                          : ms.status === 'in_progress'
                          ? 'bg-blue-50/50 border-blue-300 text-blue-950'
                          : 'bg-slate-50/50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            ms.status === 'completed'
                              ? 'bg-emerald-600 text-white'
                              : ms.status === 'in_progress'
                              ? 'bg-[#0B2F66] text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-xs text-slate-900">{ms.title}</h4>
                          <p className="text-[11px] text-slate-600">{ms.evidenceNotes || `Assigned to ${ms.assignedTo}`}</p>
                          <span className="text-[10px] text-slate-500 block">
                            Tarehe Lengo: {ms.dueDate}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Badge
                          variant={
                            ms.status === 'completed'
                              ? 'success'
                              : ms.status === 'in_progress'
                              ? 'warning'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {ms.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Support & Helpdesk Tickets */}
      {activeTab === 'support' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#0B2F66]">
                  Dawati la Msaada wa Kiufundi (Support Helpdesk)
                </h2>
                <p className="text-xs text-slate-500">
                  Ripoti hitilafu yoyote ya TRA VFD, printa ya risiti au maswali ya wafanyakazi. Timu yetu inafuatilia SLA kwa ukaribu.
                </p>
              </div>

              <button
                onClick={() => setShowNewTicketModal(true)}
                className="px-4 py-2 bg-[#0B2F66] hover:bg-[#071f45] text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Fungua Tiketi Mpya</span>
              </button>
            </div>

            {merchantTickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                Hakuna tiketi zozote za msaada zilizofunguliwa kwa sasa. Mfumo unafanya kazi vizuri.
              </div>
            ) : (
              <div className="space-y-3">
                {merchantTickets.map((tk) => (
                  <div
                    key={tk.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/60 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{tk.id}</span>
                        <span className="text-xs font-semibold text-[#0B2F66]">{tk.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            tk.status === 'resolved'
                              ? 'success'
                              : tk.status === 'in_progress'
                              ? 'warning'
                              : 'primary'
                          }
                          size="sm"
                        >
                          {tk.status}
                        </Badge>
                        <Badge
                          variant={tk.severity === 'critical' ? 'danger' : 'neutral'}
                          size="sm"
                        >
                          {tk.severity}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600">{tk.description}</p>

                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
                      <span>Aina ya Hitilafu: {tk.category}</span>
                      <span>Mtoa Huduma: {tk.vendorId}</span>
                      <span>Imetolewa: {tk.createdAt.split('T')[0]}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* New Ticket Modal */}
          {showNewTicketModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
                <div className="bg-[#0B2F66] text-white p-4 flex items-center justify-between">
                  <h3 className="font-bold text-sm">Fungua Tiketi ya Msaada wa Kiufundi</h3>
                  <button
                    onClick={() => setShowNewTicketModal(false)}
                    className="text-white/70 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleCreateTicket} className="p-5 space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Kichwa cha Hitilafu (Subject) *</label>
                    <input
                      type="text"
                      required
                      placeholder="mf. Risiti za TRA hazisawazishi mtandao ukiwa umerejea"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Aina ya Tatizo</label>
                      <select
                        value={ticketCategory}
                        onChange={(e) => setTicketCategory(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none bg-white text-xs"
                      >
                        <option value="data_issue">Hitilafu ya Risiti ya TRA VFD / Data</option>
                        <option value="defect">Kusawazisha Mauzo / Mfumo</option>
                        <option value="hardware_fault">Printa / Scanner ya Barcode</option>
                        <option value="training_gap">Msaada wa Mafunzo ya Mfanyakazi</option>
                        <option value="billing_inquiry">Ufafanuzi wa Bili ya Leseni</option>
                        <option value="complaint">Malalamiko Mengine</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Kiwango cha Uharaka</label>
                      <select
                        value={ticketPriority}
                        onChange={(e) => setTicketPriority(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none bg-white text-xs"
                      >
                        <option value="low">Kawaida (Low - Masaa 24)</option>
                        <option value="medium">Wastani (Medium - Masaa 12)</option>
                        <option value="high">Haraka (High - Masaa 4)</option>
                        <option value="critical">Dharura ya Kaunta (Critical - Ndani ya Saa 1)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Maelezo ya Kina ya Hitilafu *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Eleza kosa linalotokea kwenye skrini au printa..."
                      value={ticketDescription}
                      onChange={(e) => setTicketDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setShowNewTicketModal(false)}
                      className="px-3.5 py-2 border border-slate-300 text-slate-700 rounded-md font-semibold text-xs"
                    >
                      Ghairi
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0B2F66] text-white rounded-md font-bold text-xs hover:bg-[#071f45]"
                    >
                      Tuma Tiketi
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Documents Vault */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-xl font-bold text-[#0B2F66]">
              Hati za Kisheria na Nyaraka za Mfumo (Compliance & Audit Vault)
            </h2>
            <p className="text-xs text-slate-500">
              Nyaraka zote rasmi za idhini ya PDPA, mkataba wa Agent of Record na ripoti za ushauri wa kitaalamu zimehifadhiwa hapa kisheria.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-lg border border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#0B2F66]" />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    Mkataba wa Uwakilishi wa Mteja (Agent of Record Mandate Agreement)
                  </h4>
                  <span className="text-[11px] text-slate-500">Hali: Imesainiwa kielektroniki | Ref: AOR-2026-TZ-08</span>
                </div>
              </div>
              <span className="text-emerald-700 font-bold text-xs">Active</span>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    Idhini ya Ulinzi wa Taarifa Binafsi (PDPA 2022 Consent v1.0)
                  </h4>
                  <span className="text-[11px] text-slate-500">Imehifadhiwa: {activeMerchant.createdAt.split('T')[0]}</span>
                </div>
              </div>
              <span className="text-emerald-700 font-bold text-xs">Verified</span>
            </div>

            {latestRecommendation && (
              <div className="p-4 rounded-lg border border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-amber-600" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">
                      Ripoti ya Ushauri wa Kitaalamu (Adviser Recommendation Dossier)
                    </h4>
                    <span className="text-[11px] text-slate-500">Ref: {latestRecommendation.id} | Mshauri: Juma</span>
                  </div>
                </div>
                <span className="text-blue-700 font-bold text-xs">Issued</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
