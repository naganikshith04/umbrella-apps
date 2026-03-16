// Social Media Analytics Dashboard

// Sample data generator
const generateAnalyticsData = (days = 30) => {
  const data = [];
  const today = new Date();
  const platforms = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok'];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    platforms.forEach(platform => {
      data.push({
        date: date.toISOString().split('T')[0],
        platform,
        followers: Math.floor(Math.random() * 5000) + 10000,
        reach: Math.floor(Math.random() * 50000) + 20000,
        engagement: Math.floor(Math.random() * 5000) + 1000,
        posts: Math.floor(Math.random() * 5) + 1,
        likes: Math.floor(Math.random() * 3000) + 500,
        comments: Math.floor(Math.random() * 500) + 50,
        shares: Math.floor(Math.random() * 300) + 30,
        clicks: Math.floor(Math.random() * 2000) + 200
      });
    });
  }
  
  return data;
};

// Initialize data
let analyticsData = generateAnalyticsData(30);
let charts = {};

// Save data to localStorage
const saveData = () => {
  localStorage.setItem('analyticsData', JSON.stringify(analyticsData));
};

// Load data from localStorage
const loadData = () => {
  const saved = localStorage.getItem('analyticsData');
  if (saved) {
    analyticsData = JSON.parse(saved);
  }
};

// Filter data based on date range and platform
const filterData = () => {
  const dateFrom = document.getElementById('dateFrom').value;
  const dateTo = document.getElementById('dateTo').value;
  const platform = document.getElementById('platformFilter').value;
  
  let filtered = [...analyticsData];
  
  if (dateFrom) {
    filtered = filtered.filter(item => item.date >= dateFrom);
  }
  
  if (dateTo) {
    filtered = filtered.filter(item => item.date <= dateTo);
  }
  
  if (platform !== 'all') {
    filtered = filtered.filter(item => item.platform === platform);
  }
  
  return filtered;
};

// Calculate KPIs
const calculateKPIs = (data) => {
  if (data.length === 0) return null;
  
  const totalFollowers = data.reduce((sum, item) => sum + item.followers, 0);
  const totalReach = data.reduce((sum, item) => sum + item.reach, 0);
  const totalEngagement = data.reduce((sum, item) => sum + item.engagement, 0);
  const totalPosts = data.reduce((sum, item) => sum + item.posts, 0);
  
  const engagementRate = totalReach > 0 ? ((totalEngagement / totalReach) * 100).toFixed(2) : 0;
  
  // Calculate trends (compare first half vs second half)
  const midPoint = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, midPoint);
  const secondHalf = data.slice(midPoint);
  
  const firstHalfFollowers = firstHalf.reduce((sum, item) => sum + item.followers, 0) / firstHalf.length;
  const secondHalfFollowers = secondHalf.reduce((sum, item) => sum + item.followers, 0) / secondHalf.length;
  const followersTrend = firstHalfFollowers > 0 ? (((secondHalfFollowers - firstHalfFollowers) / firstHalfFollowers) * 100).toFixed(1) : 0;
  
  const firstHalfReach = firstHalf.reduce((sum, item) => sum + item.reach, 0) / firstHalf.length;
  const secondHalfReach = secondHalf.reduce((sum, item) => sum + item.reach, 0) / secondHalf.length;
  const reachTrend = firstHalfReach > 0 ? (((secondHalfReach - firstHalfReach) / firstHalfReach) * 100).toFixed(1) : 0;
  
  const firstHalfEngagement = firstHalf.reduce((sum, item) => sum + item.engagement, 0) / firstHalf.length;
  const secondHalfEngagement = secondHalf.reduce((sum, item) => sum + item.engagement, 0) / secondHalf.length;
  const engagementTrend = firstHalfEngagement > 0 ? (((secondHalfEngagement - firstHalfEngagement) / firstHalfEngagement) * 100).toFixed(1) : 0;
  
  const firstHalfPosts = firstHalf.reduce((sum, item) => sum + item.posts, 0);
  const secondHalfPosts = secondHalf.reduce((sum, item) => sum + item.posts, 0);
  const postsTrend = firstHalfPosts > 0 ? (((secondHalfPosts - firstHalfPosts) / firstHalfPosts) * 100).toFixed(1) : 0;
  
  // Growth rate (followers)
  const growthRate = followersTrend;
  
  // Best performing day
  const dayStats = {};
  data.forEach(item => {
    const day = new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' });
    if (!dayStats[day]) {
      dayStats[day] = { engagement: 0, count: 0 };
    }
    dayStats[day].engagement += item.engagement;
    dayStats[day].count++;
  });
  
  let bestDay = '';
  let maxEngagement = 0;
  Object.keys(dayStats).forEach(day => {
    const avgEngagement = dayStats[day].engagement / dayStats[day].count;
    if (avgEngagement > maxEngagement) {
      maxEngagement = avgEngagement;
      bestDay = day;
    }
  });
  
  // Peak hour (simulated)
  const peakHour = `${Math.floor(Math.random() * 12) + 9}:00 ${Math.random() > 0.5 ? 'AM' : 'PM'}`;
  
  // Top content
  const platformEngagement = {};
  data.forEach(item => {
    if (!platformEngagement[item.platform]) {
      platformEngagement[item.platform] = 0;
    }
    platformEngagement[item.platform] += item.engagement;
  });
  
  const topContent = Object.keys(platformEngagement).sort((a, b) => 
    platformEngagement[b] - platformEngagement[a]
  )[0] || 'N/A';
  
  return {
    totalFollowers,
    totalReach,
    engagementRate,
    totalPosts,
    followersTrend,
    reachTrend,
    engagementTrend,
    postsTrend,
    growthRate,
    bestDay,
    peakHour,
    topContent
  };
};

// Update KPI cards
const updateKPIs = () => {
  const data = filterData();
  const kpis = calculateKPIs(data);
  
  if (!kpis) return;
  
  document.getElementById('totalFollowers').textContent = kpis.totalFollowers.toLocaleString();
  document.getElementById('totalReach').textContent = kpis.totalReach.toLocaleString();
  document.getElementById('engagementRate').textContent = `${kpis.engagementRate}%`;
  document.getElementById('postsPublished').textContent = kpis.totalPosts.toLocaleString();
  
  document.getElementById('followersTrend').textContent = `${kpis.followersTrend > 0 ? '+' : ''}${kpis.followersTrend}%`;
  document.getElementById('followersTrend').className = kpis.followersTrend >= 0 ? 'positive' : 'negative';
  
  document.getElementById('reachTrend').textContent = `${kpis.reachTrend > 0 ? '+' : ''}${kpis.reachTrend}%`;
  document.getElementById('reachTrend').className = kpis.reachTrend >= 0 ? 'positive' : 'negative';
  
  document.getElementById('engagementTrend').textContent = `${kpis.engagementTrend > 0 ? '+' : ''}${kpis.engagementTrend}%`;
  document.getElementById('engagementTrend').className = kpis.engagementTrend >= 0 ? 'positive' : 'negative';
  
  document.getElementById('postsTrend').textContent = `${kpis.postsTrend > 0 ? '+' : ''}${kpis.postsTrend}%`;
  document.getElementById('postsTrend').className = kpis.postsTrend >= 0 ? 'positive' : 'negative';
  
  document.getElementById('growthRate').textContent = `${kpis.growthRate > 0 ? '+' : ''}${kpis.growthRate}%`;
  document.getElementById('bestDay').textContent = kpis.bestDay;
  document.getElementById('peakHour').textContent = kpis.peakHour;
  document.getElementById('topContent').textContent = kpis.topContent;
};

// Prepare chart data
const prepareChartData = (data) => {
  const dates = [...new Set(data.map(item => item.date))].sort();
  
  // Aggregate by date
  const aggregated = {};
  dates.forEach(date => {
    aggregated[date] = {
      followers: 0,
      reach: 0,
      engagement: 0,
      posts: 0
    };
  });
  
  data.forEach(item => {
    aggregated[item.date].followers += item.followers;
    aggregated[item.date].reach += item.reach;
    aggregated[item.date].engagement += item.engagement;
    aggregated[item.date].posts += item.posts;
  });
  
  return {
    labels: dates,
    followers: dates.map(date => aggregated[date].followers),
    reach: dates.map(date => aggregated[date].reach),
    engagement: dates.map(date => aggregated[date].engagement),
    posts: dates.map(date => aggregated[date].posts)
  };
};

// Prepare platform chart data
const preparePlatformData = (data) => {
  const platforms = [...new Set(data.map(item => item.platform))];
  const platformStats = {};
  
  platforms.forEach(platform => {
    platformStats[platform] = {
      followers: 0,
      engagement: 0
    };
  });
  
  data.forEach(item => {
    platformStats[item.platform].followers += item.followers;
    platformStats[item.platform].engagement += item.engagement;
  });
  
  return {
    labels: platforms,
    followers: platforms.map(p => platformStats[p].followers),
    engagement: platforms.map(p => platformStats[p].engagement)
  };
};

// Create/Update Engagement Chart
const updateEngagementChart = () => {
  const data = filterData();
  const chartData = prepareChartData(data);
  
  const ctx = document.getElementById('engagementChart');
  if (!ctx) return;
  
  if (charts.engagement) {
    charts.engagement.destroy();
  }
  
  charts.engagement = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.labels,
      datasets: [{
        label: 'Engagement',
        data: chartData.engagement,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        title: {
          display: true,
          text: 'Engagement Over Time'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
};

// Create/Update Growth Chart
const updateGrowthChart = () => {
  const data = filterData();
  const chartData = prepareChartData(data);
  
  const ctx = document.getElementById('growthChart');
  if (!ctx) return;
  
  if (charts.growth) {
    charts.growth.destroy();
  }
  
  charts.growth = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartData.labels,
      datasets: [{
        label: 'Followers',
        data: chartData.followers,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        title: {
          display: true,
          text: 'Follower Growth'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
};

// Create/Update Platform Chart
const updatePlatformChart = () => {
  const data = filterData();
  const chartData = preparePlatformData(data);
  
  const ctx = document.getElementById('platformChart');
  if (!ctx) return;
  
  if (charts.platform) {
    charts.platform.destroy();
  }
  
  const colors = [
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)'
  ];
  
  charts.platform = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: chartData.labels,
      datasets: [{
        label: 'Followers by Platform',
        data: chartData.followers,
        backgroundColor: colors,
        borderColor: colors.map(c => c.replace('0.6', '1')),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'right'
        },
        title: {
          display: true,
          text: 'Platform Distribution'
        }
      }
    }
  });
};

// Create/Update Performance Chart
const updatePerformanceChart = () => {
  const data = filterData();
  const chartData = prepareChartData(data);
  
  const ctx = document.getElementById('performanceChart');
  if (!ctx) return;
  
  if (charts.performance) {
    charts.performance.destroy();
  }
  
  charts.performance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: 'Reach',
          data: chartData.reach,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: 'Posts',
          data: chartData.posts,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        title: {
          display: true,
          text: 'Reach vs Posts'
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Reach'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Posts'
          },
          grid: {
            drawOnChartArea: false
          }
        }
      }
    }
  });
};

// Update all charts
const updateAllCharts = () => {
  updateEngagementChart();
  updateGrowthChart();
  updatePlatformChart();
  updatePerformanceChart();
};

// Update data table
const updateDataTable = () => {
  const data = filterData();
  const sortBy = document.getElementById('sortBy').value;
  const searchTerm = document.getElementById('tableSearch').value.toLowerCase();
  
  // Filter by search
  let filteredData = data.filter(item => 
    item.platform.toLowerCase().includes(searchTerm) ||
    item.date.includes(searchTerm)
  );
  
  // Sort data
  filteredData.sort((a, b) => {
    switch(sortBy) {
      case 'date':
        return b.date.localeCompare(a.date);
      case 'platform':
        return a.platform.localeCompare(b.platform);
      case 'engagement':
        return b.engagement - a.engagement;
      case 'reach':
        return b.reach - a.reach;
      default:
        return 0;
    }
  });
  
  const tbody = document.getElementById('dataTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  // Limit to last 50 entries for performance
  filteredData.slice(0, 50).forEach(item => {
    const row = document.createElement('tr');
    
    const engagementRate = item.reach > 0 ? ((item.engagement / item.reach) * 100).toFixed(2) : 0;
    
    row.innerHTML = `
      <td>${item.date}</td>
      <td>${item.platform}</td>
      <td>${item.followers.toLocaleString()}</td>
      <td>${item.reach.toLocaleString()}</td>
      <td>${item.engagement.toLocaleString()}</td>
      <td>${engagementRate}%</td>
      <td>${item.posts}</td>
    `;
    
    tbody.appendChild(row);
  });
};

// Export data
const exportData = () => {
  const data = filterData();
  
  if (data.length === 0) {
    alert('No data to export');
    return;
  }
  
  // Prepare CSV data
  const headers = ['Date', 'Platform', 'Followers', 'Reach', 'Engagement', 'Engagement Rate', 'Posts', 'Likes', 'Comments', 'Shares', 'Clicks'];
  
  const csvData = data.map(item => {
    const engagementRate = item.reach > 0 ? ((item.engagement / item.reach) * 100).toFixed(2) : 0;
    return [
      item.date,
      item.platform,
      item.followers,
      item.reach,
      item.engagement,
      engagementRate,
      item.posts,
      item.likes,
      item.comments,
      item.shares,
      item.clicks
    ];
  });
  
  // Use Papa Parse if available, otherwise create CSV manually
  let csv;
  if (typeof Papa !== 'undefined') {
    csv = Papa.unparse({
      fields: headers,
      data: csvData
    });
  } else {
    csv = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
  }
  
  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `analytics_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Refresh data
const refreshData = () => {
  analyticsData = generateAnalyticsData(30);
  saveData();
  updateDashboard();
  
  // Show feedback
  const btn = document.getElementById('refreshData');
  if (btn) {
    const originalText = btn.textContent;
    btn.textContent = 'Refreshed!';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 1000);
  }
};

// Update entire dashboard
const updateDashboard = () => {
  updateKPIs();
  updateAllCharts();
  updateDataTable();
};

// Initialize date inputs
const initializeDateInputs = () => {
  const dateTo = document.getElementById('dateTo');
  const dateFrom = document.getElementById('dateFrom');
  
  if (dateTo && dateFrom) {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    dateTo.value = today.toISOString().split('T')[0];
    dateFrom.value = thirtyDaysAgo.toISOString().split('T')[0];
    
    dateTo.max = today.toISOString().split('T')[0];
    dateFrom.max = today.toISOString().split('T')[0];
  }
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  initializeDateInputs();
  updateDashboard();
  
  // Apply filters button
  const applyFiltersBtn = document.getElementById('applyFilters');
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', () => {
      const dateFrom = document.getElementById('dateFrom').value;
      const dateTo = document.getElementById('dateTo').value;
      
      if (dateFrom && dateTo && dateFrom > dateTo) {
        alert('Start date must be before end date');
        return;
      }
      
      updateDashboard();
    });
  }
  
  // Platform filter
  const platformFilter = document.getElementById('platformFilter');
  if (platformFilter) {
    platformFilter.addEventListener('change', updateDashboard);
  }
  
  // Export data button
  const exportBtn = document.getElementById('exportData');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportData);
  }
  
  // Refresh data button
  const refreshBtn = document.getElementById('refreshData');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', refreshData);
  }
  
  // Sort by dropdown
  const sortBy = document.getElementById('sortBy');
  if (sortBy) {
    sortBy.addEventListener('change', updateDataTable);
  }
  
  // Table search
  const tableSearch = document.getElementById('tableSearch');
  if (tableSearch) {
    tableSearch.addEventListener('input', updateDataTable);
  }
  
  // Date inputs
  const dateFrom = document.getElementById('dateFrom');
  const dateTo = document.getElementById('dateTo');
  
  if (dateFrom) {
    dateFrom.addEventListener('change', () => {
      const applyBtn = document.getElementById('applyFilters');
      if (applyBtn) {
        applyBtn.style.backgroundColor = '#e74c3c';
      }
    });
  }
  
  if (dateTo) {
    dateTo.addEventListener('change', () => {
      const applyBtn = document.getElementById('applyFilters');
      if (applyBtn) {
        applyBtn.style.backgroundColor = '#e74c3c';
      }
    });
  }
});

// Auto-refresh every 5 minutes
setInterval(() => {
  analyticsData = generateAnalyticsData(30);
  saveData();
  updateDashboard();
}, 300000);