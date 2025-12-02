
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import CallToAction from './components/CallToAction';
import AITutor from './components/AITutor';
import SocraticTutor from './components/SocraticTutor';
import LoginModal from './components/LoginModal';
import Dashboard from './components/Dashboard';
import Alchemy from './components/Alchemy';
import KnowledgeGraph from './components/KnowledgeGraph';
import MediaCards from './components/MediaCards';
import CramMode from './components/CramMode';
import KnowledgeDigest from './components/KnowledgeDigest';
import VideoCourse from './components/VideoCourse';
import CertificateExam from './components/CertificateExam';
import About from './components/About';
import Vision from './components/Vision';
import Mission from './components/Mission';
import Story from './components/Story';
import Team from './components/Team';
import Contact from './components/Contact';
import ExploreGraph from './components/ExploreGraph';
import ExploreSearch from './components/ExploreSearch';
import ExploreCategory from './components/ExploreCategory';
import Explore3D from './components/Explore3D';
import ExploreTopic from './components/ExploreTopic';
import ExploreDifficulty from './components/ExploreDifficulty';
import ExploreSkill from './components/ExploreSkill';
import FAQ from './components/FAQ';
import Account from './components/Account';
import LearningModal from './components/LearningModal';
import { KnowledgeNode } from './types';
import { getGlobalStats } from './services/sm2Service';

type ViewState = 'landing' | 'dashboard' | 'tutor' | 'alchemy' | 'knowledge-graph' | 'media' | 'quick-learn' | 'digest' | 'video' | 'exam' | 'about' | 'vision' | 'mission' | 'story' | 'team' | 'contact' | 'explore-graph' | 'explore-search' | 'explore-category' | 'explore-3d' | 'explore-topic' | 'explore-difficulty' | 'explore-skill' | 'faq' | 'account';

function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // State to store user generated knowledge nodes from Alchemy
  const [userNodes, setUserNodes] = useState<KnowledgeNode[]>([]);
  // State for selected learning node
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  
  // State for Deep Dive context (sending content to Tutor)
  const [tutorContext, setTutorContext] = useState<string>('');

  // Playlist / Queue State
  const [learningQueue, setLearningQueue] = useState<KnowledgeNode[]>([]);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);

  // Calculate stats for Dashboard
  const stats = useMemo(() => getGlobalStats(userNodes), [userNodes]);

  const handleStart = () => {
    // If we want "Học ngay" to trigger login on landing
    setIsLoginModalOpen(true);
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    setIsLoggedIn(true);
    setView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFeatureSelect = (feature: string) => {
    console.log(`Selected feature: ${feature}`);
    if (feature === 'alchemy') {
        setView('alchemy');
    } else if (feature === 'knowledge-graph') {
        setView('knowledge-graph');
    } else if (feature === 'media') {
        setView('media');
    } else if (feature === 'tutor') {
        setView('tutor');
        setTutorContext(''); // Reset context when manually opening tutor
    } else if (feature === 'quick-learn') {
        setView('quick-learn');
    } else if (feature === 'digest') {
        setView('digest');
    } else if (feature === 'video') {
        setView('video');
    } else if (feature === 'exam') {
        setView('exam');
    } else {
        // Default to tutor for other features for now
        setView('tutor');
        setTutorContext('');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBackToDashboard = () => {
     setView('dashboard');
     window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowAbout = () => {
      setView('about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleShowVision = () => {
      setView('vision');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowMission = () => {
      setView('mission');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowStory = () => {
      setView('story');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowTeam = () => {
      setView('team');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowContact = () => {
      setView('contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowFAQ = () => {
      setView('faq');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowAccount = () => {
      setView('account');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromAbout = () => {
      if (isLoggedIn) {
          setView('dashboard');
      } else {
          setView('landing');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromFAQ = () => {
      if (isLoggedIn) {
          setView('dashboard');
      } else {
          setView('landing');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreGraph = () => {
      setView('explore-graph');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToGraph = () => {
      setView('knowledge-graph');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreSearch = () => {
      setView('explore-search');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreCategory = () => {
      setView('explore-category');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExplore3D = () => {
      setView('explore-3d');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreTopic = () => {
      setView('explore-topic');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreDifficulty = () => {
      setView('explore-difficulty');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreSkill = () => {
      setView('explore-skill');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Logic to add a new node from Alchemy
  const handleAddNode = (node: KnowledgeNode) => {
      setUserNodes(prev => [...prev, node]);
  };

  // Logic to update an existing node (e.g. after learning)
  const handleUpdateNode = (updatedNode: KnowledgeNode) => {
      setUserNodes(prev => prev.map(n => n.id === updatedNode.id ? updatedNode : n));
      
      // Also update it in queue if present
      setLearningQueue(prev => prev.map(n => n.id === updatedNode.id ? updatedNode : n));
      if (selectedNode && selectedNode.id === updatedNode.id) {
          setSelectedNode(updatedNode);
      }
  };

  const handleNodeClick = (node: KnowledgeNode) => {
      setSelectedNode(node);
      // Reset queue if single node clicked
      setLearningQueue([]); 
      setCurrentPlaylistIndex(0);
  };

  // Handler for Deep Dive from LearningModal
  const handleDeepDive = (context: string) => {
      setTutorContext(context);
      setSelectedNode(null); // Close learning modal
      setView('tutor');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Playlist & Merge & Delete Handlers ---

  const handleStartPlaylist = (nodes: KnowledgeNode[]) => {
      if (nodes.length === 0) return;
      setLearningQueue(nodes);
      setCurrentPlaylistIndex(0);
      setSelectedNode(nodes[0]);
  };

  const handleNextNode = () => {
      if (currentPlaylistIndex < learningQueue.length - 1) {
          const nextIndex = currentPlaylistIndex + 1;
          setCurrentPlaylistIndex(nextIndex);
          setSelectedNode(learningQueue[nextIndex]);
      } else {
          // End of playlist
          setSelectedNode(null);
          setLearningQueue([]);
      }
  };

  const handleMergeNodes = (nodesToMerge: KnowledgeNode[]) => {
      if (nodesToMerge.length < 2) return;

      const mergedTitle = `Tổng hợp: ${nodesToMerge[0].title} & ${nodesToMerge.length - 1} khác`;
      
      // Combine all content arrays
      const mergedData: KnowledgeNode['data'] = {
          flashcards: nodesToMerge.flatMap(n => n.data?.flashcards || []),
          quiz: nodesToMerge.flatMap(n => n.data?.quiz || []),
          fillInBlanks: nodesToMerge.flatMap(n => n.data?.fillInBlanks || []),
          spotErrors: nodesToMerge.flatMap(n => n.data?.spotErrors || []),
          caseStudies: nodesToMerge.flatMap(n => n.data?.caseStudies || []),
          summary: nodesToMerge.map(n => n.data?.summary).filter(Boolean).join('\n\n---\n\n')
      };

      // Combine and unique tags
      const allTags = nodesToMerge.flatMap(n => n.tags || []);
      const uniqueTags = Array.from(new Set(allTags));

      // Calculate centroid position for new node
      const avgX = nodesToMerge.reduce((sum, n) => sum + n.x, 0) / nodesToMerge.length;
      const avgY = nodesToMerge.reduce((sum, n) => sum + n.y, 0) / nodesToMerge.length;

      // Determine type (Mixed if contains multiple types, else specific type)
      // For now, we will use a specific type 'Mixed' to let LearningModal know it should render all content.
      
      const newNode: KnowledgeNode = {
          id: Date.now().toString(),
          title: mergedTitle,
          type: 'Mixed', // Set type to Mixed so LearningModal knows to look for all data types
          status: 'new',
          tags: uniqueTags,
          x: avgX,
          y: avgY,
          timestamp: new Date(),
          data: mergedData,
          imageUrl: nodesToMerge[0].imageUrl // Inherit image from first node or generate new later
      };

      // Keep old nodes, add Super Node
      setUserNodes(prev => [...prev, newNode]);
      alert(`Đã hợp nhất ${nodesToMerge.length} bài học thành công!`);
  };

  const handleDeleteNodes = (nodesToDelete: KnowledgeNode[]) => {
      if (window.confirm(`Bạn có chắc muốn xóa ${nodesToDelete.length} nốt tri thức không?`)) {
          const idsToDelete = new Set(nodesToDelete.map(n => n.id));
          setUserNodes(prev => prev.filter(n => !idsToDelete.has(n.id)));
      }
  };

  const handleDeleteNode = (nodeToDelete: KnowledgeNode) => {
      if (window.confirm(`Bạn có chắc muốn xóa nốt "${nodeToDelete.title}" không?`)) {
          setUserNodes(prev => prev.filter(n => n.id !== nodeToDelete.id));
      }
  };

  // Logic to determine if global header/footer should be shown
  const showGlobalNav = view !== 'dashboard' && view !== 'alchemy' && view !== 'knowledge-graph' && view !== 'tutor' && view !== 'media' && view !== 'quick-learn' && view !== 'digest' && view !== 'video' && view !== 'exam' && view !== 'about' && view !== 'vision' && view !== 'mission' && view !== 'story' && view !== 'team' && view !== 'contact' && view !== 'explore-graph' && view !== 'explore-search' && view !== 'explore-category' && view !== 'explore-3d' && view !== 'explore-topic' && view !== 'explore-difficulty' && view !== 'explore-skill' && view !== 'faq' && view !== 'account';

  return (
    <div className={`flex flex-col min-h-screen font-display ${showGlobalNav ? 'bg-[#F8F9FA] dark:bg-[#101c22]' : ''}`}>
      
      {/* Show Global Header only if NOT in Dashboard or Alchemy or Knowledge Graph or Tutor view */}
      {showGlobalNav && (
        <Header 
            onStart={handleStart} 
            onLoginClick={handleLoginClick} 
            isAppView={view !== 'landing'}
            onShowAbout={handleShowAbout}
            onShowFAQ={handleShowFAQ}
        />
      )}
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={handleCloseModal} 
        onLoginSuccess={handleLoginSuccess} 
      />

      {/* Learning Modal for Selected Node */}
      {selectedNode && (
          <LearningModal 
              key={selectedNode.id}
              node={selectedNode} 
              onClose={() => setSelectedNode(null)}
              onUpdateNode={handleUpdateNode}
              onDeepDive={handleDeepDive}
              playlistTotal={learningQueue.length > 0 ? learningQueue.length : undefined}
              playlistCurrent={learningQueue.length > 0 ? currentPlaylistIndex + 1 : undefined}
              onNextNode={learningQueue.length > 0 && currentPlaylistIndex < learningQueue.length - 1 ? handleNextNode : undefined}
          />
      )}

      <main className="flex-grow">
        {view === 'landing' && (
          <>
            <Hero onStart={handleStart} />
            <Features />
            <Testimonials />
            <CallToAction onStart={handleStart} />
          </>
        )}

        {view === 'dashboard' && (
          <Dashboard 
            onLogout={handleLogout} 
            onFeatureSelect={handleFeatureSelect}
            onShowAbout={handleShowAbout}
            onShowFAQ={handleShowFAQ}
            onShowAccount={handleShowAccount}
            stats={stats}
          />
        )}

        {view === 'account' && (
            <Account 
                onBack={handleGoBackToDashboard}
                onLogout={handleLogout}
                onShowAbout={handleShowAbout}
                onShowFAQ={handleShowFAQ}
            />
        )}

        {view === 'tutor' && (
          <SocraticTutor 
            onBack={handleGoBackToDashboard} 
            onShowAbout={handleShowAbout} 
            onLogout={handleLogout} 
            onShowFAQ={handleShowFAQ} 
            onShowAccount={handleShowAccount}
            initialMessage={tutorContext}
            userNodes={userNodes}
            stats={stats}
          />
        )}

        {view === 'alchemy' && (
          <Alchemy 
            onBack={handleGoBackToDashboard} 
            onShowAbout={handleShowAbout} 
            onLogout={handleLogout} 
            onShowFAQ={handleShowFAQ} 
            onShowAccount={handleShowAccount}
            onAddNode={handleAddNode}
            onGoToGraph={() => handleFeatureSelect('explore-graph')}
          />
        )}

        {view === 'knowledge-graph' && (
          <KnowledgeGraph 
            onBack={handleGoBackToDashboard} 
            onShowAbout={handleShowAbout} 
            onExplore={handleExploreGraph} 
            onLogout={handleLogout} 
            onShowFAQ={handleShowFAQ} 
            onShowAccount={handleShowAccount}
            userNodes={userNodes}
            onNodeClick={handleNodeClick}
            onDeleteNode={handleDeleteNode}
          />
        )}

        {view === 'explore-graph' && (
          <ExploreGraph 
            onBack={handleBackToGraph} 
            onShowAbout={handleShowAbout} 
            onSearch={handleExploreSearch} 
            onCategory={handleExploreCategory}
            on3DMode={handleExplore3D}
            onLogout={handleLogout}
            onShowFAQ={handleShowFAQ}
            onShowAccount={handleShowAccount}
            userNodes={userNodes}
            onNodeClick={handleNodeClick}
            onStartPlaylist={handleStartPlaylist}
            onMergeNodes={handleMergeNodes}
            onDeleteNodes={handleDeleteNodes}
          />
        )}

        {view === 'explore-search' && (
          <ExploreSearch onBack={handleExploreGraph} onShowAbout={handleShowAbout} onLogout={handleLogout} onShowFAQ={handleShowFAQ} onShowAccount={handleShowAccount} />
        )}

        {view === 'explore-category' && (
          <ExploreCategory 
            onBack={handleExploreGraph} 
            onShowAbout={handleShowAbout} 
            onTopicSelect={handleExploreTopic} 
            onDifficultySelect={handleExploreDifficulty}
            onSkillSelect={handleExploreSkill}
            onLogout={handleLogout}
            onShowFAQ={handleShowFAQ}
            onShowAccount={handleShowAccount}
          />
        )}

        {view === 'explore-topic' && (
          <ExploreTopic onBack={handleExploreCategory} onShowAbout={handleShowAbout} onLogout={handleLogout} onShowFAQ={handleShowFAQ} onShowAccount={handleShowAccount} />
        )}

        {view === 'explore-difficulty' && (
          <ExploreDifficulty onBack={handleExploreCategory} onShowAbout={handleShowAbout} onLogout={handleLogout} onShowFAQ={handleShowFAQ} onShowAccount={handleShowAccount} />
        )}

        {view === 'explore-skill' && (
          <ExploreSkill onBack={handleExploreCategory} onShowAbout={handleShowAbout} onLogout={handleLogout} onShowFAQ={handleShowFAQ} onShowAccount={handleShowAccount} />
        )}

        {view === 'explore-3d' && (
          <Explore3D onBack={handleExploreGraph} onShowAbout={handleShowAbout} onLogout={handleLogout} onShowFAQ={handleShowFAQ} onShowAccount={handleShowAccount} />
        )}

        {view === 'media' && (
          <MediaCards onBack={handleGoBackToDashboard} onShowAbout={handleShowAbout} onLogout={handleLogout} onShowFAQ={handleShowFAQ} onShowAccount={handleShowAccount} />
        )}

        {view === 'quick-learn' && (
          <CramMode onBack={handleGoBackToDashboard} onShowAbout={handleShowAbout} onLogout={handleLogout} onShowFAQ={handleShowFAQ} onShowAccount={handleShowAccount} />
        )}

        {view === 'digest' && (
            <KnowledgeDigest onBack={handleGoBackToDashboard} onShowAbout={handleShowAbout} onLogout={handleLogout} onShowFAQ={handleShowFAQ} onShowAccount={handleShowAccount} />
        )}

        {view === 'video' && (
            <VideoCourse onBack={handleGoBackToDashboard} onShowAbout={handleShowAbout} onLogout={handleLogout} onShowFAQ={handleShowFAQ} onShowAccount={handleShowAccount} />
        )}

        {view === 'exam' && (
            <CertificateExam onBack={handleGoBackToDashboard} onShowAbout={handleShowAbout} onLogout={handleLogout} onShowFAQ={handleShowFAQ} onShowAccount={handleShowAccount} />
        )}

        {view === 'about' && (
            <About 
              onBack={handleBackFromAbout} 
              onShowVision={handleShowVision} 
              onShowMission={handleShowMission} 
              onShowStory={handleShowStory} 
              onShowTeam={handleShowTeam} 
              onShowContact={handleShowContact} 
              onLogout={handleLogout}
              onShowFAQ={handleShowFAQ}
              onShowAccount={handleShowAccount}
            />
        )}

        {view === 'vision' && (
            <Vision onBack={handleShowAbout} onLogout={handleLogout} onShowFAQ={handleShowFAQ} onShowAccount={handleShowAccount} />
        )}

        {view === 'mission' && (
            <Mission onBack={handleShowAbout} onLogout={handleLogout} onShowFAQ={handleShowFAQ} onShowAccount={handleShowAccount} />
        )}

        {view === 'story' && (
            <Story onBack={handleShowAbout} onLogout={handleLogout} onShowFAQ={handleShowFAQ} onShowAccount={handleShowAccount} />
        )}

        {view === 'team' && (
            <Team onBack={handleShowAbout} onLogout={handleLogout} onShowFAQ={handleShowFAQ} onShowAccount={handleShowAccount} />
        )}

        {view === 'contact' && (
            <Contact onBack={handleShowAbout} onLogout={handleLogout} onShowFAQ={handleShowFAQ} onShowAccount={handleShowAccount} />
        )}

        {view === 'faq' && (
            <FAQ onBack={handleBackFromFAQ} onLogout={handleLogout} onShowAbout={handleShowAbout} onShowAccount={handleShowAccount} />
        )}
      </main>
      
      {/* Show Global Footer only if NOT in Dashboard or Alchemy or Knowledge Graph or Tutor view */}
      {showGlobalNav && <Footer />}
    </div>
  );
}

export default App;
