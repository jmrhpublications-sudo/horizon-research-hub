import { Share2, Link2, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
    path: string; // path + query, e.g. /journal/archives?volume=1
    title: string;
    label?: string;
}

const ShareLinkButton = ({ path, title, label = "Share" }: Props) => {
    const [copied, setCopied] = useState(false);
    const url = `${window.location.origin}${path}`;

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(url);
        } catch {
            const ta = document.createElement("textarea");
            ta.value = url;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            ta.remove();
        }
        setCopied(true);
        toast.success("Link copied");
        setTimeout(() => setCopied(false), 2000);
    };

    const share = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
                return;
            } catch (err: any) {
                if (err?.name === "AbortError") return;
            }
        }
        copy();
    };

    return (
        <div className="flex items-center gap-1 shrink-0">
            <Button variant="outline" size="sm" onClick={share} className="gap-2 min-h-[40px]" aria-label={`Share ${title}`}>
                <Share2 size={14} /> <span className="hidden sm:inline">{label}</span>
            </Button>
            <Button
                variant="ghost" size="sm"
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); copy(); }}
                className="min-h-[40px]"
                aria-label={`Copy link to ${title}`}
            >
                {copied ? <Check size={14} /> : <Link2 size={14} />}
            </Button>
        </div>
    );
};

export default ShareLinkButton;
