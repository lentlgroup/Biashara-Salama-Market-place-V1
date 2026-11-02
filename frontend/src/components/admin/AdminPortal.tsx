import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Users,
  Award,
  CheckCircle2,
  FileText,
  DollarSign,
  Layers,
  Sparkles,
  ClipboardList,
  Scale,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  UserCheck,
  Check,
  X,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { Badge } from '../common/Badge';
import type { ImplementationPlan } from '../../types';

const getImplementationStatus = (implementation: ImplementationPlan) => {
  if (implementation.tasks.every((task) => task.status === 'completed')) return 'completed';
  if (implementation.tasks.some((task) => task.status === 'in_progress')) return 'in_progress';
  if (implementation.tasks.some((task) => task.status === 'blocked')) return 'blocked';

  return 'pending';
};

export const AdminPortal: React.FC = () => {
  const {
    currentUser,
    merchants,
    vendors,
    products,
    assessments,
    recommendations,
    implementations,
    supportTickets,
    auditLogs,
    issueRecommendation,
    t,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<
    'advisory' | 'implementations' | 'compliance' | 'finance' | 'audit' | 'analytics'
  >(
    currentUser.role === 'adviser'
      ? 'advisory'
      : currentUser.role === 'implementation_specialist'
      ? 'implementations'
      : currentUser.role === 'compliance_approver'
      ? 'compliance'
      : currentUser.role === 'finance_analyst'
      ? 'finance'
      : 'analytics'
  );

  // Issue Recommendation State
  const [selectedMerchantForRec, setSelectedMerchantForRec] = useState<string | null>(null);
  const [recRationale, setRecRationale] = useState(
    'Baada ya kufanya tathmini ya kina ya matawi na mahitaji ya TRA VFD, SimbaPOS ndicho chaguo bora zaidi kwa sababu ya uwezo wake wa 100% wa kufanya kazi bila intaneti na uthibitisho rasmi wa TRA Web API.'
  );

  const handleIssueRecommendationSubmit = (merchantId: string) => {
    const assessment = assessments.find((item) => item.merchantId === merchantId);
    if (!assessment) return;

    const candidateProducts = products
      .filter((product) => product.approvalStatus === 'approved')
      .slice(0, 2);

    issueRecommendation({
      merchantId,
      assessmentId: assessment.id,
      adviserRationale: recRationale,
      recommendations: candidateProducts.map((product, index) => {
        const plan = product.plans[0];
        const annualSoftwareCost = plan?.annualFeeTZS || (plan?.monthlyFeeTZS || 0) * 12;

        return {
          productId: product.id,
          productName: product.name,
          vendorName: product.vendorName,
          isPrimaryRecommendation: index === 0,
          matchScore: index === 0 ? 96 : 88,
          matchedRequirements: product.features.slice(0, 5),
          identifiedGaps: [],
          limitations: product.offlineCapabilities === 'cloud_only' ? ['Requires reliable internet connectivity'] : [],
          assumptions: ['Pricing and implementation scope remain subject to vendor confirmation.'],
          totalCostEstimateTZS: {
            softwareYear1: annualSoftwareCost,
            hardware: 0,
            setupAndMigration: plan?.setupFeeTZS || 0,
            training: 0,
            estimatedAnnualRecurring: annualSoftwareCost,
          },
          implementationNotes: `Estimated rollout: ${product.implementationEffortDays} days. ${product.supportSLA}`,
          dataExportConsiderations: `Supported exports: ${product.dataExportFormats.join(', ')}.`,
        };
      }),
    });

    setSelectedMerchantForRec(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Operations Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Operations, Advisory & Compliance Console
            </span>
            <Badge variant="primary" size="sm">
              Role: {currentUser.role.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0B2F66]">
            Karibu, {currentUser.name}
          </h1>
          <p className="text-xs text-slate-500">
            Kituo kikuu cha ushauri wa kitaalamu, uhakiki wa watoa huduma na usimamizi wa ubora wa mifumo ya wateja.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold text-slate-700">Wafanyabiashara: {merchants.length}</span>
          <span className="text-slate-400">|</span>
          <span className="font-semibold text-slate-700">Mifumo: {products.length}</span>
          <span className="text-slate-400">|</span>
          <span className="font-semibold text-slate-700">Watoa Huduma: {vendors.length}</span>
        </div>
      </div>

      {/* Operations Sub-Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 bg-white p-2 rounded-xl shadow-2xs overflow-x-auto text-xs">
        {[
          { id: 'analytics', label: 'Dashibodi Kuu (Marketplace Analytics)', icon: TrendingUp },
          { id: 'advisory', label: 'Ushauri wa Wateja (Advisory & Leads)', icon: Award, badge: merchants.filter((m) => m.stage === 'assessment_complete').length },
          { id: 'implementations', label: 'Utekelezaji & Mafunzo (Rollouts)', icon: CheckCircle2, badge: implementations.length },
          { id: 'compliance', label: 'Uhakiki & TRA (Compliance Roster)', icon: Scale },
          { id: 'finance', label: 'Upatanisho wa Kifedha (Brokerage Rec)', icon: DollarSign },
          { id: 'audit', label: 'Kumbukumbu za Mfumo (Audit Logs)', icon: ShieldAlert },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                isActive ? 'bg-[#0B2F66] text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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

      {/* Subtab 1: Executive / Analytics */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Jumla ya Wafanyabiashara</span>
              <div className="text-2xl font-black text-[#0B2F66]">{merchants.length}</div>
              <span className="text-[11px] text-emerald-700 font-semibold">100% In Active Broker Pipeline</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Tathmini Zilizokamilika</span>
              <div className="text-2xl font-black text-amber-700">{assessments.length}</div>
              <span className="text-[11px] text-slate-500">12-Section Diagnostics</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Dossier za Ushauri Zilizosainiwa</span>
              <div className="text-2xl font-black text-blue-700">{recommendations.length}</div>
              <span className="text-[11px] text-slate-500">Imesainiwa na Washauri Waliosajiliwa</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Miradi ya Go-Live Inayoendelea</span>
              <div className="text-2xl font-black text-purple-700">{implementations.length}</div>
              <span className="text-[11px] text-emerald-700 font-semibold">Wastani wa Siku 10 za Rollout</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Mfumo wa Uendeshaji & Sheria ya MVP</h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Kila ushauri lazima usainiwe na mshauri halisi wa kibinadamu (Human Adviser in the loop).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Malipo ya software yanashughulikiwa moja kwa moja kati ya mteja na mtoa huduma.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Data za mteja zinalindwa chini ya Sheria ya Ulinzi wa Taarifa Binafsi (PDPA 2022).</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Mzunguko wa Wafanyabiashara (Pipeline Breakdown)</h3>
              <div className="space-y-2 text-xs">
                {merchants.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                    <div>
                      <strong className="text-slate-800">{m.businessName}</strong>
                      <span className="text-[11px] text-slate-500 block">{m.sector} • {m.region}</span>
                    </div>
                    <Badge variant="primary" size="sm">{m.stage}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Field Advisory & Issue Recommendations */}
      {activeSubTab === 'advisory' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0B2F66]">
                Usimamizi wa Ushauri wa Wateja (Advisory Pipeline)
              </h2>
              <p className="text-xs text-slate-500">
                Pitia tathmini za wateja na utoe ripoti ya ushauri wa kitaalamu yenye mapendekezo ya mifumo 2-3 iliyothibitishwa.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {merchants.map((merchant) => {
              const assessment = assessments.find((a) => a.merchantId === merchant.id);
              const rec = recommendations.find((r) => r.merchantId === merchant.id);

              return (
                <div
                  key={merchant.id}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50/30 space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">{merchant.businessName}</h3>
                        <Badge variant="primary" size="sm">
                          {merchant.stage}
                        </Badge>
                      </div>
                      <span className="text-slate-500 text-[11px]">
                        Mwasiliani: {merchant.contacts[0]?.name} ({merchant.contacts[0]?.phone}) | Sekta: {merchant.sector} | Mkoa: {merchant.region}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {assessment ? (
                        <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                          ✓ Tathmini Imekamilika
                        </span>
                      ) : (
                        <span className="text-amber-700 font-semibold text-[11px] bg-amber-50 px-2 py-1 rounded border border-amber-200">
                          ! Inasubiri Tathmini
                        </span>
                      )}

                      {!rec ? (
                        <button
                          onClick={() => setSelectedMerchantForRec(merchant.id)}
                          className="px-3.5 py-1.5 bg-[#0B2F66] text-white font-bold rounded-md text-xs hover:bg-[#071f45]"
                        >
                          Toa Ushauri (Issue Dossier)
                        </button>
                      ) : (
                        <span className="text-blue-800 font-bold text-xs bg-blue-100 px-2.5 py-1 rounded">
                          Ushauri Umetolewa ({rec.id})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Recommendation Modal if open for this merchant */}
                  {selectedMerchantForRec === merchant.id && (
                    <div className="p-4 bg-white border-2 border-[#0B2F66] rounded-xl space-y-4 mt-3">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h4 className="font-bold text-slate-900 text-xs">
                          Kutoa Ripoti ya Ushauri Rasmi kwa ajili ya: {merchant.businessName}
                        </h4>
                        <button
                          onClick={() => setSelectedMerchantForRec(null)}
                          className="text-slate-400 hover:text-slate-800 text-xs"
                        >
                          ✕ Funga
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700">
                          Sababu na Uchambuzi wa Mshauri (Adviser Rationale) *
                        </label>
                        <textarea
                          rows={3}
                          value={recRationale}
                          onChange={(e) => setRecRationale(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none text-xs"
                        />
                      </div>

                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-950">
                        <strong>Uhakiki wa Mshauri:</strong> Unathibitisha kuwa umechambua uwezo wa offline, TRA VFD na bajeti ya mteja kulingana na vigezo vya BRD v1.0.
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedMerchantForRec(null)}
                          className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded text-xs"
                        >
                          Ghairi
                        </button>
                        <button
                          onClick={() => handleIssueRecommendationSubmit(merchant.id)}
                          className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded text-xs"
                        >
                          Saini & Tuma Ripoti ya Ushauri
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 3: Implementations Specialist Tracker */}
      {activeSubTab === 'implementations' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-[#0B2F66]">
              Usimamizi wa Utekelezaji & Mafunzo (Specialist Rollout Console)
            </h2>
            <p className="text-xs text-slate-500">
              Kufuatilia usanidi wa hardware, data migration, mafunzo ya makeshia na go-live acceptance.
            </p>
          </div>

          <div className="space-y-4">
            {implementations.map((imp) => (
              <div key={imp.id} className="p-5 rounded-xl border border-slate-200 bg-white space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">Mradi: {imp.id}</span>
                    <span className="text-slate-500 block text-[11px]">
                      Mfanyabiashara: {imp.merchantId} | Mtaalamu: {imp.specialistName}
                    </span>
                  </div>
                  <Badge variant="primary" size="sm">
                    {getImplementationStatus(imp)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {imp.tasks.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <strong className="text-slate-800 block text-[11px]">{m.title}</strong>
                        <span className="text-[10px] text-slate-500">Tarehe Lengo: {m.dueDate}</span>
                      </div>
                      <Badge
                        variant={m.status === 'completed' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {m.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 4: Compliance Roster & TRA */}
      {activeSubTab === 'compliance' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-[#0B2F66]">
              Idara ya Uhakiki, Leseni & TRA (Compliance & Due Diligence)
            </h2>
            <p className="text-slate-500">
              Kuhakiki uhalisi wa TIN, BRELA na majaribio ya mifumo kufanya kazi bila mtandao (Offline test protocols).
            </p>
          </div>

          <div className="space-y-3">
            {vendors.map((v) => (
              <div key={v.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="space-y-0.5">
                  <strong className="text-slate-900 text-sm">{v.brandName} ({v.legalName})</strong>
                  <div className="text-slate-500 text-[11px]">
                    BRELA: {v.registrationNumber} | TIN: {v.tinNumber} | Makao Makuu: {v.headquarters}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" size="sm">
                    Due Diligence Passed
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 5: Finance & Broker Commission Reconciliation */}
      {activeSubTab === 'finance' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-[#0B2F66]">
              Upatanisho wa Fedha za Udalali (Finance & Commission Analytics)
            </h2>
            <p className="text-slate-500">
              Uthibitisho wa ankara za B2B kwa watoa huduma bila kushikilia fedha za wateja.
            </p>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 space-y-1">
            <strong className="block font-bold">Sheria Kuu ya Kifedha ya MVP (BRD Kifungu cha 1 & 9):</strong>
            <p className="text-[11px] leading-relaxed text-slate-700">
              Biashara Salama haifungui wallet, akaunti ya amana (escrow), wala kukata ada ya leseni ya software kutoka kwa mfanyabiashara. Ankara za udalali zinatumwa kwa mtoa huduma baada ya uthibitisho wa mteja kuanza kutumia mfumo.
            </p>
          </div>
        </div>
      )}

      {/* Subtab 6: Immutable Audit Trail Log */}
      {activeSubTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0B2F66]">
                Kumbukumbu Zisizobadilika za Mfumo (Audit Trail & Activity Log)
              </h2>
              <p className="text-slate-500">
                Kila kitendo cha ushauri, mabadiliko ya hatua, au utoaji wa ripoti kinalindwa na kurekodiwa kisheria.
              </p>
            </div>
            <Badge variant="neutral" size="sm">
              {auditLogs.length} Records
            </Badge>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]"
              >
                <div>
                  <span className="font-bold text-[#0B2F66]">{log.action}</span>
                  <span className="text-slate-500 ml-2">
                    (Entity: {log.entityType} - {log.entityId})
                  </span>
                  <div className="text-slate-600 mt-0.5">
                    Mtumiaji: <strong className="text-slate-800">{log.actorName}</strong> ({log.actorRole})
                  </div>
                </div>
                <div className="text-slate-400 font-mono text-[10px] shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
