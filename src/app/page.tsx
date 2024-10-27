import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return <div className="">{JSON.stringify(session)}</div>;
}
 