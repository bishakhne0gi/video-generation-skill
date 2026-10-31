# EP 28 — narration

Directive register: the narrator knows the thing and hands it to you in order.
One clause per sentence. Definition, then consequence. No hedges.

Units are respelled phonetically because Kokoro reads initialisms ambiguously —
`gRPC` becomes `G R P C`, `HTTP/2` becomes `H T T P two`, `URL` becomes `U R L`.
Frames 02 (title), 03 / 07 / 10 (the edition slates) are silent holds.

Format: `NN id | text`

01 open      | Read this line. It looks like an ordinary function call. It is not one. It crossed a network, and the network gets a vote.
02 promise   | Nineteen eighty four. Xerox PARC ships R P C with one stated purpose: make distributed computation easy. Make a remote call look local.
03 tableone  | Then they measured it. The same call, made locally, took nine microseconds. Made remotely, one thousand and ninety seven. The abstraction leaked in the paper that proposed it.
04 notimeout | They also refused to add a timeout. Their reasoning: local procedure calls do not have one. Hold on to that. It gets overturned.
05 four      | Ten years later, four engineers at Sun published the rebuttal. Local and remote differ in four ways. The fourth one is the problem.
06 indist    | Partial failure. When a call does not come back, you cannot tell whether the link died or the server did. Watch both failures. The caller sees the same thing.
07 wire      | Twenty fifteen. Google open sources G R P C. Your method name becomes a U R L path. Your message becomes five bytes of header, then a payload.
08 deadline  | Every request carries its deadline in the headers. That is nineteen eighty four's rule, reversed. A remote call must now declare how long it will wait.
09 verdicts  | Here is the strange part. A failed G R P C call still returns two hundred O K. The real verdict rides in the trailers, after the body.
10 codes      | Seventeen status codes, and sixteen are ways to fail. Two of those are confessions. Unavailable means try again. Deadline exceeded means it may have worked anyway.
11 streams   | A function returns once. A stream does not have to. G R P C gives you four shapes: one to one, one to many, many to one, and both at once.
12 browser   | Now the catch. Browsers cannot speak this. The spec said so in twenty sixteen, and predicted the problem would be gone in two years.
13 end       | So: put a deadline on every call. Treat unavailable as unknown, not failed. Reach for Connect when a browser is involved. Next episode: subagents.
