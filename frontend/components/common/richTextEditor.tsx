"use client";

import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const RichTextEditor = () => {
    const [value, setValue] = useState("");
    return <ReactQuill theme="snow" value={value} onChange={setValue} />;
};

export default RichTextEditor;
