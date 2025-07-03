const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { OpenAI } = require('openai');
require('dotenv').config();
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

/**
 * Reads a PDF file from the 'files' directory and converts it to text.
 * @param {string} filename - Name of the PDF file (e.g., 'DS2401.pdf')
 * @returns {Promise<string>} - The extracted text from the PDF file.
 */
async function readPDF(filename) {
    const filePath = path.join(__dirname, 'files', filename);
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
}

// LLM extraction function
async function extractComponentInfo(text) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `Extract the following information from the given electronic component specification text:\n\n- Component name\n- Short description (max 256 characters)\n- Socket type (comma separated if several)\n\nReturn the result as a JSON object with keys: component_name, short_description, socket_type.\n\nText:\n"""\n${text}\n"""`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4.1-mini', 
        messages: [
            { role: 'system', content: 'You are an expert in extracting structured information from electronic component datasheets.' },
            { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 400
    });
    let result = response.choices[0].message.content;
    try {
        // Try to parse as JSON
        result = JSON.parse(result);
    } catch {
        // If not valid JSON, print as is
    }
    return result;
}

// Process all PDF files in a folder and write extracted info to output.csv
async function processFolder(folderName) {
    const folderPath = path.join(__dirname, folderName);
    const files = fs.readdirSync(folderPath).filter(f => f.toLowerCase().endsWith('.pdf'));
    const results = [];
    for (const file of files) {
        try {
            console.log(`Processing: ${file}`);
            const text = await readPDF(file);
            const info = await extractComponentInfo(text);
            results.push({
                file_name: file,
                component_name: info.component_name || '',
                short_description: info.short_description || '',
                socket_type: info.socket_type || ''
            });
        } catch (err) {
            console.error(`Error processing ${file}:`, err);
        }
    }
    const csvWriter = createCsvWriter({
        path: path.join(__dirname, 'output.csv'),
        header: [
            {id: 'file_name', title: 'File Name'},
            {id: 'component_name', title: 'Component Name'},
            {id: 'short_description', title: 'Short Description'},
            {id: 'socket_type', title: 'Socket Type'}
        ]
    });
    await csvWriter.writeRecords(results);
    console.log('Extraction complete. Results saved to output.csv');
}

// Call processFolder to process all files in 'files' folder
processFolder('files');
