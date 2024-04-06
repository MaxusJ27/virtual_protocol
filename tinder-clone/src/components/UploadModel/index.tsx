import { useState} from "react";

const UploadModel = () => {
    const [file, setFile] = useState<File | null>();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setFile(file);
    }

    return (
        <input type="file" onChange={handleFileChange} />
    )
}

export default UploadModel;