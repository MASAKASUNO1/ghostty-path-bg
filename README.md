# ghostty-path-bg


https://github.com/user-attachments/assets/28d9a5a6-a82c-4da5-b39d-c8d9bf58036f


Project-aware background colors for Ghostty.

This is a tiny zsh integration that changes Ghostty's background color when you
`cd` between projects. It hashes the project directory name and picks from a
curated dark color table, so each project gets a stable, readable background.

## Install

```sh
git clone https://github.com/masao/ghostty-path-bg.git
cd ghostty-path-bg
./install.sh
source ~/.zshrc
```

## How It Works

- If the directory is under `~/playground/<project>`, `<project>` is used as the
  color key.
- Otherwise, if the directory is inside a Git repository, the repository root
  directory name is used.
- Otherwise, the current directory name is used.
- The key is hashed with `cksum`, then mapped into a dark color palette.
- The color is sent to Ghostty with OSC 11.

## Manual Install

```sh
mkdir -p ~/.config/zsh
cp ghostty-path-bg.zsh ~/.config/zsh/ghostty-path-bg.zsh
printf '\n%s\n' '# Ghostty path-based background color' >> ~/.zshrc
printf '%s\n' '[ -r "$HOME/.config/zsh/ghostty-path-bg.zsh" ] && source "$HOME/.config/zsh/ghostty-path-bg.zsh"' >> ~/.zshrc
source ~/.zshrc
```

## Customize

Edit `~/.config/zsh/ghostty-path-bg.zsh`.

- Change `_ghostty_path_bg_key` to use a different project-detection rule.
- Change the `colors=(...)` table to adjust the palette.
- Run `ghostty_bg_reset` to ask Ghostty to reset the background color.

## Requirements

- Ghostty
- zsh
- `cksum`, `awk`, and `git` on `PATH`

The script is no-op outside Ghostty because it checks `TERM_PROGRAM=ghostty`.
