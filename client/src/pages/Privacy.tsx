function Privacy() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-[#888888] text-sm mb-8">Last updated: June 2026</p>

        <div className="space-y-6 text-[#888888] text-sm leading-relaxed">
          <div>
            <h2 className="text-white font-semibold text-lg mb-2">1. Information We Collect</h2>
            <p>When you sign in with Google, we collect your name and profile photo provided by Google. We do not collect or store your password or email address.</p>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg mb-2">2. How We Use Your Information</h2>
            <p>We use your name and profile photo to create and display your artist profile on ARTJIYA. Your information is never sold to third parties.</p>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg mb-2">3. Artwork You Upload</h2>
            <p>Artwork you upload is stored securely on Cloudinary and displayed publicly on the platform. You retain full ownership of your artwork.</p>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg mb-2">4. Cookies</h2>
            <p>We use cookies only to keep you logged in. No tracking or advertising cookies are used.</p>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg mb-2">5. Data Deletion</h2>
            <p>You can request deletion of your account and all associated data by contacting us at support@artjiya.xyz.</p>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg mb-2">6. Contact</h2>
            <p>For any privacy concerns, contact us at support@artjiya.xyz.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Privacy;