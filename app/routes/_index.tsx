import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Kyle Combs - Software Engineer" },
    { name: "description", content: "Senior Software Engineer with 3+ years experience building scalable web applications. Expert in Ruby on Rails and React with proven ability to drive business growth." },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-transparent dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-xl font-bold text-dark-green dark:text-white">
              Kyle Combs
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">About</a>
              <a href="/projects" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Projects</a>
              <a href="#experience" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Experience</a>
              <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-dark-green dark:text-white mb-6">
              Kyle Combs
            </h1>
            <h2 className="text-2xl sm:text-3xl font-medium text-blue-600 dark:text-blue-400 mb-6">
              Senior Software Engineer
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto">
              3+ years experience building scalable web applications serving thousands of users. 
              Expert in Ruby on Rails and React with proven ability to drive business growth through 
              data-driven development and A/B testing.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="/projects" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                View Projects
              </a>
              <a href="#contact" className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Get In Touch
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-dark-green dark:text-white mb-12">About Me</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                I&apos;m a Senior Software Engineer passionate about creating accessible, user-centered products 
                that make a meaningful impact on people&apos;s lives. I thrive in cross-functional collaboration 
                and enjoy mentoring teammates while delivering elegant solutions in fast-paced, remote-first environments.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                My experience spans full-stack development with a focus on scalable web applications, 
                payment systems, and data-driven optimization. I&apos;ve successfully driven business growth 
                through A/B testing and championed accessibility initiatives to ensure inclusive experiences for all users.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Ruby on Rails', 'React', 'TypeScript', 'JavaScript', 'Node.js', 'PostgreSQL', 
                  'GraphQL', 'Redis', 'Python', 'Next.js', 'Remix', 'MongoDB'
                ].map((tech) => (
                  <span key={tech} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-dark-green dark:text-white mb-4">Key Achievements</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-3 mt-1">📈</span>
                  Drove 12% increase in conversion rates through A/B testing
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-3 mt-1">♿</span>
                  Improved WCAG compliance from 68% to 92%
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-3 mt-1">👥</span>
                  Built membership system supporting 6,000+ users
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-3 mt-1">🛒</span>
                  Reduced cart abandonment by 10%
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-dark-green dark:text-white mb-12">Experience</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              
              {/* Camp */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-blue-600">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-dark-green dark:text-white">Software Engineer</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">Camp</p>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Jan 2023 - Present</span>
                </div>
                <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                  <li>• Collaborate with cross-functional teams to enhance features, boosting user engagement and conversion across platforms</li>
                  <li>• Architect scalable membership system supporting 6,000+ users with integrated payment processing and automated renewal workflows</li>
                  <li>• Drive 12% increase in conversion rates through A/B testing implementation and data-driven optimization</li>
                  <li>• Champion accessibility initiatives, improving WCAG compliance from 68% to 92%</li>
                  <li>• Lead cross-functional integration of React frontend with Contentful CMS</li>
                </ul>
              </div>

              {/* Arx Research */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-green-600">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-dark-green dark:text-white">Software Engineer</h3>
                    <p className="text-green-600 dark:text-green-400 font-medium">Arx Research</p>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Mar 2023 - Jul 2023</span>
                </div>
                <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                  <li>• Designed and implemented scalable Web3 asset management platform using React and Node.js</li>
                  <li>• Streamlined authentication systems enabling seamless user authentication within Web3 ecosystems</li>
                  <li>• Collaborated in agile environment to deliver key features for early-stage products</li>
                </ul>
              </div>

              {/* Rexby */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-purple-600">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-dark-green dark:text-white">Software Engineer</h3>
                    <p className="text-purple-600 dark:text-purple-400 font-medium">Rexby</p>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Mar 2022 - Jan 2023</span>
                </div>
                <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                  <li>• Engineered dynamic platform empowering content creators to create and sell travel itineraries</li>
                  <li>• Reduced cart abandonment by 10% through strategic frontend optimizations and checkout flow improvements</li>
                  <li>• Improved analytics accuracy by 20% through enhanced data pipeline architecture</li>
                  <li>• Developed comprehensive test automation framework using Cypress and Jest</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-dark-green dark:text-white mb-12">Technical Skills</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-dark-green dark:text-white mb-4">Frontend</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'JavaScript', 'Next.js', 'Remix', 'HTML5', 'CSS3', 'Tailwind'].map((skill) => (
                  <span key={skill} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-dark-green dark:text-white mb-4">Backend</h3>
              <div className="flex flex-wrap gap-2">
                {['Ruby on Rails', 'Node.js', 'Express', 'Python', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis'].map((skill) => (
                  <span key={skill} className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-dark-green dark:text-white mb-4">Tools & Testing</h3>
              <div className="flex flex-wrap gap-2">
                {['Git', 'Cypress', 'Jest', 'Storybook', 'GA4', 'Google Tag Manager', 'Shopify APIs'].map((skill) => (
                  <span key={skill} className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-dark-green dark:text-white mb-12">Education</h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-dark-green dark:text-white mb-2">Certificate in Software Engineering</h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">Fullstack Academy of Code</p>
              <p className="text-gray-600 dark:text-gray-300">Intensive full-stack development program covering modern web technologies and software engineering practices.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-dark-green dark:text-white mb-2">BFA in Studio Art</h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">University of Oklahoma</p>
              <p className="text-gray-600 dark:text-gray-300">Bachelor of Fine Arts with a minor in Art History, fostering creative problem-solving and design thinking skills.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-dark-green dark:text-white mb-12">Get In Touch</h2>
          <div className="max-w-lg mx-auto text-center">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              I&apos;m always interested in new opportunities and collaborations. 
              Let&apos;s connect and discuss how we can work together!
            </p>
            <div className="flex justify-center space-x-6">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-2">
                <span>LinkedIn</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-2">
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            © 2024 Kyle Combs. Built with Remix and TypeScript.
          </p>
        </div>
      </footer>
    </div>
  );
}
