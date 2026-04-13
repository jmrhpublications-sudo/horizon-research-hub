import { memo, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJMRH } from "@/context/JMRHContext";
import { 
    FileText, Clock, CheckCircle, Star, TrendingUp, 
    Activity, BarChart3, LineChart, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
    LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, AreaChart, Area, Legend 
} from "recharts";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";

const COLORS = ['hsl(35, 40%, 50%)', 'hsl(142, 60%, 40%)', 'hsl(200, 10%, 40%)', 'hsl(45, 90%, 60%)', 'hsl(0, 84%, 60%)'];

const ProfessorAnalytics = memo(() => {
    const { papers, currentUser, professorSubmissions, refreshData } = useJMRH();

    const myPapers = useMemo(() => papers.filter(p => p.assignedProfessorId === currentUser?.id), [papers, currentUser]);
    const mySubmissions = useMemo(() => professorSubmissions.filter(s => s.professorId === currentUser?.id), [professorSubmissions, currentUser]);

    const monthlyData = useMemo(() => {
        const data: Array<{month: string; fullDate: Date; reviews: number; accepted: number; rejected: number}> = [];
        for (let i = 0; i < 12; i++) {
            const date = subMonths(new Date(), 11 - i);
            data.push({ month: format(date, 'MMM'), fullDate: startOfMonth(date), reviews: 0, accepted: 0, rejected: 0 });
        }
        
        myPapers.forEach(paper => {
            try {
                const paperDate = parseISO(paper.submissionDate);
                for (let i = 0; i < data.length; i++) {
                    if (isWithinInterval(paperDate, { start: data[i].fullDate, end: endOfMonth(data[i].fullDate) })) {
                        data[i].reviews++;
                        if (paper.status === 'ACCEPTED' || paper.status === 'PUBLISHED') data[i].accepted++;
                        if (paper.status === 'REJECTED') data[i].rejected++;
                        break;
                    }
                }
            } catch {}
        });

        return data;
    }, [myPapers]);

    const reviewStatusData = useMemo(() => [
        { name: 'Pending', value: myPapers.filter(p => p.status === 'SUBMITTED' || p.status === 'UNDER_REVIEW').length },
        { name: 'Revision', value: myPapers.filter(p => p.status === 'REVISION_REQUIRED').length },
        { name: 'Completed', value: myPapers.filter(p => p.status === 'ACCEPTED' || p.status === 'PUBLISHED' || p.status === 'REJECTED').length },
    ], [myPapers]);

    const decisionData = useMemo(() => [
        { name: 'Accepted', value: myPapers.filter(p => p.status === 'ACCEPTED').length },
        { name: 'Published', value: myPapers.filter(p => p.status === 'PUBLISHED').length },
        { name: 'Rejected', value: myPapers.filter(p => p.status === 'REJECTED').length },
        { name: 'Pending', value: myPapers.filter(p => p.status === 'SUBMITTED' || p.status === 'UNDER_REVIEW').length },
    ], [myPapers]);

    const submissionStatusData = useMemo(() => [
        { name: 'Pending', value: mySubmissions.filter(s => s.status === 'PENDING').length },
        { name: 'Approved', value: mySubmissions.filter(s => s.status === 'APPROVED').length },
        { name: 'Rejected', value: mySubmissions.filter(s => s.status === 'REJECTED').length },
    ], [mySubmissions]);

    const disciplineData = useMemo(() => {
        const counts: Record<string, number> = {};
        myPapers.forEach(p => { const d = p.discipline || 'Other'; counts[d] = (counts[d] || 0) + 1; });
        return Object.entries(counts).map(([name, value]) => ({ name: name.slice(0, 15), value })).slice(0, 6);
    }, [myPapers]);

    const accepted = myPapers.filter(p => p.status === 'ACCEPTED' || p.status === 'PUBLISHED').length;
    const total = myPapers.length;
    const acceptanceRate = total > 0 ? ((accepted / total) * 100).toFixed(1) : "0";

    const stats = [
        { label: "Total Assigned", value: myPapers.length, icon: FileText, change: "+5%", color: "text-accent" },
        { label: "Pending Reviews", value: myPapers.filter(p => p.status === 'SUBMITTED' || p.status === 'UNDER_REVIEW').length, icon: Clock, change: null, color: "text-orange-500" },
        { label: "Accept Rate", value: acceptanceRate + "%", icon: TrendingUp, change: "+2%", color: "text-green-500" },
        { label: "Submissions", value: mySubmissions.length, icon: CheckCircle, change: "+3%", color: "text-secondary" },
    ];

    return (
        <DashboardLayout role="PROFESSOR">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-border">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Professor Portal</p>
                        <h1 className="text-3xl font-serif font-bold text-foreground">Analytics</h1>
                        <p className="text-sm text-muted-foreground">Your review performance and insights</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => refreshData()} className="gap-2">
                        <RefreshCw size={14} /> Refresh
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                            className="bg-card border border-border p-5 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                {stat.change && (
                                    <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded">{stat.change}</span>
                                )}
                            </div>
                            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Line Chart - Monthly Trends */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-card border border-border p-6">
                    <h3 className="font-bold text-foreground text-lg flex items-center gap-2 mb-6">
                        <LineChart size={20} className="text-accent" /> Monthly Review Activity (Line Chart)
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyData}>
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(0, 0%, 60%)" />
                            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} stroke="hsl(0, 0%, 60%)" />
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 98%)', border: '1px solid hsl(0, 0%, 90%)', borderRadius: '8px' }} />
                            <Legend />
                            <Line type="monotone" dataKey="reviews" stroke="hsl(35, 40%, 50%)" strokeWidth={3} dot={{ r: 4, fill: "hsl(35, 40%, 50%)" }} name="Total Reviews" />
                            <Line type="monotone" dataKey="accepted" stroke="hsl(142, 60%, 40%)" strokeWidth={3} dot={{ r: 4, fill: "hsl(142, 60%, 40%)" }} name="Accepted" />
                            <Line type="monotone" dataKey="rejected" stroke="hsl(0, 84%, 60%)" strokeWidth={3} dot={{ r: 4, fill: "hsl(0, 84%, 60%)" }} name="Rejected" />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Bar Charts Row */}
                <div className="grid md:grid-cols-2 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="bg-card border border-border p-6">
                        <h3 className="font-bold text-foreground text-lg flex items-center gap-2 mb-6">
                            <BarChart3 size={20} className="text-secondary" /> Review Status Distribution
                        </h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={reviewStatusData}>
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(0, 0%, 60%)" />
                                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} stroke="hsl(0, 0%, 60%)" />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 98%)', border: '1px solid hsl(0, 0%, 90%)', borderRadius: '8px' }} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {reviewStatusData.map((_, idx) => (
                                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                        className="bg-card border border-border p-6">
                        <h3 className="font-bold text-foreground text-lg flex items-center gap-2 mb-6">
                            <CheckCircle size={20} className="text-green-500" /> Decision Distribution
                        </h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={decisionData}>
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(0, 0%, 60%)" />
                                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} stroke="hsl(0, 0%, 60%)" />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 98%)', border: '1px solid hsl(0, 0%, 90%)', borderRadius: '8px' }} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {decisionData.map((_, idx) => (
                                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Pie Chart and Area Chart */}
                <div className="grid md:grid-cols-2 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="bg-card border border-border p-6">
                        <h3 className="font-bold text-foreground text-lg flex items-center gap-2 mb-6">
                            <CheckCircle size={20} className="text-accent" /> Submission Status
                        </h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={submissionStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} fill="#8884" dataKey="value" label>
                                    {submissionStatusData.map((_, idx) => (
                                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 98%)', border: '1px solid hsl(0, 0%, 90%)', borderRadius: '8px' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                        className="bg-card border border-border p-6">
                        <h3 className="font-bold text-foreground text-lg flex items-center gap-2 mb-6">
                            <FileText size={20} className="text-secondary" /> By Discipline
                        </h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={disciplineData} layout="vertical">
                                <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(0, 0%, 60%)" />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(0, 0%, 60%)" width={100} />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 98%)', border: '1px solid hsl(0, 0%, 90%)', borderRadius: '8px' }} />
                                <Bar dataKey="value" fill="hsl(35, 40%, 50%)" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Area Chart - Activity */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="bg-card border border-border p-6">
                    <h3 className="font-bold text-foreground text-lg flex items-center gap-2 mb-6">
                        <Activity size={20} className="text-accent" /> Activity Overview (Area Chart)
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={monthlyData}>
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(0, 0%, 60%)" />
                            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} stroke="hsl(0, 0%, 60%)" />
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 98%)', border: '1px solid hsl(0, 0%, 90%)', borderRadius: '8px' }} />
                            <Legend />
                            <Area type="monotone" dataKey="reviews" stackId="1" stroke="hsl(35, 40%, 50%)" fill="hsl(35, 40%, 50%)" fillOpacity={0.6} name="Reviews" />
                            <Area type="monotone" dataKey="accepted" stackId="2" stroke="hsl(142, 60%, 40%)" fill="hsl(142, 60%, 40%)" fillOpacity={0.6} name="Accepted" />
                            <Area type="monotone" dataKey="rejected" stackId="3" stroke="hsl(0, 84%, 60%)" fill="hsl(0, 84%, 60%)" fillOpacity={0.6} name="Rejected" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Summary Cards */}
                <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-card border border-border p-5 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                            <Clock className="w-5 h-5 text-orange-500" />
                            <span className="text-sm font-bold text-foreground">Pending</span>
                        </div>
                        <p className="text-3xl font-bold text-foreground">{myPapers.filter(p => p.status === 'SUBMITTED' || p.status === 'UNDER_REVIEW').length}</p>
                    </div>
                    <div className="bg-card border border-border p-5 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-sm font-bold text-foreground">Accepted</span>
                        </div>
                        <p className="text-3xl font-bold text-foreground">{myPapers.filter(p => p.status === 'ACCEPTED').length}</p>
                    </div>
                    <div className="bg-card border border-border p-5 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                            <FileText className="w-5 h-5 text-accent" />
                            <span className="text-sm font-bold text-foreground">Published</span>
                        </div>
                        <p className="text-3xl font-bold text-foreground">{myPapers.filter(p => p.status === 'PUBLISHED').length}</p>
                    </div>
                    <div className="bg-card border border-border p-5 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                            <Star className="w-5 h-5 text-gold" />
                            <span className="text-sm font-bold text-foreground">Submissions</span>
                        </div>
                        <p className="text-3xl font-bold text-foreground">{mySubmissions.length}</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
});

export default ProfessorAnalytics;