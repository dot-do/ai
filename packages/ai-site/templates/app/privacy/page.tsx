import React from 'react'

export default function PrivacyPolicy() {
  return (
    <div className="container">
      <h1 className="title">Privacy Policy</h1>
      <p className="description">This Privacy Policy describes how your personal information is collected, used, and shared when you visit our website.</p>

      <div className="grid">
        <div className="card">
          <h2>Information We Collect</h2>
          <p>
            When you visit our site, we automatically collect certain information about your device, including information about your web browser, IP address,
            time zone, and some of the cookies that are installed on your device.
          </p>
        </div>

        <div className="card">
          <h2>How We Use Your Information</h2>
          <p>
            We use the information we collect to help us screen for potential risk and fraud, and to improve and optimize our site. We also use this information
            to provide better services and features to our users.
          </p>
        </div>

        <div className="card">
          <h2>Sharing Your Information</h2>
          <p>
            We share your Personal Information with third parties to help us use your Personal Information, as described above. We also use Google Analytics to
            help us understand how our customers use the site.
          </p>
        </div>

        <div className="card">
          <h2>Your Rights</h2>
          <p>
            If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be
            corrected, updated, or deleted.
          </p>
        </div>

        <div className="card">
          <h2>Changes</h2>
          <p>
            We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or
            regulatory reasons.
          </p>
        </div>

        <div className="card">
          <h2>Contact Us</h2>
          <p>
            For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail or by
            mail using the details provided on our website.
          </p>
        </div>
      </div>
    </div>
  )
}
