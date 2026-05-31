import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar .tsx";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;