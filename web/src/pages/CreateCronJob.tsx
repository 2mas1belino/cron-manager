import { CronJobForm } from '../components/CronJobForm';

export function CreateCron() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">Create Cron Job</h1>
      <CronJobForm />
    </div>
  );
}