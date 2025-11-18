import AdminParentDetail from "./AdminParentDetail";

interface PageParams {
  parentId: string;
}

const Page = async ({ params }: { params: Promise<PageParams> }) => {
  const { parentId } = await params;

  return <AdminParentDetail parentId={parentId} />;
};

export default Page;
