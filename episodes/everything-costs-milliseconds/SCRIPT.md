# EP 26 — Everything Costs Milliseconds
Voice: Kokoro-82M `am_michael`, speed 0.95 (series stand-in; ElevenLabs quota resets 2026-08-31)
Register: DIRECTIVE — instruct, don't observe. One clause per sentence. No hedges.

01 open    | Watch the page. It looks finished at one second. It is not usable until four. That gap is the whole subject.
02 dist    | Performance is not one number. It is a distribution. Measure the seventy-fifth percentile of real users, never your own laptop.
03 lcp     | Largest Contentful Paint times the biggest thing in the viewport. Your budget is two and a half seconds. Usually it is one image.
04 cls     | Cumulative Layout Shift measures content moving after the reader has committed. Reserve the space up front. Every image needs dimensions.
05 inp     | Interaction to Next Paint replaced First Input Delay. It scores every interaction, not the first. Two hundred milliseconds.
06 path    | The critical path is everything that blocks the first paint. Each chained request adds a round trip. Flatten the chain.
07 fonts   | Stylesheets in the head block rendering. So do fonts. Set font display to swap, and preload the one face above the fold.
08 images  | Serve AVIF, size it with srcset, and mark the hero fetch priority high. Lazy load everything below the fold.
09 bundle  | Every import you write ships to every user. Split by route, tree shake the rest, and read the bundle report.
10 render  | Static is fastest. Streaming server rendering is next. Client rendering pays for the framework before it paints anything.
11 hydrate | Rendered is not interactive. Hydration walks the whole tree again on the user's device. Ship islands, not applications.
12 thread  | The main thread runs one job at a time. Any task over fifty milliseconds blocks input. Break it up and yield.
13 paint   | Reading layout after writing it forces a synchronous reflow. Animate transform and opacity only. Those never touch layout.
14 cache   | Hash your filenames and cache them forever. Serve stale while you revalidate. The fastest request is the one never made.
15 third   | Third party tags run with your permission and your budget. Audit them every quarter. Most of them outlived the campaign.
16 field   | Ship real user monitoring, then gate your pull requests on it. You cannot defend a number you never watch.
17 end     | Everything costs milliseconds. Spend them where the user is looking. Next episode: subagents.
