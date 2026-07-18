// Home Model - Data models for home page
export class HomeModel {
  constructor() {
    this.data = {
      testimonials: [
        {
          quote: "Wilderbots helped us turn a messy manual workflow into a system our team can actually trust every day.",
          name: "Alex R.",
          role: "Operations Lead",
          avatar: "https://i.pravatar.cc/150?img=11"
        },
        {
          quote: "I use the Neureck platform for my university courses. It's the most engaging way to learn complex tech subjects.",
          name: "Sarah K.",
          role: "Computer Science Student",
          avatar: "https://i.pravatar.cc/150?img=5"
        },
        {
          quote: "Wilderbots built our company's mobile app, and the results exceeded our expectations. Flawless execution.",
          name: "David L.",
          role: "CEO, TechStart",
          avatar: "https://i.pravatar.cc/150?img=33"
        }
      ],
      faqs: [
        {
          q: "Do you work with existing business tools?",
          a: "Yes. Wilderbots builds around the systems you already use, including web apps, mobile apps, CRMs, internal dashboards, and AI tooling."
        },
        {
          q: "Can I access Neureck without buying anything else?",
          a: "Absolutely. Neureck is a standalone web platform that can be used independently for learning, training, and curriculum delivery."
        },
        {
          q: "What kind of AI services do you offer?",
          a: "We specialize in custom LLM integration, automated customer service agents, and predictive data modeling for small to medium enterprises."
        },
        {
          q: "Do you ship internationally?",
          a: "Yes, we ship to over 35 countries. Shipping times vary by location but typically range from 5-10 business days."
        }
      ],
      process: [
        {
          step: "01",
          title: "Ideation",
          description: "We start with raw data and wild imagination. Our R&D team analyzes market gaps to conceptualize products that don't just solve problems, but invent new ways of living.",
          icon: "Lightbulb"
        },
        {
          step: "02",
          title: "Engineering",
          description: "Precision is our language. We turn complex business and education requirements into software systems people can actually use."
          icon: "Wrench"
        },
        {
          step: "03",
          title: "Deployment",
          description: "Launch is just the beginning. We iterate on workflows, product experience, and learning modules so each release keeps getting stronger."
          icon: "CheckCircle"
        }
      ]
    }
  }

  getTestimonials() {
    return this.data.testimonials
  }

  getFAQs() {
    return this.data.faqs
  }

  getProcess() {
    return this.data.process
  }
}

