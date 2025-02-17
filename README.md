# maiar-rag

The purpose of this repository is to illustrate a simple call to an external resource.
In practice this is usually referred to a Retrieval Augmented Generation.

### Running the example

First create a `.env` file and add the following

```
OPENAI_API_KEY=
```

Then to build it run:

```
pnpm install
pnpm start
```

Examples:

Without the RAG plugin:

```
curl -X POST http://localhost:3000/message \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the last name of Socrates", "user": "test-user"}'
"Socrates does not have a last name in historical records. He is simply known as Socrates, the classical Greek philosopher."%
```

With the RAG plugin:

```
curl -X POST http://localhost:3000/message \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the last name of Socrates", "user": "test-user"}'
"The last name of Socrates in the EXTERNAL_SYSTEM is Potato."%
```
