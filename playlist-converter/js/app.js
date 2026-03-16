```javascript
// Playlist Converter JavaScript

// Mock data for demonstration (in real app, would use actual API calls)
const MOCK_PLAYLISTS = {
  'spotify:playlist:37i9dQZF1DXcBWIGoYBM5M': {
    service: 'spotify',
    title: 'Today\'s Top Hits',
    tracks: [
      { title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20' },
      { title: 'Shape of You', artist: 'Ed Sheeran', album: '÷', duration: '3:53' },
      { title: 'Dance Monkey', artist: 'Tones and I', album: 'The Kids Are Coming', duration: '3:29' },
      { title: 'Someone You Loved', artist: 'Lewis Capaldi', album: 'Divinely Uninspired', duration: '3:02' },
      { title: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line', duration: '2:54' }
    ]
  },
  'apple:playlist:pl.u-8aAVZAPCLEjZoM': {
    service: 'apple',
    title: 'A-List Pop',
    tracks: [
      { title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: '3:23' },
      { title: 'Peaches', artist: 'Justin Bieber', album: 'Justice', duration: '3:18' },
      { title: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR', duration: '2:58' },
      { title: 'Save Your Tears', artist: 'The Weeknd', album: 'After Hours', duration: '3:35' }
    ]
  },
  'youtube:playlist:RDCLAK5uy_kmPRjHDECIcuVwnKsx2Ng7fyNgFKWNJx8': {
    service: 'youtube',
    title: 'Hot Hits',
    tracks: [
      { title: 'Shivers', artist: 'Ed Sheeran', album: '=', duration: '3:27' },
      { title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', album: 'F*ck Love 3', duration: '2:21' },
      { title: 'Heat Waves', artist: 'Glass Animals', album: 'Dreamland', duration: '3:58' },
      { title: 'Montero', artist: 'Lil Nas X', album: 'Montero', duration: '2:17' },
      { title: 'Industry Baby', artist: 'Lil Nas X & Jack Harlow', album: 'Montero', duration: '3:32' }
    ]
  }
};

let currentPlaylist = null;
let parsedTracks = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
  loadFromLocalStorage();
});

function initializeEventListeners() {
  document.getElementById('parseBtn').addEventListener('click', parsePlaylist);
  document.getElementById('exportCsvBtn').addEventListener('click', exportToCsv);
  document.getElementById('exportJsonBtn').addEventListener('click', exportToJson);
  document.getElementById('generateLinkBtn').addEventListener('click', generateShareableLink);
  document.getElementById('copyLinkBtn').addEventListener('click', copyShareableLink);
  
  // Auto-detect service from URL
  document.getElementById('playlistUrl').addEventListener('input', autoDetectService);
  
  // Handle URL parameters for shared links
  handleSharedLink();
}

function autoDetectService() {
  const url = document.getElementById('playlistUrl').value.trim();
  const sourceService = document.getElementById('sourceService');
  
  if (url.includes('spotify.com')) {
    sourceService.value = 'spotify';
  } else if (url.includes('music.apple.com')) {
    sourceService.value = 'apple';
  } else if (url.includes('youtube.com') || url.includes('music.youtube.com')) {
    sourceService.value = 'youtube';
  } else if (url.includes('deezer.com')) {
    sourceService.value = 'deezer';
  } else if (url.includes('tidal.com')) {
    sourceService.value = 'tidal';
  }
}

async function parsePlaylist() {
  const playlistUrl = document.getElementById('playlistUrl').value.trim();
  const sourceService = document.getElementById('sourceService').value;
  
  if (!playlistUrl) {
    showStatus('Please enter a playlist URL', 'error');
    return;
  }
  
  if (!sourceService) {
    showStatus('Please select a source service', 'error');
    return;
  }
  
  showLoading(true);
  showStatus('Parsing playlist...', 'info');
  
  try {
    // Simulate API call delay
    await delay(1500);
    
    // Extract playlist ID from URL
    const playlistId = extractPlaylistId(playlistUrl, sourceService);
    
    // Fetch playlist data (mock implementation)
    const playlistData = await fetchPlaylistData(playlistId, sourceService);
    
    if (!playlistData) {
      throw new Error('Playlist not found. Please check the URL and try again.');
    }
    
    currentPlaylist = playlistData;
    parsedTracks = playlistData.tracks;
    
    displayPlaylist(playlistData);
    saveToLocalStorage();
    
    showStatus(`Successfully parsed ${parsedTracks.length} tracks!`, 'success');
    showLoading(false);
    
  } catch (error) {
    showStatus(error.message, 'error');
    showLoading(false);
  }
}

function extractPlaylistId(url, service) {
  // Simple extraction based on service patterns
  if (service === 'spotify') {
    const match = url.match(/playlist[\/:]([a-zA-Z0-9]+)/);
    return match ? `spotify:playlist:${match[1]}` : 'spotify:playlist:37i9dQZF1DXcBWIGoYBM5M';
  } else if (service === 'apple') {
    return 'apple:playlist:pl.u-8aAVZAPCLEjZoM';
  } else if (service === 'youtube') {
    return 'youtube:playlist:RDCLAK5uy_kmPRjHDECIcuVwnKsx2Ng7fyNgFKWNJx8';
  }
  
  // Return first available mock playlist
  return Object.keys(MOCK_PLAYLISTS)[0];
}

async function fetchPlaylistData(playlistId, service) {
  // In real implementation, this would call actual APIs
  // For demo, return mock data
  
  // Try to find exact match
  if (MOCK_PLAYLISTS[playlistId]) {
    return MOCK_PLAYLISTS[playlistId];
  }
  
  // Return first playlist matching service
  for (const [id, data] of Object.entries(MOCK_PLAYLISTS)) {
    if (data.service === service) {
      return data;
    }
  }
  
  // Return first available playlist
  return MOCK_PLAYLISTS[Object.keys(MOCK_PLAYLISTS)[0]];
}

function displayPlaylist(playlist) {
  // Update playlist info
  document.getElementById('playlistTitle').textContent = playlist.title;
  document.getElementById('trackCount').textContent = playlist.tracks.length;
  
  // Calculate total duration
  const totalDuration = calculateTotalDuration(playlist.tracks);
  document.getElementById('playlistDuration').textContent = totalDuration;
  
  // Show preview section
  document.getElementById('playlistPreview').classList.remove('hidden');
  
  // Populate track table
  const tbody = document.getElementById('trackTableBody');
  tbody.innerHTML = '';
  
  playlist.tracks.forEach((track, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-4 py-3 text-sm text-gray-900">${index + 1}</td>
      <td class="px-4 py-3 text-sm font-medium text-gray-900">${escapeHtml(track.title)}</td>
      <td class="px-4 py-3 text-sm text-gray-600">${escapeHtml(track.artist)}</td>
      <td class="px-4 py-3 text-sm text-gray-600">${escapeHtml(track.album)}</td>
      <td class="px-4 py-3 text-sm text-gray-600">${track.duration}</td>
    `;
    tbody.appendChild(row);
  });
}

function calculateTotalDuration(tracks) {
  let totalSeconds = 0;
  
  tracks.forEach(track => {
    const [minutes, seconds] = track.duration.split(':').map(Number);
    totalSeconds += minutes * 60 + seconds;
  });
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m ${seconds}s`;
}

function exportToCsv() {
  if (!parsedTracks.length) {
    showStatus('No tracks to export. Please parse a playlist first.', 'error');
    return;
  }
  
  try {
    const targetService = document.getElementById('targetService').value;
    
    // Prepare data for CSV
    const csvData = parsedTracks.map((track, index) => ({
      '#': index + 1,
      'Title': track.title,
      'Artist': track.artist,
      'Album': track.album,
      'Duration': track.duration,
      'Target Service': targetService || 'Not specified'
    }));
    
    // Convert to CSV using PapaParse
    const csv = Papa.unparse(csvData);
    
    // Create and download file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const filename = `${sanitizeFilename(currentPlaylist.title)}_${targetService || 'playlist'}.csv`;
    saveAs(blob, filename);
    
    showStatus('Playlist exported to CSV successfully!', 'success');
    
  } catch (error) {
    showStatus('Error exporting to CSV: ' + error.message, 'error');
  }
}

function exportToJson() {
  if (!parsedTracks.length) {
    showStatus('No tracks to export. Please parse a playlist first.', 'error');
    return;
  }
  
  try {
    const targetService = document.getElementById('targetService').value;
    
    const jsonData = {
      playlist: {
        title: currentPlaylist.title,
        sourceService: currentPlaylist.service,
        targetService: targetService || null,
        trackCount: parsedTracks.length,
        totalDuration: document.getElementById('playlistDuration').textContent,
        exportDate: new Date().toISOString()
      },
      tracks: parsedTracks.map((track, index) => ({
        position: index + 1,
        title: track.title,
        artist: track.artist,
        album: track.album,
        duration: track.duration
      }))
    };
    
    const json = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const filename = `${sanitizeFilename(currentPlaylist.title)}_${targetService || 'playlist'}.json`;
    saveAs(blob, filename);
    
    showStatus('Playlist exported to JSON successfully!', 'success');
    
  } catch (error) {
    showStatus('Error exporting to JSON: ' + error.message, 'error');
  }
}

function generateShareableLink() {
  if (!parsedTracks.length) {
    showStatus('No tracks to share. Please parse a playlist first.', 'error');
    return;
  }
  
  try {
    const targetService = document.getElementById('targetService').value;
    
    // Create shareable data
    const shareData = {
      title: currentPlaylist.title,
      source: currentPlaylist.service,
      target: targetService,
      tracks: parsedTracks
    };
    
    // Encode data to base64
    const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
    
    // Generate shareable URL
    const baseUrl = window.location.origin + window.location.pathname;
    const shareableUrl = `${baseUrl}?shared=${encoded}`;
    
    // Display shareable link
    const linkInput = document.getElementById('shareableLink');
    linkInput.value = shareableUrl;
    linkInput.classList.remove('hidden');
    
    document.getElementById('copyLinkBtn').classList.remove('hidden');
    
    showStatus('Shareable link generated!', 'success');
    
  } catch (error) {
    showStatus('Error generating shareable link: ' + error.message, 'error');
  }
}

function copyShareableLink() {
  const linkInput = document.getElementById('shareableLink');
  
  if (!linkInput.value) {
    showStatus('No link to copy', 'error');
    return;
  }
  
  linkInput.select();
  linkInput.setSelectionRange(0, 99999); // For mobile devices
  
  navigator.clipboard.writeText(linkInput.value).then(() => {
    showStatus('Link copied to clipboard!', 'success');
    
    // Visual feedback
    const copyBtn = document.getElementById('copyLinkBtn');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  }).catch(err => {
    showStatus('Failed to copy link', 'error');
  });
}

function handleSharedLink() {
  const urlParams = new URLSearchParams(window.location.search);
  const sharedData = urlParams.get('shared');
  
  if (sharedData) {
    try {
      const decoded = JSON.parse(decodeURIComponent(atob(sharedData)));
      
      currentPlaylist = {
        title: decoded.title,
        service: decoded.source,
        tracks: decoded.tracks
      };
      
      parsedTracks = decoded.tracks;
      
      // Update UI
      document.getElementById('sourceService').value = decoded.source;
      if (decoded.target) {
        document.getElementById('targetService').value = decoded.target;
      }
      
      displayPlaylist(currentPlaylist);
      showStatus('Shared playlist loaded successfully!', 'success');
      
    } catch (error) {
      console.error('Error loading shared playlist:', error);
    }
  }
}

function saveToLocalStorage() {
  if (currentPlaylist && parsedTracks.length > 0) {
    const data = {
      playlist: currentPlaylist,
      tracks: parsedTracks,
      timestamp: Date.now()
    };
    localStorage.setItem('playlistConverter_lastPlaylist', JSON.stringify(data));
  }
}

function loadFromLocalStorage() {
  const stored = localStorage.getItem('playlistConverter_lastPlaylist');
  
  if (stored) {
    try {
      const data = JSON.parse(stored);
      
      // Only load if less than 24 hours old
      if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
        currentPlaylist = data.playlist;
        parsedTracks = data.tracks;
        
        if (parsedTracks.length > 0) {
          displayPlaylist(currentPlaylist);
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }
}

function showLoading(show) {
  const loader = document.getElementById('loadingIndicator');
  if (show) {
    loader.classList.remove('hidden');
  } else {
    loader.classList.add('hidden');
  }
}

function showStatus(message, type) {
  const statusEl = document.getElementById('statusMessage');
  statusEl.textContent = message;
  statusEl.className = 'mt-2 text-sm';
  
  if (type === 'error') {
    statusEl.classList.add('text-red-600');
  } else if (type === 'success') {
    statusEl.classList.add('text-green-600');
  } else {
    statusEl.classList.add('text-blue-600');
  }
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    statusEl.textContent = '';
  }, 5000);
}

function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Service-specific URL patterns
const SERVICE_PATTERNS = {
  spotify: /spotify\.com\/playlist\/([a-zA-Z0-9]+)/,
  apple: /music\.apple\.com\/[a-z]{2}\/playlist\/[^\/]+\/pl\.([a-zA-Z0-9-]+)/,
  youtube: /(?:youtube\.com|music\.youtube\.com)\/playlist\?list=([a-zA-Z0-9_-]+)/,
  deezer: /deezer\.com\/[a-z]{2}\/playlist\/([0-9]+)/,
  tidal: /tidal\.com\/browse\/playlist\/([a-zA-Z0-9-]+)/
};

// Demo mode: Add some example playlists
window.loadDemoPlaylist = function(service) {
  const demoUrls = {
    spotify: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
    apple: 'https://music.apple.com/us/playlist/a-list-pop/pl.u-8aAVZAPCLEjZoM',
    youtube: 'https://music.youtube.com/playlist?list=RDCLAK5uy_kmPRjHDECIcuVwnKsx2Ng7fyNgFKWNJx8'
  };
  
  const url = demoUrls[service] || demoUrls.spotify;
  document.getElementById('playlistUrl').value = url;
  document.getElementById('sourceService').value = service;
  parsePlaylist();
};

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + Enter to parse
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    parsePlaylist();
  }
  
  // Ctrl/Cmd + E to export CSV
  if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
    e.preventDefault();
    if (parsedTracks.length > 0) {
      exportToCsv();
    }
  }
  
  // Ctrl/Cmd + J to export JSON
  if ((e.ctrlKey || e.metaKey) && e.key === 'j') {
    e.preventDefault();
    if (parsedTracks.length > 0) {
      exportToJson();
    }
  }
});

// Track search/filter functionality
let searchTimeout;
window.filterTracks = function(searchTerm) {
  clearTimeout(searchTimeout);
  
  searchTimeout = setTimeout(() => {
    const tbody = document.getElementById('trackTableBody');
    const rows = tbody.getElementsByTagName('tr');
    const term = searchTerm.toLowerCase();
    
    let visibleCount = 0;
    
    Array.from(rows).forEach(row => {
      const text = row.textContent.toLowerCase();
      if (text.includes(term)) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });
    
    if (searchTerm && visibleCount === 0) {
      showStatus('No tracks found matching your search', 'info');
    }
  }, 300);
};

// Batch operations
window.selectAllTracks = function() {
  const checkboxes = document.querySelectorAll('#trackTableBody input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = true);
};

window.deselectAllTracks = function() {
  const checkboxes = document.querySelectorAll('#trackTableBody input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = false);
};

// Advanced export with selected tracks only
window.exportSelected = function(format) {
  const checkboxes = document.querySelectorAll('#trackTableBody input[type="checkbox"]:checked');
  
  if (checkboxes.length === 0) {
    showStatus('No tracks selected for export', 'error');
    return;
  }
  
  const selectedIndices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
  const selectedTracks = parsedTracks.filter((_, index) => selectedIndices.includes(index));
  
  // Temporarily swap tracks
  const originalTracks = parsedTracks;
  parsedTracks = selectedTracks;
  
  if (format === 'csv') {
    exportToCsv();
  } else if (format === 'json') {
    exportToJson();
  }
  
  // Restore original tracks
  parsedTracks = originalTracks;
};

// Convert playlist format (simulate conversion between services)
window.convertPlaylist = async function() {
  const targetService = document.getElementById('targetService').value;
  
  if (!targetService) {
    showStatus('Please select a target service', 'error');
    return;
  }
  
  if (!parsedTracks.length) {
    showStatus('No tracks to convert. Please parse a playlist first.', 'error');
    return;
  }
  
  showLoading(true);
  showStatus(`Converting to ${targetService}...`, 'info');
  
  try {
    await delay(2000);
    
    // In real implementation, this would match tracks on target service
    const conversionResults = {
      successful: parsedTracks.length,
      failed: 0,
      targetService: targetService
    };
    
    showStatus(
      `Conversion complete! ${conversionResults.successful} tracks matched on ${targetService}.`,
      'success'
    );
    
    showLoading(false);
    
  } catch (error) {
    showStatus('Error converting playlist: ' + error.message, 'error');
    showLoading(false);
  }
};

// Import from file
window.importFromFile = function(event) {
  const file = event.target.files[0];
  
  if (!file) return;
  
  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      const content = e.target.result;
      let importedData;
      
      if (file.name.endsWith('.json')) {
        importedData = JSON.parse(content);
        
        if (importedData.tracks && Array.isArray(importedData.tracks)) {
          parsedTracks = importedData.tracks;
          currentPlaylist = {
            title: importedData.playlist?.title || 'Imported Playlist',
            service: importedData.playlist?.sourceService || 'unknown',
            tracks: parsedTracks
          };
          
          displayPlaylist(currentPlaylist);
          saveToLocalStorage();
          showStatus('Playlist imported from JSON successfully!', 'success');
        }
      } else if (file.name.endsWith('.csv')) {
        Papa.parse(content, {
          header: true,
          complete: function(results) {
            parsedTracks = results.data
              .filter(row => row.Title && row.Artist)
              .map(row => ({
                title: row.Title,
                artist: row.Artist,
                album: row.Album || 'Unknown Album',
                duration: row.Duration || '0:00'
              }));
            
            currentPlaylist = {
              title: 'Imported Playlist',
              service: 'csv',
              tracks: parsedTracks
            };
            
            displayPlaylist(currentPlaylist);
            saveToLocalStorage();
            showStatus('Playlist imported from CSV successfully!', 'success');
          },
          error: function(error) {
            showStatus('Error parsing CSV: ' + error.message, 'error');
          }
        });
      }
      
    } catch (error) {
      showStatus('Error importing file: ' + error.message, 'error');
    }
  };
  
  reader.readAsText(file);
};

// Clear current playlist
window.clearPlaylist = function() {
  if (confirm('Are you sure you want to clear the current playlist?')) {
    currentPlaylist = null;
    parsedTracks = [];
    
    document.getElementById('playlistUrl').value = '';
    document.getElementById('playlistPreview').classList.add('hidden');
    document.getElementById('shareableLink').classList.add('hidden');
    document.getElementById('copyLinkBtn').classList.add('hidden');
    document.getElementById('trackTableBody').innerHTML = '';
    
    localStorage.removeItem('playlistConverter_lastPlaylist');
    
    showStatus('Playlist cleared', 'info');
  }
};

// Sort tracks
window.sortTracks = function(column) {
  if (!parsedTracks.length) return;
  
  const sortOrder = this.sortOrder || {};
  const currentOrder = sortOrder[column] || 'asc';
  const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
  
  parsedTracks.sort((a, b) => {
    let valA, valB;
    
    switch(column) {
      case 'title':
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
        break;
      case 'artist':
        valA = a.artist.toLowerCase();
        valB = b.artist.toLowerCase();
        break;
      case 'album':
        valA = a.album.toLowerCase();
        valB = b.album.toLowerCase();
        break;
      case 'duration':
        valA = durationToSeconds(a.duration);
        valB = durationToSeconds(b.duration);
        break;
      default:
        return 0;
    }
    
    if (valA < valB) return newOrder === 'asc' ? -1 : 1;
    if (valA > valB) return newOrder === 'asc' ? 1 : -1;
    return 0;
  });
  
  sortOrder[column] = newOrder;
  this.sortOrder = sortOrder;
  
  displayPlaylist(currentPlaylist);
  showStatus(`Sorted by ${column} (${newOrder})`, 'info');
};

function durationToSeconds(duration) {
  const parts = duration.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
}

// Remove duplicates
window.removeDuplicates = function() {
  if (!parsedTracks.length) {
    showStatus('No tracks to process', 'error');
    return;
  }
  
  const originalCount = parsedTracks.length;
  const seen = new Set();
  
  parsedTracks = parsedTracks.filter(track => {
    const key = `${track.title.toLowerCase()}-${track.artist.toLowerCase()}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
  
  const removedCount = originalCount - parsedTracks.length;
  
  if (removedCount > 0) {
    currentPlaylist.tracks = parsedTracks;
    displayPlaylist(currentPlaylist);
    saveToLocalStorage();
    showStatus(`Removed ${removedCount} duplicate track(s)`, 'success');
  } else {
    showStatus('No duplicates found', 'info');
  }
};

// Statistics
window.showStatistics = function() {
  if (!parsedTracks.length) {
    showStatus('No tracks to analyze', 'error');
    return;
  }
  
  const artists = {};
  const albums = {};
  
  parsedTracks.forEach(track => {
    artists[track.artist] = (artists[track.artist] || 0) + 1;
    albums[track.album] = (albums[track.album] || 0) + 1;
  });
  
  const topArtist = Object.entries(artists).sort((a, b) => b[1] - a[1])[0];
  const topAlbum = Object.entries(albums).sort((a, b) => b[1] - a[1])[0];
  
  const stats = `
    Playlist Statistics:
    - Total tracks: ${parsedTracks.length}
    - Unique artists: ${Object.keys(artists).length}
    - Unique albums: ${Object.keys(albums).length}
    - Top artist: ${topArtist[0]} (${topArtist[1]} tracks)
    - Top album: ${topAlbum[0]} (${topAlbum[1]} tracks)
  `;
  
  alert(stats);
};

// Validate URL format
function validatePlaylistUrl(url, service) {
  if (!url) return false;
  
  const pattern = SERVICE_PATTERNS[service];
  if (!pattern) return true; // Allow if no pattern defined
  
  return pattern.test(url);
}

// Enhanced parse with validation
const originalParsePlaylist = parsePlaylist;
parsePlaylist = async function() {
  const url = document.getElementById('playlistUrl').value.trim();
  const service = document.getElementById('sourceService').value;
  
  if (!validatePlaylistUrl(url, service) && url.length > 0) {
    showStatus(`Invalid ${service} playlist URL format`, 'error');
    return;
  }
  
  return originalParsePlaylist();
};

// Add example URLs helper
window.showExampleUrl = function(service) {
  const examples = {
    spotify: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
    apple: 'https://music.apple.com/us/playlist/a-list-pop/pl.u-8aAVZAPCLEjZoM',
    youtube: 'https://