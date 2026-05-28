# ghostty-bg (`gbg`)

Change your terminal background color with one command.

https://github.com/user-attachments/assets/28d9a5a6-a82c-4da5-b39d-c8d9bf58036f

`gbg` is a tiny, zero-dependency Node CLI. It sends the standard
[OSC 11](https://invisible-island.net/xterm/ctlseqs/ctlseqs.html) escape
sequence to recolor the current window instantly, and saves the color to
Ghostty's config so it sticks across new windows and restarts — no Ghostty fork
or special API required.

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
gbg --no-save tomato    # current window only, don't persist
gbg --reset             # clear the color (window + saved config)
gbg --list              # list available color names
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

## Persistence

By default `gbg` does two things:

1. Recolors the **current window** immediately via OSC 11.
2. Saves the color so it **survives new windows and restarts**.

For persistence on Ghostty, `gbg` writes `background = <color>` to a dedicated
`gbg.conf` in your Ghostty config directory and adds a single
`config-file = .../gbg.conf` line to your main `config` (only that one line is
ever added — the color itself lives only in `gbg.conf`).

- Already-open windows update on the spot (OSC 11). Other already-open windows
  pick it up after a Ghostty config reload.
- New windows and restarts read it from the config.
- `gbg --no-save` skips step 2 (current window only).
- `gbg --reset` clears the saved color and returns to your theme default.

## How It Works

`gbg` writes `ESC ] 11 ; <color> BEL` to the terminal to set the live
background, and `ESC ] 111 BEL` to reset it. Persistence is a plain
`background = <color>` line in a Ghostty `config-file` include.

## Requirements

- Node.js >= 18
- A terminal that supports OSC 11 (Ghostty, iTerm2, most modern terminals)
