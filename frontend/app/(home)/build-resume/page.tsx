"use client";

import ContainerWrapper from "@/components/common/containerWrapper";
import { Button } from "@/components/ui/button";
import {
    Document,
    Page as PdfPage,
    StyleSheet,
    Text,
    View,
} from "@react-pdf/renderer";
import { Plus } from "lucide-react";
import Link from "next/link";
const styles = StyleSheet.create({
    page: {
        flexDirection: "row",
        backgroundColor: "#E4E4E4",
        transform: "scale(1)",
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
});
const Page = () => {
    return (
        <>
            <ContainerWrapper>
                <div className="mt-6 pt-16 pb-12">
                    <div className="flex flex-col gap-5">
                        <div className="mt-10">
                            <Button
                                className="w-[200px] h-[300px] border border-dashed cursor-pointer"
                                variant={"ghost"}
                            >
                                <Plus className="font-bold text-xl" />
                            </Button>
                            <p className="font-medium mt-3">
                                Create New Resume
                            </p>
                        </div>

                        <h2 className="text-2xl font-semibold text-foreground py-5">
                            Recent Resume's
                        </h2>

                        <div>
                            <Button
                                className="w-[200px] h-[300px] border border-dashed cursor-pointer"
                                variant={"ghost"}
                                asChild
                            >
                                <Link href="/build-resume/id">
                                    <Document
                                        pageMode="useNone"
                                        style={{
                                            transform: "scale(0.6)",
                                        }}
                                    >
                                        <PdfPage style={styles.page}>
                                            <View style={styles.section}>
                                                <Text>Section #1</Text>
                                                <Text>Section hello</Text>
                                            </View>
                                            <View style={styles.section}>
                                                <Text>Section #2</Text>
                                            </View>
                                        </PdfPage>
                                    </Document>
                                </Link>
                            </Button>
                            <p className="font-medium mt-3">Resume 1</p>
                        </div>
                    </div>
                </div>
            </ContainerWrapper>
        </>
    );
};

export default Page;
