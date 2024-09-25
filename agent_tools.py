import json
import vertexai
from vertexai.generative_models import FunctionDeclaration, Tool, Part

# Specify a function declaration and parameters for an API request
get_book_chunks_by_author_func = FunctionDeclaration(
    name="get_book_chunks_by_author",
    description="Get the book chunks filtered by author name",
    # Function parameters are specified in OpenAPI JSON schema format
    parameters={
        "type": "object",
        "properties": {
            "author": {"type": "string", "description": "The author name","enum":["C. F. Langworthy and Caroline Louisa Hunt", "Milk Industry Foundation", "J. Twamley", "George E. Newell", "Pavlos Protopapas"]},
            "search_filter": {"type": "string", "description": "The search text to filter the book chunks by. The search term is compared against chunks base on cosine simialrity"},
        },
        "required": ["author","search_filter"],
    },
)
def get_book_chunks_by_author(author, search_filter, collection, embed_func):

    query_embedding = embed_func(search_filter)

    # Query based on embedding value 
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=10,
        where={"author":author}
    )
    return "\n".join(results["documents"][0])


get_book_chunks_by_search_filter_func = FunctionDeclaration(
    name="get_book_chunks_by_search_filter",
    description="Get the book chunks filtered by search terms",
    # Function parameters are specified in OpenAPI JSON schema format
    parameters={
        "type": "object",
        "properties": {
            "search_filter": {"type": "string", "description": "The search text to filter the book chunks by. The search term is compared against chunks base on cosine simialrity"},
        },
        "required": ["search_filter"],
    },
)
def get_book_chunks_by_search_filter(search_filter, collection, embed_func):

    query_embedding = embed_func(search_filter)

    # Query based on embedding value 
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=10
    )
    return "\n".join(results["documents"][0])

# Define all functions available to the cheese expert
cheese_expert_tool = Tool(function_declarations=[get_book_chunks_by_author_func,get_book_chunks_by_search_filter_func])


def execute_function_calls(function_calls,collection, embed_func):
    parts = []
    for function_call in function_calls:
        print("Function:",function_call.name)
        if function_call.name == "get_book_chunks_by_author":
            print("Calling function with args:", function_call.args["author"], function_call.args["search_filter"])
            response = get_book_chunks_by_author(function_call.args["author"], function_call.args["search_filter"],collection, embed_func)
            print("Response:", response)
            #function_responses.append({"function_name":function_call.name, "response": response})
            parts.append(
					Part.from_function_response(
						name=function_call.name,
						response={
							"content": response,
						},
					),
			)

    
    return parts
