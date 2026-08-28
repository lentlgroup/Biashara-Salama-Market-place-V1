import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Users, Check } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, switchUserRole, setActiveTab } = useApp();

  const roleOptions: { role: UserRole; label: string; group: string; portalTab: string }[] = [
    { role: 'adviser', label: 'Juma (Field Adviser / Broker)', group: 'Operations & Advisory', portalTab: 'admin_portal' },
    { role: 'implementation_specialist', label: 'Neema (Implementation Specialist)', group: 'Operations & Advisory', portalTab: 'admin_portal' },
    { role: 'compliance_approver', label: 'Dr. Zuhura (Compliance Approver)', group: 'Operations & Advisory', portalTab: 'admin_portal' },
    { role: 'finance_analyst', label: 'Emanuel (Finance & Commission Analyst)', group: 'Operations & Advisory', portalTab: 'admin_portal' },
    { role: 'executive', label: 'Tariq (Executive / Product Owner)', group: 'Operations & Advisory', portalTab: 'admin_portal' },
    { role: 'support_agent', label: 'Support Agent (Helpdesk Console)', group: 'Operations & Advisory', portalTab: 'admin_portal' },
    { role: 'product_admin', label: 'Product Administrator', group: 'Operations & Advisory', portalTab: 'admin_portal' },
    { role: 'merchant_owner', label: 'Amina Salum (Retail Merchant Owner)', group: 'Merchant Experience', portalTab: 'merchant_portal' },
    { role: 'merchant_staff', label: 'Zuberi (Merchant Staff / Cashier)', group: 'Merchant Experience', portalTab: 'merchant_portal' },
    { role: 'vendor_admin', label: 'Baraka (SimbaPOS Vendor Admin)', group: 'Vendor Partner', portalTab: 'vendor_portal' },
    { role: 'referrer', label: 'TCCIA Kariakoo (Referrer / Partner)', group: 'Referrer Channel', portalTab: 'public' },
  ];

  const handleRoleChange = (role: UserRole) => {
    switchUserRole(role);
    const opt = roleOptions.find((r) => r.role === role);
    if (opt) {
      setActiveTab(opt.portalTab);
    }
  };

  return (
    <div className="bg-[#08224a] text-white border-b border-blue-900/60 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs gap-3">
      <div className="flex items-center gap-2">
        <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span className="text-blue-200 font-medium hidden md:inline">Viewing as:</span>
        <select
          value={currentUser.role}
          onChange={(e) => handleRoleChange(e.target.value as UserRole)}
          className="bg-[#0B2F66] text-white font-semibold rounded-md px-2.5 py-1 border border-blue-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37] cursor-pointer"
        >
          {roleOptions.map((opt) => (
            <option key={opt.role} value={opt.role}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-blue-200">
        <span className="bg-blue-950 px-2.5 py-0.5 rounded-md text-blue-100 border border-blue-800">
          User ID: <code className="text-[#D4AF37] font-semibold">{currentUser.id}</code>
        </span>
        {currentUser.mfaEnabled && (
          <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-300 px-2.5 py-0.5 rounded-md border border-emerald-800 text-[10px]">
            <Check className="w-2.5 h-2.5" /> MFA Verified
          </span>
        )}
      </div>
    </div>
  );
};
