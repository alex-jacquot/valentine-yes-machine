# Yes Machine – Valentine’s Game

A tiny Next.js app: a Valentine’s game with an obvious **Yes** button and a more subtle, slightly convoluted **No** path.

## How it works

- **Game screens**: There is a small sequence of game screens (steps). Each has its own title, prompt, and a very visible **YES** button.
- **Hidden-ish No**: Each game screen also has a quieter “no” action (a subtle whispered link). Clicking it will:
  - Move you to the **next game screen**, looping back to the first after the last.
  - Trigger a short text transition above the card to acknowledge the change.
- **Yes wins**: Pressing the **YES** button at any time takes you to a dedicated **winning screen**.
  - From the winning screen you can either:
    - Go **back to the very beginning**, or
    - Sneak **back to the last game screen** you were on when you said yes.

## Getting started

Make sure you have Node.js 18+ installed.

In a regular Command Prompt in this folder:

```cmd
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Customizing the game

- Edit the list of game screens in `app/page.tsx` (`GAME_SCREENS`) to change:
  - Titles
  - Prompts
  - The subtle hint text for the “no” path
- Tweak visuals in `app/globals.css` to adjust colors, glow, layout, etc.

