/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSwitcher } from './components/common/RoleSwitcher';
import { SampleDataBanner } from './components/common/SampleDataBanner';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { PublicMarketplace } from './components/public/PublicMarketplace';
import { SectorGuide } from './components/public/SectorGuide';
import { ProductComparison } from './components/public/ProductComparison';
import { MerchantPortal } from './components/merchant/MerchantPortal';
import { VendorPortal } from './components/vendor/VendorPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { LeadIntakeModal } from './components/public/LeadIntakeModal';
import { VendorApplyModal } from './components/public/VendorApplyModal';
import { ProductDetailModal } from './components/public/ProductDetailModal';

function AppContent() {
  const { activeTab, setActiveTab } = useApp();

  // Modals state
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isVendorApplyModalOpen, setIsVendorApplyModalOpen] = useState(false);
  const [inspectedProductId, setInspectedProductId] = useState<string | null>(null);

  const handleLeadSuccess = (_newMerchantId: string) => {
    setActiveTab('merchant_portal');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 antialiased selection:bg-amber-200 selection:text-amber-950">
      {/* 1. Global Role Switcher Bar */}
      <RoleSwitcher />

      {/* 2. Sample Data Notice & Reset Banner */}
      <SampleDataBanner />

      {/* 3. Primary Header */}
      <Header
        onOpenLeadModal={() => setIsLeadModalOpen(true)}
        onOpenVendorApplyModal={() => setIsVendorApplyModalOpen(true)}
      />

      {/* 4. Main Dynamic View Container */}
      <main className="flex-1">
        {activeTab === 'public' && (
          <PublicMarketplace
            onOpenLeadModal={() => setIsLeadModalOpen(true)}
            onOpenVendorApplyModal={() => setIsVendorApplyModalOpen(true)}
            onOpenProductDetail={(id) => setInspectedProductId(id)}
          />
        )}

        {activeTab === 'sectors' && (
          <SectorGuide
            onOpenLeadModal={() => setIsLeadModalOpen(true)}
            onOpenProductDetail={(id) => setInspectedProductId(id)}
          />
        )}

        {activeTab === 'compare' && (
          <ProductComparison
            onOpenLeadModal={() => setIsLeadModalOpen(true)}
            onOpenProductDetail={(id) => setInspectedProductId(id)}
          />
        )}

        {activeTab === 'merchant_portal' && <MerchantPortal />}

        {activeTab === 'vendor_portal' && <VendorPortal />}

        {activeTab === 'admin_portal' && <AdminPortal />}
      </main>

      {/* 5. Footer */}
      <Footer />

      {/* 6. Lead Intake & Consent Modal */}
      <LeadIntakeModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSuccess={handleLeadSuccess}
      />

      {/* 7. Vendor Application Modal */}
      <VendorApplyModal
        isOpen={isVendorApplyModalOpen}
        onClose={() => setIsVendorApplyModalOpen(false)}
      />

      {/* 8. Deep Product Detail Modal */}
      <ProductDetailModal
        productId={inspectedProductId}
        onClose={() => setInspectedProductId(null)}
        onOpenLeadModal={() => {
          setInspectedProductId(null);
          setIsLeadModalOpen(true);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
