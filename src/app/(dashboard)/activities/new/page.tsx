import { Suspense } from 'react';
import NewActivityForm from './new-activity-form';

export const dynamic = 'force-dynamic';

export default function NewActivityPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <NewActivityForm />
    </Suspense>
  );
}
