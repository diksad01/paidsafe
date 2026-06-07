import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, ProtectedRoute, GuestRoute } from "../components/auth";
import AppLayout from "../layouts/AppLayout";
import {
  HomePage,
  LoginPage,
  SignupPage,
  DashboardPage,
  NewContractPage,
  ContractPage,
  ClientViewPage,
} from "../pages";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contract/:id/client" element={<ClientViewPage />} />

          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/contract/new" element={<NewContractPage />} />
              <Route path="/contract/:id" element={<ContractPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;