import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Brian Gaines — Cybersecurity Portfolio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ width:'1200px', height:'630px', background:'#1A1A1A', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'72px 80px', fontFamily:'sans-serif', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(to bottom, rgba(250,248,243,0.06) 1px, transparent 1px), linear-gradient(to right, rgba(250,248,243,0.06) 1px, transparent 1px)', backgroundSize:'56px 56px' }} />
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 80% at 30% 50%, transparent 20%, #1A1A1A 75%)' }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', position:'relative' }}>
          <span style={{ fontSize:'18px', fontWeight:500, color:'rgba(250,248,243,0.4)' }}>briangaines.io</span>
          <span style={{ fontSize:'14px', fontWeight:500, color:'rgba(250,248,243,0.25)', border:'1px solid rgba(250,248,243,0.15)', padding:'6px 16px', borderRadius:'4px' }}>Cybersecurity Portfolio</span>
        </div>
        <div style={{ display:'flex', flexDirection:'column', position:'relative' }}>
          <div style={{ fontSize:'96px', fontWeight:700, letterSpacing:'-0.04em', lineHeight:0.95, color:'#FAF8F3', marginBottom:'28px' }}>Brian Gaines</div>
          <div style={{ fontSize:'22px', fontWeight:300, color:'rgba(250,248,243,0.5)', maxWidth:'680px', lineHeight:1.5 }}>Threat detection is my job. Breaking my own network is my hobby.</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'24px', position:'relative' }}>
          <div style={{ flex:1, height:'1px', background:'rgba(250,248,243,0.12)' }} />
          <span style={{ fontSize:'13px', fontWeight:500, letterSpacing:'0.2em', color:'rgba(250,248,243,0.2)' }}>| BG |</span>
        </div>
      </div>
    ),
    { ...size }
  );
}