import { useState } from "react";
// redux
import { useSelector } from 'react-redux';

import SelectAnime from "../../components/SelectAnime";
import UploadModel from "../../components/UploadModel";
const Upload = () => {

    const selectedCharacter = useSelector((state: any) => state.character.selectedCharacter);

    const submitModel = async () => {
        console.log('selectedCharacter', selectedCharacter);
    }
    return (
        <div className="flex flex-col space-y-2 w-full h-screen">
            <div className="grid grid-cols-1  md:grid-cols-2 w-full">
                <div className="flex h-[260px] bg-gray-100 shadow-xl rounded-lg md:ml-4 md:mt-6">
                    <SelectAnime />
                </div>
                <div className="flex items-center justify-center h-[260px] p-[60px] bg-gray-100 shadow-xl rounded-lg md:ml-4 md:mt-6">
                    <UploadModel />
                </div>
            </div>
            <div className="flex justify-center items-center">
                <button className="mt-10 rounded-md p-2 bg-red-500 text-white" onClick={submitModel}>Submit Model</button>
            </div>
        </div>
    )
}

export default Upload;