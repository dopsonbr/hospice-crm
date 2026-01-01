import { Suspense } from 'react';
import NewContactForm from './new-contact-form';

export const dynamic = 'force-dynamic';

export default function NewContactPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <NewContactForm />
    </Suspense>
  );
}
