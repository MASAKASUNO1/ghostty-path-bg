#!/usr/bin/env sh
set -eu

config_home="${XDG_CONFIG_HOME:-"$HOME/.config"}"
target_dir="$config_home/zsh"
target_file="$target_dir/ghostty-path-bg.zsh"
zshrc="${ZDOTDIR:-"$HOME"}/.zshrc"
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
source_file="$repo_dir/ghostty-path-bg.zsh"

mkdir -p "$target_dir"
cp "$source_file" "$target_file"

touch "$zshrc"

if ! grep -Fq 'ghostty-path-bg.zsh' "$zshrc"; then
  {
    printf '\n'
    printf '# Ghostty path-based background color\n'
    printf '[ -r "$HOME/.config/zsh/ghostty-path-bg.zsh" ] && source "$HOME/.config/zsh/ghostty-path-bg.zsh"\n'
  } >> "$zshrc"
fi

printf 'Installed %s\n' "$target_file"
printf 'Run this in your current shell to enable it now:\n'
printf '  source %s\n' "$zshrc"
