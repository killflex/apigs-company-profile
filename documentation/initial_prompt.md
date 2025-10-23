# APIGS Company Profile - Initial Development Prompt

**GitHub Copilot**, I need your assistance to transform our existing single-page APIGS company profile into a comprehensive **Multipurpose Business Platform**. This is a strategic transformation project based on our detailed PRD requirements.

## 🏢 Company Context: APIGS Indonesia

**Company**: APIGS (Advanced Programming & Information Gateway Solutions)
**Industry**: IT Solutions & Software Development
**Services**: Software Development, IT Consulting, AI/ML Development, Data Analytics
**Current Platform**: Single-page Next.js company profile with modern animations

## 🎯 Project Transformation Goals

Transform from **single-page showcase** → **full business platform** serving:

1. **🎨 Branding & Credibility**: Professional image and trust building
2. **💼 Sales Support**: Portfolio showcase driving lead generation
3. **🚀 Recruitment**: Talent acquisition and career management
4. **📚 Content Hub**: Thought leadership through blogs and resources

## 💻 Current Technology Stack (Preserve & Extend)

### Frontend (Keep Current Setup)

```json
{
  "next": "15.5.4",
  "react": "19.1.1",
  "typescript": "5.9.2",
  "tailwindcss": "4.1.13",
  "motion": "12.23.22",
  "@radix-ui/*": "latest",
  "lucide-react": "0.544.0",
  "lenis": "1.3.11"
}
```

### New Backend Stack (Add)

- **Database**: PostgreSQL hosted on Neon
- **ORM**: Drizzle ORM for type-safe operations
- **Authentication**: Clerk for user management
- **Email**: Resend for notifications

### Existing Assets to Preserve

- Modern smooth animations (Motion/Framer Motion)
- Current UI components (Radix UI + custom components)
- Responsive design and dark/light theme
- Performance optimizations and smooth scrolling with Lenis
- Brand identity and visual aesthetics

## 🗂️ Current Project Structure Analysis

```
apigs-company-profile/
├── app/
│   ├── globals.css
│   ├── layout.tsx (root layout with theme)
│   └── page.tsx (single homepage)
├── components/
│   ├── ui/ (Radix UI components)
│   ├── magicui/ (border-beam effects)
│   ├── utils/ (smooth-scroll)
│   ├── hero-section.tsx
│   ├── hero5-header.tsx (navigation)
│   ├── features-12.tsx (services accordion)
│   ├── stats.tsx
│   ├── team.tsx
│   ├── testimonials.tsx
│   ├── call-to-action.tsx
│   ├── footer.tsx
│   ├── logo.tsx
│   ├── mode-toggle.tsx (theme switcher)
│   └── theme-provider.tsx
├── lib/
│   └── utils.ts (shadcn utils)
├── public/ (brand assets)
└── config files
```

## 🏗️ Platform Architecture Target

### Multi-Page Structure (Transform To)

```
/ (Enhanced Homepage)
├── /about (Company story, mission, values)
├── /services/
│   ├── /software-development
│   ├── /it-consulting
│   ├── /ai-ml-development
│   └── /data-analytics
├── /portfolio/
│   ├── /[category] (filtered views)
│   └── /[project-slug] (detailed case studies)
├── /team (Enhanced team profiles)
├── /careers/
│   ├── / (job listings)
│   ├── /[job-slug] (job details)
│   └── /apply/[job-id] (application form)
├── /blog/
│   ├── /[category] (tech, insights, updates)
│   └── /[post-slug] (articles)
├── /contact (Enhanced contact system)
└── /admin/ (Dashboard)
    ├── /portfolio (project management)
    ├── /blog (content management)
    ├── /jobs (recruitment management)
    ├── /inquiries (lead management)
    └── /analytics (business insights)
```

## �️ Database Schema Requirements

### Core Tables Needed:

```sql
-- User Management (extend Clerk)
user_profiles (id, clerk_user_id, role, bio, avatar_url)

-- Content Management
projects (id, title, slug, description, content, technologies, client_name)
blog_posts (id, title, slug, content, category, author_id, status)
categories (id, name, type) -- for both blog and portfolio

-- Business Operations
job_postings (id, title, description, requirements, salary_range, status)
job_applications (id, job_id, applicant_info, resume_url, status)
inquiries (id, name, email, company, message, inquiry_type, status)

-- Analytics & Tracking
analytics_events (id, event_type, event_data, user_id, session_id)
newsletter_subscriptions (id, email, status, subscribed_at)
```

## 🎨 Design System Preservation

### Keep Existing Visual Identity:

- **Colors**: Current brand palette and dark/light theme
- **Typography**: Poppins font family (already configured)
- **Animations**: Smooth Motion/Framer Motion transitions
- **Components**: Current Radix UI + custom component library
- **Layout**: Responsive grid system and spacing
- **Performance**: Maintain fast loading and smooth scrolling

### Enhance With:

- **Accessibility**: WCAG 2.1 AA compliance
- **SEO**: Meta tags, structured data, sitemaps
- **Performance**: Core Web Vitals optimization
- **Security**: Input validation, rate limiting

## 📋 Development Phases

### Phase 1: Foundation Setup (Weeks 1-3)

**Infrastructure & Core Setup**

```bash
# Database & ORM Setup
- Install and configure Drizzle ORM
- Set up Neon PostgreSQL connection
- Create database schemas and migrations
- Set up environment variables

# Authentication System
- Install and configure Clerk
- Set up user roles and permissions
- Create authentication middleware
- Implement protected routes

# Enhanced Routing
- Convert to multi-page architecture
- Set up dynamic routing for content
- Implement proper SEO meta tags
- Create reusable layout components
```

### Phase 2: Content Management System (Weeks 4-6)

**Portfolio & Blog Infrastructure**

```bash
# Portfolio System
- Create project CRUD operations
- Implement image upload with Cloudinary
- Add technology tagging and categorization
- Build project detail pages with case studies
- Add search and filtering functionality

# Blog System
- Set up rich text editor (Tiptap)
- Create blog post management interface
- Implement category and tag system
- Add SEO optimization features
- Build public blog pages with pagination

# Admin Dashboard
- Create admin layout and navigation
- Build content management interfaces
- Add analytics and reporting views
- Implement bulk operations
```

### Phase 3: Recruitment Platform (Weeks 7-9)

**Career Portal & Application System**

```bash
# Job Management
- Create job posting CRUD operations
- Build application form system
- Implement resume upload and parsing
- Set up email notification system
- Create applicant tracking dashboard

# Public Career Pages
- Design job listing with search/filter
- Build individual job detail pages
- Create application submission flow
- Add company culture content
- Implement benefits information display
```

### Phase 4: Enhanced Features (Weeks 10-12)

**Search, Analytics & User Experience**

```bash
# Search & Discovery
- Implement global site search
- Add advanced filtering systems
- Create recommendation engine
- Optimize search performance

# Analytics & Insights
- Set up Vercel Analytics
- Create custom event tracking
- Build analytics dashboard
- Implement performance monitoring

# User Experience Enhancements
- Mobile optimization refinements
- Accessibility improvements
- Performance optimizations
- Social media integration
```

### Phase 5: Testing & Launch (Weeks 13-14)

**Quality Assurance & Deployment**

```bash
# Testing & QA
- Comprehensive testing (unit, integration, e2e)
- Performance optimization and monitoring
- Security audit and vulnerability assessment
- Content migration and data seeding

# Launch Preparation
- Production environment configuration
- CDN optimization and caching
- Monitoring and alerting setup
- Documentation and team training
```

## 🎯 Success Metrics & KPIs

### Technical Performance

- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Uptime**: 99.9% availability target
- **Performance Score**: 90+ Lighthouse score
- **SEO Score**: 95+ technical SEO audit score

### Business Goals (3-month targets)

- **Lead Generation**: 25+ qualified inquiries per month
- **Content Engagement**: 1000+ monthly unique visitors
- **Recruitment**: 10+ quality job applications per posting
- **Brand Authority**: Top 3 ranking for target keywords

### User Experience

- **Session Duration**: 3+ minutes average
- **Bounce Rate**: <40% across all pages
- **Application Completion**: 80%+ job application completion rate
- **Content Shares**: 15+ social shares per blog post

## 🔧 Development Guidelines

### Code Quality Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Enforce code consistency and best practices
- **Testing**: 80%+ test coverage for critical features
- **Performance**: Bundle size optimization and code splitting
- **Security**: Input validation, SQL injection prevention

### SEO & Accessibility

- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Meta Tags**: Dynamic, page-specific meta descriptions
- **Structured Data**: JSON-LD for projects, articles, job postings
- **Image Optimization**: Alt text, proper sizing, lazy loading
- **Keyboard Navigation**: Full keyboard accessibility

### Content Strategy

- **Blog Content**: 2-3 technical posts per week
- **Portfolio Updates**: Monthly project case study additions
- **Job Postings**: Regular posting with detailed descriptions
- **SEO Content**: Target Indonesian market with local keywords

## 🚀 Implementation Priority

### Immediate Next Steps:

1. **Database Setup**: Configure Neon PostgreSQL + Drizzle ORM
2. **Authentication**: Integrate Clerk with role-based access
3. **Routing**: Convert single-page to multi-page architecture
4. **Admin Dashboard**: Basic CMS for content management
5. **Portfolio System**: Transform current features section

### Critical Success Factors:

- **Preserve Current Design**: Maintain smooth animations and modern aesthetic
- **Performance First**: Ensure no regression in loading speed
- **Mobile Experience**: Optimize for mobile-first user experience
- **SEO Foundation**: Implement proper technical SEO from start
- **Content Migration**: Smooth transition of existing content

## 📞 Support & Collaboration

**Please help me with:**

- Setting up the database schemas and migrations
- Converting the single-page app to multi-page architecture
- Implementing the admin dashboard for content management
- Creating the portfolio and blog systems
- Setting up authentication and user roles
- Optimizing for performance and SEO

**I'll provide:**

- Design feedback and brand guideline adherence
- Content creation and copywriting
- Testing and quality assurance
- Business requirements clarification
- User acceptance testing

Let's build an amazing multipurpose platform that showcases APIGS as a leading technology partner while driving business growth through lead generation, recruitment, and thought leadership! 🚀

- App Router setup with proper layout
- Navigation component with smooth transitions
- Homepage with hero section
- About, Services, Portfolio, Blog, Careers, Contact pages

### Phase 2 - Core Features

4. **Blog System**

   - Blog post CRUD with rich text editor
   - Category management
   - SEO optimization for each post
   - Admin dashboard for content management

5. **Portfolio Showcase**

   - Project gallery with filtering
   - Individual project detail pages
   - Admin interface for project management
   - Image upload and optimization

6. **Contact & Lead Management**
   - Multiple contact forms
   - Lead tracking dashboard
   - Email notifications
   - CRM integration ready

### Phase 3 - Advanced Features

7. **Recruitment Portal**

   - Job listing management
   - Application tracking system
   - Career page with company culture
   - Application form with file upload

8. **Admin Dashboard**
   - Analytics overview
   - Content management interface
   - User role management
   - Performance monitoring

## 🎯 Immediate Tasks

Untuk memulai, saya ingin Anda membantu saya dengan:

1. **Project Initialization**

   ```bash
   # Setup command yang optimal untuk Next.js 15 + Turbopack
   # Dengan konfigurasi TypeScript, Tailwind, dan folder structure yang proper
   ```

2. **Environment Setup**

   - `.env` template dengan semua environment variables yang dibutuhkan
   - `package.json` dengan dependencies yang optimal
   - Configuration files (next.config.js, tailwind.config.js, drizzle.config.ts)

3. **Database Schema Definition**

   - Drizzle schema files untuk semua entities
   - Database migration setup
   - Type definitions untuk database operations

4. **Authentication Setup**

   - Clerk integration dengan Next.js 15
   - Middleware setup untuk route protection
   - User role management system

5. **Basic Component Architecture**
   - Layout components (Header, Footer, Navigation)
   - Reusable UI components dengan Shadcn/ui
   - Animation components dengan Framer Motion

## 💼 Working Style Preferences

- **Code Quality**: Prioritaskan clean code, type safety, dan best practices
- **Performance**: Optimasi untuk Core Web Vitals dan loading speed
- **Scalability**: Architecture yang mudah di-maintain dan extend
- **Documentation**: Berikan komentar untuk logic yang kompleks
- **Testing**: Suggest testing approach untuk setiap feature

## 📁 Existing Codebase

Saya memiliki existing single-page company profile berdasarkan codebase folder projek ini

- Sudah ada design system dan animations yang bagus
- Perlu dipertahankan aesthetic dan smooth animations yang ada
- Akan di-migrate ke struktur yang lebih scalable

## 🚀 Success Criteria

- 90+ Lighthouse performance score
- Type-safe codebase dengan minimal any types
- Responsive design untuk semua screen sizes
- Smooth page transitions dan micro-interactions
- SEO-optimized dengan proper meta tags
- Secure dengan proper authentication dan authorization

## ❓ Questions for You

1. Bagaimana setup optimal untuk Next.js 15 + Turbopack dengan tech stack ini?
2. Struktur folder yang recommended untuk project scale ini?
3. Best practices untuk Drizzle + Neon integration?
4. Approach terbaik untuk maintain existing animations saat migration?
5. Security considerations yang harus diperhatikan dari awal?

**Bisakah kita mulai dengan project initialization dan setup foundation yang solid? Saya siap untuk mengikuti step-by-step guidance dari Anda untuk membangun platform ini secara sistematis.**

---

_Note: Saya akan memberikan feedback dan requirements tambahan seiring berjalannya development. Mari kita buat platform company profile yang luar biasa! 🚀_
