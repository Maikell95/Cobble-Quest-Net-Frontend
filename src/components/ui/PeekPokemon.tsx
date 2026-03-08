import { useState, type ReactNode } from 'react';

const B = import.meta.env.BASE_URL;
const POKEMON_SPRITES = [
  `${B}images/pokemon/pikachu.png`,
  `${B}images/pokemon/bulbasaur.png`,
  `${B}images/pokemon/squirtle.png`,
  `${B}images/pokemon/gengar.png`,
  `${B}images/pokemon/dragonite.png`,
  `${B}images/pokemon/dartrix.png`,
  `${B}images/pokemon/goomy.png`,
  `${B}images/pokemon/arbok.png`,
];

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface PeekPokemonProps {
  children: ReactNode;
  corner?: Corner;
  size?: number;
  className?: string;
  randomize?: boolean;
  pokemonIndex?: number;
  sprite?: string;
}

export default function PeekPokemon({
  children,
  corner = 'top-right',
  size = 38,
  className = '',
  randomize = true,
  pokemonIndex,
  sprite: fixedSprite,
}: PeekPokemonProps) {
  const [sprite, setSprite] = useState(() => {
    if (fixedSprite) return fixedSprite;
    if (pokemonIndex !== undefined) return POKEMON_SPRITES[pokemonIndex % POKEMON_SPRITES.length];
    return POKEMON_SPRITES[Math.floor(Math.random() * POKEMON_SPRITES.length)];
  });

  const handleMouseEnter = () => {
    if (fixedSprite) return;
    if (randomize) {
      setSprite(POKEMON_SPRITES[Math.floor(Math.random() * POKEMON_SPRITES.length)]);
    }
  };

  return (
    <span className={`group relative inline-flex ${className}`} onMouseEnter={handleMouseEnter}>
      {children}
      <img
        src={sprite}
        alt=""
        className={`peek-pokemon peek-${corner}`}
        style={{ width: size, height: size }}
        draggable={false}
      />
    </span>
  );
}
