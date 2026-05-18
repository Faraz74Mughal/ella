import { Types } from "mongoose";

export const exerciseSeeds = [
  {
    lesson_id: "6c307494fdf8432e8ec7b1e8",
    title: "Present Simple Tense - Practice",
    level: "beginner",
    description: "Practice the Present Simple tense through various exercises including MCQs, fill in the blanks, and matching to build a strong foundation in daily routines and habits.",
    category: "grammar",
    created_by: "69f06445684cd65ce9af1e45",
    visibility: "public",
    assigned_to_students: [],
    content: [
      { id: "q1", type: "mcq", question: "She ___ to school every day.", options: ["go", "goes", "going", "gone"], correctAnswer: "goes", points: 2 },
      { id: "q2", type: "fill_blank", question: "I ___ breakfast at 8 AM.", correctAnswer: "eat", points: 2 },
      { id: "q3", type: "mcq", question: "They ___ football on weekends.", options: ["play", "plays", "playing", "played"], correctAnswer: "play", points: 2 },
      { id: "q4", type: "fill_blank", question: "He ___ not like coffee.", correctAnswer: "does", points: 2 },
      { id: "q5", type: "matching", pairs: [
          { id: "m1", left: "I", right: "wake up early" },
          { id: "m2", left: "She", right: "goes to school" },
          { id: "m3", left: "We", right: "watch TV" },
          { id: "m4", left: "He", right: "plays cricket" }
        ], points: 4 },
      { id: "q6", type: "mcq", question: "The sun ___ in the east.", options: ["rise", "rises", "rising", "rose"], correctAnswer: "rises", points: 2 },
      { id: "q7", type: "fill_blank", question: "My brother ___ in Lahore.", correctAnswer: "lives", points: 2 },
      { id: "q8", type: "mcq", question: "___ you speak English?", options: ["Do", "Does", "Did", "Are"], correctAnswer: "Do", points: 2 },
      { id: "q9", type: "fill_blank", question: "Cats ___ milk.", correctAnswer: "drink", points: 2 },
      { id: "q10", type: "mcq", question: "Water ___ at 100°C.", options: ["boil", "boils", "boiling", "boiled"], correctAnswer: "boils", points: 2 }
    ],
    points: 22,
    passing_percentage: 70,
  },

  // 2. Beginner Vocabulary
  {
    lesson_id: "19edebef3bb74fc69257af76",
    title: "Food and Drinks Vocabulary Quiz",
    description: "Test and improve your basic vocabulary related to food and drinks using multiple choice, fill-in-the-blank, and matching exercises.",
    level: "beginner",
    category: "vocabulary",
    created_by: "69f06445684cd65ce9af1e45",
    visibility: "public",
    assigned_to_students: [],
    content: [
      { id: "v1", type: "mcq", question: "What is an 'apple'?", options: ["Fruit", "Vegetable", "Meat", "Drink"], correctAnswer: "Fruit", points: 2 },
      { id: "v2", type: "fill_blank", question: "I drink ___ juice in the morning.", correctAnswer: "orange", points: 2 },
      { id: "v3", type: "matching", pairs: [
          { id: "mv1", left: "Bread", right: "Food" },
          { id: "mv2", left: "Milk", right: "Drink" },
          { id: "mv3", left: "Chicken", right: "Food" },
          { id: "mv4", left: "Water", right: "Drink" }
        ], points: 4 }
    ],
    points: 8,
    passing_percentage: 70,
  },

  // 3. Beginner Listening
  {
    lesson_id: "63f06445684cd65ce9af1e45",
    title: "Daily Routine - Listening Comprehension",
    description: "Listen to a daily routine audio and answer comprehension questions to improve your listening skills.",
    level: "beginner",
    category: "listening",
    created_by: "69f06445684cd65ce9af1e45",
    visibility: "public",
    assigned_to_students: [],
    content: [{
      id: "l1",
      type: "listening",
      file: "https://upload.wikimedia.org/wikipedia/commons/2/21/En-us-daily_routine.ogg",
      transcript: "I wake up at seven o'clock. Then I brush my teeth and take a shower. I eat eggs and bread for breakfast.",
      points: 12,
      comprehensionQuestions: [
        { id: "lq1", type: "mcq", question: "What time does the speaker wake up?", options: ["6 AM", "7 AM", "8 AM", "9 AM"], correctAnswer: "7 AM", points: 3 },
        { id: "lq2", type: "true_false", question: "The speaker takes a shower before brushing teeth.", correctAnswer: false, points: 3 },
        { id: "lq3", type: "fill_blank", question: "The speaker eats ___ for breakfast.", correctAnswer: "eggs", points: 3 },
        { id: "lq4", type: "true_false", question: "The speaker eats rice for breakfast.", correctAnswer: false, points: 3 }
      ]
    }],
    points: 12,
    passing_percentage: 70,
  },

  // 4. Beginner Speaking
  {
    lesson_id: "d09e0706c7bb46a582843dbd",
    title: "Speaking - Self Introduction",
    description: "Practice speaking skills by introducing yourself and responding to simple personal questions.",
    level: "beginner",
    category: "speaking",
    created_by: "69f06445684cd65ce9af1e45",
    visibility: "public",
    assigned_to_students: [],
    content: [
      { id: "s1", type: "follow_up", question: "Tell me about yourself.", points: 6, expectedAnswer: "My name is ... I am ... years old. I live in ..." },
      { id: "s2", type: "dialogue", question: "How are you today?", speaker: "Teacher", expectedAnswer: "I am fine / I am good / I am great", alternative: "I'm okay", points: 5 },
      { id: "s3", type: "follow_up", question: "What do you like to do in your free time?", points: 6, expectedAnswer: "I like to play / watch / read / listen" }
    ],
    points: 17,
    passing_percentage: 70,
  },

  // 5. Beginner Writing
  {
    lesson_id: "8fde6263d7b64fbf8d264d47",
    title: "Writing - My Family",
    description: "Improve your writing skills by writing a short paragraph about your family members.",
    level: "beginner",
    category: "writing",
    created_by: "69f06445684cd65ce9af1e45",
    visibility: "public",
    assigned_to_students: [],
    content: [{
      id: "w1",
      type: "writing",
      topic: "Write a short paragraph about your family. Mention at least 4 family members.",
      timeLimit: 15,
      minimumWords: 50,
      maximumWords: 120,
      points: 15
    }],
    points: 15,
    passing_percentage: 70,
  },

  // ========================================
  // INTERMEDIATE
  // ========================================

  // 6. Intermediate Grammar
  {
    lesson_id: "f9d24342e3d7406f887bba6f",
    title: "Past Simple vs Present Perfect",
    description: "Master the difference between Past Simple and Present Perfect tenses through targeted practice exercises.",
    level: "intermediate",
    category: "grammar",
    created_by: "69f06445684cd65ce9af1e45",
    visibility: "public",
    assigned_to_students: [],
    content: [
      { id: "ig1", type: "mcq", question: "I ___ to Paris last summer.", options: ["go", "went", "have gone", "gone"], correctAnswer: "went", points: 3 },
      { id: "ig2", type: "fill_blank", question: "She ___ (live) in this city since 2018.", correctAnswer: "has lived", points: 3 },
      { id: "ig3", type: "mcq", question: "___ you ever eaten sushi?", options: ["Did", "Have", "Do", "Are"], correctAnswer: "Have", points: 3 },
      { id: "ig4", type: "fill_blank", question: "They ___ the movie yesterday.", correctAnswer: "watched", points: 3 }
    ],
    points: 12,
    passing_percentage: 70,
  },

  // 7. Intermediate Vocabulary
  {
    lesson_id: "a431fa08545e4590b02fb43f",
    title: "Business and Work Vocabulary",
    description: "Learn and practice essential business and workplace vocabulary.",
    level: "intermediate",
    category: "vocabulary",
    created_by: "69f06445684cd65ce9af1e45",
    visibility: "public",
    assigned_to_students: [],
    content: [
      { id: "iv1", type: "mcq", question: "What does 'deadline' mean?", options: ["A meeting", "A final date", "A salary", "A client"], correctAnswer: "A final date", points: 3 },
      { id: "iv2", type: "fill_blank", question: "We have an important ___ with the client tomorrow.", correctAnswer: "meeting", points: 3 },
      { id: "iv3", type: "matching", pairs: [
          { id: "miv1", left: "Promotion", right: "Higher position" },
          { id: "miv2", left: "Salary", right: "Monthly payment" },
          { id: "miv3", left: "Colleague", right: "Coworker" }
        ], points: 6 }
    ],
    points: 12,
    passing_percentage: 70,
  },

  // 8. Intermediate Listening
  {
    lesson_id: "05cad8b4e0f840fa9f47cf19",
    title: "Job Interview - Listening Practice",
    description: "Listen to a job interview conversation and test your comprehension.",
    level: "intermediate",
    category: "listening",
    created_by: "69f06445684cd65ce9af1e45",
    visibility: "public",
    assigned_to_students: [],
    content: [
      {
      id: "l1",
      type: "listening",
      file: "https://upload.wikimedia.org/wikipedia/commons/2/21/En-us-daily_routine.ogg",
      transcript: "I wake up at seven o'clock. Then I brush my teeth and take a shower. I eat eggs and bread for breakfast.",
      points: 12,
      comprehensionQuestions: [
        { id: "lq1", type: "mcq", question: "What time does the speaker wake up?", options: ["6 AM", "7 AM", "8 AM", "9 AM"], correctAnswer: "7 AM", points: 3 },
        { id: "lq2", type: "true_false", question: "The speaker takes a shower before brushing teeth.", correctAnswer: false, points: 3 },
        { id: "lq3", type: "fill_blank", question: "The speaker eats ___ for breakfast.", correctAnswer: "eggs", points: 3 },
        { id: "lq4", type: "true_false", question: "The speaker eats rice for breakfast.", correctAnswer: false, points: 3 }
      ]
    },{
      id: "l2",
      type: "listening",
      file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      transcript: "Interviewer: Why do you want this job? Candidate: I want to develop my skills...",
      points: 15,
      comprehensionQuestions: [
        { id: "ilq1", type: "mcq", question: "What is the candidate's main reason for the job?", options: ["Salary", "Skill development", "Location"], correctAnswer: "Skill development", points: 5 },
        { id: "ilq2", type: "true_false", question: "The candidate has 5 years of experience.", correctAnswer: true, points: 5 }
      ]
    }],
    points: 15,
    passing_percentage: 70,
  },

  // 9. Intermediate Speaking
  {
    lesson_id: "3e8a7b2ffadd43b38b89bc6f",
    title: "Speaking - Hobbies and Interests",
    description: "Practice discussing your hobbies and daily interests in English.",
    level: "intermediate",
    category: "speaking",
    created_by: "69f06445684cd65ce9af1e45",
    visibility: "public",
    assigned_to_students: [],
    content: [
      { id: "is1", type: "follow_up", question: "What are your hobbies?", points: 7, expectedAnswer: "I enjoy playing..., reading..., traveling..." },
      { id: "is2", type: "dialogue", question: "How often do you play sports?", speaker: "Friend", expectedAnswer: "I play 2-3 times a week", points: 6 },
      { id: "is3", type: "follow_up", question: "Why do you like your favorite hobby?", points: 7, expectedAnswer: "It helps me relax / It is fun / It keeps me healthy" }
    ],
    points: 20,
    passing_percentage: 70,
  },

  // 10. Intermediate Writing
  {
    lesson_id: "0f126f15a4f94a918ea49a2e",
    title: "Writing - Opinion Essay",
    description: "Write a structured opinion essay on the topic of social media.",
    level: "intermediate",
    category: "writing",
    created_by: "69f06445684cd65ce9af1e45",
    visibility: "public",
    assigned_to_students: [],
    content: [{
      id: "iw1",
      type: "writing",
      topic: "Write an opinion essay: 'Social media does more harm than good.'",
      timeLimit: 30,
      minimumWords: 120,
      maximumWords: 180,
      points: 20
    }],
    points: 20,
    passing_percentage: 70,
  },

  // ========================================
  // ADVANCED
  // ========================================

  // 11. Advanced Grammar
  {
    lesson_id: "c7baca408c334163949696e3",
    title: "Conditionals & Subjunctives",
    description: "Advanced grammar practice focusing on conditionals and subjunctive mood.",
    level: "advanced",
    category: "grammar",
    created_by: "69f06445684cd65ce9af1e45",
    visibility: "public",
    assigned_to_students: [],
    content: [
      { id: "ag1", type: "fill_blank", question: "If I ___ (know) earlier, I would have helped you.", correctAnswer: "had known", points: 4 },
      { id: "ag2", type: "mcq", question: "I wish I ___ richer.", options: ["am", "was", "were", "be"], correctAnswer: "were", points: 4 }
    ],
    points: 8,
    passing_percentage: 75,
  },

  // 12. Advanced Vocabulary
  {
    lesson_id: "d7eda632a4b84c628f52c138",
    title: "Environment and Climate Change Vocabulary",
    description: "Expand your advanced vocabulary related to environment and global issues.",
    level: "advanced",
    category: "vocabulary",
    created_by: "69f06445684cd65ce9af1e45",
    visibility: "public",
    assigned_to_students: [],
    content: [
      { id: "av1", type: "mcq", question: "What is 'carbon footprint'?", options: ["A type of shoe", "Total greenhouse gas emissions", "A forest"], correctAnswer: "Total greenhouse gas emissions", points: 4 },
      { id: "av2", type: "fill_blank", question: "___ energy sources like solar and wind are important.", correctAnswer: "Renewable", points: 4 }
    ],
    points: 8,
    passing_percentage: 75,
  },

  // 13. Advanced Listening
  {
    lesson_id: "b2f9fdb1d85c4d0a8cb54db2",
    title: "TED Talk - Listening Comprehension",
    description: "Listen to an advanced TED-style talk and answer challenging comprehension questions.",
    level: "advanced",
    category: "listening",
    created_by: "69f06445684cd65ce9af1e45",
    visibility: "public",
    assigned_to_students: [],
    content: [{
      id: "al1",
      type: "listening",
      file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      transcript: "Introverts bring unique strengths to society...",
      points: 18,
      comprehensionQuestions: [
        { id: "alq1", type: "true_false", question: "The speaker believes introverts are less valuable than extroverts.", correctAnswer: false, points: 6 },
        { id: "alq2", type: "mcq", question: "What is the main message of the talk?", options: ["Extroverts are better", "Introverts have important strengths", "Everyone should be extroverted"], correctAnswer: "Introverts have important strengths", points: 6 }
      ]
    }],
    points: 18,
    passing_percentage: 75,
  },

  // 14. Advanced Speaking
  {
    lesson_id: "9321a7f3296f4e01bf86ff14",
    title: "Debate - Artificial Intelligence",
    description: "Practice advanced speaking through debate-style questions on Artificial Intelligence.",
    level: "advanced",
    category: "speaking",
    created_by: "69f06445684cd65ce9af1e45",
    visibility: "public",
    assigned_to_students: [],
    content: [
      { id: "as1", type: "follow_up", question: "Do you think AI will replace human jobs?", points: 8, expectedAnswer: "Yes, many routine jobs / No, it will create new jobs..." },
      { id: "as2", type: "dialogue", question: "What are the ethical concerns of AI?", speaker: "Moderator", expectedAnswer: "Privacy, bias, job loss, control", points: 8 }
    ],
    points: 16,
    passing_percentage: 75,
  },

  // 15. Advanced Writing
  {
    lesson_id: "9fde7ec16d8049d794e1803c",
    title: "Formal Email - Job Application",
    description: "Write a professional formal cover letter for a job application.",
    level: "advanced",
    category: "writing",
    created_by: "69f06445684cd65ce9af1e45",
    visibility: "public",
    assigned_to_students: [],
    content: [{
      id: "aw1",
      type: "writing",
      topic: "Write a formal cover letter applying for the Marketing Manager position.",
      timeLimit: 40,
      minimumWords: 200,
      maximumWords: 350,
      points: 25
    }],
    points: 25,
    passing_percentage: 75,
  }
];
