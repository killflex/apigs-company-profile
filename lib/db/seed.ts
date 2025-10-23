import { db } from "./index";
import { categories, projects, teamMembers } from "./schema";

async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await db.delete(projects);
    await db.delete(categories);
    await db.delete(teamMembers);

    // Seed Categories
    console.log("📂 Seeding categories...");
    const categoriesData = await db
      .insert(categories)
      .values([
        {
          name: "Software Development",
          slug: "software-development",
          description:
            "Custom software solutions tailored to your business needs",
          type: "portfolio",
          color: "#3B82F6",
          sortOrder: 1,
          isActive: true,
        },
        {
          name: "AI & Machine Learning",
          slug: "ai-ml",
          description: "Intelligent systems powered by artificial intelligence",
          type: "portfolio",
          color: "#8B5CF6",
          sortOrder: 2,
          isActive: true,
        },
        {
          name: "Data Analytics",
          slug: "data-analytics",
          description: "Transform data into actionable business insights",
          type: "portfolio",
          color: "#10B981",
          sortOrder: 3,
          isActive: true,
        },
        {
          name: "IT Consulting",
          slug: "it-consulting",
          description: "Strategic technology consulting and guidance",
          type: "portfolio",
          color: "#F59E0B",
          sortOrder: 4,
          isActive: true,
        },
      ])
      .returning();

    console.log(`✅ Created ${categoriesData.length} categories`);

    // Seed Projects
    console.log("💼 Seeding projects...");
    const projectsData = await db
      .insert(projects)
      .values([
        {
          title: "E-Commerce Platform",
          slug: "e-commerce-platform",
          description:
            "A modern, scalable e-commerce solution with real-time inventory management and seamless payment integration.",
          image: "/soft-dev.jpg",
          technologies: [
            "Next.js",
            "TypeScript",
            "PostgreSQL",
            "Stripe",
            "Tailwind CSS",
          ],
          categoryId: categoriesData[0].id, // Software Development
          sortOrder: 1,
          isActive: true,
        },
        {
          title: "Healthcare Management System",
          slug: "healthcare-management-system",
          description:
            "Comprehensive patient management system with appointment scheduling, medical records, and billing integration.",
          image: "/soft-dev.jpg",
          technologies: ["React", "Node.js", "MongoDB", "Express", "Socket.io"],
          categoryId: categoriesData[0].id, // Software Development
          sortOrder: 2,
          isActive: true,
        },
        {
          title: "AI-Powered Chatbot",
          slug: "ai-powered-chatbot",
          description:
            "Intelligent customer service chatbot using natural language processing to provide 24/7 automated support.",
          image: "/ai-dev.jpg",
          technologies: [
            "Python",
            "TensorFlow",
            "FastAPI",
            "OpenAI GPT",
            "Redis",
          ],
          categoryId: categoriesData[1].id, // AI & ML
          sortOrder: 3,
          isActive: true,
        },
        {
          title: "Predictive Analytics Engine",
          slug: "predictive-analytics-engine",
          description:
            "Machine learning model for sales forecasting and demand prediction with 95% accuracy rate.",
          image: "/ai-dev.jpg",
          technologies: [
            "Python",
            "scikit-learn",
            "Pandas",
            "Docker",
            "AWS SageMaker",
          ],
          categoryId: categoriesData[1].id, // AI & ML
          sortOrder: 4,
          isActive: true,
        },
        {
          title: "Business Intelligence Dashboard",
          slug: "business-intelligence-dashboard",
          description:
            "Real-time analytics dashboard providing comprehensive business metrics and KPI tracking.",
          image: "/data-dev.jpg",
          technologies: [
            "Power BI",
            "Python",
            "SQL Server",
            "Azure",
            "Apache Spark",
          ],
          categoryId: categoriesData[2].id, // Data Analytics
          sortOrder: 5,
          isActive: true,
        },
        {
          title: "Customer Behavior Analysis",
          slug: "customer-behavior-analysis",
          description:
            "Deep dive into customer patterns and behaviors to optimize marketing strategies and increase conversion.",
          image: "/data-dev.jpg",
          technologies: ["R", "Tableau", "Python", "BigQuery", "Looker"],
          categoryId: categoriesData[2].id, // Data Analytics
          sortOrder: 6,
          isActive: true,
        },
        {
          title: "Cloud Migration Strategy",
          slug: "cloud-migration-strategy",
          description:
            "Seamless migration of legacy systems to cloud infrastructure with zero downtime and improved performance.",
          image: "/consult.jpg",
          technologies: ["AWS", "Azure", "Terraform", "Kubernetes", "Docker"],
          categoryId: categoriesData[3].id, // IT Consulting
          sortOrder: 7,
          isActive: true,
        },
        {
          title: "Digital Transformation Consulting",
          slug: "digital-transformation-consulting",
          description:
            "End-to-end digital transformation strategy and implementation for enterprise modernization.",
          image: "/consult.jpg",
          technologies: [
            "Agile",
            "DevOps",
            "Microservices",
            "CI/CD",
            "Cloud Native",
          ],
          categoryId: categoriesData[3].id, // IT Consulting
          sortOrder: 8,
          isActive: true,
        },
      ])
      .returning();

    console.log(`✅ Created ${projectsData.length} projects`);

    // Seed Team Members
    console.log("👥 Seeding team members...");
    const teamMembersData = await db
      .insert(teamMembers)
      .values([
        {
          firstName: "John",
          lastName: "Smith",
          displayName: "John Smith",
          jobTitle: "Founder & CEO",
          department: "Executive",
          avatarUrl: "https://i.pravatar.cc/300?img=12",
          avatarSecureUrl: "https://i.pravatar.cc/300?img=12",
          email: "john.smith@apigs.com",
          linkedinUrl: "https://linkedin.com/in/johnsmith",
          githubUrl: "https://github.com/johnsmith",
          instagramUrl: "https://instagram.com/johnsmith",
          isActive: true,
          isPublic: true,
          sortOrder: 1,
        },
        {
          firstName: "Sarah",
          lastName: "Johnson",
          displayName: "Sarah Johnson",
          jobTitle: "Chief Technology Officer",
          department: "Engineering",
          avatarUrl: "https://i.pravatar.cc/300?img=47",
          avatarSecureUrl: "https://i.pravatar.cc/300?img=47",
          email: "sarah.johnson@apigs.com",
          linkedinUrl: "https://linkedin.com/in/sarahjohnson",
          githubUrl: "https://github.com/sarahjohnson",
          isActive: true,
          isPublic: true,
          sortOrder: 2,
        },
        {
          firstName: "Michael",
          lastName: "Chen",
          displayName: "Michael Chen",
          jobTitle: "Lead Software Engineer",
          department: "Engineering",
          avatarUrl: "https://i.pravatar.cc/300?img=33",
          avatarSecureUrl: "https://i.pravatar.cc/300?img=33",
          email: "michael.chen@apigs.com",
          linkedinUrl: "https://linkedin.com/in/michaelchen",
          githubUrl: "https://github.com/michaelchen",
          twitterUrl: "https://twitter.com/michaelchen",
          isActive: true,
          isPublic: true,
          sortOrder: 3,
        },
        {
          firstName: "Emily",
          lastName: "Rodriguez",
          displayName: "Emily Rodriguez",
          jobTitle: "Senior Data Scientist",
          department: "Data Analytics",
          avatarUrl: "https://i.pravatar.cc/300?img=45",
          avatarSecureUrl: "https://i.pravatar.cc/300?img=45",
          email: "emily.rodriguez@apigs.com",
          linkedinUrl: "https://linkedin.com/in/emilyrodriguez",
          githubUrl: "https://github.com/emilyrodriguez",
          isActive: true,
          isPublic: true,
          sortOrder: 4,
        },
        {
          firstName: "David",
          lastName: "Kim",
          displayName: "David Kim",
          jobTitle: "AI/ML Specialist",
          department: "Engineering",
          avatarUrl: "https://i.pravatar.cc/300?img=68",
          avatarSecureUrl: "https://i.pravatar.cc/300?img=68",
          email: "david.kim@apigs.com",
          linkedinUrl: "https://linkedin.com/in/davidkim",
          githubUrl: "https://github.com/davidkim",
          websiteUrl: "https://davidkim.dev",
          isActive: true,
          isPublic: true,
          sortOrder: 5,
        },
        {
          firstName: "Jessica",
          lastName: "Williams",
          displayName: "Jessica Williams",
          jobTitle: "UX/UI Designer",
          department: "Design",
          avatarUrl: "https://i.pravatar.cc/300?img=48",
          avatarSecureUrl: "https://i.pravatar.cc/300?img=48",
          email: "jessica.williams@apigs.com",
          linkedinUrl: "https://linkedin.com/in/jessicawilliams",
          instagramUrl: "https://instagram.com/jessicawilliams",
          websiteUrl: "https://jessicawilliams.design",
          isActive: true,
          isPublic: true,
          sortOrder: 6,
        },
        {
          firstName: "Robert",
          lastName: "Brown",
          displayName: "Robert Brown",
          jobTitle: "DevOps Engineer",
          department: "Engineering",
          avatarUrl: "https://i.pravatar.cc/300?img=59",
          avatarSecureUrl: "https://i.pravatar.cc/300?img=59",
          email: "robert.brown@apigs.com",
          linkedinUrl: "https://linkedin.com/in/robertbrown",
          githubUrl: "https://github.com/robertbrown",
          isActive: true,
          isPublic: true,
          sortOrder: 7,
        },
        {
          firstName: "Amanda",
          lastName: "Garcia",
          displayName: "Amanda Garcia",
          jobTitle: "Project Manager",
          department: "Operations",
          avatarUrl: "https://i.pravatar.cc/300?img=44",
          avatarSecureUrl: "https://i.pravatar.cc/300?img=44",
          email: "amanda.garcia@apigs.com",
          linkedinUrl: "https://linkedin.com/in/amandagarcia",
          isActive: true,
          isPublic: true,
          sortOrder: 8,
        },
      ])
      .returning();

    console.log(`✅ Created ${teamMembersData.length} team members`);

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("-----------------------------------");
    console.log(`📂 Categories: ${categoriesData.length}`);
    console.log(`💼 Projects: ${projectsData.length}`);
    console.log(`👥 Team Members: ${teamMembersData.length}`);
    console.log("-----------------------------------");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run the seed function
seed()
  .catch((error) => {
    console.error("Fatal error during seeding:", error);
    process.exit(1);
  })
  .then(() => {
    console.log("✅ Seeding process completed");
    process.exit(0);
  });
