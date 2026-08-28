import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SectorType } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  Layers,
  ArrowRight,
  ClipboardList,
  Store,
  WifiOff,
  Building2,
  Headphones,
  Users,
  Search,
  Sparkles,
  HelpCircle,
  ChevronRight,
  ArrowRightLeft,
  Calendar,
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface PublicMarketplaceProps {
  onOpenLeadModal: () => void;
  onOpenVendorApplyModal: () => void;
  onOpenProductDetail: (id: string) => void;
}

export const PublicMarketplace: React.FC<PublicMarketplaceProps> = ({
  onOpenLeadModal,
  onOpenVendorApplyModal,
  onOpenProductDetail,
}) => {
  const { t, products, vendors, comparedProductIds, addToComparison, removeFromComparison, setActiveTab } = useApp();
  const [selectedSector, setSelectedSector] = useState<SectorType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [offlineOnlyFilter, setOfflineOnlyFilter] = useState(false);
  const [traOnlyFilter, setTraOnlyFilter] = useState(false);

  const sectors: { id: SectorType | 'all'; label: string }[] = [
    { id: 'all', label: 'Sekta Zote (All Sectors)' },
    { id: 'retail_supermarket', label: t.sector_retail_supermarket },
    { id: 'wholesale_distribution', label: t.sector_wholesale_distribution },
    { id: 'pharmacy_health', label: t.sector_pharmacy_health },
    { id: 'hardware_construction', label: t.sector_hardware_construction },
    { id: 'hospitality_restaurant', label: t.sector_hospitality_restaurant },
    { id: 'services_spares', label: t.sector_services_spares },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSector = selectedSector === 'all' || p.supportedSectors.includes(selectedSector);
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOffline = !offlineOnlyFilter || p.offlineCapabilities === 'full_offline_sync';
    const matchesTra = !traOnlyFilter || p.traVfdStatus === 'certified_integrated';
    return matchesSector && matchesSearch && matchesOffline && matchesTra;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Section */}
      <section className="bg-gradient-to-b from-[#0B2F66] to-[#08224a] text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide">
              <span>{t.brandConfidenceLine}</span>
              <span className="text-white/60">•</span>
              <span className="text-white/90">Udalali na Ushauri wa Teknolojia ya Biashara</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Chagua Mfumo Salama wa Mauzo, Stoo na TRA kwa Biashara Yako.
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
              Biashara Salama inakusaidia kutathmini mahitaji yako, kulinganisha mifumo iliyohakikiwa ya POS na Uhasibu nchini Tanzania, kupata ushauri wa kitaalamu na usaidizi kamili wa kuanza kutumia mfumo hadi mafanikio.
            </p>
          </div>

          {/* Primary Action Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenLeadModal}
              className="px-6 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm flex items-center gap-2.5 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <ClipboardList className="w-5 h-5 text-slate-950" />
              <span>{t.ctaGetAssessment}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className="px-6 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/25 flex items-center gap-2 backdrop-blur-xs transition-colors"
            >
              <ArrowRightLeft className="w-4 h-4 text-amber-400" />
              <span>{t.ctaCompareSystems}</span>
              {comparedProductIds.length > 0 && (
                <span className="bg-amber-400 text-slate-950 text-xs px-2 py-0.5 rounded-full font-bold">
                  {comparedProductIds.length}
                </span>
              )}
            </button>
          </div>

          {/* Key Assurance Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-blue-900/60 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">Ushauri Huru (Neutral Broker)</strong>
                Hatupokei malipo ya leseni za mifumo; wewe unalipa mtoa huduma moja kwa moja.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <WifiOff className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">Uhakiki wa Offline & TRA VFD</strong>
                Kila mfumo unakaguliwa kufanya kazi mtandao ukikatika na kutoa risiti halisi za kodi.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Users className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">Akaunti Yako Inabaki Moja</strong>
                Ukibadilisha programu baadaye, historia na uhusiano wako unalindwa nasi daima.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Pillars of Biashara Salama */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <h2 className="text-2xl font-extrabold text-[#0B2F66]">
            Kwa Nini Wafanyabiashara Wanachagua Biashara Salama?
          </h2>
          <p className="text-xs text-slate-600">
            Tofauti na wauzaji wa kawaida wa programu wanaokulazimisha kununua chapa yao, sisi ni mshauri wako huru.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2.5 hover:border-blue-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0B2F66] flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{t.pillar1Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.pillar1Desc}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2.5 hover:border-blue-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0B2F66] flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{t.pillar2Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.pillar2Desc}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2.5 hover:border-blue-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0B2F66] flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{t.pillar3Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.pillar3Desc}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2.5 hover:border-blue-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0B2F66] flex items-center justify-center font-bold">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{t.pillar4Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.pillar4Desc}</p>
          </div>
        </div>
      </section>

      {/* 3. Verified Product Catalogue & Sector Discovery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Katalogi Iliyohakikiwa (Verified Product Catalogue)</span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#0B2F66]">
              Gundua Mifumo kwa Sekta Yako
            </h2>
            <p className="text-xs text-slate-600">
              Mifumo yote iliyoorodheshwa hapa imethibitishwa na inakidhi viwango vya TRA, uwezo wa offline na usalama wa data.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenVendorApplyModal}
              className="px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md text-xs font-semibold"
            >
              {t.ctaVendorApply}
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          {/* Sector Pill Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {sectors.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSector(s.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedSector === s.id
                    ? 'bg-[#0B2F66] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Search and Checkbox Toggles */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tafuta kwa jina la mfumo au mtoa huduma..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-[#0B2F66] outline-none text-xs"
              />
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={offlineOnlyFilter}
                  onChange={(e) => setOfflineOnlyFilter(e.target.checked)}
                  className="rounded text-[#0B2F66] border-slate-300"
                />
                <span className="text-slate-700 font-medium">Inafanya kazi bila Mtandao (Offline)</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={traOnlyFilter}
                  onChange={(e) => setTraOnlyFilter(e.target.checked)}
                  className="rounded text-[#0B2F66] border-slate-300"
                />
                <span className="text-slate-700 font-medium">TRA / VFD Certified Pekee</span>
              </label>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const isCompared = comparedProductIds.includes(product.id);
            const lowestPlan = product.plans[0];

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5 space-y-3.5">
                  {/* Top tags */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {product.vendorName}
                    </span>
                    <div className="flex items-center gap-1">
                      {product.traVfdStatus === 'certified_integrated' && (
                        <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3 h-3" />}>
                          TRA VFD
                        </Badge>
                      )}
                      {product.isSponsored ? (
                        <Badge variant="gold" size="sm">
                          Trial Partner
                        </Badge>
                      ) : (
                        <Badge variant="primary" size="sm">
                          Approved
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#0B2F66] text-base leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {product.tagline}
                    </p>
                  </div>

                  {/* Pricing Box */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Kuanzia (Starting at):</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-extrabold text-[#0B2F66]">
                          TZS {lowestPlan?.monthlyFeeTZS.toLocaleString() || '75,000'}
                        </span>
                        <span className="text-[10px] text-slate-500">/mwezi</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Watumiaji:</span>
                      <span className="text-xs font-semibold text-slate-800">
                        {lowestPlan?.includedUsers || 3} Users
                      </span>
                    </div>
                  </div>

                  {/* Core Features bullets */}
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {product.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Offline Capability highlight */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                    <WifiOff className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>
                      {product.offlineCapabilities === 'full_offline_sync'
                        ? 'Kazi kamili bila intaneti (Full Offline Sync)'
                        : 'Uhifadhi wa muda mfupi wa mauzo (Hybrid)'}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      if (isCompared) {
                        removeFromComparison(product.id);
                      } else {
                        addToComparison(product.id);
                      }
                    }}
                    className={`px-2.5 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1 border transition-colors ${
                      isCompared
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <ArrowRightLeft className="w-3 h-3" />
                    <span>{isCompared ? 'Ipo Kwenye Ulinganisho' : 'Linganisha'}</span>
                  </button>

                  <button
                    onClick={() => onOpenProductDetail(product.id)}
                    className="px-3 py-1.5 rounded-md bg-[#0B2F66] text-white font-bold text-xs hover:bg-[#071f45] shadow-xs flex items-center gap-1"
                  >
                    <span>Tazama Kamili</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Verified Vendor Directory Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#0B2F66]">
                Watoa Huduma Walioidhinishwa (Verified Vendors Roster)
              </h2>
              <p className="text-xs text-slate-600">
                Watoa programu wanaopimwa kwa uhakika wa leseni ya BRELA, TIN, SLA ya majibu na ubora wa huduma baada ya ununuzi.
              </p>
            </div>
            <button
              onClick={onOpenVendorApplyModal}
              className="px-4 py-2 bg-white text-[#0B2F66] border border-blue-300 rounded-md font-bold text-xs hover:bg-blue-50 transition-colors"
            >
              {t.ctaVendorApply}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Badge
                    variant={vendor.status === 'approved' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {vendor.status === 'approved' ? 'Due Diligence Passed' : 'Under Review'}
                  </Badge>
                  <span className="text-[10px] text-slate-500 font-mono">
                    TIN: {vendor.tinNumber}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{vendor.brandName}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{vendor.legalName}</p>
                </div>

                <div className="text-[11px] text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>Muda wa Majibu (SLA):</span>
                    <strong>{vendor.scorecard.leadResponseHours} hrs</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Ufanisi wa Go-Live:</span>
                    <strong className="text-emerald-700">{vendor.scorecard.activationRatePercent}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Kuridhika kwa Wateja:</span>
                    <strong className="text-amber-700">★ {vendor.scorecard.merchantSatisfaction} / 5.0</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Educational FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-[#0B2F66]">
            Maswali ya Mara kwa Mara (FAQ)
          </h2>
          <p className="text-xs text-slate-600">
            Majibu ya wazi kuhusu mfumo wa udalali na uendeshaji wa Biashara Salama.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#0B2F66]" />
              Je, Biashara Salama inapokea malipo ya software yangu?
            </h4>
            <p className="text-slate-600 leading-relaxed pl-6">
              Hapana. Chini ya mwongozo wa MVP (BRD v1.0), Biashara Salama haipokei wala kukata fedha za programu. Wafanyabiashara wanalipa watoa huduma moja kwa moja kwenye akaunti zao za benki au namba za kampuni. Biashara Salama inakutoza ada ya utekelezaji au mafunzo pekee endapo uliidhinisha huduma hiyo.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#0B2F66]" />
              Nini kitatokea nikitaka kubadilisha mtoa programu baadaye?
            </h4>
            <p className="text-slate-600 leading-relaxed pl-6">
              Akaunti yako na uhusiano wako na Biashara Salama unabaki palepale. Tutakusaidia kutoa data zako (backup), kuchagua mfumo mwingine unaofaa, na kufanya uhamiaji salama bila kupoteza historia ya biashara yako.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#0B2F66]" />
              Je, ninapataje ushauri wa kitaalamu?
            </h4>
            <p className="text-slate-600 leading-relaxed pl-6">
              Bofya kitufe cha <strong>"Pata tathmini ya biashara yako"</strong>. Mshauri wetu aliyeidhinishwa atafanya uchambuzi wa kina wa matawi yako, mtandao, bajeti na mahitaji ya TRA na kukupa ripoti ya ushauri iliyosainiwa kisheria.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Bottom Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B2F66] rounded-2xl p-8 text-white text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-black">
            Uko Tayari Kuboresha Mfumo wa Biashara Yako?
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto">
            Anza tathmini sasa au zungumza na mshauri wa Biashara Salama bila malipo yoyote ya awali.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenLeadModal}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm rounded-lg shadow-md transition-colors"
            >
              {t.ctaGetAssessment}
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-lg border border-white/30 transition-colors"
            >
              {t.ctaCompareSystems}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
