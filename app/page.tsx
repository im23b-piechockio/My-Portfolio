'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaMoon, FaSun, FaArrowUp } from 'react-icons/fa'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

export default function Home() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 100], [0, 1])
  const [darkMode, setDarkMode] = useState(false)
  const [konamiCode, setKonamiCode] = useState('')
  const [showBackToTop, setShowBackToTop] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-dark text-white relative overflow-hidden">
      {/* Professional Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-navy-900" />

      {/* Subtle Pattern Overlay */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Navbar */}
      <motion.nav 
        className="fixed top-0 w-full z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800"
      >
        <div className="container mx-auto px-4 py-4 flex justify-end items-center">
          <div className="flex gap-6">
            {['Start', 'Technologien & Tools', 'Projekte', 'Kontakt'].map((item) => (
              <motion.a
                key={item}
                whileHover={{ scale: 1.1 }}
                href={`#${item.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}
                className="text-white hover:text-blue-400 transition-colors"
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="start" className="container mx-auto px-4 py-20 min-h-screen flex items-center justify-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center w-full max-w-4xl mx-auto relative z-10 bg-gray-900/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-800/50"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative w-48 h-48 mb-8 cursor-pointer"
            onClick={() => {
              const secretMessage = document.createElement('div')
              secretMessage.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600/90 text-white p-6 rounded-xl shadow-2xl z-50 backdrop-blur-sm border border-blue-500/50'
              secretMessage.textContent = 'Willkommen in meinem Portfolio! 👋'
              document.body.appendChild(secretMessage)
              setTimeout(() => secretMessage.remove(), 2000)
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent-blue animate-float" />
            <div className="absolute inset-1 rounded-full overflow-hidden bg-gray-800">
              {/* Placeholder for profile image */}
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Profile Image
              </div>
            </div>
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 text-white">
            Oliver Piechocki
          </h1>
          <h2 className="text-2xl text-blue-400 mb-6">
            Applikationsentwickler EFZ | Frontend Developer
          </h2>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('projekte')}
              className="bg-primary hover:bg-accent-blue text-white px-6 py-3 rounded-lg transition-colors"
            >
              Projekte
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('kontakt')}
              className="border border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-lg transition-colors"
            >
              Kontakt
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section id="technologien-tools" className="container mx-auto px-4 py-20 relative">
        <div className="max-w-6xl mx-auto bg-gray-900/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-800/50">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Technologien & Tools</h2>
          
          {/* Programming Languages */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 text-blue-400 text-center">Programmiersprachen</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'JavaScript', color: '#F7DF1E' },
                { name: 'TypeScript', color: '#3178C6' },
                { name: 'HTML', color: '#E34F26' },
                { name: 'CSS', color: '#1572B6' },
                { name: 'Python', color: '#3776AB' },
                { name: 'Java', color: '#007396' },
                { name: 'SQL', color: '#336791' },
                { name: 'Bash', color: '#4EAA25' }
              ].map((tech) => (
                <motion.div
                  key={tech.name}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gray-800/50 p-4 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-700/50 flex items-center justify-center group"
                >
                  <h3 className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors">{tech.name}</h3>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Frontend Technologies */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 text-blue-400 text-center">Frontend</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'React', color: '#61DAFB' },
                { name: 'Next.js', color: '#000000' },
                { name: 'Tailwind CSS', color: '#06B6D4' },
                { name: 'Bootstrap', color: '#7952B3' },
                { name: 'Vite', color: '#646CFF' }
              ].map((tech) => (
                <motion.div
                  key={tech.name}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gray-800/50 p-4 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-700/50 flex items-center justify-center group"
                >
                  <h3 className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors">{tech.name}</h3>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Backend & Database */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 text-blue-400 text-center">Backend & Datenbanken</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'Node.js', color: '#339933' },
                { name: 'MongoDB', color: '#47A248' },
                { name: 'MySQL', color: '#4479A1' },
                { name: 'REST API', color: '#FF6B6B' },
                { name: 'Docker', color: '#2496ED' },
                { name: 'AWS', color: '#FF9900' }
              ].map((tech) => (
                <motion.div
                  key={tech.name}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gray-800/50 p-4 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-700/50 flex items-center justify-center group"
                >
                  <h3 className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors">{tech.name}</h3>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tools & Others */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-blue-400 text-center">Tools & Sonstiges</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'Git', color: '#F05032' },
                { name: 'GitHub', color: '#181717' },
                { name: 'VS Code', color: '#007ACC' },
                { name: 'Figma', color: '#F24E1E' },
                { name: 'Trello', color: '#0079BF' },
                { name: 'npm', color: '#CB3837' },
                { name: 'ESLint', color: '#4B32C3' }
              ].map((tech) => (
                <motion.div
                  key={tech.name}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gray-800/50 p-4 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-700/50 flex items-center justify-center group"
                >
                  <h3 className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors">{tech.name}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projekte" className="container mx-auto px-4 py-20 relative">
        <div className="max-w-4xl mx-auto bg-gray-900/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-800/50">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Projekte</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Projekt 1',
                description: 'Eine spannende Beschreibung des Projekts',
                technologies: ['React', 'TypeScript', 'Tailwind']
              },
              {
                title: 'Projekt 2',
                description: 'Eine weitere interessante Projektbeschreibung',
                technologies: ['Node.js', 'MongoDB', 'Express']
              }
            ].map((project, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, rotateY: 5 }}
                className="bg-gray-800/50 rounded-lg overflow-hidden shadow-lg border border-gray-700/50"
              >
                <div className="relative h-48 bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400">Project Image</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                  <p className="text-gray-200 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-blue-500/20 rounded-full text-sm text-blue-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontakt" className="container mx-auto px-4 py-20 relative">
        <div className="max-w-4xl mx-auto bg-gray-900/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-800/50">
          <h2 className="text-3xl font-bold mb-8 text-white">Kontakt</h2>
          <div className="flex justify-center gap-6 mb-8">
            <motion.a
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
              href="https://github.com/im23b-piechockio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-gray-200 hover:text-blue-400 transition-colors"
            >
              <FaGithub />
            </motion.a>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="text-2xl text-gray-200 hover:text-blue-400 transition-colors cursor-default"
            >
              <FaEnvelope />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="text-2xl text-gray-200 hover:text-blue-400 transition-colors cursor-default"
            >
              <FaPhone />
            </motion.div>
          </div>
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 mb-4 bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-700/50 text-white placeholder-gray-400"
            />
            <input
              type="email"
              placeholder="E-Mail"
              className="w-full p-3 mb-4 bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-700/50 text-white placeholder-gray-400"
            />
            <textarea
              placeholder="Nachricht"
              rows={4}
              className="w-full p-3 mb-4 bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-700/50 text-white placeholder-gray-400"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors border border-blue-500/50"
            >
              Nachricht senden
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: showBackToTop ? 1 : 0,
          scale: showBackToTop ? 1 : 0.5
        }}
        transition={{ duration: 0.3 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-500/50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaArrowUp className="text-xl" />
      </motion.button>
    </div>
  )
} 