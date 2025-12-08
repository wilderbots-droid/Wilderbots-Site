// Home Model - Data models for home page
export class HomeModel {
  constructor() {
    this.data = {
      testimonials: [
        {
          quote: "The Wilder Watch is a game-changer for my training. The data accuracy is incredible, and it looks stunning.",
          name: "Alex R.",
          role: "Pro Athlete",
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
          q: "Is the Wilder Watch compatible with iOS and Android?",
          a: "Yes, the Wilder Watch connects seamlessly via Bluetooth 5.3 to both ecosystems, offering full functionality across devices."
        },
        {
          q: "Can I access Neureck courses without the watch?",
          a: "Absolutely. Neureck is a standalone web platform accessible from any browser, though owning a Wilder Watch unlocks exclusive biometric learning data."
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
          description: "Precision is our language. Using advanced prototyping and titanium milling, we craft hardware that feels indestructible yet invisible on the wrist.",
          icon: "Wrench"
        },
        {
          step: "03",
          title: "Deployment",
          description: "Shipping is just the beginning. We continuously update our firmware and educational modules via OTA updates, keeping your tech fresher than the day you bought it.",
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

