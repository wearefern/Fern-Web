import { redirect } from 'next/navigation';

export default async function ContentPage({
  params,
}: {
  params: { slug: string };
}) {
  redirect(`/insights/${params.slug}`);
}
