import { redirect } from 'next/navigation';

export default function ContentPage({
  params,
}: {
  params: { slug: string };
}) {
  redirect(`/insights/${params.slug}`);
}
