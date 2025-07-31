"use client";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export type RichTextEditorProps = {
    value: any;
    setValue: (value: any) => void;
};

const fullToolbarOptions = [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
];

const RichTextEditor = ({ value, setValue }: RichTextEditorProps) => {
    return (
        <ReactQuill
            theme="snow"
            modules={{
                toolbar: fullToolbarOptions,
            }}
            value={value}
            onChange={setValue}
            className="bg-gray-400"
        />
    );
};

export default RichTextEditor;
