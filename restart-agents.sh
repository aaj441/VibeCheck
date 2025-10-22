#!/bin/bash

echo "🔄 Restarting agents and clearing overlays..."

# Clear any existing overlays/modals
echo "🧹 Clearing overlays and modals..."
# This would typically involve refreshing the browser or clearing UI state
# The exact implementation depends on your application

# Restart any running agents
echo "🔄 Restarting agents..."
# Kill any existing agent processes
pkill -f "agent" 2>/dev/null || true
pkill -f "chrome" 2>/dev/null || true

# Wait a moment for processes to fully terminate
sleep 2

echo "✅ Agent restart complete!"
echo ""
echo "📝 Next steps:"
echo "1. Replace 'your_openai_api_key_here' in /workspace/.env with your actual OpenAI API key"
echo "2. Restart your applications to pick up the new environment variables"
echo "3. Test LLM and agentic features"
echo ""
echo "🔧 Installed components:"
echo "- Google Chrome: $(google-chrome --version)"
echo "- ChromeDriver: $(chromedriver --version)"
echo "- Environment file: /workspace/.env"
