import { memo, ReactNode } from "react";
import { Link } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";

interface PolicyLayoutProps {
    title: string;
    seoTitle: string;
    seoDescription: string;
    canonical: string;
    children: ReactNode;
}

const PolicyLayout = memo(({ title, seoTitle, seoDescription, canonical, children }: PolicyLayoutProps) => {
    return (
        <PageShell title={seoTitle} description={seoDescription} canonical={canonical}>
            <section className="py-8">
                <div className="container max-w-4xl mx-auto px-4 sm:px-6">
                    <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-6">
                        <Link to="/" className="hover:text-accent transition-colors">Home</Link>
                        <span>/</span>
                        <Link to="/policies" className="hover:text-accent transition-colors">Policies</Link>
                        <span>/</span>
                        <span className="text-accent">{title}</span>
                    </nav>
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-8">
                        {title}
                    </h1>
                    <div className="bg-card border border-border rounded-lg p-6 sm:p-8 md:p-12 prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground">
                        {children}
                    </div>
                </div>
            </section>
        </PageShell>
    );
});

export default PolicyLayout;
