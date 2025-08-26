import { CronJobForm } from '../components/CronJobForm';
import { PageHeader } from "../components/PageHeader";

export function CreateCron() {
  return (
    <div>
      <PageHeader title="CRON jobs manager"></PageHeader>
      <h1 className="text-2xl font-bold mb-4 text-center">Create Cron Job</h1>
      <CronJobForm />
    </div>
  );
}