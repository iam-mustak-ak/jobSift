"use client";
import dynamic from "next/dynamic";

const DynamicTextEditor = dynamic(() => import("./richTextEditor"), {
    loading: () => <p>loading...</p>,

    ssr: false,
});

const EditorWrapper = () => {
    return <DynamicTextEditor />;
};

export default EditorWrapper;
