"use client";
import { useParams } from "next/navigation";
import KidsProfile from "../../components/KidsProfile";

const Page = () => {
  const params = useParams<{ id: string }>(); // ✅ strongly type the param
  const id = params?.id;

  if (!id) {
    return <div>No kid selected</div>; // handle undefined safely
  }

  return (
    <div>
      <KidsProfile kidId={id} />
    </div>
  );
};

export default Page;
