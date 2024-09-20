# Building a RAG System with Vector DB and LLM

In this tutorial we will build a Retrieval-Augmented Generation (RAG) system using a vector database and a Large Language Model (LLM). The system will chunk text documents, create embeddings, stores them in a vector database, and uses them to enhance LLM responses.

<img src="llm-rag-flow.png"  width="800">

## Prerequisites
* Have Docker installed
* Cloned this repository to your local machine https://github.com/dlops-io/llm-rag

## Run LLM RAG Container
- Make sure you are inside the `llm-rag` folder and open a terminal at this location
- Run `sh docker-shell.sh`

## Chunk Documents
Run the cli.py script with the --chunk flag to split your input texts into smaller chunks:

Perform Character splitting:
`python script.py --chunk --chunk_type char-split`

This will:
* Read each text file in the input-datasets/books directory
* Split the text into chunks using character-based splitting
* Save the chunks as JSONL files in the outputs directory

Perform Recursive Character splitting:
`python script.py --chunk --chunk_type recursive-split`

This will:
* Read each text file in the input-datasets/books directory
* Split the text into chunks using recursive splitting
* Save the chunks as JSONL files in the outputs directory

## Generate Embeddings

## Load Embeddings into Vector Database

## Query the Vector Database

## Chat with the LLM
