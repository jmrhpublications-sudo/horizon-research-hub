import { memo, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJMRH } from "@/context/JMRHContext";
import { 
    Users, FileText, Library, BookOpen, Clock, TrendingUp, 
    Activity, Download, Upload, CheckCircle, XCircle, AlertCircle,
    Star, RefreshCw, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
    LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    PieChart as RePieChart, Pie, Cell, AreaChart, Area, Legend 
} from "recharts";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";

const COLORS = ['hsl(35, 40%, 50%)', 'hsl(142, 60%, 40%)', 'hsl(200, 10%, 40%)', 'hsl(45, 90%, 60%)', 'hsl(0, 84%, 60%)'];

const AdminAnalytics = memo(() => {
    const { users, papers, publishedJournals, publishedBooks, reviews, uploadRequests, professorSubmissions, refreshData } = useJMRH();

    const monthlyData = useMemo(() => {
        const data: Array<{month: string; fullDate: Date; papers: number; published: number; reviews: number; users: number}> = [];
        for (let i = 0; i < 12; i++) {
            const date = subMonths(new Date(), 11 - i);
            data.push({ month: format(date, 'MMM'), fullDate: startOfMonth(date), papers: 0, published: 0, reviews: 0, users: 0 });
        }
        
        papers.forEach(paper => {
            try {
                const paperDate = parseISO(paper.submissionDate);
                for (let i = 0; i < data.length; i++) {
                    if (isWithinInterval(paperDate, { start: data[i].fullDate, end: endOfMonth(data[i].fullDate) })) {
                        data[i].papers++;
                        break;
                    }
                }
            } catch {}
        });

        reviews.forEach(review => {
            try {
                const reviewDate = parseISO(review.createdAt);
                for (let i = 0; i < data.length; i++) {
                    if (isWithinInterval(reviewDate, { start: data[i].fullDate, end: endOfMonth(data[i].fullDate) })) {
                        data[i].reviews++;
                        break;
                    }
                }
            } catch {}
        });

        users.forEach(user => {
            try {
                const userDate = new Date(user.createdAt);
                for (let i = 0; i < data.length; i++) {
                    if (isWithinInterval(userDate, { start: data[i].fullDate, end: endOfMonth(data[i].fullDate) })) {
                        data[i].users++;
                        break;
                    }
                }
            } catch {}
        });

        return data;
    }, [papers, reviews, users]);

    const paperStatusData = useMemo(() => [
        { name: 'Submitted', value: papers.filter(p => p.status === 'SUBMITTED').length },
        { name: 'Under Review', value: papers.filter(p => p.status === 'UNDER_REVIEW').length },
        { name: 'Revision', value: papers.filter(p => p.status === 'REVISION_REQUIRED').length },
        { name: 'Accepted', value: papers.filter(p => p.status === 'ACCEPTED').length },
        { name: 'Published', value: papers.filter(p => p.status === 'PUBLISHED').length },
        { name: 'Rejected', value: papers.filter(p => p.status === 'REJECTED').length },
    ], [papers]);

    const userRoleData = useMemo(() => [
        { name: 'Users', value: users.filter(u => u.role === 'USER').length },
        { name: 'Professors', value: users.filter(u => u.role === 'PROFESSOR').length },
        { name: 'Admins', value: users.filter(u => u.role === 'ADMIN').length },
    ], [users]);

    const reviewRatingData = useMemo(() => {
        return [5, 4, 3, 2, 1].map(star => ({
            name: `${star} Star`,
            value: reviews.filter(r => r.rating === star).length
        }));
    }, [reviews]);

    const disciplineData = useMemo(() => {
        const counts: Record<string, number> = {};
        papers.forEach(p => { const d = p.discipline || 'Other'; counts[d] = (counts[d] || 0) + 1; });
        return Object.entries(counts).map(([name, value]) => ({ name: name.slice(0, 15), value })).slice(0, 8);
    }, [papers]);

    const pendingRequestsData = useMemo(() => [
        { name: 'Pending', value: uploadRequests.filter(r => r.status === 'PENDING').length },
        { name: 'Approved', value: uploadRequests.filter(r => r.status === 'APPROVED').length },
        { name: 'Rejected', value: uploadRequests.filter(r => r.status === 'REJECTED').length },
    ], [uploadRequests]);

    const stats = [
        { label: "Total Users", value: users.length, icon: Users, change: "+12%", color: "text-secondary" },
        { label: "Total Papers", value: papers.length, icon: FileText, change: "+8%", color: "text-accent" },
        { label: "Published", value: publishedJournals.length + publishedBooks.length, icon: Library, change: "+5%", color: "text-accent" },
        { label: "Total Reviews", value: reviews.length, icon: Star, change: "+15%", color: "text-gold" },
    ];

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-border">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Admin Console</p>
                        <h1 className="text-3xl font-serif font-bold text-foreground">Analytics</h1>
                        <p className="text-sm text-muted-foreground">Detailed analysis and insights</p>
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
                                <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded">{stat.change}</span>
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
                        <LineChartIcon size={20} className="text-accent" /> Monthly Trends (Line Chart)
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyData}>
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(0, 0%, 60%)" />
                            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} stroke="hsl(0, 0%, 60%)" />
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 98%)', border: '1px solid hsl(0, 0%, 90%)', borderRadius: '8px' }} />
                            <Legend />
                            <Line type="monotone" dataKey="papers" stroke="hsl(35, 40%, 50%)" strokeWidth={3} dot={{ r: 4, fill: "hsl(35, 40%, 50%)" }} name="Papers" />
                            <Line type="monotone" dataKey="reviews" stroke="hsl(200, 10%, 40%)" strokeWidth={3} dot={{ r: 4, fill: "hsl(200, 10%, 40%)" }} name="Reviews" />
                            <Line type="monotone" dataKey="users" stroke="hsl(142, 60%, 40%)" strokeWidth={3} dot={{ r: 4, fill: "hsl(142, 60%, 40%)" }} name="Users" />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Bar Charts Row */}
                <div className="grid md:grid-cols-2 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="bg-card border border-border p-6">
                        <h3 className="font-bold text-foreground text-lg flex items-center gap-2 mb-6">
                            <BarChart3 size={20} className="text-secondary" /> Paper Status Distribution
                        </h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={paperStatusData}>
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(0, 0%, 60%)" />
                                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} stroke="hsl(0, 0%, 60%)" />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 98%)', border: '1px solid hsl(0, 0%, 90%)', borderRadius: '8px' }} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {paperStatusData.map((_, idx) => (
                                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                        className="bg-card border border-border p-6">
                        <h3 className="font-bold text-foreground text-lg flex items-center gap-2 mb-6">
                            <Users size={20} className="text-secondary" /> User Distribution
                        </h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={userRoleData}>
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(0, 0%, 60%)" />
                                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} stroke="hsl(0, 0%, 60%)" />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 98%)', border: '1px solid hsl(0, 0%, 90%)', borderRadius: '8px' }} />
                                <Bar dataKey="value" fill="hsl(35, 40%, 50%)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Pie Charts Row */}
                <div className="grid md:grid-cols-3 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="bg-card border border-border p-6">
                        <h3 className="font-bold text-foreground text-lg flex items-center gap-2 mb-6">
                            <Star size={20} className="text-gold" /> Review Ratings
                        </h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <RePieChart>
                                <Pie data={reviewRatingData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} fill="#8884" dataKey="value" label>
                                    {reviewRatingData.map((_, idx) => (
                                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 98%)', border: '1px solid hsl(0, 0%, 90%)', borderRadius: '8px' }} />
                                <Legend />
                            </RePieChart>
                        </ResponsiveContainer>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                        className="bg-card border border-border p-6">
                        <h3 className="font-bold text-foreground text-lg flex items-center gap-2 mb-6">
                            <Library size={20} className="text-accent" /> By Discipline
                        </h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={disciplineData} layout="vertical">
                                <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(0, 0%, 60%)" />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(0, 0%, 60%)" width={80} />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 98%)', border: '1px solid hsl(0, 0%, 90%)', borderRadius: '8px' }} />
                                <Bar dataKey="value" fill="hsl(142, 60%, 40%)" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        className="bg-card border border-border p-6">
                        <h3 className="font-bold text-foreground text-lg flex items-center gap-2 mb-6">
                            <Upload size={20} className="text-accent" /> Upload Requests
                        </h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <RePieChart>
                                <Pie data={pendingRequestsData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} fill="#8884" dataKey="value" label>
                                    {pendingRequestsData.map((_, idx) => (
                                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 98%)', border: '1px solid hsl(0, 0%, 90%)', borderRadius: '8px' }} />
                                <Legend />
                            </RePieChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Area Chart - Activity Over Time */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
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
                            <Area type="monotone" dataKey="papers" stackId="1" stroke="hsl(35, 40%, 50%)" fill="hsl(35, 40%, 50%)" fillOpacity={0.6} name="Papers" />
                            <Area type="monotone" dataKey="reviews" stackId="2" stroke="hsl(200, 10%, 40%)" fill="hsl(200, 10%, 40%)" fillOpacity={0.6} name="Reviews" />
                            <Area type="monotone" dataKey="users" stackId="3" stroke="hsl(142, 60%, 40%)" fill="hsl(142, 60%, 40%)" fillOpacity={0.6} name="Users" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Summary Cards */}
                <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-card border border-border p-5 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                            <Clock className="w-5 h-5 text-orange-500" />
                            <span className="text-sm font-bold text-foreground">Pending Papers</span>
                        </div>
                        <p className="text-3xl font-bold text-foreground">{papers.filter(p => p.status === 'SUBMITTED').length}</p>
                    </div>
                    <div className="bg-card border border-border p-5 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-sm font-bold text-foreground">Published</span>
                        </div>
                        <p className="text-3xl font-bold text-foreground">{papers.filter(p => p.status === 'PUBLISHED').length}</p>
                    </div>
                    <div className="bg-card border border-border p-5 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                            <XCircle className="w-5 h-5 text-red-500" />
                            <span className="text-sm font-bold text-foreground">Rejected</span>
                        </div>
                        <p className="text-3xl font-bold text-foreground">{papers.filter(p => p.status === 'REJECTED').length}</p>
                    </div>
                    <div className="bg-card border border-border p-5 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                            <AlertCircle className="w-5 h-5 text-yellow-500" />
                            <span className="text-sm font-bold text-foreground">In Revision</span>
                        </div>
                        <p className="text-3xl font-bold text-foreground">{papers.filter(p => p.status === 'REVISION_REQUIRED').length}</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
});

export default AdminAnalytics;