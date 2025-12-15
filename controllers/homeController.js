// Home Controller - Business logic for home page
export class HomeController {
  static getHomeData() {
    return {
      title: 'Wilderbots - Wilder than Imagination',
      description: 'Pioneering the next generation of wearable tech and interactive education.',
      stats: {
        users: '50k+',
        partners: '120+',
        countries: '35',
        uptime: '99.9%'
      }
    }
  }

  static getProductData() {
    return {
      name: 'Wilder Watch',
      tagline: 'Engineering perfection on your wrist.',
      features: [
        {
          title: 'Vital Tracking',
          description: 'Advanced biosensors monitor your heart rate, oxygen, and stress levels 24/7.',
          icon: 'Activity'
        },
        {
          title: 'Neural Chipset',
          description: 'Powered by our custom W1 silicon. Faster processing, longer battery life, and AI-driven insights right on your wrist.',
          icon: 'Cpu'
        },
        {
          title: 'Seamless Connectivity',
          description: 'Instantly sync with your ecosystem. Control your home, your car, and your digital life with a single tap.',
          icon: 'Zap'
        }
      ]
    }
  }

  static getServicesData() {
    return [
      {
        title: 'App Development',
        description: 'Native and cross-platform mobile experiences that feel fluid, intuitive, and engaging.',
        icon: 'Smartphone',
        features: ['iOS & Android', 'React Native / Flutter', 'High-Performance UI']
      },
      {
        title: 'Web Development',
        description: 'Futuristic, responsive, and scalable web platforms.',
        icon: 'Globe',
        features: ['MERN Stack', 'Next.js & 3D WebGL', 'Scalable Cloud Arch']
      },
      {
        title: 'AI Solutions',
        description: 'Integrating intelligence into your workflow.',
        icon: 'Bot',
        features: ['Generative AI Models', 'Chatbots & Agents', 'Data Analytics']
      }
    ]
  }
}


