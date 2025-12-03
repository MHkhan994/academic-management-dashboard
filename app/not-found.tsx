import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/global/PageHeader";

export default function NotFound() {
  return (
    <div>
      <PageHeader title="Page not found!" className="px-4 pt-3" />
      <div className="flex items-center flex-col lg:flex-row gap-10 p-4 justify-center h-[70vh]">
        <Image
          src={"/not-found.png"}
          alt="not-found image"
          height={400}
          width={500}
          className="w-xs h-auto"
        />

        <div className="space-y-4 text-center lg:text-start">
          <h1 className="md:text-5xl sm:text-3xl text-2xl font-semibold">
            Opps!
          </h1>
          <p className="md:text-xl text-lg font-medium">
            Sorry, We could not find the page you were looking for.
          </p>
          <Link href={"/"}>
            <Button size={"lg"} variant={"secondary"}>
              {" "}
              <ArrowLeft size={18} /> Go To Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
