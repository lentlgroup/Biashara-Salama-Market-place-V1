import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SectorType } from '../../types';
import {
  Layers,
  ShoppingBag,
  Truck,
  Stethoscope,
  Hammer,
  UtensilsCrossed,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface SectorGuideProps {
  onOpenLeadModal: () => void;
  onOpenProductDetail: (id: string) => void;
}

export const SectorGuide: React.FC<SectorGuideProps> = ({
  onOpenLeadModal,
  onOpenProductDetail,
}) => {
  const { t, products } = useApp();
  const [selectedSector, setSelectedSector] = useState<SectorType>('retail_supermarket');

  const sectorData: Record<
    SectorType,
    {
      title: string;
      icon: any;
      painPoints: string[];
      essentialFeatures: string[];
      tanzanianContext: string;
    }
  > = {
    retail_supermarket: {
      title: t.sector_retail_supermarket,
      icon: ShoppingBag,
      painPoints: [
        'Foleni ndefu wakati wa kutoa risiti mtandao wa intaneti unapokatika',
        'Wizi na hitilafu za stoo wakati wa mabadiliko ya shift za makeshia',
        'Kuchelewa kutoa risiti za TRA VFD kwa kila muamala wa kaunta',
      ],
      essentialFeatures: [
        'Kasi ya skani barcode chini ya sekunde 0.5',
        'Utoaji risiti za TRA VFD kielektroniki hata mtandao ukiwa umekatika (Full Offline)',
        'Udhibiti wa droo ya pesa (Cash Drawer reconciliation) mwisho wa kila shift',
      ],
      tanzanianContext: 'Maduka ya Kariakoo, Mlimani City na stendi kuu za mikoa.',
    },
    wholesale_distribution: {
      title: t.sector_wholesale_distribution,
      icon: Truck,
      painPoints: [
        'Ugumu wa kufuatilia madeni ya wateja (Credit limits) na mikopo ya mizigo',
        'Kupotea kwa bidhaa kati ya stoo kuu na gari la usambazaji (Van sales)',
        'Kushindwa kutoa ankara (Invoices) za TRA kwa makampuni makubwa',
      ],
      essentialFeatures: [
        'Ufuatiliaji wa bei za jumla kwa ngazi (Tiered wholesale pricing)',
        'Usimamizi wa mauzo ya barabarani (Mobile van distribution & stock dispatch)',
        'Ripoti za wateja wanaodaiwa zenye vikumbusho vya SMS',
      ],
      tanzanianContext: 'Wasambazaji wa bidhaa za vyakula, vinywaji na vifaa vya viwandani.',
    },
    pharmacy_health: {
      title: t.sector_pharmacy_health,
      icon: Stethoscope,
      painPoints: [
        'Dawa kumalizika muda wake (Expired batches) bila taarifa ya mapema na kupata hasara',
        'Kukaguliwa na TMDA na kushindwa kutoa namba ya kundi (Batch number)',
        'Ugumu wa kudhibiti dawa za cheti cha daktari (Prescriptions)',
      ],
      essentialFeatures: [
        'Usimamizi wa Batch & Expiry Date wenye arifa za miezi 3 na 6 kabla',
        'Utafutaji wa dawa kwa jina la asili (Generic name / Active ingredient)',
        'Uzingatiaji wa miongozo ya TMDA na TRA VFD',
      ],
      tanzanianContext: 'Maduka ya dawa ya binadamu (Part 1 & Part 2) na maabara za mitaani.',
    },
    hardware_construction: {
      title: t.sector_hardware_construction,
      icon: Hammer,
      painPoints: [
        'Uuzaji wa vipimo tofauti (Mifuko ya saruji, nondo kwa tani, mabati kwa futi)',
        'Mizigo inayouzwa kwa oda na kutolewa stoo baadaye (Delivery notes & gate passes)',
        'Kushuka kwa thamani ya bei ya bidhaa za chuma na mbao',
      ],
      essentialFeatures: [
        'Uwezo wa kuuza kwa vipande, uzito (Kg), mita au tani kwenye bili moja',
        'Kutoa hati ya kutolea mzigo stoo (Delivery Note) na stakabadhi ya mlinzi (Gate Pass)',
        'Kufuatilia stoo zilizopo maeneo tofauti (Multi-warehouse management)',
      ],
      tanzanianContext: 'Maduka ya vifaa vya ujenzi Kariakoo, Buguruni, Mwanza na Arusha.',
    },
    hospitality_restaurant: {
      title: t.sector_hospitality_restaurant,
      icon: UtensilsCrossed,
      painPoints: [
        'Mawasiliano mabaya kati ya watoa huduma (Waiters) na jikoni (KOT)',
        'Kupotea kwa viungo vya vyakula na vinywaji bila kulinganishwa na mapato',
        'Mgawanyo wa bili (Split bills) na malipo ya vikundi',
      ],
      essentialFeatures: [
        'Oda za moja kwa moja jikoni (Kitchen Display / KOT printers)',
        'Usimamizi wa mapishi na kupungua kwa viungo (Recipe costing & raw inventory deduction)',
        'Mgawanyo rahisi wa bili na malipo ya simu (Lipa Namba)',
      ],
      tanzanianContext: 'Migahawa, hoteli za mikoa na kumbi za hafla.',
    },
    services_spares: {
      title: t.sector_services_spares,
      icon: Wrench,
      painPoints: [
        'Kutafuta vipuri miongoni mwa maelfu ya namba za kielelezo (Part numbers & OEM codes)',
        'Kutenganisha gharama za vipuri na ujira wa fundi (Labor charges)',
        'Ufuatiliaji wa historia ya gari au mashine iliyotengenezwa',
      ],
      essentialFeatures: [
        'Katalogi ya utafutaji wa haraka kwa OEM Code na mfano wa gari',
        'Kadi ya kazi ya gereji (Job Card) yenye kuhesabu ujira na vipuri vilivyotumika',
        'Historia kamili ya matengenezo kwa namba ya usajili ya gari',
      ],
      tanzanianContext: 'Maduka ya vipuri vya magari, gereji na vituo vya huduma.',
    },
    general_trade: {
      title: t.sector_general_trade,
      icon: Layers,
      painPoints: [
        'Kukosa ripoti sahihi ya faida halisi baada ya kutoa gharama za uendeshaji',
        'Kutegemea daftari la mikono linaloweza kupotea au kuchanika',
      ],
      essentialFeatures: [
        'Mfumo rahisi wa simu au tablet unaofundishika kwa dakika 30',
        'Ripoti ya faida na hasara ya kila siku kwenye WhatsApp',
      ],
      tanzanianContext: 'Biashara mbalimbali za jumla na rejareja nchini kote.',
    },
  };

  const currentSectorInfo = sectorData[selectedSector] || sectorData.retail_supermarket;
  const SectorIcon = currentSectorInfo.icon;
  const sectorProducts = products.filter((p) => p.supportedSectors.includes(selectedSector));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Sector Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
          <Layers className="w-4 h-4 text-amber-600" />
          <span>Mwongozo Maalum wa Mifumo kwa Sekta (Sector Workflows)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2F66]">
          Suluhisho Sahihi Kulingana na Aina ya Biashara Yako
        </h1>
        <p className="text-xs text-slate-600 max-w-3xl">
          Kila sekta ina mahitaji ya kipekee ya kodi ya TRA, usimamizi wa stoo na changamoto za wafanyakazi. Angalia mwongozo uliothibitishwa kwa sekta yako:
        </p>
      </div>

      {/* Sector Selection Grid Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {(Object.keys(sectorData) as SectorType[])
          .filter((k) => k !== 'general_trade')
          .map((sKey) => {
            const item = sectorData[sKey];
            const Icon = item.icon;
            const isSelected = selectedSector === sKey;

            return (
              <button
                key={sKey}
                onClick={() => setSelectedSector(sKey)}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B2F66] text-white border-[#0B2F66] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-white/20 text-amber-400' : 'bg-blue-50 text-[#0B2F66]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold leading-tight">{item.title}</div>
              </button>
            );
          })}
      </div>

      {/* Sector Deep Breakdown Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0B2F66] flex items-center justify-center">
            <SectorIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase">
              Uchambuzi wa Sekta
            </span>
            <h2 className="text-xl font-bold text-[#0B2F66]">{currentSectorInfo.title}</h2>
            <p className="text-xs text-slate-500">{currentSectorInfo.tanzanianContext}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pain Points */}
          <div className="bg-rose-50/50 p-5 rounded-xl border border-rose-200/80 space-y-3">
            <div className="flex items-center gap-2 font-bold text-rose-900 text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Changamoto Kuu za Sekta Hii Nchini Tanzania</span>
            </div>
            <ul className="space-y-2 text-xs text-rose-950">
              {currentSectorInfo.painPoints.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Essential Features */}
          <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-200/80 space-y-3">
            <div className="flex items-center gap-2 font-bold text-emerald-900 text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Vigezo vya Lazima (Must-Have System Requirements)</span>
            </div>
            <ul className="space-y-2 text-xs text-emerald-950">
              {currentSectorInfo.essentialFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sector Recommended Systems */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              Mifumo Iliyothibitishwa kwa {currentSectorInfo.title}
            </h3>
            <button
              onClick={onOpenLeadModal}
              className="text-xs font-bold text-[#0B2F66] hover:underline flex items-center gap-1"
            >
              <span>Omba Ushauri wa Mfumo Huu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectorProducts.map((prod) => (
              <div
                key={prod.id}
                className="border border-slate-200 rounded-xl p-4 bg-slate-50/40 hover:bg-slate-50 transition-colors space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      {prod.vendorName}
                    </span>
                    <Badge variant={prod.traVfdStatus === 'certified_integrated' ? 'success' : 'neutral'} size="sm">
                      {prod.traVfdStatus === 'certified_integrated' ? 'TRA VFD' : 'Standard'}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-[#0B2F66] text-sm">{prod.name}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{prod.tagline}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div className="text-xs font-extrabold text-slate-900">
                    TZS {prod.plans[0]?.monthlyFeeTZS.toLocaleString()}{' '}
                    <span className="text-[10px] text-slate-500 font-normal">/mwezi</span>
                  </div>
                  <button
                    onClick={() => onOpenProductDetail(prod.id)}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-[#0B2F66] font-bold rounded text-xs border border-slate-300"
                  >
                    Tazama
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
