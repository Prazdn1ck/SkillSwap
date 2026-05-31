#!/bin/bash
# SkillSwap — one-command startup script

set -e
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== SkillSwap Setup ===${NC}"

# ── Install backend deps ──────────────────────────────────────
echo -e "\n${YELLOW}[1/4] Installing backend dependencies...${NC}"
cd backend
npm install --silent
cd ..

# ── Install frontend deps ─────────────────────────────────────
echo -e "${YELLOW}[2/4] Installing frontend dependencies...${NC}"
cd frontend
npm install --silent
cd ..

# ── Check MongoDB ─────────────────────────────────────────────
echo -e "${YELLOW}[3/4] Checking MongoDB...${NC}"
if command -v mongod &> /dev/null; then
  echo "  MongoDB found locally."
else
  echo "  ⚠️  MongoDB not found. Make sure it's running."
  echo "  Install: https://www.mongodb.com/docs/manual/installation/"
  echo "  Or use Atlas (free cloud): update MONGO_URI in backend/.env"
fi

# ── Start both servers ────────────────────────────────────────
echo -e "${YELLOW}[4/4] Starting servers...${NC}"
echo ""
echo -e "${GREEN}Backend  → http://localhost:5000${NC}"
echo -e "${GREEN}Frontend → http://localhost:5173${NC}"
echo ""

# Run backend and frontend in parallel
(cd backend && npm run dev) &
(cd frontend && npm run dev) &

wait
