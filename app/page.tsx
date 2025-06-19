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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId: number
    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    // Aurora Wellen
    function drawAurora(t: number) {
      for (let i = 0; i < 3; i++) {
        ctx.save()
        ctx.globalAlpha = 0.18 + 0.08 * i
        ctx.beginPath()
        for (let x = 0; x <= width; x += 2) {
          const y =
            height / 2 +
            Math.sin((x / 200) + t / (1200 - i * 200) + i) * (80 + 30 * i) +
            Math.sin((x / 80) + t / (800 + i * 100)) * (30 + 10 * i) * mouse.y
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        const gradient = ctx.createLinearGradient(0, height / 2, width, height)
        gradient.addColorStop(0, i === 0 ? '#60A5FA' : i === 1 ? '#a78bfa' : '#f472b6')
        gradient.addColorStop(1, 'transparent')
        ctx.strokeStyle = gradient
        ctx.lineWidth = 18 - i * 4
        ctx.shadowBlur = 32 - i * 8
        ctx.shadowColor = gradient
        ctx.stroke()
        ctx.restore()
      }
    }

    // Geometrische 3D-Formen (rotierende Würfel)
    function drawCubes(t: number) {
      for (let i = 0; i < 4; i++) {
        const cx = width * (0.2 + 0.2 * i) + Math.sin(t / 1000 + i) * 40 * mouse.x
        const cy = height * (0.2 + 0.2 * i) + Math.cos(t / 1200 + i) * 40 * mouse.y
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate((t / 1200 + i) * (mouse.x + 0.5))
        ctx.strokeStyle = `rgba(255,255,255,0.13)`
        ctx.lineWidth = 3
        ctx.beginPath()
        for (let j = 0; j < 4; j++) {
          ctx.moveTo(Math.cos(j * Math.PI / 2) * 30, Math.sin(j * Math.PI / 2) * 30)
          ctx.lineTo(Math.cos(((j + 1) % 4) * Math.PI / 2) * 30, Math.sin(((j + 1) % 4) * Math.PI / 2) * 30)
        }
        ctx.stroke()
        ctx.restore()
      }
    }

    // Partikel
    function drawParticles(t: number) {
      for (let i = 0; i < 60; i++) {
        const angle = (i * Math.PI * 2) / 60 + (t / 3000) * (i % 2 === 0 ? 1 : -1)
        const r = 120 + 80 * Math.sin(t / (900 + i * 10))
        const x = width / 2 + Math.cos(angle) * r * mouse.x
        const y = height / 2 + Math.sin(angle) * r * mouse.y
        ctx.save()
        ctx.beginPath()
        ctx.arc(x, y, 2 + Math.sin(t / (400 + i * 5)) * 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,0.18)`
        ctx.shadowBlur = 8
        ctx.shadowColor = '#60A5FA'
        ctx.fill()
        ctx.restore()
      }
    }

    function animate(t: number) {
      ctx.clearRect(0, 0, width, height)
      drawAurora(t)
      drawCubes(t)
      drawParticles(t)
      animationId = requestAnimationFrame(animate)
    }
    animate(0)

    function handleResize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [mouse])

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-dark text-white relative overflow-hidden">
      {/* Special Animated Aurora/3D/Particles Background */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }} />

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
                { name: 'Bootstrap', color: '#7952B3' }
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
                { name: 'npm', color: '#CB3837' }
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