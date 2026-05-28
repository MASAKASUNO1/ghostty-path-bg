# ghostty-bg (`gbg`)

Change your terminal background color with one command.

https://github.com/user-attachments/assets/28d9a5a6-a82c-4da5-b39d-c8d9bf58036f

`gbg` is a tiny, zero-dependency Node CLI. It sends the standard
[OSC 11](https://invisible-island.net/xterm/ctlseqs/ctlseqs.html) escape
sequence, so it works in Ghostty and most modern terminals — no Ghostty fork
or special API required. The change lasts for the current terminal session.

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
gbg                     # random color from the built-in palette
gbg --color dracula     # a named theme
gbg --color "#1a2b3c"   # a hex value (#rgb or #rrggbb)
gbg teal                # shorthand for --color
gbg --reset             # back to the terminal default
gbg --list              # list available color names
gbg --help              # show help
gbg --version           # show version
```

Short flags: `-c` (color), `-r` (reset), `-l` (list), `-h` (help),
`-v` (version).

## Colors

`--color` accepts three kinds of values:

- **Named themes** — `dracula`, `nord`, `gruvbox`, `tokyonight`,
  `catppuccin`, `solarized`, `github-dark`, and ~40 more. Run `gbg --list`.
- **CSS color names** — `red`, `teal`, `midnightblue`, `rebeccapurple`, ...
- **Hex** — `#rgb` or `#rrggbb`, with or without the leading `#`.

Running `gbg` with no arguments picks a random color from a curated palette of
dark, readable backgrounds.

## How It Works

`gbg` writes `ESC ] 11 ; <color> BEL` to the terminal to set the background,
and `ESC ] 111 BEL` to reset it. That's the entire mechanism.

## Requirements

- Node.js >= 18
- A terminal that supports OSC 11 (Ghostty, iTerm2, most modern terminals)
