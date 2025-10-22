// pages/terms.tsx (or app/terms/page.tsx)
"use client";

import React from 'react';

const TermsOfServicePage: React.FC = () => {
  const effectiveDate = "October 22, 2025";

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl text-[#3E2723]"> {/* Max width for readability */}
      
      <h1 className="text-4xl font-bold my-10 text-center text-[#3E2723]">Terms of Service</h1>
      <p className="text-center text-sm text-gray-600 mb-8">
        Effective Date: {effectiveDate}
      </p>

      {/* Main Content Sections */}
      <div className="bg-[#FBE9E7] p-8 rounded-xl shadow-lg space-y-8">

        {/* Introduction and Acceptance */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b-2 border-[#2196F3] pb-1">1. Acceptance of Terms</h2>
          <p className="leading-relaxed">
            By accessing or using TuklasVerse.com ("the Service"), you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you disagree with any part of the terms, then you may not access the Service.
          </p>
        </section>

        {/* 2. Use of the Service */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b-2 border-[#2196F3] pb-1">2. Use of the Service</h2>
          <h3 className="text-xl font-medium mt-4 mb-2">User Registration</h3>
          <p className="leading-relaxed mb-2">
            You must register an account to access features like the Watchlist and Dashboard. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </p>
          <h3 className="text-xl font-medium mt-4 mb-2">Content</h3>
          <p className="leading-relaxed">
            All content provided on the Service (reviews, summaries, metadata for Movies and TV Series) is for informational purposes only. TuklasVerse does not host or stream any copyrighted video content.
          </p>
        </section>

        {/* 3. User Conduct */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b-2 border-[#2196F3] pb-1">3. Prohibited Conduct</h2>
          <p className="leading-relaxed">
            You agree not to use the Service in a way that:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Violates any local, state, national, or international law.</li>
            <li>Infringes on the intellectual property rights of TuklasVerse or others.</li>
            <li>Involves unauthorized access to data or servers.</li>
          </ul>
        </section>

        {/* 4. Disclaimers */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b-2 border-[#2196F3] pb-1">4. Disclaimers</h2>
          <p className="leading-relaxed">
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. TuklasVerse makes no warranties, expressed or implied, regarding the operation or availability of the Service.
          </p>
        </section>

        {/* 5. Contact Information */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b-2 border-[#2196F3] pb-1">5. Contact Information</h2>
          <p className="leading-relaxed">
            For any questions about these Terms, please contact us at **contact@tuklasverse.com**.
          </p>
        </section>

      </div>
    </div>
  );
};

export default TermsOfServicePage;