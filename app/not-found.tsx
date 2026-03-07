import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="card space-y-2 text-center">
      <h2 className="text-2xl font-bold">Team not found</h2>
      <p className="text-slate-300">The roster you are looking for is no longer available.</p>
      <Link href="/" className="font-medium text-accent hover:underline">
        Return to league homepage
      </Link>
    </div>
  );
}
