import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { JMRHProvider } from "@/context/JMRHContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Public Pages
const Index = lazy(() => import("./pages/Index"));

// Journal Pages
const JournalAbout = lazy(() => import("./pages/journal/JournalAbout"));
const JournalAimsScope = lazy(() => import("./pages/journal/JournalAimsScope"));
const JournalEditorialBoard = lazy(() => import("./pages/journal/JournalEditorialBoard"));
const JournalReviewerBoard = lazy(() => import("./pages/journal/JournalReviewerBoard"));
const JournalPeerReview = lazy(() => import("./pages/journal/JournalPeerReview"));
const JournalEthics = lazy(() => import("./pages/journal/JournalEthics"));
const JournalPlagiarism = lazy(() => import("./pages/journal/JournalPlagiarism"));
const JournalOpenAccess = lazy(() => import("./pages/journal/JournalOpenAccess"));
const JournalGuidelines = lazy(() => import("./pages/journal/JournalGuidelines"));
const JournalCurrentIssue = lazy(() => import("./pages/journal/JournalCurrentIssue"));
const JournalArchives = lazy(() => import("./pages/journal/JournalArchives"));
const JournalViewer = lazy(() => import("./pages/journal/JournalViewer"));
const JournalAPC = lazy(() => import("./pages/journal/JournalAPC"));
const JournalSubmit = lazy(() => import("./pages/journal/JournalSubmit"));

// Books Pages
// These are kept for potential future use but routes are removed from navigation
const BooksAbout = lazy(() => import("./pages/books/BooksAbout"));
const BooksPublished = lazy(() => import("./pages/books/BooksPublished"));
const BooksProposal = lazy(() => import("./pages/books/BooksProposal"));
const BooksISBN = lazy(() => import("./pages/books/BooksISBN"));

// Other Pages
const Policies = lazy(() => import("./pages/Policies"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Contact = lazy(() => import("./pages/Contact"));
const CallForPapers = lazy(() => import("./pages/CallForPapers"));

// Policy Pages
const TermsPage = lazy(() => import("./pages/policies/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/policies/PrivacyPage"));
const SecurityPage = lazy(() => import("./pages/policies/SecurityPage"));
const PlagiarismPage = lazy(() => import("./pages/policies/PlagiarismPage"));
const OpenAccessPage = lazy(() => import("./pages/policies/OpenAccessPage"));
const DisclaimerPage = lazy(() => import("./pages/policies/DisclaimerPage"));
const RefundPage = lazy(() => import("./pages/policies/RefundPage"));
const CopyrightPage = lazy(() => import("./pages/policies/CopyrightPage"));

// Legacy Pages (for backward compatibility)
const AboutPage = lazy(() => import("./pages/AboutPage"));
const GuidelinesPage = lazy(() => import("./pages/GuidelinesPage"));
const EditorialPage = lazy(() => import("./pages/EditorialPage"));
const EthicsPage = lazy(() => import("./pages/EthicsPage"));
const ArchivesPage = lazy(() => import("./pages/ArchivesPage"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Secure Auth
const SecureLoginPage = lazy(() => import("./pages/SecureLoginPage"));

// User Pages
const SubmitPaperPage = lazy(() => import("./pages/SubmitPaperPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const RequestUploadPage = lazy(() => import("./pages/RequestUploadPage"));
const MyDocumentsPage = lazy(() => import("./pages/MyDocumentsPage"));

// Admin Dashboard
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminProfessors = lazy(() => import("./pages/admin/AdminProfessors"));
const AdminPapers = lazy(() => import("./pages/admin/AdminPapers"));
const AdminPublications = lazy(() => import("./pages/admin/AdminPublications"));
const AdminRequests = lazy(() => import("./pages/admin/AdminRequests"));
const AdminDocuments = lazy(() => import("./pages/admin/AdminDocuments"));

// Professor Dashboard
const ProfessorDashboard = lazy(() => import("./pages/professor/ProfessorDashboard"));
const ProfessorAnalytics = lazy(() => import("./pages/professor/ProfessorAnalytics"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <JMRHProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingOverlay />}>
            <Routes>
              {/* ==================== HOME ==================== */}
              <Route path="/" element={<Index />} />
              
              {/* ==================== JOURNAL SECTION ==================== */}
              <Route path="/journals" element={<JournalAbout />} />
              <Route path="/journal/about" element={<JournalAbout />} />
              <Route path="/journal/aims-scope" element={<JournalAimsScope />} />
              <Route path="/journal/editorial-board" element={<JournalEditorialBoard />} />
              <Route path="/journal/reviewer-board" element={<JournalReviewerBoard />} />
              <Route path="/journal/peer-review" element={<JournalPeerReview />} />
              <Route path="/journal/ethics" element={<JournalEthics />} />
              <Route path="/journal/plagiarism" element={<JournalPlagiarism />} />
              <Route path="/journal/open-access" element={<JournalOpenAccess />} />
              <Route path="/journal/guidelines" element={<JournalGuidelines />} />
              <Route path="/journal/current-issue" element={<JournalCurrentIssue />} />
              <Route path="/journal/archives" element={<JournalArchives />} />
              <Route path="/journal/viewer/:id" element={<JournalViewer />} />
              <Route path="/journal/apc" element={<JournalAPC />} />
              <Route path="/journal/submit" element={<JournalSubmit />} />
              
              {/* ==================== BOOKS SECTION - Routes kept for legacy (accessible via direct URL) ==================== */}
              <Route path="/books" element={<BooksPublished />} />
              <Route path="/books/about" element={<BooksAbout />} />
              <Route path="/books/published" element={<BooksPublished />} />
              <Route path="/books/proposal" element={<BooksProposal />} />
              <Route path="/books/isbn" element={<BooksISBN />} />
               
              {/* ==================== POLICIES ==================== */}
              <Route path="/policies" element={<Policies />} />
              
              {/* ==================== ABOUT US ==================== */}
              <Route path="/about-us" element={<AboutUs />} />
              
              {/* ==================== CONTACT ==================== */}
              <Route path="/contact" element={<Contact />} />
              
              {/* ==================== CALL FOR PAPERS ==================== */}
              <Route path="/call-for-papers" element={<CallForPapers />} />

              {/* ==================== POLICY PAGES ==================== */}
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/plagiarism-policy" element={<PlagiarismPage />} />
              <Route path="/open-access" element={<OpenAccessPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="/refund" element={<RefundPage />} />
              <Route path="/copyright" element={<CopyrightPage />} />
               
              {/* ==================== LEGACY ROUTES (for backward compatibility) ==================== */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/guidelines" element={<GuidelinesPage />} />
              <Route path="/editorial-board" element={<EditorialPage />} />
              <Route path="/ethics-policy" element={<EthicsPage />} />
              <Route path="/archives" element={<ArchivesPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/login" element={<AuthPage />} />

              {/* User Secure Routes - Submit Paper requires login */}
              <Route path="/submit-paper" element={
                <ProtectedRoute allowedRoles={['USER', 'PROFESSOR', 'ADMIN']}>
                  <SubmitPaperPage />
                </ProtectedRoute>
              } />
              <Route path="/submit-paper/:id" element={
                <ProtectedRoute allowedRoles={['USER', 'PROFESSOR', 'ADMIN']}>
                  <SubmitPaperPage />
                </ProtectedRoute>
              } />
              <Route path="/request-upload" element={<RequestUploadPage />} />
              <Route path="/account" element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <AccountPage />
                </ProtectedRoute>
              } />
              <Route path="/my-documents" element={
                <ProtectedRoute allowedRoles={['USER', 'PROFESSOR', 'ADMIN']}>
                  <MyDocumentsPage />
                </ProtectedRoute>
              } />

              {/* Secure Admin Console */}
              <Route path="/secure/admin/login" element={<SecureLoginPage role="ADMIN" />} />
              <Route path="/secure/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/secure/admin/analytics" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminAnalytics />
                </ProtectedRoute>
              } />
              <Route path="/secure/admin/users" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/secure/admin/professors" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminProfessors />
                </ProtectedRoute>
              } />
              <Route path="/secure/admin/papers" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminPapers />
                </ProtectedRoute>
              } />
              <Route path="/secure/admin/publications" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminPublications />
                </ProtectedRoute>
              } />
              <Route path="/secure/admin/documents" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDocuments />
                </ProtectedRoute>
              } />
              <Route path="/secure/admin/requests" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminRequests />
                </ProtectedRoute>
              } />

              {/* Secure Professor Console */}
              <Route path="/secure/professor/login" element={<SecureLoginPage role="PROFESSOR" />} />
              <Route path="/secure/professor/dashboard" element={
                <ProtectedRoute allowedRoles={['PROFESSOR']}>
                  <ProfessorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/secure/professor/analytics" element={
                <ProtectedRoute allowedRoles={['PROFESSOR']}>
                  <ProfessorAnalytics />
                </ProtectedRoute>
              } />
              <Route path="/secure/professor/papers" element={
                <ProtectedRoute allowedRoles={['PROFESSOR']}>
                  <ProfessorDashboard />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </JMRHProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
