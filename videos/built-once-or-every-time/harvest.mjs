// Bed harvest. ccMixter's query API, share-alike EXCLUDED at harvest time: a BY-SA bed
// arguably obliges the episode itself to carry BY-SA, which is EP23's one open problem.
const TAGS = ["ambient","minimal","piano","cinematic","documentary","downtempo","instrumental","electronica"];
const seen = new Map();
for (const t of TAGS) {
  const u = `https://ccmixter.org/api/query?f=json&limit=60&tags=${t}&lic=open&sinced=2 years ago`;
  try {
    const r = await fetch(u, { headers: { "User-Agent": "Mozilla/5.0" } });
    const j = await r.json();
    for (const x of j) {
      const lic = (x.license_name || "") + " " + (x.license_url || "");
      if (/sa\/|share|sampling/i.test(lic)) continue;
      const f = (x.files || []).find((f) => /\.mp3$/i.test(f.file_name || ""));
      if (!f) continue;
      const secs = +(f.file_format_info?.["duration-hh:mm:ss"] || "0:00").split(":").reduce((a,b)=>a*60+ +b,0);
      if (secs < 230 || secs > 900) continue;
      seen.set(x.upload_id, { id: x.upload_id, name: x.upload_name, by: x.user_name,
        lic: x.license_name, url: f.download_url, page: x.file_page_url, secs });
    }
  } catch (e) { console.log("tag", t, "failed", e.message); }
}
console.log(JSON.stringify([...seen.values()], null, 0));
