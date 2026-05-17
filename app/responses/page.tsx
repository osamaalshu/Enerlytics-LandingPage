import { notFound } from "next/navigation";
import type { EnquiryRecord } from "@/lib/enquiries-store";
import { listEnquiries } from "@/lib/enquiries-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function messagePreview(message: string) {
  return message.length > 160 ? `${message.slice(0, 160)}...` : message;
}

function isAuthorized(secret: string | undefined, key: string | undefined) {
  return Boolean(secret) && Boolean(key) && key === secret;
}

export default async function ResponsesPage({
  searchParams,
}: {
  searchParams?: Promise<{ key?: string }>;
}) {
  const key = (await searchParams)?.key;
  const secret = process.env.RESPONSES_PAGE_SECRET;

  if (!isAuthorized(secret, key)) {
    notFound();
  }

  const enquiries = await listEnquiries();

  return (
    <main className="min-h-screen bg-mist px-4 py-10 text-navy sm:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="text-3xl font-bold tracking-tight">Demo enquiries</h1>
        <p className="mt-2 text-sm text-navy/65">
          Total enquiries: <span className="font-semibold text-navy">{enquiries.length}</span>
        </p>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-navy/10 bg-white shadow-[var(--shadow-soft)]">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-navy/5 text-[12px] uppercase tracking-[0.08em] text-navy/70">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Consumption</th>
                <th className="px-4 py-3">Message</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enquiry: EnquiryRecord) => (
                <tr key={enquiry.id} className="border-t border-navy/8 align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-navy/70">
                    {formatDate(enquiry.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-medium">{enquiry.name}</td>
                  <td className="px-4 py-3">{enquiry.company}</td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${enquiry.email}`} className="text-blue hover:underline">
                      {enquiry.email}
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{enquiry.consumptionLabel}</td>
                  <td className="min-w-[320px] px-4 py-3 text-navy/80" title={enquiry.message}>
                    {messagePreview(enquiry.message)}
                  </td>
                </tr>
              ))}
              {enquiries.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-navy/55" colSpan={6}>
                    No enquiries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
