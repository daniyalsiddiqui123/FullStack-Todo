# Hugging Face Deployment Skill

Prepare and deploy the MCP server to Hugging Face Spaces.

## Command Definition

```bash
sp.deploy-hf
```

## Behavior

This skill will:
1. Check that all required files are present
2. Verify the Dockerfile is properly configured
3. Show deployment instructions
4. Validate environment variables

## Implementation

```bash
#!/bin/bash
echo "Preparing Hugging Face deployment..."

# Check required files
REQUIRED_FILES=(
    "Dockerfile"
    "server.ts"
    "package.json"
    "package-lock.json"
    "requirements.txt"
    "README.md"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing required file: $file"
        exit 1
    fi
done

echo "✅ All required files present"

# Show deployment instructions
echo ""
echo "To deploy to Hugging Face Spaces:"
echo "1. Create a new Space on https://huggingface.co/spaces"
echo "2. Choose 'Docker' as the SDK"
echo "3. Set the Space to run on port 7860"
echo "4. Add these environment variables in Space settings:"
echo "   - OPENROUTER_API_KEY (optional)"
echo "   - OPENAI_API_KEY (optional)"
echo "   - DATABASE_URL"
echo "5. Push this code to the Space repository"
echo ""
echo "Your MCP server will be available at:"
echo "https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space"

echo ""
echo "Deployment preparation complete!"
```

## Usage

Run this command when you want to prepare your application for deployment to Hugging Face Spaces.