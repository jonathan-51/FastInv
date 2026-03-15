import "../globals.css";
import Navbar from '../components/Navbar.js';
import Sidebar from '../components/Sidebar.js';
import Settings from '../components/settings/Settings.js';
import { SettingsProvider } from "../context/SettingsContext";
import { BillablesCategoryProvider } from "../context/BillablesContext";
import { BusinessDetailsProvider } from "../context/BusinessDetailsContext";

export const metadata = {
  title: "FastInv",
  description: "Create invoices and export to PDF",
};

export default function DashboardLayout({ children }) {
  return (
    <BillablesCategoryProvider>
      <SettingsProvider>
        <BusinessDetailsProvider>
          <Navbar/>
          <Sidebar/>
          <main style={{marginLeft:'240px'}}>
            {children}
          </main>
          <Settings />
        </BusinessDetailsProvider>
      </SettingsProvider>
    </BillablesCategoryProvider>
  );
}
