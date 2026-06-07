
<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=180&section=header&text=ARTJIYA&fontSize=64&fontColor=fff&animation=twinkling&fontAlignY=40&desc=Where%20Talent%20Meets%20Opportunity&descAlignY=62&descSize=18" />

[![LinkedIn](https://img.shields.io/badge/Follow%20on%20LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/artjiya)
[![Domain](https://img.shields.io/badge/artjiya.xyz-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://artjiya.xyz)
![Status](https://img.shields.io/badge/Status-In%20Development-6E40C9?style=for-the-badge)
![Contributors](https://img.shields.io/github/contributors/yashrajpurohit7/artjiya?style=for-the-badge&color=6E40C9)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

## What is ARTJIYA?

ARTJIYA is a full-stack community platform designed for artists — a space where talent meets real opportunity.

Most artists struggle not because of lack of skill, but lack of visibility. There is no structured way for artists to be discovered, compete, learn from verified creators, or grow professionally. ARTJIYA is built to fix that.

**Core offering:**
- 🎨 **Art Contests** — Competitive showcases where artists can enter, get judged, and win recognition
- 🎓 **Verified Courses** — Curated courses by verified YouTube creators in the art space
- 🤝 **Community** — A structured space for artists to connect, collaborate, and grow

---

## Tech Stack

**Frontend**

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)

**Backend**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)

**Database & Storage**

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-00E5BF?style=flat-square&logo=neon&logoColor=black)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)

**Security & Validation**

![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

**Deployment**

![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render&logoColor=black)

---

## Architecture

```
artjiya/
├── client/          # React + TypeScript + Tailwind (Vite)
├── server/          # Node.js + Express + TypeScript
├── shared/          # Shared types and utilities
└── README.md
```

**Key engineering decisions:**
- **Monorepo structure** — shared types between frontend and backend eliminate drift
- **HttpOnly cookies** — secure session management, no localStorage tokens
- **Parameterized queries** — SQL injection prevention at the database layer
- **Zod validation** — runtime type-safe request validation on every endpoint
- **CORS restriction** — locked to production domain only
- **Rate limiting** — API abuse prevention from day one

---

## Roadmap

- [x] Project architecture and monorepo setup
- [x] Backend scaffolding — Express + TypeScript + security middleware
- [x] Frontend scaffolding — React + TypeScript + Tailwind
- [ ] Google OAuth + HttpOnly cookie auth
- [ ] User profiles for artists
- [ ] Art contest submission system
- [ ] Course integration with verified creators
- [ ] Community features
- [ ] Production deployment at artjiya.xyz

---

## Contributing

ARTJIYA is being built in public and will be fully open to community contributions. Whether you're fixing a bug, improving documentation, suggesting a feature, or building something entirely new — all contributions are welcome.

### Getting started

```bash
# Fork the repository
# Clone your fork
git clone https://github.com/YOUR_USERNAME/artjiya.git
cd artjiya

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your values in .env

# Start development servers
npm run dev
```

### How to contribute

**1. Find something to work on**
- Check [open issues](https://github.com/yashrajpurohit7/artjiya/issues) for tasks labelled `good first issue` or `help wanted`
- Have an idea? Open an issue first and discuss it before building

**2. Create a branch**
```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

**3. Make your changes**
- Write clean, readable code
- Follow the existing TypeScript patterns in the codebase
- Add comments where logic isn't immediately obvious

**4. Commit with a clear message**
```bash
git commit -m "feat: add contest submission form"
git commit -m "fix: resolve auth token expiry bug"
git commit -m "docs: update setup instructions"
```

**5. Open a Pull Request**
- Give your PR a clear title and description
- Reference the issue it closes: `Closes #42`
- A maintainer will review and give feedback within 48 hours

### Contribution areas

| Area | Description | Skills needed |
|:---|:---|:---|
| 🎨 **Frontend** | React components, UI/UX improvements | React, TypeScript, Tailwind |
| ⚙️ **Backend** | API endpoints, business logic | Node.js, Express, TypeScript |
| 🗄️ **Database** | Schema design, query optimization | PostgreSQL, SQL |
| 📖 **Docs** | README, guides, code comments | Writing, Markdown |
| 🐛 **Bug fixes** | Identify and fix issues | Any |
| 🧪 **Testing** | Unit and integration tests | Jest, testing principles |

### Code of conduct

We are committed to building a welcoming, inclusive community. Be respectful in all interactions. Harassment, discrimination, or toxic behaviour of any kind will not be tolerated. Full code of conduct will be published at launch.

---

## Built by

**Yashwant Singh** — Co-founder & Full Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-yashrajpurohit7-181717?style=flat-square&logo=github)](https://github.com/yashrajpurohit7)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-yashwantsingh7-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/yashwantsingh7)

---

> ARTJIYA is in active development. Star ⭐ the repo to follow the journey.

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=80&section=footer" />
READMEEOF





