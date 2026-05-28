# ghostty-bg (`gbg`)

Per-directory background colors for Ghostty — one command per project.

https://github.com/user-attachments/assets/28d9a5a6-a82c-4da5-b39d-c8d9bf58036f

`gbg` is a tiny, zero-dependency Node CLI. It sends the standard
[OSC 11](https://invisible-island.net/xterm/ctlseqs/ctlseqs.html) escape
sequence to recolor the current window instantly, and remembers the color per
directory. With the shell hook installed, `cd` into a directory and its color
is applied automatically — no Ghostty fork or special API required.

## Install

```sh
npm install -g ghostty-bg
```

Or run it without installing:

```sh
npx ghostty-bg --color dracula
```

## Usage

```sh
gbg                     # random color, remembered for this directory
gbg --color dracula     # a named theme
gbg --color "#1a2b3c"   # a hex value (#rgb or #rrggbb)
gbg teal                # shorthand for --color
gbg --no-save tomato    # current window only, not remembered
gbg --reset             # forget this directory's color, reset background
gbg --list              # list available color names
gbg shell-init          # print the zsh cd hook
gbg --help              # show help
gbg --version           # show version
```

Short flags: `-c` (color), `-n` (no-save), `-r` (reset), `-l` (list),
`-h` (help), `-v` (version).

## Colors

`--color` accepts three kinds of values:

- **Named themes** — `dracula`, `nord`, `gruvbox`, `tokyonight`,
  `catppuccin`, `solarized`, `github-dark`, and ~40 more. Run `gbg --list`.
- **CSS color names** — `red`, `teal`, `midnightblue`, `rebeccapurple`, ...
- **Hex** — `#rgb` or `#rrggbb`, with or without the leading `#`.

Running `gbg` with no arguments picks a random color from a curated palette of
dark, readable backgrounds.

## Per-directory colors

By default `gbg` does two things:

1. Recolors the **current window** immediately via OSC 11.
2. Remembers the color for the **current directory**.

To make `cd` apply the remembered color automatically, add the hook to your
shell:

```sh
echo 'eval "$(gbg shell-init)"' >> ~/.zshrc
```

After that:

- `cd` into a remembered directory → its color is applied.
- `cd` anywhere else → the background returns to your theme default.
- `gbg --no-save` applies to the current window without remembering it.
- `gbg --reset` forgets the current directory's color.

The hook is plain zsh and reads a small `paths` file with `awk`, so it adds no
Node startup cost on `cd`. Colors are matched by exact directory.

## How It Works

`gbg` writes `ESC ] 11 ; <color> BEL` to the terminal to set the background and
`ESC ] 111 BEL` to reset it. Remembered colors live in
`${XDG_CONFIG_HOME:-~/.config}/gbg/paths` as `<dir><TAB><#hex>` lines.

## Requirements

- Node.js >= 18
- A terminal that supports OSC 11 (Ghostty, iTerm2, most modern terminals)
