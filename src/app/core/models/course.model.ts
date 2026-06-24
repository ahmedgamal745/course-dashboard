export type CourseStatus = 'Active' | 'Draft' | 'Archived';

export interface Instructor {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  bio?: string;
}

export interface CurriculumModule {
  id: string;
  title: string;
  duration: string;
  type: string; // e.g., 'Core Theory', 'Case Study', 'Simulation'
  status: 'locked' | 'active' | 'completed';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  status: CourseStatus;
  category: string;
  level: string; // e.g., 'Managerial', 'Executive Tier 1'
  duration: string; // e.g., '12 Weeks'
  hours: number;
  studentsCount: number;
  instructor: Instructor;
  coverImageUrl?: string;
  
  // Dashboard stats
  avgCompletion?: number;
  activeLearners?: number;
  revenue?: number;
  
  curriculum?: CurriculumModule[];
  createdAt: string | Date;
  updatedAt: string | Date;
  isFavorite?: boolean;
}
