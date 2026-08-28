import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SectorType } from '../../types';
import { X, CheckCircle2, AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react';

interface LeadIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (merchantId: string) => void;
}

export const LeadIntakeModal: React.FC<LeadIntakeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t, createLead, recordConsent, merchants } = useApp();

  const [businessName, setBusinessName] = useState('');
  const [sector, setSector] = useState<SectorType>('retail_supermarket');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('+255 ');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('Dar es Salaam');
  const [city, setCity] = useState('Kariakoo, Ilala');
  const [channel, setChannel] = useState<'web' | 'whatsapp' | 'phone' | 'field' | 'referral'>('web');
  const [referrerName, setReferrerName] = useState('');
  const [consentGranted, setConsentGranted] = useState(true);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  if (!isOpen) return null;

  // Real-time duplicate check
  const handlePhoneChange = (val: string) => {
    setPhone(val);
    const cleaned = val.replace(/\s+/g, '');
    const found = merchants.find(
      (m) =>
        m.contacts.some((c) => c.phone.replace(/\s+/g, '') === cleaned && cleaned.length > 8) ||
        m.businessName.toLowerCase() === businessName.trim().toLowerCase()
    );
    if (found) {
      setDuplicateWarning(
        `Tahadhari: Biashara yenye namba hii ipo kwenye mfumo (${found.businessName} - ID: ${found.id}). Mfumo utaunganisha taarifa bila kupoteza historia.`
      );
    } else {
      setDuplicateWarning(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !contactName || !phone) return;

    const newMerchantId = createLead({
      businessName,
      sector,
      contactName,
      phone,
      email: email || `${contactName.toLowerCase().replace(/\s+/g, '')}@example.tz`,
      region,
      city,
      channel,
      referrerName: referrerName || undefined,
    });

    if (consentGranted) {
      recordConsent({
        merchantId: newMerchantId,
        version: 'PDPA-2022-v1.0',
        purpose: 'Business systems diagnosis, advisory comparison and verified vendor introduction',
        channel,
        scopeOfDataSharing: ['Business Profile', 'System Requirements', 'Branch Count'],
      });
    }

    onSuccess(newMerchantId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#0B2F66] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h3 className="font-bold text-base">{t.ctaGetAssessment}</h3>
              <p className="text-xs text-blue-200">
                Pata uchambuzi huru na ushauri wa kitaalamu kabla ya kununua mfumo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-md hover:bg-blue-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {duplicateWarning && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-2 text-amber-900 text-xs">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>{duplicateWarning}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-800">
                Jina Rasmi la Biashara (Business Name) *
              </label>
              <input
                type="text"
                required
                placeholder="mf. Kariakoo Smart Supermarket Ltd"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#0B2F66] focus:border-transparent outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">
                Sekta ya Biashara (Sector) *
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as SectorType)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#0B2F66] outline-none text-xs bg-white"
              >
                <option value="retail_supermarket">{t.sector_retail_supermarket}</option>
                <option value="wholesale_distribution">{t.sector_wholesale_distribution}</option>
                <option value="pharmacy_health">{t.sector_pharmacy_health}</option>
                <option value="hardware_construction">{t.sector_hardware_construction}</option>
                <option value="hospitality_restaurant">{t.sector_hospitality_restaurant}</option>
                <option value="services_spares">{t.sector_services_spares}</option>
                <option value="general_trade">{t.sector_general_trade}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">
                Mkoa (Region) *
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#0B2F66] outline-none text-xs bg-white"
              >
                <option value="Dar es Salaam">Dar es Salaam</option>
                <option value="Arusha">Arusha</option>
                <option value="Mwanza">Mwanza</option>
                <option value="Dodoma">Dodoma</option>
                <option value="Mbeya">Mbeya</option>
                <option value="Kilimanjaro (Moshi)">Kilimanjaro (Moshi)</option>
                <option value="Morogoro">Morogoro</option>
                <option value="Tanga">Tanga</option>
                <option value="Zanzibar">Zanzibar</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">
                Jina la Mwenye Biashara / Meneja *
              </label>
              <input
                type="text"
                required
                placeholder="mf. Amina Salum Bakari"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#0B2F66] outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">
                Nambari ya Simu (WhatsApp / Kupigiwa) *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#0B2F66] outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">
                Barua Pepe (Email - Hiari)
              </label>
              <input
                type="email"
                placeholder="jina@biashara.tz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#0B2F66] outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">
                Kituo / Eneo la Biashara
              </label>
              <input
                type="text"
                placeholder="mf. Kariakoo Msimbazi, Dar"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#0B2F66] outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">
                Njia ya Mawasiliano
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#0B2F66] outline-none text-xs bg-white"
              >
                <option value="web">Tovuti (Web Direct)</option>
                <option value="whatsapp">WhatsApp Hotline</option>
                <option value="phone">Simu ya Moja kwa Moja</option>
                <option value="field">Mshauri Aliyetembelea Eneo Lako</option>
                <option value="referral">Chama cha Wafanyabiashara / Rufaa</option>
              </select>
            </div>

            {channel === 'referral' && (
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Jina la Aliyekuelekeza (Referrer)
                </label>
                <input
                  type="text"
                  placeholder="mf. TCCIA Kariakoo"
                  value={referrerName}
                  onChange={(e) => setReferrerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#0B2F66] outline-none text-xs"
                />
              </div>
            )}
          </div>

          {/* Privacy & Consent Checkbox */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={consentGranted}
                onChange={(e) => setConsentGranted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-[#0B2F66] focus:ring-[#0B2F66] border-slate-300"
              />
              <span className="text-[11px] text-slate-700 leading-relaxed">
                <strong>Idhini ya Faragha (PDPA 2022 v1.0):</strong> Ninaruhusu Biashara Salama kutumia taarifa hizi kufanya tathmini ya mahitaji ya mfumo na kunipa ushauri. Taarifa zangu hazitauzwa au kushirikishwa bila idhini yangu.
              </span>
            </label>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Akaunti yako ya mfanyabiashara inabaki salama hata ukibadilisha programu baadaye.</span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              Ghairi (Cancel)
            </button>
            <button
              type="submit"
              disabled={!consentGranted}
              className="px-5 py-2 rounded-md bg-[#0B2F66] hover:bg-[#071f45] text-white font-bold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
            >
              <span>Hifadhi & Anza Tathmini</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
