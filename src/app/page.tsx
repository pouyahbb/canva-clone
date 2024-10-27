import { auth } from "@/auth";
import { protectServer } from "@/features/auth/utils";

export default async function Home() {
  await protectServer();

  return <div>you are logged in</div>;
}
