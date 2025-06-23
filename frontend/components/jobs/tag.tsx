type tagtype = "fulltime" | "private" | "remote";

const types: Record<tagtype, string> = {
    fulltime: "bg-[#1967D2]/15 text-[#1967D2]",
    private: "bg-[#87E64B]/15 text-[#87E64B]",
    remote: "bg-[#F9AB00]/15 text-[#F9AB00]",
};

const Tag = ({ type }: { type: tagtype }) => {
    return (
        <p
            className={`py-2 px-4  rounded-full inline text-sm ${
                types[type as tagtype]
            }`}
        >
            {type}
        </p>
    );
};

export default Tag;
