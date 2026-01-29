import { Job } from "./types"
import { getJobs } from "./actions"
import ClientWrapper from "./ClientWrapper"

export default async function JobsListingPage() {
    const result = await getJobs()

    // Handle error case
    if (!Array.isArray(result)) {
        return <div>Error loading jobs</div>
    }

    const jobs: Job[] = result

    return <ClientWrapper jobs={jobs}/>
}
