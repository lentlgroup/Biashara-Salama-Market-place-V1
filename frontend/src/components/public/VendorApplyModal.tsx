import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, ShieldCheck, Building2, UploadCloud, AlertCircle } from 'lucide-react';

interface VendorApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VendorApplyModal: React.FC<VendorApplyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useApp();
  const [legalName, setLegalName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [brelaNumber, setBrelaNumber] = useState('');
  const [tinNumber, setTinNumber] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('+255 ');
  const [category, setCategory] = useState('POS');
  const [hasTraVfd, setHasTraVfd] = useState(true);
  const [hasOffline, setHasOffline] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
        <div className="bg-[#0B2F66] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="font-bold text-base">{t.ctaVendorApply}</h3>
              <p className="text-xs text-blue-200">
                Ombi la Ubia na Uhakiki wa Programu (Vendor Due Diligence)
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

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-base">
                Ombi Limetumwa kwa Idara ya Uhakiki (Compliance & Due Diligence)
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Asante {legalName}. Timu yetu itapitia usajili wa BRELA, TIN, uthibitisho wa TRA VFD na uwezo wa mfumo wako kufanya kazi nje ya mtandao ndani ya siku 3 za kazi.
              </p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-left text-xs text-blue-900 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-700" /> Mkataba wa Agent of Record:
              </div>
              <p className="text-[11px] text-slate-600">
                Mifumo iliyoidhinishwa pekee ndiyo inayoingizwa kwenye katalogi ya kulinganishwa na wateja wetu.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#0B2F66] text-white rounded-md font-bold text-xs hover:bg-[#071f45]"
            >
              Funga (Close)
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-950 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Vigezo vya Uhakiki:</strong> Hakuna programu inayochapishwa bila uthibitisho halisi wa leseni, TRA/VFD, na uhakiki wa SLA ya msaada wa kiufundi nchini Tanzania.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-800">
                  Jina la Kisheria la Kampuni (Legal Registered Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="mf. Smart POS Technologies Tanzania Limited"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#0B2F66] outline-none text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Jina la Biashara / Chapa (Brand Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="mf. SmartPOS"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#0B2F66] outline-none text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Aina ya Mfumo (Product Category) *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#0B2F66] outline-none text-xs bg-white"
                >
                  <option value="POS">Point of Sale (POS) & Retail Counter</option>
                  <option value="Inventory">Stoo na Usambazaji (Inventory & Warehouse)</option>
                  <option value="Accounting">Uhasibu na Kodi (Accounting & Invoicing)</option>
                  <option value="ERP">Mfumo Jumuishi (Enterprise ERP)</option>
                  <option value="Integrated_Suite">Mchanganyiko wa Sekta Maalum (Pharmacy/Hotel)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Namba ya Usajili wa BRELA *
                </label>
                <input
                  type="text"
                  required
                  placeholder="mf. BRELA-123456"
                  value={brelaNumber}
                  onChange={(e) => setBrelaNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#0B2F66] outline-none text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Namba ya TIN (TRA) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="mf. 123-456-789"
                  value={tinNumber}
                  onChange={(e) => setTinNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#0B2F66] outline-none text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Mtu wa Mawasiliano (Partner Lead) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="mf. Fatma Rashid"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#0B2F66] outline-none text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Barua Pepe ya Biashara (Official Email) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="partners@company.tz"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#0B2F66] outline-none text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-800">
                  Nambari ya Simu ya Ofisi *
                </label>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#0B2F66] outline-none text-xs"
                />
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="font-semibold text-slate-800 text-xs">
                Uwezo wa Mfumo Wako (System Capabilities)
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasTraVfd}
                  onChange={(e) => setHasTraVfd(e.target.checked)}
                  className="rounded text-[#0B2F66] border-slate-300"
                />
                <span className="text-slate-700">Mfumo una uwezo wa kutoa risiti halisi za TRA VFD kielektroniki</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasOffline}
                  onChange={(e) => setHasOffline(e.target.checked)}
                  className="rounded text-[#0B2F66] border-slate-300"
                />
                <span className="text-slate-700">Mfumo unafanya kazi nje ya mtandao (Offline Resilience) mtandao unapokatika</span>
              </label>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
              >
                Ghairi
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-md bg-[#0B2F66] text-white font-bold hover:bg-[#071f45] shadow-xs"
              >
                Tuma Maombi ya Uhakiki
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
