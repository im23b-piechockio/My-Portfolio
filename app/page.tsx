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
  const [mouse, setMouse] = useState<{ x: number, y: number, inside: boolean }>({ x: 0.5, y: 0.5, inside: true })
  const swarmDrift = useRef<{ dx: number, dy: number }>({ dx: (Math.random() - 0.5) * 0.002, dy: (Math.random() - 0.5) * 0.002 });
  const NUM_LEAVES = 300;
  const swarmCenter = useRef<{ x: number, y: number, dx: number, dy: number }>({ x: 0.5, y: 0.5, dx: (Math.random() - 0.5) * 0.001, dy: (Math.random() - 0.5) * 0.001 });
  const leaves = useRef<{ x: number, y: number, vx: number, vy: number, rot: number, rotSpeed: number }[]>([]);

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
    if (canvas) {
      canvas.width = width
      canvas.height = height
    }

    // Init Partikel-Orbits
    if (leaves.current.length !== NUM_LEAVES) {
      leaves.current = Array.from({length: NUM_LEAVES}, () => ({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.01,
        vy: (Math.random() - 0.5) * 0.01,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03
      }));
    }

    // Aurora Wellen
    function drawAurora(t: number) {
      if (!ctx) return;
      for (let i = 0; i < 3; i++) {
        ctx.save()
        ctx.globalAlpha = 0.32 + 0.13 * i
        ctx.beginPath()
        for (let x = 0; x <= width; x += 2) {
          // Maus beeinflusst Amplitude und Phase
          const mx = (mouse.x - 0.5) * 2
          const my = (mouse.y - 0.5) * 2
          const y =
            height / 2 +
            Math.sin((x / (200 + 100 * mx)) + t / (1200 - i * 200) + i + mx) * (80 + 30 * i + 40 * mx) +
            Math.sin((x / (80 + 40 * mx)) + t / (800 + i * 100) + mx) * (30 + 10 * i + 20 * my)
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        const color = i === 0 ? '#93c5fd' : i === 1 ? '#c4b5fd' : '#f9a8d4';
        ctx.strokeStyle = color;
        ctx.lineWidth = 22 - i * 4
        ctx.shadowBlur = 44 - i * 8
        ctx.shadowColor = color;
        ctx.stroke()
        ctx.restore()
      }
    }

    // Partikel
    function drawParticles(t: number) {
      if (!ctx) return;
      // Schwarm-Parameter
      const alignStrength = 0.32;
      const cohesionStrength = 0.03;
      const separationStrength = 0.62;
      const mouseRepelStrength = 0.18;
      const maxSpeed = 0.0010;
      const returnToSwarmStrength = 0.07;
      for (let i = 0; i < NUM_LEAVES; i++) {
        let leaf = leaves.current[i];
        // Alignment: Mittelrichtung der Nachbarn
        let avgVX = 0, avgVY = 0, count = 0;
        // Cohesion: Mittelpunkt der Nachbarn
        let centerX = 0, centerY = 0;
        // Separation: Abstand halten
        let sepX = 0, sepY = 0;
        for (let j = 0; j < NUM_LEAVES; j++) {
          if (i !== j) {
            const other = leaves.current[j];
            const dx = other.x - leaf.x;
            const dy = other.y - leaf.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 0.012) {
              sepX -= (dx) / (dist + 0.01);
              sepY -= (dy) / (dist + 0.01);
            }
            if (dist < 0.045) {
              avgVX += other.vx;
              avgVY += other.vy;
              centerX += other.x;
              centerY += other.y;
              count++;
            }
          }
        }
        if (count > 0) {
          avgVX /= count;
          avgVY /= count;
          centerX /= count;
          centerY /= count;
        } else {
          centerX = leaf.x;
          centerY = leaf.y;
        }
        // Alignment
        leaf.vx += (avgVX - leaf.vx) * alignStrength;
        leaf.vy += (avgVY - leaf.vy) * alignStrength;
        // Cohesion: zum Schwarmzentrum, nicht zu Nachbarn
        leaf.vx += (swarmCenter.current.x - leaf.x) * cohesionStrength;
        leaf.vy += (swarmCenter.current.y - leaf.y) * cohesionStrength;
        // Separation
        leaf.vx += sepX * separationStrength;
        leaf.vy += sepY * separationStrength;
        // Mausabstoßung (Hai)
        const dx = leaf.x - mouse.x;
        const dy = leaf.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (mouse.inside && dist < 0.18) {
          leaf.vx += (dx / (dist + 0.01)) * mouseRepelStrength;
          leaf.vy += (dy / (dist + 0.01)) * mouseRepelStrength;
        }
        // Geschwindigkeit begrenzen
        const speed = Math.sqrt(leaf.vx * leaf.vx + leaf.vy * leaf.vy);
        if (speed > maxSpeed) {
          leaf.vx = (leaf.vx / speed) * maxSpeed;
          leaf.vy = (leaf.vy / speed) * maxSpeed;
        }
        // Bewegung
        leaf.x += leaf.vx;
        leaf.y += leaf.vy;
        // Begrenzung auf Viewport (und Bounce)
        if (leaf.x < 0) { leaf.x = 0; leaf.vx *= -0.7; }
        if (leaf.x > 1) { leaf.x = 1; leaf.vx *= -0.7; }
        if (leaf.y < 0) { leaf.y = 0; leaf.vy *= -0.7; }
        if (leaf.y > 1) { leaf.y = 1; leaf.vy *= -0.7; }
        // Wenn ein Blatt zu weit vom Schwarmzentrum entfernt ist, wird es sanft zurückgezogen
        const distToSwarm = Math.sqrt((leaf.x - swarmCenter.current.x) ** 2 + (leaf.y - swarmCenter.current.y) ** 2);
        if (distToSwarm > 0.12) {
          leaf.vx += (swarmCenter.current.x - leaf.x) * returnToSwarmStrength;
          leaf.vy += (swarmCenter.current.y - leaf.y) * returnToSwarmStrength;
        }
        // Schwarmzentrum driftet immer (auch ohne Maus)
        swarmCenter.current.x += swarmCenter.current.dx;
        swarmCenter.current.y += swarmCenter.current.dy;
        // Bounce an Rändern
        if (swarmCenter.current.x < 0.15 || swarmCenter.current.x > 0.85) swarmCenter.current.dx *= -1;
        if (swarmCenter.current.y < 0.15 || swarmCenter.current.y > 0.85) swarmCenter.current.dy *= -1;
        // Leichte Richtungsänderung
        if (Math.random() < 0.01) {
          swarmCenter.current.dx += (Math.random() - 0.5) * 0.0005;
          swarmCenter.current.dy += (Math.random() - 0.5) * 0.0005;
          // Clamp
          swarmCenter.current.dx = Math.max(-0.0015, Math.min(0.0015, swarmCenter.current.dx));
          swarmCenter.current.dy = Math.max(-0.0015, Math.min(0.0015, swarmCenter.current.dy));
        }
        // Rotation
        leaf.rot += leaf.rotSpeed;
        // Zeichne Sakura-Blatt (vereinfachtes Path)
        const px = leaf.x * width;
        const py = leaf.y * height;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(leaf.rot);
        ctx.scale(0.19, 0.19);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(8, -12, 18, -8, 12, 8);
        ctx.bezierCurveTo(8, 18, -8, 18, -12, 8);
        ctx.bezierCurveTo(-18, -8, -8, -12, 0, 0);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 182, 193, 0.55)'; // Sakura pink
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#f9a8d4';
        ctx.fill();
        ctx.restore();
      }
    }

    function animate(t: number) {
      ctx.clearRect(0, 0, width, height)
      drawAurora(t)
      drawParticles(t)
      animationId = requestAnimationFrame(animate)
    }
    animate(0)

    function handleResize() {
      width = window.innerWidth
      height = window.innerHeight
      if (canvas) {
        canvas.width = width
        canvas.height = height
      }
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [mouse])

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const clamp = (v: number) => Math.max(0, Math.min(1, v));
      setMouse({ x: clamp(e.clientX / window.innerWidth), y: clamp(e.clientY / window.innerHeight), inside: true })
    }
    function handleMouseLeave() {
      setMouse({ x: 0.5, y: 0.5, inside: false });
      // Neue Drift-Richtung, wenn Maus rausgeht
      swarmDrift.current.dx = (Math.random() - 0.5) * 0.002;
      swarmDrift.current.dy = (Math.random() - 0.5) * 0.002;
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
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
          className="flex flex-col items-center text-center w-full max-w-4xl mx-auto relative z-10 p-8 rounded-2xl"
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
        <div className="max-w-6xl mx-auto p-8 rounded-2xl">
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
        <div className="max-w-4xl mx-auto p-8 rounded-2xl">
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
        <div className="max-w-4xl mx-auto p-8 rounded-2xl">
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