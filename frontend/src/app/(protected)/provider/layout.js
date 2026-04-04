'use client';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ProviderShell from '@/components/provider/providerShell';

export default function ProviderLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ProviderShell>{children}</ProviderShell>
      <Footer />
    </div>
  );
}
