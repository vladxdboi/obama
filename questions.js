const questions = [
  {
    question: "What is the capital of France?",
    answers: ["Berlin", "Paris", "Rome", "Madrid"],
    correct: 1,
    difficulty: "easy"
  },
  {
    question: "What is 15 x 3?",
    answers: ["45", "35", "40", "50"],
    correct: 0,
    difficulty: "medium"
  },
  {
    question: "What is the derivative of x^2?",
    answers: ["x", "2x", "x^2", "2"],
    correct: 1,
    difficulty: "hard"
  },{
  question: "Scroll test",
  answers: [
    "1", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
	"2", "3", "4", "5", "6", "7", "8", "9",
    "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"
  ],
  correct: 0,
  difficulty: "easy"
},
  


  // Added test questions
  ...Array.from({ length: 15 }, (_, i) => ({
    question: `Test question ${i + 1}`,
    answers: ["wrong answer", "wrong again", "correct answer", "nope"],
    correct: 2, // "correct answer"
    difficulty: i < 5 ? "easy" : i < 10 ? "medium" : "hard"
  }))
];

