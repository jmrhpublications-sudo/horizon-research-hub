import { useState, useMemo } from "react";
import { useJMRH, Review } from "@/context/JMRHContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
    Star, User, Clock, Edit, Trash2, X, Check, Search, 
    Filter, CheckSquare, Square, TrendingUp, MessageSquare 
} from "lucide-react";
import { 
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

const AdminReviews = () => {
    const { reviews, updateReview, deleteReview } = useJMRH();
    const { toast } = useToast();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [editRating, setEditRating] = useState(5);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState("");
    const [ratingFilter, setRatingFilter] = useState("all");
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "rating">("newest");

    const sortedReviews = useMemo(() => {
        let filtered = [...reviews];
        
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(r => 
                r.content.toLowerCase().includes(term) || 
                r.userName.toLowerCase().includes(term)
            );
        }
        
        if (ratingFilter !== "all") {
            filtered = filtered.filter(r => r.rating === parseInt(ratingFilter));
        }
        
        filtered.sort((a, b) => {
            if (sortBy === "newest") {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            } else if (sortBy === "oldest") {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            } else {
                return b.rating - a.rating;
            }
        });
        
        return filtered;
    }, [reviews, searchTerm, ratingFilter, sortBy]);

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

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === sortedReviews.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(sortedReviews.map(r => r.id)));
        }
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

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return;
        
        const confirmMsg = `Delete ${selectedIds.size} review(s)? This cannot be undone.`;
        if (!confirm(confirmMsg)) return;

        try {
            for (const id of selectedIds) {
                await deleteReview(id);
            }
            setSelectedIds(new Set());
            toast({ title: "Success", description: `${selectedIds.size} reviews deleted` });
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete some reviews", variant: "destructive" });
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : "0";

    const ratingDistribution = useMemo(() => {
        return [5, 4, 3, 2, 1].map(star => ({
            stars: star,
            count: reviews.filter(r => r.rating === star).length,
            percentage: reviews.length > 0 
                ? (reviews.filter(r => r.rating === star).length / reviews.length * 100).toFixed(0)
                : 0
        }));
    }, [reviews]);

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No reviews yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Summary */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-card border border-border p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-gold" />
                        <span className="text-sm font-bold text-foreground">Average Rating</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-foreground">{averageRating}</span>
                        <span className="text-sm text-muted-foreground">/ 5</span>
                    </div>
                    <div className="flex gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-4 h-4 ${
                                    star <= Math.round(Number(averageRating))
                                        ? "fill-gold text-gold"
                                        : "fill-muted text-muted"
                                }`}
                            />
                        ))}
                    </div>
                </div>
                
                <div className="bg-card border border-border p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-accent" />
                        <span className="text-sm font-bold text-foreground">Total Reviews</span>
                    </div>
                    <span className="text-3xl font-bold text-foreground">{reviews.length}</span>
                    <p className="text-xs text-muted-foreground mt-1">All time</p>
                </div>
                
                <div className="bg-card border border-border p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-bold text-foreground">Selected</span>
                    </div>
                    <span className="text-3xl font-bold text-foreground">{selectedIds.size}</span>
                    <p className="text-xs text-muted-foreground mt-1">For bulk action</p>
                </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-card border border-border p-4">
                <h3 className="font-bold text-foreground text-sm mb-3">Rating Distribution</h3>
                <div className="space-y-2">
                    {ratingDistribution.map(({ stars, count, percentage }) => (
                        <div key={stars} className="flex items-center gap-3">
                            <div className="flex items-center gap-1 w-16">
                                <span className="text-sm font-medium text-foreground">{stars}</span>
                                <Star className="w-3 h-3 fill-gold text-gold" />
                            </div>
                            <div className="flex-1 h-2 bg-muted overflow-hidden rounded-full">
                                <div 
                                    className="h-full bg-gold transition-all" 
                                    style={{ width: `${percentage}%` }} 
                                />
                            </div>
                            <span className="text-xs text-muted-foreground w-12 text-right">{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters and Bulk Actions */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-wrap gap-2">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                            placeholder="Search reviews..." 
                            className="pl-9 w-48 h-9 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={ratingFilter} onValueChange={setRatingFilter}>
                        <SelectTrigger className="w-28 h-9 text-sm">
                            <SelectValue placeholder="Rating" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="5">5 Stars</SelectItem>
                            <SelectItem value="4">4 Stars</SelectItem>
                            <SelectItem value="3">3 Stars</SelectItem>
                            <SelectItem value="2">2 Stars</SelectItem>
                            <SelectItem value="1">1 Star</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                        <SelectTrigger className="w-28 h-9 text-sm">
                            <SelectValue placeholder="Sort" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="oldest">Oldest</SelectItem>
                            <SelectItem value="rating">Rating</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="flex gap-2">
                    {selectedIds.size > 0 && (
                        <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={handleBulkDelete}
                            className="gap-1"
                        >
                            <Trash2 size={14} /> Delete ({selectedIds.size})
                        </Button>
                    )}
                </div>
            </div>

            {/* Reviews Table */}
            <div className="bg-card border border-border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-muted">
                        <tr>
                            <th className="p-3 w-10">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={toggleSelectAll}
                                    className="p-0"
                                >
                                    {selectedIds.size === sortedReviews.length ? (
                                        <CheckSquare className="w-4 h-4 text-accent" />
                                    ) : (
                                        <Square className="w-4 h-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </th>
                            <th className="text-left p-3 text-xs font-bold uppercase text-muted-foreground">User</th>
                            <th className="text-left p-3 text-xs font-bold uppercase text-muted-foreground">Rating</th>
                            <th className="text-left p-3 text-xs font-bold uppercase text-muted-foreground">Review</th>
                            <th className="text-left p-3 text-xs font-bold uppercase text-muted-foreground">Date</th>
                            <th className="text-left p-3 text-xs font-bold uppercase text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {sortedReviews.map((review) => (
                            <tr key={review.id} className={`hover:bg-muted/50 transition-colors ${selectedIds.has(review.id) ? 'bg-accent/5' : ''}`}>
                                <td className="p-3">
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => toggleSelect(review.id)}
                                        className="p-0"
                                    >
                                        {selectedIds.has(review.id) ? (
                                            <CheckSquare className="w-4 h-4 text-accent" />
                                        ) : (
                                            <Square className="w-4 h-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground text-sm">{review.userName}</p>
                                            <p className="text-xs text-muted-foreground">{review.userId.slice(0, 8)}...</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3">
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
                                                                : "fill-muted text-muted"
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
                                                            : "fill-muted text-muted"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </td>
                                <td className="p-3 max-w-xs">
                                    {editingId === review.id ? (
                                        <Textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="min-h-[80px] text-sm"
                                            maxLength={500}
                                        />
                                    ) : (
                                        <p className="text-sm text-foreground/80 line-clamp-2">{review.content}</p>
                                    )}
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock size={12} />
                                        {formatDate(review.createdAt)}
                                    </div>
                                </td>
                                <td className="p-3">
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
                
                {sortedReviews.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                        No reviews match your filters.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReviews;