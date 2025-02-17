# maiar-rag

The purpose of this repository is to illustrate a simple call to an external resource.
In practice this is usually referred to a Retrieval Augmented Generation.

## Running the example

First create a `.env` file and add the following

```
OPENAI_API_KEY=
```

Then to build it run:

```
pnpm install
pnpm start
```

## Examples:

### Without the RAG plugin:

Input: "What is the last name of Socrates"

Request Example:

```
curl -X POST http://localhost:3000/message \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the last name of Socrates", "user": "test-user"}'
"Socrates does not have a last name in historical records. He is simply known as Socrates, the classical Greek philosopher."%
```

Output: "Socrates does not have a last name in historical records. He is simply known as Socrates, the classical Greek philosopher."%

### With the RAG plugin:

So we initialize the `runtime` with our new RAG plugin and provide it the following baseline information:

```
new PluginRag({
  name: "EXTERNAL_USER_SYSTEM",
  description:
    "Returns the full names of all users in the external system.",
  handler: mockExternalCall,
}),
```

Input: "What is the last name of Socrates"

Request Example:
curl -X POST http://localhost:3000/message \
 -H "Content-Type: application/json" \
 -d '{"message": "What is the last name of Socrates", "user": "test-user"}'
"The last name of Socrates in the EXTERNAL_SYSTEM is Potato."%

```

Output: "The last name of Socrates in the EXTERNAL_SYSTEM is Potato."%
```
