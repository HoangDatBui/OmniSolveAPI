import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const handleAPICall = async (req, res) => {
    try {
        const { input } = req.body;

        // Access your API key as an environment variable (see "Set up your API key" above)
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro' });

        const imageResp = await fetch(input)
            .then((response) => response.arrayBuffer());

        const result = await model.generateContent([
            {
                inlineData: {
                    data: Buffer.from(imageResp).toString("base64"),
                    mimeType: "image/jpeg",
                },
            },
            `
            Return an array of the coordinates to create bounding boxes for every human face in this image 
            in this exact format (no other characters or symbols and the coordinates should be normalized values between 
            0 and 1 representing the relative position in the image, imagine the given image will scale up or down to 500px 
            in width and the height will be auto based on the width, make sure that the percentage is exactly fit the face position): 
            [  
            { "person 1": [top_line, left_line, bottom_line, right_line] }, 
            { "person 2": [top_line, left_line, bottom_line, right_line] }, 
            {...}
            ]
            `]);

        const caption = result.response.text();
        res.json(caption);
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

export const limitationFunction = (req, res, db) => {
    const { id } = req.body;
    db('users')
        .where('id', id)
        .increment('limitation', 1)
        .returning('limitation')
        .then(limitation => {
            res.json(limitation[0])
        })
        .catch(err => res.status(400).json("error while updating the user's limitation"))
}

export default { limitationFunction, handleAPICall };