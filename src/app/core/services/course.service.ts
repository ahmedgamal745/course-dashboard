import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Course } from '../models/course.model';

const baseCourses: Course[] = [
  {
    id: '1', title: 'Quantum Leadership v4', description: 'High-impact strategies for modern leaders facing unprecedented challenges.', status: 'Active', category: 'Leadership', level: 'Executive Tier 1', duration: '10 Weeks', hours: 40, studentsCount: 1240, instructor: { id: 'i1', name: 'Dr. Elena Sterling', role: 'Dept. of Strategic Ops' }, avgCompletion: 86, activeLearners: 412, revenue: 12450, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '2', title: 'Advanced M&A Frameworks', description: 'Comprehensive analysis of modern merger and acquisition dynamics.', status: 'Draft', category: 'Corporate Finance', level: 'Managerial', duration: '8 Weeks', hours: 32, studentsCount: 0, instructor: { id: 'i2', name: 'Marcus Thorne', role: 'Corporate Finance Head' }, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '3', title: 'Global Market Dynamics', description: 'Understanding geopolitical impacts on emerging global markets.', status: 'Active', category: 'Data Analytics', level: 'Executive Tier 2', duration: '12 Weeks', hours: 48, studentsCount: 856, instructor: { id: 'i3', name: 'Sarah Jing', role: 'Global Economics Faculty' }, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '4', title: 'Legacy Data Architecture', description: 'Historical overview of enterprise database evolution and legacy systems.', status: 'Archived', category: 'Data Analytics', level: 'Managerial', duration: '6 Weeks', hours: 24, studentsCount: 42, instructor: { id: 'i4', name: 'Prof. Arthur Wells', role: 'Emeritus Professor' }, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '5', title: 'Advanced Strategic Leadership in Volatile Markets', description: 'Core module focusing on executive decision-making under uncertainty and global scale.', status: 'Active', category: 'Leadership', level: 'Executive Tier 1', duration: '12 Weeks', hours: 40, studentsCount: 1284, instructor: { id: 'i5', name: 'Dr. Alistair Vance', role: 'Head of Leadership Research', bio: 'Dr. Vance has over 25 years of experience...' }, avgCompletion: 86, activeLearners: 412, revenue: 12450, curriculum: [{ id: 'm1', title: 'The Anatomy of High-Stakes Decision Making', duration: '4.5 Hours', type: 'Core Theory', status: 'completed' }, { id: 'm2', title: 'Ethics in Global Market Competition', duration: '3 Hours', type: 'Case Study', status: 'completed' }, { id: 'm3', title: 'Organizational Alignment at Scale', duration: '4 Hours', type: 'Currently Active', status: 'active' }, { id: 'm4', title: 'Rapid Pivot Strategies for Disruptive Times', duration: '6 Hours', type: 'Simulation', status: 'locked' }], createdAt: new Date(), updatedAt: new Date(),
  }
];

const generatedCourses: Course[] = Array.from({ length: 45 }).map((_, i) => ({
  id: `g${i}`,
  title: `Corporate Strategy ${i + 6}`,
  description: `An in-depth look at corporate strategy principles and case studies part ${i + 1}.`,
  status: i % 5 === 0 ? 'Draft' : (i % 7 === 0 ? 'Archived' : 'Active'),
  category: ['Leadership', 'Corporate Finance', 'Strategic Planning', 'Data Analytics'][i % 4],
  level: ['Managerial', 'Executive Tier 1', 'Executive Tier 2', 'C-Suite'][i % 4],
  duration: `${(i % 10) + 4} Weeks`,
  hours: ((i % 10) + 4) * 4,
  studentsCount: Math.floor(Math.random() * 2000),
  instructor: { id: `ig${i}`, name: `Instructor ${i}`, role: 'Faculty Member' },
  createdAt: new Date(),
  updatedAt: new Date(),
}));

const MOCK_COURSES: Course[] = [...baseCourses, ...generatedCourses];

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly STORAGE_KEY = 'courses_data';
  private courses: Course[] = [];

  constructor() {
    this.initCourses();
  }

  private initCourses() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.courses = JSON.parse(saved);
    } else {
      this.courses = MOCK_COURSES;
      this.saveToStorage();
    }
  }

  private saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.courses));
  }

  getCourses(): Observable<Course[]> {
    return of(this.courses).pipe(delay(300));
  }

  getCourseById(id: string): Observable<Course | undefined> {
    const course = this.courses.find(c => c.id === id);
    return of(course).pipe(delay(300));
  }

  addCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Observable<Course> {
    const newCourse: Course = {
      ...course,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString() as any,
      updatedAt: new Date().toISOString() as any
    };
    this.courses = [newCourse, ...this.courses];
    this.saveToStorage();
    return of(newCourse).pipe(delay(300));
  }

  updateCourse(id: string, updates: Partial<Course>): Observable<Course> {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Course not found');
    
    const updatedCourse = { 
      ...this.courses[index], 
      ...updates, 
      updatedAt: new Date().toISOString() as any
    };
    
    this.courses = [
      ...this.courses.slice(0, index),
      updatedCourse,
      ...this.courses.slice(index + 1)
    ];
    this.saveToStorage();
    return of(updatedCourse).pipe(delay(300));
  }

  deleteCourse(id: string): Observable<void> {
    this.courses = this.courses.filter(c => c.id !== id);
    this.saveToStorage();
    return of(void 0).pipe(delay(300));
  }

  toggleFavorite(id: string): Observable<Course> {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Course not found');
    
    const updatedCourse = { 
      ...this.courses[index], 
      isFavorite: !(this.courses[index] as any).isFavorite 
    };
    
    this.courses = [
      ...this.courses.slice(0, index),
      updatedCourse,
      ...this.courses.slice(index + 1)
    ];
    this.saveToStorage();
    return of(updatedCourse).pipe(delay(100));
  }
}
