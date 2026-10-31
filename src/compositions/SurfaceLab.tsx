// Author: Bishakh
//
// THE SURFACE LAB — the ribbon field, the hero card, the 3D marquee and the box
// pattern, side by side, in the episode's palette.
//
// Design them here before wiring them into beats. Two things you can only judge
// by scrubbing this:
//
//   The FIELD's wave clock. At `waveSpeed` much above ~1.6 the bands stop
//   swaying and start crawling, and a crawling background pulls the eye off
//   whatever is in front of it. 1.2 is the source's number and it is right.
//
//   The MARQUEE's column durations. Give two columns the same duration and the
//   whole block visibly moves as one slab; the alternating directions only read
//   as a firehose when the periods disagree.
//
// Never rendered as output.

import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { RibbonField, RibbonBand, BRAND_STOPS, GG_STOPS, MESH_STOPS, MESH_SOFT_STOPS } from "../lib/gradient";
import {
  HeroCard,
  BigFigure,
  TickMeter,
  BarRows,
  Marquee3D,
  EventCard,
  ChapterBox,
  HighlightBox,
  Pill,
  display,
  tabular,
  microCap,
} from "../lib/cards";
import { buildPalette } from "../theme";
import { useK } from "../lib/anim";
import { SANS } from "../fonts";

export const SURFACE_SECONDS = 24;

const PAL = buildPalette("stripe-mesh");

const EVENTS = [
  "payment_intent.succeeded",
  "charge.refunded",
  "invoice.paid",
  "customer.subscription.created",
  "checkout.session.completed",
  "payment_method.attached",
  "invoice.payment_failed",
  "customer.updated",
  "charge.dispute.created",
];

const col = (from: number) =>
  EVENTS.map((t, i) => (
    <EventCard
      key={t}
      pal={PAL}
      type={t}
      id={`evt_1P${(from + i * 37).toString(36).toUpperCase().padStart(6, "0")}`}
      note="delivered · 200"
    />
  ));

export const SurfaceLab: React.FC = () => (
  <AbsoluteFill style={{ background: PAL.bg, fontFeatureSettings: '"ss01"' }}>
    {/* 1 — the BRAND field, full bleed, with the hero card framed on it.
        `GG_STOPS` is imported and deliberately not used here: it is the
        reference specimen for the machine, not a palette to ship. Swap it in
        for a frame if you want to see the difference — it is stark, and it is
        the whole argument for keeping the two separate. */}
    <Sequence from={0} durationInFrames={6 * 30} name="brand field + hero card">
      <AbsoluteFill>
        <RibbonField stops={BRAND_STOPS} />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <HeroCard pal={PAL} title="Delivery confidence" w={640} pips={[4, 1]} at={6}>
            <BigFigure value={94} suffix="%" at={16} size={128} />
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 300,
                fontSize: 22,
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.62)",
                marginTop: 18,
                maxWidth: 420,
              }}
            >
              Share of events acknowledged with a 2xx on the first attempt, across
              the last ten thousand deliveries.
            </div>
          </HeroCard>
        </AbsoluteFill>
      </AbsoluteFill>
    </Sequence>

    {/* 2 — the mesh as a header band over canvas, DESIGN.md's real construction */}
    <Sequence from={6 * 30} durationInFrames={6 * 30} name="mesh band + cards">
      <AbsoluteFill style={{ background: PAL.bg }}>
        <RibbonBand stops={MESH_SOFT_STOPS} height={0.44} fade={0.4} soften={9} />
        <Band />
      </AbsoluteFill>
    </Sequence>

    {/* 3 — the 3D marquee */}
    <Sequence from={12 * 30} durationInFrames={6 * 30} name="3D marquee">
      <AbsoluteFill style={{ background: PAL.bgDeep }}>
        <Marquee3D
          pal={PAL}
          fadeTo={PAL.bgDeep}
          itemHeight={112}
          colWidth={340}
          columns={[
            { items: col(11), duration: 27 },
            { items: col(200), reverse: true, duration: 31 },
            { items: col(400), duration: 24 },
            { items: col(600), reverse: true, duration: 34 },
          ]}
        />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <ChapterBox
            pal={PAL}
            n="01"
            title="Two hundred event types"
            sub="Subscribe to the four you handle. Everything else is load you agreed to carry."
            at={10}
          />
        </AbsoluteFill>
      </AbsoluteFill>
    </Sequence>

    {/* 4 — the box pattern, inline */}
    <Sequence from={18 * 30} durationInFrames={6 * 30} name="box pattern">
      <AbsoluteFill style={{ background: PAL.bg, alignItems: "center", justifyContent: "center", gap: 44 }}>
        <RibbonBand stops={MESH_STOPS} height={0.3} fade={0.5} soften={10} />
        <HighlightBox pal={PAL} label="the trap" at={6}>
          <div style={{ ...tabular(30), color: PAL.ink, lineHeight: 1.5 }}>
            {"hmac(whsec, `${t}.${raw_body}`)"}
          </div>
        </HighlightBox>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <Pill pal={PAL} at={20}>verify the signature</Pill>
          <Pill pal={PAL} filled={false} at={26}>then queue the work</Pill>
        </div>
      </AbsoluteFill>
    </Sequence>
  </AbsoluteFill>
);

const Band: React.FC = () => {
  const k = useK();
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 120 * k }}>
      <div style={{ ...display(76 * k, -0.028), color: PAL.ink, textAlign: "center" }}>
        An HTTP request you didn't make
      </div>
      <div
        style={{
          ...microCap(20 * k),
          color: PAL.textMuted,
          marginTop: 26 * k,
        }}
      >
        arriving at a route you own
      </div>
      <div style={{ display: "flex", gap: 26 * k, marginTop: 90 * k }}>
        <HeroCard pal={PAL} tone="light" title="Threat volume" w={520} at={10}>
          <TickMeter
            pal={PAL}
            tone="light"
            value={74}
            at={20}
            rows={[
              ["current", "high"],
              ["value", "74%"],
              ["normal", "30–55%"],
            ]}
          />
        </HeroCard>
        <HeroCard pal={PAL} tone="dark" title="Delivery outcome" w={620} at={16}>
          <BarRows
            pal={PAL}
            at={26}
            suffix="%"
            rows={[
              { label: "first attempt", v: 94 },
              { label: "retried once", v: 4 },
              { label: "dead-lettered", v: 2 },
            ]}
          />
        </HeroCard>
      </div>
    </AbsoluteFill>
  );
};

void GG_STOPS;
