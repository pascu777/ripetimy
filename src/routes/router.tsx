import { createBrowserRouter } from 'react-router-dom'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/features/auth/LoginPage'
import { SignupPage } from '@/features/auth/SignupPage'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleGate } from './RoleGate'
import { AgendaPage } from '@/features/agenda/AgendaPage'
import { AvailabilityPage } from '@/features/availability/AvailabilityPage'
import { SettingsPage } from '@/features/profile/SettingsPage'
import { SearchTutorsPage } from '@/features/search/SearchTutorsPage'
import { TutorDetailPage } from '@/features/search/TutorDetailPage'
import { MyLessonsPage } from '@/features/my-lessons/MyLessonsPage'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/registrati', element: <SignupPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/dashboard', element: <RoleGate /> },
          { path: '/impostazioni', element: <SettingsPage /> },
          {
            element: <ProtectedRoute requireRole="tutor" />,
            children: [
              { path: '/agenda', element: <AgendaPage /> },
              { path: '/disponibilita', element: <AvailabilityPage /> },
            ],
          },
          {
            element: <ProtectedRoute requireRole="student" />,
            children: [
              { path: '/cerca-tutor', element: <SearchTutorsPage /> },
              { path: '/tutor/:tutorId', element: <TutorDetailPage /> },
              { path: '/le-mie-lezioni', element: <MyLessonsPage /> },
            ],
          },
        ],
      },
    ],
  },
])
