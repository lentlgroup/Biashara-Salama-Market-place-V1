import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Store,
  Layers,
  ArrowRightLeft,
  Building2,
  ShieldAlert,
  ClipboardList,
  Globe,
  Menu,
  X,
  PhoneCall,
} from 'lucide-react';

interface HeaderProps {
  onOpenLeadModal: () => void;
  onOpenVendorApplyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLeadModal,
  onOpenVendorApplyModal,
}) => {
  const { language, setLanguage, t, activeTab, setActiveTab, comparedProductIds, currentUser, merchants } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeMerchant = merchants.find((m) => m.id === currentUser.merchantId) || merchants[0];

  const navItems = [
    { id: 'public', label: t.navHome, icon: Store },
    { id: 'sectors', label: t.navSectors, icon: Layers },
    { id: 'compare', label: t.navCompare, icon: ArrowRightLeft, badge: comparedProductIds.length },
    { id: 'merchant_portal', label: t.navMerchantPortal, icon: Store, roleMatch: ['merchant_owner', 'merchant_staff'] },
    { id: 'vendor_portal', label: t.navVendorPortal, icon: Building2, roleMatch: ['vendor_admin'] },
    { id: 'admin_portal', label: t.navAdminPortal, icon: ShieldAlert, roleMatch: ['adviser', 'implementation_specialist', 'compliance_approver', 'finance_analyst', 'executive', 'support_agent', 'product_admin'] },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B2F66] text-white border-b border-blue-900/60 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand matching Professional Polish mockup */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('public')}
              className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
                <div className="w-6 h-6 border-4 border-[#0B2F66] rounded-xs flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-xs"></div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white text-lg tracking-tight leading-none">
                    Biashara Salama
                  </span>
                  <span className="text-lg font-bold text-[#D4AF37] tracking-tight leading-none">
                    Marketplace
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-bold text-[#D4AF37] tracking-wider uppercase">
                    {t.brandConfidenceLine}
                  </span>
                  <span className="text-[10px] text-blue-200 hidden sm:inline">
                    • Tanzanian SME Tech Brokerage
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2 text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isRoleHighlighted = item.roleMatch?.includes(currentUser.role);

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white/15 text-white shadow-xs border border-white/20 text-[#D4AF37]'
                      : isRoleHighlighted
                      ? 'text-blue-100 bg-white/10 hover:bg-white/15 hover:text-white'
                      : 'text-blue-100/90 hover:text-[#D4AF37] hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF37]' : ''}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-[#D4AF37] text-[#0B2F66]' : 'bg-[#D4AF37]/90 text-[#0B2F66]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Language Switcher, Merchant Pill & Primary Action */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center border border-white/30 rounded-lg overflow-hidden bg-white/5 text-xs">
              <button
                onClick={() => setLanguage('sw')}
                className={`px-2.5 py-1 font-bold text-xs uppercase transition-colors cursor-pointer ${
                  language === 'sw' ? 'bg-[#D4AF37] text-[#0B2F66]' : 'text-blue-100 hover:bg-white/10'
                }`}
                title="Kiswahili (Chaguo-msingi)"
              >
                SW
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 font-bold text-xs uppercase transition-colors cursor-pointer ${
                  language === 'en' ? 'bg-[#D4AF37] text-[#0B2F66]' : 'text-blue-100 hover:bg-white/10'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Merchant Quick Pill (Theme Feature) */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-white/20">
              <div className="text-right leading-tight hidden xl:block">
                <p className="text-[9px] font-bold uppercase tracking-wider text-blue-200">Merchant ID</p>
                <p className="text-xs font-bold text-[#D4AF37]">{activeMerchant?.id || 'TZ-8842-MS'}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-bold text-xs text-white shadow-2xs">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            </div>

            {/* Assessment CTA button */}
            <button
              onClick={onOpenLeadModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#c5a02e] text-[#0B2F66] text-xs font-bold shadow-sm transition-all cursor-pointer hover:shadow-md"
            >
              <ClipboardList className="w-3.5 h-3.5 text-[#0B2F66]" />
              <span>{t.ctaGetAssessment}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setLanguage(language === 'sw' ? 'en' : 'sw')}
              className="px-2 py-1 text-xs font-bold text-[#0B2F66] bg-[#D4AF37] rounded"
            >
              {language.toUpperCase()}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:text-[#D4AF37] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-blue-800 bg-[#08224a] px-4 pt-3 pb-5 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-white/15 text-[#D4AF37] font-bold border border-white/20' : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-[#D4AF37] text-[#0B2F66] text-xs px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-3 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenLeadModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-lg bg-[#D4AF37] text-[#0B2F66] font-bold text-sm text-center flex items-center justify-center gap-2 shadow-sm"
            >
              <ClipboardList className="w-4 h-4" />
              {t.ctaGetAssessment}
            </button>
            <button
              onClick={() => {
                onOpenVendorApplyModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 rounded-lg border border-white/30 text-white font-semibold text-xs text-center hover:bg-white/10"
            >
              {t.ctaVendorApply}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
