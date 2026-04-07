import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import ScrollToTop from "./components/ScrollToTop";
import LandingHome from "./pages/LandingHome";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Store from "./pages/Store";
import Admin from "./pages/Admin";
import Galleries from "./pages/Galleries";
import BtsGallery from "./pages/BtsGallery";
import BlackpinkGallery from "./pages/BlackpinkGallery";
import Biographies from "./pages/Biographies";
import BtsBiographies from "./pages/BtsBiographies";
import BlackpinkBiographies from "./pages/BlackpinkBiographies";
import StrayKidsBiographies from "./pages/StrayKidsBiographies";
import TwiceBiographies from "./pages/TwiceBiographies";
import NewJeansBiographies from "./pages/NewJeansBiographies";
import IveBiographies from "./pages/IveBiographies";
import TxtBiographies from "./pages/TxtBiographies";
import Stories from "./pages/Stories";
import PurchaseHistory from "./pages/PurchaseHistory";
import News from "./pages/News";
import Diploma from "./pages/Diploma";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Quizzes from "./pages/Quizzes";
import Calendar from "./pages/Calendar";
import { MobileBottomNav } from "./components/MobileBottomNav";


function Router() {
  return (
    <>
      <Switch>
      <Route path="/" component={LandingHome} />
      <Route path="/success" component={Success} />
      <Route path="/cancel" component={Cancel} />
      <Route path="/tienda" component={Store} />
      <Route path="/galerias" component={Galleries} />
      <Route path="/galerias/bts" component={BtsGallery} />
      <Route path="/galerias/blackpink" component={BlackpinkGallery} />
      <Route path="/biografias" component={Biographies} />
      <Route path="/biografias/bts" component={BtsBiographies} />
      <Route path="/biografias/blackpink" component={BlackpinkBiographies} />
      <Route path="/biografias/straykids" component={StrayKidsBiographies} />
      <Route path="/biografias/twice" component={TwiceBiographies} />
      <Route path="/biografias/newjeans" component={NewJeansBiographies} />
      <Route path="/biografias/ive" component={IveBiographies} />
      <Route path="/biografias/txt" component={TxtBiographies} />
      <Route path="/historias" component={Stories} />
      <Route path="/mi-historial" component={PurchaseHistory} />
      <Route path="/noticias" component={News} />
      <Route path="/diploma" component={Diploma} />
      <Route path="/terminos" component={Terms} />
      <Route path="/privacidad" component={Privacy} />
      <Route path="/quizzes" component={Quizzes} />
      <Route path="/calendario" component={Calendar} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/" component={Admin} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
      <MobileBottomNav />
    </>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <ScrollToTop />
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
