import re

with open('css/style.css', 'r') as f:
    css = f.read()

# 1. Replace tokens
old_tokens = """:root {
  --bg-base: #000000;
  --bg-panel: #0a0a0a;
  --bg-surface: #111111;
  --bg-raised: #1a1a1a;
  --bg-inset: #050505;
  --bg-modal: rgba(0, 0, 0, 0.88);

  --accent: #4fc3f7;
  --accent-dim: rgba(79, 195, 247, 0.15);
  --accent-glow: rgba(79, 195, 247, 0.35);
  --accent2: #e8a87c;
  --accent2-dim: rgba(232, 168, 124, 0.12);

  --success: #66bb6a;
  --danger: #ef5350;
  --warning: #ffa726;

  --text: #d5d3cf;
  --text-dim: #8a8892;
  --text-muted: #5a5866;

  --bevel-light: rgba(255,255,255,0.07);
  --bevel-dark: rgba(0,0,0,0.35);
  --border: rgba(255,255,255,0.06);
  --border-mid: rgba(255,255,255,0.10);

  /* Skeuomorphic shadow presets */
  --shadow-raised:
    0 1px 0 var(--bevel-light),
    0 2px 4px rgba(0,0,0,0.35),
    0 6px 14px rgba(0,0,0,0.25),
    0 12px 28px rgba(0,0,0,0.18);
  --shadow-pressed:
    inset 0 2px 6px rgba(0,0,0,0.55),
    inset 0 1px 2px rgba(0,0,0,0.35);
  --shadow-inset:
    inset 0 2px 8px rgba(0,0,0,0.55),
    inset 0 1px 2px rgba(0,0,0,0.3),
    0 1px 0 var(--bevel-light);"""

new_tokens = """:root {
  --bg-base: #f7f6f2; /* Soft cream background */
  --bg-panel: #fdfcfb;
  --bg-surface: #ffffff;
  --bg-raised: #ffffff;
  --bg-inset: #edebe4;
  --bg-modal: rgba(255, 255, 255, 0.85);

  /* Pastel accents */
  --accent: #5db3e4;
  --accent-dim: rgba(93, 179, 228, 0.15);
  --accent-glow: rgba(93, 179, 228, 0.4);
  --accent2: #e8a87c;
  --accent2-dim: rgba(232, 168, 124, 0.2);

  --success: #6cc17b;
  --danger: #ef6b68;
  --warning: #ffb74d;

  --text: #323038;
  --text-dim: #605d66;
  --text-muted: #888590;

  --bevel-light: rgba(255, 255, 255, 1);
  --bevel-dark: rgba(0, 0, 0, 0.08);
  --border: rgba(0, 0, 0, 0.05);
  --border-mid: rgba(0, 0, 0, 0.1);

  /* Skeuomorphic shadow presets (Light Mode) */
  --shadow-raised:
    0 1px 0 var(--bevel-light),
    0 2px 4px rgba(0,0,0,0.04),
    0 6px 12px rgba(0,0,0,0.04),
    0 12px 24px rgba(0,0,0,0.05);
  --shadow-pressed:
    inset 0 2px 4px rgba(0,0,0,0.06),
    inset 0 1px 2px rgba(0,0,0,0.04);
  --shadow-inset:
    inset 0 2px 6px rgba(0,0,0,0.06),
    inset 0 1px 2px rgba(0,0,0,0.03),
    0 1px 0 rgba(255,255,255,0.8);"""

css = css.replace(old_tokens, new_tokens)

# Replace dark colors globally in specific contexts

# Backgrounds
css = css.replace('background:#000', 'background:var(--bg-base)')
css = css.replace('background:#080808', 'background:var(--bg-inset)')
# Noise
css = css.replace("mix-blend-mode:overlay;", "mix-blend-mode:multiply;opacity:0.04;")
# Glow
css = css.replace('radial-gradient(ellipse,rgba(79,195,247,.03) 0%,transparent 70%)', 'radial-gradient(ellipse,rgba(93,179,228,.15) 0%,transparent 70%)')

# Scrollbar
css = css.replace('background:#222', 'background:#d1cfc9')
css = css.replace('background:#35355a', 'background:#a8a6a1')

# Linear Gradients for components
# Header
css = css.replace('linear-gradient(180deg,#111 0%,#080808 100%)', 'linear-gradient(180deg,#ffffff 0%,#f7f6f2 100%)')
# Button Skeuo Base
css = css.replace('linear-gradient(180deg,#222 0%,#1a1a1a 50%,#141414 100%)', 'linear-gradient(180deg,#ffffff 0%,#fdfcfb 50%,#f3f1eb 100%)')
css = css.replace('linear-gradient(180deg,#2a2a2a 0%,#222 50%,#1a1a1a 100%)', 'linear-gradient(180deg,#ffffff 0%,#ffffff 50%,#fdfcfb 100%)')
css = css.replace('linear-gradient(180deg,#141414 0%,#1a1a1a 100%)', 'linear-gradient(180deg,#f3f1eb 0%,#f7f6f2 100%)')

# Button Primary (keep vibrant but maybe slightly pastel-friendly)
css = css.replace('linear-gradient(180deg,#2196f3 0%,#1976d2 50%,#1565c0 100%)', 'linear-gradient(180deg,#6bc2ed 0%,#5db3e4 50%,#4fa2d1 100%)')
css = css.replace('linear-gradient(180deg,#42a5f5 0%,#2196f3 50%,#1976d2 100%)', 'linear-gradient(180deg,#82d0f5 0%,#6bc2ed 50%,#5db3e4 100%)')
css = css.replace('linear-gradient(180deg,#1565c0 0%,#1976d2 100%)', 'linear-gradient(180deg,#4fa2d1 0%,#5db3e4 100%)')
css = css.replace('rgba(25,118,210,.4)', 'rgba(93,179,228,.4)')
css = css.replace('rgba(25,118,210,.2)', 'rgba(93,179,228,.2)')

# Button Danger
css = css.replace('linear-gradient(180deg,#e53935 0%,#c62828 50%,#b71c1c 100%)', 'linear-gradient(180deg,#f27977 0%,#ef6b68 50%,#e05c59 100%)')
css = css.replace('linear-gradient(180deg,#b71c1c 0%,#c62828 100%)', 'linear-gradient(180deg,#e05c59 0%,#ef6b68 100%)')

# View tabs active
css = css.replace('linear-gradient(180deg,#1e1e1e 0%,#161616 100%)', 'linear-gradient(180deg,#ffffff 0%,#fdfcfb 100%)')

# Cards & Panels
css = css.replace('linear-gradient(180deg,#141414 0%,#0e0e0e 100%)', 'linear-gradient(180deg,#ffffff 0%,#fdfcfb 100%)')
css = css.replace('linear-gradient(180deg,#1a1a1a 0%,#111 100%)', 'linear-gradient(180deg,#ffffff 0%,#fdfcfb 100%)')
css = css.replace('linear-gradient(180deg,#0e0e0e 0%,#080808 100%)', 'linear-gradient(180deg,#fdfcfb 0%,#f7f6f2 100%)')

# Hover tiles
css = css.replace('linear-gradient(180deg,#282828 0%,#1e1e1e 100%)', 'linear-gradient(180deg,#ffffff 0%,#ffffff 100%)')

# Input borders
css = css.replace('border:1px solid rgba(0,0,0,.4)', 'border:1px solid rgba(0,0,0,.1)')
css = css.replace('border-top-color:rgba(0,0,0,.55)', 'border-top-color:rgba(0,0,0,.15)')
css = css.replace('box-shadow:0 2px 4px rgba(0,0,0,.35)', 'box-shadow:0 2px 4px rgba(0,0,0,.04)')
css = css.replace('box-shadow:0 4px 10px rgba(0,0,0,.2)', 'box-shadow:0 4px 10px rgba(0,0,0,.03)')
css = css.replace('rgba(255,255,255,.08)', 'rgba(255,255,255,1)')
css = css.replace('rgba(255,255,255,.12)', 'rgba(255,255,255,1)')
css = css.replace('rgba(0,0,0,.3)', 'rgba(0,0,0,.08)')

# Fix Header Text Shadow
css = css.replace('background:linear-gradient(180deg,#fff 20%,#94a3b8 100%);\n  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;\n  text-shadow:none;', 'color:var(--text); text-shadow:0 1px 0 rgba(255,255,255,0.8);')

# Footer
css = css.replace('linear-gradient(180deg,#080808 0%,#000 100%)', 'linear-gradient(180deg,#f7f6f2 0%,#f0eee9 100%)')

# Pairing Slot logic
css = css.replace('border: 2px dashed rgba(255,255,255,0.15)', 'border: 2px dashed rgba(0,0,0,0.15)')
css = css.replace('box-shadow: inset 0 4px 12px rgba(0,0,0,0.5)', 'box-shadow: inset 0 4px 12px rgba(0,0,0,0.06)')

# Title text gradient removal
css = re.sub(r'background:linear-gradient\(180deg,#fff 20%,#94a3b8 100%\);\s*-webkit-background-clip:text;\s*-webkit-text-fill-color:transparent;\s*background-clip:text;\s*text-shadow:none;', 'color:var(--text);', css)

with open('css/style.css', 'w') as f:
    f.write(css)

print("CSS updated successfully!")
