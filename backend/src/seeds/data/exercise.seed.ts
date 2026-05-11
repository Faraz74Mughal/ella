import { Types } from "mongoose";

export const exerciseSeeds = [
  {
    lesson_id: "61f06445684cd65ce9af1e45",
    title: "Basic Grammar - Present Tense",
    level: "beginner",
    category: "grammar",
    created_by: "69f06445684cd65ce9af1e45",
    visibility: "private",
    assigned_to_students: [],
    content: [
      {
        id: "q1",
        type: "mcq",
        question: "She ___ to school every day.",
        options: ["go", "goes", "going", "gone"],
        correctAnswer: "goes",
        points: 2,
      },
      {
        id: "q2",
        type: "fill_blank",
        question: "They ___ playing football.",
        correctAnswer: "are",
        points: 2,
      },
    ],
    points: 4,
    passing_percentage: 70,
  },



  {
    lesson_id: "62f06445684cd65ce9af1e45",
    title: "Matching Vocabulary",
    level: "beginner",
    category: "grammar",
    created_by: "69f06445684cd65ce9af1e45",
    visibility: "private",
    assigned_to_students: [],
    content: [
      {
        id: "q4",
        type: "matching",
        pairs: [
          {id: "p1", left: "Apple", right: "Fruit" },
          {id: "p2", left: "Dog", right: "Animal" },
        ],
        points: 3,
      },
    ],
    points: 3,
    passing_percentage: 70,
  },

  {
    lesson_id: "70f06445684cd65ce9af1e45",
    title: "Writing - My Daily Routine",
    level: "beginner",
    category: "writing",
    created_by: "69f06445684cd65ce9af1e45",
    visibility: "private",
    assigned_to_students: [],
    content: [
      {
        id: "q5",
        type: "writing",
        topic: "Describe your daily routine in English",
        timeLimit: 10,
        minimumWords: 50,
        maximumWords: 120,
        points: 10,
      },
    ],
    points: 10,
    passing_percentage: 60,
  },

  {
    lesson_id: "70f06445684cd65ce9af1e45",
    title: "Writing - Favorite Place",
    level: "intermediate",
    category: "writing",
    created_by: "69f06445684cd65ce9af1e45",
    visibility: "private",
    assigned_to_students: [],
    content: [
      {
        id: "q6",
        type: "writing",
        topic: "Describe your favorite place",
        timeLimit: 15,
        minimumWords: 80,
        maximumWords: 150,
        points: 12,
      },
    ],
    points: 12,
    passing_percentage: 65,
  },

  {
    lesson_id: "69f06445684cd65ce9af1e45",
    title: "Speaking - Introduce Yourself",
    level: "beginner",
    category: "speaking",
    created_by: "69f06445684cd65ce9af1e45",
    visibility: "private",
    assigned_to_students: [],
    content: [
      {
        id: "q7",
        type: "follow_up",
        question: "Introduce yourself in English",
        expectedAnswer: "Student introduces themselves",
        points: 5,
      },
    ],
    points: 5,
    passing_percentage: 60,
  },

  {
    lesson_id: "69f06445684cd65ce9af1e45",
    title: "Speaking - Dialogue Practice",
    level: "intermediate",
    category: "speaking",
    created_by: "69f06445684cd65ce9af1e45",
    visibility: "private",
    assigned_to_students: [],
    content: [
      {
        id: "q8",
        type: "dialogue",
        question: "How do you greet someone?",
        speaker: "A",
        expectedAnswer: "Hello, how are you?",
        points: 5,
      },
    ],
    points: 5,
    passing_percentage: 60,
  },

  {
    lesson_id: "68f06445684cd65ce9af1e45",
    title: "Listening - Basic Conversation",
    level: "beginner",
    category: "listening",
    created_by: "69f06445684cd65ce9af1e45",
    visibility: "private",
    assigned_to_students: [],
    content: [
      {
        id: "q9",
        type: "listening",
        file: "https://example.com/audio1.mp3",
        transcript: "Hello, how are you?",
        points: 5,
        comprehensionQuestions: [
          {
            id: "l1",
            type: "mcq",
            question: "What did the speaker say?",
            options: ["Hello", "Bye"],
            correctAnswer: "Hello",
            points: 2,
          },
        ],
      },
    ],
    points: 5,
    passing_percentage: 60,
  },

  {
    lesson_id: "68f06445684cd65ce9af1e45",
    title: "Listening - Daily Conversation",
    level: "intermediate",
    category: "listening",
    created_by: "69f06445684cd65ce9af1e45",
    visibility: "private",
    assigned_to_students: [],
    content: [
      {
        id: "q10",
        type: "listening",
        file: "https://example.com/audio2.mp3",
        transcript: "I am going to the market.",
        points: 5,
        comprehensionQuestions: [
          {
            id: "l2",
            type: "true_false",
            question: "The speaker is going to school.",
            correctAnswer: false,
            points: 2,
          },
        ],
      },
    ],
    points: 5,
    passing_percentage: 60,
  },
  {
  lesson_id: "61f06445684cd65ce9af1e45",
  title: "Comprehensive Grammar Test",
  level: "intermediate",
  category: "grammar",
  created_by: "69f06445684cd65ce9af1e45",
  visibility: "private",
  assigned_to_students: [],

  content: [
    // 🔹 MCQs
    {
      id: "g1",
      type: "mcq",
      question: "She ___ to the gym every morning.",
      options: ["go", "goes", "going", "gone"],
      correctAnswer: "goes",
      points: 2,
    },
    {
      id: "g2",
      type: "mcq",
      question: "They ___ finished their homework.",
      options: ["has", "have", "had", "having"],
      correctAnswer: "have",
      points: 2,
    },

    // 🔹 Fill in the blanks
    {
      id: "g3",
      type: "fill_blank",
      question: "I ___ (be) a student.",
      correctAnswer: "am",
      points: 2,
    },
    {
      id: "g4",
      type: "fill_blank",
      question: "He ___ (eat) lunch right now.",
      correctAnswer: "is eating",
      points: 2,
    },

    

    // 🔹 Matching
    {
      id: "g7",
      type: "matching",
      pairs: [
        {id:"g1", left: "Run", right: "Verb" },
        {id:"g2", left: "Quickly", right: "Adverb" },
        {id:"g3", left: "Beautiful", right: "Adjective" },
      ],
      points: 3,
    },

    // 🔹 More MCQ (advanced)
    {
      id: "g8",
      type: "mcq",
      question: "If I ___ rich, I would travel the world.",
      options: ["am", "was", "were", "be"],
      correctAnswer: "were",
      points: 3,
    },

    // 🔹 Sentence correction
    {
      id: "g9",
      type: "fill_blank",
      question: "Correct the sentence: 'He go to school daily' → He ___ to school daily.",
      correctAnswer: "goes",
      points: 3,
    },

    // 🔹 Mixed grammar concept
    {
      id: "g10",
      type: "mcq",
      question: "Choose the correct sentence:",
      options: [
        "She has went to school",
        "She has gone to school",
        "She have gone to school",
        "She going to school",
      ],
      correctAnswer: "She has gone to school",
      points: 3,
    },
  ],

  points: 24, // total points
  passing_percentage: 70,
}
];
