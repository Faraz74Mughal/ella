const lessonSeeds = [
 {
    _id: "63f06445684cd65ce9af1e45",
    title: "Listening: Daily Routine Talk",
    description: "Test and improve your basic vocabulary related to food and drinks using multiple choice, fill-in-the-blank, and matching exercises.",
    level: "beginner",
    category: "listening",
    study_material: {
      material_type: "audio",
      content: "https://upload.wikimedia.org/wikipedia/commons/2/21/En-us-daily_routine.ogg",
    },
    sequence_order: 3,
    is_published: true,
  },
  // ==================== BEGINNER ====================
  {
    _id: "6c307494fdf8432e8ec7b1e8",
    title: "Grammar: Present Simple & Daily Habits",
    description: "Practice the Present Simple tense through various exercises including MCQs, fill in the blanks, and matching to build a strong foundation in daily routines and habits.",
    level: "beginner",
    category: "grammar",
    study_material: {
      material_type: "text",
      content: "I wake up at 7 AM. I eat breakfast and go to school. I play football after school.",
    },
    sequence_order: 1,
    is_published: true,
  },
  {
    _id: "19edebef3bb74fc69257af76",
    title: "Vocabulary: Food and Drinks",
    level: "beginner",
    description: "Listen to a daily routine audio and answer comprehension questions to improve your listening skills.",
    
    category: "grammar",
    study_material: {
      material_type: "text",
      content: "apple, banana, rice, chicken, water, milk, bread, egg, cheese, orange juice",
    },
    sequence_order: 2,
    is_published: true,
  },
  // (original listening already added above)

  {
    _id: "d09e0706c7bb46a582843dbd",
    title: "Speaking: Introduce Yourself", description: "Practice speaking skills by introducing yourself and responding to simple personal questions.",
    
    level: "beginner",
    category: "speaking",
    study_material: {
      material_type: "video",
      content: "https://www.youtube.com/embed/8z8wY8z8z8w", // example embed
    },
    sequence_order: 4,
    is_published: true,
  },
  {
    _id: "8fde6263d7b64fbf8d264d47",
    title: "Writing: My Family",
     description: "Improve your writing skills by writing a short paragraph about your family members.",
   
    level: "beginner",
    category: "writing",
    study_material: {
      material_type: "text",
      content: "Write 5-7 sentences about your family members (names, ages, jobs).",
    },
    sequence_order: 5,
    is_published: true,
  },

  // ==================== INTERMEDIATE ====================
  {
    _id: "f9d24342e3d7406f887bba6f",
    title: "Grammar: Past Simple vs Present Perfect",
    description: "Master the difference between Past Simple and Present Perfect tenses through targeted practice exercises.",
    
    level: "intermediate",
    category: "grammar",
    study_material: {
      material_type: "text",
      content: "I visited Paris last year. / I have visited Paris three times.",
    },
    sequence_order: 6,
    is_published: true,
  },
  {
    _id: "a431fa08545e4590b02fb43f",
    title: "Vocabulary: Business & Work",
     description: "Learn and practice essential business and workplace vocabulary.",
    level: "intermediate",
    category: "grammar",
    study_material: {
      material_type: "text",
      content: "meeting, deadline, colleague, promotion, salary, client, negotiate, presentation",
    },
    sequence_order: 7,
    is_published: true,
  },
  {
    _id: "05cad8b4e0f840fa9f47cf19",
    title: "Listening: Job Interview Conversation",
    description: "Listen to a job interview conversation and test your comprehension.",
    
    level: "intermediate",
    category: "listening",
    study_material: {
      material_type: "audio",
      content: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    sequence_order: 8,
    is_published: true,
  },
  {
    _id: "3e8a7b2ffadd43b38b89bc6f",
    title: "Speaking: Discussing Hobbies & Interests",
    description: "Practice discussing your hobbies and daily interests in English.",
    
    level: "intermediate",
    category: "speaking",
    study_material: {
      material_type: "video",
      content: "https://www.youtube.com/embed/dQw4w9wgxcq", // placeholder
    },
    sequence_order: 9,
    is_published: true,
  },
  {
    _id: "0f126f15a4f94a918ea49a2e",
    title: "Writing: Opinion Essay - Social Media",
    description: "Write a structured opinion essay on the topic of social media.",
   
    level: "intermediate",
    category: "writing",
    study_material: {
      material_type: "text",
      content: "Write an essay (120-180 words): 'Social media does more harm than good.'",
    },
    sequence_order: 10,
    is_published: true,
  },

  // ==================== ADVANCED ====================
  {
    _id: "c7baca408c334163949696e3",
    title: "Grammar: Conditionals & Subjunctives",
    level: "advanced",
    category: "grammar",
    study_material: {
      material_type: "text",
      content: "If I had known earlier, I would have acted differently. (Third Conditional)",
    },
    sequence_order: 11,
    is_published: true,
  },
  {
    _id: "d7eda632a4b84c628f52c138",
    title: "Vocabulary: Environment & Climate Change",
    level: "advanced",
    category: "grammar",
    study_material: {
      material_type: "text",
      content: "sustainable, carbon footprint, renewable energy, deforestation, biodiversity, greenhouse gases",
    },
    sequence_order: 12,
    is_published: true,
  },
  {
    _id: "b2f9fdb1d85c4d0a8cb54db2",
    title: "Listening: TED Talk - The Power of Introverts",
    level: "advanced",
    category: "listening",
    study_material: {
      material_type: "audio",
      content: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    },
    sequence_order: 13,
    is_published: true,
  },
  {
    _id: "9321a7f3296f4e01bf86ff14",
    title: "Speaking: Debate - Artificial Intelligence",
    level: "advanced",
    category: "speaking",
    study_material: {
      material_type: "video",
      content: "https://www.youtube.com/embed/7f0f8z8z8z8", // example
    },
    sequence_order: 14,
    is_published: true,
  },
  {
    _id: "9fde7ec16d8049d794e1803c",
    title: "Writing: Formal Email - Job Application",
    level: "advanced",
    category: "writing",
    study_material: {
      material_type: "text",
      content: "Write a formal cover letter (200+ words) applying for a marketing manager position.",
    },
    sequence_order: 15,
    is_published: true,
  },
];

export default lessonSeeds;
