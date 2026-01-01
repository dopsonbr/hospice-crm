import { Suspense } from 'react';
import EditFacilityForm from './edit-facility-form';

export const dynamic = 'force-dynamic';

export default function EditFacilityPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <EditFacilityForm />
    </Suspense>
  );
}
