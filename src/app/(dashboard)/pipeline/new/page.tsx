import { Suspense } from 'react';
import NewDealForm from './new-deal-form';

export const dynamic = 'force-dynamic';

export default function NewDealPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <NewDealForm />
    </Suspense>
  );
}
