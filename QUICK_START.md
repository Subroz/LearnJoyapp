# LearnJoy v2 - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment Variables

Create a `.env` file in the root directory:
```bash
cp env.example .env
```

Edit `.env` and add your API keys:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
```

**Getting API Keys:**

1. **Gemini AI** (Already provided in env.example):
   - Visit: https://makersuite.google.com/app/apikey
   - Create a new API key
   - Or use the one in env.example: `AIzaSyDOgdT0uN08FgXz5jkWal86d5CTtjvuV9w`

2. **Supabase** (Optional - app works without it):
   - Visit: https://supabase.com
   - Create a new project
   - Get URL and anon key from Settings > API

### Step 3: Start the App
```bash
npm start
```

This will open Expo Dev Tools. Choose your platform:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator  
- Press `w` for Web Browser
- Scan QR code with Expo Go app on your phone

## 📱 Testing the App

### Test Each Module:

1. **Onboarding**:
   - First launch shows welcome flow
   - Select language (Bangla or English)
   - Navigate through 6 slides

2. **Learn Tab** (Home):
   - Tap "Bangla" or "English" alphabet cards
   - Browse letters with swipe gestures
   - Tap letter to see details with pronunciation

3. **Math Tab**:
   - Choose operation (Addition, Subtraction, etc.)
   - Select difficulty level
   - Solve visual math problems
   - Track your score and accuracy

4. **Draw Tab**:
   - Select brush color and size
   - Draw on the canvas
   - Use undo and clear functions
   - Try "Recognize" button (placeholder)

5. **Story Tab**:
   - Select 3-5 words from categories
   - Tap "Generate Story"
   - Read and listen to AI-generated story
   - Save to favorites

6. **Speak Tab**:
   - Choose a category
   - Tap words to hear pronunciation
   - Practice with "Tap to Practice" button

## 🎯 Key Features to Test

✅ **Language Switching**: Toggle between Bangla and English in Learn tab
✅ **Text-to-Speech**: Tap any letter or word to hear pronunciation
✅ **Math Operations**: Try all 4 operations at different difficulty levels
✅ **Drawing**: Test all brush sizes and colors
✅ **Story Generation**: Create multiple stories with different words
✅ **Voice Practice**: Listen to word pronunciations

## 🐛 Troubleshooting

### App won't start?
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start --clear
```

### Text-to-Speech not working?
- Check device volume
- Ensure TTS is enabled in device settings
- Try changing language in Language Settings

### Story generation failing?
- Check Gemini API key in `.env`
- Verify internet connection
- Check API quota (free tier has limits)

### Supabase errors?
- Supabase is optional for basic functionality
- App works with AsyncStorage for local storage
- Add Supabase credentials for cloud sync

## 📂 Project Structure at a Glance

```
LearnJoy v2/
├── app/              # All screens (Expo Router)
├── components/       # Reusable UI components
├── services/         # API integrations
├── utils/            # Helper functions
├── constants/        # Theme, colors, etc.
├── data/             # Static JSON data
└── types/            # TypeScript definitions
```

## 🎨 Customization

### Change Theme Colors:
Edit `constants/theme.ts`:
```typescript
export const theme = {
  colors: {
    primary: '#6B7FD7',  // Change to your color
    // ...
  }
}
```

### Add More Words:
Edit `data/wordBank.json`:
```json
{
  "english": {
    "animals": [
      { "id": "new-1", "word": "tiger", "emoji": "🐯" }
    ]
  }
}
```

### Modify Math Difficulty:
Edit `utils/mathGenerator.ts`:
```typescript
const getNumberRange = (difficulty: Difficulty) => {
  switch (difficulty) {
    case 'easy': return { min: 1, max: 10 };
    // Customize ranges...
  }
}
```

## 📱 Building for Production

### iOS:
```bash
npm run ios
# or
eas build --platform ios
```

### Android:
```bash
npm run android
# or
eas build --platform android
```

### Web:
```bash
npm run web
```

## 🎓 Learning Resources

- **Expo Docs**: https://docs.expo.dev
- **React Native**: https://reactnative.dev
- **Gemini AI**: https://ai.google.dev/tutorials
- **Supabase**: https://supabase.com/docs

## 💡 Tips for Best Experience

1. **Use a real device** for best TTS experience
2. **Test with headphones** for clear audio
3. **Try both languages** to see full features
4. **Generate multiple stories** to test AI variety
5. **Practice drawing** to test canvas performance

## ✅ Verification Checklist

- [ ] App starts without errors
- [ ] Can navigate all tabs
- [ ] Letters play sound when tapped
- [ ] Math problems display correctly
- [ ] Can draw on canvas
- [ ] Stories generate successfully
- [ ] Voice practice words play audio
- [ ] Language switching works

## 🎉 You're Ready!

The app is fully functional and ready to use. Enjoy learning! 🚀

For questions or issues, check:
- `ReadMe.md` for detailed documentation
- `PROJECT_SUMMARY.md` for feature overview
- Expo Dev Tools console for error messages

---

**Happy Learning! 📚✨**

