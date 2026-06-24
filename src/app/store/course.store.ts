import { inject } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Course, CourseStatus } from '../core/models/course.model';
import { CourseService } from '../core/services/course.service';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { computed } from '@angular/core';

type SortOption = 'recent' | 'enrollment';

type CoursesState = {
  courses: Course[];
  selectedCourse: Course | null;
  isLoading: boolean;
  filter: {
    query: string;
    status: CourseStatus | 'All';
    sort: SortOption;
  };
  error: string | null;
};

const initialState: CoursesState = {
  courses: [],
  selectedCourse: null,
  isLoading: false,
  filter: {
    query: '',
    status: 'All',
    sort: 'recent'
  },
  error: null,
};

export const CourseStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ courses, filter }) => ({
    filteredCourses: computed(() => {
      const { query, status, sort } = filter();
      const currentCourses = courses();
      let filtered = currentCourses.filter(course => {
        const matchesQuery = course.title.toLowerCase().includes(query.toLowerCase()) || 
                             course.instructor.name.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = status === 'All' || course.status === status;
        return matchesQuery && matchesStatus;
      });

      if (sort === 'recent') {
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (sort === 'enrollment') {
        filtered.sort((a, b) => b.studentsCount - a.studentsCount);
      }
      
      return filtered;
    })
  })),
  withMethods((store, courseService = inject(CourseService)) => ({
    updateFilter(filterUpdates: Partial<CoursesState['filter']>) {
      patchState(store, (state) => ({ filter: { ...state.filter, ...filterUpdates } }));
    },
    
    loadCourses: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(() => {
          return courseService.getCourses().pipe(
            tapResponse({
              next: (courses) => patchState(store, { courses, isLoading: false }),
              error: (error: any) => patchState(store, { error: error.message, isLoading: false })
            })
          );
        })
      )
    ),

    loadCourseById: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true, selectedCourse: null, error: null })),
        switchMap((id) => {
          return courseService.getCourseById(id).pipe(
            tapResponse({
              next: (course) => patchState(store, { selectedCourse: course || null, isLoading: false }),
              error: (error: any) => patchState(store, { error: error.message, isLoading: false })
            })
          );
        })
      )
    ),

    deleteCourse: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) => {
          return courseService.deleteCourse(id).pipe(
            tapResponse({
              next: () => {
                const currentCourses = store.courses();
                patchState(store, { 
                  courses: currentCourses.filter(c => c.id !== id),
                  isLoading: false 
                });
              },
              error: (error: any) => patchState(store, { error: error.message, isLoading: false })
            })
          );
        })
      )
    ),

    toggleFavorite: rxMethod<string>(
      pipe(
        switchMap((id) => {
          return courseService.toggleFavorite(id).pipe(
            tapResponse({
              next: (updatedCourse) => {
                const currentCourses = store.courses();
                const newCourses = currentCourses.map(c => c.id === updatedCourse.id ? updatedCourse : c);
                patchState(store, { courses: newCourses });
                
                if (store.selectedCourse()?.id === updatedCourse.id) {
                  patchState(store, { selectedCourse: updatedCourse });
                }
              },
              error: (error: any) => console.error(error)
            })
          );
        })
      )
    )
  }))
);
