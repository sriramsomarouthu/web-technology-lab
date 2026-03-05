require("dotenv").config();
const { MongoClient } = require("mongodb");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME   = process.env.DB_NAME   || "book_finder_db";

const books = [
  { title: "JavaScript Essentials",       author: "John Smith",      category: "Programming",  price: 450,  rating: 4.5, year: 2023 },
  { title: "Advanced JavaScript",         author: "Sara Lee",        category: "Programming",  price: 599,  rating: 4.8, year: 2022 },
  { title: "Python for Beginners",        author: "Mark Allen",      category: "Programming",  price: 350,  rating: 4.2, year: 2023 },
  { title: "Data Structures & Algorithms",author: "Emily Chen",      category: "Programming",  price: 720,  rating: 4.9, year: 2021 },
  { title: "MongoDB in Practice",         author: "Chris Brown",     category: "Database",     price: 480,  rating: 4.6, year: 2023 },
  { title: "SQL Mastery",                 author: "Anna White",      category: "Database",     price: 390,  rating: 4.1, year: 2022 },
  { title: "NoSQL Design Patterns",       author: "David Park",      category: "Database",     price: 520,  rating: 4.4, year: 2023 },
  { title: "Redis in Action",             author: "Lucy Turner",     category: "Database",     price: 410,  rating: 3.9, year: 2021 },
  { title: "React Fundamentals",          author: "James Wilson",    category: "Web Dev",      price: 430,  rating: 4.7, year: 2023 },
  { title: "Full Stack with Node.js",     author: "Maria Garcia",    category: "Web Dev",      price: 650,  rating: 4.5, year: 2022 },
  { title: "CSS Grid & Flexbox",          author: "Tom Harris",      category: "Web Dev",      price: 280,  rating: 4.0, year: 2023 },
  { title: "TypeScript Deep Dive",        author: "Sophie Adams",    category: "Web Dev",      price: 510,  rating: 4.6, year: 2022 },
  { title: "Machine Learning Basics",     author: "Robert King",     category: "AI & ML",      price: 800,  rating: 4.8, year: 2023 },
  { title: "Deep Learning with Python",   author: "Nina Patel",      category: "AI & ML",      price: 950,  rating: 4.9, year: 2023 },
  { title: "Natural Language Processing", author: "Oscar Ruiz",      category: "AI & ML",      price: 870,  rating: 4.7, year: 2022 },
  { title: "Neural Networks Explained",   author: "Elena Frost",     category: "AI & ML",      price: 760,  rating: 4.3, year: 2021 },
  { title: "Linux Command Line",          author: "Paul Nguyen",     category: "DevOps",       price: 320,  rating: 4.2, year: 2022 },
  { title: "Docker & Kubernetes",         author: "Grace Liu",       category: "DevOps",       price: 580,  rating: 4.5, year: 2023 },
  { title: "CI/CD Pipelines",             author: "Ben Carter",      category: "DevOps",       price: 490,  rating: 4.1, year: 2023 },
  { title: "Cloud Architecture Patterns", author: "Iris Thompson",   category: "DevOps",       price: 690,  rating: 4.6, year: 2022 },
  { title: "Clean Code",                  author: "Robert Martin",   category: "Software Eng", price: 400,  rating: 4.9, year: 2020 },
  { title: "The Pragmatic Programmer",    author: "Andrew Hunt",     category: "Software Eng", price: 450,  rating: 4.8, year: 2019 },
  { title: "Design Patterns",             author: "Gang of Four",    category: "Software Eng", price: 530,  rating: 4.7, year: 2018 },
  { title: "System Design Interview",     author: "Alex Wu",         category: "Software Eng", price: 620,  rating: 4.6, year: 2023 },
  { title: "Cybersecurity Fundamentals",  author: "Daniel Morgan",   category: "Security",     price: 560,  rating: 4.3, year: 2022 },
  { title: "Ethical Hacking Guide",       author: "Priya Shah",      category: "Security",     price: 640,  rating: 4.5, year: 2023 },
];

async function seed() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    const db = client.db(DB_NAME);
    const col = db.collection("books");

    await col.deleteMany({});
    const result = await col.insertMany(books);
    console.log(`📚 Inserted ${result.insertedCount} books into '${DB_NAME}.books'`);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await client.close();
    console.log("🔒 Connection closed.");
  }
}

seed();