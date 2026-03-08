import { memo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { useJMRH } from "@/context/JMRHContext";
import { BookOpen, Calendar, User, Search, Filter, Hash, ShoppingCart, Download, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const BooksPublished = memo(() => {
    const { publishedBooks } = useJMRH();
    const [searchTerm, setSearchTerm] = useState("");
    const [disciplineFilter, setDisciplineFilter] = useState("all");
    const [viewingBook, setViewingBook] = useState<any>(null);
    const [pdfViewUrl, setPdfViewUrl] = useState<string | null>(null);
    const { toast } = useToast();

    const allBooks = publishedBooks
        .filter(b => b.status === 'PUBLISHED')
        .map(b => ({
            id: b.id, title: b.title, authors: b.authors, editors: b.editors,
            isbn: b.isbn, publisher: b.publisher, description: b.description,
            discipline: b.discipline, keywords: b.keywords, edition: b.edition,
            publicationYear: b.publicationYear, pdfUrl: b.pdfUrl,
            coverImage: b.coverImage, purchaseLink: b.purchaseLink,
        }));

    const disciplines = [...new Set(allBooks.map(b => b.discipline).filter(Boolean))];

    const filteredBooks = allBooks.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.keywords?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.isbn?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDiscipline = disciplineFilter === "all" || book.discipline === disciplineFilter;
        return matchesSearch && matchesDiscipline;
    }).sort((a, b) => (b.publicationYear || '').localeCompare(a.publicationYear || ''));

    const getPublicUrl = (filePath: string) => {
        if (!filePath) return null;
        if (filePath.startsWith('http')) return filePath;
        const { data } = supabase.storage.from('publications').getPublicUrl(filePath);
        return data?.publicUrl || null;
    };

    const handleView = (book: any) => {
        const url = getPublicUrl(book.pdfUrl);
        if (url) { setPdfViewUrl(url); setViewingBook(book); }
        else toast({ title: "No PDF", description: "No document available.", variant: "destructive" });
    };

    const handleDownload = (book: any) => {
        const url = getPublicUrl(book.pdfUrl);
        if (url) { const a = document.createElement('a'); a.href = url; a.download = `${book.title}.pdf`; a.target = '_blank'; a.click(); }
        else toast({ title: "No PDF", description: "No document available for download.", variant: "destructive" });
    };

    return (
        <div className="min-h-screen bg-background font-sans">
            <SEOHead 
                title="Published Books | JMRH Publications"
                description="Browse published books from JMRH Publications with ISBN registration."
                canonical="/books/published"
            />
            <Header />
            
            <section className="pt-32 pb-16 bg-gradient-to-b from-oxford/5 to-transparent">
                <div className="container max-w-5xl mx-auto px-6">
                    <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
                        <Link to="/" className="hover:text-gold transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-gold">Published Books</span>
                    </nav>
                    <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">Published Books</h1>
                    <p className="text-oxford/60 max-w-2xl">
                        Browse all published books from JMRH Publications. Each book includes title, author(s), ISBN, and access links.
                    </p>
                </div>
            </section>

            <section className="py-8 bg-white border-b border-black/5">
                <div className="container max-w-5xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-oxford/30" />
                            <Input placeholder="Search books by title, author, ISBN..." className="pl-10 h-12 border-black/10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <Select value={disciplineFilter} onValueChange={setDisciplineFilter}>
                            <SelectTrigger className="w-full md:w-64 h-12">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="All Disciplines" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Disciplines</SelectItem>
                                {disciplines.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container max-w-5xl mx-auto px-6">
                    {filteredBooks.length > 0 ? (
                        <div className="space-y-6">
                            <p className="text-sm text-oxford/50">{filteredBooks.length} books found</p>
                            <div className="grid md:grid-cols-2 gap-6">
                                {filteredBooks.map((book) => {
                                    const coverUrl = getPublicUrl(book.coverImage || '');
                                    return (
                                        <div key={book.id} className="bg-white border border-black/5 p-6 hover:shadow-md transition-shadow">
                                            <div className="flex gap-6">
                                                {coverUrl ? (
                                                    <img src={coverUrl} alt={book.title} className="w-24 h-36 object-cover rounded shadow" />
                                                ) : (
                                                    <div className="w-24 h-36 bg-teal-500/10 rounded flex items-center justify-center flex-shrink-0">
                                                        <BookOpen className="w-10 h-10 text-teal-500" />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-2 py-1 text-xs font-bold uppercase bg-teal-500/10 text-teal-600">{book.discipline}</span>
                                                        {book.edition && <span className="text-xs text-oxford/50">{book.edition} Edition</span>}
                                                    </div>
                                                    <h3 className="font-serif text-lg font-bold text-oxford mb-2 line-clamp-2">{book.title}</h3>
                                                    <div className="flex items-center gap-4 text-sm text-oxford/60 mb-2">
                                                        <span className="flex items-center gap-1"><User size={14} />{book.authors}</span>
                                                    </div>
                                                    {book.editors && <p className="text-xs text-oxford/50 mb-2">Edited by {book.editors}</p>}
                                                    <div className="flex flex-wrap gap-3 text-xs text-oxford/50 mb-3">
                                                        {book.publicationYear && <span className="flex items-center gap-1"><Calendar size={12} />{book.publicationYear}</span>}
                                                        {book.isbn && <span className="flex items-center gap-1"><Hash size={12} />ISBN: {book.isbn}</span>}
                                                        {book.publisher && <span>{book.publisher}</span>}
                                                    </div>
                                                    {book.description && <p className="text-sm text-oxford/70 line-clamp-3 mb-4">{book.description}</p>}
                                                    <div className="flex flex-wrap gap-3">
                                                        {book.pdfUrl && (
                                                            <>
                                                                <Button variant="outline" size="sm" onClick={() => handleView(book)} className="gap-2 text-gold border-gold/30 hover:bg-gold/5">
                                                                    <Eye size={16} /> View
                                                                </Button>
                                                                <Button variant="outline" size="sm" onClick={() => handleDownload(book)} className="gap-2 text-oxford border-oxford/20 hover:bg-oxford/5">
                                                                    <Download size={16} /> Download
                                                                </Button>
                                                            </>
                                                        )}
                                                        {book.purchaseLink && (
                                                            <a href={book.purchaseLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-teal-500 hover:underline font-medium">
                                                                <ShoppingCart size={16} /> Purchase
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-black/5 p-12 text-center">
                            <div className="w-20 h-20 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <BookOpen className="w-10 h-10 text-teal-500" />
                            </div>
                            <h2 className="font-serif text-2xl font-bold text-oxford mb-4">
                                {searchTerm || disciplineFilter !== "all" ? "No Books Found" : "Coming Soon"}
                            </h2>
                            <p className="text-oxford/60 mb-8">
                                {searchTerm || disciplineFilter !== "all" 
                                    ? "Try adjusting your search or filter criteria."
                                    : "Published books will be displayed here once available."}
                            </p>
                            {!searchTerm && disciplineFilter === "all" && (
                                <div className="mt-8 p-6 bg-gold/5 border border-gold/10">
                                    <h3 className="font-serif text-lg font-bold text-oxford mb-4">Submit Your Book</h3>
                                    <p className="text-oxford/70 mb-6">Interested in publishing a book? Submit a detailed book proposal.</p>
                                    <Link to="/books/proposal" className="inline-flex items-center gap-2 bg-oxford text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold hover:text-oxford transition-all">
                                        Submit Book Proposal
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* PDF Viewer Dialog */}
            <Dialog open={!!viewingBook} onOpenChange={() => { setViewingBook(null); setPdfViewUrl(null); }}>
                <DialogContent className="max-w-4xl h-[85vh]">
                    <DialogHeader>
                        <DialogTitle className="font-serif">{viewingBook?.title}</DialogTitle>
                    </DialogHeader>
                    {pdfViewUrl && (
                        <iframe src={pdfViewUrl} className="w-full flex-1 rounded border" style={{ minHeight: '70vh' }} />
                    )}
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
});

export default BooksPublished;
