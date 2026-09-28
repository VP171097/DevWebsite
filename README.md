# ⚡ Vivek Pandey — Interactive Developer & Data Engineer Portfolio

[![Live Demo](https://img.shields.io/badge/Live%20Demo-vp171097.github.io%2FDevWebsite-FFB800?style=for-the-badge&logo=googlechrome&logoColor=black)](https://vp171097.github.io/DevWebsite/)
[![React 19](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite%207-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Web3Forms](https://img.shields.io/badge/Web3Forms-Contact_API-059669?style=for-the-badge&logo=fastapi&logoColor=white)](https://web3forms.com/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/VP171097/DevWebsite/actions)

A high-performance, responsive, and glassmorphic developer portfolio built for **Vivek Pandey** (Senior Associate Consultant & Data Engineer at Infosys). Engineered with a **100% dynamic JSON configuration engine**, custom 3D micro-interactions, particle canvas background, and automated CI/CD deployment.

---

## 🌟 Highlights & Key Features

### 1. 🎴 Dynamic JSON-Driven Content Engine
- **Zero-Code Maintenance**: Update your bio, experience, projects, skills, education, certifications, and contact info simply by editing JSON files in [`public/config/`](./public/config/).
- **Dynamic Asset Resolution**: The custom [`ConfigContext`](./src/context/ConfigContext.jsx) automatically detects environment bases (`BASE_URL`) and resolves local asset URLs across both local dev servers and production GitHub Pages builds.

### 2. 🎙️ Interactive Featured Projects Showcase
- **Category Filter Tabs**: Filter projects instantly across **All**, **Data Engineering**, **Full Stack / Tools**, and **AI & Computer Vision**.
- **3D Perspective Tilt**: Project cards track cursor position with subtle 3D perspective rotation and dynamic specular light reflections.
- **Custom Vector Banners**: Hand-crafted high-resolution SVG banners for each showcased repository.
- **Conditional Action Buttons**: Automatically displays **Code Repo** and **Live Demo** buttons only when valid URLs exist in config.

### 3. 🟢 Live Status & 1-Click Clipboard Actions
- **Live Availability Pill**: Animated pulsing indicator (`🟢 Available for Opportunities`) on the sidebar.
- **1-Click Copy**: Hovering over Email, Phone, or Location reveals a 1-click clipboard button with an animated `"Copied! ✓"` confirmation badge.

### 4. 🧭 Floating "Back to Top" with Circular Progress Ring
- Real-time SVG circular progress ring indicating scroll depth on the page.
- Smooth 1-click jump back to the landing hero.

### 5. 📬 Zero-Backend Contact Form (Web3Forms)
- Integrated directly with Web3Forms REST API. Messages are securely delivered to your inbox without requiring Node.js servers, Lambda functions, or external SDK bundles.

### 6. 📱 100% Responsive & Glassmorphism Aesthetics
- MagicCard multi-color gradient border beams.
- Floating glassmorphic social dock.
- Optimized for mobile, tablet, laptop, and ultra-wide 4K viewports.

---

## 📐 Page & Layout Structure

The page flows logically through an engineer's profile:

```
┌────────────────────────────────────────────────────────┐
│  Sticky Header (Logo & Smooth Scroll Navigation)       │
├────────────────────────────────────────────────────────┤
│  Landing Hero (Particles, Ripple, AuroraText, Resume)  │
├───────────────────────┬────────────────────────────────┤
│  Sticky Sidebar       │  Hero Content Sections:        │
│  - Avatar & Pulse     │  1. 👤 About Me & Key Stats    │
│  - Name & Role        │  2. 💼 Professional Experience │
│  - 1-Click Contacts   │  3. 🎓 Education               │
│                       │  4. 🚀 Featured Projects       │
│                       │  5. 🛠️ Technical Skills        │
│                       │  6. 🏆 Certifications & Honors│
├───────────────────────┴────────────────────────────────┤
│  Contact Section (Direct Web3Forms Message Submission) │
├────────────────────────────────────────────────────────┤
│  Footer & Copyright                                    │
└────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```tree
Portfolio/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Automated build & ESLint validation on PRs
│       └── cd.yml                 # Automated deployment to GitHub Pages on main
├── public/
│   ├── assets/
│   │   ├── college/               # University & institute logos
│   │   ├── company/               # Corporate employer logos
│   │   ├── projects/              # Custom SVG project banners
│   │   └── my-avatar.png          # Profile avatar
│   └── config/                    # 📄 Dynamic JSON Data Files
│       ├── about.json             # Bio and 4 key metric counters
│       ├── certifications.json    # Databricks, Azure, Python certs & TCS awards
│       ├── education.json         # Degree & academic timeline
│       ├── experience.json        # Enterprise roles & bullet highlights
│       ├── landing.json           # Hero text & resume download link
│       ├── navigation.json        # Header nav links and scroll targets
│       ├── projects.json          # Featured projects metadata & categories
│       ├── sidebar.json           # Sidebar profile & contact details
│       ├── skills.json            # Categorized skills matrix & icons
│       └── socialLinks.json       # Social profiles (LinkedIn, GitHub, etc.)
├── src/
│   ├── app/
│   │   ├── heroSection/           # Sidebar & Section Container wrapper
│   │   ├── landing/               # Hero landing section & floating social dock
│   │   ├── pages/                 # Individual section components (Projects, About, etc.)
│   │   └── index.jsx              # Main App entry layout
│   ├── components/
│   │   ├── layouts/               # Header, Footer, ContactItem, SocialLink
│   │   ├── magicui/               # MagicCard, Particles, BorderBeam, AuroraText
│   │   └── ui/                    # ScrollToTop, PointerHighlight, Preloader
│   ├── context/
│   │   └── ConfigContext.jsx      # Global JSON configuration context provider
│   ├── index.css                  # Global styles & Tailwind utilities
│   └── main.jsx                   # Vite React root mounting
├── .env.example                   # Environment variable template
├── DEPLOYMENT.md                  # Deployment guide
├── index.html                     # HTML5 template with OpenGraph meta tags
├── package.json                   # Project scripts and dependencies
├── tailwind.config.js             # TailwindCSS configuration
└── vite.config.js                 # Vite build settings & base URL
```

---

## ⚙️ JSON Configuration Guide

You can customize the entire portfolio by editing files in [`public/config/`](./public/config/):

| File | What it controls |
| :--- | :--- |
| **`about.json`** | About me bio, highlighted phrase, and the 4 metric cards (`6+ Years`, `End-to-End`, `Multi-Cloud`, `100%`). |
| **`projects.json`** | List of showcased projects, filter categories, bullet highlights, tech tags, banner image, and GitHub/Live URLs. |
| **`experience.json`** | Companies, roles, durations, employer logos, and bullet accomplishments. |
| **`education.json`** | College name, degree, duration, grade, institution logo, and description. |
| **`certifications.json`** | Professional certifications (Databricks, Azure, etc.) and honors/awards. |
| **`skills.json`** | Categorized skills (Data Engineering, Cloud & Databases, Languages, DevOps & Tools). |
| **`sidebar.json`** | Name, title, status pill text, avatar image, email, phone, and location. |
| **`navigation.json`** | Top navbar items and smooth-scroll anchors. |
| **`socialLinks.json`** | LinkedIn, WhatsApp, Email, and GitHub links for the floating dock. |

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.x or 20.x or 22.x)
- [npm](https://www.npmjs.com/)

### 1. Clone the repository
```bash
git clone https://github.com/VP171097/DevWebsite.git
cd Portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Inside `.env`, add your Web3Forms Access Key:
```env
VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_access_key_here
```

### 4. Start local development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for production & Lint
```bash
# Run ESLint validation
npm run lint

# Build optimized production bundle
npm run build
```

---

## 🚢 CI/CD & Deployment

This project uses **GitHub Actions** for automated continuous integration and continuous deployment:

1. **Continuous Integration (`.github/workflows/ci.yml`)**:
   - Triggered on Pull Requests to `main` and `dev`.
   - Runs ESLint and production build validation across Node.js 18.x, 20.x, and 22.x.
2. **Continuous Deployment (`.github/workflows/cd.yml`)**:
   - Triggered on pushes and merges to the `main` branch.
   - Builds the production bundle with `VITE_WEB3FORMS_ACCESS_KEY` secret and deploys directly to **GitHub Pages**.

---

## 👨‍💻 Author

**Vivek Pandey**  
Senior Associate Consultant & Data Engineer  
- 🌐 **Portfolio**: [vp171097.github.io/DevWebsite](https://vp171097.github.io/DevWebsite/)  
- 🐙 **GitHub**: [@VP171097](https://github.com/VP171097)  
- 💼 **LinkedIn**: [linkedin.com/in/vp171097](https://www.linkedin.com/in/vp171097)  
- 📧 **Email**: [vivekpandey.iimt@gmail.com](mailto:vivekpandey.iimt@gmail.com)  

---

## 📄 License
This project is licensed under the [MIT License](./LICENSE).
