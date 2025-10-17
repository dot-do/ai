import React from 'react'

export function useMDXComponents(components) {
  return {
    ...components,

    h1: (props) => <h1 className="text-4xl font-bold mb-4" {...props} />,
    h2: (props) => <h2 className="text-3xl font-bold mb-3" {...props} />,
    h3: (props) => <h3 className="text-2xl font-bold mb-2" {...props} />,

    p: (props) => <p className="mb-4 text-lg" {...props} />,

    Feature: ({ title, description, icon }) => (
      <div className="feature-card">
        {icon && <div className="feature-icon">{icon}</div>}
        <h3 className="feature-title">{title}</h3>
        <p className="feature-description">{description}</p>
      </div>
    ),

    Benefit: ({ title, description }) => (
      <div className="benefit-card">
        <h3 className="benefit-title">{title}</h3>
        <p className="benefit-description">{description}</p>
      </div>
    ),

    CTA: ({ text, link }) => (
      <a href={link} className="cta-button">
        {text}
      </a>
    ),
  }
}

export default useMDXComponents
