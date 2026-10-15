//libraries
import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

//components
import Header from "./layout/header/index";
import Footer from "./layout/footer/index";
//pages
const Auth = lazy(() => import("./pages/auth/index"));
const Profile = lazy(() => import("./pages/profile/index"));
const Dashboard = lazy(() => import("./pages/dashboard/index"));
const Home = lazy(() => import("./pages/home/index"));
const PageNotFound = lazy(() => import("./pages/error/index"));

const About = lazy(() => import("./pages/about/index"));
const Contact = lazy(() => import("./pages/contact/index"));
const Policy = lazy(() => import("./pages/policy/index"));

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10 sm:px-8 lg:px-12">
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/designs" element={<><h1>Interior Designs</h1><p>Explore inspiring spaces. Designs coming soon.</p></>} />
          <Route path="/companies" element={<><h1>Companies</h1><p>Find the right professionals for your home. Directory coming soon.</p></>} />
          <Route path="/auth/*" element={<Auth />} />
          <Route path="/profile/*" element={<Profile />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
