import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, FileText, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, setActiveTab } = useApp();

  return (
    <footer className="bg-[#0B2F66] text-blue-100 border-t border-blue-900 text-xs">
      {/* Regulatory and Boundary Disclaimer Banner */}
      <div className="bg-[#08224a] border-b border-blue-900/60 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-2.5 max-w-3xl">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-white text-xs">
                {t.boundaryTitle}
              </div>
              <p className="text-blue-200 text-[11px] leading-relaxed">
                {t.boundaryDesc}
              </p>
            </div>
          </div>
          <div className="text-[11px] text-blue-200 border-l border-blue-800 pl-4 py-1">
            <span className="font-semibold text-[#D4AF37]">Hakuna cha kupotea:</span>{' '}
            {t.brandConfidenceNote}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <div className="w-5 h-5 border-3 border-[#0B2F66] rounded-2xs flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-2xs"></div>
                </div>
              </div>
              <span className="font-extrabold text-white text-base">
                Biashara Salama <span className="text-[#D4AF37]">Marketplace</span>
              </span>
            </div>
            <p className="text-blue-200 text-xs leading-relaxed">
              {t.taglineSubtitle}
            </p>
            <div className="text-[11px] text-emerald-300 flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/10 w-fit">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Compliant with Tanzanian PDPA (2022)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <div className="font-bold text-[#D4AF37] text-xs tracking-wider uppercase">
              {t.navProducts}
            </div>
            <ul className="space-y-1.5 text-xs text-blue-200">
              <li>
                <button
                  onClick={() => setActiveTab('sectors')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  {t.sector_retail_supermarket}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('sectors')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  {t.sector_wholesale_distribution}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('sectors')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  {t.sector_pharmacy_health}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('sectors')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  {t.sector_hardware_construction}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('compare')}
                  className="hover:text-[#D4AF37] transition-colors font-medium text-white cursor-pointer"
                >
                  {t.ctaCompareSystems}
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Compliance */}
          <div className="space-y-2">
            <div className="font-bold text-[#D4AF37] text-xs tracking-wider uppercase">
              Uthibitisho na Sheria
            </div>
            <ul className="space-y-1.5 text-xs text-blue-200">
              <li>• Uthibitisho wa TRA / VFD Web API</li>
              <li>• Ukaguzi wa Kufanya Kazi Nje ya Mtandao (Offline)</li>
              <li>• Utoaji wa Data na Nakala (Data Portability)</li>
              <li>• Ufichuzi wa Mahusiano ya Kibiashara (Disclosures)</li>
              <li>• Mwongozo wa Haki za Data za Mfanyabiashara</li>
            </ul>
          </div>

          {/* Contact & Field Clusters */}
          <div className="space-y-2">
            <div className="font-bold text-[#D4AF37] text-xs tracking-wider uppercase">
              Wasiliana na Timu ya Ushauri
            </div>
            <ul className="space-y-2 text-xs text-blue-200">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Kariakoo & New Bagamoyo Rd, Dar es Salaam | Arusha | Mwanza</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>+255 754 000 111 / +255 713 000 222</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>ushauri@biasharasalama.co.tz</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar matching theme design */}
        <div className="mt-8 pt-6 border-t border-blue-900/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-blue-300 gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <p>© {new Date().getFullYear()} Biashara Salama Marketplace. Haki zote zimehifadhiwa.</p>
            <div className="flex space-x-3 text-blue-200">
              <a href="#" className="hover:text-[#D4AF37] transition-colors">Masharti ya Huduma</a>
              <span>•</span>
              <a href="#" className="hover:text-[#D4AF37] transition-colors">Sera ya Faragha</a>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center text-emerald-400 font-bold">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
              Secure Backend Active
            </span>
            <span className="text-blue-400">|</span>
            <span className="italic font-medium text-[#D4AF37]">"Hakuna cha kupotea"</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
