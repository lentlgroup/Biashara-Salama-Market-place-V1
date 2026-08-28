import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowRightLeft,
  Trash2,
  Check,
  X as CloseIcon,
  ShieldCheck,
  WifiOff,
  AlertTriangle,
  Building,
  Info,
  Layers,
  Plus,
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface ProductComparisonProps {
  onOpenLeadModal: () => void;
  onOpenProductDetail: (id: string) => void;
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({
  onOpenLeadModal,
  onOpenProductDetail,
}) => {
  const { products, comparedProductIds, removeFromComparison, clearComparison, addToComparison, t } = useApp();

  const comparedProducts = products.filter((p) => comparedProductIds.includes(p.id));
  const availableToAdd = products.filter((p) => !comparedProductIds.includes(p.id));

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <ArrowRightLeft className="w-4 h-4 text-amber-600" />
            <span>Ulinganishi Huru na wa Uwazi (Transparent Product Comparison)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0B2F66] mt-1">
            Linganisha Mifumo ya Biashara
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Linganisha mifumo iliyothibitishwa kwa vigezo 15+ vya kiteknolojia, kisheria, TRA/VFD, gharama kamili na huduma kwa wateja nchini Tanzania.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {comparedProducts.length > 0 && (
            <button
              onClick={clearComparison}
              className="px-3 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md text-xs font-semibold flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Safisha Ulinganishi (Clear)</span>
            </button>
          )}
          <button
            onClick={onOpenLeadModal}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-bold shadow-xs transition-colors"
          >
            {t.ctaGetAssessment}
          </button>
        </div>
      </div>

      {comparedProducts.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-[#0B2F66] rounded-full flex items-center justify-center mx-auto">
            <ArrowRightLeft className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Hakuna mifumo iliyochaguliwa kulinganishwa kwa sasa
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Chagua mifumo kutoka katalogi yetu ili kuona tofauti za bei, uwezo wa offline, TRA VFD na huduma ya msaada.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {products.slice(0, 3).map((p) => (
              <button
                key={p.id}
                onClick={() => addToComparison(p.id)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-medium border border-slate-300 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ongeza {p.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Quick Add Selector if < 4 */}
          {comparedProducts.length < 4 && availableToAdd.length > 0 && (
            <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 flex items-center justify-between flex-wrap gap-2 text-xs text-blue-950">
              <span className="font-semibold">Unaweza kuongeza mfumo mwingine (Hadi mifumo 4):</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {availableToAdd.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => addToComparison(p.id)}
                    className="px-2.5 py-1 bg-white hover:bg-blue-100 text-[#0B2F66] rounded border border-blue-300 text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Comparison Matrix Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="p-4 w-1/4 font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Vigezo vya Tathmini (Dimension)
                  </th>
                  {comparedProducts.map((prod) => (
                    <th key={prod.id} className="p-4 w-1/4 align-top border-l border-slate-200 bg-white">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-[10px] uppercase font-bold text-slate-500">
                            {prod.vendorName}
                          </span>
                          <button
                            onClick={() => removeFromComparison(prod.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100"
                            title="Ondoa kwenye ulinganishi"
                          >
                            <CloseIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="font-bold text-[#0B2F66] text-sm leading-tight">
                          {prod.name}
                        </h4>
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          {prod.isSponsored ? (
                            <Badge variant="gold" size="sm">
                              Trial Partner
                            </Badge>
                          ) : (
                            <Badge variant="primary" size="sm">
                              Verified
                            </Badge>
                          )}
                          <Badge variant="neutral" size="sm">
                            {prod.category}
                          </Badge>
                        </div>
                        <div className="pt-2">
                          <button
                            onClick={() => onOpenProductDetail(prod.id)}
                            className="w-full py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-xs text-center border border-slate-300"
                          >
                            Tazama Kamili
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {/* 1. Sector Fit */}
                <tr className="hover:bg-slate-50/70">
                  <td className="p-3.5 font-semibold text-slate-800 bg-slate-50/50">
                    Sekta Zinazofaa (Sector Fit)
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3.5 border-l border-slate-200">
                      <div className="space-y-1">
                        {p.supportedSectors.map((s) => (
                          <div key={s} className="flex items-center gap-1 text-[11px] text-slate-700">
                            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{t[`sector_${s}` as keyof typeof t] || s}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 2. Monthly License Cost */}
                <tr className="hover:bg-slate-50/70">
                  <td className="p-3.5 font-semibold text-slate-800 bg-slate-50/50">
                    Ada ya Kila Mwezi (Monthly Plan)
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3.5 border-l border-slate-200">
                      <div className="text-sm font-extrabold text-[#0B2F66]">
                        TZS {p.plans[0]?.monthlyFeeTZS.toLocaleString()}
                        <span className="text-[11px] font-normal text-slate-500"> /mwezi</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Plan: {p.plans[0]?.planName} ({p.plans[0]?.includedUsers} watumiaji)
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 3. Setup & Onboarding Fee */}
                <tr className="hover:bg-slate-50/70">
                  <td className="p-3.5 font-semibold text-slate-800 bg-slate-50/50">
                    Gharama ya Usanidi (Setup Fee)
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3.5 border-l border-slate-200">
                      <span className="font-semibold text-slate-800">
                        TZS {p.plans[0]?.setupFeeTZS.toLocaleString()}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* 4. TRA / VFD Compliance */}
                <tr className="hover:bg-slate-50/70">
                  <td className="p-3.5 font-semibold text-slate-800 bg-slate-50/50">
                    Uthibitisho wa TRA / VFD
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3.5 border-l border-slate-200">
                      {p.traVfdStatus === 'certified_integrated' ? (
                        <div className="space-y-1">
                          <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3 h-3" />}>
                            TRA VFD Certified
                          </Badge>
                          <div className="text-[10px] text-slate-500">
                            Cert No: <code className="text-slate-800">{p.traCertificateNumber}</code>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <Badge variant="warning" size="sm" icon={<AlertTriangle className="w-3 h-3" />}>
                            Under Review / External
                          </Badge>
                          <div className="text-[10px] text-slate-500">Haina uthibitisho wa moja kwa moja</div>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 5. Offline Capabilities */}
                <tr className="hover:bg-slate-50/70">
                  <td className="p-3.5 font-semibold text-slate-800 bg-slate-50/50">
                    Kazi Nje ya Mtandao (Offline Resilience)
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3.5 border-l border-slate-200">
                      {p.offlineCapabilities === 'full_offline_sync' ? (
                        <div className="space-y-1 text-emerald-900 font-medium">
                          <div className="flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>100% Full Offline Sync</span>
                          </div>
                          <p className="text-[11px] text-slate-600 font-normal">
                            Inafanya kazi siku 14 bila intaneti na kusawazisha ikirudi.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1 text-amber-900 font-medium">
                          <div className="flex items-center gap-1">
                            <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                            <span>Hybrid Cache</span>
                          </div>
                          <p className="text-[11px] text-slate-600 font-normal">
                            Uhifadhi wa muda mfupi wa shughuli za karibuni.
                          </p>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 6. Hardware Requirements */}
                <tr className="hover:bg-slate-50/70">
                  <td className="p-3.5 font-semibold text-slate-800 bg-slate-50/50">
                    Vifaa Vinavyohitajika (Hardware)
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3.5 border-l border-slate-200 text-[11px] text-slate-600">
                      <ul className="space-y-1">
                        {p.hardwareRequirements.map((h, i) => (
                          <li key={i}>• {h}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* 7. Support SLA */}
                <tr className="hover:bg-slate-50/70">
                  <td className="p-3.5 font-semibold text-slate-800 bg-slate-50/50">
                    Huduma kwa Wateja (Support SLA)
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3.5 border-l border-slate-200 text-[11px] text-slate-700">
                      <div className="font-semibold text-slate-900">{p.supportSLA}</div>
                      <div className="text-[10px] text-emerald-700 mt-0.5">
                        {p.localSupportInTanzania ? '✓ Timu ya msaada ipo nchini Tanzania' : '✗ Msaada wa mtandaoni pekee'}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 8. Implementation & Training */}
                <tr className="hover:bg-slate-50/70">
                  <td className="p-3.5 font-semibold text-slate-800 bg-slate-50/50">
                    Muda wa Rollout & Mafunzo
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3.5 border-l border-slate-200 text-xs">
                      <div>
                        Siku za Utekelezaji: <strong>{p.implementationEffortDays} Siku</strong>
                      </div>
                      <div className="text-slate-600 text-[11px] mt-0.5">
                        Mafunzo ya Wafanyakazi: <strong>{p.trainingDaysIncluded} Siku</strong>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 9. Data Portability */}
                <tr className="hover:bg-slate-50/70">
                  <td className="p-3.5 font-semibold text-slate-800 bg-slate-50/50">
                    Uhifadhi & Utoaji Data (Export)
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3.5 border-l border-slate-200 text-xs text-slate-700">
                      <div className="font-medium">{p.dataExportFormats.join(', ')}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Hakuna ada ya kutoa nakala za data</div>
                    </td>
                  ))}
                </tr>

                {/* 10. Commercial Disclosure */}
                <tr className="hover:bg-slate-50/70">
                  <td className="p-3.5 font-semibold text-slate-800 bg-slate-50/50">
                    Ufichuzi wa Mahusiano (Disclosure)
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3.5 border-l border-slate-200 text-[10px] text-slate-500">
                      {p.isSponsored ? (
                        <span className="text-amber-800 font-medium">
                          {p.sponsorshipLabel || 'Commercial relationship disclosed.'}
                        </span>
                      ) : (
                        <span>Mshirika wa viwango vya kawaida; ada haidhibiti nafasi ya mfumo.</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
