export interface SubTask {
  id: string;
  name: string;
  isCompleted: boolean;
  createdAt: number;
  dueDate: number;
}

export interface Task {
  id: string;
  name: string;
  isCompleted: boolean;
  createdAt: number;
  dueDate: number;
  subTasks: SubTask[];
}
