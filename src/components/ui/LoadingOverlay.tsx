const LoadingOverlay = () => {
    return (
        <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center space-y-6">
            <img src="/logo.png" alt="JMRH" className="w-20 h-20 object-contain animate-pulse" width="80" height="80" />
            <div className="text-center space-y-2">
                <h2 className="font-serif text-2xl italic text-oxford">JMRH Portal</h2>
                <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold animate-pulse">Loading...</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;
