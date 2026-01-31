import "../globals.css";
import { redirect } from "next/navigation";
import Navbar from '../components/Navbar.js';
import Sidebar from '../components/Sidebar.js';
import Settings from '../components/settings/Settings.js';
import NewJob from '../components/NewJob/NewJob.js';
import { SettingsProvider } from "../context/SettingsContext";
import { LocationProvider } from "../context/LocationContext";
import { StatusProvider } from "../context/StatusContext";
import { NewJobProvider } from "../context/NewJobContext";
import { BillablesCategoryProvider } from "../context/BillablesContext";
import { JobTabProvider } from "../context/JobTabContext";
import { OrganizationProvider } from "../context/OrganizationContext";
import { getOrganization } from "./jobs/actions";

export const metadata = {
  title: "TradeFlow Dashboard",
  description: "Manage your trade business",
};

export default async function DashboardLayout({ children }) {
  // Fetch organization data server-side
  const organization = await getOrganization()
  if (!organization.data || organization.error) {
    console.error('Failed to load organization:', organization.error)
    redirect('/organization')  // Redirects to setup page
    }





  return (
    <JobTabProvider>
      <BillablesCategoryProvider>
        <SettingsProvider>
          <NewJobProvider>
            <LocationProvider>
              <StatusProvider>
                <OrganizationProvider initialOrganization={organization.data}>
                  <Navbar/>
                  <Sidebar/>
                  <main style={{marginLeft:'240px'}}>
                    {children}
                  </main>

                  <Settings />
                  <NewJob/>
                </OrganizationProvider>
              </StatusProvider>
            </LocationProvider>
          </NewJobProvider>
        </SettingsProvider>
      </BillablesCategoryProvider>
    </JobTabProvider>
  );
}
