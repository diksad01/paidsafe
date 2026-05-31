import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "../../layouts/AppLayout";
import {
  HomePage,
  LoginPage,
  DashboardPage,
  NewContractPage,
  ContractPage,
} from "../../pages";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/contract/new" element={<NewContractPage />} />
          <Route path="/contract/:id" element={<ContractPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;