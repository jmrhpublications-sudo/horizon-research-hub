import { useState } from "react";
import { Link } from "react-router-dom";
import { useJMRH } from "@/context/JMRHContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, Send } from "lucide-react";

interface ReviewFormProps {
    onReviewSubmitted?: () => void;
}

const ReviewForm = ({ onReviewSubmitted }: ReviewFormProps) => {
    const { currentUser, addReview } = useJMRH();
    const { toast } = useToast();
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
            toast({ title: "Error", description: "Please write a review", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            await addReview(content.trim(), rating);
            setContent("");
            setRating(5);
            toast({ title: "Thank you!", description: "Your review has been submitted successfully." });
            onReviewSubmitted?.();
        } catch (error) {
            toast({ title: "Error", description: "Failed to submit review", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!currentUser) {
        return (
            <div className="bg-oxford/5 border border-oxford/10 p-8 text-center">
                <h3 className="font-serif text-xl font-bold text-oxford mb-2">Share Your Experience</h3>
                <p className="text-oxford/60 mb-4">Please login to rate and review JMRH Publications</p>
                <Link to="/auth">
                    <Button className="bg-oxford hover:bg-gold">
                        Login to Review
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white border border-black/5 p-6">
            <h3 className="font-serif text-xl font-bold text-oxford mb-4">Write a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-oxford/70 mb-2">Your Rating</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star
                                    className={`w-8 h-8 ${
                                        star <= rating
                                            ? "fill-gold text-gold"
                                            : "fill-gray-200 text-gray-300"
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-oxford/50 mt-1">
                        {rating === 5 ? "Excellent" : rating === 4 ? "Very Good" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}
                    </p>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-oxford/70 mb-2">Your Review</label>
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Share your experience with JMRH Publications..."
                        className="min-h-[120px]"
                        maxLength={500}
                    />
                    <p className="text-xs text-oxford/50 mt-1 text-right">{content.length}/500</p>
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    className="w-full bg-oxford hover:bg-gold"
                >
                    {isSubmitting ? (
                        "Submitting..."
                    ) : (
                        <>
                            <Send size={16} className="mr-2" />
                            Submit Review
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
};

export default ReviewForm;
