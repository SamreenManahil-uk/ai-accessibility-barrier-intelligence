import {
  Route,
  Routes,
} from "react-router-dom";

import AppShell from "./components/layout/AppShell";
import DiscoverPage from "./pages/DiscoverPage";
import VisionLabPage from "./pages/VisionLabPage";
import ScanLibraryPage from "./pages/ScanLibraryPage";
import InsightsPage from "./pages/InsightsPage";
import BarrierGuidePage from "./pages/BarrierGuidePage";
import ModelLabPage from "./pages/ModelLabPage";
import PreferencesPage from "./pages/PreferencesPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route
          path="/"
          element={<DiscoverPage />}
        />

        <Route
          path="/vision-lab"
          element={<VisionLabPage />}
        />

        <Route
          path="/library"
          element={<ScanLibraryPage />}
        />

        <Route
          path="/insights"
          element={<InsightsPage />}
        />

        <Route
          path="/barriers"
          element={<BarrierGuidePage />}
        />

        <Route
          path="/model"
          element={<ModelLabPage />}
        />

        <Route
          path="/preferences"
          element={<PreferencesPage />}
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Route>
    </Routes>
  );
}
