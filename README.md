# Building a RAG System with Vector DB and LLM

In this tutorial we will build a Retrieval-Augmented Generation (RAG) system using a vector database and a Large Language Model (LLM). The system will chunk text documents, create embeddings, stores them in a vector database, and uses them to enhance LLM responses.

**Step 1:**
<img src="images/llm-rag-flow-1.png"  width="800">
**Step 2:**
<img src="images/llm-rag-flow-2.png"  width="800">


## Prerequisites
* Have Docker installed
* Cloned this repository to your local machine https://github.com/dlops-io/llm-rag

## Run LLM RAG Container
- Make sure you are inside the `llm-rag` folder and open a terminal at this location
- Run `sh docker-shell.sh`

## Chunk Documents
Run the cli.py script with the --chunk flag to split your input texts into smaller chunks. To understand more about chunking check out this [visualization](https://ac215-llm-rag.dlops.io/chunkviz)

**Perform Character splitting:**

`python cli.py --chunk --chunk_type char-split`

**Perform Recursive Character splitting:**

`python cli.py --chunk --chunk_type recursive-split`

This will:
* Read each text file in the input-datasets/books directory
* Split the text into chunks using the specified method (character-based or recursive)
* Save the chunks as JSONL files in the outputs directory

## Generate Embeddings
Generate embeddings for the text chunks:

`python cli.py --embed --chunk_type char-split`

`python cli.py --embed --chunk_type recursive-split`

This will:
* Reads the chunk files created in the previous section
* Uses Vertex AI's text embedding model to generate embeddings for each chunk
* Saves the chunks with their embeddings as new JSONL files
* We use Vertex AI `text-embedding-004` model to generate the embeddings

## Load Embeddings into Vector Database
Load the generated embeddings into ChromaDB:

`python cli.py --load --chunk_type char-split`

`python cli.py --load --chunk_type recursive-split`

This will:
* Connects to your ChromaDB instance
* Creates a new collection (or clears an existing one)
* Loads the embeddings and associated metadata into the collection

To view the contents of your Vector Database you can use this [Chroma UI Tool](https://ac215-llm-rag.dlops.io/chromaui)

## Query the Vector Database
Test querying the vector database:

`python cli.py --query --chunk_type char-split`

`python cli.py --query --chunk_type recursive-split`

This will:
* Generate an embedding for a sample query
* Perform similarity searches in the vector database
* Apply various types of filters on the queries

## Chat with LLM
Chat with the LLM using the RAG system:


`python cli.py --chat --chunk_type char-split`

`python cli.py --chat --chunk_type recursive-split`

This will:
* Takes a sample query
* Retrieves relevant context from the vector database
* Sends the query and context to the LLM
* Displays the LLM's response

To test out chat with LLM using RAG, you can use this [Chat Tool](https://ac215-llm-rag.dlops.io/chat)