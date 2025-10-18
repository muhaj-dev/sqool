"use client";
import { useParams } from "next/navigation";
import KidsProfile from "../../components/KidsProfile";

const Page = () => {
  const params = useParams();
  const id = params.id; // This is your [id] from the route

  return (
    <div>
      {/* <h1>Kid ID: {id}</h1> */}
      <KidsProfile kidId={id} />
    </div>
  );
};

export default Page;