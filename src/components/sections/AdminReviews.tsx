import { useState } from "react";
import { useJMRH, Review } from "@/context/JMRHContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, User, Clock, Edit, Trash2, X, Check } from "lucide-react";

const AdminReviews = () => {
    const { reviews, updateReview, deleteReview } = useJMRH();
    const { toast } = useToast();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [editRating, setEditRating] = useState(5);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Sort reviews by most recent
    const sortedReviews = [...reviews].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const handleEdit = (review: Review) => {
        setEditingId(review.id);
        setEditContent(review.content);
        setEditRating(review.rating);
    };

    const handleSaveEdit = async (reviewId: string) => {
        if (!editContent.trim()) {
            toast({ title: "Error", description: "Review content cannot be empty", variant: "destructive" });
            return;
        }

        try {
            await updateReview(reviewId, editContent.trim(), editRating);
            setEditingId(null);
            toast({ title: "Success", description: "Review updated successfully" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to update review", variant: "destructive" });
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditContent("");
        setEditRating(5);
    };

    const handleDelete = async (reviewId: string) => {
        try {
            await deleteReview(reviewId);
            setDeletingId(null);
            toast({ title: "Success", description: "Review deleted successfully" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete review", variant: "destructive" });
        }
    };

    // Calculate average rating
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : "0";

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-oxford/50">No reviews yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Summary */}
            <div className="flex items-center justify-between bg-oxford/5 p-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-oxford">{averageRating}</span>
                        <div className="flex flex-col">
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-4 h-4 ${
                                            star <= Math.round(Number(averageRating))
                                                ? "fill-gold text-gold"
                                                : "fill-gray-300 text-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-oxford/50">{reviews.length} total reviews</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Table */}
            <div className="bg-white border border-black/5 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-oxford/5">
                        <tr>
                            <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">User</th>
                            <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Rating</th>
                            <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Review</th>
                            <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Date</th>
                            <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                        {sortedReviews.map((review) => (
                            <tr key={review.id} className="hover:bg-oxford/5 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-oxford/10 rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-oxford" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-oxford text-sm">{review.userName}</p>
                                            <p className="text-xs text-oxford/50">{review.userId.slice(0, 8)}...</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    {editingId === review.id ? (
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setEditRating(star)}
                                                    className="focus:outline-none"
                                                >
                                                    <Star
                                                        className={`w-5 h-5 ${
                                                            star <= editRating
                                                                ? "fill-gold text-gold"
                                                                : "fill-gray-200 text-gray-300"
                                                        }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
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
                                    )}
                                </td>
                                <td className="p-4 max-w-xs">
                                    {editingId === review.id ? (
                                        <Textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="min-h-[80px] text-sm"
                                            maxLength={500}
                                        />
                                    ) : (
                                        <p className="text-sm text-oxford/70 line-clamp-2">{review.content}</p>
                                    )}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1 text-xs text-oxford/50">
                                        <Clock size={12} />
                                        {formatDate(review.createdAt)}
                                    </div>
                                </td>
                                <td className="p-4">
                                    {editingId === review.id ? (
                                        <div className="flex gap-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                onClick={() => handleSaveEdit(review.id)}
                                            >
                                                <Check size={14} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={handleCancelEdit}
                                            >
                                                <X size={14} />
                                            </Button>
                                        </div>
                                    ) : deletingId === review.id ? (
                                        <div className="flex gap-1 items-center">
                                            <span className="text-xs text-red-600">Delete?</span>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-600 hover:text-red-700"
                                                onClick={() => handleDelete(review.id)}
                                            >
                                                <Check size={14} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setDeletingId(null)}
                                            >
                                                <X size={14} />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                onClick={() => handleEdit(review)}
                                            >
                                                <Edit size={14} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => setDeletingId(review.id)}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminReviews;
