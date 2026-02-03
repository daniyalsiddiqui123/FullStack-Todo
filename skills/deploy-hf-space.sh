#!/bin/bash
# Skill: Deploy to Hugging Face Space
# Description: Prepare and deploy MCP server to Hugging Face Spaces

echo "🚀 Preparing Hugging Face Space deployment..."

# Check required files
REQUIRED_FILES=(
    "Dockerfile"
    "server.ts"
    "package.json"
    "package-lock.json"
    "requirements.txt"
    "README.md"
    "tsconfig.json"
)

missing_files=()
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    echo "❌ Missing required files:"
    printf '%s\n' "${missing_files[@]}"
    exit 1
fi

echo "✅ All required files present"

# Check Dockerfile for port 7860
if grep -q "7860" Dockerfile; then
    echo "✅ Dockerfile configured for port 7860"
else
    echo "⚠️ Dockerfile may not be configured for port 7860"
    echo "Make sure your Dockerfile exposes and uses port 7860"
fi

# Show deployment instructions
echo ""
echo "📋 Deployment Steps:"
echo "1. Go to https://huggingface.co/spaces"
echo "2. Create a new Space"
echo "3. Choose 'Docker' as the SDK"
echo "4. Set hardware as needed (CPU is sufficient for this app)"
echo "5. Link your repository or upload files directly"
echo "6. Add environment variables in Space settings:"
echo "   - OPENROUTER_API_KEY (optional)"
echo "   - OPENAI_API_KEY (optional)"
echo "   - DATABASE_URL"
echo ""
echo "Your MCP server will be available at:"
echo "https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space"
echo ""

echo "✅ Hugging Face Space preparation complete!"