import { Doubt } from './userState';

export const generateDemoDoubts = (): Doubt[] => {
  const subjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", 
    "Computer Science", "English", "History", "Geography"
  ];

  const mathQuestions = [
    {
      title: "Quadratic Equation Problem",
      description: "I'm stuck on solving x² + 5x + 6 = 0. Can someone help me understand the factoring method?",
      subject: "Mathematics"
    },
    {
      title: "Calculus Integration",
      description: "How do I integrate ∫(2x + 3)dx? I'm confused about the power rule.",
      subject: "Mathematics"
    },
    {
      title: "Geometry Proof",
      description: "I need help proving that the sum of angles in a triangle is 180 degrees.",
      subject: "Mathematics"
    }
  ];

  const physicsQuestions = [
    {
      title: "Newton's Laws Application",
      description: "A car is moving at constant velocity. What forces are acting on it?",
      subject: "Physics"
    },
    {
      title: "Energy Conservation",
      description: "How do I calculate the potential energy of an object at height h?",
      subject: "Physics"
    }
  ];

  const chemistryQuestions = [
    {
      title: "Balancing Chemical Equations",
      description: "How do I balance H₂ + O₂ → H₂O?",
      subject: "Chemistry"
    },
    {
      title: "Molarity Calculation",
      description: "What is the molarity of a solution with 2 moles of solute in 1 liter?",
      subject: "Chemistry"
    }
  ];

  const csQuestions = [
    {
      title: "Python Loop Problem",
      description: "How do I write a for loop to iterate through a list in Python?",
      subject: "Computer Science"
    },
    {
      title: "JavaScript Array Methods",
      description: "What's the difference between map() and forEach() in JavaScript?",
      subject: "Computer Science"
    }
  ];

  const allQuestions = [
    ...mathQuestions,
    ...physicsQuestions,
    ...chemistryQuestions,
    ...csQuestions
  ];

  return allQuestions.map((question, index) => ({
    id: `demo-doubt-${index + 1}`,
    title: question.title,
    description: question.description,
    subject: question.subject,
    askerId: `demo-asker-${Math.floor(Math.random() * 3) + 1}`,
    status: 'open' as const,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Random time in last 7 days
    points: 10,
  }));
}; 