import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BusinessAssessment } from '../../types';
import {
  ClipboardList,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Save,
  Send,
  Zap,
  HardDrive,
  Scale,
  Wifi,
  Users,
  DollarSign,
  Calendar,
  ShieldAlert,
  FileSpreadsheet,
  Building2,
  Check,
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface AssessmentEngineProps {
  merchantId: string;
  onAssessmentCompleted: (assessmentId: string) => void;
}

export const AssessmentEngine: React.FC<AssessmentEngineProps> = ({
  merchantId,
  onAssessmentCompleted,
}) => {
  const { merchants, completeAssessment, t } = useApp();
  const merchant = merchants.find((m) => m.id === merchantId);

  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<Partial<BusinessAssessment>>({
    merchantId,
    branchCount: merchant?.branches.length || 1,
    staffCount: merchant?.branches.reduce((total, branch) => total + branch.staffCount, 0) || 3,
    powerReliability: 'intermittent_daily_cuts',
    powerBackupType: 'ups_generator',
    internetPrimary: 'mobile_4g_modem',
    internetBackup: 'phone_hotspot',
    hardwareInventory: ['android_tablet', 'usb_thermal_printer'],
    requiredModules: ['pos_cashier', 'inventory_stock', 'tra_vfd_receipting'],
    traVfdRequired: true,
    existingTaxMachineType: 'vfd_virtual',
    currentRecordMethod: 'notebook_and_excel',
    dataMigrationNeeded: true,
    staffTechLiteracy: 'basic_smartphone',
    languagePreference: 'swahili',
    deploymentPreference: 'hybrid_offline_sync',
    monthlyBudgetTZS: 100000,
    hardwareBudgetTZS: 800000,
    targetGoLiveDays: 14,
    hasInhouseIT: false,
    offlineToleranceHours: 24,
    notes: 'Kipaumbele chetu ni mfumo rahisi kufundishika kwa Kiswahili na unaotoa risiti za TRA hata umeme ukikatika.',
  });

  if (!merchant) return null;

  const sections = [
    { id: 1, title: '1. Wasifu wa Biashara (Profile)', icon: Building2 },
    { id: 2, title: '2. Mazingira ya Umeme & Mtandao', icon: Zap },
    { id: 3, title: '3. Vifaa Vilivyopo (Hardware)', icon: HardDrive },
    { id: 4, title: '4. Michakato ya Kazi (Modules)', icon: ClipboardList },
    { id: 5, title: '5. Kodi & TRA VFD', icon: Scale },
    { id: 6, title: '6. Uhifadhi wa Data & Uhamiaji', icon: FileSpreadsheet },
    { id: 7, title: '7. Uwezo wa Wafanyakazi & Lugha', icon: Users },
    { id: 8, title: '8. Mapendeleo ya Mfumo', icon: Wifi },
    { id: 9, title: '9. Bajeti & Uwezo wa Gharama', icon: DollarSign },
    { id: 10, title: '10. Ratiba ya Kuanza (Go-Live)', icon: Calendar },
    { id: 11, title: '11. Msaada wa IT & Usimamizi', icon: Users },
    { id: 12, title: '12. Ustahimilivu wa Hatari', icon: ShieldAlert },
  ];

  const handleCheckboxToggle = (field: 'hardwareInventory' | 'requiredModules', value: string) => {
    const current = (formData[field] as string[]) || [];
    if (current.includes(value)) {
      setFormData({ ...formData, [field]: current.filter((v) => v !== value) });
    } else {
      setFormData({ ...formData, [field]: [...current, value] });
    }
  };

  const handleFinish = () => {
    const fullAssessment: BusinessAssessment = {
      id: `ASM-${Date.now().toString().slice(-6)}`,
      merchantId,
      branchCount: formData.branchCount || 1,
      staffCount: formData.staffCount || 3,
      powerReliability: formData.powerReliability || 'intermittent_daily_cuts',
      powerBackupType: formData.powerBackupType || 'ups_generator',
      internetPrimary: formData.internetPrimary || 'mobile_4g_modem',
      internetBackup: formData.internetBackup || 'phone_hotspot',
      hardwareInventory: formData.hardwareInventory || ['android_tablet'],
      requiredModules: formData.requiredModules || ['pos_cashier', 'tra_vfd_receipting'],
      traVfdRequired: formData.traVfdRequired ?? true,
      existingTaxMachineType: formData.existingTaxMachineType || 'vfd_virtual',
      currentRecordMethod: formData.currentRecordMethod || 'notebook_and_excel',
      dataMigrationNeeded: formData.dataMigrationNeeded ?? true,
      staffTechLiteracy: formData.staffTechLiteracy || 'basic_smartphone',
      languagePreference: formData.languagePreference || 'swahili',
      deploymentPreference: formData.deploymentPreference || 'hybrid_offline_sync',
      monthlyBudgetTZS: formData.monthlyBudgetTZS || 100000,
      hardwareBudgetTZS: formData.hardwareBudgetTZS || 800000,
      targetGoLiveDays: formData.targetGoLiveDays || 14,
      hasInhouseIT: formData.hasInhouseIT ?? false,
      offlineToleranceHours: formData.offlineToleranceHours || 24,
      notes: formData.notes || '',
      createdAt: new Date().toISOString(),
      completenessScore: 100,
    };

    completeAssessment(fullAssessment);
    onAssessmentCompleted(fullAssessment.id);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden max-w-4xl mx-auto">
      {/* Wizard Header */}
      <div className="bg-[#0B2F66] text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase">
            <ClipboardList className="w-4 h-4" />
            <span>Tathmini Kamili ya Mahitaji ya Mfumo (12-Section Diagnostic)</span>
          </div>
          <h2 className="text-xl font-bold mt-0.5">{merchant.businessName}</h2>
          <p className="text-xs text-blue-200">
            Sekta: {merchant.sector} | Mkoa: {merchant.region} | Hatua: {activeStep} kati ya 12
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-950/80 px-3 py-1.5 rounded-lg border border-blue-800 text-xs">
          <span>Ukamilifu:</span>
          <span className="font-bold text-amber-400">{Math.round((activeStep / 12) * 100)}%</span>
        </div>
      </div>

      {/* Section Indicator Bar */}
      <div className="border-b border-slate-200 bg-slate-50 p-2 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(s.id)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                activeStep === s.id
                  ? 'bg-[#0B2F66] text-white font-bold'
                  : s.id < activeStep
                  ? 'text-emerald-800 bg-emerald-100 font-semibold'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.id}. {s.title.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6 space-y-6 text-xs text-slate-800 min-h-[340px]">
        {/* Section 1: Business Profile */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#0B2F66] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" />
              Sehemu ya 1: Wasifu wa Biashara na Idadi ya Matawi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Idadi ya Matawi (Branches)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.branchCount || 1}
                  onChange={(e) => setFormData({ ...formData, branchCount: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-[#0B2F66] outline-none text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Jumla ya Wafanyakazi Wanaotumia Mfumo</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={formData.staffCount || 3}
                  onChange={(e) => setFormData({ ...formData, staffCount: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-[#0B2F66] outline-none text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Power & Internet */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#0B2F66] flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" />
              Sehemu ya 2: Mazingira ya Umeme na Upatikanaji wa Mtandao
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Uthabiti wa Umeme (TANESCO)</label>
                <select
                  value={formData.powerReliability}
                  onChange={(e) => setFormData({ ...formData, powerReliability: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none bg-white text-xs"
                >
                  <option value="stable">Umeme Huwa Thabiti Mara Nyingi</option>
                  <option value="intermittent_daily_cuts">Kuna Katizo la Mara kwa Mara (Daily cuts)</option>
                  <option value="generator_solar_only">Inategemea Sola / Jenereta Pekee</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Aina ya Hifadhi ya Umeme (Backup Power)</label>
                <select
                  value={formData.powerBackupType}
                  onChange={(e) => setFormData({ ...formData, powerBackupType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none bg-white text-xs"
                >
                  <option value="ups_generator">UPS + Jenereta ya Akiba</option>
                  <option value="inverter_solar">Mfumo wa Betri (Inverter / Solar)</option>
                  <option value="none">Hakuna Akiba ya Umeme</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Chanzo Kikuu cha Mtandao (Primary Internet)</label>
                <select
                  value={formData.internetPrimary}
                  onChange={(e) => setFormData({ ...formData, internetPrimary: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none bg-white text-xs"
                >
                  <option value="mobile_4g_modem">Modem ya 4G / Wi-Fi Router (Vodacom, Tigo, Airtel)</option>
                  <option value="fiber_broadband">Fiber Optic (TTCL, Zuku, Liquid)</option>
                  <option value="phone_hotspot">Hotspot ya Simu ya Mkononi</option>
                  <option value="no_reliable_internet">Hakuna Mtandao wa Kudumu</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Hardware Inventory */}
        {activeStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#0B2F66] flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-amber-600" />
              Sehemu ya 3: Vifaa Vilivyopo Dukani (Hardware Inventory)
            </h3>
            <p className="text-slate-600">
              Chagua vifaa ambavyo tayari unavyo ili tusikuwekee gharama zisizo za lazima:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'desktop_computer', label: 'Kompyuta ya Mezani (Desktop PC)' },
                { id: 'laptop', label: 'Kompyuta Mpakato (Laptop)' },
                { id: 'android_tablet', label: 'Kishikwambi (Android Tablet / iPad)' },
                { id: 'usb_thermal_printer', label: 'Printa ya Risiti (80mm Thermal Printer)' },
                { id: 'barcode_scanner', label: 'Kifaa cha Kusoma Barcode (Barcode Scanner)' },
                { id: 'cash_drawer', label: 'Droo ya Pesa ya Chuma (Cash Drawer)' },
                { id: 'electronic_scale', label: 'Mzani wa Kielektroniki (Weighing Scale)' },
              ].map((hw) => {
                const checked = formData.hardwareInventory?.includes(hw.id);
                return (
                  <label
                    key={hw.id}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                      checked ? 'bg-blue-50/70 border-[#0B2F66] text-[#0B2F66] font-semibold' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCheckboxToggle('hardwareInventory', hw.id)}
                      className="rounded text-[#0B2F66]"
                    />
                    <span>{hw.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 4: Functional Modules */}
        {activeStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#0B2F66] flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-amber-600" />
              Sehemu ya 4: Huduma na Michakato Unayohitaji (Required Modules)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'pos_cashier', label: 'Mauzo ya Kaunta & Risiti za Haraka' },
                { id: 'inventory_stock', label: 'Usimamizi wa Stoo & Arifa za Bidhaa Zinazoisha' },
                { id: 'tra_vfd_receipting', label: 'Utoaji Risiti za TRA VFD Kielektroniki' },
                { id: 'debtors_credit', label: 'Ufuatiliaji wa Madeni ya Wateja & Mikopo' },
                { id: 'suppliers_purchases', label: 'Ununuzi & Malipo ya Wasambazaji' },
                { id: 'multi_branch_sync', label: 'Kuunganisha Matawi Mengi Kuona Stoo Kuu' },
                { id: 'batch_expiry', label: 'Kufuatilia Tarehe za Kuisha kwa Dawa/Vyakula' },
                { id: 'mobile_whatsapp_reports', label: 'Kupokea Ripoti za Mauzo Kwenye WhatsApp/Simu' },
              ].map((mod) => {
                const checked = formData.requiredModules?.includes(mod.id);
                return (
                  <label
                    key={mod.id}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                      checked ? 'bg-blue-50/70 border-[#0B2F66] text-[#0B2F66] font-semibold' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCheckboxToggle('requiredModules', mod.id)}
                      className="rounded text-[#0B2F66]"
                    />
                    <span>{mod.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 5: Tax & TRA */}
        {activeStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#0B2F66] flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-600" />
              Sehemu ya 5: Mahitaji ya Kodi na TRA VFD
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.traVfdRequired}
                  onChange={(e) => setFormData({ ...formData, traVfdRequired: e.target.checked })}
                  className="rounded text-[#0B2F66] w-4 h-4"
                />
                <span className="font-semibold text-slate-800">
                  Biashara inalazimika kutoa risiti halisi za TRA (VFD Web API / EFD)
                </span>
              </label>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Mashine au Mfumo Unaotumika Sasa kwa TRA</label>
                <select
                  value={formData.existingTaxMachineType}
                  onChange={(e) => setFormData({ ...formData, existingTaxMachineType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none bg-white text-xs"
                >
                  <option value="vfd_virtual">VFD ya Mtandaoni (Virtual Fiscal Device)</option>
                  <option value="physical_efd">Mashine ya EFD ya Mkono (Physical EFD)</option>
                  <option value="manual_receipts">Vitabu vya Risiti vya Mkono</option>
                  <option value="none">Bado Hatujaunganishwa na TRA</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Section 6: Data Migration */}
        {activeStep === 6 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#0B2F66] flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-amber-600" />
              Sehemu ya 6: Historia ya Data na Uhamiaji (Data Migration)
            </h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Unatunza Kumbukumbu Zako Vipi Sasa?</label>
                <select
                  value={formData.currentRecordMethod}
                  onChange={(e) => setFormData({ ...formData, currentRecordMethod: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none bg-white text-xs"
                >
                  <option value="notebook_and_excel">Daftari la Mkono + Excel</option>
                  <option value="legacy_desktop_pos">Mfumo wa Zamani wa Kompyuta usio na TRA</option>
                  <option value="pure_manual_paper">Vitabu vya Karatasi Pekee</option>
                </select>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.dataMigrationNeeded}
                  onChange={(e) => setFormData({ ...formData, dataMigrationNeeded: e.target.checked })}
                  className="rounded text-[#0B2F66] w-4 h-4"
                />
                <span className="font-semibold text-slate-800">
                  Tunahitaji usaidizi wa kitaalamu kuingiza majina ya bidhaa, bei na idadi ya stoo kwenye mfumo mpya
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Section 7: User Capacity & Language */}
        {activeStep === 7 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#0B2F66] flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              Sehemu ya 7: Uwezo wa Wafanyakazi na Lugha
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Uzoefu wa Wafanyakazi na Kompyuta/Simu</label>
                <select
                  value={formData.staffTechLiteracy}
                  onChange={(e) => setFormData({ ...formData, staffTechLiteracy: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none bg-white text-xs"
                >
                  <option value="basic_smartphone">Uzoefu wa Kawaida wa Simu za Smartphone (WhatsApp pekee)</option>
                  <option value="competent_pc">Wana uwezo mzuri wa kutumia Kompyuta & Excel</option>
                  <option value="low_literacy">Wanahitaji mafunzo ya kimsingi kuanzia mwanzo</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Lugha ya Msingi ya Mfumo</label>
                <select
                  value={formData.languagePreference}
                  onChange={(e) => setFormData({ ...formData, languagePreference: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none bg-white text-xs"
                >
                  <option value="swahili">Kiswahili Kwanza (Swahili-First)</option>
                  <option value="english">Kiingereza (English)</option>
                  <option value="bilingual">Lugha Zote Mbili (Bilingual)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Section 8: Deployment */}
        {activeStep === 8 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#0B2F66] flex items-center gap-2">
              <Wifi className="w-5 h-5 text-amber-600" />
              Sehemu ya 8: Mapendeleo ya Muundo wa Mfumo
            </h3>
            <div className="space-y-2">
              <label className="font-semibold text-slate-700 block">Aina ya Uendeshaji Unayopendelea</label>
              <div className="space-y-2">
                {[
                  {
                    id: 'hybrid_offline_sync',
                    title: 'Mfumo Mahiri wa Nje ya Mtandao (Hybrid Offline Sync)',
                    desc: 'Inafanya kazi bila intaneti na kusawazisha taarifa mtandao ukipatikana.',
                  },
                  {
                    id: 'cloud_pure',
                    title: 'Mfumo wa Mtandaoni Tu (Pure Cloud)',
                    desc: 'Unahitaji intaneti wakati wote; unaweza kuangalia duka lako ukiwa popote.',
                  },
                  {
                    id: 'on_premise_local',
                    title: 'Mfumo wa Ndani ya Duka Tu (Local Server)',
                    desc: 'Data zote zinabaki kwenye kompyuta ya duka pekee.',
                  },
                ].map((dep) => (
                  <label
                    key={dep.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${
                      formData.deploymentPreference === dep.id
                        ? 'bg-blue-50/70 border-[#0B2F66] text-[#0B2F66]'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deploymentPreference"
                      value={dep.id}
                      checked={formData.deploymentPreference === dep.id}
                      onChange={(e) => setFormData({ ...formData, deploymentPreference: e.target.value as any })}
                      className="mt-0.5 text-[#0B2F66]"
                    />
                    <div>
                      <strong className="block text-xs text-slate-900">{dep.title}</strong>
                      <span className="text-[11px] text-slate-500">{dep.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section 9: Budget */}
        {activeStep === 9 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#0B2F66] flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-600" />
              Sehemu ya 9: Makadirio ya Bajeti (TZS)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  Bajeti ya Leseni ya Programu kwa Mwezi (TZS)
                </label>
                <input
                  type="number"
                  step="10000"
                  value={formData.monthlyBudgetTZS || 100000}
                  onChange={(e) => setFormData({ ...formData, monthlyBudgetTZS: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none text-xs font-bold text-[#0B2F66]"
                />
                <span className="text-[11px] text-slate-500">mf. TZS 50,000 hadi 200,000 kwa mwezi</span>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  Bajeti ya Vifaa vya Duka (Hardware & Setup TZS)
                </label>
                <input
                  type="number"
                  step="50000"
                  value={formData.hardwareBudgetTZS || 800000}
                  onChange={(e) => setFormData({ ...formData, hardwareBudgetTZS: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none text-xs font-bold text-[#0B2F66]"
                />
                <span className="text-[11px] text-slate-500">mf. TZS 500,000 hadi 2,500,000</span>
              </div>
            </div>
          </div>
        )}

        {/* Section 10: Timeline */}
        {activeStep === 10 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#0B2F66] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              Sehemu ya 10: Ratiba ya Kuanza Kutumia Mfumo (Go-Live)
            </h3>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                Ungependa Mfumo uwe tayari kufanya kazi ndani ya siku ngapi?
              </label>
              <select
                value={formData.targetGoLiveDays}
                onChange={(e) => setFormData({ ...formData, targetGoLiveDays: parseInt(e.target.value) || 14 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none bg-white text-xs"
              >
                <option value="7">Haraka (Ndani ya Siku 7)</option>
                <option value="14">Kawaida (Ndani ya Siku 14)</option>
                <option value="30">Ndani ya Mwezi 1 (Siku 30)</option>
                <option value="60">Mipango ya Baadaye (Siku 60+)</option>
              </select>
            </div>
          </div>
        )}

        {/* Section 11: IT Governance */}
        {activeStep === 11 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#0B2F66] flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              Sehemu ya 11: Msaada wa IT na Usimamizi wa Ndani
            </h3>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasInhouseIT}
                onChange={(e) => setFormData({ ...formData, hasInhouseIT: e.target.checked })}
                className="rounded text-[#0B2F66] w-4 h-4"
              />
              <span className="font-semibold text-slate-800">
                Tuna fundi/mfanyakazi maalum wa IT ndani ya biashara yetu
              </span>
            </label>
            <p className="text-[11px] text-slate-500">
              Kama huna mtu wa IT, mshauri wa Biashara Salama atasimamia usanidi na mafunzo.
            </p>
          </div>
        )}

        {/* Section 12: Contingency & Notes */}
        {activeStep === 12 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#0B2F66] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              Sehemu ya 12: Ustahimilivu wa Hatari & Maelezo ya Ziada
            </h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  Uwezo wa Kuendelea Kuuza bila Intaneti (Masaa ya Ustahimilivu)
                </label>
                <select
                  value={formData.offlineToleranceHours}
                  onChange={(e) => setFormData({ ...formData, offlineToleranceHours: parseInt(e.target.value) || 24 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none bg-white text-xs"
                >
                  <option value="12">Masaa 12 (Nusu Siku)</option>
                  <option value="24">Masaa 24 (Siku 1 Kamili)</option>
                  <option value="72">Masaa 72 (Siku 3)</option>
                  <option value="336">Siku 14 (Ustahimilivu wa Juu)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Maelezo Yoyote ya Ziada kwa Mshauri Wako</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Eleza changamoto yoyote maalum au mfumo uliowahi kutumia..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none text-xs"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button
          type="button"
          disabled={activeStep === 1}
          onClick={() => setActiveStep(activeStep - 1)}
          className="px-3.5 py-2 border border-slate-300 rounded-md text-slate-700 font-semibold text-xs flex items-center gap-1 hover:bg-slate-100 disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Nyuma (Previous)</span>
        </button>

        {activeStep < 12 ? (
          <button
            type="button"
            onClick={() => setActiveStep(activeStep + 1)}
            className="px-4 py-2 bg-[#0B2F66] text-white rounded-md font-bold text-xs flex items-center gap-1.5 hover:bg-[#071f45]"
          >
            <span>Endelea Sehemu ya {activeStep + 1}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-extrabold text-xs flex items-center gap-2 shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>Kamilisha & Tuma kwa Mshauri wa Biashara Salama</span>
          </button>
        )}
      </div>
    </div>
  );
};
