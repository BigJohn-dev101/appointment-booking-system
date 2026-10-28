import AppRoutes from "./routes/AppRoutes";
import Services from "./pages/dashboard/provider/Services";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
        }}
      />
    </AuthProvider>
  );
}