import React from 'react'

export default function TermsOfService() {
  return (
    <div className="container">
      <h1 className="title">Terms of Service</h1>
      <p className="description">Please read these terms and conditions carefully before using our website and services.</p>

      <div className="grid">
        <div className="card">
          <h2>Agreement to Terms</h2>
          <p>
            By accessing our website, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations. If you do not
            agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </div>

        <div className="card">
          <h2>Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only. This is
            the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials.
          </p>
        </div>

        <div className="card">
          <h2>Disclaimer</h2>
          <p>
            The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other
            warranties including, without limitation, implied warranties or conditions of merchantability.
          </p>
        </div>

        <div className="card">
          <h2>Limitations</h2>
          <p>
            In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due
            to business interruption) arising out of the use or inability to use our materials.
          </p>
        </div>

        <div className="card">
          <h2>Revisions and Errata</h2>
          <p>
            The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials
            on our website are accurate, complete or current.
          </p>
        </div>

        <div className="card">
          <h2>Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the
            courts in that location.
          </p>
        </div>
      </div>
    </div>
  )
}
