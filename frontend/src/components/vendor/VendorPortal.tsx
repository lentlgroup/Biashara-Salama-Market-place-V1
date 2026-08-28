import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Users,
  Layers,
  Award,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  DollarSign,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const VendorPortal: React.FC = () => {
  const { vendors, products, merchants, currentUser, t } = useApp();
  const [activeTab, setActiveTab] = useState<'leads' | 'products' | 'scorecard' | 'commissions'>('leads');

  // Active vendor for vendor admin user
  const activeVendor = vendors.find((v) => v.id === currentUser.vendorId) || vendors[0];
  const vendorProducts = products.filter((p) => p.vendorId === activeVendor.id);
  const vendorLeads = merchants.filter(
    (m) => m.activeVendorId === activeVendor.id || m.stage === 'lead_intake' || m.stage === 'recommendation_issued'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Vendor Partner ID: {activeVendor.id}
            </span>
            <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3 h-3" />}>
              Due Diligence: Approved Partner
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0B2F66]">{activeVendor.brandName}</h1>
          <p className="text-xs text-slate-500">
            Jina la Kisheria: <strong className="text-slate-800">{activeVendor.legalName}</strong> | BRELA: {activeVendor.brelaNumber} | TIN: {activeVendor.tinNumber}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="text-right">
            <span className="text-slate-500 block text-[10px]">Alama ya Utendaji (Rating):</span>
            <strong className="text-amber-700 font-bold">★ {activeVendor.scorecard.merchantSatisfaction} / 5.0</strong>
          </div>
          <div className="border-l border-slate-200 pl-3 text-right">
            <span className="text-slate-500 block text-[10px]">SLA ya Majibu:</span>
            <strong className="text-emerald-700 font-bold">{activeVendor.scorecard.leadResponseHours} hrs</strong>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 bg-white p-2 rounded-xl shadow-2xs overflow-x-auto text-xs">
        {[
          { id: 'leads', label: 'Wateja & Fursa (Assigned Leads)', icon: Users, badge: vendorLeads.length },
          { id: 'products', label: 'Mifumo & Bei (Product Catalogue)', icon: Layers, badge: vendorProducts.length },
          { id: 'scorecard', label: 'Kadi ya Utendaji (SLA Scorecard)', icon: Award },
          { id: 'commissions', label: 'Makubaliano ya Udalali (Brokerage Reconciliation)', icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                isActive ? 'bg-[#0B2F66] text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                    isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'leads' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-bold text-[#0B2F66]">Fursa Zilizoelekezwa na Mshauri</h2>
              <p className="text-xs text-slate-500">
                Wafanyabiashara waliofanyiwa tathmini kamili na kupendekezewa mfumo wako.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-medium">SLA: Majibu ndani ya masaa 4</span>
          </div>

          <div className="space-y-3">
            {vendorLeads.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{m.businessName}</span>
                    <Badge variant="primary" size="sm">
                      {m.stage}
                    </Badge>
                  </div>
                  <div className="text-slate-600">
                    Mwasiliani: <strong>{m.contacts[0]?.name}</strong> ({m.contacts[0]?.phone}) | Sekta: {m.sector} | Mkoa: {m.region}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Tarehe ya Kuingia: {m.createdAt.split('T')[0]} | Chanzo: {m.sourceChannel}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button className="px-3 py-1.5 bg-[#0B2F66] text-white rounded-md font-bold text-xs hover:bg-[#071f45]">
                    Thibitisha Upokeaji (Accept SLA)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#0B2F66]">Katalogi ya Mifumo Yako Iliyoidhinishwa</h2>
                <p className="text-xs text-slate-500">
                  Madai yote na viwango vya bei vinakaguliwa na timu ya compliance ya Biashara Salama.
                </p>
              </div>
              <Badge variant="success" size="sm">
                Active on Marketplace
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendorProducts.map((p) => (
                <div key={p.id} className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-base">{p.name}</span>
                    <Badge variant="success" size="sm">
                      TRA Certified
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600">{p.tagline}</p>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>TRA VFD Certificate:</span>
                      <code className="font-bold text-slate-800">{p.traCertificateNumber}</code>
                    </div>
                    <div className="flex justify-between">
                      <span>Uwezo wa Offline:</span>
                      <strong>{p.offlineCapabilities}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Muda wa Uhakiki Unamalizika:</span>
                      <strong>{p.approvalExpiryDate.split('T')[0]}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'scorecard' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-[#0B2F66]">Kadi ya Utendaji na Uhakiki wa SLA (Vendor Scorecard)</h2>
            <p className="text-xs text-slate-500">
              Viwango hivi vinapimwa kiotomatiki na kutumika na washauri wakati wa kupendekeza mifumo kwa wateja.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <span className="text-xs text-slate-500">Muda wa Kujibu Wateja (Response Time):</span>
              <div className="text-2xl font-black text-emerald-700">
                {activeVendor.scorecard.leadResponseHours} hrs
              </div>
              <span className="text-[10px] text-slate-500">Kigezo: Chini ya masaa 6</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <span className="text-xs text-slate-500">Kiwango cha Kufanikisha Go-Live:</span>
              <div className="text-2xl font-black text-blue-700">
                {activeVendor.scorecard.activationRatePercent}%
              </div>
              <span className="text-[10px] text-slate-500">Kigezo: Zaidi ya 85%</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <span className="text-xs text-slate-500">Kiwango cha Kuridhika kwa Wateja:</span>
              <div className="text-2xl font-black text-amber-700">
                ★ {activeVendor.scorecard.merchantSatisfaction} / 5.0
              </div>
              <span className="text-[10px] text-slate-500">Kutokana na tathmini 48 za wafanyabiashara</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'commissions' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-[#0B2F66]">
              Makubaliano ya Udalali & Usuluhishi wa Tume (Brokerage Reconciliation)
            </h2>
            <p className="text-xs text-slate-500">
              Kulingana na kanuni za BRD (Kifungu cha 1 & 9), malipo yote ya wateja huenda kwa mtoa huduma moja kwa moja. Tume ya udalali inalipwa kwa njia ya ankara ya B2B (Invoicing).
            </p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0B2F66]" /> Mkataba wa Broker-Vendor:
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              Ada ya udalali inatambuliwa baada ya mteja kukamilisha utekelezaji (Go-Live Acceptance) na kulipa leseni yake ya kwanza moja kwa moja kwa {activeVendor.brandName}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
