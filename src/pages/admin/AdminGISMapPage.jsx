import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Map, Filter, MapPin, Layers, Building2, Eye, ChevronRight, Navigation, Sparkles } from 'lucide-react';
import L from 'leaflet';

const CATEGORY_COLORS = {
  'Road & Infrastructure': { bg: '#ef4444', label: 'Red = Pothole / Road' },
  'Sanitation & Waste Management': { bg: '#d97706', label: 'Brown = Garbage' },
  'Electrical & Lighting': { bg: '#eab308', label: 'Yellow = Streetlight' },
  'Water Supply & Sewage': { bg: '#3b82f6', label: 'Blue = Water / Drainage' },
  'Civic Utilities': { bg: '#8b5cf6', label: 'Purple = Other' },
};

const getColor = (category) => CATEGORY_COLORS[category]?.bg || '#94a3b8';

export default function AdminGISMapPage() {
  const { complaints, theme } = useApp();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('MARKERS'); // 'MARKERS' | 'HEATMAP'
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [wardFilter, setWardFilter] = useState('ALL');
  const [selectedPin, setSelectedPin] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const tileLayerRef = useRef(null);

  const wards = [...new Set(complaints.map(c => c.ward))];
  const categories = [...new Set(complaints.map(c => c.category))];

  const filtered = complaints.filter(c => {
    if (categoryFilter !== 'ALL' && c.category !== categoryFilter) return false;
    if (wardFilter !== 'ALL' && c.ward !== wardFilter) return false;
    return true;
  });

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create map centered on Mumbai municipal coordinates
    const map = L.map(mapContainerRef.current, {
      center: [19.0760, 72.8777],
      zoom: 13,
      zoomControl: false,
    });

    const initialTileUrl = theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const tileLayer = L.tileLayer(initialTileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    L.control.zoom({ position: 'topright' }).addTo(map);

    mapInstanceRef.current = map;
    layerGroupRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Sync Tile Layer with Theme
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const tileUrl = theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    tileLayerRef.current.setUrl(tileUrl);
  }, [theme]);

  // Update map markers when filtered complaints, viewMode or selectedPin changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    filtered.forEach(c => {
      const lat = c.lat || 19.0760;
      const lng = c.lng || 72.8777;
      const color = getColor(c.category);
      const isSelected = selectedPin?.id === c.id;

      if (viewMode === 'HEATMAP') {
        // Spatial heatmap circle overlay
        const circle = L.circle([lat, lng], {
          radius: 350 + (c.corroborations || 1) * 60,
          color: color,
          fillColor: color,
          fillOpacity: 0.45,
          weight: 1,
        });

        circle.on('click', () => {
          setSelectedPin(c);
          map.panTo([lat, lng], { animate: true });
        });

        circle.addTo(layerGroup);
      } else {
        // DIV Icon Marker
        const iconHtml = `
          <div style="
            position: relative;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background-color: ${color};
            border: 3px solid ${isSelected ? '#0d9488' : '#ffffff'};
            box-shadow: 0 4px 14px ${color}88;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-weight: 800;
            cursor: pointer;
            transform: ${isSelected ? 'scale(1.25)' : 'scale(1)'};
            transition: all 0.2s ease;
          ">
            <span style="font-size: 12px; line-height: 1; font-family: sans-serif;">${c.corroborations || 1}</span>
            <span style="font-size: 7px; opacity: 0.9; text-transform: uppercase;">rpts</span>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-gis-marker',
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        });

        const marker = L.marker([lat, lng], { icon: customIcon });

        // Popup content
        const popupHtml = `
          <div style="font-family: sans-serif; color: #0f172a; padding: 4px; max-width: 200px;">
            <div style="font-size: 10px; font-weight: bold; color: #059669; font-family: monospace;">${c.id}</div>
            <div style="font-size: 12px; font-weight: bold; margin-top: 2px; color: #0f172a;">${c.title}</div>
            <div style="font-size: 11px; color: #475569; margin-top: 2px;">${c.ward}</div>
          </div>
        `;

        marker.bindPopup(popupHtml, {
          className: 'dark-leaflet-popup',
        });

        marker.on('click', () => {
          setSelectedPin(c);
          map.panTo([lat, lng], { animate: true });
        });

        marker.addTo(layerGroup);
      }
    });

    // Auto-fit bounds if we have pins
    if (filtered.length > 0) {
      const bounds = L.latLngBounds(filtered.map(c => [c.lat || 19.0760, c.lng || 72.8777]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [filtered, viewMode, selectedPin]);

  const handleSelectIncident = (c) => {
    setSelectedPin(c);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([c.lat || 19.0760, c.lng || 72.8777], 15, { duration: 1.2 });
    }
  };

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col px-4 lg:px-8 py-4 gap-4 overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 font-heading flex items-center gap-2">
            <Map className="text-amber-600" size={20} /> GIS Ward Incident Map
          </h1>
          <p className="text-xs text-slate-600">{filtered.length} live GIS pins plotted · Real-time spatial tile engine</p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-white border border-slate-200 p-1 rounded-xl gap-1 shadow-sm">
            {['MARKERS', 'HEATMAP'].map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === mode ? 'bg-teal-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}>
                {mode === 'MARKERS' ? '📍 Markers View' : '🔥 Spatial Heatmap'}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs shadow-sm">
            <Filter size={13} className="text-slate-400" />
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="bg-transparent text-slate-900 focus:outline-none font-semibold">
              <option value="ALL">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Ward Filter */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs shadow-sm">
            <Layers size={13} className="text-slate-400" />
            <select value={wardFilter} onChange={e => setWardFilter(e.target.value)} className="bg-transparent text-slate-900 focus:outline-none font-semibold">
              <option value="ALL">All Wards</option>
              {wards.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Map + Panel Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">

        {/* Real Leaflet GIS Map Canvas */}
        <div className="lg:col-span-3 glass-panel border border-slate-200 rounded-2xl relative overflow-hidden bg-white shadow-sm">
          {/* Leaflet container */}
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Bottom status bar */}
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-[10px] text-slate-700 font-mono z-20 flex items-center gap-2 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>OpenStreetMap Live GIS Feed</span>
          </div>

          {/* Legend Bottom-Left */}
          <div className="absolute bottom-3 left-3 glass-panel border border-slate-200 bg-white/95 p-3 rounded-xl text-[11px] space-y-1.5 z-20 shadow-md">
            <div className="font-bold text-slate-900 text-xs mb-2 flex items-center gap-1.5"><Layers size={13} className="text-teal-600" /> Category Legend</div>
            {Object.values(CATEGORY_COLORS).map(({ bg, label }) => (
              <div key={label} className="flex items-center gap-2 text-slate-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: bg }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Incident List + Selected Detail */}
        <div className="lg:col-span-1 flex flex-col gap-3 min-h-0">
          {/* Selected Pin Detail */}
          {selectedPin ? (
            <div className="glass-panel border border-teal-300 bg-white p-4 rounded-2xl shrink-0 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-emerald-700 font-extrabold">{selectedPin.id}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: getColor(selectedPin.category) + '22', color: getColor(selectedPin.category), border: `1px solid ${getColor(selectedPin.category)}44` }}>
                  {selectedPin.category.split(' ')[0]}
                </span>
              </div>
              <img src={selectedPin.photoUrl} alt="" className="w-full h-28 object-cover rounded-xl border border-slate-200 mb-2" />
              <h4 className="font-bold text-slate-900 text-xs line-clamp-2 mb-2">{selectedPin.title}</h4>
              <div className="text-[11px] text-slate-600 space-y-1 mb-3">
                <div className="flex items-center gap-1"><MapPin size={11} className="text-amber-600" />{selectedPin.ward}</div>
                <div className="flex items-center gap-1"><Building2 size={11} className="text-teal-600" /><span className="truncate">{selectedPin.department}</span></div>
                <div className="font-bold text-amber-700">Reported by {selectedPin.corroborations} citizens</div>
                <div className="font-mono text-[10px] text-slate-500">Lat: {selectedPin.lat} · Lng: {selectedPin.lng}</div>
              </div>
              <button onClick={() => navigate(`/admin/complaints/${selectedPin.id}`)} className="btn-primary w-full py-2 text-xs font-bold justify-center bg-teal-600 text-white">
                <Eye size={13} /> Full Complaint Details
              </button>
            </div>
          ) : (
            <div className="glass-panel border border-slate-200 bg-white p-4 rounded-2xl shrink-0 text-center text-xs text-slate-500 shadow-sm">
              <Navigation size={20} className="mx-auto text-teal-600 mb-1" />
              Click any pin on the GIS map to inspect details
            </div>
          )}

          {/* Scrollable Incident List */}
          <div className="glass-panel border border-slate-200 bg-white rounded-2xl flex-1 overflow-y-auto min-h-0 shadow-sm">
            <div className="p-3 border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur-sm z-10 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800">All Plotted Incidents</h3>
              <span className="text-[10px] font-mono text-emerald-700 font-extrabold">{filtered.length} active</span>
            </div>
            <div className="divide-y divide-slate-100">
              {filtered.map(c => (
                <div key={c.id} onClick={() => handleSelectIncident(c)}
                  className={`px-3 py-2.5 cursor-pointer hover:bg-slate-50 transition-colors ${selectedPin?.id === c.id ? 'bg-slate-100 border-l-4 border-teal-600' : ''}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: getColor(c.category) }} />
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-[10px] text-emerald-700 font-bold">{c.id}</div>
                      <div className="text-[11px] text-slate-900 font-bold truncate">{c.title}</div>
                      <div className="text-[10px] text-slate-500">{c.ward}</div>
                    </div>
                    <ChevronRight size={13} className="text-slate-400 shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
