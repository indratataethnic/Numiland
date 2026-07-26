import { GradeLevel, MathOperation, MathProblem } from '../types';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const EMOJIS = ['🍎', '⭐', '🎈', '🍪', '🐱', '🚗', '🌱', '⚽'];

export function generateMathProblem(
  grade: GradeLevel,
  allowedOps: MathOperation[],
  streakCount: number = 0
): MathProblem {
  // Determine effective grade level if 'adaptive'
  let effectiveGrade: 'kelas1-2' | 'kelas3-4' | 'kelas5-6' = 'kelas1-2';
  if (grade === 'adaptive') {
    if (streakCount >= 8) effectiveGrade = 'kelas5-6';
    else if (streakCount >= 4) effectiveGrade = 'kelas3-4';
    else effectiveGrade = 'kelas1-2';
  } else {
    effectiveGrade = grade;
  }

  // Filter allowed operations
  let ops: ('+' | '-' | '×' | '÷')[] = [];
  const allows = allowedOps.includes('mixed')
    ? ['addition', 'subtraction', 'multiplication', 'division'] as MathOperation[]
    : allowedOps;

  if (allows.includes('addition')) ops.push('+');
  if (allows.includes('subtraction')) ops.push('-');

  // Only unlock multiplication and division for grade 3+ unless specifically selected
  if (effectiveGrade !== 'kelas1-2' || allows.includes('multiplication')) {
    if (allows.includes('multiplication')) ops.push('×');
  }
  if (effectiveGrade !== 'kelas1-2' || allows.includes('division')) {
    if (allows.includes('division')) ops.push('÷');
  }

  if (ops.length === 0) ops = ['+'];

  const chosenOp = ops[Math.floor(Math.random() * ops.length)];

  let num1 = 0;
  let num2 = 0;
  let answer = 0;
  let questionStr = '';
  let visualHint: string | undefined = undefined;
  let difficulty: 'easy' | 'medium' | 'hard' | 'expert' = 'easy';

  if (effectiveGrade === 'kelas1-2') {
    difficulty = 'easy';
    if (chosenOp === '+') {
      num1 = getRandomInt(1, 12);
      num2 = getRandomInt(1, 10);
      answer = num1 + num2;
      questionStr = `${num1} + ${num2} = ?`;
      
      if (num1 <= 5 && num2 <= 5) {
        const icon = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        visualHint = `${icon.repeat(num1)} + ${icon.repeat(num2)}`;
      }
    } else if (chosenOp === '-') {
      num1 = getRandomInt(4, 15);
      num2 = getRandomInt(1, num1);
      answer = num1 - num2;
      questionStr = `${num1} - ${num2} = ?`;
    } else if (chosenOp === '×') {
      num1 = getRandomInt(1, 5);
      num2 = getRandomInt(1, 5);
      answer = num1 * num2;
      questionStr = `${num1} × ${num2} = ?`;
    } else {
      num2 = getRandomInt(1, 4);
      answer = getRandomInt(1, 4);
      num1 = num2 * answer;
      questionStr = `${num1} ÷ ${num2} = ?`;
    }
  } else if (effectiveGrade === 'kelas3-4') {
    difficulty = 'medium';
    if (chosenOp === '+') {
      num1 = getRandomInt(15, 80);
      num2 = getRandomInt(10, 80);
      answer = num1 + num2;
      questionStr = `${num1} + ${num2} = ?`;
    } else if (chosenOp === '-') {
      num1 = getRandomInt(20, 100);
      num2 = getRandomInt(10, num1 - 5);
      answer = num1 - num2;
      questionStr = `${num1} - ${num2} = ?`;
    } else if (chosenOp === '×') {
      num1 = getRandomInt(2, 10);
      num2 = getRandomInt(2, 10);
      answer = num1 * num2;
      questionStr = `${num1} × ${num2} = ?`;
    } else {
      num2 = getRandomInt(2, 10);
      answer = getRandomInt(2, 10);
      num1 = num2 * answer;
      questionStr = `${num1} ÷ ${num2} = ?`;
    }
  } else {
    // Kelas 5-6
    difficulty = streakCount >= 5 ? 'expert' : 'hard';
    if (chosenOp === '+') {
      num1 = getRandomInt(40, 250);
      num2 = getRandomInt(30, 250);
      answer = num1 + num2;
      questionStr = `${num1} + ${num2} = ?`;
    } else if (chosenOp === '-') {
      num1 = getRandomInt(100, 400);
      num2 = getRandomInt(30, num1 - 20);
      answer = num1 - num2;
      questionStr = `${num1} - ${num2} = ?`;
    } else if (chosenOp === '×') {
      num1 = getRandomInt(6, 15);
      num2 = getRandomInt(6, 15);
      answer = num1 * num2;
      questionStr = `${num1} × ${num2} = ?`;
    } else {
      num2 = getRandomInt(4, 15);
      answer = getRandomInt(5, 20);
      num1 = num2 * answer;
      questionStr = `${num1} ÷ ${num2} = ?`;
    }
  }

  // Generate 4 plausible choices for multiple choice mode
  const choicesSet = new Set<number>();
  choicesSet.add(answer);

  while (choicesSet.size < 4) {
    let delta = getRandomInt(1, 5) * (Math.random() > 0.5 ? 1 : -1);
    if (Math.random() > 0.5 && answer > 10) delta = 10 * (Math.random() > 0.5 ? 1 : -1);
    const wrong = answer + delta;
    if (wrong >= 0 && wrong !== answer) {
      choicesSet.add(wrong);
    }
  }

  const choices = Array.from(choicesSet).sort(() => Math.random() - 0.5);

  return {
    id: `prob_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    questionStr,
    num1,
    num2,
    operator: chosenOp,
    answer,
    choices,
    difficulty,
    visualHint,
  };
}
