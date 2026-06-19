import re

with open('css/style.css', 'r') as f:
    css = f.read()

# Soften specific harsh shadows
css = css.replace('rgba(0,0,0,.4)', 'rgba(0,0,0,.04)')
css = css.replace('rgba(0,0,0,.5)', 'rgba(0,0,0,.05)')
css = css.replace('rgba(0,0,0,0.5)', 'rgba(0,0,0,0.05)')
css = css.replace('rgba(0,0,0,0.4)', 'rgba(0,0,0,0.04)')
css = css.replace('rgba(0,0,0,.3)', 'rgba(0,0,0,.03)')
css = css.replace('rgba(0,0,0,.2)', 'rgba(0,0,0,.02)')
css = css.replace('rgba(0,0,0,0.2)', 'rgba(0,0,0,0.02)')

# The modal might still have dark borders or shadows
css = css.replace('border:1px solid var(--border-mid);border-top-color:rgba(255,255,255,.12);', 'border:1px solid var(--border-mid);border-top-color:rgba(255,255,255,1);')

# Make pairing slots not use black gradients
css = css.replace('linear-gradient(180deg, #1a1a1a 0%, #111 100%)', 'linear-gradient(180deg, #f7f6f2 0%, #f0eee9 100%)')
css = css.replace('linear-gradient(180deg, #111 0%, #080808 100%)', 'linear-gradient(180deg, #ffffff 0%, #f7f6f2 100%)')

with open('css/style.css', 'w') as f:
    f.write(css)

print("Shadows softened!")
