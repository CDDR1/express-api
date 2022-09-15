import { uuid } from 'uuidv4';

export const getTasks = () => {
  return [
    {
      id: uuid(),
      description: "Study backend development",
      completed: false,
    },
    {
      id: uuid(),
      description: "Learn Binary Search Trees",
      completed: false,
    },
    {
      id: uuid(),
      description: "Finish MTH 390 assignments",
      completed: false,
    },
    {
      id: uuid(),
      description: "Practice LeetCode",
      completed: false,
    },
  ];
};
