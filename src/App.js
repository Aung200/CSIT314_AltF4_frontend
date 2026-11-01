//libraries
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

//components
import Header from "./layout/header/index";
import Footer from "./layout/footer/index";

//pages
const AuthPage = lazy(() => import("./pages/auth/AuthPage"));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const HomePage = lazy(() => import("./pages/home/HomePage"));
const CompaniesPage = lazy(() => import("./pages/companies/CompaniesPage"));
const DesignsPage = lazy(() => import("./pages/designs/DesignsPage"));
const DesignDetailsPage = lazy(() => import("./pages/designs/DesignDetailsPage"));
const PageNotFoundPage = lazy(() => import("./pages/error/PageNotFoundPage"));

const AboutPage = lazy(() => import("./pages/about/AboutPage"));
const ContactPage = lazy(() => import("./pages/contact/ContactPage"));
const PolicyPage = lazy(() => import("./pages/policy/PolicyPage"));

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10 sm:px-8 lg:px-12">
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/designs" element={<DesignsPage />} />
          <Route path="/designs/:designId" element={<DesignDetailsPage />} />
          <Route path="/interior-designs" element={<Navigate to="/designs" replace />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/auth/*" element={<AuthPage />} />
          <Route path="/profile/*" element={<ProfilePage />} />
          <Route path="/dashboard/*" element={<DashboardPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/policy" element={<PolicyPage />} />
          <Route path="*" element={<PageNotFoundPage />} />
        </Routes>
      </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
