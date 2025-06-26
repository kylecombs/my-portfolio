import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Projects - Kyle Combs" },
    { name: "description", content: "Software engineering projects by Kyle Combs - scalable web applications, membership systems, and Web3 platforms" },
  ];
};

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: "Scalable Membership Platform",
      description: "Architected and built a comprehensive membership system supporting 6,000+ users with integrated payment processing, automated renewal workflows, and admin dashboard. Improved conversion rates by 12% through A/B testing and data-driven optimization.",
      technologies: ["Ruby on Rails", "React", "PostgreSQL", "Stripe API", "Redis", "Sidekiq"],
      company: "Camp",
      year: "2023-Present",
      achievements: [
        "6,000+ active users",
        "12% conversion rate increase",
        "Automated renewal workflows",
        "Payment processing integration"
      ],
      imageGradient: "from-blue-400 to-purple-500"
    },
    {
      id: 2,
      title: "Web3 Asset Management Platform",
      description: "Designed and implemented a scalable Web3 asset management platform using React and Node.js, enabling non-technical users to deploy decentralized applications. Streamlined authentication systems for seamless Web3 ecosystem integration.",
      technologies: ["React", "Node.js", "TypeScript", "Web3.js", "Ethereum", "MongoDB"],
      company: "Arx Research",
      year: "2023",
      achievements: [
        "Scalable Web3 platform",
        "Non-technical user focus",
        "Seamless authentication",
        "dApp deployment tools"
      ],
      imageGradient: "from-green-400 to-blue-500"
    },
    {
      id: 3,
      title: "Travel Itinerary Marketplace",
      description: "Engineered a dynamic platform empowering content creators to create and sell travel itineraries. Reduced cart abandonment by 10% through strategic frontend optimizations and improved analytics accuracy by 20% with enhanced data pipeline architecture.",
      technologies: ["React", "Node.js", "Express", "PostgreSQL", "Stripe", "Google Analytics"],
      company: "Rexby",
      year: "2022-2023",
      achievements: [
        "10% reduction in cart abandonment",
        "20% improvement in analytics accuracy",
        "Creator monetization platform",
        "Comprehensive test automation"
      ],
      imageGradient: "from-yellow-400 to-orange-500"
    },
    {
      id: 4,
      title: "Accessibility-First CMS Integration",
      description: "Led cross-functional integration of React frontend with Contentful CMS, empowering non-technical teams to manage content independently. Championed accessibility initiatives, improving WCAG compliance from 68% to 92%.",
      technologies: ["React", "Contentful", "TypeScript", "Tailwind CSS", "WCAG", "Jest"],
      company: "Camp",
      year: "2023-Present",
      achievements: [
        "WCAG compliance: 68% → 92%",
        "Contentful CMS integration",
        "Non-technical team empowerment",
        "Accessibility-first design"
      ],
      imageGradient: "from-purple-400 to-pink-500"
    },
    {
      id: 5,
      title: "Custom Shopify Admin App",
      description: "Developed a custom Shopify Admin app to streamline administrative workflows and improve operational efficiency. Integrated with existing Rails backend and implemented real-time data synchronization.",
      technologies: ["React", "Shopify Admin API", "Ruby on Rails", "GraphQL", "Polaris", "Webhook"],
      company: "Camp",
      year: "2023-Present",
      achievements: [
        "Streamlined admin workflows",
        "Real-time data sync",
        "Shopify Admin integration",
        "Operational efficiency boost"
      ],
      imageGradient: "from-indigo-400 to-cyan-500"
    },
    {
      id: 6,
      title: "Test Automation Framework",
      description: "Developed comprehensive test automation framework using Cypress and Jest, establishing robust quality assurance practices across development cycles. Improved code coverage and reduced manual testing time by 60%.",
      technologies: ["Cypress", "Jest", "TypeScript", "CI/CD", "GitHub Actions", "Storybook"],
      company: "Rexby",
      year: "2022-2023",
      achievements: [
        "60% reduction in manual testing",
        "Comprehensive test coverage",
        "CI/CD integration",
        "Quality assurance framework"
      ],
      imageGradient: "from-teal-400 to-blue-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <a href="/" className="text-xl font-bold text-dark-green dark:text-white">
              Kyle Combs
            </a>
            <div className="hidden md:flex space-x-8">
              <a href="/#about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">About</a>
              <a href="/projects" className="text-blue-600 dark:text-blue-400 font-medium">Projects</a>
              <a href="/#experience" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Experience</a>
              <a href="/#contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Projects Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-dark-green dark:text-white mb-6">
              My Projects
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              A showcase of software engineering projects spanning scalable web applications, 
              membership platforms, Web3 development, and accessibility-focused solutions 
              that have driven real business impact.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
                <div className={`h-32 bg-gradient-to-br ${project.imageGradient} relative`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-sm font-medium">{project.year}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-dark-green dark:text-white">{project.title}</h3>
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">{project.company}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  
                  {/* Key Achievements */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-dark-green dark:text-white mb-2">Key Achievements:</h4>
                    <ul className="grid grid-cols-2 gap-1 text-xs text-gray-600 dark:text-gray-300">
                      {project.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-green-500 mr-1">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Impact Summary */}
          <div className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-center text-dark-green dark:text-white mb-8">Project Impact Summary</h2>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">6,000+</div>
                <div className="text-gray-600 dark:text-gray-300">Users Supported</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">12%</div>
                <div className="text-gray-600 dark:text-gray-300">Conversion Increase</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">92%</div>
                <div className="text-gray-600 dark:text-gray-300">WCAG Compliance</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">60%</div>
                <div className="text-gray-600 dark:text-gray-300">Testing Time Saved</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Interested in learning more about these projects or discussing potential collaboration?
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="/#contact" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                Get In Touch
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors inline-flex items-center"
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            © 2024 Kyle Combs. Built with Remix and TypeScript.
          </p>
        </div>
      </footer>
    </div>
  );
} 