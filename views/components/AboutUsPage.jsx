import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Users, Lightbulb, Rocket, Target, Package, Code, BookOpen, Twitter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import PublicPageShell from './PublicPageShell'

function MobileSnapCarousel({ items, activeIndex, setActiveIndex, renderItem }) {
  const containerRef = useRef(null)

  const handleScroll = (event) => {
    const { scrollLeft, clientWidth } = event.currentTarget
    if (!clientWidth) return
    const nextIndex = Math.round(scrollLeft / clientWidth)
    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex)
    }
  }

  const scrollToIndex = (index) => {
    if (!containerRef.current) return
    containerRef.current.scrollTo({
      left: containerRef.current.clientWidth * index,
      behavior: 'smooth'
    })
    setActiveIndex(index)
  }

  return (
    <>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="no-scrollbar -mx-6 flex snap-x snap-mandatory items-stretch overflow-x-auto overflow-y-hidden px-6 touch-pan-x md:hidden"
      >
        {items.map((item, index) => (
          <div key={item.title || item.name || index} className="flex w-full shrink-0 snap-center">
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      {items.length > 1 ? (
        <div className="mt-5 flex items-center justify-center gap-2 md:hidden">
          {items.map((item, index) => (
            <button
              key={`${item.title || item.name || index}-dot`}
              type="button"
              onClick={() => scrollToIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                activeIndex === index ? 'w-6 bg-sky-400' : 'w-2.5 bg-white/20'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      ) : null}
    </>
  )
}

export default function AboutUsPage({ onBack }) {
  const [teamMembers, setTeamMembers] = useState([])
  const [stats, setStats] = useState([
    { value: '2019', label: 'Founded' },
    { value: '50k+', label: 'Kits Shipped' },
    { value: '35', label: 'Countries' }
  ])
  const [loading, setLoading] = useState(true)
  const [pillarsIndex, setPillarsIndex] = useState(0)
  const [valuesIndex, setValuesIndex] = useState(0)
  const [teamIndex, setTeamIndex] = useState(0)

  useEffect(() => {
    fetchTeamMembers()
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.stats && data.stats.length > 0) {
          setStats(data.stats)
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

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
          bio: "Former product engineer at leading tech companies. Passionate about making advanced technology accessible through education.",
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
          bio: "Systems architect with 10+ years across product engineering, platform design, and AI-driven delivery.",
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

  const renderPillarCard = (pillar, index) => {
    const colorClasses = [
      {
        iconBg: 'bg-green-500/10',
        iconBorder: 'border-green-500/20',
        iconHover: 'group-hover:bg-green-500/20',
        iconText: 'text-green-400',
        dot: 'bg-green-500'
      },
      {
        iconBg: 'bg-purple-500/10',
        iconBorder: 'border-purple-500/20',
        iconHover: 'group-hover:bg-purple-500/20',
        iconText: 'text-purple-400',
        dot: 'bg-purple-500'
      },
      {
        iconBg: 'bg-blue-500/10',
        iconBorder: 'border-blue-500/20',
        iconHover: 'group-hover:bg-blue-500/20',
        iconText: 'text-blue-400',
        dot: 'bg-blue-500'
      }
    ][index] || {
      iconBg: 'bg-sky-500/10',
      iconBorder: 'border-sky-500/20',
      iconHover: 'group-hover:bg-sky-500/20',
      iconText: 'text-sky-400',
      dot: 'bg-sky-500'
    }

    return (
      <div className="group mr-5 flex h-full w-full flex-col rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,38,0.88)_0%,rgba(8,11,18,0.96)_100%)] p-8 transition-all hover:border-white/20 md:mr-0">
        <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border ${colorClasses.iconBg} ${colorClasses.iconBorder} ${colorClasses.iconHover} transition-all`}>
          <pillar.icon className={`h-8 w-8 ${colorClasses.iconText}`} />
        </div>
        <h3 className="mb-3 font-serif-custom text-2xl font-normal text-white">{pillar.title}</h3>
        <p className="mb-4 leading-relaxed text-zinc-400">{pillar.description}</p>
        <ul className="space-y-2 text-sm text-zinc-500">
          {pillar.items.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <div className={`h-1.5 w-1.5 rounded-full ${colorClasses.dot}`}></div>
              {item}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const pillars = [
    {
      icon: Package,
      title: 'Digital Products',
      description: 'We design and launch digital products, internal tools, and experience-led platforms that help teams move from concept to rollout with confidence.',
      items: ['Product Strategy & Delivery', 'Platform Architecture', 'Launch & Iteration']
    },
    {
      icon: Code,
      title: 'Service Company',
      description: 'Our IT services division transforms businesses through cutting-edge development. From mobile apps to web platforms, AI solutions to cloud architecture-we deliver enterprise-grade software that scales and performs.',
      items: ['App & Web Development', 'AI & Machine Learning', 'Cloud & DevOps Solutions']
    },
    {
      icon: BookOpen,
      title: 'Ed-Tech Company',
      description: 'Neureck is our educational platform revolutionizing STEM learning. Through interactive AI-driven modules, hands-on projects, and a global community, we\'re making complex technology accessible to learners everywhere.',
      items: ['Interactive Learning Platform', 'AI-Powered Curriculum', 'Global Student Community']
    }
  ]

  return (
    <PublicPageShell
      onBack={onBack}
      eyebrow="About Wilderbots"
      title={
        <>
          Product, service,
          <span className="block bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text italic text-transparent">
            and education in one system
          </span>
        </>
      }
      description="Wilderbots operates across software delivery, AI systems, and learning experiences, with one practical goal: make advanced technology more useful and easier to adopt."
      contentClassName="space-y-8"
    >
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="rounded-[2rem] border border-white/10 bg-zinc-950/35 px-6 py-12 backdrop-blur-xl md:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-2"
            >
              {stats.map((stat, index) => (
                <div key={stat._id || index} className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-zinc-400">{stat.label}</div>
                  </div>
                  {index < stats.length - 1 && (
                    <div className="hidden sm:block w-px h-12 bg-white/10"></div>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <section className="rounded-[2rem] border border-white/10 bg-black/30 px-6 py-16 backdrop-blur-xl md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <h2 className="font-serif-custom text-4xl font-normal text-white md:text-5xl">Our Mission</h2>
              <p className="text-xl leading-relaxed text-zinc-300">
                To bridge the gap between software excellence, applied AI, and educational empowerment.
                We build digital systems, deliver technical services, and create learning experiences that make technology more useful and more understandable.
              </p>
              <p className="text-lg leading-relaxed text-zinc-400">
                Through our service work, we help businesses transform digitally. Through Neureck, we expand access to high-quality STEM education. Three pillars, one mission:
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
              <div className="aspect-video overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-sky-500/15 to-indigo-500/10">
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
      <section className="rounded-[2rem] border border-white/10 bg-zinc-950/35 px-6 py-16 backdrop-blur-xl md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="mb-4 font-serif-custom text-4xl font-normal text-white md:text-5xl">Three Pillars, One Vision</h2>
            <p className="text-xl text-zinc-400">Product. Service. Education. One operating system for useful technology.</p>
          </div>
          <MobileSnapCarousel
            items={pillars}
            activeIndex={pillarsIndex}
            setActiveIndex={setPillarsIndex}
            renderItem={renderPillarCard}
          />
          <div className="hidden gap-8 md:grid md:grid-cols-3">
            {pillars.map((pillar, index) => (
              <div key={pillar.title} className="contents">
                {renderPillarCard(pillar, index)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="rounded-[2rem] border border-white/10 bg-black/30 px-6 py-16 backdrop-blur-xl md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="mb-4 font-serif-custom text-4xl font-normal text-white md:text-5xl">Our Values</h2>
            <p className="text-xl text-zinc-400">The principles that guide everything we do</p>
          </div>
          <MobileSnapCarousel
            items={values}
            activeIndex={valuesIndex}
            setActiveIndex={setValuesIndex}
            renderItem={(value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 2) * 0.1 }}
                className="mr-5 flex h-full w-full flex-col rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,38,0.88)_0%,rgba(8,11,18,0.96)_100%)] p-8 transition-all hover:border-white/20"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10">
                  <value.icon className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="mb-3 font-serif-custom text-2xl font-normal text-white">{value.title}</h3>
                <p className="leading-relaxed text-zinc-400">{value.description}</p>
              </motion.div>
            )}
          />
          <div className="hidden gap-8 md:grid md:grid-cols-2">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 2) * 0.1 }}
                className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,38,0.88)_0%,rgba(8,11,18,0.96)_100%)] p-8 transition-all hover:border-white/20"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10">
                  <value.icon className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="mb-3 font-serif-custom text-2xl font-normal text-white">{value.title}</h3>
                <p className="leading-relaxed text-zinc-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="rounded-[2rem] border border-white/10 bg-zinc-950/35 px-6 py-16 backdrop-blur-xl md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="mb-4 font-serif-custom text-4xl font-normal text-white md:text-5xl">Meet the Team</h2>
            <p className="text-xl text-zinc-400">The people building the next layer of Wilderbots</p>
          </div>
          {loading ? (
            <div className="py-12 text-center text-zinc-400">Loading team members...</div>
          ) : (
            <>
              <MobileSnapCarousel
                items={teamMembers}
                activeIndex={teamIndex}
                setActiveIndex={setTeamIndex}
                renderItem={(member, index) => (
                  <div key={member._id || index} className="group mr-5 flex h-full w-full flex-col rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,38,0.88)_0%,rgba(8,11,18,0.96)_100%)] p-8 transition-all hover:border-white/20">
                    <div className="mb-6 flex flex-1 flex-col items-center text-center">
                      <div className="relative mb-4">
                        <Image
                          src={member.avatar || 'https://i.pravatar.cc/150'}
                          alt={member.name}
                          width={120}
                          height={120}
                          className="h-[120px] w-[120px] rounded-full object-cover"
                          unoptimized
                        />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-0 transition-opacity group-hover:opacity-100"></div>
                      </div>
                      <h3 className="mb-1 text-xl font-semibold text-white">{member.name}</h3>
                      <p className="mb-3 text-sky-300">{member.role}</p>
                      <p className="text-sm leading-relaxed text-zinc-400">{member.bio}</p>
                    </div>
                    <div className="flex items-center justify-center gap-4 border-t border-white/10 pt-4">
                      {member.social?.linkedin && (
                        <a
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
                        >
                          <Linkedin size={18} className="text-gray-400" />
                        </a>
                      )}
                      {member.social?.github && (
                        <a
                          href={member.social.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
                        >
                          <Github size={18} className="text-gray-400" />
                        </a>
                      )}
                      {member.social?.email && (
                        <a
                          href={`mailto:${member.social.email}`}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
                        >
                          <Mail size={18} className="text-gray-400" />
                        </a>
                      )}
                      {member.social?.twitter && (
                        <a
                          href={member.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
                        >
                          <Twitter size={18} className="text-gray-400" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              />
              <div className="hidden gap-8 md:grid md:grid-cols-2 lg:grid-cols-3">
                {teamMembers.map((member, index) => (
                  <div key={member._id || index} className="group rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,38,0.88)_0%,rgba(8,11,18,0.96)_100%)] p-8 transition-all hover:border-white/20">
                    <div className="mb-6 flex flex-col items-center text-center">
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
                      <h3 className="mb-1 text-xl font-semibold text-white">{member.name}</h3>
                      <p className="mb-3 text-sky-300">{member.role}</p>
                      <p className="text-sm leading-relaxed text-zinc-400">{member.bio}</p>
                    </div>
                    <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10">
                      {member.social?.linkedin && (
                        <a 
                          href={member.social.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
                        >
                          <Linkedin size={18} className="text-gray-400" />
                        </a>
                      )}
                      {member.social?.github && (
                        <a 
                          href={member.social.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
                        >
                          <Github size={18} className="text-gray-400" />
                        </a>
                      )}
                      {member.social?.email && (
                        <a 
                          href={`mailto:${member.social.email}`}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
                        >
                          <Mail size={18} className="text-gray-400" />
                        </a>
                      )}
                      {member.social?.twitter && (
                        <a 
                          href={member.social.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
                        >
                          <Twitter size={18} className="text-gray-400" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-[2rem] border border-white/10 bg-black/35 px-6 py-16 text-center backdrop-blur-xl">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-6 font-serif-custom text-4xl font-normal text-white md:text-5xl">Join Our Mission</h2>
          <p className="mb-10 text-xl text-zinc-400">
            We&apos;re always looking for passionate people to join our team. Check out our open positions or reach out if you have an idea.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/careers"
              className="inline-block rounded-full bg-gradient-to-r from-[#2f6df6] to-[#2452d9] px-8 py-4 font-semibold text-white shadow-[0_12px_40px_rgba(37,99,235,0.35)] transition-transform hover:scale-[1.01] text-center"
            >
              View Careers
            </Link>
            <a 
              href="mailto:hello@wilderbots.com"
              className="rounded-full border border-white/15 bg-white/[0.03] px-8 py-4 font-semibold text-white transition-colors hover:bg-white/[0.06]"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </PublicPageShell>
  )
}
