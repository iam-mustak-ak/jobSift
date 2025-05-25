const IconInfo = ({
    icon,
    label,
}: {
    icon: React.ReactNode;
    label: string;
}) => {
    return (
        <div className="flex items-center gap-2">
            {icon}
            <p className="text-muted-foreground">{label}</p>
        </div>
    );
};

export default IconInfo;
