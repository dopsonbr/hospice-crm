import { Suspense } from 'react';
import NewFacilityForm from './new-facility-form';

export const dynamic = 'force-dynamic';

export default function NewFacilityPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <NewFacilityForm />
    </Suspense>
  );
}
