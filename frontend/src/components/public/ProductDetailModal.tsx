import React from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  WifiOff,
  ShieldCheck,
  Building,
  Layers,
  ArrowRightLeft,
  Calendar,
  FileSpreadsheet,
  Headphones,
  Check,
  Info,
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface ProductDetailModalProps {
  productId: string | null;
  onClose: () => void;
  onOpenLeadModal: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  productId,
  onClose,
  onOpenLeadModal,
}) => {
  const { products, comparedProductIds, addToComparison, removeFromComparison, t } = useApp();

  if (!productId) return null;
  const product = products.find((p) => p.id === productId);
  if (!product) return null;

  const isCompared = comparedProductIds.includes(product.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#0B2F66] text-white p-6 flex items-start justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                {product.category}
              </span>
              <span className="text-xs text-blue-200">
                Vendor: <strong className="text-white">{product.vendorName}</strong>
              </span>
              {product.traVfdStatus === 'certified_integrated' && (
                <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3 h-3" />}>
                  TRA / VFD Certified
                </Badge>
              )}
            </div>
            <h2 className="text-xl font-bold text-white mt-1">{product.name}</h2>
            <p className="text-xs text-slate-300 max-w-xl">{product.tagline}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-md hover:bg-blue-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Sponsorship / Commercial Relationship Disclosure Notice */}
          {product.isSponsored ? (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-2 text-amber-950">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <span className="font-bold">Ufichuzi wa Kibiashara (Commercial Disclosure):</span>
                <p className="text-[11px] leading-relaxed text-amber-900">
                  {product.sponsorshipLabel ||
                    'Mtoa huduma huyu ni mshirika wa kibiashara. Ufadhili haubadilishi vigezo vya tathmini au nafasi ya mfumo katika ushauri wa kitaalamu.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg flex items-center justify-between text-blue-950 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0B2F66]" />
                <span>Mtoa huduma aliyeidhinishwa kisheria (Verified Partner Roster).</span>
              </div>
              <span className="text-[10px] text-slate-500">Mwisho wa Uhakiki: {product.approvalExpiryDate.split('T')[0]}</span>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">Maelezo ya Mfumo (Overview)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Pricing Tiers Grid */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-2.5">
              Viwango vya Bei na Gharama (Pricing Plans - Direct to Vendor)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.plans.map((plan) => (
                <div
                  key={plan.id}
                  className="border border-slate-200 rounded-lg p-4 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{plan.planName}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {plan.billingCycle}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-extrabold text-[#0B2F66]">
                      TZS {plan.monthlyFeeTZS.toLocaleString()}
                    </span>
                    <span className="text-slate-500 text-xs">/mwezi</span>
                  </div>
                  <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-200">
                    <div className="flex justify-between">
                      <span>Watumiaji waliojumuishwa:</span>
                      <strong>{plan.includedUsers} Users</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Matawi:</span>
                      <strong>{plan.includedBranches} Branch</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Gharama ya Usanidi (Setup):</span>
                      <strong>TZS {plan.setupFeeTZS.toLocaleString()}</strong>
                    </div>
                  </div>
                  <ul className="space-y-1 pt-1 text-[11px] text-slate-600">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Time-Sensitive Verified Claims */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-2">
              Madai Yaliyohakikiwa na Ushahidi (Verified Claims & Compliance)
            </h4>
            <div className="space-y-2">
              {product.claims.map((claim) => (
                <div
                  key={claim.id}
                  className="border border-slate-200 rounded-lg p-3 bg-white space-y-1.5"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      {claim.verificationStatus === 'verified' ? (
                        <Badge variant="success" size="sm">
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="warning" size="sm">
                          Pending Audit
                        </Badge>
                      )}
                      <span className="font-semibold text-slate-900 text-xs">{claim.statement}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 grid grid-cols-1 sm:grid-cols-3 gap-1 pt-1 border-t border-slate-100">
                    <div>
                      Chanzo: <span className="text-slate-700 font-medium">{claim.source}</span>
                    </div>
                    <div>
                      Tarehe: <span className="text-slate-700">{claim.effectiveDate}</span>
                    </div>
                    <div>
                      Mhakiki: <span className="text-slate-700">{claim.verifiedBy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
            <div className="space-y-1.5">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <WifiOff className="w-4 h-4 text-amber-600" /> Uwezo Nje ya Mtandao (Offline)
              </span>
              <p className="text-xs text-slate-600">
                {product.offlineCapabilities === 'full_offline_sync'
                  ? 'Mfumo unakamilisha mauzo yote na kutoa risiti bila mtandao kwa siku 14 na kusawazisha (sync) mtandao ukirejea.'
                  : product.offlineCapabilities === 'hybrid'
                  ? 'Uwezo wa msingi wa offline wenye uhifadhi wa muda mfupi wa shughuli za mauzo.'
                  : 'Inahitaji muunganisho wa mara kwa mara wa intaneti.'}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Utoaji wa Data (Data Portability)
              </span>
              <p className="text-xs text-slate-600">
                Inakubali kutoa taarifa zote katika muundo wa {product.dataExportFormats.join(', ')} bila ada ya ziada.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <Headphones className="w-4 h-4 text-blue-600" /> Huduma kwa Wateja (Support SLA)
              </span>
              <p className="text-xs text-slate-600">{product.supportSLA}</p>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <Building className="w-4 h-4 text-purple-600" /> Mahitaji ya Vifaa (Hardware)
              </span>
              <ul className="text-xs text-slate-600 list-disc list-inside">
                {product.hardwareRequirements.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isCompared) {
                  removeFromComparison(product.id);
                } else {
                  addToComparison(product.id);
                }
              }}
              className={`px-3 py-2 rounded-md font-semibold text-xs flex items-center gap-1.5 border transition-colors ${
                isCompared
                  ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>{isCompared ? 'Ondoa kwenye Kulinganisha' : 'Weka kwenye Kulinganisha'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100"
            >
              Funga
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenLeadModal();
              }}
              className="px-5 py-2 rounded-md bg-[#0B2F66] text-white font-bold text-xs hover:bg-[#071f45] shadow-xs"
            >
              Pata Tathmini & Ushauri wa Mfumo Huu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
