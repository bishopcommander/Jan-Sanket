import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_COMPLAINTS } from '../mockData/initialComplaints';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('jan_sanket_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  // Auth state: null = logged out, { role: 'CITIZEN'|'ADMIN', name, id }
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('jan_sanket_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Theme state: 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('jan_sanket_theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('jan_sanket_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    } else {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const [notifications, setNotifications] = useState([
    { id: "n1", title: "Resolution Ready for Verification", message: "Ticket JS-2026-001245 (Pothole at City High School) has been repaired. Please review the proof photo.", time: "10 min ago", read: false, complaintId: "JS-2026-001245" },
    { id: "n2", title: "SLA Alert Escalation", message: "Ticket JS-2026-001246 (Garbage Overflow, Ward 8) breached 24-hr SLA.", time: "1 hour ago", read: false, complaintId: "JS-2026-001246" },
    { id: "n3", title: "New Complaint Assigned", message: "Ticket JS-2026-001247 has been routed to Electrical Department.", time: "2 hours ago", read: true, complaintId: "JS-2026-001247" }
  ]);

  useEffect(() => {
    localStorage.setItem('jan_sanket_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    if (currentUser) localStorage.setItem('jan_sanket_user', JSON.stringify(currentUser));
    else localStorage.removeItem('jan_sanket_user');
  }, [currentUser]);

  const login = (role, name) => {
    setCurrentUser({ role, name, id: `USR-${Date.now()}` });
  };

  const logout = () => setCurrentUser(null);

  const classifyCivicIssue = (textDescription, imagePresetKey) => {
    const query = (textDescription || '').toLowerCase();
    if (query.includes('pothole') || query.includes('road') || query.includes('asphalt') || imagePresetKey === 'pothole') {
      return { category: "Road & Infrastructure", subcategory: "Pothole / Road Surface", department: "Public Works Department (PWD)", severity: "CRITICAL", priorityLevel: "HIGH", priorityScore: 94, confidence: 95, keywords: ["Pothole", "Asphalt Failure", "Traffic Hazard"] };
    } else if (query.includes('garbage') || query.includes('trash') || query.includes('waste') || imagePresetKey === 'garbage') {
      return { category: "Sanitation & Waste Management", subcategory: "Waste Accumulation", department: "Solid Waste Management (SWM)", severity: "HIGH", priorityLevel: "HIGH", priorityScore: 88, confidence: 97, keywords: ["Garbage Overflow", "Sanitation Hazard", "Public Health"] };
    } else if (query.includes('light') || query.includes('dark') || query.includes('pole') || imagePresetKey === 'streetlight') {
      return { category: "Electrical & Lighting", subcategory: "Street Light Outage", department: "Electrical Department", severity: "MEDIUM", priorityLevel: "MEDIUM", priorityScore: 68, confidence: 92, keywords: ["Streetlight Outage", "Pedestrian Darkness"] };
    } else if (query.includes('water') || query.includes('leak') || query.includes('pipe') || imagePresetKey === 'water') {
      return { category: "Water Supply & Sewage", subcategory: "Pipe Burst Leakage", department: "Water Supply & Hydro Utility", severity: "CRITICAL", priorityLevel: "HIGH", priorityScore: 96, confidence: 98, keywords: ["Water Main Leak", "Wastage", "Infrastructure Hazard"] };
    }
    return { category: "Civic Utilities", subcategory: "General Maintenance", department: "Municipal General Administration", severity: "MEDIUM", priorityLevel: "MEDIUM", priorityScore: 60, confidence: 85, keywords: ["Civic Maintenance", "General Complaint"] };
  };

  const addComplaint = (data) => {
    const id = `JS-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const ai = classifyCivicIssue(data.description || "", data.imagePresetKey);
    const now = new Date().toISOString();
    const ts = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const c = {
      id, title: data.title || `${ai.subcategory} at ${(data.locationName || '').split(',')[0]}`,
      category: ai.category, subcategory: ai.subcategory, description: data.description || "",
      photoUrl: data.photoUrl || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
      locationName: data.locationName || "City Centre, Ward 12",
      lat: data.lat || 19.076, lng: data.lng || 72.878,
      ward: data.ward || "Ward 12 (Central Zone)",
      department: ai.department, assignedOfficer: "Pending Assignment", officerPhone: "",
      priorityLevel: ai.priorityLevel, priorityScore: ai.priorityScore,
      severity: ai.severity, confidence: ai.confidence, keywords: ai.keywords,
      corroborations: 1, status: "CLASSIFIED",
      slaHoursTotal: 48, slaHoursRemaining: 48, slaBreached: false,
      createdAt: now, updatedAt: now, resolution: null,
      reportedBy: currentUser?.name || "Anonymous Citizen",
      timeline: [
        { status: "REPORTED", title: "Complaint Logged", text: "Submitted with evidence.", timestamp: ts, actor: currentUser?.name || "Citizen" },
        { status: "AI_ANALYZED", title: "AI Analysis Complete", text: `Identified as ${ai.subcategory} with ${ai.confidence}% confidence.`, timestamp: ts, actor: "Jan Sanket AI Engine" },
        { status: "ROUTED", title: "Routed to Department", text: `Routed to ${ai.department}.`, timestamp: ts, actor: "Routing Engine" }
      ]
    };
    setComplaints(prev => [c, ...prev]);
    setNotifications(prev => [{ id: `n-${Date.now()}`, title: "Complaint Created", message: `Ticket ${id} logged and routed to ${ai.department}.`, time: "Just now", read: false, complaintId: id }, ...prev]);
    return c;
  };

  const assignOfficer = (complaintId, officerName, phone) => {
    const ts = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    setComplaints(prev => prev.map(item => item.id !== complaintId ? item : {
      ...item, assignedOfficer: officerName, officerPhone: phone || "+91 98200 00000", status: "ASSIGNED",
      timeline: [...item.timeline, { status: "ASSIGNED", title: "Officer Assigned", text: `Assigned to ${officerName}.`, timestamp: ts, actor: "Department Head" }]
    }));
  };

  const updateStatus = (complaintId, newStatus, remarkText = "") => {
    const ts = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    setComplaints(prev => prev.map(item => item.id !== complaintId ? item : {
      ...item, status: newStatus,
      timeline: [...item.timeline, { status: newStatus, title: `Status: ${newStatus.replace(/_/g, ' ')}`, text: remarkText || "Status updated.", timestamp: ts, actor: currentUser?.name || "System" }]
    }));
  };

  const submitResolution = (complaintId, afterPhotoUrl, remarks) => {
    const ts = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    setComplaints(prev => prev.map(item => item.id !== complaintId ? item : {
      ...item, status: "CITIZEN_VERIFICATION",
      resolution: { afterPhotoUrl: afterPhotoUrl || "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80", remarks: remarks || "Work completed.", completedAt: new Date().toISOString(), submittedBy: item.assignedOfficer || "Field Officer", verifiedByCitizen: null },
      timeline: [...item.timeline, { status: "RESOLUTION_SUBMITTED", title: "Resolution Evidence Uploaded", text: remarks || "Official uploaded proof.", timestamp: ts, actor: item.assignedOfficer || "Field Officer" }]
    }));
    setNotifications(prev => [{ id: `n-${Date.now()}`, title: "Resolution Submitted", message: `Proof uploaded for ${complaintId}. Awaiting citizen verification!`, time: "Just now", read: false, complaintId }, ...prev]);
  };

  const verifyResolution = (complaintId, isConfirmed, reason = "") => {
    const ts = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    setComplaints(prev => prev.map(item => item.id !== complaintId ? item : {
      ...item, status: isConfirmed ? "RESOLVED" : "REOPENED",
      resolution: item.resolution ? { ...item.resolution, verifiedByCitizen: isConfirmed ? "CONFIRMED" : "REJECTED" } : null,
      timeline: [...item.timeline, { status: isConfirmed ? "RESOLVED" : "REOPENED", title: isConfirmed ? "Ticket Closed — Citizen Verified" : "Issue Reopened by Citizen", text: isConfirmed ? "Citizen confirmed work is complete." : `Citizen rejected: "${reason}"`, timestamp: ts, actor: currentUser?.name || "Citizen" }]
    }));
  };

  const markNotificationRead = (nId) => setNotifications(prev => prev.map(n => n.id === nId ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const resetData = () => { localStorage.removeItem('jan_sanket_complaints'); setComplaints(INITIAL_COMPLAINTS); };

  return (
    <AppContext.Provider value={{
      complaints, currentUser, login, logout,
      theme, toggleTheme,
      notifications, markNotificationRead, markAllRead,
      addComplaint, assignOfficer, updateStatus, submitResolution, verifyResolution,
      classifyCivicIssue, resetData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
