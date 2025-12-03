import { Button } from "@/components/ui/button";

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/students`);

  console.log(await res.json());

  return (
    <div className="h-screen">
      <Button>Hello</Button>
      <Button variant={"secondary"}>World</Button>
    </div>
  );
}
