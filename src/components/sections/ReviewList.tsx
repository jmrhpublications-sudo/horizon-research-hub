import { useJMRH } from "@/context/JMRHContext";
import { Star, User, Clock } from "lucide-react";

interface ReviewListProps {
    maxReviews?: number;
}

const ReviewList = ({ maxReviews }: ReviewListProps) => {
    const { reviews } = useJMRH();
    
    // Sort reviews by most recent
    const sortedReviews = [...reviews].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    const displayReviews = maxReviews ? sortedReviews.slice(0, maxReviews) : sortedReviews;
    
    // Calculate average rating
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : "0";

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    if (reviews.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-oxford/50">No reviews yet. Be the first to review!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Rating Summary */}
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <span className="text-4xl font-bold text-oxford">{averageRating}</span>
                    <div className="flex flex-col">
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 ${
                                        star <= Math.round(Number(averageRating))
                                            ? "fill-gold text-gold"
                                            : "fill-gray-200 text-gray-300"
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-oxford/50">{reviews.length} reviews</span>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {displayReviews.map((review) => (
                    <div
                        key={review.id}
                        className="bg-white border border-black/5 p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-oxford/10 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-oxford" />
                                </div>
                                <div>
                                    <p className="font-medium text-oxford">{review.userName}</p>
                                    <div className="flex items-center gap-1 text-xs text-oxford/50">
                                        <Clock size={12} />
                                        {formatDate(review.createdAt)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-4 h-4 ${
                                            star <= review.rating
                                                ? "fill-gold text-gold"
                                                : "fill-gray-200 text-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-oxford/70 text-sm leading-relaxed">{review.content}</p>
                    </div>
                ))}
            </div>
            
            {maxReviews && reviews.length > maxReviews && (
                <p className="text-center text-sm text-oxford/50">
                    Showing {maxReviews} of {reviews.length} reviews
                </p>
            )}
        </div>
    );
};

export default ReviewList;
