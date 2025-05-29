

import BookCreation from "./pages/BookCreation";
import BookEditor from "./pages/BookEditor";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage"
import Dashboard from "./pages/Dashboard";
import BookProjects from "./pages/BookProjects";
import NewProject from "./pages/BookCreation";
import BookPreview from "./pages/BookPreview";
import UserProfile from "./pages/Profile";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>      
      <Routes>
        {/* Define your routes */}  
        <Route path="/" element={<HomePage />} />
        <Route path="/createbook" element={<BookCreation />} />
        <Route path="/editor/:id" element={<BookEditor />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<BookProjects />} />
        <Route path="/new-project" element={<NewProject />} />
        <Route path="/preview" element={<BookPreview />} />
        <Route path="/profile" element={<UserProfile />} />
        {/* Catch-all route for 404 pages */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;