import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import EquipmentInventory from "@/pages/EquipmentInventory";
import EquipmentDetails from "@/pages/EquipmentDetails";
import PartsCatalog from "@/pages/PartsCatalog";
import PartsCategory from "@/pages/PartsCategory";
import QuoteRequest from "@/pages/QuoteRequest";
import ServiceDismantling from "@/pages/ServiceDismantling";
import ServiceInspection from "@/pages/ServiceInspection";
import ServiceTransportation from "@/pages/ServiceTransportation";
import ServiceShipping from "@/pages/ServiceShipping";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

function ScrollToTop() {
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/equipment" component={EquipmentInventory} />
      <Route path="/equipment/:id" component={EquipmentDetails} />
      <Route path="/parts" component={PartsCatalog} />
      <Route path="/parts/:category" component={PartsCategory} />
      <Route path="/quote" component={QuoteRequest} />
      <Route path="/services/dismantling" component={ServiceDismantling} />
      <Route path="/services/inspection" component={ServiceInspection} />
      <Route path="/services/transportation" component={ServiceTransportation} />
      <Route path="/services/shipping" component={ServiceShipping} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
