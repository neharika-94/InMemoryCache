# In-Memory Cache
Your challenge: to implement an [in-memory cache](https://en.wikipedia.org/wiki/Cache_(computing)) in the spirit of
[Redis](https://redis.io) or [Memcached](https://memcached.org).

As its name implies, the in-memory cache is a program which maintains a dictionary of variables in RAM. When the program
exits, all variables stored in the dictionary are lost.

Please implement your cache as a [Node.js](https://nodejs.org) program. Vanilla JavaScript is great, but if you prefer to use ES6 features
or TypeScript, that's fine as well. We want to see _your_ code, so please restrict yourself from using external
dependencies.

## Input and output interface
Clients use _commands_ to interact with an in-memory cache.

Most production-grade caches employ a custom TCP protocol to interface with a wide variety of client programs. To keep
things simple, your cache should accept commands from standard input and print results to standard output.

Commands will be fed to your program one at a time, each on its own line. Your cache should print each result on its own
line; every line of output should conclude with the newline character (`\n`).

## Data commands
Clients use _data commands_ to manipulate and observe the state of the cache.

Your cache should accept the followin'g data commands:

| Command | Example | Purpose | Tips |
|---------|---------|---------|------|
| SET _key_ _value_ | `SET foo bar` | Set the variable _key_ to _value_. | Neither _key_ nor _value_ will contain spaces. |
| GET _key_ | `GET foo` | Print the value associated to _key_. | Print the literal string `NULL` when _key_ is not set. |
| UNSET _key_ | `UNSET foo` | Remove _key_ (and its associated value) from the cache. | |
| NUMEQUALTO _value_ | `NUMEQUALTO bar` | Print the number of variables that are currently set to _value_. | Print `0` if no variables are set to _value_. |
| END | `END` | Exit the program. | |

### Example data command sequences
| Input | Output |
|-------|--------|
| `SET foo 10` | |
| `GET foo` | `10` |
| `UNSET foo` | |
| `GET foo` | `NULL` |
| `END` | |

| Input | Output |
|-------|--------|
| `SET a 10` | |
| `SET b 10` | |
| `NUMEQUALTO 10` | `2` |
| `NUMEQUALTO 20` | `0` |
| `SET b 20` | |
| `NUMEQUALTO 10` | `1` |
| `NUMEQUALTO 20` | `1` |
| `NUMEQUALTO 30` | `0` |
| `END` | |

## Transaction commands
Clients use _transaction commands_ to execute two or more data commands
[atomically](https://en.wikipedia.org/wiki/Atomicity_(database_systems)) by grouping them as a
_[transaction block](https://en.wikipedia.org/wiki/Database_transaction)_.

Your cache should accept the following transaction commands:

| Command | Purpose | Tips |
|---------|---------|------|
| BEGIN | Open a new transaction block. | Transaction blocks can be nested: a `BEGIN` can be issued within an existing block. |
| ROLLBACK | Undo all of the data commands issued within the most recent transaction block and close that block. | Print `NO TRANSACTION` if no transaction is in progress. |
| COMMIT | Close _all_ open transaction blocks, permanently applying all data commands made within them. | Print `NO TRANSACTION` if no transaction is in progress. |

Any data command executed outside of a transaction block should be committed immediately.

### Example transaction command sequences
| Input | Output |
|-------|--------|
| `GET a` | `NULL` |
| `BEGIN` | |
| `SET a 10` | |
| `GET a` | `10` |
| `BEGIN` | |
| `SET a 20` | |
| `GET a` | `20` |
| `ROLLBACK` | |
| `GET a` | `10` |
| `ROLLBACK` | |
| `GET a` | `NULL` |
| `END` | |

| Input | Output |
|-------|--------|
| `BEGIN` | |
| `SET a 30` | |
| `BEGIN` | |
| `SET a 40` | |
| `COMMIT` | |
| `GET a` | `40` |
| `ROLLBACK` | `NO TRANSACTION` |
| `COMMIT` | `NO TRANSACTION` |
| `END` | |

| Input | Output |
|-------|--------|
| `SET a 50` | |
| `BEGIN` | |
| `GET a ` | `50` |
| `BEGIN` | |
| `SET a 60` | |
| `BEGIN` | |
| `UNSET a` | |
| `GET a`| `NULL` |
| `ROLLBACK` | |
| `GET a` | `60` |
| `COMMIT` | |
| `GET a` | `60` |
| `END` | |

| Input | Output |
|-------|--------|
| `SET a 10` | |
| `BEGIN` | |
| `NUMEQUALTO 10` | `1` |
| `BEGIN` | |
| `UNSET a` | |
| `NUMEQUALTO 10` | `0` |
| `ROLLBACK` | |
| `NUMEQUALTO 10` | `1` |
| `COMMIT` | |
| `END` | |

| Input | Output |
|-------|--------|
| `SET a 10` | |
| `BEGIN` | |
| `NUMEQUALTO 10` | `1` |
| `BEGIN` | |
| `UNSET a` | |
| `NUMEQUALTO 10` | `0` |
| `ROLLBACK` | |
| `NUMEQUALTO 10` | `1` |
| `COMMIT` | |
| `END` | |

## Evaluation criteria
### Correctness
Your cache should adhere to the specification described by each [data](#data-commands) and
[transaction](#transaction-commands) command.

> Confirm your cache adheres to the spec by manually invoking every sample data and transaction command sequence. For
> each input, does your cache print the expected output?

### Documentation
Great software is useless without quality documentation. Your submission should include a `README` explaining the steps
required to build and invoke your cache.

Good documentation makes no assumptions about the user's familiarity with the project or their computing environment.
All prerequisites and requirements should be spelled out.

Of course, good documentation should employ proper grammar, punctuation, and spelling.

> Consider asking a friend to "guinea pig" your documentation. Can they get your cache up and running without consulting
> you for help?

### Architecture
Your cache's implementation should exude a clean, logical design. Abstractions and encapsulations, if present, should
solve the problem at hand without introducing unnecessary complexity.

> Plan your cache's architecture _before_ coding. A few minutes diagramming solutions _now_ can prevent hours of rework
> _later_.

### Style
Your cache's implementation should be pleasing to read. We appreciate descriptive identifier names and consistent
formatting.

### Performance
The `GET`, `NUMEQUALTO`, `SET`, and `UNSET` commands should operate with an average-case time complexity of _O(log v)_
or better (where _v_ is the total number of variables stored in the cache). The runtime of these commands should _not_
depend on the number of open transactions.

The `BEGIN`, `COMMIT`, and `ROLLBACK` commands should operate with a time and space complexity of _O(u)_, where _u_ is
the number of variables manipulated within the transaction.

## What happens next?
Once you're satisfied with your submission, please send a link to your repository to your interviewer via email. We'll
review your work and follow up within one business day.

Thanks again for your interest. Now it's time to _Get Moven_!
