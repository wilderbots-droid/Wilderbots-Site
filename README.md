# Wilderbots Site

A Next.js website for Wilderbots - Pioneering wearable tech and interactive education.

## Project Structure

This project follows an MVC (Model-View-Controller) architecture:

```
/
├── pages/              # Next.js pages (routes)
│   ├── _app.jsx       # App wrapper with global styles
│   └── index.jsx      # Home page
├── views/             # View components (UI)
│   └── components/    # Reusable React components
├── controllers/       # Business logic controllers
├── models/           # Data models
├── styles/           # Global styles
└── server.js         # Custom Next.js server
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Build the production version:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Features

- **Next.js 14** - React framework with server-side rendering
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Custom Server** - Express-like server setup via server.js
- **MVC Architecture** - Organized code structure
- **Responsive Design** - Mobile-first approach
- **Interactive Components** - 3D tilt effects, animations, and more

## Components

All UI components are located in `views/components/`:
- Navigation
- Hero
- Marquee
- ProductSection
- ProcessSection
- StatsSection
- EducationSection
- ServicesSection
- FAQSection
- TestimonialsSection
- NewsletterSection
- Footer

## License

© 2024 Wilderbots Inc. All rights reserved.


