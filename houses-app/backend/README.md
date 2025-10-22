# Houses App Backend Setup

## Environment Configuration

1. Copy the `.env` file and add your OpenAI API key:
   ```bash
   # Edit .env file and replace 'your-openai-api-key-here' with your actual API key
   # You can get an API key from https://platform.openai.com/api-keys
   ```

2. The `.env` file should contain:
   ```
   OPENAI_API_KEY=your-actual-openai-api-key
   NODE_ENV=development
   PORT=3000
   ```

## Browser Automation

Google Chrome has been installed for browser automation capabilities. You can verify the installation with:

```bash
google-chrome --version
```

Current installed version: Google Chrome 141.0.7390.122

## Security Notes

- The `.env` file is included in `.gitignore` to prevent accidentally committing sensitive API keys
- Never commit your API keys to version control
- Keep your API keys secure and rotate them regularly

## Next Steps

After updating your OpenAI API key in the `.env` file, restart any agents or background processes to ensure they pick up the new configuration.