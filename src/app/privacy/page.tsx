// pages/privacy.tsx (or app/privacy/page.tsx)
"use client";

import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  // Define the last update date here
  const lastUpdated = "October 22, 2025";

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl text-[#3E2723]"> {/* Max width for readability */}
      
      <h1 className="text-4xl font-bold my-10 text-center text-[#3E2723]">Privacy Policy</h1>
      <p className="text-center text-sm text-gray-600 mb-8">
        Last Updated: {lastUpdated}
      </p>

      {/* Main Content Sections */}
      <div className="bg-[#FBE9E7] p-8 rounded-xl shadow-lg space-y-8">

        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b-2 border-[#2196F3] pb-1">Introduction</h2>
          <p className="leading-relaxed">
            Welcome to TuklasVerse. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at **contact@tuklasverse.com**.
          </p>
          <p className="leading-relaxed">
  By accessing or using TuklasVerse.com (&quot;the Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;) and our Privacy Policy. If you disagree with any part of the terms, then you may not access the Service.
</p>
        </section>

        {/* 1. Information We Collect */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b-2 border-[#2196F3] pb-1">1. Information We Collect</h2>
          <p className="leading-relaxed mb-4">
            We collect personal information that you voluntarily provide to us when registering at the Services, expressing an interest in obtaining information about us or our products and services, when participating in activities on the Services or otherwise contacting us.
          </p>
          <h3 className="text-xl font-medium mt-4 mb-2">Personal Information Provided by You</h3>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>**Registration Data:** We collect your name, email address, password, and similar security information used for authentication and account access (as per your Registration wireframe).</li>
            <li>**Usage Data:** We collect information about how you use the Services, such as pages visited, content viewed (Movies & TV Series), and interactions with features (like the Watchlist).</li>
          </ul>
        </section>

        {/* 2. How We Use Your Information */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b-2 border-[#2196F3] pb-1">2. How We Use Your Information</h2>
          <p className="leading-relaxed mb-2">
            We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>To facilitate **account creation and logon** process.</li>
            <li>To **manage user accounts** and fulfill and manage your Watchlist entries.</li>
            <li>To send you marketing and promotional communications (if you opt-in).</li>
            <li>To deliver targeted advertising and content recommendations.</li>
          </ul>
        </section>

        {/* 3. Third-Party Access */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b-2 border-[#2196F3] pb-1">3. Disclosure to Third Parties</h2>
          <p className="leading-relaxed">
            We may share your data with third-party vendors, service providers, contractors or agents who perform services for us or on our behalf and require access to such information to do that work. We do not sell your personal information.
          </p>
        </section>

        {/* 4. Your Privacy Rights */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b-2 border-[#2196F3] pb-1">4. Your Privacy Rights</h2>
          <p className="leading-relaxed">
            In some regions (like the European Economic Area), you have rights that allow you greater access to and control over your personal information. Your rights may include:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>The right to **request access** to and obtain a copy of your personal information.</li>
            <li>The right to **request rectification or erasure**.</li>
            <li>The right to **restrict the processing** of your personal information.</li>
          </ul>
        </section>

      </div>
    </div>
  );
};

export default PrivacyPolicyPage;