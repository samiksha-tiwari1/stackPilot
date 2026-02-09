import { prisma } from "@/lib/prisma";

type DocPageProps = {
  params: { id: string };
};

export default async function DocView(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const doc = await prisma.doc.findUnique({
    where: { id: params.id },
  });

  if (!doc) {
    return <div className="p-8">Document not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-semibold mb-6">{doc.title}</h1>
      <p className="whitespace-pre-wrap">{doc.content}</p>
    </div>
  );
}