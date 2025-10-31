"use client";
import ContainerWrapper from "@/components/common/containerWrapper";
import CreateResumeBtn from "@/components/resume/createResumeBtn";
import { Button } from "@/components/ui/button";
import ResumeCardSkeleton from "@/lib/loaders/resumeLoader";
import { ResumeDataTypes } from "@/state/store";
import { fetcherClient } from "@/utils/fetcherClient";
import { Loader2, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
// export const dynamic = "force-static";

const Page = () => {
    const [data, setData] = useState<Record<string, any>>();
    const [loading, setLoading] = useState<boolean>(false);
    const [deleteLoader, setDeleteLoader] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        const fetchResume = async () => {
            const resume = await fetcherClient(`/resume/get-all-resume`);

            if (resume.success) {
                setData(resume);
                setLoading(false);
            }
        };

        fetchResume();
    }, []);

    const handleDeleteResume = async (resumeId: string) => {
        // setLoading(true);
        setDeleteLoader(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/resume/delete-resume/${resumeId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );

            if (!res.ok) {
                toast.error("error");
            }

            const newData = data?.data.filter(
                (dataItem: ResumeDataTypes & { _id: string }) =>
                    dataItem._id !== resumeId
            );
            setData({ data: newData });

            toast.success("Deleted");
        } catch (error) {
            toast.error("Error While Deleting");
        } finally {
            // setLoading(false);
            setDeleteLoader(false);
        }
    };

    return (
        <>
            <ContainerWrapper>
                <div className="mt-6 pt-16 pb-12">
                    <div className="flex flex-col gap-5">
                        <div className="mt-10">
                            <CreateResumeBtn />
                            <p className="font-medium mt-3">
                                Create New Resume
                            </p>
                        </div>

                        <h2 className="text-2xl font-semibold text-foreground py-5">
                            Recent Resume's
                        </h2>

                        {loading ? (
                            <ResumeCardSkeleton />
                        ) : (
                            <div className="flex items-stretch gap-5 flex-wrap">
                                {data?.data && data.data.length > 0
                                    ? data.data?.map(
                                          (item: Record<string, any>) => (
                                              <div
                                                  key={item._id}
                                                  className="relative"
                                              >
                                                  <Button
                                                      variant="ghost"
                                                      className="absolute right-0 cursor-pointer rounded-full"
                                                      onClick={() =>
                                                          handleDeleteResume(
                                                              item._id
                                                          )
                                                      }
                                                      disabled={deleteLoader}
                                                  >
                                                      {deleteLoader ? (
                                                          <Loader2 className="animate-spin" />
                                                      ) : (
                                                          <Trash />
                                                      )}
                                                  </Button>

                                                  <Button
                                                      className="w-[200px] h-[300px] border border-dashed cursor-pointer"
                                                      variant={"ghost"}
                                                      asChild
                                                  >
                                                      <Link
                                                          href={`/build-resume/${item._id}/edit`}
                                                      >
                                                          <Image
                                                              src="https://placehold.co/200x300/png?text=thumbnail&font=roboto"
                                                              width={200}
                                                              height={300}
                                                              alt="Thumbnail"
                                                          />
                                                      </Link>
                                                  </Button>
                                                  <p className="font-medium mt-3">
                                                      {item.resumeName}
                                                  </p>
                                              </div>
                                          )
                                      )
                                    : null}
                            </div>
                        )}
                    </div>
                </div>
            </ContainerWrapper>
        </>
    );
};

export default Page;
