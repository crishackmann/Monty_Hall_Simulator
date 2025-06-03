
import React, { useState, useEffect, useCallback } from 'react';
import { GamePhase, DoorState, GameStats } from './types';
import { NUMBER_OF_DOORS } from './constants';
import Door from './components/Door';
import StatsDisplay from './components/StatsDisplay';

const App: React.FC = () => {
  const [doors, setDoors] = useState<DoorState[]>([]);
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.AWAITING_INITIAL_PICK);
  const [playerInitialPick, setPlayerInitialPick] = useState<number | null>(null);
  const [montyOpenedDoorIdx, setMontyOpenedDoorIdx] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const [stats, setStats] = useState<GameStats>({
    stayWins: 0,
    stayGames: 0,
    switchWins: 0,
    switchGames: 0,
  });
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const initializeGame = useCallback(() => {
    const carLocation = Math.floor(Math.random() * NUMBER_OF_DOORS);
    const newDoors: DoorState[] = Array.from({ length: NUMBER_OF_DOORS }, (_, i) => ({
      id: i,
      hasCar: i === carLocation,
      isPlayerSelected: false,
      isMontyOpened: false,
    }));
    setDoors(newDoors);
    setGamePhase(GamePhase.AWAITING_INITIAL_PICK);
    setPlayerInitialPick(null);
    setMontyOpenedDoorIdx(null);
    setMessage('Welcome to the Monty Hall Problem! Click a door to make your initial pick, or run simulations.');
  }, []);

  useEffect(() => {
    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleDoorClick = (doorId: number): void => {
    if (gamePhase !== GamePhase.AWAITING_INITIAL_PICK || isSimulating) return;

    setPlayerInitialPick(doorId);
    setDoors(prevDoors => prevDoors.map(d => d.id === doorId ? { ...d, isPlayerSelected: true } : d));
    setGamePhase(GamePhase.MONTY_REVEALING);
    setMessage(`You picked Door ${doorId + 1}. Monty is thinking...`);

    // Monty's turn (simulated delay for effect)
    setTimeout(() => {
      openMontyDoor(doorId);
    }, 1000);
  };

  const openMontyDoor = (initialPlayerPickId: number): void => {
    let doorToOpenByMonty: number;
    const potentialMontyPicks = doors
      .map((door, index) => index)
      .filter(index => index !== initialPlayerPickId && !doors[index].hasCar);

    if (potentialMontyPicks.length > 0) {
      doorToOpenByMonty = potentialMontyPicks[Math.floor(Math.random() * potentialMontyPicks.length)];
    } else {
      // This case happens if player initially picked the car. Monty can open any other door (all goats).
      const otherDoors = doors
        .map((door, index) => index)
        .filter(index => index !== initialPlayerPickId);
      doorToOpenByMonty = otherDoors[Math.floor(Math.random() * otherDoors.length)];
    }
    
    setMontyOpenedDoorIdx(doorToOpenByMonty);
    setDoors(prevDoors => prevDoors.map(d => d.id === doorToOpenByMonty ? { ...d, isMontyOpened: true } : d));
    setGamePhase(GamePhase.AWAITING_FINAL_DECISION);
    const remainingDoor = doors.find(d => d.id !== initialPlayerPickId && d.id !== doorToOpenByMonty);
    setMessage(`Monty opened Door ${doorToOpenByMonty + 1} (it has a goat!). Do you want to stay with Door ${initialPlayerPickId + 1} or switch to Door ${remainingDoor!.id + 1}?`);
  };

  const handleStay = (): void => {
    if (gamePhase !== GamePhase.AWAITING_FINAL_DECISION || playerInitialPick === null || isSimulating) return;
    resolveGame(playerInitialPick, false);
  };

  const handleSwitch = (): void => {
    if (gamePhase !== GamePhase.AWAITING_FINAL_DECISION || playerInitialPick === null || montyOpenedDoorIdx === null || isSimulating) return;
    
    const switchedDoor = doors.find(d => d.id !== playerInitialPick && d.id !== montyOpenedDoorIdx);
    if (switchedDoor) {
      setDoors(prevDoors => prevDoors.map(d => {
        if (d.id === playerInitialPick) return { ...d, isPlayerSelected: false };
        if (d.id === switchedDoor.id) return { ...d, isPlayerSelected: true };
        return d;
      }));
      resolveGame(switchedDoor.id, true);
    }
  };
  
  const resolveGame = (finalPickId: number, didSwitch: boolean): void => {
    const carDoor = doors.find(d => d.hasCar);
    const playerWon = doors[finalPickId].hasCar;

    setGamePhase(GamePhase.SHOWING_RESULT);
     if (!didSwitch) {
        setDoors(prevDoors => prevDoors.map(d => d.id === finalPickId ? { ...d, isPlayerSelected: true } : {...d, isPlayerSelected: false} ));
    } else {
         // Ensure only the switched door is marked as selected
        setDoors(prevDoors => prevDoors.map(d => d.id === finalPickId ? { ...d, isPlayerSelected: true } : {...d, isPlayerSelected: false, isMontyOpened: d.isMontyOpened} ));
    }


    let resultMessage = `You ${didSwitch ? 'switched to' : 'stayed with'} Door ${finalPickId + 1}. `;
    resultMessage += playerWon ? 'And you WON the car! 🎉' : 'And you lost. 🐐';
    resultMessage += ` The car was behind Door ${carDoor!.id + 1}.`;
    setMessage(resultMessage);

    setStats(prevStats => {
      if (didSwitch) {
        return {
          ...prevStats,
          switchGames: prevStats.switchGames + 1,
          switchWins: prevStats.switchWins + (playerWon ? 1 : 0),
        };
      } else {
        return {
          ...prevStats,
          stayGames: prevStats.stayGames + 1,
          stayWins: prevStats.stayWins + (playerWon ? 1 : 0),
        };
      }
    });
  };

  const runBulkSimulations = (numSimulations: number): void => {
    if (isSimulating) return;
    setIsSimulating(true);
    setMessage(`Simulating ${numSimulations} games... This might take a moment.`);

    // Use setTimeout to allow UI to update with "Simulating..." message
    // and to prevent blocking the main thread for too long directly.
    setTimeout(() => {
      let simStayWins = 0;
      let simStayGames = 0;
      let simSwitchWins = 0;
      let simSwitchGames = 0;

      for (let i = 0; i < numSimulations; i++) {
        // 1. Setup game: Place car
        const carLocationSim = Math.floor(Math.random() * NUMBER_OF_DOORS);
        
        // 2. Player's initial pick (random)
        const playerInitialPickSim = Math.floor(Math.random() * NUMBER_OF_DOORS);

        // 3. Monty opens a door
        let montyOpenedDoorSim: number;
        const potentialMontyPicksSim = [];
        for (let j = 0; j < NUMBER_OF_DOORS; j++) {
          if (j !== playerInitialPickSim && j !== carLocationSim) {
            potentialMontyPicksSim.push(j);
          }
        }

        if (potentialMontyPicksSim.length > 0) {
          montyOpenedDoorSim = potentialMontyPicksSim[Math.floor(Math.random() * potentialMontyPicksSim.length)];
        } else {
          // Player initially picked the car. Monty picks one of the other (goat) doors.
          const otherDoorsSim = [];
          for (let j = 0; j < NUMBER_OF_DOORS; j++) {
            if (j !== playerInitialPickSim) {
              otherDoorsSim.push(j);
            }
          }
          montyOpenedDoorSim = otherDoorsSim[Math.floor(Math.random() * otherDoorsSim.length)];
        }

        // 4. Simulate "Stay" strategy
        simStayGames++;
        if (playerInitialPickSim === carLocationSim) {
          simStayWins++;
        }

        // 5. Simulate "Switch" strategy
        simSwitchGames++;
        let switchedPickSim = -1;
        for (let j = 0; j < NUMBER_OF_DOORS; j++) {
          if (j !== playerInitialPickSim && j !== montyOpenedDoorSim) {
            switchedPickSim = j;
            break;
          }
        }
        if (switchedPickSim === carLocationSim) {
          simSwitchWins++;
        }
      }

      setStats(prevStats => ({
        stayWins: prevStats.stayWins + simStayWins,
        stayGames: prevStats.stayGames + simStayGames,
        switchWins: prevStats.switchWins + simSwitchWins,
        switchGames: prevStats.switchGames + simSwitchGames,
      }));

      setIsSimulating(false);
      // initializeGame will set its own message.
      initializeGame(); 
      // We can set a specific message after initializeGame if needed
      setMessage(`Finished ${numSimulations} simulations. Stats updated. Ready for a new game!`);

    }, 50); // Small delay for UI update & to unblock thread
  };


  const canPerformActions = !isSimulating && gamePhase !== GamePhase.MONTY_REVEALING;
  const canMakeDecision = canPerformActions && gamePhase === GamePhase.AWAITING_FINAL_DECISION;
  const canStartOrSimulate = canPerformActions && (gamePhase === GamePhase.AWAITING_INITIAL_PICK || gamePhase === GamePhase.SHOWING_RESULT);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-slate-800 text-gray-100">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Monty Hall Simulator
        </h1>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center">
        <div className="mb-6 p-4 bg-slate-700 rounded-lg shadow-md min-h-[60px] flex items-center justify-center text-center w-full max-w-2xl">
          <p className="text-sm sm:text-base text-yellow-300">{message}</p>
        </div>

        <div className="flex flex-wrap justify-center mb-8 gap-2 sm:gap-4">
          {doors.map(door => (
            <Door key={door.id} door={door} gamePhase={gamePhase} onClick={handleDoorClick} />
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
            {gamePhase === GamePhase.AWAITING_FINAL_DECISION && (
              <>
                <button
                  onClick={handleStay}
                  disabled={!canMakeDecision}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Stay with Door {playerInitialPick !== null ? playerInitialPick + 1 : ''}
                </button>
                <button
                  onClick={handleSwitch}
                  disabled={!canMakeDecision}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Switch Door
                </button>
              </>
            )}

            {(gamePhase === GamePhase.SHOWING_RESULT || gamePhase === GamePhase.AWAITING_INITIAL_PICK) && (
                 <button
                    onClick={initializeGame}
                    disabled={!canStartOrSimulate || gamePhase === GamePhase.AWAITING_INITIAL_PICK && playerInitialPick !== null /* Mid-initial pick step */}
                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {gamePhase === GamePhase.AWAITING_INITIAL_PICK && playerInitialPick === null ? 'Start New Game' : 'Play Again?'}
                </button>
            )}
             {/* Simulate Button - always potentially visible but enabled based on state */}
             {(gamePhase === GamePhase.SHOWING_RESULT || gamePhase === GamePhase.AWAITING_INITIAL_PICK) && (
                <button
                    onClick={() => runBulkSimulations(1000)}
                    disabled={!canStartOrSimulate || isSimulating}
                    className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSimulating ? 'Simulating...' : 'Simulate 1000 Games'}
                </button>
             )}
        </div>
        
        <StatsDisplay stats={stats} />
      </main>
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>The Monty Hall problem is a brain teaser, in the form of a probability puzzle.</p>
        <p>Try playing multiple rounds or use the simulation to see the statistical advantage of switching doors!</p>
      </footer>
    </div>
  );
};

export default App;
