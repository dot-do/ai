import { StartupInstance, SiteGenerationResult } from './types'

/**
 * Generate a website based on the startup configuration
 *
 * @param config Configuration for site generation
 * @returns Generated site structure
 */
export const generateSite = (config: { business: any; services: any[] }): SiteGenerationResult => {
  const { business, services } = config

  const homePage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${business.name}</title>
  <link rel="stylesheet" href="/assets/styles.css">
</head>
<body>
  <header>
    <nav>
      <div class="logo">${business.name}</div>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/pricing">Pricing</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <section class="hero">
      <h1>${business.name}</h1>
      <p class="vision">${business.vision}</p>
      <a href="/services" class="cta-button">Explore Services</a>
    </section>
    
    <section class="services-preview">
      <h2>Our Services</h2>
      <div class="services-grid">
        ${services
          .map(
            (service: any) => `
          <div class="service-card">
            <h3>${service.name}</h3>
            <p>${service.objective}</p>
            <a href="/services#${service.name.toLowerCase().replace(/\s+/g, '-')}">Learn more</a>
          </div>
        `
          )
          .join('')}
      </div>
    </section>
  </main>
  
  <footer>
    <p>&copy; ${new Date().getFullYear()} ${business.name}. All rights reserved.</p>
  </footer>
</body>
</html>
  `.trim()

  const servicesPage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Services | ${business.name}</title>
  <link rel="stylesheet" href="/assets/styles.css">
</head>
<body>
  <header>
    <nav>
      <div class="logo">${business.name}</div>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/pricing">Pricing</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <section class="services-header">
      <h1>Our Services</h1>
      <p>Explore our range of AI-powered services designed to help your business grow.</p>
    </section>
    
    <section class="services-list">
      ${services
        .map(
          (service: any) => `
        <div class="service-detail" id="${service.name.toLowerCase().replace(/\s+/g, '-')}">
          <h2>${service.name}</h2>
          <p class="service-objective">${service.objective}</p>
          <div class="service-implementation">
            <span class="tag">${service.implementation.type}</span>
          </div>
          <a href="/pricing#${service.name.toLowerCase().replace(/\s+/g, '-')}" class="cta-button">View Pricing</a>
        </div>
      `
        )
        .join('')}
    </section>
  </main>
  
  <footer>
    <p>&copy; ${new Date().getFullYear()} ${business.name}. All rights reserved.</p>
  </footer>
</body>
</html>
  `.trim()

  const pricingPage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pricing | ${business.name}</title>
  <link rel="stylesheet" href="/assets/styles.css">
</head>
<body>
  <header>
    <nav>
      <div class="logo">${business.name}</div>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/pricing">Pricing</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <section class="pricing-header">
      <h1>Pricing</h1>
      <p>Transparent pricing for all your AI needs.</p>
    </section>
    
    <section class="pricing-plans">
      ${services
        .map(
          (service: any) => `
        <div class="pricing-card" id="${service.name.toLowerCase().replace(/\s+/g, '-')}">
          <h2>${service.name}</h2>
          <div class="pricing-model">
            <h3>Pricing Model: ${service.pricing.model}</h3>
            ${
              service.pricing.model === 'subscription'
                ? `
              <div class="subscription-pricing">
                <p class="price">$${service.pricing.subscription?.price || 0} / ${service.pricing.subscription?.interval || 'month'}</p>
              </div>
            `
                : ''
            }
            
            ${
              service.pricing.model === 'activity-based'
                ? `
              <div class="activity-pricing">
                <h4>Activities:</h4>
                <ul>
                  ${
                    service.pricing.activities
                      ?.map(
                        (activity: any) => `
                    <li>${activity.name}: $${activity.rate} per use</li>
                  `
                      )
                      .join('') || ''
                  }
                </ul>
              </div>
            `
                : ''
            }
            
            ${
              service.pricing.model === 'tiered'
                ? `
              <div class="tiered-pricing">
                <h4>Tiers:</h4>
                <ul>
                  ${
                    service.pricing.tiers
                      ?.map(
                        (tier: any) => `
                    <li>${tier.name}: $${tier.price}${tier.limit ? ` (up to ${tier.limit} units)` : ''}</li>
                  `
                      )
                      .join('') || ''
                  }
                </ul>
              </div>
            `
                : ''
            }
          </div>
          <a href="/contact" class="cta-button">Get Started</a>
        </div>
      `
        )
        .join('')}
    </section>
  </main>
  
  <footer>
    <p>&copy; ${new Date().getFullYear()} ${business.name}. All rights reserved.</p>
  </footer>
</body>
</html>
  `.trim()

  const aboutPage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About | ${business.name}</title>
  <link rel="stylesheet" href="/assets/styles.css">
</head>
<body>
  <header>
    <nav>
      <div class="logo">${business.name}</div>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/pricing">Pricing</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <section class="about-header">
      <h1>About Us</h1>
      <p class="vision">${business.vision}</p>
    </section>
    
    <section class="goals">
      <h2>Our Goals</h2>
      <div class="goals-list">
        ${business.goals
          .map(
            (goal: any) => `
          <div class="goal-card">
            <h3>${goal.objective}</h3>
            <ul>
              ${goal.keyResults.map((kr: string) => `<li>${kr}</li>`).join('')}
            </ul>
          </div>
        `
          )
          .join('')}
      </div>
    </section>
  </main>
  
  <footer>
    <p>&copy; ${new Date().getFullYear()} ${business.name}. All rights reserved.</p>
  </footer>
</body>
</html>
  `.trim()

  const styles = `
:root {
  --primary-color: #4a6cf7;
  --secondary-color: #6a7c94;
  --accent-color: #f7c04a;
  --text-color: #333;
  --light-color: #f5f5f5;
  --dark-color: #222;
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  color: var(--text-color);
  line-height: 1.6;
}

header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

nav ul {
  display: flex;
  list-style: none;
}

nav ul li {
  margin-left: 2rem;
}

nav ul li a {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.3s;
}

nav ul li a:hover {
  color: var(--primary-color);
}

main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero {
  text-align: center;
  padding: 4rem 0;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.vision {
  font-size: 1.25rem;
  color: var(--secondary-color);
  max-width: 800px;
  margin: 0 auto 2rem;
}

.cta-button {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #3a5ce5;
}

section {
  margin-bottom: 4rem;
}

section h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.service-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  transition: transform 0.3s, box-shadow 0.3s;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.service-card h3 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.service-card a {
  display: inline-block;
  margin-top: 1rem;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.service-detail {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.service-objective {
  margin-bottom: 1rem;
}

.service-implementation {
  margin-bottom: 1.5rem;
}

.tag {
  display: inline-block;
  background-color: var(--accent-color);
  color: var(--dark-color);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.pricing-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.pricing-card h2 {
  color: var(--primary-color);
  margin-bottom: 1rem;
  text-align: left;
}

.pricing-model {
  margin-bottom: 1.5rem;
}

.pricing-model h3 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.activity-pricing ul, .tiered-pricing ul {
  list-style: none;
  margin-top: 0.5rem;
}

.activity-pricing li, .tiered-pricing li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.goals-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.goal-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.goal-card h3 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.goal-card ul {
  list-style-position: inside;
}

.goal-card li {
  margin-bottom: 0.5rem;
}

footer {
  background-color: var(--light-color);
  text-align: center;
  padding: 2rem;
  margin-top: 4rem;
}

@media (max-width: 768px) {
  nav {
    flex-direction: column;
    padding: 1rem;
  }
  
  nav ul {
    margin-top: 1rem;
  }
  
  nav ul li {
    margin-left: 1rem;
    margin-right: 1rem;
  }
  
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .services-grid, .goals-list {
    grid-template-columns: 1fr;
  }
}
  `.trim()

  return {
    pages: {
      home: homePage,
      services: servicesPage,
      pricing: pricingPage,
      about: aboutPage,
    },
    assets: {
      'styles.css': styles,
    },
    config: {
      theme: 'light',
      navigation: [
        { label: 'Home', path: '/' },
        { label: 'Services', path: '/services' },
        { label: 'Pricing', path: '/pricing' },
        { label: 'About', path: '/about' },
      ],
    },
  }
}
