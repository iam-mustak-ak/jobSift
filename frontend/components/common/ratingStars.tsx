type StarRatingProps = {
    rating: number; // 0–5
};

export default function StarRating({ rating }: StarRatingProps) {
    return (
        <div className="star-rating" style={{ ["--rating" as any]: rating }} />
    );
}
