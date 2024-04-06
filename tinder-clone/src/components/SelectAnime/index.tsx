import { useState } from 'react';

import { setSelectedCharacter } from '../../slices/characterSlice';
import { useDispatch, useSelector } from 'react-redux';
const AnimeList = [
    {
        'anime': 'Naruto',
        'characters': ['Naruto', 'Sasuke', 'Sakura']
    },
    {
        'anime': 'One Piece',
        'characters': ['Luffy', 'Zoro', 'Sakura']
    },
    {
        'anime': 'Pokemon',
        'characters': ['Pikachu', 'Chicken Little']
    },


]

const SelectAnime = () => {
    const [selectedAnime, setSelectedAnime] = useState<string>("");
    
    const dispatch = useDispatch();

    const selectedCharacter = useSelector((state: any) => state.character.selectedCharacter);

    const handleAnimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAnime(e.target.value);
        dispatch(setSelectedCharacter(""));
        
    }

    const handleCharacterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setSelectedCharacter(e.target.value));
    }

    const selectedAnimeCharacters = AnimeList.find((anime) => anime.anime === selectedAnime)?.characters || [];
    return (
        <div className="flex flex-col space-y-2 w-full ">
            <div className="flex flex-col space-y-4 p-4 border-black border-b-2">
                <h1>Select Anime</h1>
                <select className="bg-gray-200 p-4 px-2 rounded-lg" value={selectedAnime} onChange={handleAnimeChange}>
                    <option value="">Select Anime</option>
                    {AnimeList.map((anime) => (
                        <option key={anime.anime} value={anime.anime}>{anime.anime}</option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col space-y-4 p-4">
                <h1>Select Character</h1>
                <select className="bg-gray-200 p-4 px-2 rounded-lg" value={selectedCharacter} onChange={handleCharacterChange}>
                    <option value="">Select Character</option>
                    {selectedAnimeCharacters.map((character) => (
                        <option key={character} value={character}>{character}</option>
                    ))}
                </select>
            </div>

        </div>
    )
}

export default SelectAnime;