# RetroChess

A visually stunning, fully functional chess game with a retro 90s CRT and neon aesthetic.

[cloudflarebutton]

RetroChess is a visually striking, fully functional chess game designed with a nostalgic, early-internet aesthetic. The application provides a classic two-player (hot-seat) chess experience on a single screen. The core of the project is its unique 'Retro' artistic style, featuring a dark, CRT-monitor-like background, glowing neon pieces and highlights, pixelated typography, and subtle glitch effects. All standard chess rules are implemented, including piece movements, castling, en passant, pawn promotion, check, checkmate, and stalemate detection. The user interface is designed to be intuitive, with clear visual feedback for selected pieces, valid moves, captures, and game state changes, ensuring a delightful and engaging user experience.

## Key Features

-   **Complete Chess Logic**: Full implementation of all standard chess rules, including special moves like castling, en passant, and pawn promotion.
-   **Game State Detection**: Accurate detection of check, checkmate, and stalemate conditions.
-   **Retro Aesthetic**: A unique visual style inspired by 90s CRT monitors, featuring neon glows, pixelated fonts, and glitch effects.
-   **Interactive UI**: Smooth animations, pulsing highlights for selected pieces, and clear visual cues for valid moves.
-   **Captured Pieces Display**: Side panels clearly display all pieces captured by each player.
-   **Responsive Design**: A flawless and intuitive experience across desktops, tablets, and mobile devices.
-   **Hot-Seat Multiplayer**: Play with a friend on the same device.

## Technology Stack

-   **Framework**: React (with Vite)
-   **Styling**: Tailwind CSS
-   **State Management**: Zustand
-   **Animation**: Framer Motion
-   **Icons**: Lucide React
-   **Deployment**: Cloudflare Workers

## Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

You need to have [Bun](https://bun.sh/) installed on your machine.

### Installation

1.  Clone the repository to your local machine:
    ```sh
    git clone https://github.com/your-username/retro_chess.git
    ```
2.  Navigate into the project directory:
    ```sh
    cd retro_chess
    ```
3.  Install the dependencies using Bun:
    ```sh
    bun install
    ```

### Running Locally

To start the development server, run the following command:

```sh
bun run dev
```

The application will be available at `http://localhost:3000` (or the next available port).

## Development

The project is structured to separate concerns, making it easier to maintain and extend.

-   `src/pages/HomePage.tsx`: The main component that assembles the game UI.
-   `src/stores/useGameStore.ts`: The central Zustand store that manages all game state.
-   `src/lib/chess-logic.ts`: Contains all the pure functions for chess rules, move validation, and game status detection.
-   `src/components/ChessComponents.tsx`: Houses the reusable React components for the board, squares, and pieces.
-   `tailwind.config.js`: Extended to include the custom retro color palette and animations.
-   `src/index.css`: Contains global styles and custom CSS classes for the retro theme.

## Deployment

This project is configured for easy deployment to Cloudflare Pages.

1.  **Login to Cloudflare**: If you haven't already, authenticate Wrangler with your Cloudflare account:
    ```sh
    bunx wrangler login
    ```
2.  **Deploy**: Run the deployment script. This will build the application and deploy it using Wrangler.
    ```sh
    bun run deploy
    ```

Alternatively, you can deploy directly from your GitHub repository using the button below.

[cloudflarebutton]