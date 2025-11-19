import { MathProblem, VisualObject } from '@/types';

export type MathOperation = 'addition' | 'subtraction' | 'multiplication' | 'division';
export type Difficulty = 'easy' | 'medium' | 'hard';

// Visual object types for counting
const visualObjectTypes: VisualObject['type'][] = ['apple', 'balloon', 'star', 'heart', 'animal'];

// Color palette for visual objects
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];

// Generate a random integer between min and max (inclusive)
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Get number range based on difficulty
const getNumberRange = (difficulty: Difficulty): { min: number; max: number } => {
  switch (difficulty) {
    case 'easy':
      return { min: 1, max: 10 };
    case 'medium':
      return { min: 1, max: 20 };
    case 'hard':
      return { min: 1, max: 50 };
  }
};

// Generate addition problem
const generateAddition = (difficulty: Difficulty): MathProblem => {
  const { min, max } = getNumberRange(difficulty);
  const num1 = randomInt(min, max);
  const num2 = randomInt(min, max);
  const answer = num1 + num2;

  const objectType = visualObjectTypes[randomInt(0, visualObjectTypes.length - 1)];
  const visualObjects: VisualObject[] = [
    { type: objectType, count: num1, color: colors[0] },
    { type: objectType, count: num2, color: colors[1] },
  ];

  return {
    id: `add-${Date.now()}-${randomInt(1000, 9999)}`,
    type: 'addition',
    question: `${num1} + ${num2} = ?`,
    operands: [num1, num2],
    answer,
    difficulty,
    visualObjects,
  };
};

// Generate subtraction problem
const generateSubtraction = (difficulty: Difficulty): MathProblem => {
  const { min, max } = getNumberRange(difficulty);
  const num1 = randomInt(min, max);
  const num2 = randomInt(min, num1); // Ensure num2 <= num1 for positive results
  const answer = num1 - num2;

  const objectType = visualObjectTypes[randomInt(0, visualObjectTypes.length - 1)];
  const visualObjects: VisualObject[] = [
    { type: objectType, count: num1, color: colors[0] },
    { type: objectType, count: num2, color: colors[2] },
  ];

  return {
    id: `sub-${Date.now()}-${randomInt(1000, 9999)}`,
    type: 'subtraction',
    question: `${num1} - ${num2} = ?`,
    operands: [num1, num2],
    answer,
    difficulty,
    visualObjects,
  };
};

// Generate multiplication problem
const generateMultiplication = (difficulty: Difficulty): MathProblem => {
  let max = 5;
  if (difficulty === 'medium') max = 10;
  if (difficulty === 'hard') max = 12;

  const num1 = randomInt(1, max);
  const num2 = randomInt(1, max);
  const answer = num1 * num2;

  const objectType = visualObjectTypes[randomInt(0, visualObjectTypes.length - 1)];
  const visualObjects: VisualObject[] = [];

  // Create groups of objects for multiplication
  for (let i = 0; i < num1; i++) {
    visualObjects.push({
      type: objectType,
      count: num2,
      color: colors[i % colors.length],
    });
  }

  return {
    id: `mul-${Date.now()}-${randomInt(1000, 9999)}`,
    type: 'multiplication',
    question: `${num1} × ${num2} = ?`,
    operands: [num1, num2],
    answer,
    difficulty,
    visualObjects,
  };
};

// Generate division problem
const generateDivision = (difficulty: Difficulty): MathProblem => {
  let max = 5;
  if (difficulty === 'medium') max = 10;
  if (difficulty === 'hard') max = 12;

  const divisor = randomInt(1, max);
  const quotient = randomInt(1, max);
  const dividend = divisor * quotient;

  const objectType = visualObjectTypes[randomInt(0, visualObjectTypes.length - 1)];
  const visualObjects: VisualObject[] = [
    { type: objectType, count: dividend, color: colors[0] },
  ];

  return {
    id: `div-${Date.now()}-${randomInt(1000, 9999)}`,
    type: 'division',
    question: `${dividend} ÷ ${divisor} = ?`,
    operands: [dividend, divisor],
    answer: quotient,
    difficulty,
    visualObjects,
  };
};

// Generate a math problem based on operation and difficulty
export const generateMathProblem = (
  operation: MathOperation,
  difficulty: Difficulty = 'easy'
): MathProblem => {
  switch (operation) {
    case 'addition':
      return generateAddition(difficulty);
    case 'subtraction':
      return generateSubtraction(difficulty);
    case 'multiplication':
      return generateMultiplication(difficulty);
    case 'division':
      return generateDivision(difficulty);
  }
};

// Generate a set of math problems
export const generateMathProblems = (
  count: number,
  operations: MathOperation[],
  difficulty: Difficulty = 'easy'
): MathProblem[] => {
  const problems: MathProblem[] = [];
  
  for (let i = 0; i < count; i++) {
    const operation = operations[randomInt(0, operations.length - 1)];
    problems.push(generateMathProblem(operation, difficulty));
  }
  
  return problems;
};

// Check if an answer is correct
export const checkAnswer = (problem: MathProblem, userAnswer: number): boolean => {
  return userAnswer === problem.answer;
};

// Generate multiple choice options for a problem
export const generateMultipleChoiceOptions = (problem: MathProblem, count: number = 4): number[] => {
  const options = new Set<number>();
  options.add(problem.answer);
  
  while (options.size < count) {
    const offset = randomInt(1, 10);
    const wrongAnswer = problem.answer + (randomInt(0, 1) === 0 ? offset : -offset);
    if (wrongAnswer > 0 && wrongAnswer !== problem.answer) {
      options.add(wrongAnswer);
    }
  }
  
  return Array.from(options).sort(() => Math.random() - 0.5);
};

export const mathGenerator = {
  generateMathProblem,
  generateMathProblems,
  checkAnswer,
  generateMultipleChoiceOptions,
};

export default mathGenerator;

