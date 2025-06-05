#!/bin/bash
# This script generates placeholder icons for the extension
# In production, replace with actual branded icons

# Create a simple SVG icon
cat > icon.svg << 'EOF'
<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" rx="24" fill="url(#gradient)"/>
  <path d="M40 48h48M40 64h48M40 80h32" stroke="white" stroke-width="6" stroke-linecap="round"/>
  <defs>
    <linearGradient id="gradient" x1="0" y1="0" x2="128" y2="128">
      <stop stop-color="#667eea"/>
      <stop offset="1" stop-color="#764ba2"/>
    </linearGradient>
  </defs>
</svg>
EOF

echo "Placeholder icons created. Replace with actual branded icons for production."