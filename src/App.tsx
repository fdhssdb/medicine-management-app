import { Routes, Route } from "react-router-dom";
import "./App.css";
import MyLayout from "./components/MyLayout";
import DashBoard from "./pages/dashboard";
import Users from "./pages/users";
import MedicineCategories from "./pages/medicine/categories";
import MedicineList from "./pages/medicine/list";
import ArticleCategories from "./pages/articles/categories";
import ArticleList from "./pages/articles/list";

function App() {
  return (
    <MyLayout>
      <Routes>
        <Route path="dashboard" element={<DashBoard />} />
        <Route path="medicine/categories" element={<MedicineCategories />} />
        <Route path="medicine/list" element={<MedicineList />} />
        <Route path="articles/categories" element={<ArticleCategories />} />
        <Route path="articles/list" element={<ArticleList />} />
        <Route path="users" element={<Users />} />
      </Routes>
    </MyLayout>
  );
}

export default App;
