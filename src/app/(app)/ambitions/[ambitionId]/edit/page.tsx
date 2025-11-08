interface EditAmbitionPageProps {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EditAmbitionPage(props: EditAmbitionPageProps) {
  return (
    <>
      <h1>Edit Ambition</h1>
    </>
  );
}
