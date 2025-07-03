# Demo for DPF processing



billing page: https://platform.openai.com/settings/organization/billing/overview
api keys: https://platform.openai.com/settings/profile?tab=api-keys

pricing:
https://openai.com/api/pricing/

prompt for extraction:

I want to organise my documentation for my electronic components. Here is a pdf file  please extract information about component and format it as json output. I am interested in following information name, type of component, socket type (comma separated if several). Here is example of output {"name": "", "componentType": "", "socketType": ""}


generation prompts:

I have a folder with PDF files with electronic components specifications. The folder has name "files". I want to create a javascript program to read one pdf file e.g. DS2401.pdf, convert it to text using npm package pdf-parse. Please implement the code in a function with name readPDF and then call this function. Please implement this in file index.js.

I want to process the text returned by readPDF function with LLM model gpt-4.1-mini using OpenAI API. I want to extract following information: component name, short description (not more than 256 characters), socket type (comma separated if several). The Open AI key is located in .env file. The result should be shown to the console log.

Let's process all files in the "files" folder. Create a new function called "processFolder" which reads each file in the given folder. Inside the loop read each file using function readPDF, process each file using function extractComponentInfo and store extracted information into csv files output.csv. Call the function "processFolder" with argument "files" to process each files in "files" folder. To write csv file use npm module "csv-writer".

