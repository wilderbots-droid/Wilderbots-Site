import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Github, Linkedin, Mail, Globe, Users, Lightbulb, Rocket, Target, Package, Code, BookOpen, Twitter } from 'lucide-react'
import Image from 'next/image'
import Logo from './Logo'

export default function AboutUsPage({ onBack }) {
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team')
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data.teamMembers || [])
      }
    } catch (error) {
      console.error('Error fetching team members:', error)
      // Fallback to default team members
      setTeamMembers([
        {
          name: "Alex Chen",
          role: "CEO & Co-Founder",
          bio: "Former hardware engineer at leading tech companies. Passionate about making technology accessible through education.",
          avatar: "https://i.pravatar.cc/150?img=12",
          social: {
            linkedin: "https://linkedin.com",
            github: "https://github.com",
            email: "alex@wilderbots.com"
          }
        },
        {
          name: "Sarah Martinez",
          role: "CTO & Co-Founder",
          bio: "Embedded systems expert with 10+ years in wearable tech. Led development of the W1 chip architecture.",
          avatar: "https://i.pravatar.cc/150?img=5",
          social: {
            linkedin: "https://linkedin.com",
            github: "https://github.com",
            email: "sarah@wilderbots.com"
          }
        },
        {
          name: "David Kim",
          role: "Head of Education",
          bio: "Former university professor turned ed-tech innovator. Created the Neureck platform to revolutionize STEM learning.",
          avatar: "https://i.pravatar.cc/150?img=33",
          social: {
            linkedin: "https://linkedin.com",
            github: "https://github.com",
            email: "david@wilderbots.com"
          }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const values = [
    {
      icon: Lightbulb,
      title: "Innovation First",
      description: "We push boundaries and challenge conventions to create technology that doesn't just exist—it transforms."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Our community of makers, students, and researchers shapes every product we build and every decision we make."
    },
    {
      icon: Rocket,
      title: "Education Focused",
      description: "We believe technology is most powerful when it's understood. Education isn't a side project—it's our mission."
    },
    {
      icon: Target,
      title: "Open Source",
      description: "Transparency and collaboration drive innovation. Our code, designs, and knowledge are open for all to learn and build upon."
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-white/10 p-6 flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur-md z-50">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Back
        </button>
        <div className="flex items-center gap-2">
          <Logo size={35} showText={false} />
          <span className="font-bold">About Wilderbots</span>
        </div>
        <div className="w-16"></div>
      </div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative py-24 px-6 overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold leading-tight"
            >
              Product. Service. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Education.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-xl text-gray-300 leading-relaxed"
            >
              Wilderbots is a unique company operating at the intersection of hardware, software, and education. 
              We design and manufacture cutting-edge wearable technology, provide comprehensive IT services, and revolutionize 
              STEM education through our Neureck platform. We&apos;re not just a company—we&apos;re a movement empowering the next generation of innovators.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center gap-8 pt-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white">2019</div>
                <div className="text-sm text-gray-400">Founded</div>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50k+</div>
                <div className="text-sm text-gray-400">Kits Shipped</div>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">35</div>
                <div className="text-sm text-gray-400">Countries</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <section className="py-24 px-6 bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold">Our Mission</h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                To bridge the gap between hardware innovation, software excellence, and educational empowerment. 
                We're a product company building revolutionary wearables, a service company delivering cutting-edge IT solutions, 
                and an ed-tech company transforming how the world learns technology.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                Through our Wilder Watch Dev Kit, we make hardware accessible. Through our IT services, we help businesses 
                transform digitally. Through Neureck, we revolutionize STEM education. Three pillars, one mission: 
                empowering innovators everywhere.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative"
            >
              <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-3xl overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
                  alt="Team Collaboration" 
                  fill
                  className="object-cover opacity-80"
                  unoptimized
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="py-24 px-6 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Three Pillars, One Vision</h2>
            <p className="text-xl text-gray-400">Product. Service. Education. We excel in all three.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-neutral-900 rounded-3xl p-8 border border-white/10 hover:border-green-500/50 transition-all group">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 border border-green-500/20 group-hover:bg-green-500/20 transition-all">
                <Package className="text-green-400 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Product Company</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                We design, manufacture, and ship the Wilder Watch Dev Kit—a modular, hackable wearable that empowers makers worldwide. 
                Every component is carefully engineered, every kit is quality-assured, and every shipment is a step toward democratizing hardware.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Hardware Design & Manufacturing
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Open-Source Firmware
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Global Distribution
                </li>
              </ul>
            </div>

            <div className="bg-neutral-900 rounded-3xl p-8 border border-white/10 hover:border-purple-500/50 transition-all group">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20 group-hover:bg-purple-500/20 transition-all">
                <Code className="text-purple-400 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Service Company</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Our IT services division transforms businesses through cutting-edge development. From mobile apps to web platforms, 
                AI solutions to cloud architecture—we deliver enterprise-grade software that scales and performs.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  App & Web Development
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  AI & Machine Learning
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  Cloud & DevOps Solutions
                </li>
              </ul>
            </div>

            <div className="bg-neutral-900 rounded-3xl p-8 border border-white/10 hover:border-blue-500/50 transition-all group">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
                <BookOpen className="text-blue-400 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Ed-Tech Company</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Neureck is our educational platform revolutionizing STEM learning. Through interactive AI-driven modules, 
                hands-on projects, and a global community, we're making complex technology accessible to learners everywhere.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Interactive Learning Platform
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  AI-Powered Curriculum
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Global Student Community
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-6 bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-gray-400">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 2) * 0.1 }}
                className="bg-neutral-900 rounded-3xl p-8 border border-white/10 hover:border-purple-500/50 transition-all"
              >
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20">
                  <value.icon className="text-purple-400 w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6 bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Meet the Team</h2>
            <p className="text-xl text-gray-400">The passionate people building the future</p>
          </div>
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading team members...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={member._id || index} className="bg-black rounded-3xl p-8 border border-white/10 hover:border-purple-500/50 transition-all group">
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="relative mb-4">
                      <Image 
                        src={member.avatar || 'https://i.pravatar.cc/150'} 
                        alt={member.name} 
                        width={120}
                        height={120}
                        className="w-[120px] h-[120px] rounded-full object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-purple-400 font-semibold mb-3">{member.role}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">{member.bio}</p>
                  </div>
                  <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10">
                    {member.social?.linkedin && (
                      <a 
                        href={member.social.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <Linkedin size={18} className="text-gray-400" />
                      </a>
                    )}
                    {member.social?.github && (
                      <a 
                        href={member.social.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <Github size={18} className="text-gray-400" />
                      </a>
                    )}
                    {member.social?.email && (
                      <a 
                        href={`mailto:${member.social.email}`}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <Mail size={18} className="text-gray-400" />
                      </a>
                    )}
                    {member.social?.twitter && (
                      <a 
                        href={member.social.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <Twitter size={18} className="text-gray-400" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-black border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl text-gray-400 mb-10">
            We're always looking for passionate people to join our team. Check out our open positions or reach out if you have an idea.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/careers"
              className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all inline-block text-center"
            >
              View Careers
            </a>
            <a 
              href="mailto:hello@wilderbots.com"
              className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

