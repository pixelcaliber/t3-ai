'use client'

import { Brain, RefreshCw, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import React, { useEffect, useState } from 'react';

import { Button } from '@/app/components/ui/button';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(" "));
  const [message, setMessage] = useState("");
  const [scoreboard, setScoreboard] = useState({ human: 0, ai: 0, draw: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    fetchGameState();
  }, []);

  const fetchGameState = async () => {
    try {
      const response = await fetch(`${API_URL}/game`);
      const data = await response.json();
      setBoard(data.board);
      setMessage(data.result ? data.result.toUpperCase() : "");
      setScoreboard(data.scoreboard);
    } catch (error) {
      setMessage("Error connecting to server");
    }
  };

  interface GameState {
    board: string[];
    result?: string;
    scoreboard: Scoreboard;
  }

  interface Scoreboard {
    human: number;
    ai: number;
    draw: number;
  }

  interface MoveResponse {
    board: string[];
    message: string;
    scoreboard?: Scoreboard;
  }

  const makeMove = async (index: number): Promise<void> => {
    if (board[index] !== " " || isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ move: index })
      });
      
      const data: MoveResponse = await response.json();
      setBoard(data.board);
      setMessage(data.message);
      if (data.scoreboard) setScoreboard(data.scoreboard);
      if (data.message.includes("wins") || data.message.includes("draw")) {
        setIsGameOver(true);
      }
    } catch (error) {
      setMessage("Error making move");
    }
    setIsLoading(false);
  };

  const resetGame = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/reset`);
      const data = await response.json();
      setBoard(data.board);
      setMessage(data.message);
      setIsGameOver(false);
    } catch (error) {
      setMessage("Error resetting game");
    }
    setIsLoading(false);
  };

  const getCellColor = (value: string): string => {
    switch (value) {
      case 'X': return 'bg-blue-500 text-white';
      case 'O': return 'bg-red-500 text-white';
      default: return 'bg-gray-100 hover:bg-gray-200';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <Brain className="w-6 h-6" />
          Tic Tac Toe vs AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {board.map((cell, index) => (
            <Button
              key={index}
              onClick={() => makeMove(index)}
              disabled={cell !== " " || isLoading}
              className={`h-24 text-4xl font-bold ${getCellColor(cell)}`}
            >
              {cell}
            </Button>
          ))}
        </div>

        <div className="text-center mb-4">
          <p className="text-lg font-medium">{message}</p>
        </div>

        <Button 
          onClick={resetGame} 
          disabled={isLoading}
          className="w-full mb-4 bg-purple-500 hover:bg-purple-600"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset Game
        </Button>

        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <Trophy className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <p className="font-medium">Human</p>
                <p className="text-2xl font-bold text-blue-500">{scoreboard.human}</p>
              </div>
              <div>
                <Trophy className="w-6 h-6 mx-auto mb-2 text-red-500" />
                <p className="font-medium">AI</p>
                <p className="text-2xl font-bold text-red-500">{scoreboard.ai}</p>
              </div>
              <div>
                <Trophy className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                <p className="font-medium">Draws</p>
                <p className="text-2xl font-bold text-gray-500">{scoreboard.draw}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default TicTacToe;