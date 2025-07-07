import React, { useState, useEffect } from 'react';
import { FiTarget, FiAward, FiRefreshCw, FiHeart, FiX, FiCheck, FiStar } from 'react-icons/fi';

const WellnessGame = ({ isOpen, onClose }) => {
    const [currentGame, setCurrentGame] = useState('breathing');
    const [score, setScore] = useState(0);
    const [breathingCount, setBreathingCount] = useState(0);
    const [isBreathing, setIsBreathing] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [reflectionAnswers, setReflectionAnswers] = useState({
        emotions: '',
        stressSpending: '',
        alternatives: ''
    });
    const [gratitudeItems, setGratitudeItems] = useState(['', '', '']);

    const games = [
        {
            id: 'breathing',
            title: 'Mindful Breathing',
            description: 'Take deep breaths to calm your mind before making a purchase',
            icon: '🫁',
            instructions: 'Click "Start" and breathe in for 4 seconds, hold for 4, exhale for 4'
        },
        {
            id: 'reflection',
            title: 'Purchase Reflection',
            description: 'Reflect on your spending habits and emotional triggers',
            icon: '💭',
            instructions: 'Answer questions about your spending patterns'
        },
        {
            id: 'gratitude',
            title: 'Gratitude Practice',
            description: 'Focus on what you already have instead of what you want to buy',
            icon: '🙏',
            instructions: 'List 3 things you\'re grateful for today'
        }
    ];

    const currentGameData = games.find(game => game.id === currentGame);

    const startBreathingExercise = () => {
        setIsBreathing(true);
        setBreathingCount(0);

        const breathingInterval = setInterval(() => {
            setBreathingCount(prev => {
                if (prev >= 9) {
                    clearInterval(breathingInterval);
                    setIsBreathing(false);
                    setScore(prev => prev + 10);
                    setGameCompleted(true);
                    return 0;
                }
                return prev + 1;
            });
        }, 4000); // 4 seconds per breath cycle
    };

    const resetGame = () => {
        setScore(0);
        setBreathingCount(0);
        setIsBreathing(false);
        setGameCompleted(false);
        setReflectionAnswers({ emotions: '', stressSpending: '', alternatives: '' });
        setGratitudeItems(['', '', '']);
    };

    const nextGame = () => {
        const currentIndex = games.findIndex(game => game.id === currentGame);
        const nextIndex = (currentIndex + 1) % games.length;
        setCurrentGame(games[nextIndex].id);
        setGameCompleted(false);
    };

    const handleReflectionSubmit = () => {
        if (reflectionAnswers.emotions && reflectionAnswers.stressSpending && reflectionAnswers.alternatives) {
            setScore(prev => prev + 15);
            setGameCompleted(true);
        }
    };

    const handleGratitudeSubmit = () => {
        if (gratitudeItems.every(item => item.trim() !== '')) {
            setScore(prev => prev + 20);
            setGameCompleted(true);
        }
    };

    const updateGratitudeItem = (index, value) => {
        const newItems = [...gratitudeItems];
        newItems[index] = value;
        setGratitudeItems(newItems);
    };

    if (!isOpen) return null;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <FiHeart className="mr-3 text-red-500" />
                    Wellness Games
                </h2>
            </div>

            {/* Score Display */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl mb-6 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <FiStar className="mr-2 text-yellow-300" />
                        <span className="font-semibold">Wellness Score</span>
                    </div>
                    <span className="text-2xl font-bold">{score}</span>
                </div>
            </div>

            {/* Game Selection */}
            <div className="flex flex-col gap-6">
                {/* Game Selector */}
                <div className="flex justify-center gap-4 mb-4">
                    {games.map((game, idx) => (
                        <button
                            key={game.title}
                            className={`px-5 py-2 rounded-full font-bold shadow-md transition-all duration-200 text-lg focus:outline-none border-2 ${currentGame === game.id ? 'bg-white text-black border-purple-600' : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`}
                            onClick={() => setCurrentGame(game.id)}
                        >
                            {game.icon} {game.title}
                        </button>
                    ))}
                </div>
                {/* Game Content Card */}
                <div className="bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 min-h-[220px] flex flex-col items-center animate-fadeIn">
                    {currentGame === 'breathing' && (
                        <div className="text-center">
                            {!isBreathing && !gameCompleted && (
                                <button
                                    onClick={startBreathingExercise}
                                    className="bg-white text-black px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 border-2 border-gray-300 w-full"
                                >
                                    <FiTarget className="mr-2 inline" />
                                    Start Breathing Exercise
                                </button>
                            )}

                            {isBreathing && (
                                <div className="space-y-6">
                                    <div className="text-8xl animate-pulse">
                                        {breathingCount % 2 === 0 ? '🫁' : '💨'}
                                    </div>
                                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl">
                                        <p className="text-2xl font-bold mb-2">
                                            {breathingCount % 2 === 0 ? 'Breathe In...' : 'Breathe Out...'}
                                        </p>
                                        <p className="text-lg opacity-90">
                                            Breath {Math.floor(breathingCount / 2) + 1} of 5
                                        </p>
                                    </div>
                                </div>
                            )}

                            {gameCompleted && (
                                <div className="space-y-6">
                                    <div className="text-8xl animate-bounce">🎉</div>
                                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl">
                                        <p className="text-xl font-bold mb-2">
                                            Excellent! Breathing exercise completed.
                                        </p>
                                        <p className="text-lg opacity-90">
                                            You earned 10 wellness points!
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {currentGame === 'reflection' && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-2xl text-white">
                                <h4 className="font-bold text-xl mb-4 flex items-center">
                                    <FiTarget className="mr-2" />
                                    Reflection Questions
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            What emotions do you feel before making a purchase?
                                        </label>
                                        <textarea
                                            value={reflectionAnswers.emotions}
                                            onChange={(e) => setReflectionAnswers(prev => ({ ...prev, emotions: e.target.value }))}
                                            className="w-full p-3 rounded-lg text-gray-800 resize-none"
                                            rows="2"
                                            placeholder="Describe your feelings..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Do you often buy things when stressed or sad?
                                        </label>
                                        <textarea
                                            value={reflectionAnswers.stressSpending}
                                            onChange={(e) => setReflectionAnswers(prev => ({ ...prev, stressSpending: e.target.value }))}
                                            className="w-full p-3 rounded-lg text-gray-800 resize-none"
                                            rows="2"
                                            placeholder="Share your thoughts..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            What alternatives could you try instead of shopping?
                                        </label>
                                        <textarea
                                            value={reflectionAnswers.alternatives}
                                            onChange={(e) => setReflectionAnswers(prev => ({ ...prev, alternatives: e.target.value }))}
                                            className="w-full p-3 rounded-lg text-gray-800 resize-none"
                                            rows="2"
                                            placeholder="List some alternatives..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {!gameCompleted && (
                                <button
                                    onClick={handleReflectionSubmit}
                                    disabled={!reflectionAnswers.emotions || !reflectionAnswers.stressSpending || !reflectionAnswers.alternatives}
                                    className="bg-white text-black px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 border-2 border-gray-300 w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    <FiCheck className="mr-2 inline" />
                                    Complete Reflection
                                </button>
                            )}

                            {gameCompleted && (
                                <div className="text-center space-y-4">
                                    <div className="text-6xl animate-bounce">🌟</div>
                                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl">
                                        <p className="text-xl font-bold mb-2">
                                            Great reflection! You earned 15 points.
                                        </p>
                                        <p className="text-sm opacity-90">
                                            Self-awareness is the first step to mindful spending.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {currentGame === 'gratitude' && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6 rounded-2xl text-white">
                                <h4 className="font-bold text-xl mb-4 flex items-center">
                                    <FiHeart className="mr-2" />
                                    Gratitude Practice
                                </h4>
                                <p className="text-sm mb-4 opacity-90">
                                    Take a moment to appreciate what you already have:
                                </p>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((num) => (
                                        <div key={num} className="flex items-center">
                                            <span className="text-2xl mr-3">✨</span>
                                            <input
                                                type="text"
                                                value={gratitudeItems[num - 1]}
                                                onChange={(e) => updateGratitudeItem(num - 1, e.target.value)}
                                                placeholder={`I'm grateful for...`}
                                                className="flex-1 p-3 rounded-lg text-gray-800 font-medium"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {!gameCompleted && (
                                <button
                                    onClick={handleGratitudeSubmit}
                                    disabled={gratitudeItems.some(item => item.trim() === '')}
                                    className="bg-white text-black px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 border-2 border-gray-300 w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    <FiCheck className="mr-2 inline" />
                                    Complete Gratitude
                                </button>
                            )}

                            {gameCompleted && (
                                <div className="text-center space-y-4">
                                    <div className="text-6xl animate-bounce">🙏</div>
                                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl">
                                        <p className="text-xl font-bold mb-2">
                                            Beautiful gratitude practice! You earned 20 points.
                                        </p>
                                        <p className="text-sm opacity-90">
                                            Focusing on gratitude helps reduce impulse buying.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Game Actions */}
            {gameCompleted && (
                <div className="flex gap-3 mt-8">
                    <button
                        onClick={nextGame}
                        className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 border-2 border-gray-300 flex-1"
                    >
                        <FiRefreshCw className="mr-2" />
                        Next Game
                    </button>
                    <button
                        onClick={resetGame}
                        className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 border-2 border-gray-300 flex-1"
                    >
                        <FiAward className="mr-2" />
                        Reset Score
                    </button>
                </div>
            )}

            {/* Wellness Tip */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                <p className="text-sm text-blue-800 font-medium">
                    💡 <strong>Tip:</strong> Practice these exercises regularly to build healthier spending habits and reduce emotional purchases.
                </p>
            </div>
        </div>
    );
};

export default WellnessGame; 