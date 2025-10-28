# 🚀 Quick Start Guide

Get the Social Interaction Coach running in 5 minutes!

## Step 1: Install Dependencies

```bash
# Backend
cd /workspace/social-coach/backend
npm install

# Frontend
cd /workspace/social-coach/frontend
npm install
```

## Step 2: Start the Backend

```bash
cd /workspace/social-coach/backend
npm run dev
```

✅ Backend should now be running on `http://localhost:3001`

## Step 3: Start the Frontend (New Terminal)

```bash
cd /workspace/social-coach/frontend
npm run dev
```

✅ Frontend should now be running on `http://localhost:3000`

## Step 4: Open in Browser

Navigate to: **http://localhost:3000**

## Step 5: Start Your First Session

1. Click **"Start New Coaching Session"**
2. Choose your event type (e.g., "Job Interview")
3. Complete each step of the coaching process
4. Experience the full 6-step journey!

## 🎯 What You'll Experience

### Step 1: Context Check-In
Tell the coach about your upcoming event - what it is, how you feel, what success looks like.

### Step 2: Emotional Calibration
Use mood sliders to rate your anxiety, excitement, energy, and focus. Share worries and triggers.

### Step 3: Personalized Checklist
Get a customized checklist with preparation items, comfort items, grounding techniques, and event-specific tips.

### Step 4: Practice Scenarios
Practice responding to realistic scenarios. Get constructive feedback on your responses.

### Step 5: Live Support
During the event, get real-time suggestions, sentiment analysis, and grounding exercises if overwhelmed.

### Step 6: Reflection
After the event, reflect on what worked and what was tough. Get personalized feedback and next steps.

## 🆘 Troubleshooting

**Port already in use?**
```bash
# Kill process on port 3001 or 3000
lsof -ti:3001 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

**Database won't initialize?**
```bash
# Remove and let it recreate
rm /workspace/social-coach/backend/database/social-coach.db
```

**Frontend can't reach backend?**
- Make sure backend is running on port 3001
- Check browser console for errors
- Verify proxy settings in `frontend/vite.config.ts`

## 💡 Tips for Testing

- **Try high anxiety scenarios** - See how checklist adapts with grounding techniques
- **Add specific triggers** - Watch how they're addressed in the checklist
- **Practice with different event types** - Each generates unique scenarios
- **Test live support with "overwhelmed"** - You'll get emergency grounding prompts
- **Complete a full reflection** - See the personalized feedback engine

## 📚 Next Steps

- Read the full [README.md](./README.md) for architecture details
- Explore the code in `backend/src/services/` to see the coaching logic
- Customize the UI in `frontend/src/styles/App.css`
- Add new practice scenarios in `backend/src/services/practiceScenarios.ts`

---

**Enjoy coaching! Remember: This is a tool to support you, not judge you. Be kind to yourself. 💜**
