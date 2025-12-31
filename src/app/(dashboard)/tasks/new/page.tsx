import { Suspense } from 'react';
import NewTaskForm from './new-task-form';

export const dynamic = 'force-dynamic';

export default function NewTaskPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <NewTaskForm />
    </Suspense>
  );
}
