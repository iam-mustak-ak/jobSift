"use client";
import dynamic from "next/dynamic";
import { RichTextEditorProps } from "./richTextEditor";

const DynamicTextEditor = dynamic(() => import("./richTextEditor"), {
    loading: () => <p>loading...</p>,

    ssr: false,
});

const EditorWrapper = ({ value, setValue, className }: RichTextEditorProps) => {
    return (
        <DynamicTextEditor
            value={value}
            setValue={setValue}
            className={className}
        />
    );
};

export default EditorWrapper;
