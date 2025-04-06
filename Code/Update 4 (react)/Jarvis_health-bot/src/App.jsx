import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClinicMedical, FaCalendarAlt, FaNewspaper, FaCommentMedical } from 'react-icons/fa';
import ChatBot from './components/ChatBot';
import HospitalLocator from './components/HospitalLocator';
import NewsFeed from './components/NewsFeed';
import AppointmentForm from './components/AppointmentForm';
import './App.css';

const tabs = [
  { id: 'chat', icon: <FaCommentMedical />, label: 'Health Chat' },
  { id: 'hospitals', icon: <FaClinicMedical />, label: 'Hospitals' },
  { id: 'news', icon: <FaNewspaper />, label: 'Health News' },
  { id: 'appointments', icon: <FaCalendarAlt />, label: 'Appointments' }
];

function App() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="app-container">
      <nav className="app-nav">
        <motion.div 
          className="nav-logo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img src="/assets/hc.png" alt="Jarvis Logo" />
          <span>Jarvis Health</span>
        </motion.div>
        
        <ul className="nav-links">
          {tabs.map((tab) => (
            <motion.li
              key={tab.id}
              className={activeTab === tab.id ? 'active' : ''}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div 
                  className="underline"
                  layoutId="underline"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.li>
          ))}
        </ul>
      </nav>

      <main className="app-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'chat' && <ChatBot />}
            {activeTab === 'hospitals' && <HospitalLocator />}
            {activeTab === 'news' && <NewsFeed />}
            {activeTab === 'appointments' && <AppointmentForm />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Jarvis Health Bot. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;