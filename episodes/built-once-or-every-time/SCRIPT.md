# EP 29 — narration

Directive register: the narrator knows the thing and hands it over in order.
One clause per sentence. Definition, then consequence. No hedges.

Units are respelled phonetically for the TTS: `H T M L`, `C S S`, `S S G`,
`C S R`, `J S`, `K B`. Numbers that must land exactly are written as words.

Frames `title`, `slate1`, `slate2`, `slate3` and `slate4` are silent holds and
carry no line — the bed lifts under them, which is what makes them read as
section changes.

```
NN id | text
```

01 open      | Ask two real websites for their front page. Same phone, same network, same minute. Now read what actually came back.
02 bytes     | Jekyll's page arrives with its words already inside it. Excalidraw's arrives with an empty div. Both are correct. They were built at different times.
03 template  | That empty div is not sloppiness. It is the Create React App template, shipped to production unchanged. Read the comment its own authors left in it.
04 etag      | Now read the ETag on the static page. The first half is a build timestamp. The second half is a byte count. When it was built, and how big it came out. Nothing in there is about you.
05 when      | A page has only three moments it can be built in. Build time, once, on a machine you own. Request time, on a server. Run time, on the visitor's device.
06 jekyll08  | None of this is new. In two thousand and eight Tom Preston-Werner shipped Jekyll to spit out a complete static website. Static rendering happens at build time. That is the entire definition.
07 bundle    | Now count the bytes. The static page sent ten kilobytes of H T M L, and three and a half kilobytes of JavaScript. That JavaScript is polyfills for Internet Explorer eight. It renders nothing.
08 weight    | The client-rendered page sent less H T M L than the static one did. Two point four kilobytes against three point four. And then eight hundred and fifty-five kilobytes of JavaScript.
09 strip     | Same throttling. Cold cache. First visit. At two point seven seconds the static page is finished and readable. The other one is still white.
10 paint     | First contentful paint: one point seven seconds against six point eight. Now look at where that six point eight lands. It lands on the load event. Nothing appears until everything has arrived.
11 turn      | So delete the client rendering. No. Read what Excalidraw prints on its own start screen. Your drawings are saved in your browser's storage.
12 exist     | At build time your drawing does not exist. It has never been on their server. No build step could have put it in that div, because there was nothing to put.
13 rule      | So stop asking which one is faster. Ask whether this page's content exists before the request. If it does, build it once and hand everyone the same bytes.
14 mistake   | The real mistake is shipping an empty div for a page that could have been built in June. Docs. Blogs. Marketing pages. Content that is identical for everyone, made from scratch for every single person.
15 end       | So: build what everyone shares. Render on the device only what only that device knows. Next episode: subagents.
