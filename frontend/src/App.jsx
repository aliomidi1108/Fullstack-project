import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PageTitleUpdater from './components/PageTitleUpdater'
import MainLayout from './components/layout/MainLayout'
import HomePage from './pages/HomePage'
import CoursesPage from './pages/CoursesPage'
import About from './pages/About'
import Blog from './pages/Blog'
import CourseDetail from './pages/CourseDetail'
import CourseContent from './pages/CourseContent'
import UserDashboardLayout from './layouts/UserDashboardLayout'
import AdminDashboardLayout from './layouts/AdminDashboardLayout'
import Login from './pages/Login'
import VerifyOTP from './pages/VerifyOTP'
import Register from './pages/Register'
import NotFoundPage from './pages/NotFoundPage'
import Contact from './pages/Contact'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardHome from './pages/dashboard/Home'
import MyCourses from './pages/dashboard/MyCourses'
import Wallet from './pages/dashboard/Wallet'
import Basket from './pages/dashboard/Basket'
import EditProfile from './pages/dashboard/EditProfile'
import Support from './pages/dashboard/Support'
import AdminDashboard from './pages/admin/Dashboard'
import Reports from './pages/admin/Reports'
import PaymentResult from './pages/PaymentResult'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailure from './pages/PaymentFailure'

/**
 * App Component
 * 
 * Main application component with routing setup.
 * 
 * TODO: When implementing UI design:
 * - Add page transition animations if needed
 * - Add route-specific metadata/SEO
 * - Add protected routes if authentication is needed
 */
function App() {
  return (
    <Router>
      <PageTitleUpdater />
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/courses"
          element={
            <MainLayout>
              <CoursesPage />
            </MainLayout>
          }
        />
        <Route
          path="/courses/:courseId"
          element={
            <MainLayout>
              <CourseDetail />
            </MainLayout>
          }
        />
        <Route
          path="/courses/:courseId/content"
          element={
            <MainLayout>
              <CourseContent />
            </MainLayout>
          }
        />
        <Route
          path="/payment/result"
          element={
            <MainLayout>
              <PaymentResult />
            </MainLayout>
          }
        />
        <Route
          path="/payment/success"
          element={
            <MainLayout>
              <PaymentSuccess />
            </MainLayout>
          }
        />
        <Route
          path="/payment/failure"
          element={
            <MainLayout>
              <PaymentFailure />
            </MainLayout>
          }
        />
        <Route
          path="/payment/failed"
          element={
            <MainLayout>
              <PaymentFailure />
            </MainLayout>
          }
        />
        <Route
          path="/about"
          element={
            <MainLayout>
              <About />
            </MainLayout>
          }
        />
        <Route path="/blog" element={<Blog />} />
        <Route
          path="/contact"
          element={
            <MainLayout>
              <Contact />
            </MainLayout>
          }
        />

        <Route element={<ProtectedRoute allowedRoles={['user', 'teacher', 'admin']} />}>
          <Route path="/dashboard" element={<UserDashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="basket" element={<Basket />} />
            <Route path="profile" element={<EditProfile />} />
            <Route path="support" element={<Support />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboardLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Route>

        {/* TODO: Add more routes as needed */}
        <Route
          path="*"
          element={
            <MainLayout>
              <NotFoundPage />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  )
}

export default App

